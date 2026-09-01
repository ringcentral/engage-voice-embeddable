import {
  injectable,
  optional,
  PortManager,
  RcModule,
  RouterPlugin,
  delegate,
} from '@ringcentral-integration/next-core';

import { EvCallbackTypes } from '../EvClient/enums';
import { EvClient } from '../EvClient';
import { EvCall } from '../EvCall';
import { EvPresence } from '../EvPresence';
import { EvWorkingState } from '../EvWorkingState';
import {
  reconcileReconnectState,
  reconnectActions,
} from '../../utils/reconcileReconnectState';
import type { ReconnectPlan } from '../../utils/reconcileReconnectState';
import type { EvSessionRecoveryOptions } from './EvSessionRecovery.interface';

/** TEMPORARY. Sampling cadence for the read-only socket diagnostic. */
const SOCKET_DIAGNOSTICS_INTERVAL_MS = 15 * 1000;

/**
 * EvSessionRecovery - realigns the client with the server after the Agent SDK
 * re-establishes its WebSocket.
 *
 * The SDK replays queued server messages only up to three minutes back, so
 * after a longer outage the client's view of the agent can be stale in either
 * direction. The Layer 2 reconnect login response carries the server's
 * authoritative view, and this module applies it. Without that step an agent
 * whose network dropped mid-call comes back showing "Engaged" with no call to
 * act on, while the server waits forever for a disposition that can no longer
 * be submitted.
 *
 * A page reload is out of scope here: it always performs a fresh login whose
 * response carries no session state, so reload recovery relies on the
 * persisted activity call id plus the server's PENDING_DISP push instead.
 */
@injectable({
  name: 'EvSessionRecovery',
})
class EvSessionRecovery extends RcModule {
  constructor(
    protected evClient: EvClient,
    protected evCall: EvCall,
    protected evPresence: EvPresence,
    protected evWorkingState: EvWorkingState,
    protected router: RouterPlugin,
    protected portManager: PortManager,
    @optional('EvSessionRecoveryOptions')
    protected options?: EvSessionRecoveryOptions,
  ) {
    super();
    if (this.portManager?.shared) {
      // The SDK, and therefore the login callback, only lives on the main
      // tab, while the session state this module corrects lives on the server.
      this.portManager.onMainTab(() => {
        this._initReconnectListener();
        this._initSocketDiagnostics();
      });
    } else {
      this._initReconnectListener();
      this._initSocketDiagnostics();
    }
  }

  /**
   * TEMPORARY diagnostic. Samples the SDK's socket bookkeeping and logs it.
   *
   * Purely observational: it never touches the socket. The question it answers
   * is whether `lastAlive` advances on a healthy session, because the SDK
   * treats a stale value as "offline" and queues all call control.
   * Remove along with {@link EvClient.getSocketDiagnostics}.
   */
  private _initSocketDiagnostics(): void {
    setInterval(async () => {
      const diagnostics = await this.evClient.getSocketDiagnostics();
      this.logger.info('socket diagnostics~~', diagnostics);
    }, SOCKET_DIAGNOSTICS_INTERVAL_MS);
  }

  private get _dispositionPathPrefix(): string {
    return this.options?.dispositionPathPrefix ?? '/activityCallLog';
  }

  private _initReconnectListener(): void {
    this.evClient.addListener(EvCallbackTypes.LOGIN, (response) => {
      // Only a Layer 2 reconnect response carries the server's session state
      // (is_on_call / active_call_uii / is_pending_disp) into the SDK model,
      // and its arrival is the earliest moment that state exists: OPEN_SOCKET
      // fires before the reconnect login is even sent, and a fresh login
      // response has nothing to reconcile against.
      if (!response?.isReconnect) {
        return;
      }
      void this.recoverSession();
    });
  }

  /**
   * Compare the server's view of the agent with the client's and apply
   * whichever correction the two disagree on.
   */
  @delegate('server')
  async recoverSession(): Promise<ReconnectPlan> {
    const snapshot = await this.evClient.getReconnectSnapshot();
    const plan = reconcileReconnectState({
      snapshot,
      local: {
        activeCallIds: this.evPresence.callIds,
        activityCallId: this.evCall.activityCallId,
        activeCallUii: this.evPresence.currentCallUii,
        isPendingDisposition: this.evWorkingState.isPendingDisposition,
      },
    });
    this.logger.info('recoverSession~~', { snapshot, plan });
    await this._applyPlan(plan);
    return plan;
  }

  private async _applyPlan(plan: ReconnectPlan): Promise<void> {
    switch (plan.action) {
      case reconnectActions.restorePendingDisposition:
        await this.evWorkingState.setIsPendingDisposition(true, plan.callId);
        this._goToDisposition(plan.callId);
        break;
      case reconnectActions.clearPendingDisposition:
        await this.evWorkingState.setIsPendingDisposition(false);
        break;
      case reconnectActions.reloadActiveCall:
        await this.evClient.loadCurrentCall();
        break;
      case reconnectActions.endStaleLocalCall:
        // The SDK synthesises an END-CALL for this case, which drives the
        // normal call-ended path. Only the pointer to the call being worked on
        // has to be cleared here so a stale id cannot outlive the call.
        if (!plan.callId) {
          this.evCall.setActivityCallId('');
        }
        break;
      case reconnectActions.forceClearCall:
        // The SDK already sent the hangup with `cancel_pending_disp` itself
        // while processing this reconnect response, so only the local view
        // has to be brought in line here; a second hangup would be a
        // duplicate request against a session the server just released.
        await this.evWorkingState.setIsPendingDisposition(false);
        this.evCall.setActivityCallId('');
        break;
      default:
        break;
    }
  }

  private _goToDisposition(callId: string): void {
    if (!callId) {
      return;
    }
    this.router.replace(`${this._dispositionPathPrefix}/${callId}/disposition`);
  }

  /**
   * Release an agent the server has parked in pending disposition with no call
   * the client can dispose.
   *
   * The hangup carries `cancel_pending_disp`, which is the only way to clear
   * that state without an administrator, so it is also the recovery the UI
   * offers when everything else has failed.
   */
  @delegate('server')
  async forceClearStuckState(): Promise<void> {
    this.logger.warn('forceClearStuckState~~');
    await this.evClient.forceClearPendingDisposition();
    await this.evWorkingState.setIsPendingDisposition(false);
    this.evCall.setActivityCallId('');
  }

  /**
   * Whether the agent is in a state only {@link forceClearStuckState} can
   * resolve: the server owes a disposition but no local call exists to submit
   * one against.
   */
  get isStuckWithoutCall(): boolean {
    if (!this.evWorkingState.isPendingDisposition) {
      return false;
    }
    const callId = this.evWorkingState.pendingDispositionCallId;
    return !callId || !this.evPresence.callsMapping[callId];
  }
}

export { EvSessionRecovery };

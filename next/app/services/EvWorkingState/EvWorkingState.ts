import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';

import {
  agentStateTypes,
  defaultAgentStateTexts,
  messageTypes,
} from '../../../enums';
import type { DefaultAgentStateTexts } from '../../../enums';
import { t } from './i18n';
import { EvCallbackTypes } from '../EvClient/enums';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSubscription } from '../EvSubscription';
import { EvCallMonitor } from '../EvCallMonitor';
import { EvPresence } from '../EvPresence';
import { EvAgentSession } from '../EvAgentSession';
import { EvCallDisposition } from '../EvCallDisposition';
import type {
  EvWorkingStateOptions,
  AgentState,
  WorkingState,
} from './EvWorkingState.interface';

const PENDING_DISPOSITION_STATE: AgentState = {
  agentState: 'PENDING-DISPOSITION',
  agentAuxState: 'Pending Disposition',
};

const DEFAULT_AGENT_STATE: AgentState = {
  agentState: agentStateTypes.available,
  agentAuxState: 'Available',
};

/**
 * EvWorkingState module - Agent working state management
 * Handles agent state changes, break time tracking, and disposition pending states
 */
@injectable({
  name: 'EvWorkingState',
})
class EvWorkingState extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evSubscription: EvSubscription,
    private evCallMonitor: EvCallMonitor,
    private evPresence: EvPresence,
    private evAgentSession: EvAgentSession,
    private evCallDisposition: EvCallDisposition,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvWorkingStateOptions')
    private evWorkingStateOptions?: EvWorkingStateOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @storage
  @state
  time: number = Date.now();

  @storage
  @state
  agentState: AgentState = DEFAULT_AGENT_STATE;

  @storage
  @state
  isPendingDisposition = false;

  @storage
  @state
  pendingDispositionCallId = '';

  @action
  setAgentState(agentState: AgentState): void {
    this.agentState = agentState;
    if (agentState.agentState !== agentStateTypes.breakAfterCall) {
      this.time = Date.now();
    }
  }

  @action
  _setIsPendingDisposition(isPendingDisposition: boolean, callId = ''): void {
    this.isPendingDisposition = isPendingDisposition;
    this.pendingDispositionCallId = isPendingDisposition ? callId : '';
  }

  @delegate('server')
  async setIsPendingDisposition(isPendingDisposition: boolean, callId = ''): Promise<void> {
    this._setIsPendingDisposition(isPendingDisposition, callId);
  }

  @action
  resetWorkingState(): void {
    this.time = Date.now();
    this.isPendingDisposition = false;
    this.pendingDispositionCallId = '';
  }

  @action
  setTime(time: number): void {
    this.time = time;
  }

  @computed((that: EvWorkingState) => [
    that.agentState,
    that.isPendingDisposition,
  ])
  get workingState(): WorkingState {
    if (this.isPendingDisposition) {
      return PENDING_DISPOSITION_STATE;
    }
    return {
      ...this.agentState,
      agentAuxState:
        this.agentState.agentAuxState ||
        defaultAgentStateTexts[
          this.agentState.agentState as DefaultAgentStateTexts
        ] ||
        this.agentState.agentState,
    };
  }

  @computed((that: EvWorkingState) => [
    that.evAuth.agentConfig,
    that.isPendingDisposition,
  ])
  get agentStates(): AgentState[] {
    const { agentConfig } = this.evAuth;
    if (!agentConfig?.agentSettings?.availableAgentStates) {
      return [];
    }
    const { availableAgentStates } = agentConfig.agentSettings;
    if (this.isPendingDisposition) {
      return [PENDING_DISPOSITION_STATE, ...availableAgentStates];
    }
    return availableAgentStates;
  }

  @computed((that: EvWorkingState) => [that.agentStates])
  get workingAgentState(): AgentState | undefined {
    return this.agentStates.find(
      (s) => s.agentState === agentStateTypes.working,
    );
  }

  @computed((that: EvWorkingState) => [that.evAuth.agentSettings])
  get maxBreakTime(): number {
    const { agentSettings } = this.evAuth;
    if (!agentSettings) {
      return 0;
    }
    const { maxBreakTime, maxLunchTime } = agentSettings;
    if (this.isOnLunch) {
      return (parseInt(String(maxLunchTime || '0'), 10)) * 60 * 1000;
    }
    if (this.isOnBreakOrAway) {
      return (parseInt(String(maxBreakTime || '0'), 10)) * 60 * 1000;
    }
    return 60 * 1000;
  }

  get isOnBreakOrAway(): boolean {
    const { agentState } = this.workingState;
    return (
      agentState === agentStateTypes.away ||
      agentState === agentStateTypes.onBreak
    );
  }

  get isOnLunch(): boolean {
    const { agentState } = this.workingState;
    return agentState === agentStateTypes.lunch;
  }

  get isWorking(): boolean {
    const { agentState } = this.agentState;
    return agentState === agentStateTypes.working;
  }

  initialize() {
    this.evAgentSession.onTriggerConfig(() => {
      this._handleTriggerConfig();
    });
    this.evCallMonitor.onCallEnded((call) => {
      const encodedCallId = call?.session ? this.evClient.encodeUii(call.session) : '';
      const mainCallId = call?.uii
        ? this.evClient.getMainId(this.evClient.decodeUii(call.uii))
        : '';
      const isDisposed = this.evCallDisposition.isDisposed(encodedCallId) ||
        this.evCallDisposition.isDisposed(mainCallId);
      if (isDisposed) {
        this.logger.info('onCallEnded~~ already disposed, skip pending disposition');
        this.setIsPendingDisposition(false);
        return;
      }
      this.logger.info('onCallEnded~~ setIsPendingDisposition(true)');
      this.setIsPendingDisposition(true, encodedCallId || mainCallId);
    });
    this.evSubscription.subscribe(
      EvCallbackTypes.AGENT_STATE,
      ({ currentState, currentAuxState }: {
        currentState: string;
        currentAuxState: string;
      }) => {
        if (
          this.agentState.agentState !== currentState ||
          this.agentState.agentAuxState !== currentAuxState
        ) {
          this.setAgentState({
            agentState: currentState,
            agentAuxState: currentAuxState,
          });
        }
      },
    );
  }

  /**
   * Change agent working state
   */
  changeWorkingState({ agentState, agentAuxState }: AgentState): void {
    const isOnCall =
      this.agentState.agentState === agentStateTypes.transition ||
      this.agentState.agentState === agentStateTypes.engaged ||
      this.evPresence.calls.length > 0;
    if (isOnCall && agentState !== agentStateTypes.onBreak) {
      this.toast.warning({
        message: t(messageTypes.INVALID_STATE_CHANGE),
        allowDuplicates: false,
        ttl: 0,
      });
      return;
    }
    this.evClient.setAgentState(agentState, agentAuxState);
  }

  /**
   * Set working state to working
   */
  setWorkingStateWorking(): void {
    const workingState = this.workingAgentState;
    if (workingState) {
      this.changeWorkingState(workingState);
    }
  }

  /**
   * Alert when break time is exceeded
   */
  alertOverBreakTime(): void {
    this.toast.warning({
      message: t(messageTypes.OVER_BREAK_TIME),
      ttl: 0,
      allowDuplicates: false,
    });
  }

  /**
   * Handle trigger config: set initial login state and reset working state
   */
  private _handleTriggerConfig(): void {
    const { agentConfig } = this.evAuth;
    if (agentConfig?.agentSettings?.initLoginState) {
      this.evClient.setAgentState(
        agentConfig.agentSettings.initLoginState,
        agentConfig.agentSettings.initLoginStateLabel || '',
      );
    }
    this.resetWorkingState();
  }
}

export { EvWorkingState };

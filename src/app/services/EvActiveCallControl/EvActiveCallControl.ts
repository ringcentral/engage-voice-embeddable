import {
  action,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  storage,
  StoragePlugin,
  delegate,
} from '@ringcentral-integration/next-core';

import { EvClient } from '../EvClient';
import { EvCallbackTypes } from '../EvClient/enums';
import type { EvHoldResponse } from '../EvClient/interfaces';
import { EvPresence } from '../EvPresence';
import { EvSubscription } from '../EvSubscription';
import { EvIntegratedSoftphone } from '../EvIntegratedSoftphone';
import { EvAgentSession } from '../EvAgentSession';
import type {
  EvActiveCallControlOptions,
  EvClientHangUpParams,
  EvClientHoldSessionParams,
} from './EvActiveCallControl.interface';

/**
 * Session id of the main call leg. Every other session reports its own hold
 * state through the same response, so a general hold is only confirmed by this
 * one -- the same filter eag applies in `CallService.holdCallback`.
 */
const MAIN_SESSION_ID = '1';

/** How long to wait for the server to confirm a hold before giving up. */
const HOLD_RESPONSE_TIMEOUT = 10 * 1000;

/**
 * EvActiveCallControl module - Active call control operations
 * Handles call recording, mute, hold, hangup, and DTMF operations
 */
@injectable({
  name: 'EvActiveCallControl',
})
class EvActiveCallControl extends RcModule {
  constructor(
    private evClient: EvClient,
    private evPresence: EvPresence,
    private evSubscription: EvSubscription,
    private evIntegratedSoftphone: EvIntegratedSoftphone,
    private evAgentSession: EvAgentSession,
    private storagePlugin: StoragePlugin,
    @optional('EvActiveCallControlOptions')
    private evActiveCallControlOptions?: EvActiveCallControlOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  isRecording: boolean | null = null;

  @storage
  @state
  timeStamp: number | null = null;

  /**
   * Set by EvTransferCall after a warm transfer that held the customer, so
   * hanging up the consult leg brings them back off hold. Not persisted: it
   * only describes the call leg the agent is on right now.
   */
  @state
  unholdOnHangup = false;

  @action
  setIsRecording(isRecording: boolean) {
    this.isRecording = isRecording;
  }

  @action
  setUnholdOnHangup(unholdOnHangup: boolean) {
    this.unholdOnHangup = unholdOnHangup;
  }

  @action
  pauseRecordAction() {
    this.isRecording = false;
    this.timeStamp = Date.now();
  }

  @action
  resumeRecordAction() {
    this.isRecording = true;
    this.timeStamp = null;
  }

  /**
   * Start recording the current call
   */
  @delegate('server')
  async record(): Promise<void> {
    const { state, message } = await this.evClient.record(true);
    if (state === 'RECORDING') {
      this.setIsRecording(true);
    } else {
      throw new Error(message);
    }
  }

  /**
   * Stop recording the current call
   */
  @delegate('server')
  async stopRecord(): Promise<void> {
    const { state, message } = await this.evClient.record(false);
    if (state === 'STOPPED') {
      this.setIsRecording(false);
    } else {
      throw new Error(message);
    }
  }

  /**
   * Pause recording the current call
   */
  @delegate('server')
  async pauseRecord(): Promise<void> {
    const { state, message } = await this.evClient.pauseRecord(false);
    if (state === 'PAUSED') {
      this.pauseRecordAction();
    } else {
      throw new Error(message);
    }
  }

  /**
   * Resume recording the current call
   */
  @delegate('server')
  async resumeRecord(): Promise<void> {
    this.resumeRecordAction();
  }

  /**
   * Send DTMF tone via keypad
   */
  @delegate('server')
  async onKeypadClick(value: string): Promise<void> {
    this.evClient.sipSendDTMF(value);
  }

  /**
   * Mute the current call
   */
  @delegate('server')
  async mute(): Promise<void> {
    await this._sipToggleMute(true);
  }

  /**
   * Unmute the current call
   */
  @delegate('server')
  async unmute(): Promise<void> {
    await this._sipToggleMute(false);
  }

  /**
   * Hang up a call by session ID
   */
  @delegate('server')
  async hangUp(sessionId: string): Promise<void> {
    this.evClient.hangup({ sessionId });
    // Leaving the consult leg of a warm transfer that held the customer: take
    // them off hold instead of leaving the agent talking to a held call.
    if (this.unholdOnHangup) {
      this.setUnholdOnHangup(false);
      await this.unhold();
    }
  }

  /**
   * Reject an incoming call
   */
  @delegate('server')
  async reject(): Promise<void> {
    this.logger.info('reject call');
  }

  /**
   * Put the current call on hold
   */
  @delegate('server')
  async hold(): Promise<void> {
    await this._changeOnHoldState(true);
  }

  /**
   * Take the current call off hold
   */
  @delegate('server')
  async unhold(): Promise<void> {
    await this._changeOnHoldState(false);
  }

  /**
   * Hold the current call and resolve only once the server has confirmed it,
   * rejecting if it does not. `hold()` cannot be used where the ordering
   * matters -- a warm transfer must not open the consult leg before the
   * customer is actually on hold -- because it only posts the request.
   *
   * The confirmation comes from the shared HOLD subscription rather than a
   * callback passed to `evClient.hold`: the agent library keeps a single
   * callback per response type, so passing one here would replace the handler
   * EvPresence uses to track hold state.
   */
  @delegate('server')
  async holdAndConfirm(): Promise<void> {
    const confirmed = this._waitForHoldResponse(true);
    await this.evClient.hold(true);
    await confirmed;
  }

  private _waitForHoldResponse(holdState: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const stopWaiting = () => {
        clearTimeout(timeoutId);
        this.evSubscription.off(EvCallbackTypes.HOLD, onHoldResponse);
      };
      const onHoldResponse = (data?: EvHoldResponse) => {
        if (data?.sessionId !== MAIN_SESSION_ID) return;
        // A hold toggle we did not ask for: keep waiting for ours.
        if (data.status === 'OK' && data.holdState !== holdState) return;
        stopWaiting();
        if (data.status === 'OK') {
          resolve();
        } else {
          reject(new Error(data.message || 'Hold request was rejected'));
        }
      };
      const timeoutId = setTimeout(() => {
        stopWaiting();
        reject(new Error('Hold request timed out'));
      }, HOLD_RESPONSE_TIMEOUT);
      this.evSubscription.subscribe(EvCallbackTypes.HOLD, onHoldResponse);
    });
  }

  /**
   * Hang up a session
   */
  @delegate('server')
  async hangupSession({ sessionId }: EvClientHangUpParams): Promise<void> {
    await this.evClient.hangup({ sessionId });
  }

  /**
   * Hold or unhold a session
   */
  @delegate('server')
  async holdSession({ sessionId, state }: EvClientHoldSessionParams): Promise<void> {
    await this.evClient.holdSession({ state, sessionId });
  }

  /**
   * Get main call by UII
   */
  getMainCall(uii: string) {
    const id = this.evClient.getMainId(uii);
    return this.evPresence.callsMapping[id];
  }

  private _changeOnHoldState(state: boolean): void {
    this.evClient.hold(state);
  }

  private async _sipToggleMute(state: boolean): Promise<void> {
    if (this.evAgentSession.isIntegratedSoftphone) {
      await this.evIntegratedSoftphone.sipToggleMute(state);
    }
  }
}

export { EvActiveCallControl };

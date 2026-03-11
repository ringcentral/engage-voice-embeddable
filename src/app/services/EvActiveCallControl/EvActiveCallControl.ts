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
import { EvPresence } from '../EvPresence';
import { EvIntegratedSoftphone } from '../EvIntegratedSoftphone';
import { EvAgentSession } from '../EvAgentSession';
import type {
  EvActiveCallControlOptions,
  EvClientHangUpParams,
  EvClientHoldSessionParams,
} from './EvActiveCallControl.interface';

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

  @action
  setIsRecording(isRecording: boolean) {
    this.isRecording = isRecording;
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
      await this.evIntegratedSoftphone.sipToggleMute();
    }
  }
}

export { EvActiveCallControl };

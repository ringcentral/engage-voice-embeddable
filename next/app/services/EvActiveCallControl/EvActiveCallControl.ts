import {
  action,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { tabManagerEvents } from '../../../enums';
import { EvClient } from '../EvClient';
import { EvSettings } from '../EvSettings';
import { EvPresence } from '../EvPresence';
import { EvIntegratedSoftphone } from '../EvIntegratedSoftphone';
import { EvAgentSession } from '../EvAgentSession';
import { TabManager } from '../EvTabManager';
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
    private evSettings: EvSettings,
    private evPresence: EvPresence,
    private evIntegratedSoftphone: EvIntegratedSoftphone,
    private evAgentSession: EvAgentSession,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional() private tabManager?: TabManager,
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

  get tabManagerEnabled(): boolean {
    return !!this.tabManager;
  }

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
  resumeRecord(): void {
    this.resumeRecordAction();
  }

  /**
   * Send DTMF tone via keypad
   */
  onKeypadClick(value: string): void {
    this.evClient.sipSendDTMF(value);
  }

  /**
   * Mute the current call
   */
  mute(): void {
    this._sipToggleMute(true);
  }

  /**
   * Unmute the current call
   */
  unmute(): void {
    this._sipToggleMute(false);
  }

  /**
   * Hang up a call by session ID
   */
  hangUp(sessionId: string): void {
    this.evClient.hangup({ sessionId });
  }

  /**
   * Reject an incoming call
   */
  reject(): void {
    this.logger.info('reject call');
  }

  /**
   * Put the current call on hold
   */
  hold(): void {
    this._changeOnHoldState(true);
  }

  /**
   * Take the current call off hold
   */
  unhold(): void {
    this._changeOnHoldState(false);
  }

  /**
   * Hang up a session
   */
  hangupSession({ sessionId }: EvClientHangUpParams): void {
    this.evClient.hangup({ sessionId });
  }

  /**
   * Hold or unhold a session
   */
  holdSession({ sessionId, state }: EvClientHoldSessionParams): void {
    this.evClient.holdSession({ state, sessionId });
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

  private _sipToggleMute(state: boolean): void {
    if (this.evAgentSession.isIntegratedSoftphone) {
      if (this.tabManagerEnabled && this.tabManager) {
        this.tabManager.send(tabManagerEvents.MUTE, state);
      }
      this.evIntegratedSoftphone.sipToggleMute(state);
    }
  }
}

export { EvActiveCallControl };

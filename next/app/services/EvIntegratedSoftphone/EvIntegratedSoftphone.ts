import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  watch,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { EvSoftphoneEvents } from '../../../enums';
import { EvCallbackTypes } from '../../../lib/EvClient/enums/callbackTypes';
import type { EvClient } from '../EvClient';
import type { EvAuth } from '../EvAuth';
import type { EvSubscription } from '../EvSubscription';
import type { EvAgentSession } from '../EvAgentSession';
import type {
  EvIntegratedSoftphoneOptions,
  SipState,
} from './EvIntegratedSoftphone.interface';

/**
 * EvIntegratedSoftphone module - WebRTC softphone integration
 * Handles SIP registration, audio permissions, and call handling via WebRTC
 */
@injectable({
  name: 'EvIntegratedSoftphone',
})
class EvIntegratedSoftphone extends RcModule {
  private _eventEmitter = new EventEmitter();
  private _audio: HTMLAudioElement | null = null;
  private _realSipConnected = false;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evSubscription: EvSubscription,
    private evAgentSession: EvAgentSession,
    private storagePlugin: StoragePlugin,
    @optional('EvIntegratedSoftphoneOptions')
    private evIntegratedSoftphoneOptions?: EvIntegratedSoftphoneOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    this.evAuth.beforeAgentLogout(() => {
      this._resetAllState();
    });
    // Watch for WebRTC tab changes
    watch(
      this,
      () => this.isWebRTCTab,
      (isWebRTCTab) => {
        if (!isWebRTCTab && this._realSipConnected) {
          this._realSipConnected = false;
          this._resetAllState();
        }
      },
    );
  }

  @storage
  @state
  audioPermission = false;

  @storage
  @state
  muteActive = false;

  @state
  sipRegisterSuccess = false;

  @state
  sipRegistering = false;

  @storage
  @state
  isWebRTCTab = false;

  get sipState(): SipState {
    if (this.sipRegistering) {
      return 'registering';
    }
    if (this.sipRegisterSuccess) {
      return 'registered';
    }
    return 'idle';
  }

  get isIntegratedSoftphone(): boolean {
    return this.evAgentSession.isIntegratedSoftphone;
  }

  @action
  setAudioPermission(permission: boolean) {
    this.audioPermission = permission;
  }

  @action
  setMuteActive(muted: boolean) {
    this.muteActive = muted;
  }

  @action
  setSipRegisterSuccess(success: boolean) {
    this.sipRegisterSuccess = success;
  }

  @action
  setSipRegistering(registering: boolean) {
    this.sipRegistering = registering;
  }

  @action
  setIsWebRTCTab(isWebRTCTab: boolean) {
    this.isWebRTCTab = isWebRTCTab;
  }

  @action
  private _resetAllState() {
    this.sipRegisterSuccess = false;
    this.sipRegistering = false;
    this.muteActive = false;
    this.isWebRTCTab = false;
  }

  override onInitOnce() {
    // Subscribe to SIP events
    this.evSubscription.subscribe(EvCallbackTypes.SIP_REGISTERED, () => {
      this._realSipConnected = true;
      this.setSipRegisterSuccess(true);
      this.setSipRegistering(false);
      this._emitRegistered();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNREGISTERED, () => {
      this._realSipConnected = false;
      this.setSipRegisterSuccess(false);
    });
  }

  /**
   * Request audio permission
   */
  async requestAudioPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      this.setAudioPermission(true);
      return true;
    } catch (error) {
      this.setAudioPermission(false);
      return false;
    }
  }

  /**
   * Initialize SIP
   */
  async sipInit(): Promise<void> {
    if (!this.audioPermission) {
      const hasPermission = await this.requestAudioPermission();
      if (!hasPermission) {
        throw new Error('Audio permission denied');
      }
    }
    this.evClient.sipInit();
  }

  /**
   * Register SIP
   */
  async sipRegister(): Promise<void> {
    this.setSipRegistering(true);
    try {
      this.evClient.sipRegister();
    } catch (error) {
      this.setSipRegistering(false);
      throw error;
    }
  }

  /**
   * Answer SIP call
   */
  sipAnswer(): void {
    this.evClient.sipAnswer();
  }

  /**
   * Hangup SIP call
   */
  sipHangUp(): void {
    this.evClient.sipHangUp();
  }

  /**
   * Reject SIP call
   */
  sipReject(): void {
    this.evClient.sipReject();
  }

  /**
   * Terminate SIP
   */
  sipTerminate(): void {
    this.evClient.sipTerminate();
    this.setSipRegisterSuccess(false);
  }

  /**
   * Send DTMF
   */
  sipSendDTMF(dtmf: string): void {
    this.evClient.sipSendDTMF(dtmf);
  }

  /**
   * Toggle mute
   */
  sipToggleMute(): void {
    const newMuteState = !this.muteActive;
    this.evClient.sipToggleMute(newMuteState);
    this.setMuteActive(newMuteState);
  }

  private _emitRegistered() {
    this._eventEmitter.emit(EvSoftphoneEvents.REGISTERED);
  }

  onRegistered(callback: () => void): this {
    this._eventEmitter.on(EvSoftphoneEvents.REGISTERED, callback);
    return this;
  }

  /**
   * Wait for SIP registration to complete
   */
  onceRegistered(): Promise<void> {
    return new Promise((resolve) => {
      if (this.sipRegisterSuccess) {
        resolve();
        return;
      }
      const handler = () => {
        this._eventEmitter.off(EvSoftphoneEvents.REGISTERED, handler);
        resolve();
      };
      this._eventEmitter.on(EvSoftphoneEvents.REGISTERED, handler);
    });
  }

  /**
   * Ask for audio permission with optional force parameter
   */
  async askAudioPermission(force = true): Promise<boolean> {
    if (!force && this.audioPermission) {
      return true;
    }
    return this.requestAudioPermission();
  }

  /**
   * Connect WebRTC with SIP init and register
   */
  async connectWebRTC(): Promise<void> {
    try {
      this.setIsWebRTCTab(true);
      this.setSipRegistering(true);
      await this.evClient.sipInitAndRegister({
        agentId: this.evAuth.getAgentId(),
        authToken: this.evAuth.authenticateResponse?.accessToken || '',
      });
      await this.onceRegistered();
      this.setSipRegistering(false);
    } catch (error) {
      this.setSipRegistering(false);
      console.error('WebRTC connection error:', error);
      throw error;
    }
  }
}

export { EvIntegratedSoftphone };

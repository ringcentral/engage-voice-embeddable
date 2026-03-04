import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  watch,
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { EvSoftphoneEvents } from '../../../enums';
import { dialoutStatuses } from '../../../enums/dialoutStatus';
import { sleep } from '../../../lib/utils';
import { EvCallbackTypes } from '../EvClient/enums';
import type { EvSipRingingData } from '../EvClient/interfaces/EvClientCallMapping.interface';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSubscription } from '../EvSubscription';
import { EvAgentSession } from '../EvAgentSession';
import { EvPresence } from '../EvPresence';
import type {
  EvIntegratedSoftphoneOptions,
  SipState,
} from './EvIntegratedSoftphone.interface';
import { audios } from './audios';

const SECOND = 1000;
const RECONNECT_DEBOUNCE_TIME = SECOND * 5;
const RECONNECT_DEBOUNCE_TIME_WHEN_CONNECTED = SECOND * 15;
const SIP_MAX_CONNECTING_TIME = SECOND * 30;

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
  private _sipConnected = false;
  private _isCloseWhenCallConnected = false;

  /** Auto-answer check function, set by external callers */
  autoAnswerCheckFn: (() => boolean) | null = null;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evSubscription: EvSubscription,
    private evAgentSession: EvAgentSession,
    private evPresence: EvPresence,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvIntegratedSoftphoneOptions')
    private evIntegratedSoftphoneOptions?: EvIntegratedSoftphoneOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
        this.portManager.onMainTabChange(async () => {
          // We only run sip instance on main tab,
          // so when main tab is changed, we need to reset the sip state.
          // So it can reconnect at new main tab
          this.logger.info('onMainTabChange~~');
          this._sipConnected = false;
          this._resetSip();
          this._eventEmitter.emit(EvSoftphoneEvents.RESET);
        });
      });
      this.portManager.onClient(() => {
        this._initAudio();
      });
    } else {
      this.initialize();
      this._initAudio();
    }
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

  @state
  sipUnstableConnection = false;

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
  _setAudioPermission(permission: boolean) {
    this.audioPermission = permission;
  }

  @delegate('server')
  async setAudioPermission(permission: boolean) {
    this._setAudioPermission(permission);
  }

  @action
  _setMuteActive(muted: boolean) {
    this.muteActive = muted;
  }

  @delegate('server')
  async setMuteActive(muted: boolean) {
    this._setMuteActive(muted);
  }

  @action
  _setSipRegisterSuccess(success: boolean) {
    this.sipRegisterSuccess = success;
  }

  @delegate('server')
  async setSipRegisterSuccess(success: boolean) {
    this._setSipRegisterSuccess(success);
  }

  @action
  _setSipRegistering(registering: boolean) {
    this.sipRegistering = registering;
  }

  @delegate('server')
  async setSipRegistering(registering: boolean) {
    this._setSipRegistering(registering);
  }

  @action
  _setSipUnstableConnection(unstable: boolean) {
    this.sipUnstableConnection = unstable;
  }

  @delegate('server')
  async setSipUnstableConnection(unstable: boolean) {
    this._setSipUnstableConnection(unstable);
  }

  @action
  _resetController() {
    this.muteActive = false;
  }

  @delegate('server')
  async resetController() {
    this._resetController();
  }

  @action
  _resetSip() {
    this.audioPermission = false;
    this.sipRegistering = false;
    this.sipRegisterSuccess = false;
    this.sipUnstableConnection = false;
  }

  @delegate('server')
  async resetSip() {
    this._resetSip();
  }

  private async _resetAllState() {
    if (!this.portManager.isServer) {
      return;
    }
    this.logger.info('resetAllState~~');
    this._sipConnected = false;
    await this.resetSip();
    await this.evClient.sipTerminate();
    this._eventEmitter.emit(EvSoftphoneEvents.RESET);
  }

  get isMainTab(): boolean {
    return this.portManager?.isMainTab || false;
  }

  initialize() {
    this._bindingIntegratedSoftphone();
    this.evAuth.beforeAgentLogout(async () => {
      this.logger.info('beforeAgentLogout~~');
      await this._resetAllState();
    });
    this.evAgentSession.onReConfigFail(() => {
      if (this.evAgentSession.isIntegratedSoftphone) {
        this._emitRegistrationFailed();
      }
    });
    this.evAgentSession.onConfigSuccess(async() => {
      this.logger.info('onConfigSuccess~~');
      this.logger.info('isIntegratedSoftphone~~', this.evAgentSession.isIntegratedSoftphone);
      if (this.evAgentSession.isIntegratedSoftphone) {
        this.logger.info('sipConnected~~', this._sipConnected);
        if (this._sipConnected) {
          return;
        }
        await this.connectWebRTC();
      } else {
        await this._resetAllState();
      }
    });
  }

  override async onReset() {
    try {
      await this._resetAllState();
    } catch (error) {
      // ignore error during reset
    }
  }

  /**
   * Subscribe to all SIP events from EvSubscription
   */
  private _bindingIntegratedSoftphone() {
    this.logger.info('_bindingIntegratedSoftphone~~');
    this.evSubscription.subscribe(EvCallbackTypes.SIP_REGISTERED, () => {
      this.logger.info('SIP_REGISTERED~~');
      this._sipConnected = true;
      this._isCloseWhenCallConnected = false;
      this.setSipRegisterSuccess(true);
      this.setSipRegistering(false);
      this.setSipUnstableConnection(false);
      this._emitRegistered();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNREGISTERED, () => {
      this.logger.info('SIP_UNREGISTERED~~');
      this._sipConnected = false;
      this.setSipRegisterSuccess(false);
    });
    this.evSubscription.subscribe(
      EvCallbackTypes.SIP_REGISTRATION_FAILED,
      async() => {
        this.logger.info('SIP_REGISTRATION_FAILED~~');
        await this.setSipRegistering(false);
        await this._resetAllState();
      },
    );
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNSTABLE_CONNECTION, () => {
      this.logger.info('SIP_UNSTABLE_CONNECTION~~');
      this.setSipUnstableConnection(true);
    });
    this.evSubscription.subscribe(
      EvCallbackTypes.SIP_RINGING,
      (ringingCall?: EvSipRingingData) => {
        this.logger.info('SIP_RINGING~~');
        this.evPresence.bindBeforeunload();
        this._eventEmitter.emit(EvCallbackTypes.SIP_RINGING, ringingCall);
        if (this.autoAnswerCheckFn?.()) {
          this.sipAnswer();
        }
      },
    );
    this.evSubscription.subscribe(EvCallbackTypes.SIP_CONNECTED, async () => {
      this.logger.info('SIP_CONNECTED~~');
      await this.evPresence.setOffhook(true);
      await this.resetController();
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_ENDED, async () => {
      this.logger.info('SIP_ENDED~~');
      await this.evPresence.setOffhook(false);
      await this.evPresence.removeBeforeunload();
      await this.evPresence.setDialoutStatus(dialoutStatuses.idle);
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_MUTE, () => {
      this.logger.info('SIP_MUTE~~');
      this.setMuteActive(true);
    });
    this.evSubscription.subscribe(EvCallbackTypes.SIP_UNMUTE, () => {
      this.logger.info('SIP_UNMUTE~~');
      this.setMuteActive(false);
    });
  }

  /**
   * Request audio permission
   */

  @delegate('mainClient')
  async requestAudioPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      await this.setAudioPermission(true);
      return true;
    } catch (error) {
      await this.setAudioPermission(false);
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
    await this.evClient.sipInit();
  }

  /**
   * Register SIP
   */
  async sipRegister(): Promise<void> {
    await this.setSipRegistering(true);
    try {
      await this.evClient.sipRegister();
    } catch (error) {
      await this.setSipRegistering(false);
      throw error;
    }
  }

  /**
   * Answer SIP call
   */
  @delegate('mainClient')
  async sipAnswer(): Promise<void> {
    await this.evClient.sipAnswer();
  }

  /**
   * Hangup SIP call
   */
  @delegate('mainClient')
  async sipHangUp(): Promise<void> {
    await this.evClient.sipHangUp();
  }

  /**
   * Reject SIP call
   */
  @delegate('mainClient')
  async sipReject(): Promise<void> {
    this.evPresence.showOffHookInitError = false;
    await this.evClient.sipReject();
    this._eventEmitter.emit(EvSoftphoneEvents.CALL_REJECTED);
    this.evPresence.removeBeforeunload();
  }

  /**
   * Terminate SIP
   */
  @delegate('mainClient')
  async sipTerminate(): Promise<void> {
    await this.evClient.sipTerminate();
    await this.setSipRegisterSuccess(false);
  }

  /**
   * Send DTMF
   */
  @delegate('mainClient')
  async sipSendDTMF(dtmf: string): Promise<void> {
    await this.evClient.sipSendDTMF(dtmf);
  }

  /**
   * Toggle mute
   */
  @delegate('mainClient')
  async sipToggleMute(): Promise<void> {
    const newMuteState = !this.muteActive;
    await this.evClient.sipToggleMute(newMuteState);
    await this.setMuteActive(newMuteState);
  }

  private _initAudio() {
    if (typeof document !== 'undefined' && document.createElement) {
      this._audio = document.createElement('audio');
    }
  }

  private _playAudioLoop(type: keyof typeof audios) {
    if (!this._audio) return;
    this._audio.loop = true;
    this._playAudio(type);
  }

  private _playAudio(type: keyof typeof audios) {
    if (!this._audio) return;
    this._audio.currentTime = 0;
    this._audio.src = audios[type];
    this._audio.play();
  }

  private _stopAudio() {
    if (!this._audio) return;
    this._audio.loop = false;
    this._audio.pause();
  }

  /**
   * Play ringtone audio in loop
   */
  async playRingtone(): Promise<void> {
    this._playAudioLoop('ringtone');
  }

  /**
   * Stop ringtone audio
   */
  stopRingtone() {
    this._stopAudio();
  }

  private _emitRegistered() {
    this._eventEmitter.emit(EvSoftphoneEvents.REGISTERED);
  }

  private _emitRegistrationFailed() {
    this.evSubscription.emit(EvCallbackTypes.SIP_REGISTRATION_FAILED, null);
  }

  /**
   * Register callback for SIP registered event
   */
  onRegistered(callback: () => void): this {
    this._eventEmitter.on(EvSoftphoneEvents.REGISTERED, callback);
    return this;
  }

  /**
   * Register callback for SIP ringing event
   */
  onRinging(callback: (call?: EvSipRingingData) => void): this {
    this._eventEmitter.on(EvCallbackTypes.SIP_RINGING, callback);
    return this;
  }

  /**
   * Wait for SIP registration to complete with timeout
   * Rejects if RESET event fires or timeout (30s) is reached
   */
  onceRegistered(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.sipRegisterSuccess) {
        resolve();
        return;
      }
      let settled = false;
      const cleanup = () => {
        settled = true;
        clearTimeout(timer);
        this._eventEmitter.off(EvSoftphoneEvents.REGISTERED, onRegistered);
        this._eventEmitter.off(EvSoftphoneEvents.RESET, onReset);
      };
      const onRegistered = () => {
        if (settled) return;
        cleanup();
        resolve();
      };
      const onReset = () => {
        if (settled) return;
        cleanup();
        this._emitRegistrationFailed();
        reject(new Error('SIP registration reset'));
      };
      const timer = setTimeout(() => {
        if (settled) return;
        cleanup();
        this._emitRegistrationFailed();
        reject(new Error('SIP registration timeout'));
      }, SIP_MAX_CONNECTING_TIME);
      this._eventEmitter.once(EvSoftphoneEvents.REGISTERED, onRegistered);
      this._eventEmitter.once(EvSoftphoneEvents.RESET, onReset);
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
   * Includes reconnect debounce for force login / reconnection scenarios
   */
  async connectWebRTC(): Promise<void> {
    this.logger.info('connectWebRTC~~');
    await this.askAudioPermission();
    if (this.sipRegistering) {
      throw new Error('SIP is already registering');
    }
    try {
      this.logger.info('setSipRegistering true~~');
      await this.setSipRegistering(true);
      // Reconnect debounce: delay when reconnecting or force login
      if (
        this.evAgentSession.isReconnected ||
        this.evAgentSession.isForceLogin
      ) {
        this.logger.info('reconnect debounce~~');
        const debounceTime = this._isCloseWhenCallConnected
          ? RECONNECT_DEBOUNCE_TIME_WHEN_CONNECTED
          : RECONNECT_DEBOUNCE_TIME;
        await sleep(debounceTime);
      }
      this.logger.info('sipInitAndRegister~~');
      await this.evClient.sipInitAndRegister({
        agentId: this.evAuth.getAgentId(),
      });
      await this.onceRegistered();
      await this.setSipRegistering(false);
    } catch (error) {
      await this.setSipRegistering(false);
      this.logger.error('WebRTC connection error:', error);
      throw error;
    }
  }
}

export { EvIntegratedSoftphone };

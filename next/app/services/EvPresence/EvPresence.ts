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
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import type { DialoutStatusesType } from '../../../enums';
import { callStatus, dialoutStatuses, messageTypes } from '../../../enums';
import { t } from './i18n';
import { EvCallbackTypes } from '../EvClient/enums';
import type {
  EvAddSessionNotification,
  EvBaseCall,
  EvDropSessionNotification,
  EvEndedCall,
  EvHoldResponse,
  EvOffhookInitResponse,
  EvOffhookTermResponse,
  EvEarlyUiiResponse,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvSubscription } from '../EvSubscription';
import type { EvPresenceOptions, EvAgentRecording } from './EvPresence.interface';

/**
 * EvPresence module - Call presence and offhook state management
 * Handles call tracking, offhook state, dialout status, and call events
 */
@injectable({
  name: 'EvPresence',
})
class EvPresence extends RcModule {
  beforeunloadHandler = () => false;
  evPresenceEvents = new EventEmitter();
  showOffHookInitError = true;

  private _callIds: string[] = [];
  private _otherCallIds: string[] = [];
  private _callLogsIds: string[] = [];
  private _callsMapping: Record<string, EvBaseCall> = {};
  private _oldCalls: EvBaseCall[] = [];

  constructor(
    private evClient: EvClient,
    private evSubscription: EvSubscription,
    private toast: Toast,
    // private beforeunload: Beforeunload,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvPresenceOptions') private evPresenceOptions?: EvPresenceOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager.shared) {
      this.portManager.onMainTab(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @storage
  @state
  currentCallUii = '';

  @storage
  @state
  isOffhook = false;

  @storage
  @state
  isManualOffhook = false;

  @storage
  @state
  isOffhooking = false;

  @storage
  @state
  dialoutStatus: DialoutStatusesType = dialoutStatuses.idle;

  get callIds(): string[] {
    return this._callIds;
  }

  get otherCallIds(): string[] {
    return this._otherCallIds;
  }

  get callLogsIds(): string[] {
    return this._callLogsIds;
  }

  get callsMapping(): Record<string, EvBaseCall> {
    return this._callsMapping;
  }

  /**
   * Check if agent is currently on a call
   */
  get isOnCall(): boolean {
    return this.calls.length > 0;
  }

  @action
  setCurrentCallUii(uii: string) {
    this.currentCallUii = uii;
  }

  @computed((that: EvPresence) => [that.callIds, that.callsMapping])
  get calls(): EvBaseCall[] {
    return this.callIds
      .map((id) => this.callsMapping[id])
      .filter((call) => !!call);
  }

  @computed((that: EvPresence) => [that.otherCallIds, that.callsMapping])
  get otherCalls(): EvBaseCall[] {
    return this.otherCallIds.map((id) => this.callsMapping[id]);
  }

  @computed((that: EvPresence) => [that.callLogsIds, that.callsMapping])
  get callLogs(): EvBaseCall[] {
    return this.callLogsIds.map((id) => this.callsMapping[id]);
  }

  get isCallConnected(): boolean {
    return this.dialoutStatus === dialoutStatuses.callConnected;
  }

  @action
  setDialoutStatus(status: DialoutStatusesType) {
    if (this.dialoutStatus !== status) {
      this.dialoutStatus = status;
    }
  }

  @action
  setOffhookInit() {
    this.isOffhooking = false;
    this.isOffhook = true;
    this._checkBeforeunload();
  }

  @action
  setOffhookTerm() {
    this.isOffhooking = false;
    this.isOffhook = false;
    this.isManualOffhook = false;
    this._checkBeforeunload();
  }

  @action
  setIsManualOffhook(isManualOffhook: boolean) {
    this.isManualOffhook = isManualOffhook;
  }

  @action
  setOffhook(status: boolean) {
    this.isOffhook = status;
    this._checkBeforeunload();
  }

  @action
  setOffhooking(offhooking: boolean) {
    this.isOffhooking = offhooking;
  }

  addNewCall(call: EvBaseCall) {
    const id = this.evClient.encodeUii(call);
    this._callsMapping[id] = call;
    if (!this._callIds.includes(id)) {
      this._callIds.push(id);
    }
  }

  addNewSession(session: EvAddSessionNotification) {
    const id = this.evClient.encodeUii(session);
    if (this._callsMapping[id]) {
      this._callsMapping[id] = {
        ...this._callsMapping[id],
        ...session,
      };
    }
  }

  dropSession(dropSession: EvDropSessionNotification) {
    const id = this.evClient.encodeUii(dropSession);
    if (this._callsMapping[id]) {
      delete this._callsMapping[id];
      this._callIds = this._callIds.filter((callId) => callId !== id);
    }
  }

  removeEndedCall(endedCall: EvEndedCall) {
    const id = this.evClient.encodeUii(endedCall);
    if (this._callsMapping[id]) {
      // Move to call logs
      if (!this._callLogsIds.includes(id)) {
        this._callLogsIds.unshift(id);
      }
      this._callIds = this._callIds.filter((callId) => callId !== id);
    }
  }

  setCallHoldStatus(res: EvHoldResponse) {
    const { uii, sessionId, holdState } = res;
    const id = this.evClient.encodeUii({ uii, sessionId });
    if (this._callsMapping[id]) {
      (this._callsMapping[id] as EvBaseCall & { hold?: boolean }).hold = holdState;
    }
  }

  clearCalls() {
    this._callIds = [];
    this._otherCallIds = [];
    this._callsMapping = {};
  }

  getRecordingSettings(record: EvAgentRecording): string {
    let recordingSetting = '';
    if (record.agentRecording) {
      if (record.default === 'ON') {
        if (record.pause) {
          recordingSetting = 'Yes - Record Call (Agent Pause)';
        } else {
          recordingSetting = 'Agent Triggered (Default: Record)';
        }
      } else {
        recordingSetting = "Agent Triggered (Default: Don't Record)";
      }
    } else if (!record.agentRecording) {
      if (record.default === 'ON') {
        recordingSetting = 'Yes - Record Full Call';
      } else {
        recordingSetting = "No - Don't Record Call";
      }
    }
    return recordingSetting;
  }

  initialize() {
    this._bindSubscription();
  }

  private _bindSubscription() {
    this.evSubscription
      .subscribe(
        EvCallbackTypes.OFFHOOK_INIT,
        (data: EvOffhookInitResponse) => {
          this.evPresenceEvents.emit(EvCallbackTypes.OFFHOOK_INIT, data);
          if (data.status === 'OK') {
            this.setOffhookInit();
          } else {
            if (this.showOffHookInitError) {
              this.toast.danger({
                message: t(messageTypes.OFFHOOK_INIT_ERROR),
              });
            }
            this.setOffhookTerm();
            this.showOffHookInitError = true;
          }
        },
      )
      .subscribe(EvCallbackTypes.EARLY_UII, (data: EvEarlyUiiResponse) => {
        if (data.status === 'OK') {
          this.setCurrentCallUii(data.uii);
        }
      })
      .subscribe(
        EvCallbackTypes.OFFHOOK_TERM,
        (data: EvOffhookTermResponse) => {
          if (data.status === 'OK' || data.message === 'Offhook terminated') {
            this.setOffhookTerm();
          } else {
            this.toast.danger({
              message: t(messageTypes.OFFHOOK_TERM_ERROR),
            });
            console.error(data);
          }
        },
      )
      .subscribe(EvCallbackTypes.ADD_SESSION, (data: EvAddSessionNotification) => {
        if (data.status === 'OK') {
          this.addNewSession(data);
          this.evPresenceEvents.emit(callStatus.RINGING, data);
        } else {
          this.toast.danger({
            message: t(messageTypes.ADD_SESSION_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.DROP_SESSION, (data: any) => {
        if (data.status === 'OK') {
          this.dropSession(data);
        } else {
          this.toast.danger({
            message: t(messageTypes.DROP_SESSION_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.HOLD, (data: any) => {
        if (data.status === 'OK') {
          this.setCallHoldStatus(data);
        } else {
          this.toast.danger({
            message: t(messageTypes.HOLD_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.NEW_CALL, (data: EvBaseCall) => {
        this.addNewCall(data);
        this._checkCallStateChange();
      })
      .subscribe(EvCallbackTypes.END_CALL, (data: EvEndedCall) => {
        const id = this.evClient.encodeUii(data);
        if (!this.callsMapping[id]) return;
        if (!this.isManualOffhook) {
          this.evClient.offhookTerm();
        }
        this.removeEndedCall(data);
        this._checkCallStateChange();
      });
  }

  private _checkBeforeunload() {
    if (this.isOffhook) {
      // TODO: this.beforeunload.add(this.beforeunloadHandler);
    } else {
      // TODO: this.beforeunload.remove(this.beforeunloadHandler);
    }
  }

  /**
   * Get main call by UII
   */
  getMainCall(uii: string): EvBaseCall | undefined {
    const id = this.evClient.getMainId(uii);
    return this.callsMapping[id];
  }

  /**
   * Get call ID from session info
   */
  getCallId({ uii, sessionId }: { uii?: string; sessionId?: string }): string {
    return this.evClient.encodeUii({ uii, sessionId });
  }

  /**
   * Get active call list for a given call ID
   */
  getActiveCallList(
    callIds: string[],
    otherCallIds: string[],
    callsMapping: Record<string, EvBaseCall>,
    id: string,
  ): EvBaseCall[] {
    const uii = this.evClient.decodeUii(id);
    const mainUii = this.evClient.getMainId(uii);
    if (!otherCallIds.includes(mainUii) || !callIds.includes(id)) return [];
    const currentOtherCallIds = otherCallIds.filter(
      (callId) => callId.includes(uii) && callId !== mainUii,
    );
    const currentCallIds = [mainUii, id, ...currentOtherCallIds];
    return currentCallIds.map((callId) => callsMapping[callId]).filter(Boolean);
  }

  /**
   * Register callback for call ringing events
   */
  onCallRinging(callback: (session?: EvAddSessionNotification) => void): this {
    this.evPresenceEvents.on(callStatus.RINGING, callback);
    return this;
  }

  /**
   * Register callback for call answered events
   */
  onCallAnswered(callback: (currentCall?: EvBaseCall) => void): this {
    this.evPresenceEvents.on(callStatus.ANSWERED, callback);
    return this;
  }

  /**
   * Register callback for call ended events
   */
  onCallEnded(callback: (currentCall?: EvBaseCall) => void): this {
    this.evPresenceEvents.on(callStatus.ENDED, callback);
    return this;
  }

  /**
   * Check and emit call state change events
   */
  private _checkCallStateChange(): void {
    const currentCalls = this.calls;
    if (currentCalls.length > this._oldCalls.length) {
      const currentCall = currentCalls[0];
      const mainCall = this.getMainCall(currentCall.uii);
      if (currentCall && mainCall) {
        this._oldCalls = currentCalls;
        this.evPresenceEvents.emit(callStatus.ANSWERED, currentCall);
      } else {
        this.clearCalls();
      }
    } else if (currentCalls.length < this._oldCalls.length) {
      const call = this._oldCalls[0];
      this._oldCalls = currentCalls;
      this.evPresenceEvents.emit(callStatus.ENDED, call);
    }
  }

  /**
   * Check if calls are limited
   */
  get callsLimited(): boolean {
    return this._callLogsIds.length > 250;
  }

  /**
   * Limit the number of call logs kept in memory
   */
  limitCalls(): void {
    const MAX_CALL_LOGS = 250;
    if (this._callLogsIds.length > MAX_CALL_LOGS) {
      const idsToRemove = this._callLogsIds.slice(MAX_CALL_LOGS);
      this._callLogsIds = this._callLogsIds.slice(0, MAX_CALL_LOGS);
      idsToRemove.forEach((id) => {
        delete this._callsMapping[id];
      });
    }
  }

  /**
   * Bind beforeunload handler
   */
  bindBeforeunload(): void {
    // TODO: Implement when beforeunload module is available
    this.logger.info('bindBeforeunload');
  }

  /**
   * Remove beforeunload handler
   */
  removeBeforeunload(): void {
    // TODO: Implement when beforeunload module is available
    this.logger.info('removeBeforeunload');
  }
}

export { EvPresence };

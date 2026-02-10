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
import { EventEmitter } from 'events';
import { Beforeunload } from '@ringcentral-integration/micro-core/src/app/services';
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
import { EvCallDataSource } from '../EvCallDataSource';
import type { EvPresenceOptions, EvAgentRecording } from './EvPresence.interface';

/**
 * EvPresence module - Call presence and offhook state management
 * Handles call tracking, offhook state, dialout status, and call events.
 * Delegates call data storage and mutations to EvCallDataSource.
 */
@injectable({
  name: 'EvPresence',
})
class EvPresence extends RcModule {
  beforeunloadHandler = () => {
    if (this.portManager.isMainTab) {
      return false;
    }
    return true;
  };
  evPresenceEvents = new EventEmitter();
  showOffHookInitError = true;
  private _oldCalls: EvBaseCall[] = [];

  constructor(
    private evClient: EvClient,
    private evSubscription: EvSubscription,
    private evCallDataSource: EvCallDataSource,
    private toast: Toast,
    private beforeunload: Beforeunload,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvPresenceOptions') private evPresenceOptions?: EvPresenceOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager.shared) {
      this.portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  // --- Persisted offhook / dialout state ---

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

  // --- Delegated call data accessors (from EvCallDataSource) ---

  /** Current agent ongoing session call IDs */
  get callIds(): string[] {
    return this.evCallDataSource.callIds;
  }

  /** Other agent ongoing session call IDs */
  get otherCallIds(): string[] {
    return this.evCallDataSource.otherCallIds;
  }

  /** Ended call log IDs */
  get callLogsIds(): string[] {
    return this.evCallDataSource.callLogsIds;
  }

  /** Call data mapping (keyed by encoded UII) */
  get callsMapping(): Record<string, EvBaseCall> {
    return this.evCallDataSource.callsMapping;
  }

  /** Raw call data mapping without session info (keyed by raw UII) */
  get rawCallsMapping(): Record<string, EvBaseCall> {
    return this.evCallDataSource.rawCallsMapping;
  }

  // --- Computed call lists ---

  /**
   * Check if agent is currently on a call
   */
  get isOnCall(): boolean {
    return this.calls.length > 0;
  }

  @computed((that: EvPresence) => [that.evCallDataSource.data])
  get calls(): EvBaseCall[] {
    return this.callIds
      .map((id) => this.callsMapping[id])
      .filter((call) => !!call);
  }

  @computed((that: EvPresence) => [that.evCallDataSource.data])
  get otherCalls(): EvBaseCall[] {
    return this.otherCallIds.map((id) => this.callsMapping[id]);
  }

  @computed((that: EvPresence) => [that.evCallDataSource.data])
  get callLogs(): EvBaseCall[] {
    return this.callLogsIds.map((id) => this.callsMapping[id]);
  }

  get isCallConnected(): boolean {
    return this.dialoutStatus === dialoutStatuses.callConnected;
  }

  // --- Offhook / dialout actions ---

  @action
  _setCurrentCallUii(uii: string) {
    this.currentCallUii = uii;
  }

  @delegate('server')
  async setCurrentCallUii(uii: string) {
    this._setCurrentCallUii(uii);
  }

  @action
  _setDialoutStatus(status: DialoutStatusesType) {
    if (this.dialoutStatus !== status) {
      this.dialoutStatus = status;
    }
  }

  @delegate('server')
  async setDialoutStatus(status: DialoutStatusesType) {
    this._setDialoutStatus(status);
  }

  @action
  _setOffhookInit() {
    this.isOffhooking = false;
    this.isOffhook = true;
  }

  @delegate('server')
  async setOffhookInit() {
    this._setOffhookInit();
  }

  @action
  _setOffhookTerm() {
    this.isOffhooking = false;
    this.isOffhook = false;
    this.isManualOffhook = false;
  }

  @delegate('server')
  async setOffhookTerm() {
    this._setOffhookTerm();
  }

  @action
  _setIsManualOffhook(isManualOffhook: boolean) {
    this.isManualOffhook = isManualOffhook;
  }

  @delegate('server')
  async setIsManualOffhook(isManualOffhook: boolean) {
    this._setIsManualOffhook(isManualOffhook);
  }

  @action
  _setOffhook(status: boolean) {
    this.isOffhook = status;
    this._checkBeforeunload();
  }

  @delegate('server')
  async setOffhook(status: boolean) {
    this._setOffhook(status);
  }

  @action
  _setOffhooking(offhooking: boolean) {
    this.isOffhooking = offhooking;
  }

  @delegate('server')
  async setOffhooking(offhooking: boolean) {
    this._setOffhooking(offhooking);
  }

  // --- Delegated call data mutations (to EvCallDataSource) ---

  /**
   * Store raw call data (enriched with timestamp, gate, agentRecording).
   * Call is added to callIds/callsMapping when ADD_SESSION arrives.
   */
  async addNewCall(call: EvBaseCall) {
    await this.evCallDataSource.addNewCall(call);
  }

  /**
   * Add session, separating current agent vs other sessions.
   * Merges raw call data with session info into callsMapping.
   */
  async addNewSession(session: EvAddSessionNotification) {
    await this.evCallDataSource.addNewSession(session);
  }

  /**
   * Drop a session from otherCallIds (other agents' sessions).
   */
  async dropSession(dropSession: EvDropSessionNotification) {
    await this.evCallDataSource.dropSession(dropSession);
  }

  /**
   * Remove ended call from callIds/otherCallIds, move to callLogsIds,
   * and store endedCall data on callsMapping entry.
   */
  async removeEndedCall(endedCall: EvEndedCall) {
    await this.evCallDataSource.removeEndedCall(endedCall);
  }

  /**
   * Set call hold status (isHold) on callsMapping entry.
   */
  async setCallHoldStatus(res: EvHoldResponse) {
    await this.evCallDataSource.setCallHoldStatus(res);
  }

  /**
   * Clear active call IDs (callIds and otherCallIds).
   * Preserves callsMapping for call log data.
   */
  async clearCalls() {
    await this.evCallDataSource.clearCalls();
  }

  /**
   * Check if calls are limited
   */
  get callsLimited(): boolean {
    return this.evCallDataSource.callsLimited;
  }

  /**
   * Limit the number of call logs (max 250, 7-day retention)
   */
  async limitCalls() {
    await this.evCallDataSource.limitCalls();
  }

  // --- Recording settings ---

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

  // --- Initialization and subscriptions ---

  initialize() {
    this._bindSubscription();
  }

  private _bindSubscription() {
    this.evSubscription
      .subscribe(
        EvCallbackTypes.OFFHOOK_INIT,
        async (data: EvOffhookInitResponse) => {
          this.evPresenceEvents.emit(EvCallbackTypes.OFFHOOK_INIT, data);
          if (data.status === 'OK') {
            await this.setOffhookInit();
            this._checkBeforeunload();
          } else {
            if (this.showOffHookInitError) {
              this.toast.danger({
                message: t(messageTypes.OFFHOOK_INIT_ERROR),
              });
            }
            await this.setOffhookTerm();
            this._checkBeforeunload();
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
        async (data: EvOffhookTermResponse) => {
          // Fix: also handle 'Offhook terminated' message on logout
          if (data.status === 'OK' || data.message === 'Offhook terminated') {
            await this.setOffhookTerm();
            this._checkBeforeunload();
          } else {
            this.toast.danger({
              message: t(messageTypes.OFFHOOK_TERM_ERROR),
            });
            console.error(data);
          }
        },
      )
      .subscribe(EvCallbackTypes.ADD_SESSION, async (data: EvAddSessionNotification) => {
        if (data.status === 'OK') {
          await this.addNewSession(data);
          // Emit RINGING on evPresenceEvents for the public event API
          this.evPresenceEvents.emit(callStatus.RINGING, data);
          await this._checkCallStateChange();
        } else {
          this.toast.danger({
            message: t(messageTypes.ADD_SESSION_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.DROP_SESSION, async (data: any) => {
        if (data.status === 'OK') {
          await this.dropSession(data);
        } else {
          this.toast.danger({
            message: t(messageTypes.DROP_SESSION_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.HOLD, async (data: any) => {
        if (data.status === 'OK') {
          await this.setCallHoldStatus(data);
        } else {
          this.toast.danger({
            message: t(messageTypes.HOLD_ERROR),
          });
        }
      })
      .subscribe(EvCallbackTypes.NEW_CALL, async (data: EvBaseCall) => {
        await this.addNewCall(data);
      })
      .subscribe(EvCallbackTypes.END_CALL, async (data: EvEndedCall) => {
        const id = this.evClient.encodeUii(data);
        if (!this.callsMapping[id]) return;
        if (!this.isManualOffhook) {
          this.evClient.offhookTerm();
        }
        await this.removeEndedCall(data);
        await this._checkCallStateChange();
      });
  }

  // --- Beforeunload ---

  private _checkBeforeunload() {
    if (!this.portManager.isMainTab) {
      return;
    }
    if (this.isOffhook) {
      this.beforeunload.add(this.beforeunloadHandler);
    } else {
      this.beforeunload.remove(this.beforeunloadHandler);
    }
  }

  // --- Utility methods ---

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

  // --- Event registration ---

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
   * Check and emit call state change events (ANSWERED / ENDED)
   */
  private async _checkCallStateChange(): Promise<void> {
    const currentCalls = this.calls;
    if (currentCalls.length > this._oldCalls.length) {
      const currentCall = currentCalls[0];
      const mainCall = this.getMainCall(currentCall.uii);
      if (currentCall && mainCall) {
        this._oldCalls = currentCalls;
        this.evPresenceEvents.emit(callStatus.ANSWERED, currentCall);
      } else {
        await this.clearCalls();
      }
    } else if (currentCalls.length < this._oldCalls.length) {
      const call = this._oldCalls[0];
      this._oldCalls = currentCalls;
      this.evPresenceEvents.emit(callStatus.ENDED, call);
    }
  }

  /**
   * Bind beforeunload handler
   */
  bindBeforeunload(): void {
    this.beforeunload.add(this.beforeunloadHandler);
  }

  /**
   * Remove beforeunload handler
   */
  removeBeforeunload(): void {
    this.beforeunload.remove(this.beforeunloadHandler);
  }
}

export { EvPresence };

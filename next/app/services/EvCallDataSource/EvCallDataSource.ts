import {
  action,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  delegate,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';
import dayjs from 'dayjs';

import { callStatus } from '../../../enums';
import type {
  EvAddSessionNotification,
  EvBaseCall,
  EvDropSessionNotification,
  EvEndedCall,
  EvHoldResponse,
} from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import type {
  EvCallDataSourceOptions,
  EvCallData,
  EvRequeueCallGate,
  CallDataState,
} from './EvCallDataSource.interface';

/**
 * Get timestamp from date string
 * @param dateStr - Date string in format 'YYYY-MM-DD HH:mm:ss'
 * @param timezone - Timezone (default: America/New_York)
 */
function getTimeStamp(dateStr: string, timezone = 'America/New_York'): number {
  return dayjs(dateStr).valueOf();
}

const DEFAULT_DATA: CallDataState = {
  callIds: [],
  otherCallIds: [],
  callLogsIds: [],
  callsMapping: {},
  rawCallsMapping: {},
};

/**
 * EvCallDataSource module - Call data storage and management
 * Handles call data persistence, call logs, and call limiting
 */
@injectable({
  name: 'EvCallDataSource',
})
class EvCallDataSource extends RcModule {
  eventEmitter = new EventEmitter();

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private storagePlugin: StoragePlugin,
    @optional('EvCallDataSourceOptions')
    private evCallDataSourceOptions?: EvCallDataSourceOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  data: CallDataState = { ...DEFAULT_DATA };

  get callIds(): string[] {
    return this.data.callIds;
  }

  get otherCallIds(): string[] {
    return this.data.otherCallIds;
  }

  get callLogsIds(): string[] {
    return this.data.callLogsIds;
  }

  get callsMapping(): Record<string, EvCallData> {
    return this.data.callsMapping;
  }

  get rawCallsMapping(): Record<string, EvCallData> {
    return this.data.rawCallsMapping;
  }

  /**
   * Check if calls are limited
   */
  get callsLimited(): boolean {
    if (typeof window !== 'undefined') {
      return window.localStorage?.getItem('callsLimited') === 'true';
    }
    return false;
  }

  /**
   * Set calls limited flag
   */
  changeCallsLimited(value: boolean): void {
    if (typeof window !== 'undefined') {
      window.localStorage?.setItem('callsLimited', value?.toString());
    }
  }

  /**
   * Add a new call to raw calls mapping
   */
  @action
  _addNewCall(call: EvBaseCall): void {
    let rawAgentRecording = call?.agentRecording;
    if (rawAgentRecording) {
      rawAgentRecording = {
        ...rawAgentRecording,
        pause: rawAgentRecording.pause ? Number(rawAgentRecording.pause) : 0,
      };
    }
    // Note: rawCallsMapping index is raw call uii
    this.data.rawCallsMapping[call.uii] = {
      ...call,
      // Input timezone in second arg if EV response has timezone property
      // Default timezone is 'America/New_York'
      timestamp: getTimeStamp(call.queueDts),
      gate: this._getCurrentGateData(call),
      agentRecording: rawAgentRecording,
    } as EvCallData;
  }

  @delegate('server')
  async addNewCall(call: EvBaseCall): Promise<void> {
    this._addNewCall(call);
  }

  /**
   * Set a new session in call data
   */
  @action
  setNewSession(session: EvAddSessionNotification): void {
    const id = this.evClient.encodeUii(session);
    if (session.agentId === this.evAuth.agentId) {
      // Related to current agent session
      const index = this.callIds.indexOf(id);
      if (index === -1) {
        this.data.callIds.unshift(id);
      }
    } else {
      // Other session without current agent
      const index = this.otherCallIds.indexOf(id);
      if (index === -1) {
        this.data.otherCallIds.unshift(id);
      }
    }

    this.data.callsMapping[id] = {
      ...this.rawCallsMapping[session.uii],
      session,
    } as EvCallData;
  }

  /**
   * Add a new session and emit ringing event if applicable
   */
  @delegate('server')
  async addNewSession(session: EvAddSessionNotification): Promise<void> {
    await this.setNewSession(session);
    // Check with other phone - if agentId is empty, it's ringing
    if (session.agentId === '') {
      this.eventEmitter.emit(callStatus.RINGING, session);
    }
  }

  /**
   * Drop a session from other calls
   */
  @action
  _dropSession(dropSession: EvDropSessionNotification): void {
    const id = this._getCallEncodeId(dropSession);
    this.data.otherCallIds = this.otherCallIds.filter(
      (callId) => callId !== id,
    );
  }

  @delegate('server')
  async dropSession(dropSession: EvDropSessionNotification): Promise<void> {
    this._dropSession(dropSession);
  }

  /**
   * Remove an ended call and move to call logs
   */
  @action
  _removeEndedCall(endedCall: EvEndedCall): void {
    const id = this._getCallEncodeId(endedCall);
    // Remove current agent session call with uii
    this.data.callIds = this.callIds.filter((callId) => callId !== id);
    // Remove other call session with uii
    this.data.otherCallIds = this.otherCallIds.filter(
      (callId) => !callId.includes(endedCall.uii),
    );

    // Add call with id (encodeUii({ uii, sessionId }))
    const callLogsIndex = this.callLogsIds.indexOf(id);
    if (callLogsIndex === -1) {
      this.data.callLogsIds.unshift(id);
    }
    if (this.callsMapping[id]) {
      this.data.callsMapping[id].endedCall = JSON.parse(
        JSON.stringify(endedCall),
      );
    }
  }

  @delegate('server')
  async removeEndedCall(endedCall: EvEndedCall): Promise<void> {
    this._removeEndedCall(endedCall);
  }

  /**
   * Clear all active calls
   */
  @action
  _clearCalls(): void {
    this.data.callIds = [];
    this.data.otherCallIds = [];
  }

  @delegate('server')
  async clearCalls(): Promise<void> {
    this._clearCalls();
  }

  /**
   * Set call hold status
   */
  @action
  _setCallHoldStatus(res: EvHoldResponse): void {
    const id = this.evClient.encodeUii(res);
    if (this.data.callsMapping[id]) {
      this.data.callsMapping[id].isHold = res.holdState;
    }
  }

  @delegate('server')
  async setCallHoldStatus(res: EvHoldResponse): Promise<void> {
    this._setCallHoldStatus(res);
  }

  /**
   * Limit calls to max 250 and 7 days retention
   */
  @action
  _limitCalls(): void {
    const lastWeekDayTimestamp = this._getLastWeekDayTimestamp();
    const storageCallData: CallDataState = {
      callIds: [],
      otherCallIds: [],
      callLogsIds: [],
      callsMapping: {},
      rawCallsMapping: {},
    };

    const fullCallLogsIds = this.callLogsIds
      .slice(0, 250)
      .reduce<string[]>(
        (acc, curr) => [...acc, curr.substring(0, curr.length - 2)],
        [],
      );

    // Valid rawCallsMapping
    storageCallData.rawCallsMapping = Object.keys(this.rawCallsMapping).reduce(
      (acc, id) => {
        if (
          fullCallLogsIds.includes(id) &&
          getTimeStamp(this.rawCallsMapping[id].queueDts) >= lastWeekDayTimestamp
        ) {
          acc[id] = this.rawCallsMapping[id];
        }
        return acc;
      },
      {} as Record<string, EvCallData>,
    );

    // Valid callsMapping
    storageCallData.callsMapping = Object.keys(this.callsMapping).reduce(
      (acc, id) => {
        if (
          fullCallLogsIds.includes(id.substring(0, id.length - 2)) &&
          getTimeStamp(this.callsMapping[id].queueDts) >= lastWeekDayTimestamp
        ) {
          acc[id] = this.callsMapping[id];
          if (!id.endsWith('$1')) {
            storageCallData.callLogsIds.unshift(id);
          }
        }
        return acc;
      },
      {} as Record<string, EvCallData>,
    );

    this.data = storageCallData;
    this.changeCallsLimited(true);
  }

  @delegate('server')
  async limitCalls(): Promise<void> {
    this._limitCalls();
  }

  /**
   * Reset call data
   */
  @action
  _resetData(): void {
    this.data = { ...DEFAULT_DATA };
  }

  @delegate('server')
  async resetData(): Promise<void> {
    this._resetData();
  }

  private _getCallEncodeId(
    session: Partial<EvAddSessionNotification> | EvEndedCall,
  ): string {
    return this.evClient.encodeUii(session);
  }

  private _getCurrentGateData(call: Partial<EvCallData>): EvRequeueCallGate {
    const currentGateId = call.queue?.number || '';
    const currentQueueGroup = this.evAuth.availableRequeueQueues?.find(
      ({ gates }) => {
        return gates?.some(({ gateId }) => gateId === currentGateId);
      },
    );
    return {
      gateId: currentGateId,
      gateGroupId: currentQueueGroup?.gateGroupId,
    };
  }

  private _getLastWeekDayTimestamp(): number {
    const now = dayjs();
    const lastWeekDay = now.clone().subtract(7, 'days').startOf('day');
    return lastWeekDay.valueOf();
  }
}

export { EvCallDataSource };

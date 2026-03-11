import type { EvBaseCall, EvAddSessionNotification } from '../EvClient/interfaces';

/**
 * EvCallDataSource module interfaces
 */

export interface EvCallDataSourceOptions {
  // Options for EvCallDataSource module
}

export interface EvCallData extends EvBaseCall {
  timestamp?: number;
  gate?: EvRequeueCallGate;
  session?: EvAddSessionNotification;
  endedCall?: any;
  isHold?: boolean;
}

export interface EvRequeueCallGate {
  gateId: string;
  gateGroupId?: string;
}

export interface CallDataState {
  /** current agent ongoing session calls list with callId (encodeUii({ uii, sessionId })) */
  callIds: string[];
  /** other agent ongoing session calls list with callId (encodeUii({ uii, sessionId })) */
  otherCallIds: string[];
  /** ended calls list with callId (encodeUii({ uii, sessionId })) */
  callLogsIds: string[];
  /** mapping data with call session callId (encodeUii({ uii, sessionId })) */
  callsMapping: Record<string, EvCallData>;
  /** mapping data without call session data with uii */
  rawCallsMapping: Record<string, EvCallData>;
}

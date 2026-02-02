import type { EvAddSessionNotification, EvBaseCall } from '../EvClient/interfaces';

/**
 * EvCallMonitor module interfaces
 */

export interface EvCallMonitorOptions {
  // Options for EvCallMonitor module
}

export interface EvCallData extends EvBaseCall {
  contactMatches?: any[];
  activityMatches?: any[];
  recordingUrl?: string;
  agentName?: string | null;
}

export type OnCallRingingCallback = (session?: EvAddSessionNotification) => void;
export type OnCallAnsweredCallback = (currentCall?: EvCallData) => void;
export type OnCallEndedCallback = (currentCall?: EvCallData) => void;

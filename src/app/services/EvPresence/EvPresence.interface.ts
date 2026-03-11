import type { DialoutStatusesType } from '../../../enums';

/**
 * EvPresence options for configuration
 */
export interface EvPresenceOptions {
  // Optional configuration options
}

/**
 * Recording settings interface
 */
export interface EvAgentRecording {
  agentRecording: boolean;
  default: string;
  pause: boolean;
}

/**
 * Call ringing callback type
 */
export type OnCallRingingCallback = (session?: {
  sessionId: string;
  uii?: string;
}) => void;

/**
 * Call answered callback type
 */
export type OnCallAnsweredCallback = (currentCall?: any) => void;

/**
 * Call ended callback type
 */
export type OnCallEndedCallback = (currentCall?: any) => void;

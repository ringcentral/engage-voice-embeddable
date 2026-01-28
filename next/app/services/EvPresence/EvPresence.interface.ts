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

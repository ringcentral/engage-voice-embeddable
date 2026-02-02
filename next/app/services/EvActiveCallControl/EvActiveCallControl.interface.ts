/**
 * EvActiveCallControl module interfaces
 */

export interface EvActiveCallControlOptions {
  // Options for EvActiveCallControl module
}

export interface EvClientHangUpParams {
  sessionId: string;
}

export interface EvClientHoldSessionParams {
  sessionId: string;
  state: boolean;
}

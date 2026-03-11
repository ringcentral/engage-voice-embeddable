import type { EvClientCallMapping } from './interfaces';

/**
 * EvClient options for configuration (extends the base options with required callbacks)
 */
export interface EvClientServiceOptions {
  options: {
    authHost: string;
    localTesting: boolean;
    allowMultiSocket: boolean;
    isSecureSocket: boolean;
  };
  callbacks: {
    closeResponse: () => void;
    openResponse: (response: EvClientCallMapping['openResponse']) => void;
  };
}

/**
 * Transfer call parameters
 */
export interface EvClientTransferParams {
  dialDest: string;
  callerId?: string;
  sipHeaders?: string[];
  countryId?: string;
}

/**
 * Hangup call parameters
 */
export interface EvClientHangUpParams {
  sessionId: string;
  resetPendingDisp?: boolean;
}

/**
 * Hold session parameters
 */
export interface EvClientHoldSessionParams {
  state: boolean;
  sessionId: string;
}

/**
 * Manual outdial parameters
 */
export interface EvClientManualOutdialParams {
  destination: string;
  callerId: string;
  ringTime: number;
  queueId: string;
  countryId: string;
}

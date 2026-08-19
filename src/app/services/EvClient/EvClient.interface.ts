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
 * Identity values that live on the Agent SDK instance (or its local storage)
 * rather than in module state, so they are only readable on the main client.
 */
export interface EvAgentIdentity {
  /** Engage token used for RingCX HTTP requests. */
  engageAccessToken: string;
  /** Engage platform id, e.g. `aws91-l26`. */
  platformId: string;
  mainAccountId: string;
  /** RingCentral extension id of the logged in agent. */
  rcUserId: string;
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

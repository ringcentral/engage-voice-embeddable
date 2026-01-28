import type {
  EvClientCallMapping,
  EvAgentOptions,
} from '../../../lib/EvClient/interfaces';

/**
 * EvClient options for configuration
 */
export interface EvClientOptions {
  options: EvAgentOptions;
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

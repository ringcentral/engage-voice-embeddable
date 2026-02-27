import type { EvAgentData, EvTokenType } from '../EvClient/interfaces';

/**
 * EvAuth options for configuration
 */
export interface EvAuthOptions {
  // Optional configuration options
}

/**
 * State interface for EvAuth
 */
export interface EvAuthState {
  agent: EvAgentData | null;
}

/**
 * Parameters for authenticateWithToken
 */
export interface AuthenticateWithTokenParams {
  rcAccessToken?: string;
  tokenType?: EvTokenType;
  shouldEmitAuthSuccess?: boolean;
}

/**
 * Parameters for openSocketWithSelectedAgentId
 */
export interface OpenSocketParams {
  syncOtherTabs?: boolean;
  retryOpenSocket?: boolean;
}

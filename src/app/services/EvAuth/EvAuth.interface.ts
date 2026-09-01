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

/**
 * Parameters for loginAgent
 */
export interface LoginAgentParams {
  /**
   * Resume the session the server already holds for this agent, instead of
   * starting a new one, so an in-flight call or pending disposition is handed
   * back rather than orphaned. Only effective on an SDK instance that has
   * already completed a login in this page.
   */
  tryRejoin?: boolean;
  /**
   * On a failed socket open, re-authenticate and retry the open once instead
   * of logging the agent out immediately.
   */
  retryOpenSocket?: boolean;
}

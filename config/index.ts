import type { BrandConfig } from '@ringcentral-integration/commons/modules/Brand';
import type { BaseAppConfig } from '@ringcentral-integration/next-integration/interfaces';

import rc from './rc';

/**
 * Engage Voice Agent SDK configuration
 */
export interface EvAgentConfig {
  localTesting: boolean;
  isSecureSocket: boolean;
  allowMultiSocket: boolean;
  authHost: string;
  clientAppType: string;
  clientAppVersion: string;
  componentName: string;
  isI18nEnabled: boolean;
}

/**
 * Agent Assistant (AI Assistant) side widget configuration
 */
export interface AgentAssistantConfig {
  /** RingCentral client id the interop auth code is minted for. */
  clientId: string;
  /** Page hosting the Agent Assistant bundle. */
  pageUrl: string;
}

export interface AppConfig extends BaseAppConfig {
  brandConfig: BrandConfig;
  evAgentConfig: EvAgentConfig;
  agentAssistantConfig: AgentAssistantConfig;
}

export const appConfig = rc;

export { BrandConfig };

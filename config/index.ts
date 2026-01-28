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

export interface AppConfig extends BaseAppConfig {
  brandConfig: BrandConfig;
  evAgentConfig: EvAgentConfig;
}

export const appConfig = rc;

export { BrandConfig };

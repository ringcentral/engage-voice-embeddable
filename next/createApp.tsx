import { createSharedApp } from '@ringcentral-integration/next-core';
import { getAppConfig } from './app/getAppConfig';

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

export interface AppConfig {
  appVersion: string;
  prefix: string;
  brandConfig: {
    appName: string;
    defaultLocale: string;
    code: string;
  };
  sdkConfig: {
    clientId: string;
    clientSecret?: string;
    server: string;
    discoveryServer?: string;
    enableDiscovery?: boolean;
  };
  evAgentConfig: EvAgentConfig;
  analyticsKey: string;
}

/**
 * Create the Engage Voice Embeddable application
 */
export const createApp = async (
  options?: Parameters<typeof createSharedApp>[0]['share'],
  additionalModules: Parameters<typeof createSharedApp>[0]['modules'] = [],
  fromPopup = false,
) => {
  const config = process.env.APP_CONFIG;
  const {
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
    analyticsKey,
  } = config as AppConfig;

  if (typeof document !== 'undefined') {
    window.evAuthHost = evAgentConfig.authHost;
  }

  const appConfig = getAppConfig({
    appVersion: '0.0.1',
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
    modules: additionalModules,
    share: options ?? {
      name: 'cx-embeddable',
      type: 'Base',
    },
    analyticsKey,
    fromPopup,
  });

  const app = await createSharedApp(appConfig);

  return app;
};

export default createApp;

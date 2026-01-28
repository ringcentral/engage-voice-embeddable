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
}

/**
 * Create the Engage Voice Embeddable application
 */
export const createApp = async (
  config: AppConfig,
  options?: Parameters<typeof createSharedApp>[0]['share'],
  additionalModules: Parameters<typeof createSharedApp>[0]['modules'] = [],
) => {
  const {
    appVersion,
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
  } = config;

  const appConfig = getAppConfig({
    appVersion,
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
    modules: additionalModules,
    share: options ?? {
      name: 'ev-embeddable',
      type: 'Base',
    },
  });

  const app = await createSharedApp(appConfig);

  return app;
};

/**
 * Run the application in standalone mode
 */
export const runApp = async (config: AppConfig) => {
  const app = await createApp(config);

  if (typeof document !== 'undefined') {
    const container = document.getElementById('app');
    if (container) {
      app.bootstrap(container);
    }
  }

  return app;
};

export default createApp;

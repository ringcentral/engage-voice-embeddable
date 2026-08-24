import { createSharedApp } from '@ringcentral-integration/next-core';
import { getAppConfig } from './app/getAppConfig';
import { parseUri } from './lib/Adapter/parseUri';

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
  clientId: string;
  pageUrl: string;
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
  agentAssistantConfig: AgentAssistantConfig;
  analyticsKey: string;
}

interface UrlParams {
  clientId?: string;
  clientSecret?: string;
  rcServer?: string;
  evServer?: string;
  disableLoginPopup?: boolean;
  jwt?: string;
  jwtOwnerId?: string;
  redirectUri?: string;
  hideCallNote?: boolean;
  fromPopup?: boolean;
  enableSideWidget?: boolean;
  enableAgentScript?: boolean;
}

function parseBooleanParam(value: string | undefined): boolean {
  return value === '1' || value === 'true';
}

function readUrlParams(): UrlParams {
  const href =
    typeof window !== 'undefined'
      ? window.location.href
      : typeof self !== 'undefined'
        ? self.location.href
        : '';
  const params = parseUri(href);
  return {
    clientId: params.clientId || undefined,
    clientSecret: params.clientSecret || undefined,
    rcServer: params.rcServer || undefined,
    evServer: params.evServer || undefined,
    disableLoginPopup: parseBooleanParam(params.disableLoginPopup),
    jwt: params.jwt || undefined,
    jwtOwnerId: params.jwtOwnerId || undefined,
    redirectUri: params.redirectUri || undefined,
    hideCallNote: parseBooleanParam(params.hideCallNote),
    fromPopup: parseBooleanParam(params.fromPopup),
    enableSideWidget: parseBooleanParam(params.enableSideWidget),
    enableAgentScript: parseBooleanParam(params.enableAgentScript),
  };
}

/**
 * Create the Engage Voice Embeddable application
 */
export const createApp = async (
  options?: Parameters<typeof createSharedApp>[0]['share'],
  additionalModules: Parameters<typeof createSharedApp>[0]['modules'] = [],
) => {
  const config = process.env.APP_CONFIG;
  const {
    prefix,
    brandConfig,
    sdkConfig,
    evAgentConfig,
    agentAssistantConfig,
    analyticsKey,
    analyticsSecretKey,
  } = config as AppConfig;

  const urlParams =
    typeof window !== 'undefined' || typeof self !== 'undefined'
      ? readUrlParams()
      : ({} as UrlParams);

  const mergedSdkConfig = {
    ...sdkConfig,
    ...(urlParams.clientId && { clientId: urlParams.clientId }),
    ...(urlParams.clientSecret && { clientSecret: urlParams.clientSecret }),
    ...(urlParams.rcServer && { server: urlParams.rcServer }),
  };

  const mergedEvAgentConfig = {
    ...evAgentConfig,
    ...(urlParams.evServer && { authHost: urlParams.evServer }),
  };

  if (typeof document !== 'undefined') {
    window.evAuthHost = mergedEvAgentConfig.authHost;
  }
  const appVersion = process.env.APP_VERSION;

  const appConfig = getAppConfig({
    appVersion,
    prefix,
    brandConfig,
    sdkConfig: mergedSdkConfig,
    evAgentConfig: mergedEvAgentConfig,
    agentAssistantConfig,
    modules: additionalModules,
    share: options ?? {
      name: 'cx-embeddable',
      type: 'Base',
    },
    analyticsKey,
    analyticsSecretKey,
    disableLoginPopup: urlParams.disableLoginPopup,
    redirectUri: urlParams.redirectUri,
    jwt: urlParams.jwt,
    jwtOwnerId: urlParams.jwtOwnerId,
    hideCallNote: urlParams.hideCallNote,
    fromPopup: urlParams.fromPopup,
    enableSideWidget: urlParams.enableSideWidget,
    enableAgentScript: urlParams.enableAgentScript,
  });

  const app = await createSharedApp(appConfig);

  return app;
};

export default createApp;

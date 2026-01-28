import type { AppConfig } from '..';
import { brandConfig } from './brandConfig';

export default {
  brandConfig,
  sdkConfig: {
    clientId: process.env.RINGCENTRAL_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
    server: process.env.RINGCENTRAL_SERVER_URL,
  },
  evAgentConfig: {
    localTesting: false,
    isSecureSocket: true,
    allowMultiSocket: true,
    authHost: process.env.ENGAGE_VOICE_AUTH_SERVER || '',
    clientAppType: 'RCX_Embeddable',
    clientAppVersion: '0.3.0',
    componentName: 'EAG',
    isI18nEnabled: false,
  },
  analyticsKey: process.env.MIXPANEL_KEY || '',
  enableIDB: false,
  version: {
    buildHash: process.env.BUILD_HASH,
    releaseVersion: process.env.RELEASE_VERSION,
    appVersion: process.env.BUILD_HASH
      ? `${process.env.APP_VERSION} (${process.env.BUILD_HASH})`
      : process.env.RELEASE_VERSION,
  },
  prefix: 'ringcx-embeddable',
} as AppConfig;

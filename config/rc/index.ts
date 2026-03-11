import type { AppConfig } from '..';
import { brandConfig } from './brandConfig';
import { version as packageVersion } from '../../package.json';
const version = process.env.APP_VERSION || packageVersion;

export default {
  brandConfig,
  sdkConfig: {
    clientId: process.env.RINGCENTRAL_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
    server: process.env.RINGCENTRAL_SERVER,
  },
  evAgentConfig: {
    localTesting: false,
    isSecureSocket: true,
    allowMultiSocket: true,
    authHost: process.env.ENGAGE_VOICE_AUTH_SERVER || '',
    clientAppType: 'RCX_Embeddable',
    clientAppVersion: version,
    componentName: 'EAG',
    isI18nEnabled: false,
  },
  analyticsKey: process.env.MIXPANEL_KEY || '',
  enableIDB: false,
  version: {
    buildHash: process.env.BUILD_HASH,
    releaseVersion: version,
    appVersion: process.env.BUILD_HASH
      ? `${version} (${process.env.BUILD_HASH})`
      : version,
  },
  prefix: 'cx-embeddable',
} as AppConfig;

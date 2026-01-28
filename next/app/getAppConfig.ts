import type { BrandConfig as BaseBrandConfig } from '@ringcentral-integration/commons/modules/Brand';
import type { SDKConfig } from '@ringcentral-integration/commons/lib/createSdkConfig';
import type {
  IRouterOptions,
  ISharedAppOptions,
} from '@ringcentral-integration/next-core';
import {
  createMemoryHistory,
  render,
  RouterOptions,
  RouterPlugin,
  StoragePlugin,
} from '@ringcentral-integration/next-core';
import {
  BlockPlugin,
  SpringThemePlugin,
  ThemePlugin,
} from '@ringcentral-integration/micro-core/src/app/plugins';
import type {
  BrandConfig,
  LocaleOptions,
} from '@ringcentral-integration/micro-core/src/app/services';
import {
  Brand,
  Locale,
} from '@ringcentral-integration/micro-core/src/app/services';

import { AppView } from '../AppView';

// Services
import {
  EvClient,
  EvSubscription,
  EvAuth,
  EvAgentSession,
  EvSettings,
  EvWorkingState,
  EvCall,
  EvIntegratedSoftphone,
  EvPresence,
  Environment,
  EvCallDisposition,
  EvCallHistory,
  EvTransferCall,
  EvLeads,
  Adapter,
  Analytics,
  ThirdPartyService,
  EvTabManager,
  OAuth,
} from './services';

// Views
import {
  MainView,
  SessionConfigView,
  DialerView,
  ActivityCallView,
  CallHistoryView,
  LeadsView,
  ManualDialSettingsView,
} from './view';

/**
 * Engage Voice Agent SDK configuration
 */
interface EvAgentConfig {
  localTesting: boolean;
  isSecureSocket: boolean;
  allowMultiSocket: boolean;
  authHost: string;
  clientAppType: string;
  clientAppVersion: string;
  componentName: string;
  isI18nEnabled: boolean;
}

interface CreateAppEntryOptions {
  appVersion: string;
  prefix?: string;
  brandConfig: BaseBrandConfig;
  sdkConfig: SDKConfig;
  evAgentConfig: EvAgentConfig;
  modules?: any[];
  share: ISharedAppOptions;
}

/**
 * Create app entry configuration for Engage Voice Embeddable
 */
export const getAppConfig = ({
  appVersion,
  prefix = 'ev-embeddable',
  brandConfig,
  sdkConfig,
  evAgentConfig,
  modules = [],
  share,
}: CreateAppEntryOptions) => {
  const { defaultLocale } = brandConfig;

  // Core plugins
  const plugins = [
    SpringThemePlugin,
    StoragePlugin,
    RouterPlugin,
    ThemePlugin,
    BlockPlugin,
  ];

  // Core services
  const coreServices = [
    Brand,
    Locale,
    {
      provide: RouterOptions,
      useValue: {
        createHistory: () => createMemoryHistory(),
      } satisfies IRouterOptions,
    },
    {
      provide: 'LocaleOptions',
      useValue: {
        defaultLocale,
      } satisfies LocaleOptions,
    },
    {
      provide: 'Prefix',
      useValue: prefix,
    },
    {
      provide: 'BrandConfig',
      useValue: { ...brandConfig },
    },
    {
      provide: 'SdkConfig',
      useValue: {
        ...sdkConfig,
        appVersion,
        appName: brandConfig.appName as string,
        cachePrefix: `sdk-${prefix}`,
      } satisfies SDKConfig,
    },
  ];

  // Engage Voice services
  const evServices = [
    EvClient,
    EvSubscription,
    EvAuth,
    EvAgentSession,
    EvSettings,
    EvWorkingState,
    EvCall,
    EvIntegratedSoftphone,
    EvPresence,
    Environment,
    EvCallDisposition,
    EvCallHistory,
    EvTransferCall,
    EvLeads,
    Adapter,
    Analytics,
    ThirdPartyService,
    EvTabManager,
    OAuth,
    {
      provide: 'EvClientOptions',
      useValue: {
        options: {
          authHost: evAgentConfig.authHost,
          localTesting: evAgentConfig.localTesting,
          isSecureSocket: evAgentConfig.isSecureSocket,
          allowMultiSocket: evAgentConfig.allowMultiSocket,
          clientAppType: evAgentConfig.clientAppType,
          clientAppVersion: evAgentConfig.clientAppVersion,
          componentName: evAgentConfig.componentName,
          isI18nEnabled: evAgentConfig.isI18nEnabled,
        },
        callbacks: {
          closeResponse: () => {
            console.log('Socket closed');
          },
          openResponse: () => {
            console.log('Socket opened');
          },
        },
      },
    },
  ];

  // Engage Voice views
  const evViews = [
    MainView,
    SessionConfigView,
    DialerView,
    ActivityCallView,
    CallHistoryView,
    LeadsView,
    ManualDialSettingsView,
  ];

  return {
    modules: [
      ...plugins,
      ...coreServices,
      ...evServices,
      ...evViews,
      ...modules,
    ],
    main: AppView,
    render,
    share,
  };
};

import {
  createMemoryHistory,
  render,
  RouterOptions,
  RouterPlugin,
  StoragePlugin,
  IRouterOptions,
  ISharedAppOptions,
} from '@ringcentral-integration/next-core';
import {
  BlockPlugin,
  SpringThemePlugin,
  ThemePlugin,
} from '@ringcentral-integration/micro-core/src/app/plugins';
import {
  BrandConfig,
  LocaleOptions,
  Brand,
  Locale,
  Toast,
} from '@ringcentral-integration/micro-core/src/app/services';
import {
  HeaderNavViewSpring,
  SpringAppRootView,
} from '@ringcentral-integration/micro-core/src/app/views';
import {
  Auth,
  RateLimiter,
  AuthOptions,
  OAuthOptions,
  OAuth,
} from '@ringcentral-integration/micro-auth/src/app/services';

import { AppView } from '../AppView';

/**
 * Brand configuration interface
 */
export interface BaseBrandConfig {
  id: string;
  code: string;
  name: string;
  appName: string;
  fullName?: string;
  defaultLocale?: string;
  supportedLocales?: string[];
}

/**
 * SDK configuration interface
 */
export interface SDKConfig {
  server?: string;
  clientId?: string;
  clientSecret?: string;
  appVersion?: string;
  appName?: string;
  cachePrefix?: string;
  brandId?: string;
  redirectUri?: string;
}

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
  TabManager,
  Redirect,
  // OAuth,
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
  ChooseAccountView,
  SessionUpdateView,
  SettingsView,
  TransferCallView,
  TransferInternalView,
  TransferPhoneBookView,
  TransferManualEntryView,
  RequeueCallGroupView,
  RequeueCallGroupItemView,
  ActiveCallListView,
  CallHistoryDetailView,
  LoginView,
  LoginViewOptions,
} from './views';

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
  disableLoginPopup?: boolean;
  redirectUri?: string;
  jwt?: string;
  jwtOwnerId?: string;
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
  disableLoginPopup = false,
  redirectUri = './redirect.html',
  jwt = '',
  jwtOwnerId = '',
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
    Toast,
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
      } as SDKConfig,
    },
    {
      provide: 'OAuthOptions',
      useValue: {
        extralUIOptions: ['hide_remember_me', 'hide_tos', '-old_ui'],
        disableLoginPopup,
        redirectUri,
        jwt,
        jwtOwnerId,
      } satisfies OAuthOptions,
    },
    {
      provide: 'AuthOptions',
      useValue: { usePKCE: true } satisfies AuthOptions,
    },
    Auth,
    RateLimiter,
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
    TabManager,
    OAuth,
    Redirect,
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
    {
      provide: 'EvSubscriptionOptions',
      useValue: {},
    }
  ];

  // Core views
  const coreViews = [
    SpringAppRootView,
    HeaderNavViewSpring,
    LoginView,
    {
      provide: 'LoginViewOptions',
      useValue: {
        routeAfterLogin: '/sessionConfig',
      } satisfies LoginViewOptions,
    }
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
    // New views
    ChooseAccountView,
    SessionUpdateView,
    SettingsView,
    TransferCallView,
    TransferInternalView,
    TransferPhoneBookView,
    TransferManualEntryView,
    RequeueCallGroupView,
    RequeueCallGroupItemView,
    ActiveCallListView,
    CallHistoryDetailView,
  ];

  return {
    modules: [
      ...plugins,
      ...coreServices,
      ...evServices,
      ...coreViews,
      ...evViews,
      ...modules,
    ],
    main: AppView,
    render,
    share,
  };
};

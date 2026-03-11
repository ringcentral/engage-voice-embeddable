import {
  createMemoryHistory,
  render,
  RouterOptions,
  RouterPlugin,
  StoragePlugin,
  StorageOptions,
  IRouterOptions,
  ISharedAppOptions,
  IStorageOptions,
  PortManagerOptions,
} from '@ringcentral-integration/next-core';
import {
  BlockPlugin,
  SpringThemePlugin,
  ThemePlugin,
} from '@ringcentral-integration/micro-core/src/app/plugins';
import {
  LocaleOptions,
  Brand,
  Locale,
  Toast,
  Beforeunload,
  BrandConfigOptions,
} from '@ringcentral-integration/micro-core/src/app/services';
import {
  SpringAppRootView,
  HeaderNavViewSpring,
  HeaderNavViewOptions,
  SyncTabView,
  ModalView,
} from '@ringcentral-integration/micro-core/src/app/views';
import {
  Auth,
  RateLimiter,
  AuthOptions,
  OAuthOptions,
  OAuth,
  ConnectivityMonitor,
  ConnectivityManager,
} from '@ringcentral-integration/micro-auth/src/app/services';
import {
  ContactMatcher,
} from '@ringcentral-integration/micro-contacts/src/app/services/ContactMatcher';
import {
  ActivityMatcher,
} from '@ringcentral-integration/micro-contacts/src/app/services/ActivityMatcher';

import { AppView } from './AppView';

// Services
import {
  Auth as AuthExt,
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
  AnalyticsOptions,
  OAuth as OAuthWithJWT,
  EvTabManagerOptions,
} from './services';

// Views
import {
  HeaderView,
  HeaderNavViewSpring as HeaderNavView,
  SessionConfigView,
  DialerView,
  ActiveCallView,
  DispositionView,
  CallHistoryView,
  LeadsView,
  ManualDialSettingsView,
  ChooseAccountView,
  SessionUpdateView,
  SettingsView,
  TransferView,
  ActiveCallListView,
  CallHistoryDetailView,
  LoginView,
  LoginViewOptions,
  AgentView,
  MultiLoginView,
  SessionConfigViewOptions,
  WorkingStateSelectView,
  OffhookButtonView,
  EvIntegratedSoftphoneView,
  ConnectivityView,
  DispositionViewOptions,
  ActiveCallViewOptions,
} from './views';

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
  hideCallNote?: boolean;
  fromPopup?: boolean;
  appVersion: string;
  prefix?: string;
  brandConfig: BaseBrandConfig;
  sdkConfig: SDKConfig;
  evAgentConfig: EvAgentConfig;
  modules?: any[];
  share: ISharedAppOptions;
  analyticsKey: string;
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
  hideCallNote = false,
  fromPopup = false,
  analyticsKey,
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
    Beforeunload,
    {
      provide: 'BeforeunloadOptions',
      useValue: {
        originWindow: typeof window !== 'undefined' ? window : globalThis,
      } satisfies BeforeunloadOptions,
    },
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
      provide: 'PortManagerOptions',
      useValue: {
        disableAutoPickMainTab: true,
      } satisfies PortManagerOptions,
    },
    {
      provide: 'BrandConfigOptions',
      useValue: {
        assetOrigin: process.env.HOSTING_URL,
      } satisfies BrandConfigOptions,
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
    {
      provide: Auth,
      useClass: AuthExt,
    },
    RateLimiter,
    {
      provide: StorageOptions,
      useValue: {
        disableClientRehydrated: false,
      } satisfies IStorageOptions,
    },
    ConnectivityMonitor,
    ConnectivityManager,
    ContactMatcher,
    ActivityMatcher,
    {
      provide: 'SettingsViewOptions',
      useValue: {
        version: appVersion,
      },
    }
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
    {
      provide: 'EvTabManagerOptions',
      useValue: {
        fromPopup,
      } satisfies EvTabManagerOptions,
    },
    {
      provide: OAuth,
      useClass: OAuthWithJWT,
    },
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
    },
    {
      provide: 'HeaderNavViewOptions',
      useValue: {} satisfies HeaderNavViewOptions,
    },
  ];

  // Core views
  const coreViews = [
    SpringAppRootView,
    SyncTabView,
    {
      provide: HeaderNavViewSpring,
      useClass: HeaderNavView,
    },
    LoginView,
    {
      provide: 'LoginViewOptions',
      useValue: {
        routeAfterLogin: '/sessionConfig',
      } satisfies LoginViewOptions,
    },
    HeaderView,
    ModalView,
    ConnectivityView,
  ];

  // Engage Voice views
  const evViews = [
    SessionConfigView,
    DialerView,
    ActiveCallView,
    DispositionView,
    CallHistoryView,
    LeadsView,
    ManualDialSettingsView,
    AgentView,
    // New views
    ChooseAccountView,
    SessionUpdateView,
    SettingsView,
    TransferView,
    ActiveCallListView,
    CallHistoryDetailView,
    MultiLoginView,
    WorkingStateSelectView,
    OffhookButtonView,
    EvIntegratedSoftphoneView,
    {
      provide: 'AnalyticsOptions',
      useValue: {
        analyticsKey,
        enableMixpanel: true,
      } satisfies AnalyticsOptions,
    },
    {
      provide: 'SessionConfigViewOptions',
      useValue: {
        showReChooseAccount: true,
      } satisfies SessionConfigViewOptions,
    },
    {
      provide: 'DispositionViewOptions',
      useValue: {
        hideCallNote,
      } satisfies DispositionViewOptions,
    },
    {
      provide: 'ActiveCallViewOptions',
      useValue: {
        hideCallNote,
      } satisfies ActiveCallViewOptions,
    },
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

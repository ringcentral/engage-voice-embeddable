import {
  createMemoryHistory,
  render,
  type RootOptions,
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
  EvAudioSettings,
  type EvAudioSettingsOptions,
  EvPresence,
  EvAgentScript,
  EvAgentAssistant,
  SideWidget,
  type SideWidgetOptions,
  Environment,
  EvCallDisposition,
  EvCallHistory,
  EvTransferCall,
  EvLeads,
  Adapter,
  Analytics,
  ThirdParty,
  TabManager,
  Redirect,
  AnalyticsOptions,
  OAuth as OAuthWithJWT,
  EvTabManagerOptions,
  EvWorkingStateOptions,
  EvAgentAssistantOptions,
  EvAgentScriptOptions,
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
  InitializeAudioView,
  SideWidgetView,
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

/**
 * Agent Assistant (AI Assistant) side widget configuration
 */
interface AgentAssistantConfig {
  clientId: string;
  pageUrl: string;
}

interface CreateAppEntryOptions {
  disableLoginPopup?: boolean;
  redirectUri?: string;
  jwt?: string;
  jwtOwnerId?: string;
  hideCallNote?: boolean;
  fromPopup?: boolean;
  enableSideWidget?: boolean;
  enableAgentScript?: boolean;
  enableAudioInitPrompt?: boolean;
  appVersion: string;
  prefix?: string;
  brandConfig: BaseBrandConfig;
  sdkConfig: SDKConfig;
  evAgentConfig: EvAgentConfig;
  agentAssistantConfig: AgentAssistantConfig;
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
  agentAssistantConfig,
  modules = [],
  share,
  disableLoginPopup = false,
  redirectUri = './redirect.html',
  jwt = '',
  jwtOwnerId = '',
  hideCallNote = false,
  fromPopup = false,
  enableSideWidget = false,
  enableAgentScript = false,
  enableAudioInitPrompt = false,
  analyticsKey,
  analyticsSecretKey,
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
      provide: 'RootOptions',
      useValue: {
        // Keep the main column at the widget's 300px when a side widget expands
        // the app; the framework default is 344px. Frame resizing is handled by
        // `SideWidget` via `Adapter.setExpanded`, not by `onExpand`, because this
        // is a plain value with no access to DI.
        expandedLayoutMainClass: 'w-[300px] min-w-[300px] max-w-[300px]',
      } satisfies RootOptions,
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
    EvAudioSettings,
    EvPresence,
    EvAgentScript,
    EvAgentAssistant,
    SideWidget,
    Environment,
    EvCallDisposition,
    EvCallHistory,
    EvTransferCall,
    EvLeads,
    Adapter,
    Analytics,
    ThirdParty,
    TabManager,
    {
      provide: 'EvTabManagerOptions',
      useValue: {
        fromPopup,
      } satisfies EvTabManagerOptions,
    },
    {
      provide: 'EvAudioSettingsOptions',
      useValue: {
        enableAudioInitPrompt,
      } satisfies EvAudioSettingsOptions,
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
      provide: 'EvAgentScriptOptions',
      useValue: {
        enabled: enableAgentScript,
      } satisfies EvAgentScriptOptions,
    },
    {
      provide: 'EvAgentAssistantOptions',
      useValue: {
        clientId: agentAssistantConfig?.clientId,
        pageUrl: agentAssistantConfig?.pageUrl,
      } satisfies EvAgentAssistantOptions,
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
    InitializeAudioView,
    SideWidgetView,
    {
      provide: 'AnalyticsOptions',
      useValue: {
        analyticsKey,
        analyticsSecretKey,
        enableMixpanel: true,
        appVersion,
        externalClientId: sdkConfig.clientId,
      } satisfies AnalyticsOptions,
    },
    {
      provide: 'SessionConfigViewOptions',
      useValue: {
        showReChooseAccount: true,
      } satisfies SessionConfigViewOptions,
    },
    {
      provide: 'EvWorkingStateOptions',
      useValue: {
        hideCallNote,
      } satisfies EvWorkingStateOptions,
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
    {
      provide: 'SideWidgetOptions',
      useValue: {
        // The popped-out window is the exception: its host adapter honours the
        // wider frame, but the window itself stays narrow and clips the overflow
        // with no scrollbar, so trusting the flag there would put the widget
        // somewhere the agent cannot reach.
        enableSideWidget: enableSideWidget && !fromPopup,
      } satisfies SideWidgetOptions,
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

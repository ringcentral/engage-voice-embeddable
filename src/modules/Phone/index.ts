import '@ringcentral-integration/commons/lib/TabFreezePrevention';

import { messageTypes } from '@ringcentral-integration/engage-voice-widgets/enums';
import { EvCallbackTypes } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums';
import { dialoutStatuses } from '@ringcentral-integration/engage-voice-widgets/enums/dialoutStatus';
import { contactMatchIdentifyEncode } from '@ringcentral-integration/engage-voice-widgets/lib/contactMatchIdentify';
// import { evStatus } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums/evStatus';
import { EvActiveCallControl } from '@ringcentral-integration/engage-voice-widgets/modules/EvActiveCallControl';
import { EvActiveCallListUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvActiveCallListUI';
import { EvAgentScript } from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentScript';
// import { EvAuth } from '@ringcentral-integration/engage-voice-widgets/modules/EvAuth';
import { EvCallDataSource } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDataSource';
import { EvCallDisposition } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDisposition';
import { EvCallMonitor } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallMonitor';
import { EvDialerUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvDialerUI';
import { EvManualDialSettingsUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvManualDialSettingsUI';
import { EvRequeueCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvRequeueCall';
import { EvSettings } from '@ringcentral-integration/engage-voice-widgets/modules/EvSettings';
import { EvSettingsUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvSettingsUI';
import { EvSubscription } from '@ringcentral-integration/engage-voice-widgets/modules/EvSubscription';
import { EvTransferCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvTransferCall';
import { EvTransferCallUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvTransferCallUI';
import { EvWorkingState } from '@ringcentral-integration/engage-voice-widgets/modules/EvWorkingState';
import { EvChooseAccountUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvChooseAccountUI';
import { MainViewUI } from '@ringcentral-integration/engage-voice-widgets/modules/MainViewUI';

import { SDK } from '@ringcentral/sdk';
import { RingCentralClient } from '@ringcentral-integration/commons/lib/RingCentralClient';
import { sleep, waitUntil } from '@ringcentral-integration/utils';
import { TabManagerOptions } from '@ringcentral-integration/commons/modules/TabManager';
import { ModuleFactory } from '@ringcentral-integration/commons/lib/di';
import { LocalForageStorage } from '@ringcentral-integration/commons/lib/LocalForageStorage';
import RcModule from '@ringcentral-integration/commons/lib/RcModule';
import { ActivityMatcher } from '@ringcentral-integration/commons/modules/ActivityMatcher';
import { Alert } from '@ringcentral-integration/commons/modules/Alert';
import { Auth } from '@ringcentral-integration/commons/modules/Auth';
import { Brand } from '@ringcentral-integration/commons/modules/Brand';
import { ConnectivityMonitor } from '@ringcentral-integration/commons/modules/ConnectivityMonitor';
import { ContactMatcher } from '@ringcentral-integration/commons/modules/ContactMatcher';
import { DateTimeFormat } from '@ringcentral-integration/commons/modules/DateTimeFormat';
import { GlobalStorage, GlobalStorageOptions } from '@ringcentral-integration/commons/modules/GlobalStorage';
import { Locale } from '@ringcentral-integration/commons/modules/Locale';
import { RateLimiter } from '@ringcentral-integration/commons/modules/RateLimiter';
import {
  EvStorage,
  EvStorageOptions,
} from '@ringcentral-integration/engage-voice-widgets/modules/EvStorage';
import { AlertUI } from '@ringcentral-integration/widgets/modules/AlertUI';
import { Beforeunload } from '@ringcentral-integration/widgets/modules/Beforeunload';
import { Block } from '@ringcentral-integration/widgets/modules/Block';
import { BlockUI } from '@ringcentral-integration/widgets/modules/BlockUI';
import { ConnectivityBadgeUI } from '@ringcentral-integration/widgets/modules/ConnectivityBadgeUI';
import { ConnectivityManager } from '@ringcentral-integration/widgets/modules/ConnectivityManager';
import LoginUI from '@ringcentral-integration/widgets/modules/LoginUI';
import { ModalUI } from '@ringcentral-integration/widgets/modules/ModalUI';

import RouterInteraction from '@ringcentral-integration/widgets/modules/RouterInteraction';

import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvPresence } from '../EvPresence';
import { EvTabManager } from '../EvTabManager';
import { EvIntegratedSoftphone } from '../EvIntegratedSoftphone';
import { EvAgentSession } from '../EvAgentSession';
import { EvAgentSessionUI } from '../EvAgentSessionUI';
import OAuth from '../OAuth';
import { Adapter } from '../Adapter';
import { ThirdPartyService } from '../ThirdPartyService';
import { EvCall } from '../EvCall';
import { EvActivityCallUI } from '../EvActivityCallUI';
import { EvCallHistoryUI } from '../EvCallHistoryUI';
import { EvCallHistory } from '../EvCallHistory';
import { Environment } from '../Environment';
import { formatEvCall } from '../../lib/formatEvCall';
import { GenericPhone } from './interface';

@ModuleFactory({
  providers: [
    { provide: 'LoginUI', useClass: LoginUI },
    { provide: 'EvCallHistory', useClass: EvCallHistory },
    { provide: 'EvCallHistoryUI', useClass: EvCallHistoryUI },
    { provide: 'EvCallDisposition', useClass: EvCallDisposition },
    { provide: 'EvSettingsUI', useClass: EvSettingsUI },
    { provide: 'EvChooseAccountUI', useClass: EvChooseAccountUI },
    { provide: 'Alert', useClass: Alert },
    { provide: 'AlertUI', useClass: AlertUI },
    { provide: 'Block', useClass: Block },
    { provide: 'BlockUI', useClass: BlockUI },
    { provide: 'ModalUI', useClass: ModalUI },
    { provide: 'Brand', useClass: Brand },
    { provide: 'Locale', useClass: Locale },
    { provide: 'GlobalStorage', useClass: GlobalStorage },
    { provide: 'ConnectivityMonitor', useClass: ConnectivityMonitor },
    { provide: 'ConnectivityManager', useClass: ConnectivityManager },
    { provide: 'ConnectivityBadgeUI', useClass: ConnectivityBadgeUI },
    { provide: 'Auth', useClass: Auth },
    { provide: 'OAuth', useClass: OAuth },
    { provide: 'Storage', useClass: EvStorage },
    { provide: 'RateLimiter', useClass: RateLimiter },
    { provide: 'DateTimeFormat', useClass: DateTimeFormat },
    { provide: 'RouterInteraction', useClass: RouterInteraction },
    { provide: 'Environment', useClass: Environment },
    {
      provide: 'EnvironmentOptions',
      useFactory({ sdkConfig }) {
        return {
          sdkConfig,
        };
      },
      deps: ['SdkConfig'],
    },
    {
      provide: 'Client',
      useFactory: ({ sdkConfig }) => new RingCentralClient(new SDK(sdkConfig)),
      deps: [{ dep: 'SdkConfig', useParam: true }],
    },
    {
      provide: 'StorageOptions',
      useValue: {
        StorageProvider: LocalForageStorage,
        disableInactiveTabsWrite: true,
      } as EvStorageOptions,
    },
    {
      provide: 'GlobalStorageOptions',
      useValue: {
        StorageProvider: LocalForageStorage,
      } as GlobalStorageOptions,
    },
    {
      provide: 'ConnectivityMonitorOptions',
      useValue: {
        checkConnectionFunc: async () => {
          const response = await fetch(
            'https://apps.ringcentral.com/integrations/ping',
            {
              method: 'HEAD',
              mode: 'no-cors',
            },
          );
          if (response.type !== 'opaque' && response.status !== 200) {
            throw new Error('Network check failed');
          }
        },
      },
    },
    { provide: 'ContactMatcher', useClass: ContactMatcher },
    { provide: 'ActivityMatcher', useClass: ActivityMatcher },
    { provide: 'Presence', useClass: EvPresence },
    { provide: 'EvAgentSession', useClass: EvAgentSession },
    { provide: 'EvAgentSessionUI', useClass: EvAgentSessionUI },
    { provide: 'EvAgentScript', useClass: EvAgentScript },
    { provide: 'EvSubscription', useClass: EvSubscription },
    { provide: 'EvAuth', useClass: EvAuth },
    { provide: 'EvSettings', useClass: EvSettings },
    { provide: 'EvCall', useClass: EvCall },
    { provide: 'EvCallMonitor', useClass: EvCallMonitor },
    { provide: 'EvWorkingState', useClass: EvWorkingState },
    { provide: 'Adapter', useClass: Adapter },
    { provide: 'ThirdPartyService', useClass: ThirdPartyService },
    { provide: 'EvTransferCall', useClass: EvTransferCall },
    { provide: 'EvTransferCallUI', useClass: EvTransferCallUI },
    { provide: 'MainViewUI', useClass: MainViewUI },
    { provide: 'EvDialerUI', useClass: EvDialerUI },
    { provide: 'EvManualDialSettingsUI', useClass: EvManualDialSettingsUI },
    { provide: 'EvActivityCallUI', useClass: EvActivityCallUI },
    { provide: 'ActiveCallControl', useClass: EvActiveCallControl },
    { provide: 'EvRequeueCall', useClass: EvRequeueCall },
    { provide: 'EvActiveCallListUI', useClass: EvActiveCallListUI },
    { provide: 'EvClient', useClass: EvClient },
    { provide: 'EvCallDataSource', useClass: EvCallDataSource },
    { provide: 'EvIntegratedSoftphone', useClass: EvIntegratedSoftphone },
    { provide: 'TabManager', useClass: EvTabManager },
    { provide: 'Beforeunload', useClass: Beforeunload },
  ],
})
export default class BasePhone extends RcModule {
  public mode: string;
  public _appConfig: any;
  public _hasSetLocale?: boolean;

  constructor(private modules: GenericPhone) {
    super(modules);
    const { appConfig } = modules;
    this._appConfig = appConfig;

    this._bindHook(modules);
  }

  initialize() {
    this.store.subscribe(() => {
      if (
        this.modules.auth.ready &&
        this.modules.routerInteraction.currentPath !== '/' &&
        !this.modules.auth.loggedIn
      ) {
        this.modules.routerInteraction.push('/');
      }
      if (
        this.modules.locale.currentLocale !== this.modules.locale.defaultLocale &&
        !this._hasSetLocale
      ) {
        this._hasSetLocale = true;
        this.modules.locale.setLocale(this.modules.locale.defaultLocale);
      }
    });
  }

  private _bindHook({
    alert,
    evCallMonitor,
    routerInteraction,
    adapter,
    evActivityCallUI,
    evAgentSession,
    evDialerUI,
    evCall,
    contactMatcher,
    evClient,
    evAuth,
    presence,
    evIntegratedSoftphone,
    evSubscription,
  }: GenericPhone) {
    evIntegratedSoftphone.autoAnswerCheckFn = () =>
      evAuth.autoAnswerCalls ||
      // When that is inbound call, check isMonitoring, only inbound will get currentCall first
      evCall.currentCall?.isMonitoring;
    evIntegratedSoftphone.onRinging(() => {
      adapter.popUpWindow();
      adapter.onSIPRingCall({ message: 'SIP Ringing' });
      evSubscription.once(EvCallbackTypes.SIP_ENDED, () => {
        adapter.onSIPEndCall({ message: 'SIP Call Ended' });
      });
    });

    evAuth.onAuthSuccess(async () => {
      if (evAuth.isOnlyOneAgent) {
        evAuth.setAgentId(evAuth.authenticateResponse.agents[0].agentId);
        await evAuth.openSocketWithSelectedAgentId();
      } else if (
        !evAuth.agentId &&
        routerInteraction.currentPath !== '/chooseAccount'
      ) {
        routerInteraction.push('/chooseAccount');
      }
    });

    evCallMonitor
      .onCallRinging(async () => {
        console.log('onCallRinging');
        await this._bindBeforeunload();
        const call = evClient.currentCall;
        if (call.callType === 'INBOUND') {
          adapter.popUpWindow();
          adapter.onRingCall(formatEvCall(call));
        }
        contactMatcher.forceMatchNumber({
          phoneNumber: contactMatchIdentifyEncode({phoneNumber: call.ani, callType: call.callType}),
        });
      })
      .onCallAnswered(async (call) => {
        await this._bindBeforeunload();
        presence.setDialoutStatus(dialoutStatuses.callConnected);
        console.log('onCallAnswered');
        let isNewTab = false;
        if (evAgentSession.hasMultipleTabs) {
          // FIXME: should change to event way better.
          await waitUntil(() => evAgentSession.configSuccess, {
            timeout: 30 * 1000,
          }).catch(() => {
            // TODO: alert message about new tab login timeout.
          });
          const call = evClient.currentCall;

          if (!call || !call.uii) {
            isNewTab = true;
            const data = await evClient.loadCurrentCall();
            if (!data || !data.uii) {
              // TODO: alert message about sync up unexpected data for current call.
              console.log('go to dialer when no call');
              return routerInteraction.push('/dialer');
            }
          }
        }

        const id = evClient.encodeUii(call.session);
        evActivityCallUI.isFirstTimeHandled = true;
        evCall.activityCallId = id;

        if (
          call &&
          call.callType === 'INBOUND' &&
          evActivityCallUI.isActiveTab &&
          !isNewTab
        ) {
          adapter.popUpWindow();
        }

        // when dialout complete, reset toNumber to empty
        evActivityCallUI.goToActivityCallPage();
        evActivityCallUI.reset();
        evDialerUI.setToNumber('');
        contactMatcher.forceMatchNumber({
          phoneNumber: contactMatchIdentifyEncode({phoneNumber: call.ani, callType: call.callType}),
        });
        adapter.onNewCall(evActivityCallUI.activityCallLog.call);
      })
      .onCallEnded(() => {
        this._checkRouterShouldLeave(routerInteraction);
        this._removeBeforeunload();
        adapter.onEndCall(evActivityCallUI.activityCallLog.call);
        if (!evActivityCallUI.showSubmitStep) {
          evActivityCallUI.gotoDialWithoutSubmit();
          return;
        }
      });

    evAuth.canUserLogoutFn = async () => {
      if (presence.isCallConnected) {
        alert.danger({
          message: messageTypes.LOGOUT_FAIL_WITH_CALL_CONNECTED,
          ttl: 0,
        });
        return false;
      }
      return true;
    };

    // evAuth.beforeAgentLogout(() => {
    //   // When logout
    // });
  }

  async _bindBeforeunload() {
    this.modules.evCallMonitor.bindBeforeunload();
    this.modules.evIntegratedSoftphone.bindBeforeunload();

    // * add some sleep for some browser will slow add beforeunload.
    await sleep(50);
  }

  private _removeBeforeunload() {
    this.modules.evCallMonitor.removeBeforeunload();
    this.modules.evIntegratedSoftphone.removeBeforeunload();
  }

  private _checkRouterShouldLeave(routerInteraction: RouterInteraction) {
    const regex = /^\/activityCallLog\/(\d+\$\d+)\//;
    const isSubActivityCallLogPath = regex.test(routerInteraction.currentPath);

    if (isSubActivityCallLogPath) {
      const id = routerInteraction.currentPath.match(regex)[1];
      routerInteraction.push(`/activityCallLog/${id}`);
    }
  }

  setMode(mode: string) {
    this.mode = mode;
  }

  get name() {
    return this._appConfig.name;
  }

  get version() {
    return this._appConfig.version;
  }

  get buildHash() {
    return this._appConfig.buildHash;
  }

  get _actionTypes() {
    return null;
  }

  get status() {
    return this.state.status;
  }
}

export function createPhone({
  prefix,
  brandConfig,
  version,
  buildHash,
  sdkConfig,
  evSDK,
  evSdkConfig,
  targetWindow,
  hideCallNote,
  disableLoginPopup,
  redirectUri,
  fromPopup,
  jwt,
}) {
  const appVersion = buildHash ? `${version} (${buildHash})` : version;
  const usePKCE = sdkConfig.clientId && !sdkConfig.clientSecret;
  if (usePKCE) {
    // hack clean old authorization code token if auth flow change to PKCE
    const rawToken = localStorage.getItem(`sdk-${prefix}-platform`);
    if (rawToken) {
      const token = JSON.parse(rawToken);
      if ((token.access_token || token.refresh_token) && !token.code_verifier) {
        localStorage.removeItem(`sdk-${prefix}-platform`);
      }
    }
  }
  @ModuleFactory({
    providers: [
      { provide: 'AdapterOptions', useValue: { targetWindow } },
      { provide: 'EvAgentSessionOptions', useValue: { fromPopup } },
      {
        provide: 'TabManagerOptions',
        useValue: {
          enableCache: true,
          fromPopup,
        } as TabManagerOptions,
      },
      { provide: 'Prefix', useValue: prefix },
      {
        provide: 'SdkConfig',
        deps: ['Version'],
        useFactory({ version }) {
          return {
            ...sdkConfig,
            appVersion: version,
            appName: brandConfig.appName,
            cachePrefix: `sdk-${prefix}-`,
            clearCacheOnRefreshError: false,
            redirectUri,
          };
        },
      },
      {
        provide: 'EvClientOptions',
        useValue: {
          sdk: evSDK,
          options: evSdkConfig,
          callbacks: {
            closeResponse: () => console.log('close connection!!!!!'),
            openResponse: () => console.log('open connection!!!!!!'),
          },
        },
      },
      {
        provide: 'Version',
        useFactory() {
          return buildHash ? `${version} (${buildHash})` : version;
        },
      },
      {
        provide: 'AppConfig',
        useValue: {
          name: brandConfig.appName,
          version,
          buildHash,
          hideCallNote,
        },
      },
      { provide: 'BrandConfig', useValue: brandConfig },
      {
        provide: 'OAuthOptions',
        useValue: {
          extralUIOptions: ['hide_remember_me', 'hide_tos', '-old_ui'],
          disableLoginPopup,
          redirectUri,
          jwt,
        },
      },
      { provide: 'AuthOptions', useValue: { usePKCE } },
      {
        provide: 'Version',
        useFactory() {
          return appVersion;
        },
      },
    ],
  })
  class Phone extends BasePhone {}
  return (Phone as any).create();
}

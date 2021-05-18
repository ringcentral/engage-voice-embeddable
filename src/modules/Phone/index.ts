import 'ringcentral-integration/lib/TabFreezePrevention';

import { messageTypes } from '@ringcentral-integration/engage-voice-widgets/enums';
import { dialoutStatuses } from '@ringcentral-integration/engage-voice-widgets/enums/dialoutStatus';
import { contactMatchIdentifyEncode } from '@ringcentral-integration/engage-voice-widgets/lib/contactMatchIdentify';
// import { evStatus } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums/evStatus';
import { EvActiveCallControl } from '@ringcentral-integration/engage-voice-widgets/modules/EvActiveCallControl';
import { EvActiveCallListUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvActiveCallListUI';
import { EvAgentSession } from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentSession';
import { EvAgentSessionUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentSessionUI';
import { EvAgentScript } from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentScript';
import { EvAuth } from '@ringcentral-integration/engage-voice-widgets/modules/EvAuth';
import { EvCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvCall';
import { EvCallDataSource } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDataSource';
import { EvCallDisposition } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDisposition';
import { EvCallMonitor } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallMonitor';
import { EvDialerUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvDialerUI';
import { EvIntegratedSoftphone } from '@ringcentral-integration/engage-voice-widgets/modules/EvIntegratedSoftphone';
import { EvManualDialSettingsUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvManualDialSettingsUI';
import { EvPresence } from '@ringcentral-integration/engage-voice-widgets/modules/EvPresence';
import { EvRequeueCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvRequeueCall';
import { EvSettings } from '@ringcentral-integration/engage-voice-widgets/modules/EvSettings';
import { EvSettingsUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvSettingsUI';
import { EvSubscription } from '@ringcentral-integration/engage-voice-widgets/modules/EvSubscription';
import { EvTransferCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvTransferCall';
import { EvTransferCallUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvTransferCallUI';
import { EvWorkingState } from '@ringcentral-integration/engage-voice-widgets/modules/EvWorkingState';
import { EvTabManager } from '@ringcentral-integration/engage-voice-widgets/modules/EvTabManager';
import { EvChooseAccountUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvChooseAccountUI';
import { MainViewUI } from '@ringcentral-integration/engage-voice-widgets/modules/MainViewUI';

import { SDK } from '@ringcentral/sdk';
import { RingCentralClient } from 'ringcentral-integration/lib/RingCentralClient';
import sleep from 'ringcentral-integration/lib/sleep';
import { ModuleFactory } from 'ringcentral-integration/lib/di';
import LocalForageStorage from 'ringcentral-integration/lib/LocalForageStorage';
import RcModule from 'ringcentral-integration/lib/RcModule';
import { waitWithCheck } from 'ringcentral-integration/lib/time';
import AccountInfo from 'ringcentral-integration/modules/AccountInfo';
import ActivityMatcher from 'ringcentral-integration/modules/ActivityMatcher';
import Alert from 'ringcentral-integration/modules/Alert';
import Auth from 'ringcentral-integration/modules/Auth';
import AvailabilityMonitor from 'ringcentral-integration/modules/AvailabilityMonitor';
import Brand from 'ringcentral-integration/modules/Brand';
import ConnectivityMonitor from 'ringcentral-integration/modules/ConnectivityMonitor';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';
import DateTimeFormat from 'ringcentral-integration/modules/DateTimeFormat';
import DialingPlan from 'ringcentral-integration/modules/DialingPlan';
import ExtensionInfo from 'ringcentral-integration/modules/ExtensionInfo';
import GlobalStorage from 'ringcentral-integration/modules/GlobalStorage';
import Locale from 'ringcentral-integration/modules/Locale';
import RateLimiter from 'ringcentral-integration/modules/RateLimiter';
import RegionSettings from 'ringcentral-integration/modules/RegionSettings';
import RolesAndPermissions from 'ringcentral-integration/modules/RolesAndPermissions';
import {
  EvStorage,
  EvStorageOptions,
} from '@ringcentral-integration/engage-voice-widgets/modules/EvStorage';
import Subscription from 'ringcentral-integration/modules/Subscription';
import AlertUI from 'ringcentral-widgets/modules/AlertUI';
import { Beforeunload } from 'ringcentral-widgets/modules/Beforeunload';
import { Block } from 'ringcentral-widgets/modules/Block';
import { BlockUI } from 'ringcentral-widgets/modules/BlockUI';
import ConnectivityBadgeUI from 'ringcentral-widgets/modules/ConnectivityBadgeUI';
import ConnectivityManager from 'ringcentral-widgets/modules/ConnectivityManager';
import LoginUI from 'ringcentral-widgets/modules/LoginUI';
import { ModalUI } from 'ringcentral-widgets/modules/ModalUIV2';

import RegionSettingsUI from 'ringcentral-widgets/modules/RegionSettingsUI';
import RouterInteraction from 'ringcentral-widgets/modules/RouterInteraction';

import { EvClient } from '../EvClient';

import OAuth from '../OAuth';
import { Adapter } from '../Adapter';
import { ThirdPartyService } from '../ThirdPartyService';
import { EvActivityCallUI } from '../EvActivityCallUI';
import { EvCallHistoryUI } from '../EvCallHistoryUI';
import { EvCallHistory } from '../EvCallHistory';
import { Environment } from '../Environment';
import { formatEVCall } from '../../lib/formatEVCall';
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
    { provide: 'RegionSettingsUI', useClass: RegionSettingsUI },
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
    { provide: 'Subscription', useClass: Subscription },
    { provide: 'DateTimeFormat', useClass: DateTimeFormat },
    { provide: 'RouterInteraction', useClass: RouterInteraction },
    { provide: 'AccountInfo', useClass: AccountInfo },
    { provide: 'Environment', useClass: Environment },
    { provide: 'RegionSettings', useClass: RegionSettings },
    { provide: 'RolesAndPermissions', useClass: RolesAndPermissions },
    { provide: 'ExtensionInfo', useClass: ExtensionInfo },
    { provide: 'DialingPlan', useClass: DialingPlan },
    { provide: 'AvailabilityMonitor', useClass: AvailabilityMonitor },
    {
      provide: 'AvailabilityMonitorOptions',
      spread: true,
      useValue: {
        enabled: true,
      },
    },
    {
      provide: 'EnvironmentOptions',
      useFactory({ sdkConfig }) {
        return {
          sdkConfig,
        };
      },
      deps: ['SdkConfig'],
      spread: true,
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
        this.modules.locale.currentLocale !== this.modules.locale._defaultLocale &&
        !this._hasSetLocale
      ) {
        this._hasSetLocale = true;
        this.modules.locale.setLocale(this.modules.locale._defaultLocale);
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
  }: GenericPhone) {
    evIntegratedSoftphone.autoAnswerCheckFn = () =>
      evAuth.autoAnswerCalls ||
      // When that is inbound call, check isMonitoring, only inbound will get currentCall first
      evCall.currentCall?.isMonitoring;
    evIntegratedSoftphone.onRinging(() => {
      adapter.popUpWindow();
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
          adapter.onRingCall(formatEVCall(call));
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
          await waitWithCheck(() => evAgentSession.configSuccess, {
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
        adapter.onNewCall(evActivityCallUI.myActivityCallLog.call);
      })
      .onCallEnded(() => {
        this._checkRouterShouldLeave(routerInteraction);
        this._removeBeforeunload();
        if (!evActivityCallUI.showSubmitStep) {
          evActivityCallUI.gotoDialWithoutSubmit();
          return;
        }
      });

    evAgentSession.onConfigSuccess(() => {
      routerInteraction.push('/dialer');
      // if not allowManualCall, just not handle c2d
      // if (!evAuth.agentPermissions.allowManualCalls) {
      //   return;
      // }
      // enable c2d
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
      { provide: 'ModuleOptions', useValue: { prefix }, spread: true },
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
      { provide: 'BrandOptions', useValue: brandConfig, spread: true },
      {
        provide: 'OAuthOptions',
        useValue: {
          extralUIOptions: ['hide_remember_me', 'hide_tos', '-old_ui'],
          disableLoginPopup,
          redirectUri,
        },
        spread: true,
      },
      { provide: 'AuthOptions', useValue: { usePKCE }, spread: true },
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

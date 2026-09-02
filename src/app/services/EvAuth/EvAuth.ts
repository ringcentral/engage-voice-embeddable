import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import { loginStatus } from '@ringcentral-integration/micro-auth/src/app/services/Auth';
import { Locale, Toast } from '@ringcentral-integration/micro-core/src/app/services';
import { BlockPlugin } from '@ringcentral-integration/micro-core/src/app/plugins';

import { sleep } from '../../../lib/utils';
import format from '@ringcentral-integration/phone-number/lib/format';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
  PortManager,
  watch,
  delegate,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { EvLoginStatus, evAuthEvent, messageTypes } from '../../../enums';
import type { EvAgentConfig, EvAgentData } from '../EvClient/interfaces';
import { EvCallbackTypes } from '../EvClient/enums';
import { EvTypeError } from '../../../lib/EvTypeError';
import { sortByName } from '../../../lib/sortByName';
import { EvClient } from '../EvClient';
import { EvSubscription } from '../EvSubscription';
import { OAuth } from '../OAuth';
import { Analytics } from '../Analytics';
import { TabManager } from '../EvTabManager';

import type {
  EvAuthOptions,
  AuthenticateWithTokenParams,
  LoginAgentParams,
  OpenSocketParams,
} from './EvAuth.interface';
import i18n, { t } from './i18n';
import { track } from '../Analytics/track';
import { trackEvents } from '../../../lib/trackEvents';
import { canRejoinEvSession } from '../../utils/canRejoinEvSession';

const DEFAULT_COUNTRIES = ['USA', 'CAN'];
const AGENT_CONFIG_TIMEOUT_MS = 10 * 1000;

/**
 * EvAuth module - Authentication and agent login management
 * Handles agent connection, authentication tokens, agent selection
 */
@injectable({
  name: 'EvAuth',
})
class EvAuth extends RcModule {
  private _eventEmitter = new EventEmitter();

  public canUserLogoutFn: () => Promise<boolean> = async () => true;
  private _connectOrReauthenticatePromise: Promise<void> | null = null;
  private _refreshEvTokenPromise: Promise<boolean> | null = null;

  constructor(
    private evClient: EvClient,
    private auth: Auth,
    private evSubscription: EvSubscription,
    private locale: Locale,
    private toast: Toast,
    private block: BlockPlugin,
    private storage: StoragePlugin,
    private portManager: PortManager,
    private analytics: Analytics,
    private tabManager: TabManager,
    @optional() private oAuth?: OAuth,
    @optional('EvAuthOptions') private evAuthOptions?: EvAuthOptions,
  ) {
    super();
    this.storage.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
        this.portManager.onMainTabChange(async () => {
          this.logger.info('onMainTabChange~~');
          if (this.tabManager.popupIsBecomingMain) {
            this.logger.info('onMainTabChange~~, popupIsBecomingMain, return');
            return;
          }
          if (!this.auth.loggedIn || this.loginStatus !== EvLoginStatus.AUTH_SUCCESS) {
            return;
          }
          if (this._connectOrReauthenticatePromise) {
            await this._connectOrReauthenticatePromise;
            this._connectOrReauthenticatePromise = null;
          }
          this._connectOrReauthenticatePromise = this._connectOrReauthenticate();
          await this._connectOrReauthenticatePromise;
          this._connectOrReauthenticatePromise = null;
        });
      });
      this.portManager.onClient(() => {
        this.initializeClient();
      });
    } else {
      this.initialize();
      this.initializeClient();
    }
  }

  @state
  loginStatus: EvLoginStatus = EvLoginStatus.NO_AUTH;

  @storage
  @state
  agent: EvAgentData | null = null;

  @storage
  @state
  agentId = '';

  get isAuthing(): boolean {
    return this.loginStatus === EvLoginStatus.AUTHING;
  }

  get isEvLogged(): boolean {
    return this.loginStatus === EvLoginStatus.AUTH_SUCCESS;
  }

  get isReauthing(): boolean {
    return this.loginStatus === EvLoginStatus.REAUTHING;
  }

  @action
  _setAgentId(agentId: string) {
    this.agentId = agentId;
  }

  @action
  _setLoginStatus(status: EvLoginStatus) {
    this.loginStatus = status;
  }

  @delegate('server')
  async setAgentId(agentId: string): Promise<void> {
    this._setAgentId(agentId);
  }

  @action
  setAgent(agent: EvAgentData | null) {
    this.agent = agent;
  }

  @action
  _completeLogin(agent: EvAgentData) {
    this.agent = agent;
    this.loginStatus = EvLoginStatus.AUTH_SUCCESS;
  }

  @track(trackEvents.loginAgent)
  @delegate('server')
  async completeLogin(agent: EvAgentData): Promise<void> {
    this._completeLogin(agent);
  }

  @action
  _clearAgentId() {
    this.agentId = '';
  }

  @delegate('server')
  async clearAgentId(): Promise<void> {
    this._clearAgentId();
  }

  @delegate('server')
  async setNotAuth(): Promise<void> {
    this.loginStatus = EvLoginStatus.NO_AUTH;
  }

  get isFreshLogin(): boolean {
    return this.auth.isFreshLogin;
  }

  get isOnlyOneAgent(): boolean {
    return this.agent?.authenticateResponse?.agents?.length === 1;
  }

  get agentConfig() {
    return this.agent?.agentConfig || null;
  }

  get authenticateResponse() {
    return this.agent?.authenticateResponse || null;
  }

  get agentSettings() {
    return this.agentConfig?.agentSettings;
  }

  get outboundManualDefaultRingtime() {
    return this.agentSettings?.outboundManualDefaultRingtime;
  }

  get inboundSettings() {
    return (
      this.agentConfig?.inboundSettings || {
        availableQueues: [] as Array<undefined>,
        availableSkillProfiles: [] as Array<undefined>,
        queues: [] as Array<undefined>,
        skillProfile: {} as any,
        availableRequeueQueues: [] as Array<undefined>,
      }
    );
  }

  get assignedQueue() {
    return this.inboundSettings.queues;
  }

  get agentPermissions() {
    return this.agentConfig?.agentPermissions;
  }

  @computed((that: EvAuth) => [that.inboundSettings.availableQueues])
  get availableQueues() {
    return [
      {
        gateId: '-1',
        gateName: i18n.getString('default', this.locale.currentLocale),
      },
      ...sortByName([...this.inboundSettings.availableQueues], 'gateName'),
    ];
  }

  @computed((that: EvAuth) => [that.inboundSettings.availableRequeueQueues])
  get availableRequeueQueues() {
    const list = sortByName(
      [...this.inboundSettings.availableRequeueQueues],
      'groupName',
    );
    return list.map((queue) => ({
      ...queue,
      gates: Array.isArray(queue.gates) ? queue.gates : [],
    }));
  }

  @computed((that: EvAuth) => [that.agentSettings?.callerIds])
  get callerIds() {
    if (!this.agentSettings?.callerIds) {
      return [];
    }
    return [
      {
        description: i18n.getString('default', this.locale.currentLocale),
        number: '-1',
      },
      ...this.agentSettings.callerIds.map((callerId) => {
        const number =
          format({
            phoneNumber: callerId.number,
            countryCode: 'US',
          }) || callerId.number;
        return {
          ...callerId,
          number,
        };
      }),
    ];
  }

  @computed((that: EvAuth) => [
    that.agentConfig?.applicationSettings?.availableCountries,
    that.locale.currentLocale,
  ])
  get availableCountries() {
    const availableCountries =
      this.agentConfig?.applicationSettings?.availableCountries || [];
    return availableCountries.length > 0
      ? availableCountries
      : [
          {
            countryId: 'USA',
            countryName: i18n.getString('us', this.locale.currentLocale),
          },
        ];
  }

  initialize() {
    this.auth.addAfterLoggedInHandler(() => {
      this.logger.info('AfterLoggedInHandler~~');
      this.clearAgentId();
    });
    this.auth.addBeforeLogoutHandler(async () => {
      this.logger.info('BeforeLogoutHandler~~');
      try {
        this._setLoginStatus(EvLoginStatus.UNAUTHING);
        const agentId = this.agentId;
        this._emitLogoutBefore();
        const logoutAgentResponse = await this.logoutAgent(agentId);
        if (!logoutAgentResponse.message || logoutAgentResponse.message !== 'OK') {
          this.logger.info('logoutAgent failed');
        }
        this.setAgent(null);
        await this.clearAgentId();
      } catch (error) {
        this.logger.error('logout error~~', error);
      }
      try {
        await this.evClient.clearEvSession();
        await this.evClient.closeSocket();
        // await this.evClient.resetUIModel();
      } catch (error) {
        this.logger.error('closeSocket error~~', error);
      }
      this._setLoginStatus(EvLoginStatus.NO_AUTH);
    });
    this.evSubscription.subscribe(EvCallbackTypes.LOGOUT, async () => {
      this.toast.info({
        message: t(messageTypes.FORCE_LOGOUT),
      });
      this.logger.info('EvCallbackTypes.LOGOUT~~, newReconnect');
      this._emitLogoutBefore();
      await this.newReconnect();
    });
    watch(
      this,
      () => [
        this.auth.loginStatus,
        this.loginStatus,
        this.oAuth?.jwtOwnerChanged,
      ] as const,
      async ([loggedIn, currentLoginStatus, jwtOwnerChanged]) => {
        if (this.auth.loginStatus !== loginStatus.loggedIn) {
          return;
        }
        this.logger.info('auto-login~~', loggedIn, currentLoginStatus, jwtOwnerChanged);
        if (
          loggedIn &&
          currentLoginStatus === EvLoginStatus.NO_AUTH &&
          !jwtOwnerChanged
        ) {
          this.logger.info('auto-login~~');
          if (this._connectOrReauthenticatePromise) {
            await this._connectOrReauthenticatePromise;
            return;
          }
          this._connectOrReauthenticatePromise = this._connectOrReauthenticate();
          await this._connectOrReauthenticatePromise;
          this._connectOrReauthenticatePromise = null;
        }
      },
      { multiple: true },
    );
  }

  private async _connectOrReauthenticate(): Promise<void> {
    if (this.loginStatus !== EvLoginStatus.REAUTHING) {
      this._setLoginStatus(EvLoginStatus.AUTHING);
    }
    await this.block.next(async () => {
      this.logger.info('connectOrReauthenticate~~, agentId', this.agentId);
      if (this.agentId) {
        // A reload lands here. A socket-level rejoin is not possible on a
        // freshly created SDK instance (its Layer 2 reconnect needs the
        // in-memory login state), so this is always a fresh login. A call or
        // disposition the server still holds is recovered through the
        // persisted activity call id and the server's PENDING_DISP push.
        await this.loginAgent();
      } else {
        await this.authenticateWithToken();
      }
    });
  }

  initializeClient() {
    watch(
      this,
      () => this.isEvLogged,
      () => {
        if (this.isEvLogged) {
          this.identifyAnalyticsUser();
        }
      },
    );
  }

  private _logout = async () => {
    await this.auth.logout({ dismissAllAlert: false, reason: 'Manually sign out' });
  };

  onceLogout(cb: () => any) {
    return this.evSubscription.once(EvCallbackTypes.LOGOUT, cb);
  }

  async identifyAnalyticsUser() {
    try {
      this.logger.info('identifyAnalyticsUser~~');
      const userDetails = this.evClient.getFullUserDetails();
      if (!userDetails) {
        this.logger.info('identifyAnalyticsUser~~, no user details');
        return;
      }
      const userId = `${userDetails.rcUserId}`;
      const accountId = userDetails.rcAccountId;
      this.analytics.identify({
        userId,
        accountId,
      });
    } catch (e) {
      this.logger.error('Error identifying user', e);
    }
  }

  @delegate('server')
  async logout(): Promise<void> {
    if (!(await this.canUserLogoutFn())) {
      return;
    }
    await this.block.next(this._logout);
  }

  @delegate('server')
  async logoutAgent(agentId: string = this.agentId) {
    return this.evClient.logoutAgent(agentId);
  }

  beforeAgentLogout(callback: () => void) {
    this._eventEmitter.on(evAuthEvent.LOGOUT_BEFORE, callback);
  }

  /**
   * Full re-authentication. Clearing the EV session wipes the SDK's session
   * hash code, so the next login is a fresh one and any call the server still
   * holds is orphaned in pending disposition.
   *
   * Prefer {@link retryConnection} for connection problems; reserve this for
   * cases where the session is genuinely invalid, such as a forced logout.
   */
  @delegate('server')
  async newReconnect(isBlock = true) {
    this.logger.info('newReconnect~~');
    this._setLoginStatus(EvLoginStatus.REAUTHING);
    await this.evClient.clearEvSession();
    await this.evClient.closeSocket();
    const fn = () => this.loginAgent();
    return isBlock ? this.block.next(fn) : fn();
  }

  /**
   * Re-establish the socket while keeping the SDK session intact, so the
   * server resumes the existing session and reports back whether the agent is
   * still on a call or owes a disposition.
   *
   * Rejoining is only attempted while the stored session is fresh enough to
   * still exist server-side; otherwise, and when the rejoin attempt itself
   * fails before the socket opens, a full re-authentication runs instead.
   */
  @delegate('server')
  async retryConnection(): Promise<void> {
    this.logger.info('retryConnection~~');
    if (!(await this._canRejoinStoredSession())) {
      await this.newReconnect();
      return;
    }
    this._setLoginStatus(EvLoginStatus.REAUTHING);
    await this.block.next(async () => {
      try {
        await this.evClient.closeSocket();
        await this.loginAgent({ tryRejoin: true, retryOpenSocket: true });
      } catch (error) {
        this.logger.error('retryConnection~~ failed, reauthenticating', error);
        await this.newReconnect(false);
      }
    });
  }

  private async _canRejoinStoredSession(): Promise<boolean> {
    const stored = await this.evClient.getStoredSession();
    const { canRejoin, reason } = canRejoinEvSession({
      stored,
      agentId: this.agentId,
      now: Date.now(),
    });
    if (!canRejoin) {
      this.logger.info('retryConnection~~ rejoin not possible', reason);
    }
    return canRejoin;
  }

  @delegate('server')
  async authenticateWithToken({
    shouldEmitAuthSuccess = true,
  }: AuthenticateWithTokenParams = {}) {
    this.logger.info('authenticateWithToken', shouldEmitAuthSuccess);
    try {
      await this.auth.ensureValidAccessToken();
      await this.evClient.initSDK();
      const authenticateResponse =
        await this.evClient.getAndHandleAuthenticateResponse(
          this.auth.accessToken,
          'Bearer',
        );
      if (authenticateResponse.error) {
        throw new EvTypeError({
          type: authenticateResponse.error,
          data: authenticateResponse.data,
        });
      }
      this.logger.info('authenticateWithToken authenticateResponse~~');
      const agent = { ...this.agent, authenticateResponse } as EvAgentData;
      this.setAgent(agent);
      if (shouldEmitAuthSuccess) {
        this._emitAuthSuccess();
      }
      return authenticateResponse;
    } catch (error: any) {
      this.logger.error('authenticateWithToken error~~', error, error.type);
      switch (error.type) {
        case messageTypes.NO_AGENT:
          this.toast.warning({
            message: t(error.type),
          });
          break;
        case messageTypes.CONNECT_TIMEOUT:
        case messageTypes.UNEXPECTED_AGENT:
          this.toast.danger({
            message: t(error.type),
          });
          break;
        default:
          this.logger.error('authenticateWithToken error~~', error.type, error.message);
          this.toast.danger({
            message: t(messageTypes.CONNECT_ERROR),
          });
      }
      this.logger.error('authenticateWithToken logout~~');
      this._setLoginStatus(EvLoginStatus.AUTH_FAILURE);
      await this._logout();
    }
  }

  @delegate('server')
  async refreshEvToken(): Promise<boolean> {
    if (this._refreshEvTokenPromise) {
      return this._refreshEvTokenPromise;
    }
    this._refreshEvTokenPromise = this._refreshEvToken();
    try {
      return await this._refreshEvTokenPromise;
    } finally {
      this._refreshEvTokenPromise = null;
    }
  }

  private async _refreshEvToken(): Promise<boolean> {
    const result = await this.evClient.refreshEvToken();
    if (result) {
      return true;
    }
    const authenticateResponse = await this.authenticateWithToken({
      shouldEmitAuthSuccess: false,
    });
    return !!authenticateResponse;
  }

  @delegate('server')
  async openSocketWithSelectedAgentId({
    syncOtherTabs = false,
    retryOpenSocket = false,
  }: OpenSocketParams = {}): Promise<EvAgentConfig | undefined> {
    this.logger.info(
      'openSocketWithSelectedAgentId',
      syncOtherTabs,
      retryOpenSocket,
    );
    try {
      const selectedAgentId = this.agentId;
      if (!selectedAgentId) {
        throw new EvTypeError({
          type: messageTypes.NO_AGENT,
        });
      }
      const openSocketResult = await this.evClient.openSocket(selectedAgentId);
      await sleep(0);
      if (openSocketResult.error) {
        this.logger.info('retryOpenSocket~~', retryOpenSocket);
        if (retryOpenSocket) {
          const authenticateRes = await this.authenticateWithToken({
            shouldEmitAuthSuccess: false,
          });
          if (!authenticateRes) return;
          const openSocketRes = await this.openSocketWithSelectedAgentId({
            syncOtherTabs,
          });
          return openSocketRes;
        }
        throw new EvTypeError({
          type: messageTypes.OPEN_SOCKET_ERROR,
        });
      }
      this.logger.info('openSocketWithSelectedAgentId getAgentConfig~~');
      const agentConfig = await this.evClient.getAgentConfig();
      if (!agentConfig) {
        throw new EvTypeError({
          type: messageTypes.CONNECT_TIMEOUT,
        });
      }
      this.logger.info('openSocketWithSelectedAgentId getAgentConfig done~~');
      const agent = { ...this.agent, agentConfig } as EvAgentData;
      await this.completeLogin(agent);
      this._emitLoginSuccess();
      return agentConfig;
    } catch (error: any) {
      switch (error.type) {
        case messageTypes.NO_AGENT:
          this.toast.warning({
            message: t(error.type),
          });
          break;
        case messageTypes.INVALID_BROWSER:
        case messageTypes.OPEN_SOCKET_ERROR:
          this.toast.danger({
            message: t(error.type),
          });
          break;
        default:
          this.toast.danger({
            message: t(messageTypes.CONNECT_ERROR),
          });
      }
      this._setLoginStatus(EvLoginStatus.AUTH_FAILURE);
      await this._logout();
    }
  }

  /**
   * @param tryRejoin Resume the stored server session rather than starting a
   * new one. Leave it off when the caller has deliberately invalidated the
   * session, such as after a forced logout.
   * @param retryOpenSocket On a failed socket open, re-authenticate and try
   * one more time instead of logging the agent out immediately.
   */
  @delegate('server')
  async loginAgent({
    tryRejoin = false,
    retryOpenSocket = false,
  }: LoginAgentParams = {}): Promise<void> {
    this.logger.info('loginAgent~~', { tryRejoin });
    const authenticateRes = await this.authenticateWithToken({
      shouldEmitAuthSuccess: false,
    });
    if (!authenticateRes) return;
    if (tryRejoin) {
      await this._prepareSessionRejoin();
    }
    await this.openSocketWithSelectedAgentId({ retryOpenSocket });
  };

  /**
   * Hand the SDK the stored session token so the next socket open is a Layer 2
   * reconnect. A no-op when the token is missing, stale, belongs to a
   * different agent, or the SDK instance has not completed a login in this
   * page, in which case the caller falls through to a fresh login.
   */
  private async _prepareSessionRejoin(): Promise<boolean> {
    const stored = await this.evClient.getStoredSession();
    const { canRejoin, reason } = canRejoinEvSession({
      stored,
      agentId: this.agentId,
      now: Date.now(),
    });
    if (!canRejoin) {
      this.logger.info('prepareSessionRejoin~~ skipped', reason);
      return false;
    }
    this.logger.info('prepareSessionRejoin~~ resuming session');
    return this.evClient.prepareSessionRejoin(stored!.hashCode);
  }

  onceLoginSuccess(callback: () => void) {
    this._eventEmitter.once(evAuthEvent.LOGIN_SUCCESS, callback);
  }

  onLoginSuccess(callback: () => void) {
    this._eventEmitter.on(evAuthEvent.LOGIN_SUCCESS, callback);
  }

  onAuthSuccess(callback: () => void) {
    this._eventEmitter.on(evAuthEvent.AUTH_SUCCESS, callback);
  }

  private _emitLogoutBefore() {
    this._eventEmitter.emit(evAuthEvent.LOGOUT_BEFORE);
  }

  private _emitLoginSuccess() {
    this._eventEmitter.emit(evAuthEvent.LOGIN_SUCCESS);
  }

  private _emitAuthSuccess() {
    this._eventEmitter.emit(evAuthEvent.AUTH_SUCCESS);
  }

  /**
   * Get agent ID
   */
  getAgentId(): string {
    return this.agentId;
  }

  /**
   * Check if i18n is enabled for the agent
   */
  get isI18nEnabled(): boolean {
    return !!(this.agent as any)?.isI18nEnabled;
  }
}

export { EvAuth };

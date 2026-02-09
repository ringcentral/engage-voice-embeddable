import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
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

import { loginStatus, messageTypes } from '../../../enums';
import type { EvAgentConfig, EvAgentData } from '../EvClient/interfaces';
import { EvCallbackTypes } from '../EvClient/enums';
import { EvTypeError } from '../../../lib/EvTypeError';
import { sortByName } from '../../../lib/sortByName';
import { EvClient } from '../EvClient';
import { EvSubscription } from '../EvSubscription';
import { OAuth } from '../OAuth';
import { Analytics } from '../Analytics';

import type {
  EvAuthOptions,
  EvAuthState,
  AuthenticateWithTokenParams,
  OpenSocketParams,
} from './EvAuth.interface';
import i18n, { t } from './i18n';
import { track } from '../Analytics/track';
import { trackEvents } from '../../../lib/trackEvents';

const DEFAULT_COUNTRIES = ['USA', 'CAN'];

/**
 * EvAuth module - Authentication and agent login management
 * Handles agent connection, authentication tokens, agent selection
 */
@injectable({
  name: 'EvAuth',
})
class EvAuth extends RcModule {
  public connecting = false;

  private _eventEmitter = new EventEmitter();

  public canUserLogoutFn: () => Promise<boolean> = async () => true;

  private _logoutByOtherTab = false;

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
    @optional() private oAuth?: OAuth,
    @optional('EvAuthOptions') private evAuthOptions?: EvAuthOptions,
  ) {
    super();
    this.storage.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onMainTab(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @state
  connected = false;

  @storage
  @state
  agent: EvAgentData | null = null;

  @storage
  @state
  agentId = '';

  @state
  loginStatus: string | null = null;

  @action
  _setAgentId(agentId: string) {
    this.agentId = agentId;
  }

  @delegate('server')
  async setAgentId(agentId: string): Promise<void> {
    this._setAgentId(agentId);
  }

  @action
  _setConnectionData({ connected, agent }: Partial<EvAuthState>) {
    if (agent !== undefined) {
      this.agent = agent;
    }
    if (connected !== undefined) {
      this.connected = connected;
    }
  }

  @track(trackEvents.loginAgent)
  @delegate('server')
  async setConnectionData({ connected, agent }: Partial<EvAuthState>): Promise<void> {
    this._setConnectionData({ connected, agent });
  }

  @action
  _setAgent(agent: EvAgentData | null) {
    this.agent = agent;
  }

  @delegate('server')
  async setAgent(agent: EvAgentData | null): Promise<void> {
    this._setAgent(agent);
  }

  @action
  _clearAgentId() {
    this.agentId = '';
  }

  @delegate('server')
  async clearAgentId(): Promise<void> {
    this._clearAgentId();
  }

  @action
  setAuthSuccess() {
    this.loginStatus = loginStatus.AUTH_SUCCESS;
  }

  @action
  setLoginSuccess() {
    this.loginStatus = loginStatus.LOGIN_SUCCESS;
  }

  @action
  setNotAuth(asyncAllTabs = false) {
    this.loginStatus = loginStatus.NOT_AUTH;
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

  get isEvLogged(): boolean {
    return this.loginStatus === loginStatus.LOGIN_SUCCESS;
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
    return sortByName(
      [...this.inboundSettings.availableRequeueQueues],
      'groupName',
    );
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
    const countriesUsaCan = availableCountries.filter(({ countryId }) =>
      DEFAULT_COUNTRIES.includes(countryId),
    );
    return countriesUsaCan.length > 0
      ? countriesUsaCan
      : [
          {
            countryId: 'USA',
            countryName: i18n.getString('us', this.locale.currentLocale),
          },
        ];
  }

  initialize() {
    this.auth.addAfterLoggedInHandler(() => {
      this.logger.info('addAfterLoggedInHandler~~');
      this.clearAgentId();
    });
    this.auth.addBeforeLogoutHandler(() => {
      this.logger.info('addBeforeLogoutHandler~~');
      this.clearAgentId();
    });
    this.evSubscription.subscribe(EvCallbackTypes.LOGOUT, async () => {
      this._emitLogoutBefore();
      if (!this._logoutByOtherTab) {
        this.toast.info({
          message: t(messageTypes.FORCE_LOGOUT),
        });
        this._logoutByOtherTab = false;
        await this.newReconnect();
      }
    });
    this.onceLoginSuccess(() => {
      try {
        const userDetails = localStorage.getItem('engage-auth:fullUserDetails');
        if (!userDetails) {
          return;
        }
        const userDetailsJson = JSON.parse(userDetails);
        const userId = `${userDetailsJson.rcUserId}`;
        const accountId = userDetailsJson.rcAccountId;
        this.analytics.identify({
          userId,
          accountId,
        });
      } catch (e) {
        console.error('Error identifying user', e);
      }
    });
    // Auto-login when RC auth is complete but EV auth hasn't happened yet
    watch(
      this,
      () => [
        this.auth.loggedIn,
        this.loginStatus,
        this.connecting,
        this.oAuth?.jwtOwnerChanged,
      ] as const,
      async ([loggedIn, currentLoginStatus, isConnecting, jwtOwnerChanged]) => {
        if (
          loggedIn &&
          currentLoginStatus !== loginStatus.AUTH_SUCCESS &&
          currentLoginStatus !== loginStatus.LOGIN_SUCCESS &&
          !isConnecting &&
          !jwtOwnerChanged
        ) {
          this.connecting = true;
          // When login make sure the logoutByOtherTab is false
          this._logoutByOtherTab = false;
          await this.block.next(async () => {
            if (this.agentId) {
              await this.loginAgent();
            } else {
              await this.authenticateWithToken();
            }
          });
        }
      },
      { multiple: true },
    );
  }

  private _logout = async () => {
    await this.auth.logout({ dismissAllAlert: false, reason: 'Manually sign out' });
    this.setNotAuth(true);
  };

  onceLogout(cb: () => any) {
    return this.evSubscription.once(EvCallbackTypes.LOGOUT, cb);
  }

  @delegate('mainClient')
  async logout(): Promise<void> {
    if (!(await this.canUserLogoutFn())) {
      return;
    }
    this.logger.info('logout~~');
    const agentId = this.agentId;
    await this.block.next(this._logout);
    const logoutAgentResponse = await this.logoutAgent(agentId);
    if (!logoutAgentResponse.message || logoutAgentResponse.message !== 'OK') {
      this.logger.info('logoutAgent failed');
    }
    await this.setConnectionData({ connected: false, agent: null });
  }

  @delegate('mainClient')
  async logoutAgent(agentId: string = this.agentId) {
    return this.evClient.logoutAgent(agentId);
  }

  beforeAgentLogout(callback: () => void) {
    this._eventEmitter.on(loginStatus.LOGOUT_BEFORE, callback);
  }

  @delegate('mainClient')
  async newReconnect(isBlock = true) {
    await this.evClient.closeSocket();
    const fn = this.loginAgent;
    return isBlock ? this.block.next(fn) : fn();
  }

  @delegate('mainClient')
  async authenticateWithToken({
    rcAccessToken = this.auth.accessToken,
    tokenType = 'Bearer',
    shouldEmitAuthSuccess = true,
  }: AuthenticateWithTokenParams = {}) {
    this.logger.info('authenticateWithToken', shouldEmitAuthSuccess);
    try {
      this.evClient.initSDK();
      const authenticateResponse =
        await this.evClient.getAndHandleAuthenticateResponse(
          rcAccessToken,
          tokenType,
        );
      const agent = { ...this.agent, authenticateResponse } as EvAgentData;
      await this.setAgent(agent);
      await this.setAuthSuccess();
      if (shouldEmitAuthSuccess) {
        this._emitAuthSuccess();
      }
      return authenticateResponse;
    } catch (error: any) {
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
          this.toast.danger({
            message: t(messageTypes.CONNECT_ERROR),
          });
      }
      await this._logout();
    }
  }

  @delegate('mainClient')
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
      const getAgentConfig = new Promise<EvAgentConfig>((resolve) => {
        this.evClient.on(EvCallbackTypes.LOGIN_PHASE_1, resolve);
      });
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
          const { access_token } = await this.auth.refreshToken();
          const authenticateRes = await this.authenticateWithToken({
            rcAccessToken: access_token,
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
      const agentConfig = await getAgentConfig;
      const agent = { ...this.agent, agentConfig } as EvAgentData;
      await this.setConnectionData({ agent, connected: true });
      this.connecting = false;
      await this.setLoginSuccess();
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
      await this._logout();
    }
  }

  @delegate('mainClient')
  async loginAgent(token: string = this.auth.accessToken): Promise<void> {
    const authenticateRes = await this.authenticateWithToken({
      rcAccessToken: token,
      shouldEmitAuthSuccess: false,
    });
    if (!authenticateRes) return;
    await this.openSocketWithSelectedAgentId();
  };

  onceLoginSuccess(callback: () => void) {
    this._eventEmitter.once(loginStatus.LOGIN_SUCCESS, callback);
  }

  onAuthSuccess(callback: () => void) {
    this._eventEmitter.on(loginStatus.AUTH_SUCCESS, callback);
  }

  private _emitLogoutBefore() {
    this._eventEmitter.emit(loginStatus.LOGOUT_BEFORE);
  }

  private _emitLoginSuccess() {
    this._eventEmitter.emit(loginStatus.LOGIN_SUCCESS);
  }

  private _emitAuthSuccess() {
    this._eventEmitter.emit(loginStatus.AUTH_SUCCESS);
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

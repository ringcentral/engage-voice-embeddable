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
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { loginStatus, messageTypes, tabManagerEvents } from '../../../enums';
import type { EvAgentConfig, EvAgentData } from '../EvClient/interfaces';
import { EvCallbackTypes } from '../EvClient/enums';
import { EvTypeError } from '../../../lib/EvTypeError';
import { sortByName } from '../../../lib/sortByName';
import { EvClient } from '../EvClient';
import { EvSubscription } from '../EvSubscription';
import type {
  EvAuthOptions,
  EvAuthState,
  AuthenticateWithTokenParams,
  OpenSocketParams,
} from './EvAuth.interface';
import i18n from './i18n';

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
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvAuthOptions') private evAuthOptions?: EvAuthOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    this.auth.addAfterLoggedInHandler(() => {
      console.log('addAfterLoggedInHandler~~');
      this.clearAgentId();
    });
    this.auth.addBeforeLogoutHandler(() => {
      console.log('addBeforeLogoutHandler~~');
      this.clearAgentId();
    });
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @storage
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
  setAgentId(agentId: string) {
    this.agentId = agentId;
  }

  @action
  setConnectionData({ connected, agent }: Partial<EvAuthState>) {
    if (agent !== undefined) {
      this.agent = agent;
    }
    if (connected !== undefined) {
      this.connected = connected;
    }
  }

  @action
  setAgent(agent: EvAgentData | null) {
    this.agent = agent;
  }

  @action
  clearAgentId() {
    this.agentId = '';
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
  setNotAuth() {
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
    this.evSubscription.subscribe(EvCallbackTypes.LOGOUT, async () => {
      this._emitLogoutBefore();
      if (!this._logoutByOtherTab) {
        this.toast.info({
          message: messageTypes.FORCE_LOGOUT,
        });
        this._logoutByOtherTab = false;
        await this.newReconnect();
      }
    });
  }

  private _logout = async () => {
    await this.auth.logout({ dismissAllAlert: false, reason: 'Manually sign out' });
    this.setNotAuth();
  };

  onceLogout(cb: () => any) {
    return this.evSubscription.once(EvCallbackTypes.LOGOUT, cb);
  }

  async logout(): Promise<void> {
    if (!(await this.canUserLogoutFn())) {
      return;
    }
    console.log('logout~~');
    const agentId = this.agentId;
    this.sendLogoutTabEvent();
    await this.block.next(this._logout);
    const logoutAgentResponse = await this.logoutAgent(agentId);
    if (!logoutAgentResponse.message || logoutAgentResponse.message !== 'OK') {
      console.log('logoutAgent failed');
    }
    this.setConnectionData({ connected: false, agent: null });
  }

  sendLogoutTabEvent() {
    this._emitLogoutBefore();
  }

  logoutAgent(agentId: string = this.agentId) {
    return this.evClient.logoutAgent(agentId);
  }

  beforeAgentLogout(callback: () => void) {
    this._eventEmitter.on(loginStatus.LOGOUT_BEFORE, callback);
  }

  newReconnect(isBlock = true) {
    this.evClient.closeSocket();
    const fn = this.loginAgent;
    return isBlock ? this.block.next(fn) : fn();
  }

  async authenticateWithToken({
    rcAccessToken = this.auth.accessToken,
    tokenType = 'Bearer',
    shouldEmitAuthSuccess = true,
  }: AuthenticateWithTokenParams = {}) {
    console.log('authenticateWithToken', shouldEmitAuthSuccess);
    try {
      this.evClient.initSDK();
      const authenticateResponse =
        await this.evClient.getAndHandleAuthenticateResponse(
          rcAccessToken,
          tokenType,
        );
      const agent = { ...this.agent, authenticateResponse } as EvAgentData;
      this.setAgent(agent);
      this.setAuthSuccess();
      if (shouldEmitAuthSuccess) {
        this._emitAuthSuccess();
      }
      return authenticateResponse;
    } catch (error: any) {
      switch (error.type) {
        case messageTypes.NO_AGENT:
          this.toast.warning({
            message: error.type,
          });
          break;
        case messageTypes.CONNECT_TIMEOUT:
        case messageTypes.UNEXPECTED_AGENT:
          this.toast.danger({
            message: error.type,
          });
          break;
        default:
          this.toast.danger({
            message: messageTypes.CONNECT_ERROR,
          });
      }
      await this._logout();
    }
  }

  async openSocketWithSelectedAgentId({
    syncOtherTabs = false,
    retryOpenSocket = false,
  }: OpenSocketParams = {}): Promise<EvAgentConfig | undefined> {
    console.log(
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
        console.log('retryOpenSocket~~', retryOpenSocket);
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
      this.setConnectionData({ agent, connected: true });
      this.connecting = false;
      this.setLoginSuccess();
      this._emitLoginSuccess();
      return agentConfig;
    } catch (error: any) {
      switch (error.type) {
        case messageTypes.NO_AGENT:
          this.toast.warning({
            message: error.type,
          });
          break;
        case messageTypes.INVALID_BROWSER:
        case messageTypes.OPEN_SOCKET_ERROR:
          this.toast.danger({
            message: error.type,
          });
          break;
        default:
          this.toast.danger({
            message: messageTypes.CONNECT_ERROR,
          });
      }
      await this._logout();
    }
  }

  loginAgent = async (token: string = this.auth.accessToken): Promise<void> => {
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
    return !!this.agent?.isI18nEnabled;
  }

  /**
   * Handle tab manager events for multi-tab synchronization
   */
  async handleTabManagerEvent(event: { name: string }): Promise<void> {
    if (!event) return;
    switch (event.name) {
      case tabManagerEvents.LOGOUT:
        this._logoutByOtherTab = true;
        this.evClient.closeSocket();
        break;
      case tabManagerEvents.OPEN_SOCKET:
        await this.block.next(async () => {
          await this.openSocketWithSelectedAgentId({
            retryOpenSocket: true,
          });
        });
        break;
      case tabManagerEvents.LOGGED_OUT:
        this.setNotAuth();
        break;
      default:
        break;
    }
  }
}

export { EvAuth };

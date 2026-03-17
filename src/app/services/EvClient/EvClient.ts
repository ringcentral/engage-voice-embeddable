import { waitUntilTo } from '../../../lib/utils';
import {
  action,
  inject,
  injectable,
  optional,
  RcModule,
  state,
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { AGENT_TYPES, messageTypes } from '../../../enums';
import { EvTypeError } from '../../../lib/EvTypeError';
import { _encodeSymbol } from '../../../lib/constant';
import { evStatus, EvCallbackTypes } from './enums';
import type {
  EvACKResponse,
  EvAddSessionNotification,
  EvAgentConfig,
  EvAgentOptions,
  EvAgentScriptResult,
  EvAgentSettings,
  EvAuthenticateAgentWithEngageAccessTokenRes,
  EvAuthenticateAgentWithRcAccessTokenRes,
  EvBaseCall,
  EvClientCallMapping,
  EvColdTransferCallResponse,
  EvColdTransferIntlCallResponse,
  EvConfigureAgentOptions,
  EvDirectAgentListResponse,
  EvDispositionCallOptions,
  EvDispositionManualPassOptions,
  EvLogoutAgentResponse,
  EvMessageRes,
  EvOpenSocketResult,
  EvRequeueCallResponse,
  EvRequeueOption,
  EvScriptResponse,
  EvTokenType,
  EvWarmTransferCallResponse,
  EvWarmTransferIntlCallResponse,
  PauseRecord,
  PauseRecordResponse,
  RawEvAuthenticateAgentWithRcAccessTokenRes,
  RecordResponse,
} from './interfaces';
import type {
  EvClientServiceOptions,
  EvClientTransferParams,
  EvClientHangUpParams,
  EvClientHoldSessionParams,
  EvClientManualOutdialParams,
} from './EvClient.interface';
import { Environment } from '../Environment';

type ListenerType = (typeof EvCallbackTypes)['OPEN_SOCKET' | 'CLOSE_SOCKET'];

type Listener<
  T extends keyof EvClientCallMapping,
  U extends EvClientCallMapping = EvClientCallMapping,
> = (res: U[T]) => void;

/**
 * EvClient module - SDK wrapper for Engage Voice Agent Library
 * Handles WebSocket connections, SIP, and call operations
 */
@injectable({
  name: 'EvClient',
})
class EvClient extends RcModule {
  /** SDK instance */
  private _sdk: any;

  private _onOpen: (response: EvClientCallMapping['openResponse']) => void;

  private _onClose: () => void;

  // eslint-disable-next-line
  private _Sdk = null;

  private _options: EvAgentOptions;

  private _eventEmitter = new EventEmitter();

  private _callbacks: Record<string, Function> = {};

  @state
  appStatus: string = evStatus.START;

  constructor(
    protected _portManager: PortManager,
    @inject('EvClientOptions') protected evClientOptions: EvClientServiceOptions,
    @optional() protected _environment?: Environment,
  ) {
    super();
    this._options = this.evClientOptions.options;
    const { closeResponse, openResponse } = this.evClientOptions.callbacks;
    this._onOpen = async (res) => {
      await this.setAppStatus(evStatus.CONNECTED);
      openResponse(res);
      this._eventEmitter.emit(EvCallbackTypes.OPEN_SOCKET, res);
      // ensure for WebSocket keep-alive connection
      this._sdk.terminateStats();
    };
    this._onClose = async () => {
      this.logger.info('EvCallbackTypes.CLOSE_SOCKET~');
      await this.setAppStatus(evStatus.CLOSED);
      closeResponse();
      this._eventEmitter.emit(EvCallbackTypes.CLOSE_SOCKET);
    };
    // Used for toggle auth host about Engage Voice backend.
    if (typeof window !== 'undefined' && window.localStorage) {
      const authHost = window.localStorage.getItem('__authHost__');
      if (authHost) {
        this._options.authHost = authHost;
      }
    }
    if (this._portManager?.shared) {
      this._portManager.onMainTab(() => {
        this._initialize();
      });
    } else {
      this._initialize();
    }
  }

  _initialize() {
    const ffsDomain = localStorage.getItem('FFS_DOMAIN_INITIAL');
    if (!ffsDomain) {
      localStorage.setItem('FFS_DOMAIN_INITIAL', 'https://ffs.ringcentral.com');
    }
    const ffsExternal = localStorage.getItem('FFS_DOMAIN_EXTERNAL');
    if (!ffsExternal) {
      localStorage.setItem('FFS_DOMAIN_EXTERNAL', 'https://ffs.ringcentral.com');
    }
  }

  addListener<T extends ListenerType>(type: T, listener: Listener<T>) {
    this._eventEmitter.addListener(type, listener);
  }

  addListenerOnce<T extends ListenerType>(type: T, listener: Listener<T>) {
    this._eventEmitter.once(type, listener);
  }

  removeListener<T extends ListenerType>(
    type: ListenerType,
    listener: Listener<T>,
  ) {
    this._eventEmitter.removeListener(type, listener);
  }

  @delegate('mainClient')
  async loadCurrentCall(): Promise<EvBaseCall | void> {
    return new Promise<EvBaseCall | void>((resolve) => {
      this._sdk.loadCurrentCall(resolve);
    });
  }

  get currentCall(): EvBaseCall {
    return this._sdk.getCurrentCall();
  }

  @delegate('mainClient')
  async getCurrentCall(): Promise<EvBaseCall | void> {
    return this._sdk.getCurrentCall();
  }

  @action
  _setAppStatus(status: string) {
    this.appStatus = status;
  }

  @delegate('server')
  async setAppStatus(status: string): Promise<void> {
    this._setAppStatus(status);
  }

  setEnv(authHost: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('__authHost__', authHost);
      window.location.reload();
    }
  }

  setSIPNoLog(value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('__SIP_NO_LOG__', value);
      window.location.reload();
    }
  }

  @delegate('mainClient')
  async initSDK() {
    if (typeof window === 'undefined' || !window.AgentSDK) {
      return;
    }
    if (this._sdk) {
      this.logger.info('AgentSDK already initialized~~');
      return;
    }
    this.logger.info('Init AgentSDK~~');
    const options = { ...this._options };
    // Apply Environment module authHost override when enabled
    if (this._environment?.enabled && this._environment.evAuthServer) {
      options.authHost = this._environment.evAuthServer;
    }
    this._sdk = new window.AgentSDK({
      callbacks: {
        ...this._callbacks,
        [EvCallbackTypes.CLOSE_SOCKET]: this._onClose,
        [EvCallbackTypes.OPEN_SOCKET]: this._onOpen,
        [EvCallbackTypes.ACK]: (res: EvACKResponse) => {
          this._eventEmitter.emit(EvCallbackTypes.ACK, res);
        },
      },
      ...options,
    });
    window.AgentSDK.shared.HttpService.setApiBase(options.authHost);
  }

  on(eventType: string, callback: (...args: any[]) => void) {
    const _callback = {
      [eventType]: (...args: any[]) => callback(...args),
    };
    this._sdk.setCallbacks(_callback);
    this._callbacks = {
      ...this._callbacks,
      ..._callback,
    };
  }

  getEventCallback(eventType: string) {
    return this._sdk.getCallback(eventType);
  }

  getRefreshedToken() {
    return this._sdk.getRefreshedToken();
  }

  @delegate('mainClient')
  async authenticateAgentWithEngageAccessToken(
    engageAccessToken: string,
  ): Promise<EvAuthenticateAgentWithEngageAccessTokenRes> {
    return new Promise<EvAuthenticateAgentWithEngageAccessTokenRes>(
      async (resolve) => {
        await this.setAppStatus(evStatus.LOGIN);
        this._sdk.authenticateAgentWithEngageAccessToken(
          engageAccessToken,
          (response: EvAuthenticateAgentWithEngageAccessTokenRes) => {
            resolve(response);
          },
        );
      },
    );
  }

  @delegate('mainClient')
  async configureAgent({
    dialDest,
    queueIds,
    chatIds,
    skillProfileId,
    dialGroupId,
    updateFromAdminUI = false,
    isForce = false,
    loginType,
  }: EvConfigureAgentOptions): Promise<EvMessageRes> {
    return new Promise<EvMessageRes>((resolve) => {
      this.logger.info('configureAgent~~')
      this._sdk.loginAgent(
        dialDest,
        queueIds,
        chatIds,
        skillProfileId,
        dialGroupId,
        updateFromAdminUI,
        isForce,
        loginType,
        (res: any) => {
          this.logger.info('configureAgent response~~');
          resolve({
            type: messageTypes.CONFIGURE_AGENT,
            data: res,
          });
        },
      );
    });
  }

  @delegate('mainClient')
  async dispositionManualPass({
    dispId,
    notes,
    callbackDTS,
    leadId,
    requestId,
    externId,
  }: EvDispositionManualPassOptions): Promise<EvDispositionManualPassOptions> {
    return new Promise<EvDispositionManualPassOptions>((resolve) => {
      this._sdk.dispositionManualPass(
        dispId,
        notes,
        (response: EvDispositionManualPassOptions) => {
          resolve(response);
        },
        callbackDTS,
        leadId,
        requestId,
        externId,
      );
    });
  }

  @delegate('mainClient')
  async dispositionCall({
    uii,
    dispId = '',
    notes = '',
    callback,
    callbackDTS,
    contactForwardNumber,
    survey,
    externId,
    leadId,
    requestId = '',
  }: EvDispositionCallOptions) {
    return this._sdk.dispositionCall(
      this.decodeUii(uii),
      dispId,
      notes,
      callback,
      callbackDTS,
      contactForwardNumber,
      survey,
      externId,
      leadId,
      requestId,
    );
  }

  @delegate('mainClient')
  authenticateAgent(
    rcAccessToken: string,
    tokenType: EvTokenType,
  ): Promise<EvAuthenticateAgentWithRcAccessTokenRes> {
    return new Promise<EvAuthenticateAgentWithRcAccessTokenRes>(async (resolve) => {
      await this.setAppStatus(evStatus.LOGIN);
      this._sdk.authenticateAgentWithRcAccessToken(
        rcAccessToken,
        tokenType,
        async (res: RawEvAuthenticateAgentWithRcAccessTokenRes) => {
          if (res.type === 'Authenticate Error' || res.err) {
            return resolve(res);
          }
          res.rcAccessToken = rcAccessToken;
          // There three token types in the app
          // 1. RC token from RingCentral Single Sign-on API
          // 2. Engage token from Engage Auth:
          //     saved in authenticateRequest.engageAccessToken and Session.getAccessToken()
          //     it is used for ringcx HTTP requests, need to exchange with rc token again if expired
          // 3. AGENT SDK token for WebSocket connection:
          //     saved in authenticateRequest.accessToken,
          //     it is used for WebSocket connection
          //     It is refreshed in sdk by hashcode
          // Call authenticateAgentWithEngageAccessToken to pass engage token to AGENT SDK for WebSocket connection
          const engageAccessTokenResponse = await this.authenticateAgentWithEngageAccessToken(res.accessToken);
          if (typeof window !== 'undefined' && window.localStorage) {
            window.AgentSDK.shared.Session.storeAccessTokenResult({
              response: JSON.stringify(engageAccessTokenResponse),
            });
            window.AgentSDK.shared.Session.storeRCAccessTokenResult({
              response: JSON.stringify(engageAccessTokenResponse),
            });
          }
          // Apply locale from regional settings if available
          const locale = (res as any).regionalSettings?.language;
          if (locale) {
            this._eventEmitter.emit('setLocale', locale);
          }
          await this.setAppStatus(evStatus.LOGINED);
          const _agents = (res || {}).agents || [];
          const agents = _agents.map((agent) => ({
            ...agent,
            agentId: agent && agent.agentId ? `${agent.agentId}` : '',
            agentType: AGENT_TYPES[agent.agentType],
          }));
          resolve({
            ...res,
            agents,
          });
        },
      );
    });
  }

  @delegate('mainClient')
  openSocket(agentId: string): Promise<EvOpenSocketResult> {
    const hasSupportWebSocket =
      typeof window !== 'undefined' && 'WebSocket' in window;
    if (!hasSupportWebSocket) {
      throw new EvTypeError({
        type: messageTypes.INVALID_BROWSER,
      });
    }
    return new Promise<EvOpenSocketResult>((resolve) => {
      this.addListenerOnce(EvCallbackTypes.OPEN_SOCKET, (res) => {
        resolve(res);
      });
      this._sdk.openSocket(agentId);
    });
  }

  @delegate('mainClient')
  async getAgentConfig(): Promise<EvAgentConfig | null> {
    return new Promise<EvAgentConfig | null>((resolve) => {
      const timeoutId = setTimeout(() => resolve(null), 10000);
      this._sdk.getAgentConfig((res: EvAgentConfig) => {
        clearTimeout(timeoutId);
        resolve(res);
      });
    });
  }

  @delegate('mainClient')
  async getAndHandleAuthenticateResponse(
    rcAccessToken: string,
    tokenType: EvTokenType,
  ): Promise<EvAuthenticateAgentWithRcAccessTokenRes | { error: string, data?: string }> {
    const authenticateResponse = await waitUntilTo(
      () => {
        return this.authenticateAgent(rcAccessToken, tokenType);
      },
      {
        interval: 0,
        timeout: 120 * 1000,
      },
    ).catch((e) => {
      this.logger.error('getAndHandleAuthenticateResponse error~~', e);
      return {
        error: messageTypes.CONNECT_TIMEOUT
      };
    });
    // For testing auth error, comment out this code
    // if (!window.testAuthError) {
    //   window.testAuthError = 1;
    //   return {
    //     error: messageTypes.CONNECT_ERROR,
    //     data: authenticateResponse.message,
    //   };
    // }
    if (
      authenticateResponse.type === 'Authenticate Error' ||
      authenticateResponse.message
    ) {
      return {
        error: messageTypes.CONNECT_ERROR,
        data: authenticateResponse.message,
      };
    }
    if (
      !authenticateResponse ||
      !authenticateResponse.agents ||
      !authenticateResponse.agents.length
    ) {
      return {
        error: messageTypes.NO_AGENT,
      };
    }
    if (
      !authenticateResponse.agents[0] ||
      !authenticateResponse.agents[0].agentId
    ) {
      return {
        error: messageTypes.UNEXPECTED_AGENT,
      };
    }
    return authenticateResponse;
  }

  /**
   * when manual close socket, that closeSocket will auto reconnected by agent SDK
   */
  @delegate('mainClient')
  async closeSocket() {
    if (!this.ifSocketExist) {
      return;
    }
    this.logger.info('closeSocket~~');
    await this._sdk.closeSocket();
  }

  get ifSocketExist(): boolean {
    return !!this._sdk.socket;
  }

  @delegate('mainClient')
  async hangup({ sessionId, resetPendingDisp = false }: EvClientHangUpParams) {
    return this._sdk.hangup(sessionId, resetPendingDisp);
  }

  @delegate('mainClient')
  async logoutAgent(agentId: string): Promise<EvLogoutAgentResponse> {
    const uiModel = this._sdk._getUIModel().getInstance();
    if (!uiModel.agentSettings.isLoggedIn) {
      return {
        message: 'Agent is not logged in',
        status: 'OK',
        detail: 'Agent is not logged in',
      };
    }
    const logoutPromise = new Promise<EvLogoutAgentResponse>((resolve) => {
      this._sdk.logoutAgent(agentId, (result: EvLogoutAgentResponse) => {
        resolve(result);
      });
    });
    return waitUntilTo(() => logoutPromise, {
      interval: 0,
      timeout: 10 * 1000,
    }).catch((e) => {
      this.logger.warn('logoutAgent timeout~~', e);
      return {
        message: 'Logout timed out',
        status: 'TIMEOUT',
        detail: 'logoutAgent did not respond within the timeout period',
      };
    });
  }

  @delegate('mainClient')
  async manualOutdial({
    destination,
    callerId,
    ringTime,
    countryId,
    queueId,
  }: EvClientManualOutdialParams) {
    return this._sdk.manualOutdial(
      destination,
      callerId,
      ringTime,
      countryId,
      queueId,
    );
  }

  @delegate('mainClient')
  async manualOutdialCancel(uii: string) {
    await this._sdk.manualOutdialCancel(uii);
  }

  @delegate('mainClient')
  async offhookInit() {
    // we using EvCallbackTypes.OFFHOOK_INIT to catch data, do not pass callback,
    // that will make the message not come back
    await this._sdk.offhookInit();
  }

  @delegate('mainClient')
  async offhookTerm() {
    await this._sdk.offhookTerm();
  }

  @delegate('mainClient')
  async hold(holdState: boolean) {
    await this._sdk.hold(holdState);
  }

  @delegate('mainClient')
  async pauseRecord(isRecord: boolean): Promise<PauseRecord> {
    return new Promise<PauseRecord>((resolve, reject) => {
      return this._sdk.pauseRecord(
        isRecord,
        (response: PauseRecordResponse) => {
          const formattedResponse = {
            ...response,
            pause: response.pause ? Number(response.pause) : null,
          };
          if (response.status === 'OK') {
            resolve(formattedResponse);
          } else {
            reject(formattedResponse);
          }
        },
      );
    });
  }

  /**
   * toggle call recording on/off base on true|false boolean
   */
  @delegate('mainClient')
  async record(state: boolean): Promise<RecordResponse> {
    return new Promise<RecordResponse>((resolve, reject) => {
      return this._sdk.record(state, (response: RecordResponse) => {
        if (response.status === 'OK') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

  @delegate('mainClient')
  async holdSession({ state, sessionId }: EvClientHoldSessionParams) {
    await this._sdk.holdSession(state, sessionId);
  }

  @delegate('mainClient')
  async coldTransferCall({
    dialDest,
    callerId = '',
    sipHeaders = [],
  }: EvClientTransferParams): Promise<EvColdTransferCallResponse> {
    return new Promise<EvColdTransferCallResponse>((resolve, reject) => {
      this._sdk.coldXfer(
        dialDest,
        callerId,
        sipHeaders,
        (data: EvColdTransferCallResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }

  @delegate('mainClient')
  async warmTransferCall({
    dialDest,
    callerId = '',
    sipHeaders = [],
  }: EvClientTransferParams): Promise<EvWarmTransferCallResponse> {
    return new Promise<EvWarmTransferCallResponse>((resolve, reject) => {
      this._sdk.warmXfer(
        dialDest,
        callerId,
        sipHeaders,
        (data: EvWarmTransferCallResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }

  @delegate('mainClient')
  async coldTransferIntlCall({
    dialDest,
    callerId = '',
    sipHeaders = [],
    countryId = '',
  }: EvClientTransferParams): Promise<EvColdTransferIntlCallResponse> {
    return new Promise<EvColdTransferIntlCallResponse>((resolve, reject) => {
      this._sdk.internationalColdXfer(
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        (data: EvColdTransferIntlCallResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }

  @delegate('mainClient')
  async warmTransferIntlCall({
    dialDest,
    callerId = '',
    sipHeaders = [],
    countryId = '',
  }: EvClientTransferParams): Promise<EvWarmTransferIntlCallResponse> {
    return new Promise<EvWarmTransferIntlCallResponse>((resolve, reject) => {
      this._sdk.internationalWarmXfer(
        dialDest,
        callerId,
        sipHeaders,
        countryId,
        (data: EvWarmTransferIntlCallResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }

  @delegate('mainClient')
  async cancelWarmTransferCall(dialDest: string) {
    await this._sdk.warmXferCancel(dialDest);
  }

  @delegate('mainClient')
  async requeueCall({
    queueId,
    skillId = '',
    maintain = false,
  }: EvRequeueOption): Promise<EvRequeueCallResponse> {
    return new Promise<EvRequeueCallResponse>((resolve, reject) => {
      this._sdk.requeueCall(
        queueId,
        skillId,
        maintain,
        (data: EvRequeueCallResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }

  @delegate('mainClient')
  async fetchDirectAgentList(): Promise<EvDirectAgentListResponse> {
    return new Promise<EvDirectAgentListResponse>((resolve) => {
      this._sdk.directAgentXferList((data: EvDirectAgentListResponse) => {
        resolve(data);
      });
    });
  }

  encodeUii({ uii, sessionId }: Partial<EvAddSessionNotification>): string {
    return `${uii}${_encodeSymbol}${sessionId}`;
  }

  /**
   * replace sessionId with _encodeSymbol when ringing
   * @param _encodeSymbol '$'
   */
  encodeRingingUii({ uii }: EvBaseCall): string {
    return this.encodeUii({
      uii: this.decodeUii(uii),
      sessionId: _encodeSymbol,
    });
  }

  decodeUii(uii: string): string {
    return uii.split(_encodeSymbol)[0];
  }

  /**
   * get a main call session in some call session with some uii
   * @param uii call uii
   */
  getMainId(uii: string): string {
    return this.encodeUii({
      sessionId: '1',
      uii,
    });
  }

  @delegate('mainClient')
  async rejectDirectAgentTransferCall(uii: string) {
    await this._sdk.rejectDirectAgentXfer(this.decodeUii(uii));
  }

  @delegate('mainClient')
  async coldDirectAgentTransfer(targetAgentId: string) {
    await this._sdk.coldDirectAgentXfer(targetAgentId);
  }

  @delegate('mainClient')
  async warmDirectAgentTransfer(targetAgentId: string) {
    await this._sdk.warmDirectAgentXfer(targetAgentId);
  }

  @delegate('mainClient')
  async sendVoicemailDirectAgentTransfer(targetAgentId: string) {
    await this._sdk.voicemailDirectAgentXfer(targetAgentId);
  }

  @delegate('mainClient')
  async cancelDirectAgentTransfer(targetAgentId: string) {
    await this._sdk.cancelDirectAgentXfer(targetAgentId);
  }

  @delegate('mainClient')
  async setAgentState(agentState: string, agentAuxState: string) {
    return this._sdk.setAgentState(agentState, agentAuxState);
  }

  private _multiLoginRequest(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._sdk.multiLoginRequest();
      this.on(EvCallbackTypes.LOGIN, (data) => {
        if (data.status === 'SUCCESS') {
          resolve(data);
        } else {
          reject(data);
        }
      });
      this.on(EvCallbackTypes.GENERIC_NOTIFICATION, (data) => {
        if (data.messageCode === '-99') {
          reject(data);
        }
      });
    });
  }

  @delegate('mainClient')
  async multiLoginRequest(): Promise<{
    success: boolean;
    error?: string;
  }> {
    // temp solution, and wait for ev backend enhancement.
    try {
      await waitUntilTo(() => this._multiLoginRequest(), { timeout: 30000 });
      return { success: true };
    } catch (error) {
      return { success: false, error: '_multiLoginRequest fail or 30s timeout' };
    }
  }

  /**
   * WebRTC related methods
   */
  @delegate('mainClient')
  async sipInit() {
    await this._sdk.sipInit();
  }

  @delegate('mainClient')
  async sipAnswer() {
    await this._sdk.sipAnswer();
  }

  @delegate('mainClient')
  async sipRegister() {
    await this._sdk.sipRegister();
  }

  @delegate('mainClient')
  async sipTerminate() {
    await this._sdk.sipTerminate();
  }

  @delegate('mainClient')
  async sipHangUp() {
    await this._sdk.sipHangUp();
  }

  @delegate('mainClient')
  async sipReject() {
    await this._sdk.sipReject();
  }

  @delegate('mainClient')
  async sipSendDTMF(dtmf: string) {
    await this._sdk.sipSendDTMF(dtmf);
  }

  @delegate('mainClient')
  async sipToggleMute(state: boolean) {
    await this._sdk.sipToggleMute(state);
  }

  /**
   * AgentScript related methods
   */
  @delegate('mainClient')
  getScript(scriptId: string, version: string): Promise<EvScriptResponse> {
    return new Promise<EvScriptResponse>((resolve) => {
      this._sdk.getScript(scriptId, version, (res: EvScriptResponse) => {
        if (res.status) {
          resolve(res);
        }
      });
    });
  }

  @delegate('mainClient')
  async saveScriptResult(
    uii: string,
    scriptId: string,
    jsonResult: EvAgentScriptResult,
  ): Promise<EvAgentScriptResult> {
    this._sdk.saveScriptResult(uii, scriptId, jsonResult);
    return jsonResult;
  }

  /**
   * GET - /voice/api/v1/agent/:accountId/knowledgeBaseGroups
   */
  @delegate('mainClient')
  async getKnowledgeBaseGroups(
    knowledgeBaseGroupIds: number[],
  ): Promise<any | null> {
    const uiModel = this._sdk._getUIModel().getInstance();
    const HttpService = this._sdk._HttpService;
    const agentSettings: EvAgentSettings = this._sdk.getAgentSettings();
    const engageAccessToken = `Bearer ${uiModel.authenticateRequest.engageAccessToken}`;
    try {
      const { status, response } = await new HttpService(
        `${uiModel.authHost}/voice/api/v1/`,
      ).httpGet(`agent/${agentSettings.accountId}/knowledgeBaseGroups`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: engageAccessToken,
        },
        queryParams: {
          guid: agentSettings.guid,
          knowledgeBaseGroupIds,
        },
      });
      if (status === 200) {
        return JSON.parse(response);
      }
    } catch (error) {
      this.logger.error('getKnowledgeBaseGroups fail', error);
    }
    return null;
  }

  /**
   * Initialize SIP and register
   */
  @delegate('mainClient')
  sipInitAndRegister({
    agentId,
  }: {
    agentId: string;
  }): Promise<boolean> {
    this.logger.info('evClient sipInitAndRegister~~');
    const { isSso: ssoLogin } = this._sdk.getApplicationSettings();
    const { dialDest } = this._sdk.getAgentSettings();
    const authenticateRequest = this._sdk.getAuthenticateRequest();
    const authToken = authenticateRequest.engageAccessToken;
    return this._sdk.sipInitAndRegister({
      authToken,
      agentId: Number(agentId),
      callbacks: this._sdk.getCallbacks(),
      authHost: this._options.authHost,
      ssoLogin,
      dialDest,
    });
  }

  /**
   * Get preview dial leads
   */
  @delegate('mainClient')
  async getPreviewDial(): Promise<any> {
    return new Promise((resolve) => {
      this._sdk.previewFetch([], (res: any) => {
        resolve(res);
      });
    });
  }

  /**
   * Dial a preview lead
   */
  @delegate('mainClient')
  async previewDial(requestId: string, leadPhone: string, leadPhoneE164: string) {
    await this._sdk.previewDial(requestId, leadPhone, leadPhoneE164);
  }

  /**
   * Manual pass disposition
   */
  @delegate('mainClient')
  async manualPass({
    dispId,
    notes,
    callback,
    callbackDTS,
    leadId,
    requestId,
    externId,
  }: {
    dispId: string;
    notes: string;
    callback: boolean;
    callbackDTS: string;
    leadId: string;
    requestId: string;
    externId: string;
  }) {
    await this._sdk.dispositionManualPass(
      dispId,
      notes,
      callback,
      callbackDTS,
      leadId,
      requestId,
      externId,
    );
  }

  /**
   * Get campaign dispositions
   */
  @delegate('mainClient')
  async getCampaignDispositions(campaignId: string): Promise<any> {
    return new Promise((resolve) => {
      this._sdk.getCampaignDispositions(campaignId, (res: any) => {
        resolve(res);
      });
    });
  }

  @delegate('mainClient')
  async requestCallSummary(uii: string, sessionId: string, segmentId: string) {
    this._sdk.requestCallSummary(uii, sessionId, segmentId);
  }

  getFullUserDetails() {
    const userDetails = localStorage.getItem('engage-auth:fullUserDetails');
    if (!userDetails) {
      return;
    }
    const userDetailsJson = JSON.parse(userDetails);
    return userDetailsJson;
  }

  @delegate('mainClient')
  async refreshEvToken() {
    const Session = window.AgentSDK.shared.Session;
    let authenticateRequest = this._sdk.getAuthenticateRequest();
    const engageAccessToken = authenticateRequest.engageAccessToken;
    const sessionToken = Session.getAccessToken();
    if (engageAccessToken !== sessionToken) {
      Session.setAccessToken(engageAccessToken);
    }
    if (Session.isAccessTokenExpired()) {
      // there are no refresh token, so need to exchange with rc token again.
      return false;
    }
    return true;
  }

  @delegate('mainClient')
  async getEvTokenExpiredTime(): Promise<number> {
    const Session = window.AgentSDK.shared.Session;
    return Session.getClaims();
  }

  @delegate('mainClient')
  async clearEvSession() {
    const Session = window.AgentSDK.shared.Session;
    Session.clearSession();
    this.resetUIModel();
  }

  resetUIModel() {
    const instance = this._sdk._getUIModel().getInstance();
    if (instance.pingStatIntervalId) {
      clearInterval(instance.pingStatIntervalId);
    }
    if (instance.statsIntervalId) {
      clearInterval(instance.statsIntervalId);
    }
    instance.connectionSettings = {
      hashCode: '', // used specifically for reconnects
      reconnect: false, // variable tracks the type of login, on init it's false...once connected it's set to true
      isMultiSocket: false,
    };
    instance.applicationSettings.isLoggedInIS = false;
  }

  @delegate('mainClient')
  async updateActivityDisposition({
    dialogId,
    params,
  }): Promise<any | null> {
    const fullUserDetails = this.getFullUserDetails();
    const rcAccountId = fullUserDetails.rcAccountId;
    if (!rcAccountId) {
      return;
    }
    const rcxSubAccountId = this._sdk.getAgentSettings().accountId;
    const authenticateRequest = this._sdk.getAuthenticateRequest();
    const engageAccessToken = `Bearer ${authenticateRequest.engageAccessToken}`;
    try {
      const getResponse = await fetch(`${this._options.authHost}/api/cm/v1/accounts/${rcAccountId}/rcxSubaccounts/${rcxSubAccountId}/activities?dialogId=${dialogId}&withDisplayInfo=false`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: engageAccessToken,
        },
      });
      if (!getResponse.ok) {
        throw new Error('Failed to get activity disposition');
      }
      const activities = await getResponse.json();
      const activityId = activities?.records?.length > 0 ? activities.records[0]?.id : '';
      if (!activityId) return;
      const updateResponse = await fetch(`${this._options.authHost}/api/cm/v1/accounts/${rcAccountId}/rcxSubaccounts/${rcxSubAccountId}/activities/${activityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: engageAccessToken,
        },
        body: JSON.stringify(params),
      });
      if (!updateResponse.ok) {
        throw new Error('Failed to update activity disposition');
      }
      return updateResponse.json();
    } catch (error) {
      this.logger.error('updateActivityDisposition fail', error);
      throw error;
    }
  }
}

export { EvClient };

// eslint-disable-next-line import/no-unresolved
import '@SDK';
import { waitUntilTo } from '../../../lib/utils';
import {
  action,
  inject,
  injectable,
  RcModule,
  state,
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
  private _Sdk = window.AgentSDK;

  private _options: EvAgentOptions;

  private _eventEmitter = new EventEmitter();

  private _callbacks: Record<string, Function> = {};

  @state
  appStatus: string = evStatus.START;

  constructor(
    @inject('EvClientOptions') protected evClientOptions: EvClientServiceOptions,
  ) {
    super();
    this._options = this.evClientOptions.options;
    const { closeResponse, openResponse } = this.evClientOptions.callbacks;
    this._onOpen = (res) => {
      this.setAppStatus(evStatus.CONNECTED);
      openResponse(res);
      this._eventEmitter.emit(EvCallbackTypes.OPEN_SOCKET, res);
      // ensure for WebSocket keep-alive connection
      this._sdk.terminateStats();
    };
    this._onClose = () => {
      console.log('EvCallbackTypes.CLOSE_SOCKET~');
      this.setAppStatus(evStatus.CLOSED);
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

  loadCurrentCall(): Promise<EvBaseCall | void> {
    return new Promise<EvBaseCall | void>((resolve) => {
      this._sdk.loadCurrentCall(resolve);
    });
  }

  get currentCall(): EvBaseCall {
    return this._sdk.getCurrentCall();
  }

  @action
  setAppStatus(status: string) {
    this.appStatus = status;
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

  override onInitOnce() {
    this.initSDK();
  }

  initSDK() {
    console.log('initSDK');
    const { _Sdk: Sdk } = this;
    this._sdk = new Sdk({
      callbacks: {
        ...this._callbacks,
        [EvCallbackTypes.CLOSE_SOCKET]: this._onClose,
        [EvCallbackTypes.OPEN_SOCKET]: this._onOpen,
        [EvCallbackTypes.ACK]: (res: EvACKResponse) => {
          this._eventEmitter.emit(EvCallbackTypes.ACK, res);
        },
      },
      ...this._options,
    });
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
    this._sdk.getRefreshedToken();
  }

  authenticateAgentWithEngageAccessToken(
    engageAccessToken: string,
  ): Promise<EvAuthenticateAgentWithEngageAccessTokenRes> {
    return new Promise<EvAuthenticateAgentWithEngageAccessTokenRes>(
      (resolve) => {
        this.setAppStatus(evStatus.LOGIN);
        this._sdk.authenticateAgentWithEngageAccessToken(
          engageAccessToken,
          (response: EvAuthenticateAgentWithEngageAccessTokenRes) => {
            resolve(response);
          },
        );
      },
    );
  }

  configureAgent({
    dialDest,
    queueIds,
    chatIds,
    skillProfileId,
    dialGroupId,
    updateFromAdminUI = false,
    isForce = false,
  }: EvConfigureAgentOptions): Promise<EvMessageRes> {
    return new Promise<EvMessageRes>((resolve) => {
      this._sdk.loginAgent(
        dialDest,
        queueIds,
        chatIds,
        skillProfileId,
        dialGroupId,
        updateFromAdminUI,
        isForce,
        (res: any) => {
          resolve({
            type: messageTypes.CONFIGURE_AGENT,
            data: res,
          });
        },
      );
    });
  }

  dispositionManualPass({
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

  dispositionCall({
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

  authenticateAgent(
    rcAccessToken: string,
    tokenType: EvTokenType,
  ): Promise<EvAuthenticateAgentWithRcAccessTokenRes> {
    return new Promise<EvAuthenticateAgentWithRcAccessTokenRes>((resolve) => {
      this.setAppStatus(evStatus.LOGIN);
      this._sdk.authenticateAgentWithRcAccessToken(
        rcAccessToken,
        tokenType,
        async (res: RawEvAuthenticateAgentWithRcAccessTokenRes) => {
          // here just auth with engage access token, not need handle response data, that handle by Agent SDK.
          await this.authenticateAgentWithEngageAccessToken(res.accessToken);
          this.setAppStatus(evStatus.LOGINED);
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

  getAgentConfig(): Promise<EvAgentConfig> {
    return new Promise<EvAgentConfig>((resolve) => {
      this._sdk.getAgentConfig((res: EvAgentConfig) => {
        resolve(res);
      });
    });
  }

  async getAndHandleAuthenticateResponse(
    rcAccessToken: string,
    tokenType: EvTokenType,
  ): Promise<EvAuthenticateAgentWithRcAccessTokenRes> {
    const authenticateResponse = await waitUntilTo(
      () => {
        return this.authenticateAgent(rcAccessToken, tokenType);
      },
      {
        interval: 0,
        timeout: 120 * 1000,
      },
    ).catch(() => {
      throw new EvTypeError({
        type: messageTypes.CONNECT_TIMEOUT,
      });
    });
    if (
      authenticateResponse.type === 'Authenticate Error' ||
      authenticateResponse.message
    ) {
      throw new EvTypeError({
        type: messageTypes.CONNECT_ERROR,
        data: authenticateResponse.message,
      });
    }
    if (
      !authenticateResponse ||
      !authenticateResponse.agents ||
      !authenticateResponse.agents.length
    ) {
      throw new EvTypeError({
        type: messageTypes.NO_AGENT,
      });
    }
    if (
      !authenticateResponse.agents[0] ||
      !authenticateResponse.agents[0].agentId
    ) {
      throw new EvTypeError({
        type: messageTypes.UNEXPECTED_AGENT,
      });
    }
    return authenticateResponse;
  }

  /**
   * when manual close socket, that closeSocket will auto reconnected by agent SDK
   */
  closeSocket() {
    this._sdk.closeSocket();
  }

  get ifSocketExist(): boolean {
    return !!this._sdk.socket;
  }

  hangup({ sessionId, resetPendingDisp = false }: EvClientHangUpParams) {
    return this._sdk.hangup(sessionId, resetPendingDisp);
  }

  logoutAgent(agentId: string): Promise<EvLogoutAgentResponse> {
    return new Promise<EvLogoutAgentResponse>((resolve) => {
      this._sdk.logoutAgent(agentId, (result: EvLogoutAgentResponse) => {
        resolve(result);
      });
    });
  }

  manualOutdial({
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

  manualOutdialCancel(uii: string) {
    this._sdk.manualOutdialCancel(uii);
  }

  offhookInit() {
    // we using EvCallbackTypes.OFFHOOK_INIT to catch data, do not pass callback,
    // that will make the message not come back
    this._sdk.offhookInit();
  }

  offhookTerm() {
    this._sdk.offhookTerm();
  }

  hold(holdState: boolean) {
    this._sdk.hold(holdState);
  }

  pauseRecord(isRecord: boolean): Promise<PauseRecord> {
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
  record(state: boolean): Promise<RecordResponse> {
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

  holdSession({ state, sessionId }: EvClientHoldSessionParams) {
    this._sdk.holdSession(state, sessionId);
  }

  coldTransferCall({
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

  warmTransferCall({
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

  coldTransferIntlCall({
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

  warmTransferIntlCall({
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

  cancelWarmTransferCall(dialDest: string) {
    this._sdk.warmXferCancel(dialDest);
  }

  requeueCall({
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

  fetchDirectAgentList(): Promise<EvDirectAgentListResponse> {
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

  rejectDirectAgentTransferCall(uii: string) {
    this._sdk.rejectDirectAgentXfer(this.decodeUii(uii));
  }

  coldDirectAgentTransfer(targetAgentId: string) {
    this._sdk.coldDirectAgentXfer(targetAgentId);
  }

  warmDirectAgentTransfer(targetAgentId: string) {
    this._sdk.warmDirectAgentXfer(targetAgentId);
  }

  sendVoicemailDirectAgentTransfer(targetAgentId: string) {
    this._sdk.voicemailDirectAgentXfer(targetAgentId);
  }

  cancelDirectAgentTransfer(targetAgentId: string) {
    this._sdk.cancelDirectAgentXfer(targetAgentId);
  }

  setAgentState(agentState: string, agentAuxState: string) {
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

  async multiLoginRequest(): Promise<void> {
    // temp solution, and wait for ev backend enhancement.
    try {
      await waitUntilTo(() => this._multiLoginRequest(), { timeout: 30000 });
    } catch (error) {
      throw new Error('_multiLoginRequest fail or 30s timeout');
    }
  }

  /**
   * WebRTC related methods
   */
  sipInit() {
    this._sdk.sipInit();
  }

  sipAnswer() {
    this._sdk.sipAnswer();
  }

  sipRegister() {
    this._sdk.sipRegister();
  }

  sipTerminate() {
    this._sdk.sipTerminate();
  }

  sipHangUp() {
    this._sdk.sipHangUp();
  }

  sipReject() {
    this._sdk.sipReject();
  }

  sipSendDTMF(dtmf: string) {
    this._sdk.sipSendDTMF(dtmf);
  }

  sipToggleMute(state: boolean) {
    this._sdk.sipToggleMute(state);
  }

  /**
   * AgentScript related methods
   */
  getScript(scriptId: string, version: string): Promise<EvScriptResponse> {
    return new Promise<EvScriptResponse>((resolve) => {
      this._sdk.getScript(scriptId, version, (res: EvScriptResponse) => {
        if (res.status) {
          resolve(res);
        }
      });
    });
  }

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
  async getKnowledgeBaseGroups(
    knowledgeBaseGroupIds: number[],
  ): Promise<any | null> {
    this.getRefreshedToken();
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
      console.log('getKnowledgeBaseGroups fail');
    }
    return null;
  }

  /**
   * Initialize SIP and register
   */
  sipInitAndRegister({
    agentId,
    authToken,
  }: {
    agentId: string;
    authToken: string;
  }): Promise<boolean> {
    const { isSso: ssoLogin } = this._sdk.getApplicationSettings();
    const { dialDest } = this._sdk.getAgentSettings();
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
  getPreviewDial(): Promise<any> {
    return new Promise((resolve) => {
      this._sdk.previewFetch([], (res: any) => {
        resolve(res);
      });
    });
  }

  /**
   * Dial a preview lead
   */
  previewDial(requestId: string, leadPhone: string, leadPhoneE164: string) {
    this._sdk.previewDial(requestId, leadPhone, leadPhoneE164);
  }

  /**
   * Manual pass disposition
   */
  manualPass({
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
    this._sdk.dispositionManualPass(
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
  getCampaignDispositions(campaignId: string): Promise<any> {
    return new Promise((resolve) => {
      this._sdk.getCampaignDispositions(campaignId, (res: any) => {
        resolve(res);
      });
    });
  }
}

export { EvClient };

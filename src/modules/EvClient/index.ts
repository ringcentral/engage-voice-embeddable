import { EvClient as EvClientBase } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient';
import { EvCallbackTypes, evStatus } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums';
import { Module } from '@ringcentral-integration/commons/lib/di';

import type {
  EvACKResponse,
  EvAuthenticateAgentWithRcAccessTokenRes,
  EvTokenType,
  RawEvAuthenticateAgentWithRcAccessTokenRes,
} from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/interfaces';

const AGENT_TYPES = {
  AGENT: 'agent',
  SUPERVISOR: 'supervisor',
};

@Module({
  name: 'EvClient',
  deps: [
    { dep: 'Environment' },
    { dep: 'Locale' },
    { dep: 'EvClientOptions', optional: true }
  ],
})
export class EvClient extends EvClientBase {
  initSDK() {
    console.log('initSDK');
    const { _Sdk: Sdk } = this;
    const options = {
      ...this._options,
    };
    if (this._deps.environment.enabled && this._deps.environment.evAuthServer) {
      options.authHost = this._deps.environment.evAuthServer;
    }
    this._sdk = new Sdk({
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
  }

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
      ssoLogin, // else goes to freeswitch
      dialDest,
    });
  }

  authenticateAgent(rcAccessToken: string, tokenType: EvTokenType) {
    return new Promise<EvAuthenticateAgentWithRcAccessTokenRes>((resolve) => {
      this.setAppStatus(evStatus.LOGIN);
      this._sdk.authenticateAgentWithRcAccessToken(
        rcAccessToken,
        tokenType,
        async (res: RawEvAuthenticateAgentWithRcAccessTokenRes) => {
          // For Session in Agent SDK
          localStorage.setItem('engage-auth:tokenType', res.tokenType);
          localStorage.setItem('engage-auth:accessToken', res.accessToken);
          localStorage.setItem('engage-auth:refreshToken', res.refreshToken);
          // here just auth with engage access token, not need handle response data, that handle by Agent SDK.
          await this.authenticateAgentWithEngageAccessToken(res.accessToken);

          let locale = res.regionalSettings?.language;
          if (locale) {
            this._deps.locale.setLocale(locale);
            this._eventEmitter.emit('setLocale', locale);
          }
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

  getPreviewDial() {
    return new Promise((resolve) => {
      this._sdk.previewFetch([], (res) => {
        resolve(res);
      });
    });
  }

  previewDial(requestId, leadPhone, leadPhoneE164) {
    this._sdk.previewDial(requestId, leadPhone, leadPhoneE164);
  }

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

  getCampaignDispositions(campaignId: string) {
    return new Promise((resolve) => {
      this._sdk.getCampaignDispositions(campaignId, (res) => {
        resolve(res);
      });
    });
  }
}

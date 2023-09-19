import { EvClient as EvClientBase } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient';
import { EvCallbackTypes } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums/callbackTypes';
import { Module } from '@ringcentral-integration/commons/lib/di';

@Module({
  name: 'EvClient',
  deps: [
    { dep: 'Environment' },
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
}

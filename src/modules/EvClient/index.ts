import { EvClient as EvClientBase } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient';

import { Module } from 'ringcentral-integration/lib/di';

@Module({
  name: 'EvClient',
  deps: [
    { dep: 'Environment' },
    { dep: 'EvClientOptions', optional: true, spread: true }
  ],
})
export class EvClient extends EvClientBase {
  constructor({ environment, ...options }) {
    super(options);
    this._environment = environment;
  }

  initSDK() {
    console.log('initSDK');
    const { _Sdk: Sdk } = this;
    const options = {
      ...this._options,
    };
    if (this._environment.enabled && this._environment.evAuthServer) {
      options.authHost = this._environment.evAuthServer;
    }
    this._sdk = new Sdk({
      callbacks: {
        ...this._callbacks,
        closeResponse: this._onClose,
        openResponse: this._onOpen,
      },
      ...options,
    });
  }
}

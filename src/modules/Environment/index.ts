import { SDK } from '@ringcentral/sdk';
import { Module } from 'ringcentral-integration/lib/di';
import BasicEnvironment from 'ringcentral-integration/modules/Environment';
import isBlank from 'ringcentral-integration/lib/isBlank';

const environment = {
  mode: 'sf-lightning',
};

import {
  getClientIdReducer,
  getClientSecretReducer,
  getEngageVoiceServerReducer,
} from './getReducer';

@Module({
  name: 'Environment',
  deps: [
    'Client',
    'GlobalStorage',
    'SdkConfig',
    'EvClientOptions',
    { dep: 'EnvironmentOptions', optional: true }
  ]
})
class Environment extends BasicEnvironment {
  private _clientIdStorageKey: string;
  private _clientSecretStorageKey: string;
  private _evAuthServerStorageKey: string;

  constructor({
    client,
    globalStorage,
    sdkConfig,
    evClientOptions,
    ...options
  }) {
    super({
      client,
      globalStorage,
      sdkConfig,
      ...options,
    });
    this._clientIdStorageKey = 'environmentClientId';
    this._clientSecretStorageKey = 'environmentClientSecret';
    this._evAuthServerStorageKey = 'environmentEvAuthServer';

    this._globalStorage.registerReducer({
      key: this._clientIdStorageKey,
      reducer: getClientIdReducer({ types: this.actionTypes }),
    });
    this._globalStorage.registerReducer({
      key: this._clientSecretStorageKey,
      reducer: getClientSecretReducer({ types: this.actionTypes }),
    });
    this._globalStorage.registerReducer({
      key: this._evAuthServerStorageKey,
      reducer: getEngageVoiceServerReducer({
        types: this.actionTypes,
        defaultServer: evClientOptions.options.authHost,
      }),
    });
  }

  _getSdkConfig({ enabled, server, clientId, clientSecret }) {
    const newConfig = {
      ...this._sdkConfig,
    };
    if (enabled) {
      newConfig.server = server;
      if (!isBlank(clientId)) {
        newConfig.clientId = clientId;
        if (!isBlank(clientSecret)) {
          newConfig.clientSecret = clientSecret;
        } else {
          delete newConfig.clientSecret;
        }
      }
    }
    return newConfig;
  }

  _initClientService() {
    if (this.enabled) {
      const config = this._getSdkConfig(
        {
          enabled: this.enabled,
          server: this.server,
          clientId: this.clientId,
          clientSecret: this.clientSecret
        }
      );
      this._client.service = new SDK(config);
    }
  }

  _changeEnvironment(enabled, server, clientId, clientSecret) {
    const newConfig = this._getSdkConfig(
      { enabled, server, clientId, clientSecret }
    );
    this._client.service = new SDK(newConfig);
  }

  async setData({ server, recordingHost, enabled, clientId, clientSecret, evAuthServer }) {
    const environmentChanged =
      this.enabled !== enabled ||
      (enabled && this.server !== server) ||
      (enabled && this.clientId !== clientId) ||
      (enabled && this.clientSecret !== clientSecret)
      ;
    if (environmentChanged) { // recordingHost changed no need to set to SDK
      this._changeEnvironment(enabled, server, clientId, clientSecret);
    }

    this.store.dispatch({
      type: this.actionTypes.setData,
      server,
      recordingHost,
      enabled,
      environmentChanged,
      clientId,
      clientSecret,
      evAuthServer,
    });
  }

  get view() {
    return environment;
  }

  get clientId() {
    return this._globalStorage.getItem(this._clientIdStorageKey);
  }

  get clientSecret() {
    return this._globalStorage.getItem(this._clientSecretStorageKey);
  }

  get evAuthServer() {
    return this._globalStorage.getItem(this._evAuthServerStorageKey);
  }
}

export { Environment, environment };

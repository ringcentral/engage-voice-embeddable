import { SDK } from '@ringcentral/sdk';
import { Module } from '@ringcentral-integration/commons/lib/di';
import { Environment as EnvironmentBase } from '@ringcentral-integration/commons/modules/Environment';
import { isBlank } from '@ringcentral-integration/commons/lib/isBlank';
import { action, state, globalStorage } from '@ringcentral-integration/core';

const environment = {
  mode: 'sf-lightning',
};
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
class Environment extends EnvironmentBase {
  @globalStorage
  @state
  clientId = '';

  @globalStorage
  @state
  clientSecret = '';

  @globalStorage
  @state
  evAuthServer = '';

  getSdkConfig() {
    const newConfig = {
      ...this._deps.sdkConfig,
    };
    if (this.enabled) {
      newConfig.server = this.server;
      if (!isBlank(clientId)) {
        newConfig.clientId = this.clientId;
        if (!isBlank(this.clientSecret)) {
          newConfig.clientSecret = this.clientSecret;
        } else {
          delete newConfig.clientSecret;
        }
      }
    }
    return newConfig;
  }

  changeEnvironment() {
    const newConfig = this.getSdkConfig();
    this._deps.client.service = new SDK(newConfig);
  }

  @action
  setEnvData({ server, recordingHost, enabled, clientId, clientSecret, evAuthServer }) {
    this.server = server;
    this.recordingHostState = recordingHost;
    this.enabled = enabled;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.evAuthServer = evAuthServer;
  }

  async setData({
    server,
    recordingHost,
    enabled,
    clientId,
    clientSecret,
    evAuthServer,
    environmentChanged = false,
  }) {
    // `recordingHost` change no need to set to SDK
    const isEnvChanged =
      environmentChanged ||
      this.enabled !== enabled ||
      (enabled && this.server !== server) ||
      (enabled && this.clientId !== clientId) ||
      (enabled && this.clientSecret !== clientSecret) ||
      (enabled && this.evAuthServer !== evAuthServer);

    this.setEnvData({
      server,
      recordingHost,
      enabled,
      clientId,
      clientSecret,
      evAuthServer,
    });

    if (isEnvChanged) {
      // apply changes
      this.changeEnvironment();
      // notify change at last
      this.updateChangeCounter();
    }
  }
}

export { Environment, environment };

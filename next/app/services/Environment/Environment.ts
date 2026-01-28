import { isBlank } from '@ringcentral-integration/commons/lib/isBlank';
import {
  action,
  injectable,
  inject,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import type {
  EnvironmentOptions,
  EnvironmentData,
  SdkConfig,
} from './Environment.interface';

export const environment = {
  mode: 'sf-lightning',
};

/**
 * Environment module - SDK configuration and environment management
 * Handles server switching, client credentials, and environment changes
 */
@injectable({
  name: 'Environment',
})
class Environment extends RcModule {
  private _changeCounter = 0;

  constructor(
    @inject('SdkConfig') private sdkConfig: SdkConfig,
    private storagePlugin: StoragePlugin,
    @optional('EnvironmentOptions') private environmentOptions?: EnvironmentOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  server = '';

  @storage
  @state
  recordingHost = '';

  @storage
  @state
  enabled = false;

  @storage
  @state
  clientId = '';

  @storage
  @state
  clientSecret = '';

  @storage
  @state
  evAuthServer = '';

  get changeCounter(): number {
    return this._changeCounter;
  }

  /**
   * Get SDK configuration with environment overrides
   */
  getSdkConfig(): SdkConfig {
    const newConfig = {
      ...this.sdkConfig,
    };
    if (this.enabled) {
      newConfig.server = this.server;
      if (!isBlank(this.clientId)) {
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

  /**
   * Update change counter to notify of environment changes
   */
  updateChangeCounter() {
    this._changeCounter += 1;
  }

  @action
  setEnvData({
    server,
    recordingHost,
    enabled,
    clientId,
    clientSecret,
    evAuthServer,
  }: EnvironmentData) {
    this.server = server;
    this.recordingHost = recordingHost;
    this.enabled = enabled;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.evAuthServer = evAuthServer;
  }

  /**
   * Set environment data and apply changes
   */
  async setData({
    server,
    recordingHost,
    enabled,
    clientId,
    clientSecret,
    evAuthServer,
    environmentChanged = false,
  }: EnvironmentData & { environmentChanged?: boolean }): Promise<void> {
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
      this.updateChangeCounter();
    }
  }
}

export { Environment };

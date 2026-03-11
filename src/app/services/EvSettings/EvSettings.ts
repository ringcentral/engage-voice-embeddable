import {
  computed,
  injectable,
  optional,
  RcModule,
  PortManager,
  delegate,
} from '@ringcentral-integration/next-core';

import { EvClient } from '../EvClient';
import { EvAgentSession } from '../EvAgentSession';
import { EvPresence } from '../EvPresence';
import type { EvSettingsOptions, OffhookState } from './EvSettings.interface';

/**
 * EvSettings module - Application settings management
 * Facade over EvPresence for offhook state and EvAgentSession for login type.
 * All offhook state is managed reactively by EvPresence (@state + @action).
 */
@injectable({
  name: 'EvSettings',
})
class EvSettings extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAgentSession: EvAgentSession,
    private evPresence: EvPresence,
    private portManager: PortManager,
    @optional('EvSettingsOptions') private evSettingsOptions?: EvSettingsOptions,
  ) {
    super();
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  initialize() {
    this.evAgentSession.onTriggerConfig(() => {
      this.evPresence.setOffhookTerm();
    });
  }

  get loginType() {
    return this.evAgentSession.loginType;
  }

  get isOffhook(): boolean {
    return this.evPresence.isOffhook;
  }

  get isOffhooking(): boolean {
    return this.evPresence.isOffhooking;
  }

  get isManualOffhook(): boolean {
    return this.evPresence.isManualOffhook;
  }

  @computed((that: EvSettings) => [
    that.evPresence.isOffhooking,
    that.evPresence.isOffhook,
  ])
  get offhookState(): OffhookState {
    if (this.isOffhooking) {
      return this.isOffhook ? 'disconnecting' : 'connecting';
    }
    return this.isOffhook ? 'connected' : 'disconnected';
  }

  /**
   * Toggle offhook state - delegates state management to EvPresence
   * and sends offhook commands via EvClient
   */
  @delegate('server')
  async offHook(): Promise<void> {
    await this.evPresence.setOffhooking(true);
    if (this.isOffhook) {
      await this.evPresence.setIsManualOffhook(false);
      await this.evClient.offhookTerm();
    } else {
      await this.evPresence.setIsManualOffhook(true);
      await this.evClient.offhookInit();
    }
  }
}

export { EvSettings };

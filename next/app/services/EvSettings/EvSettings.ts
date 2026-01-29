import {
  computed,
  injectable,
  optional,
  RcModule,
} from '@ringcentral-integration/next-core';

import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvAgentSession } from '../EvAgentSession';
import type { EvSettingsOptions, OffhookState } from './EvSettings.interface';

/**
 * EvSettings module - Application settings management
 * Provides access to Engage Voice settings and phone offhook state
 */
@injectable({
  name: 'EvSettings',
})
class EvSettings extends RcModule {
  private _offhookState: OffhookState = 'disconnected';
  private _isOffhooking = false;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evAgentSession: EvAgentSession,
    @optional('EvSettingsOptions') private evSettingsOptions?: EvSettingsOptions,
  ) {
    super();
    this.evAgentSession.onTriggerConfig(() => {
      this._resetOffhook();
    });
  }

  get offhookState(): OffhookState {
    return this._offhookState;
  }

  get isOffhook(): boolean {
    return this._offhookState === 'connected';
  }

  get isOffhooking(): boolean {
    return this._isOffhooking;
  }

  get isManualOffhook(): boolean {
    return this.evAuth.agentConfig?.agentSettings?.manualOutdialPaMode === 'MANUAL_PA';
  }

  get loginType() {
    return this.evAgentSession.loginType;
  }

  private _resetOffhook() {
    this._offhookState = 'disconnected';
    this._isOffhooking = false;
  }

  /**
   * Toggle offhook state
   */
  async offHook(): Promise<void> {
    if (this._isOffhooking) {
      return;
    }
    this._isOffhooking = true;
    try {
      if (this.isOffhook) {
        this._offhookState = 'disconnecting';
        this.evClient.offhookTerm();
        this._offhookState = 'disconnected';
      } else {
        this._offhookState = 'connecting';
        this.evClient.offhookInit();
        this._offhookState = 'connected';
      }
    } finally {
      this._isOffhooking = false;
    }
  }
}

export { EvSettings };

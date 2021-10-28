import { EvAgentSession as EvAgentSessionBase } from '@ringcentral-integration/engage-voice-widgets/modules/EvAgentSession';

import { Module } from '@ringcentral-integration/commons/lib/di';

@Module({
  name: 'EvAgentSession',
  deps: [],
})
export class EvAgentSession extends EvAgentSessionBase {
  constructor(options) {
    super(options);

    if (this._deps.evAgentSessionOptions.fromPopup) {
      this.onConfigSuccess(() => {
        if (this.isMainTab) {
          return;
        }
        this._tabReConfig();
      });
    }
  }

  // override
  private async _newMainTabReConfig() {
    console.log(
      '_newMainTabReConfig~',
      this._deps.evAuth.connected,
      this.configSuccess,
      this.isMainTab,
    );

    if (
      this._deps.evAuth.connected &&
      this.configSuccess &&
      this.isMainTab
    ) {
      console.log('_newMainTabReConfig success~');
      await this._tabReConfig();
    }
  }
}

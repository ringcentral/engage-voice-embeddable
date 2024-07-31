import { Module } from '@ringcentral-integration/commons/lib/di';

import { EvAuth as EvAuthBase } from '@ringcentral-integration/engage-voice-widgets/modules/EvAuth';

@Module({
  name: 'EvAuth',
  deps: [],
})
export class EvAuth extends EvAuthBase {
  getAgentId() {
    return this.agentId;
  }

  get isI18nEnabled() {
    return !!this.agent?.isI18nEnabled;
  }
}

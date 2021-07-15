import { Module } from '@ringcentral-integration/commons/lib/di';

import { EvCall as BaseEvCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvCall';

@Module({
  deps: [],
})
class EvCall extends BaseEvCall {
  // override to remove @computed to fix no render issue.
  get currentCall() {
    const call = this._deps.evCallMonitor.callsMapping[this.activityCallId];
    return this.activityCallId && call ? call : null;
  }
}

export { EvCall };

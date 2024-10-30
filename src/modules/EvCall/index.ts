import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  action,
} from '@ringcentral-integration/core';
import { EvCall as BaseEvCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvCall';

const DEFAULT_OUTBOUND_SETTING = {
  dialoutCallerId: '-1',
  dialoutQueueId: '-1',
  dialoutCountryId: 'USA',
  dialoutRingTime: 30,
};

@Module({
  deps: [],
})
class EvCall extends BaseEvCall {
  // override to remove @computed to fix no render issue.
  get currentCall() {
    const call = this._deps.evCallMonitor.callsMapping[this.activityCallId];
    return this.activityCallId && call ? call : null;
  }

  @action
  resetOutBoundDialSetting() {
    this.dialoutCallerId = DEFAULT_OUTBOUND_SETTING.dialoutCallerId;
    this.dialoutQueueId = DEFAULT_OUTBOUND_SETTING.dialoutQueueId;
    this.dialoutCountryId = DEFAULT_OUTBOUND_SETTING.dialoutCountryId;
    if (
      this._deps.evAuth.availableCountries.length > 0 &&
      !this._deps.evAuth.availableCountries.find(c => c.countryId === this.dialoutCountryId)
    ) {
      this.dialoutCountryId = this._deps.evAuth.availableCountries[0].countryId;
    }
    
    this.dialoutRingTime = DEFAULT_OUTBOUND_SETTING.dialoutRingTime;
    const defaultRingTime = parseInt(
      this._deps.evAuth.outboundManualDefaultRingtime,
      10,
    );
    if (!Number.isNaN(defaultRingTime)) {
      this.formGroup.dialoutRingTime = defaultRingTime;
      this.dialoutRingTime = defaultRingTime;
    }
  }
}

export { EvCall };

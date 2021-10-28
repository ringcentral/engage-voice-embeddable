import { EvCallbackTypes } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient/enums';
import { watch } from '@ringcentral-integration/core';
import { Module } from '@ringcentral-integration/commons/lib/di';

import { EvIntegratedSoftphone as EvIntegratedSoftphoneBase } from '@ringcentral-integration/engage-voice-widgets/modules/EvIntegratedSoftphone';

@Module({
  name: 'EvIntegratedSoftphone',
  deps: [],
})
export class EvIntegratedSoftphone extends EvIntegratedSoftphoneBase {
  private _realSipConnected = false;

  constructor(options) {
    super(options);
    watch(
      this,
      () => this.isWebRTCTab,
      (isWebRTCTab) => {
        if (!isWebRTCTab && this._realSipConnected) {
          this._realSipConnected = false;
          this._resetAllState();
        }
      }
    )
  }

  _bindingIntegratedSoftphone() {
    super._bindingIntegratedSoftphone();
    this._deps.evSubscription.subscribe(EvCallbackTypes.SIP_REGISTERED, () => {
      this._realSipConnected = true;
    });
  }
}

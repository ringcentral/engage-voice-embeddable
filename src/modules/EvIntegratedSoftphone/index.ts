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

  private async _connectedWebRTC() {
    try {
      await this._deps.evClient.sipInitAndRegister({
        agentId: this._deps.evAuth.getAgentId(),
        authToken: this._deps.evAuth.authenticateResponse.accessToken,
      });
      await this.onceRegistered();

      this.setSipRegistering(false);
      this._closeWebRTCConnectingMask();
    } catch (error) {
      console.error(error);
    }
  }
}

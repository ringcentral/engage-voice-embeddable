import { Module } from 'ringcentral-integration/lib/di';
import OAuthBase from 'ringcentral-widgets/modules/OAuth';

import messageTypes from '../../enums/messageTypes';

@Module({
  name: 'OAuth',
  deps: [
    { dep: 'OAuthOptions', optional: true }
  ]
})
export default class OAuth extends OAuthBase {
  private _disableLoginPopup: boolean;

  constructor({
    disableLoginPopup = false,
    ...options
  }) {
    super(options);
    this._disableLoginPopup = disableLoginPopup;
  }

  openOAuthPage() {
    if (this._disableLoginPopup) {
      window.parent.postMessage({
        type: messageTypes.loginPopup,
        oAuthUri: this.oAuthUri,
      }, '*');
      return
    }
    super.openOAuthPage();
  }
}


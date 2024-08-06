import { Module } from '@ringcentral-integration/commons/lib/di';
import OAuthBase from '@ringcentral-integration/widgets/modules/OAuth';

import messageTypes from '../../enums/messageTypes';

@Module({
  name: 'OAuth',
  deps: [
    { dep: 'OAuthOptions', optional: true }
  ]
})
export default class OAuth extends OAuthBase {
  openOAuthPage() {
    if (this._deps.oAuthOptions.disableLoginPopup) {
      window.parent.postMessage({
        type: messageTypes.loginPopup,
        oAuthUri: this.oAuthUri,
      }, '*');
      return
    }
    super.openOAuthPage();
  }
}


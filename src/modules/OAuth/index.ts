import { Module } from '@ringcentral-integration/commons/lib/di';
import OAuthBase from '@ringcentral-integration/widgets/modules/OAuth';
import { loginStatus } from '@ringcentral-integration/commons/modules/Auth/loginStatus';
import { watch } from '@ringcentral-integration/core';
import messageTypes from '../../enums/messageTypes';

@Module({
  name: 'OAuth',
  deps: [
    { dep: 'OAuthOptions', optional: true }
  ]
})
export default class OAuth extends OAuthBase {
  protected _userLogout = false;

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

  override onInitOnce() {
    super.onInitOnce();
    watch(
      this,
      () => [
        this.ready,
        this._deps.auth.loginStatus,
      ],
      async () => {
        if (!this.ready) {
          return;
        }
        if (this._deps.auth.loginStatus === loginStatus.beforeLogout) {
          // Do not jwt login after logout
          this._userLogout = true;
        }
        if (this._userLogout) {
          return;
        }
        if (
          !this._deps.auth.notLoggedIn
        ) {
          return;
        }
        if (this._deps.oAuthOptions.jwt) {
          this._deps.auth.setLogin();
          this._deps.client.service.platform().login({
            jwt: this._deps.oAuthOptions.jwt,
          });
        }
      },
      {
        multiple: true,
      },
    );
  }
}


import { Module } from '@ringcentral-integration/commons/lib/di';
import OAuthBase from '@ringcentral-integration/widgets/modules/OAuth';
import { loginStatus } from '@ringcentral-integration/commons/modules/Auth/loginStatus';
import { watch } from '@ringcentral-integration/core';
import messageTypes from '../../enums/messageTypes';

@Module({
  name: 'OAuth',
  deps: [
    { dep: 'OAuthOptions', optional: true },
    { dep: 'Prefix' },
  ]
})
export default class OAuth extends OAuthBase {
  protected _userLogout = false;
  protected _jwtLogged = false;

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
        if (this._jwtLogged) {
          return;
        }
        if (
          !this._deps.auth.notLoggedIn && (
            !this._deps.oAuthOptions.jwtOwnerId ||
            this._deps.oAuthOptions.jwtOwnerId === this.jwtOwnerId
          )
        ) {
          return;
        }
        if (this._deps.oAuthOptions.jwt) {
          if (!this._deps.auth.notLoggedIn) {
            this._userLogout = true;
            // logout before jwt login, hack for evAuth
            await this._deps.auth.logout();
          }
          this._jwtLogged = true;
          this._deps.auth.setLogin();
          this._deps.client.service.platform().login({
            jwt: this._deps.oAuthOptions.jwt,
          });
          if (this._deps.oAuthOptions.jwtOwnerId) {
            this.setJwtOwnerId(this._deps.oAuthOptions.jwtOwnerId);
          }
        }
      },
      {
        multiple: true,
      },
    );
  }

  get jwtOwnerId() {
    // check localStorage api availability
    if (!window.localStorage) {
      return null;
    }
    return localStorage.getItem(`${this._deps.prefix}-jwt-owner-id`);
  }

  setJwtOwnerId(jwtOwnerId: string) {
    // check localStorage api availability
    if (!window.localStorage) {
      return;
    }
    localStorage.setItem(`${this._deps.prefix}-jwt-owner-id`, jwtOwnerId);
  }

  get jwtOwnerChanged() {
    return (
      (!!this._deps.oAuthOptions.jwtOwnerId) &&
      this._deps.oAuthOptions.jwtOwnerId !== this.jwtOwnerId
    );
  }
}


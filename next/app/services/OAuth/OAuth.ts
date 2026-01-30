import {
  action,
  injectable,
  inject,
  optional,
  state,
  watch,
} from '@ringcentral-integration/next-core';
import {
  Auth,
  Client,
  OAuth as OAuthBase,
} from '@ringcentral-integration/micro-auth/src/app/services';
import { loginStatus } from '@ringcentral-integration/micro-auth/src/app/services/Auth/loginStatus';
import type { OAuthBaseOptions } from '@ringcentral-integration/micro-auth/src/app/services/OAuthBase/OAuthBase.interface';
import {
  Brand,
  Locale,
  Toast,
} from '@ringcentral-integration/micro-core/src/app/services';
import { popWindow } from '@ringcentral-integration/widgets/lib/popWindow';
import { oAuthMessageTypes } from '../../../enums';
import { TabManager } from '../EvTabManager';

/**
 * OAuth options for configuration
 */
export interface OAuthOptions extends OAuthBaseOptions {
  disableLoginPopup?: boolean;
  jwt?: string;
  jwtOwnerId?: string;
  redirectUrl?: string;
}

/**
 * OAuth module - JWT login and OAuth integration
 * Handles login popup, JWT token login, and OAuth flows
 */
@injectable({
  name: 'OAuth',
})
class OAuth extends OAuthBase {
  private _userLogout = false;
  private _jwtLogged = false;
  private _loginWindow: Window | null = null;

  get disableLoginPopup(): boolean {
    return (this._oAuthOptions as OAuthOptions)?.disableLoginPopup || false;
  }

  get jwtOwnerId(): string | null {
    if (!window.localStorage) return null;
    return localStorage.getItem(`${this._prefix}-jwt-owner-id`);
  }

  get jwtOwnerChanged(): boolean {
    const options = this._oAuthOptions as OAuthOptions;
    return !!options?.jwtOwnerId && options.jwtOwnerId !== this.jwtOwnerId;
  }

  setJwtOwnerId(jwtOwnerId: string): void {
    if (!window.localStorage) return;
    localStorage.setItem(`${this._prefix}-jwt-owner-id`, jwtOwnerId);
  }

  /**
   * Handle JWT login with owner change detection
   */
  async handleJwtLogin(): Promise<void> {
    const options = this._oAuthOptions as OAuthOptions;
    if (!options?.jwt) return;
    if (this._userLogout || this._jwtLogged) return;
    // If not logged in, proceed with JWT login
    if (this._auth.notLoggedIn) {
      this._jwtLogged = true;
      this._auth.setLogin();
      await this._client.service.platform().login({
        jwt: options.jwt,
      });
      if (options.jwtOwnerId) {
        this.setJwtOwnerId(options.jwtOwnerId);
      }
      return;
    }
    // If logged in but jwt owner changed, logout first then re-login
    if (this.jwtOwnerChanged) {
      this._userLogout = true;
      await this._auth.logout({ reason: 'App syncing' });
      this._jwtLogged = true;
      this._auth.setLogin();
      await this._client.service.platform().login({
        jwt: options.jwt,
      });
      if (options.jwtOwnerId) {
        this.setJwtOwnerId(options.jwtOwnerId);
      }
    }
  }

  override onInitOnce(): void {
    // Listen for callback messages from redirect page
    window.addEventListener('message', ({ data = {} }) => {
      if (!data) return;
      const { callbackUri } = data;
      if (callbackUri) {
        this.handleCallbackLogin(callbackUri);
      }
    });
    // Close login window on page unload
    window.addEventListener('beforeunload', () => {
      if (this._loginWindow) {
        try {
          this._loginWindow.close();
        } catch (error) {
          /* ignore error */
        }
      }
    });
    // Watch for auth status changes to handle JWT login
    watch(
      this,
      () => [this.ready, this._auth.loginStatus] as const,
      async () => {
        if (!this.ready) return;
        if (this._auth.loginStatus === loginStatus.beforeLogout) {
          // Do not jwt login after logout
          this._userLogout = true;
          return;
        }
        if (this._userLogout || this._jwtLogged) return;
        await this.handleJwtLogin();
      },
      { multiple: true },
    );
  }
}

export { OAuth };

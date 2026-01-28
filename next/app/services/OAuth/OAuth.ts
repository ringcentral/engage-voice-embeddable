import {
  action,
  injectable,
  inject,
  optional,
  RcModule,
  state,
  watch,
} from '@ringcentral-integration/next-core';

import { oAuthMessageTypes, loginStatus } from '../../../enums';
import type { EvAuth } from '../EvAuth';

/**
 * OAuth options for configuration
 */
export interface OAuthOptions {
  disableLoginPopup?: boolean;
  jwt?: string;
  jwtOwnerId?: string;
  redirectUri?: string;
}

/**
 * OAuth module - JWT login and OAuth integration
 * Handles login popup, JWT token login, and OAuth flows
 */
@injectable({
  name: 'OAuth',
})
class OAuth extends RcModule {
  private _userLogout = false;
  private _jwtLogged = false;

  constructor(
    @inject('Prefix') private prefix: string,
    private evAuth: EvAuth,
    @optional('OAuthOptions') private oAuthOptions?: OAuthOptions,
  ) {
    super();
  }

  @state
  oAuthUri = '';

  @action
  setOAuthUri(uri: string) {
    this.oAuthUri = uri;
  }

  get disableLoginPopup(): boolean {
    return this.oAuthOptions?.disableLoginPopup || false;
  }

  get jwtOwnerId(): string | null {
    if (!window.localStorage) return null;
    return localStorage.getItem(`${this.prefix}-jwt-owner-id`);
  }

  get jwtOwnerChanged(): boolean {
    return (
      !!this.oAuthOptions?.jwtOwnerId &&
      this.oAuthOptions.jwtOwnerId !== this.jwtOwnerId
    );
  }

  setJwtOwnerId(jwtOwnerId: string): void {
    if (!window.localStorage) return;
    localStorage.setItem(`${this.prefix}-jwt-owner-id`, jwtOwnerId);
  }

  /**
   * Open OAuth login page
   */
  openOAuthPage(): void {
    if (this.disableLoginPopup) {
      window.parent.postMessage({
        type: oAuthMessageTypes.loginPopup,
        oAuthUri: this.oAuthUri,
      }, '*');
      return;
    }
    // Open OAuth popup window
    window.open(this.oAuthUri, '_blank', 'width=500,height=600');
  }

  /**
   * Handle JWT login
   */
  async handleJwtLogin(jwt: string): Promise<void> {
    if (this._userLogout || this._jwtLogged) return;
    this._jwtLogged = true;
    // JWT login logic would go here
    if (this.oAuthOptions?.jwtOwnerId) {
      this.setJwtOwnerId(this.oAuthOptions.jwtOwnerId);
    }
  }

  override onInitOnce(): void {
    // Watch for auth status changes
    watch(
      this,
      () => this.evAuth.loginStatus,
      async (status) => {
        if (status === loginStatus.LOGOUT_BEFORE) {
          this._userLogout = true;
        }
        if (this._userLogout || this._jwtLogged) return;
        // Handle JWT login if configured
        if (this.oAuthOptions?.jwt && this.evAuth.loginStatus === null) {
          await this.handleJwtLogin(this.oAuthOptions.jwt);
        }
      },
    );
  }
}

export { OAuth };

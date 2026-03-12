import {
  injectable,
  optional,
  watch,
  PortManager,
  RouterPlugin,
  delegate,
  storage,
  state,
  action,
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
export class OAuth extends OAuthBase {
  private _userLogout = false;
  private _jwtLogged = false;

  constructor(
    protected _client: Client,
    protected _router: RouterPlugin,
    protected _portManager: PortManager,
    protected override _auth: Auth,
    protected override _toast: Toast,
    protected override _locale: Locale,
    protected override _brand: Brand,
    @optional('TabManager')
    protected override _tabManager?: any,
    @optional('OAuthOptions')
    protected override _oAuthOptions?: OAuthOptions,
  ) {
    super(_client, _router, _portManager, _auth, _toast, _locale, _brand, _tabManager, _oAuthOptions);
  }

  get disableLoginPopup(): boolean {
    return (this._oAuthOptions as OAuthOptions)?.disableLoginPopup || false;
  }

  @storage
  @state
  jwtOwnerId: string | null = null;

  @action
  setJwtOwnerId(jwtOwnerId: string): void {
    this.jwtOwnerId = jwtOwnerId;
  }

  /**
   * Handle JWT login with owner change detection
   */
  @delegate('server')
  async handleJwtLogin(options?: OAuthOptions): Promise<void> {
    if (!options?.jwt) return;
    // If not logged in, proceed with JWT login
    if (this._auth.notLoggedIn) {
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
    const jwtOwnerChanged = (!!options.jwtOwnerId) && options.jwtOwnerId !== this.jwtOwnerId
    if (jwtOwnerChanged) {
      await this._auth.logout({ reason: 'App syncing' });
      this._auth.setLogin();
      await this._client.service.platform().login({
        jwt: options.jwt,
      });
      if (options.jwtOwnerId) {
        this.setJwtOwnerId(options.jwtOwnerId);
      }
    }
  }

  override initialize(): void {
    // run on client side
    super.initialize();
    // Watch for auth status changes to handle JWT login
    watch(
      this,
      () => [this.ready, this._auth.loginStatus, this._portManager?.isActiveTab] as const,
      async () => {
        console.log('watchOAuth~~', this.ready, this._auth.loginStatus, this._portManager?.isActiveTab);
        if (!this.ready) {
          return;
        }
        if (!this._portManager?.isActiveTab) {
          return;
        }
        if (this._auth.loginStatus === loginStatus.beforeLogout) {
          // Do not jwt login after logout
          this._userLogout = true;
          return;
        }
        if (this._userLogout || this._jwtLogged) return;
        const options = this._oAuthOptions as OAuthOptions;
        if (!options.jwt) return;
        this._jwtLogged = true;
        await this.handleJwtLogin(options);
      },
      { multiple: true },
    );
  }

  override async getOAuthUri(): Promise<string> {
    const uri = await super.getOAuthUri();
    // override to remove force=true parameter
    if (uri.indexOf('&force=true') !== -1) {
      return uri.replace('&force=true', '');
    }
    return uri;
  }
}

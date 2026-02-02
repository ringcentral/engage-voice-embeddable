import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import {
  injectable,
  optional,
  RcModule,
  RouterPlugin,
  watch,
  PortManager,
} from '@ringcentral-integration/next-core';

import { loginStatus } from '../../../enums';
import { EvAuth } from '../EvAuth';
import type { RedirectOptions } from './Redirect.interface';

/**
 * Redirect service - Handles router redirections based on login status
 * Watches authentication state and redirects users to appropriate routes
 */
@injectable({
  name: 'Redirect',
})
class Redirect extends RcModule {
  private readonly _loginPath: string;
  private readonly _chooseAccountPath: string;
  private readonly _sessionConfigPath: string;
  private readonly _dialerPath: string;

  constructor(
    protected _auth: Auth,
    protected _evAuth: EvAuth,
    protected _router: RouterPlugin,
    protected _portManager: PortManager,
    @optional('RedirectOptions')
    protected _options?: RedirectOptions,
  ) {
    super();
    this._loginPath = this._options?.loginPath ?? '/';
    this._chooseAccountPath = this._options?.chooseAccountPath ?? '/chooseAccount';
    this._sessionConfigPath = this._options?.sessionConfigPath ?? '/sessionConfig';
    this._dialerPath = this._options?.dialerPath ?? '/dialer';
    if (this._portManager?.shared) {
      this._portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  /**
   * Current router path
   */
  get currentPath(): string {
    return this._router.currentPath;
  }

  /**
   * Check if user is on login page
   */
  get isOnLoginPage(): boolean {
    return this.currentPath === this._loginPath;
  }

  /**
   * Check if user is on choose account page
   */
  get isOnChooseAccountPage(): boolean {
    return this.currentPath === this._chooseAccountPath;
  }

  /**
   * Check if user is on session config page
   */
  get isOnSessionConfigPage(): boolean {
    return this.currentPath === this._sessionConfigPath;
  }

  /**
   * Initialize watchers for login status changes
   */
  initialize(): void {
    this._watchRcAuthStatus();
    this._watchEvAuthStatus();
    this._watchEvLoginStatus();
  }

  /**
   * Watch RC Auth status - redirect to login page if not logged in
   */
  private _watchRcAuthStatus(): void {
    watch(
      this,
      () => [this._auth.loggedIn, this._router.currentPath] as const,
      ([loggedIn, currentPath]) => {
        if (!loggedIn && currentPath !== this._loginPath) {
          this._router.push(this._loginPath);
        }
      },
      {
        multiple: true,
      }
    );
  }

  /**
   * Watch EV Auth status - redirect to choose account page if multiple agents
   */
  private _watchEvAuthStatus(): void {
    this._evAuth.onAuthSuccess(async () => {
      if (this._evAuth.isOnlyOneAgent) {
        this._evAuth.setAgentId(
          this._evAuth.authenticateResponse!.agents[0].agentId,
        );
        await this._evAuth.openSocketWithSelectedAgentId();
      } else if (
        !this._evAuth.agentId &&
        !this.isOnChooseAccountPage
      ) {
        this._router.push(this._chooseAccountPath);
      }
    });
  }

  /**
   * Watch EV login status - redirect to session config or dialer after login
   */
  private _watchEvLoginStatus(): void {
    // TODO: Implement this
  }

  /**
   * Navigate to login page
   */
  goToLogin(): void {
    this._router.push(this._loginPath);
  }

  /**
   * Navigate to choose account page
   */
  goToChooseAccount(): void {
    this._router.push(this._chooseAccountPath);
  }

  /**
   * Navigate to session config page
   */
  goToSessionConfig(): void {
    this._router.push(this._sessionConfigPath);
  }

  /**
   * Navigate to dialer page
   */
  goToDialer(): void {
    this._router.push(this._dialerPath);
  }

  /**
   * Navigate to a specific path
   */
  push(path: string): void {
    this._router.push(path);
  }
}

export { Redirect };

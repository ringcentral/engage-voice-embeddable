import { Auth } from '@ringcentral-integration/micro-auth/src/app/services';
import {
  injectable,
  optional,
  ModuleRef,
  RcModule,
  RouterPlugin,
  watch,
  PortManager,
} from '@ringcentral-integration/next-core';

import { loginStatus } from '../../../enums';
import { EvAuth } from '../EvAuth';
import { EvCallMonitor } from '../EvCallMonitor';
import type { RedirectOptions } from './Redirect.interface';
import { EvClient } from '../EvClient';
import { EvCall } from '../EvCall';
import { ActivityCallView } from '../../views/ActivityCallView';
import { DialerView } from '../../views/DialerView';

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
    protected _router: RouterPlugin,
    protected _portManager: PortManager,
    protected _auth: Auth,
    protected _evAuth: EvAuth,
    protected _evClient: EvClient,
    protected _evCallMonitor: EvCallMonitor,
    protected _evCall: EvCall,
    protected _dialerView: DialerView,
    protected _activityCallView: ActivityCallView,
    @optional('RedirectOptions')
    protected _options?: RedirectOptions,
  ) {
    super();
    this._loginPath = this._options?.loginPath ?? '/';
    this._chooseAccountPath = this._options?.chooseAccountPath ?? '/chooseAccount';
    this._sessionConfigPath = this._options?.sessionConfigPath ?? '/sessionConfig';
    this._dialerPath = this._options?.dialerPath ?? '/agent/dialer';
    if (this._portManager?.shared) {
      this._portManager.onServer(() => {
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
    this._watchEvCallStatus();
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
      this.logger.info('onAuthSuccess~~');
      this.logger.info('isOnlyOneAgent', this._evAuth.isOnlyOneAgent);
      this.logger.info('agentId', this._evAuth.agentId);
      if (this._evAuth.isOnlyOneAgent) {
        await this._evAuth.setAgentId(
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
   * Watch call status and redirect accordingly:
   * - On ringing: trigger contact matching
   * - On answered: set active call and navigate to activity call page
   * - On ended: redirect from sub-activity paths back to parent
   */
  private _watchEvCallStatus(): void {
    this._evCallMonitor.onCallRinging(async () => {
      this.logger.info('onCallRinging~~');
      const call = await this._evClient.getCurrentCall();
      if (call) {
        await this._evCallMonitor.getMatcher(call);
      }
    });
    this._evCallMonitor.onCallAnswered(async (call) => {
      this.logger.info('onCallAnswered~~', call);
      if (!call?.session) return;
      const id = this._evClient.encodeUii(call.session);
      this._evCall.setActivityCallId(id);
      this._dialerView.setToNumber('');
      await this._evCallMonitor.getMatcher(call);
      this.gotoActivityCallPage(id);
    });
    this._evCallMonitor.onCallEnded(async (call) => {
      this.logger.info('onCallEnded~~');
      this._redirectOnCallEnded();
      if (!this._activityCallView.showSubmitStep) {
        this._router.push(this._dialerPath);
      } else {
        const id = this._evClient.encodeUii(call.session);
        this.gotoActivityCallPage(id);
      }
    });
  }

  /**
   * Handle routing when a call ends.
   * If on a sub-path of /activityCallLog/{id}/..., redirect back to
   * the parent activity call log page.
   */
  private _redirectOnCallEnded(): void {
    const subPathRegex = /^\/activityCallLog\/([^/]+)\//;
    const match = this.currentPath.match(subPathRegex);
    if (match) {
      const id = match[1];
      this.gotoActivityCallPage(id);
    }
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

  gotoActivityCallPage(id: string): void {
    const path = `/activityCallLog/${id}`;
    if (this._router.currentPath === path) {
      return;
    }
    this._router.push(path);
  }

  /**
   * Navigate to a specific path
   */
  push(path: string): void {
    this._router.push(path);
  }
}

export { Redirect };

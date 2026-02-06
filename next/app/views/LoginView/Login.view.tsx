import {
  Brand,
  Locale,
} from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  dynamic,
  fromWatchValue,
  injectable,
  logger,
  optional,
  PortManager,
  RcViewModule,
  RouterPlugin,
  state,
  takeUntilAppDestroy,
  UIFunctions,
  UIProps,
  useConnector,
  useMainTabSyncState,
} from '@ringcentral-integration/next-core';
import React, { useRef } from 'react';

import {
  AppFeatures,
  Auth,
  ConnectivityMonitor,
  loginStatus,
  RateLimiter,
  OAuth,
} from '@ringcentral-integration/micro-auth/src/app/services';

// import { OAuth } from '../../services/OAuth';
import { AuthPage } from './AuthPage';
import type {
  LoginViewOptions,
  LoginViewPanelProps,
  LoginViewProps,
} from './Login.view.interface';

/**
 * View module for handling login functionality and UI
 * Supports both Spring UI and Juno themes
 *
 * @class
 */
@injectable({
  name: 'LoginView',
})
export class LoginView extends RcViewModule {
  @dynamic('AppFeatures')
  private _appFeatures?: AppFeatures;

  constructor(
    public _brand: Brand,
    protected _auth: Auth,
    protected _connectivityMonitor: ConnectivityMonitor,
    protected _locale: Locale,
    protected _oAuth: OAuth,
    protected _rateLimiter: RateLimiter,
    protected _router: RouterPlugin,
    protected _portManager: PortManager,
    @optional('LoginViewOptions')
    protected _loginViewOptions?: LoginViewOptions,
  ) {
    super();
    // if (!this._loginViewOptions?.disabledRouteGuard) {
    //   if (this._portManager?.shared) {
    //     this._portManager.onServer(() => {
    //       this.initialize();
    //     });
    //   } else {
    //     this.initialize();
    //   }
    // }
  }

  get routeAfterLogin() {
    return (
      this._loginViewOptions?.routeAfterLogin ??
      // in spring-ui default to /dialer
      (process.env.THEME_SYSTEM === 'spring-ui'
        ? process.env.NODE_ENV === 'test'
          ? // TODO: welcome page not include in this stage, but in test env we already have that test to check all exist case of welcome page can be passed to reduce wrong update in the future
            '/welcome'
          : this._appFeatures?.getAppDefaultRoutePath()
        : '/home')
    );
  }

  @state
  showMicroCore = false;

  @action
  setShowMicroCore(showMicroCore: boolean) {
    this.showMicroCore = showMicroCore;
  }

  getUIProps(): UIProps<LoginViewPanelProps> {
    if (process.env.THEME_SYSTEM === 'spring-ui') {
      return {
        description: this._loginViewOptions?.getDescription?.(),
        welcomePicture: this._loginViewOptions?.welcomePicture,
        currentLocale: this._locale.currentLocale,
        brandName: this._brand.name,
        appName: this._brand.appName as string,
        disabled:
          !this._oAuth.oAuthReady ||
          this._rateLimiter.restricted ||
          !this._connectivityMonitor.connectivity,
        showSpinner:
          !this._auth.ready ||
          this._auth.loginStatus === loginStatus.loggingIn ||
          this._auth.loginStatus === loginStatus.loggingOut ||
          this._auth.loginStatus === loginStatus.beforeLogout ||
          this._auth.loginStatus === loginStatus.loggedIn,
        logoUrl: this._brand.assets?.['logo'] as string,
        showSignUp: !!this._brand.brandConfig.signupUrl,
      };
    }

    return {
      currentLocale: this._locale.currentLocale,
      brandName: this._brand.name,
      appName: this._brand.appName as string,
      disabled:
        !this._oAuth.oAuthReady ||
        this._rateLimiter.restricted ||
        !this._connectivityMonitor.connectivity,
      showSpinner:
        !this._auth.ready ||
        this._auth.loginStatus === loginStatus.loggingIn ||
        this._auth.loginStatus === loginStatus.loggingOut ||
        this._auth.loginStatus === loginStatus.beforeLogout ||
        this._auth.loginStatus === loginStatus.loggedIn,
      showSignUp: !!this._brand.brandConfig.signupUrl,
    };
  }

  getUIFunctions(): UIFunctions<LoginViewPanelProps> {
    return {
      openOAuthPage: () => {
        this._oAuth.openOAuthPage();
      },
      onSignUpButtonClick: () => {
        const signupUrl = this._brand.brandConfig.signupUrl;
        if (!signupUrl) return;
        window.open(signupUrl);
      },
    };
  }

  /**
   * Renders the login component with the appropriate theming
   * Handles state synchronization and spinner display
   *
   * @param {LoginViewProps} props - Props for the login view
   * @returns {React.ReactNode} Rendered component
   */
  component(props: LoginViewProps) {
    const syncCompleted = useMainTabSyncState();
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const _props = useConnector(() => {
      const uiProps = this.getUIProps();

      return {
        ...props,
        ...uiProps,
        showMicroCore: this.showMicroCore,
      };
    });
    console.log('syncCompleted', syncCompleted);
    console.log('props', _props);

    const showSpinner = !syncCompleted || _props.showSpinner;

    const Component = this._loginViewOptions?.component || AuthPage;

    return (
      <Component {..._props} {...uiFunctions} showSpinner={showSpinner} />
    );
  }
}

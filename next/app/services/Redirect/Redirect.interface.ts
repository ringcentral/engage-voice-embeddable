/**
 * Options for configuring the Redirect service
 */
export interface RedirectOptions {
  /**
   * Route to redirect to when user is not authenticated
   * @default '/'
   */
  loginPath?: string;
  /**
   * Route to redirect to when user needs to choose an agent account
   * @default '/chooseAccount'
   */
  chooseAccountPath?: string;
  /**
   * Route to redirect to when user needs to configure session
   * @default '/sessionConfig'
   */
  sessionConfigPath?: string;
  /**
   * Route to redirect to after successful login and session configuration
   * @default '/agent/dialer'
   */
  dialerPath?: string;
}

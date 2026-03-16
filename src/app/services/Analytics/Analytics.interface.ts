/**
 * Analytics service interface
 */
export interface IAnalytics {
  track(event: string, data?: Record<string, any>): void;
}

/**
 * Analytics options for configuration
 */
export interface AnalyticsOptions {
  /**
   * Mixpanel project token
   */
  analyticsKey?: string;
  /**
   * Analytics secret key
   */
  analyticsSecretKey?: string;
  /**
   * App version
   */
  appVersion?: string;
  /**
   * External client ID for tracking
   */
  externalClientId?: string;
  /**
   * Enable Mixpanel integration
   * @default false
   */
  enableMixpanel?: boolean;
  /**
   * Also write track event into logger service for better debugging
   * @default true
   */
  useLog?: boolean;
  /**
   * When linger on a route for that threshold, will track that event
   * @default 1000ms
   */
  lingerThreshold?: number;
  /**
   * Track router list
   */
  trackRoutersMap?: Map<string, TrackRouter>;
}

/**
 * Track router definition
 */
export interface TrackRouter {
  router: string;
  eventPostfix: string;
}

/**
 * Identify options for user identification
 */
export interface IdentifyOptions {
  userId: string;
  accountId?: string;
}

/**
 * Extended props for specific events
 */
export interface IExtendedProps {
  [key: string]: string | number | boolean;
}

/**
 * Track props that will be sent with every event
 */
export interface TrackProps {
  appName: string;
  appVersion?: string;
  brand?: string;
  osPlatform?: string;
  externalClientId?: string;
  rcAccountId?: string | null;
}

/**
 * Page view tracking options
 */
export interface PageViewOptions {
  pageName: string;
  currentURL?: string;
  [key: string]: any;
}

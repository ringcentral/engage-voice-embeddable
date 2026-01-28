import {
  injectable,
  optional,
  RcModule,
  watch,
} from '@ringcentral-integration/next-core';

/**
 * Analytics options for configuration
 */
export interface AnalyticsOptions {
  analyticsKey?: string;
  appVersion?: string;
  externalClientId?: string;
}

/**
 * Track router definition
 */
export interface TrackRouter {
  router: string;
  eventPostfix: string;
}

const trackRouters: TrackRouter[] = [
  { router: '/sessionconfig', eventPostfix: 'Session Config' },
  { router: '/dialer', eventPostfix: 'Dialer' },
  { router: '/calls', eventPostfix: 'Calls' },
  { router: '/history', eventPostfix: 'Call History' },
  { router: '/leads', eventPostfix: 'Leads' },
  { router: '/settings', eventPostfix: 'Settings' },
];

/**
 * Analytics module - Segment integration
 * Handles event tracking and page views
 */
@injectable({
  name: 'Analytics',
})
class Analytics extends RcModule {
  private _segment: any = null;
  private _hashedAccountId: string | null = null;
  private _trackRouters: TrackRouter[] = trackRouters;
  protected extendedProps = new Map<string, Record<string, any>>();

  constructor(
    @optional('AnalyticsOptions') private analyticsOptions?: AnalyticsOptions,
  ) {
    super();
    if (this.analyticsOptions?.analyticsKey) {
      this._initSegment();
    }
  }

  private _initSegment(): void {
    // Segment initialization would go here
    // For now, this is a placeholder
  }

  /**
   * Identify a user
   */
  identify(options: { userId: string; accountId?: string }): void {
    const hashedAccountId = this._hashId(options.accountId);
    if (options.accountId) {
      this._hashedAccountId = hashedAccountId;
    }
    this._segment?.identify(this._hashId(options.userId), {
      rcAccountId: hashedAccountId,
    });
  }

  /**
   * Track an event
   */
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this._segment) return;
    const trackProps = {
      ...this.trackProps,
      ...properties,
      ...this.extendedProps.get(event),
    };
    this._segment.track(event, trackProps);
  }

  /**
   * Track a page view
   */
  page(name: string, properties: Record<string, any> = {}): void {
    this._segment?.page(name, { ...this.trackProps, ...properties });
  }

  /**
   * Track router navigation
   */
  trackRouter(currentPath?: string): void {
    if (!currentPath) return;
    const target = this.getTrackTarget(currentPath);
    if (!target) return;
    this.page(target.eventPostfix, { currentURL: target.router });
  }

  getTrackTarget(currentPath: string): TrackRouter | undefined {
    const routes = currentPath.split('/');
    const formatRoute = routes.length > 1 ? `/${routes[1]}` : null;
    return this._trackRouters.find((target) => formatRoute === target.router);
  }

  get trackProps(): Record<string, any> {
    return {
      appName: 'RingCX Embeddable',
      appVersion: this.analyticsOptions?.appVersion,
      osPlatform: navigator.platform,
      externalClientId: this.analyticsOptions?.externalClientId,
      rcAccountId: this._hashedAccountId,
    };
  }

  private _hashId(id?: string): string | null {
    if (!id) return null;
    // Simple hash for demo - in production use proper hashing
    return btoa(id);
  }
}

export { Analytics };

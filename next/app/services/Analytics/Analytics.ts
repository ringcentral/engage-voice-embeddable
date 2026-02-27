import {
  Brand,
  Locale,
} from '@ringcentral-integration/micro-core/src/app/services';
import {
  delegate,
  fromWatchValue,
  injectable,
  optional,
  PortManager,
  RcModule,
  RouterPlugin,
  takeUntilAppDestroy,
} from '@ringcentral-integration/next-core';
import {
  BehaviorSubject,
  defer,
  EMPTY,
  filter,
  firstValueFrom,
  from,
  retry,
  shareReplay,
  Subject,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { AnalyticsBrowser } from './AnalyticsBrowser';
import type {
  AnalyticsOptions,
  IAnalytics,
  IdentifyOptions,
  IExtendedProps,
  TrackProps,
  TrackRouter,
} from './Analytics.interface';
import { needMatchSecondRoutes, trackRoutersMap } from './analyticsRouters';
import { globalTrackEvent$ } from './trackEvent';

/**
 * Secret key for hashing user IDs
 */
const ANALYTICS_SECRET_KEY = process.env.ANALYTICS_SECRET_KEY || '';

/**
 * Hash an ID using SHA-256
 */
async function getHashId(id: string | undefined): Promise<string | null> {
  if (!id) return null;
  const encoder = new TextEncoder();
  const data = encoder.encode(`${id}:${ANALYTICS_SECRET_KEY}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Analytics service for RingCX Embeddable
 *
 * Provides event tracking via Mixpanel with support for:
 * - User identification with hashed IDs
 * - Account group tracking
 * - Page view tracking
 * - Route navigation tracking (click/linger events)
 * - Extended props for specific events
 * - Multi-tab/worker mode via port manager
 */
@injectable({
  name: 'Analytics',
})
class Analytics extends RcModule implements IAnalytics {
  private _eventExtendedPropsMap: Record<string, IExtendedProps> = {};
  private _analyticsBrowser: AnalyticsBrowser | null = null;
  private _mixpanelReady$ = new BehaviorSubject<boolean>(false);
  private _hashedAccountId: string | null = null;

  private _useLog: boolean;
  private _enableMixpanel: boolean;
  private _lingerThreshold: number;
  private _trackRoutersMap: Map<string, TrackRouter>;

  /**
   * Emit event when track is triggered
   */
  track$ = new Subject<{ event: string; trackProps: Record<string, any> }>();

  private loadMixpanel$ = defer(() => {
    if (!this._analyticsOptions?.analyticsKey) {
      this.logger.error('Analytics key is required');
      return EMPTY;
    }
    this._analyticsBrowser = new AnalyticsBrowser(
      this._analyticsOptions.analyticsKey,
    );
    return from(this._analyticsBrowser.load());
  }).pipe(
    retry({
      count: 3,
      delay: (error) => {
        this.logger.error('Mixpanel load failed', error);
        return timer(500);
      },
    }),
    shareReplay(1),
  );

  /**
   * Check if Mixpanel is enabled
   */
  get enableMixpanel(): boolean {
    return !!(
      this._enableMixpanel &&
      this._analyticsOptions?.analyticsKey
    );
  }

  /**
   * Get analytics browser instance
   */
  get analytics(): AnalyticsBrowser | null {
    return this._analyticsBrowser;
  }

  /**
   * Get extended props map
   */
  get extendedProps(): Map<string, IExtendedProps> {
    const map = new Map<string, IExtendedProps>();
    Object.entries(this._eventExtendedPropsMap).forEach(([key, value]) => {
      map.set(key, value);
    });
    return map;
  }

  constructor(
    private _router: RouterPlugin,
    private _portManager: PortManager,
    @optional() private _brand?: Brand,
    @optional() private _locale?: Locale,
    @optional('AnalyticsOptions') private _analyticsOptions?: AnalyticsOptions,
  ) {
    super();
    this._useLog = this._analyticsOptions?.useLog ?? true;
    this._enableMixpanel = this._analyticsOptions?.enableMixpanel ?? false;
    this._lingerThreshold = this._analyticsOptions?.lingerThreshold ?? 1000;
    this._trackRoutersMap = this._analyticsOptions?.trackRoutersMap ?? trackRoutersMap;
    if (global.document) {
      if (this._portManager?.shared) {
        this._portManager.onClient(() => {
          this.bindRouteChangeEventTrack();
        });
      } else {
        this.bindRouteChangeEventTrack();
      }
      if (this.enableMixpanel) {
        this.loadMixpanel$
          .pipe(
            tap(() => {
              this.logger.log('Mixpanel loaded');
              this._mixpanelReady$.next(true);
            }),
            takeUntilAppDestroy,
          )
          .subscribe();
      }
    }
    // Subscribe to global track events
    globalTrackEvent$
      .pipe(
        tap(([eventName, properties]) => {
          this.track(eventName, properties);
        }),
        takeUntilAppDestroy,
      )
      .subscribe();
  }

  /**
   * Bind route change event tracking
   */
  private bindRouteChangeEventTrack(): void {
    fromWatchValue(this, () => this._router.currentPath)
      .pipe(
        switchMap((currentPath) => {
          const target = this.getTrackTarget(currentPath);
          if (!target || !document.hasFocus()) {
            return EMPTY;
          }
          const { router, eventPostfix } = target;
          this.track(`Navigation: Click/${eventPostfix}`, { router });
          // Track linger event after threshold
          return timer(this._lingerThreshold).pipe(
            tap(() => {
              this.track(`Navigation: Linger/${eventPostfix}`, { router });
            }),
          );
        }),
        takeUntilAppDestroy,
      )
      .subscribe();
  }

  /**
   * Identify user with hashed IDs
   */
  async identify(options: IdentifyOptions): Promise<void> {
    this.logger.info('identify~~');
    const hashedUserId = await getHashId(options.userId);
    const hashedAccountId = await getHashId(options.accountId);
    if (hashedAccountId) {
      this._hashedAccountId = hashedAccountId;
    }
    if (!this._analyticsBrowser || !hashedUserId) return;
    this._analyticsBrowser.identify(hashedUserId, {
      rcAccountId: hashedAccountId,
    });
    if (hashedAccountId) {
      this._analyticsBrowser.group('rcAccountId', hashedAccountId);
    }
  }

  /**
   * Reset user identification
   */
  reset(): void {
    this._hashedAccountId = null;
    this._analyticsBrowser?.reset();
  }

  /**
   * Internal track method
   */
  private async _track(event: string, properties: Record<string, any> = {}): Promise<void> {
    if (!this.enableMixpanel && !this._useLog) return;
    if (this._useLog || process.env.NODE_ENV === 'test') {
      this.logger.log('track event', event, properties);
    }
    const trackProps: Record<string, any> = {
      ...this.trackProps,
      ...(this._eventExtendedPropsMap[event] || {}),
      ...properties,
    };
    if (this.enableMixpanel) {
      // Wait for Mixpanel to be ready
      if (!this._mixpanelReady$.value) {
        await firstValueFrom(this._mixpanelReady$.pipe(filter(Boolean)));
      }
      this._analyticsBrowser?.track(event, trackProps);
    }
    this.track$.next({ event, trackProps });
  }

  /**
   * Track on main tab (for worker mode)
   */
  @delegate('mainClient')
  async trackOnMainTab(event: string, properties: Record<string, any> = {}): Promise<void> {
    await this._track(event, properties);
  }

  /**
   * Track an event
   * In worker mode, delegates to main client
   */
  async track(event: string, properties: Record<string, any> = {}): Promise<void> {
    if (
      this._portManager.shared &&
      this._portManager.isWorkerMode &&
      this._portManager.isServer
    ) {
      return this.trackOnMainTab(event, properties);
    }
    return this._track(event, properties);
  }

  /**
   * Track page view
   */
  page(name: string, properties: Record<string, any> = {}): void {
    if (!this._analyticsBrowser) return;
    this._analyticsBrowser.page(name, {
      ...this.trackProps,
      ...properties,
    });
  }

  /**
   * Track router navigation
   */
  trackRouter(currentPath?: string): void {
    const path = currentPath ?? this._router.currentPath;
    if (!path) return;
    const target = this.getTrackTarget(path);
    if (!target) return;
    this.page(target.eventPostfix, { currentURL: target.router });
  }

  /**
   * Get track target for a path
   */
  getTrackTarget(currentPath?: string): TrackRouter | null {
    const path = currentPath ?? this._router.currentPath;
    if (!path) return null;
    const routes = path.split('/');
    let formatRoute: string | null = null;
    if (routes.length >= 3 && needMatchSecondRoutes.includes(routes[1])) {
      formatRoute = `/${routes[1]}/${routes[2]}`;
    } else if (routes.length > 1) {
      formatRoute = `/${routes[1]}`;
    }
    return formatRoute ? this._trackRoutersMap.get(formatRoute) ?? null : null;
  }

  /**
   * Add extended props for specific events
   */
  @delegate('clients')
  async addEventsExtendedProps({
    events,
    extendedProps,
  }: {
    events: string[];
    extendedProps: IExtendedProps;
  }): Promise<void> {
    if (!events || !extendedProps) {
      console.error('[events or extendedProps] is required');
      return;
    }
    events.forEach((event) => {
      if (!this._eventExtendedPropsMap[event]) {
        this._eventExtendedPropsMap[event] = {};
      }
      Object.assign(this._eventExtendedPropsMap[event], extendedProps);
    });
  }

  /**
   * Toggle Mixpanel debug mode
   */
  toggleDebug(): void {
    this._analyticsBrowser?.toggleDebug();
  }

  /**
   * Get track props that are sent with every event
   * Matches the old Analytics data format for Mixpanel
   */
  get trackProps(): TrackProps {
    return {
      appName: 'RingCX Embeddable',
      appVersion: this._analyticsOptions?.appVersion,
      brand: this._brand?.defaultConfig?.code,
      osPlatform: typeof navigator !== 'undefined' ? navigator.platform : undefined,
      externalClientId: this._analyticsOptions?.externalClientId,
      rcAccountId: this._hashedAccountId,
    };
  }
}

export { Analytics };

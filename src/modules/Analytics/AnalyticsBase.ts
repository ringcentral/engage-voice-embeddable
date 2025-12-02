import { RcModuleV2, watch } from '@ringcentral-integration/core';
import type { IAnalytics } from '@ringcentral-integration/core/lib/track';

import { Module } from '@ringcentral-integration/commons/lib/di';
import { proxify } from '@ringcentral-integration/commons/lib/proxy/proxify';
import saveBlob from '@ringcentral-integration/commons/lib/saveBlob';
import type {
  Deps,
  IdentifyOptions,
  IExtendedProps,
  // PendoAgent,
  TrackLog,
  TrackProps,
  TrackRouter,
} from '@ringcentral-integration/commons/modules/AnalyticsV2/Analytics.interface';
import { trackRouters } from '@ringcentral-integration/commons/modules/AnalyticsV2/analyticsRouters';

@Module({
  name: 'Analytics',
  deps: [
    'Auth',
    'Brand',
    'AnalyticsOptions',
    { dep: 'AccountInfo', optional: true },
    { dep: 'RouterInteraction', optional: true },
    { dep: 'Locale', optional: true },
  ],
})
export class Analytics<T extends Deps = Deps>
  extends RcModuleV2<T>
  implements IAnalytics
{
  protected _useLog = this._deps.analyticsOptions.useLog ?? false;

  protected _lingerThreshold =
    this._deps.analyticsOptions.lingerThreshold ?? 1000;

  protected _trackRouters =
    this._deps.analyticsOptions.trackRouters ?? trackRouters;

  protected _segment: any;

  protected _logs: TrackLog[] = [];

  protected _lingerTimeout: NodeJS.Timeout | null = null;


  private _eventExtendedPropsMap = new Map<string, IExtendedProps>();

  private _useLocalAnalyticsJS =
    this._deps.analyticsOptions.useLocalAnalyticsJS ?? false;

  constructor(deps: T) {
    super({
      deps,
    });
  }

  override onInitOnce() {
    if (this._deps.analyticsOptions.analyticsKey && this._segment) {
      this._segment.load(
        this._deps.analyticsOptions.analyticsKey,
        {
          integrations: {
            All: true,
            Mixpanel: true,
          },
        },
        this._useLocalAnalyticsJS,
      );
    }
    if (this._deps.routerInteraction) {
      // make sure that track if refresh app
      this.trackRouter();
      watch(
        this,
        () => this._deps.routerInteraction!.currentPath,
        (currentPath) => {
          this.trackRouter(currentPath);
        },
      );
    }
  }

  trackRouter(currentPath = this._deps.routerInteraction?.currentPath) {
    const target = this.getTrackTarget(currentPath);
    if (target) {
      this.trackNavigation(target);
    }

    if (this._lingerTimeout) {
      clearTimeout(this._lingerTimeout);
    }
    this._lingerTimeout = setTimeout(() => {
      this._lingerTimeout = null;
      if (target && this._deps.routerInteraction?.currentPath === currentPath) {
        this.trackLinger(target);
      }
    }, this._lingerThreshold);
  }

  setUserId() {
    this._identify({
      userId: this._deps.auth.ownerId,
    });
  }

  identify(options: IdentifyOptions) {
    this._identify(options);
  }

  protected _identify({ userId, ...props }: IdentifyOptions) {
    this.analytics?.identify(userId, props, {
      integrations: {
        All: true,
      },
    });
  }

  @proxify
  async track(event: string, properties: any = {}) {
    if (!this.analytics) {
      return;
    }

    const trackProps: TrackProps = {
      ...this.trackProps,
      ...properties,
      ...this.extendedProps.get(event),
    };

    this.analytics.track(event, trackProps, {
      integrations: {
        All: true,
      },
    });

    if (this._useLog) {
      this._logs.push({
        timeStamp: new Date().toISOString(),
        event,
        trackProps,
      });
    }
  }

  downloadLogs() {
    if (!this._useLog) {
      return;
    }
    const blob = new Blob([JSON.stringify(this._logs, null, 2)], {
      type: 'application/json',
    });
    saveBlob('logs.json', blob);
  }

  trackNavigation({
    router,
    eventPostfix,
  }: Exclude<TrackRouter, null | undefined>) {
    const trackProps = {
      router,
      appName: this._deps.brand.defaultConfig.appName,
      appVersion: this._deps.analyticsOptions.appVersion,
      brand: this._deps.brand.defaultConfig.code,
    };
    this.track(`Navigation: Click/${eventPostfix}`, trackProps);
  }

  trackLinger({
    router,
    eventPostfix,
  }: Exclude<TrackRouter, null | undefined>) {
    const trackProps = {
      router,
      appName: this._deps.brand.defaultConfig.appName,
      appVersion: this._deps.analyticsOptions.appVersion,
      brand: this._deps.brand.defaultConfig.code,
    };
    this.track(`Navigation: View/${eventPostfix}`, trackProps);
  }

  getTrackTarget(
    currentPath = this._deps.routerInteraction?.currentPath,
  ): TrackRouter {
    if (!currentPath) {
      return null;
    }
    const routes = currentPath.split('/');
    let formatRoute: string | null = null;
    const needMatchSecondRoutes = ['calls'];
    if (routes.length >= 3 && needMatchSecondRoutes.indexOf(routes[1]) !== -1) {
      formatRoute = `/${routes[1]}/${routes[2]}`;
    } else if (routes.length > 1) {
      formatRoute = `/${routes[1]}`;
    }
    const target = this._trackRouters.find(
      (target) => formatRoute === target?.router,
    );
    return target;
  }

  addEventsExtendedProps({
    events,
    extendedProps,
  }: {
    events: string[];
    extendedProps: IExtendedProps;
  }) {
    if (!events || !extendedProps) {
      console.error('[events or extendedProps] is required');
      return;
    }
    events.forEach((event) => {
      const oldValue = this._eventExtendedPropsMap.get(event);
      this._eventExtendedPropsMap.set(event, { ...oldValue, ...extendedProps });
    });
  }

  get extendedProps() {
    return this._eventExtendedPropsMap;
  }

  get analytics() {
    return (global as any).analytics;
  }

  get trackProps(): TrackProps {
    return {
      appName: this._deps.brand.defaultConfig.appName,
      appVersion: this._deps.analyticsOptions.appVersion,
      brand: this._deps.brand.defaultConfig.code,
      'App Language': this._deps.locale?.currentLocale || '',
      'Browser Language': this._deps.locale?.browserLocale || '',
    };
  }
}

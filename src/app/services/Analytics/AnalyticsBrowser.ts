import type mixpanel from 'mixpanel-browser';

type MixpanelInstance = typeof mixpanel;

/**
 * AnalyticsBrowser - Mixpanel browser integration
 * Handles event tracking, user identification, and page views
 */
export class AnalyticsBrowser {
  private _mixpanel: MixpanelInstance | null = null;
  private _mixpanelToken: string;

  constructor(mixpanelToken: string) {
    this._mixpanelToken = mixpanelToken;
  }

  /**
   * Load and initialize Mixpanel SDK
   */
  async load(): Promise<MixpanelInstance> {
    if (this._mixpanel) {
      return this._mixpanel;
    }
    const mixpanelModule = await import('mixpanel-browser');
    const mixpanel = mixpanelModule.default;
    mixpanel.init(this._mixpanelToken);
    // According to EU policy, disable IP address tracking
    mixpanel.set_config({ ip: false });
    // Override track to sanitize URL params
    this._patchMixpanelTrack(mixpanel);
    this._mixpanel = mixpanel;
    return mixpanel;
  }

  /**
   * Patch Mixpanel track to remove sensitive URL params
   */
  private _patchMixpanelTrack(mixpanel: MixpanelInstance): void {
    const originalTrack = mixpanel.track.bind(mixpanel);
    mixpanel.track = (
      eventName: string,
      properties?: Record<string, any>,
      optionsOrCallback?: any,
      callback?: any,
    ) => {
      const props = properties || {};
      // Sanitize current URL to remove query params
      props['$current_url'] = `${window.location.origin}${window.location.pathname}`;
      props['current_url_search'] = '';
      return originalTrack(eventName, props, optionsOrCallback, callback);
    };
  }

  /**
   * Get Mixpanel instance
   */
  get mixpanel(): MixpanelInstance | null {
    return this._mixpanel;
  }

  /**
   * Identify user with hashed ID
   */
  identify(userId: string, props: Record<string, any> = {}): void {
    if (!this._mixpanel) return;
    this._mixpanel.identify(userId);
    if (Object.keys(props).length > 0) {
      this._mixpanel.people.set(props);
    }
  }

  /**
   * Reset user identification
   */
  reset(): void {
    if (!this._mixpanel) return;
    this._mixpanel.reset();
  }

  /**
   * Track an event
   */
  track(event: string, props: Record<string, any> = {}): void {
    if (!this._mixpanel) return;
    this._mixpanel.track(event, props);
  }

  /**
   * Set group for account tracking
   */
  group(groupKey: string, groupId: string): void {
    if (!this._mixpanel) return;
    this._mixpanel.add_group(groupKey, groupId);
    this._mixpanel.set_group(groupKey, groupId);
  }

  /**
   * Track page view
   */
  page(pageName: string, data: Record<string, any> = {}): void {
    if (!this._mixpanel) return;
    // Format page name - capitalize first letter
    let formatName = pageName.toLowerCase();
    if (formatName.length > 0) {
      formatName = formatName.charAt(0).toUpperCase() + formatName.slice(1);
    }
    try {
      this._mixpanel.track_pageview(
        {
          ...data,
          pageName: formatName,
        },
        {
          event_name: 'Viewed page',
        },
      );
    } catch (e) {
      console.error('Error tracking page view:', e);
    }
  }

  /**
   * Toggle debug mode
   */
  toggleDebug(): void {
    if (!this._mixpanel) return;
    const currentDebug = this._mixpanel.get_config('debug');
    this._mixpanel.set_config({ debug: !currentDebug });
  }

  /**
   * Get distinct ID
   */
  getDistinctId(): string | undefined {
    return this._mixpanel?.get_distinct_id?.();
  }
}

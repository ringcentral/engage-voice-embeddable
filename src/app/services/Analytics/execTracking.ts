import type { IAnalytics } from './Analytics.interface';

/**
 * Track event type definition
 * Can be a string event name or a function that returns event details
 */
export type TrackEvent =
  | string
  | ((
      ...args: any
    ) =>
      | ([string, object?] | ((analytics: IAnalytics) => [string, object?] | void))
      | void);

/**
 * Execute tracking with the given analytics instance and track event
 *
 * @param analytics - The analytics instance to use for tracking
 * @param trackEvent - The track event definition
 * @param args - Arguments passed to the tracked method
 */
export function execTracking(
  analytics: IAnalytics,
  trackEvent: TrackEvent,
  args: any[],
): void {
  if (typeof analytics?.track !== 'function') return;
  if (typeof trackEvent === 'string') {
    analytics.track(trackEvent);
    return;
  }
  let trackReturn = trackEvent(...args);
  if (typeof trackReturn === 'function') {
    trackReturn = trackReturn(analytics);
  }
  if (Array.isArray(trackReturn)) {
    const [event, trackProps] = trackReturn;
    if (event) {
      analytics.track(event, trackProps);
    }
  }
}

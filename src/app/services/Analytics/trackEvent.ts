import { Subject } from 'rxjs';

/**
 * Global track event subject
 * Allows tracking events from anywhere in the app without direct Analytics dependency
 */
export const globalTrackEvent$ = new Subject<
  [eventName: string, properties: Record<string, any>]
>();

/**
 * Track an event globally
 * The Analytics service subscribes to this and forwards events to Mixpanel
 *
 * @param eventName - The event name to track
 * @param properties - The properties for the event
 */
export function trackEvent(
  eventName: string,
  properties: Record<string, any> = {},
): void {
  if (!globalTrackEvent$.observed) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'No observers for globalTrackEvent$. Please ensure Analytics service is initialized.',
      );
    }
    return;
  }
  globalTrackEvent$.next([eventName, properties]);
}

import type { RcModule, RcViewModule } from '@ringcentral-integration/next-core';
import { getRef } from '@ringcentral-integration/next-core';

import { Analytics } from './Analytics';
import type { IAnalytics } from './Analytics.interface';
import { execTracking, type TrackEvent } from './execTracking';

interface Descriptor<T> extends TypedPropertyDescriptor<T> {
  initializer?(): T;
}

/**
 * Decorate a method with Analytics tracking
 *
 * @param trackEvent - Define trackEvent for tracking
 * @param enable - Enable or disable tracking (default: true)
 *
 * @example
 * ```ts
 * class MyModule extends RcModule {
 *   @track('buttonClicked')
 *   onClick() {
 *     // method implementation
 *   }
 *
 *   @track((that, lead) => ['leadCalled', { leadId: lead.id }])
 *   callLead(lead: Lead) {
 *     // method implementation
 *   }
 * }
 * ```
 */
export const track = (trackEvent: TrackEvent, enable = true) => {
  return (
    target: RcModule | RcViewModule,
    name: string,
    descriptor?: Descriptor<any>,
  ): any => {
    if (!enable) {
      return descriptor;
    }
    if (
      typeof descriptor?.value !== 'function' &&
      typeof descriptor?.initializer !== 'function'
    ) {
      throw new Error(`@track decorated '${name}' is not a method`);
    }
    let fn: (...args: any) => any = descriptor?.value;
    const initializer = descriptor.initializer;
    const trackedFn = function (this: RcModule, ...args: any) {
      let analytics: IAnalytics | null = null;
      try {
        analytics = getRef(this).container!.got(Analytics)!;
      } catch (e) {
        // Analytics not available
      }
      if (typeof initializer === 'function') {
        fn = initializer.call(this);
      }
      if (typeof fn !== 'function') {
        throw new Error(`@track decorated '${name}' is not a function`);
      }
      const result = fn.apply(this, args);
      if (!analytics) {
        return result;
      }
      try {
        execTracking(analytics, trackEvent, [this, ...args]);
      } catch (e) {
        console.warn(`Analytics Error: ${getRef(target).identifier}.${name}`);
        console.error(e);
      }
      return result;
    };
    return {
      enumerable: true,
      configurable: true,
      value: trackedFn,
    } as any;
  };
};

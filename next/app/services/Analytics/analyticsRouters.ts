import type { TrackRouter } from './Analytics.interface';

/**
 * Track routers map for RingCX Embeddable
 * Maps route paths to event postfixes for page view tracking
 */
export const trackRoutersMap = new Map<string, TrackRouter>([
  ['/sessionconfig', { router: '/sessionconfig', eventPostfix: 'Session Config' }],
  ['/agent/dialer', { router: '/agent/dialer', eventPostfix: 'Dialer' }],
  ['/agent/leads', { router: '/agent/leads', eventPostfix: 'Leads' }],
  ['/agent/history', { router: '/agent/history', eventPostfix: 'History' }],
  ['/calls', { router: '/calls', eventPostfix: 'Calls' }],
  ['/calls/active', { router: '/calls/active', eventPostfix: 'Call Control' }],
  ['/history', { router: '/history', eventPostfix: 'Call History' }],
  ['/leads', { router: '/leads', eventPostfix: 'Leads' }],
  ['/settings', { router: '/settings', eventPostfix: 'Settings' }],
  ['/transfer', { router: '/transfer', eventPostfix: 'Transfer' }],
]);

/**
 * Routes that require matching the second path segment
 * e.g., /calls/active should match instead of just /calls
 */
export const needMatchSecondRoutes = ['calls'];

import type { TrackRouter } from './Analytics.interface';

/**
 * Track routers map for RingCX Embeddable
 * Maps route paths to event postfixes for page view tracking
 */
export const trackRoutersMap = new Map<string, TrackRouter>([
  ['/sessionConfig', { router: '/sessionConfig', eventPostfix: 'Session Config' }],
  ['/chooseAccount', { router: '/chooseAccount', eventPostfix: 'Choose Account' }],
  ['/sessionUpdate', { router: '/sessionUpdate', eventPostfix: 'Session Update' }],
  ['/sessionInfo', { router: '/sessionInfo', eventPostfix: 'Session Info' }],
  ['/agent/dialer', { router: '/agent/dialer', eventPostfix: 'Dialer' }],
  ['/agent/leads', { router: '/agent/leads', eventPostfix: 'Leads' }],
  ['/agent/history', { router: '/agent/history', eventPostfix: 'History' }],
  ['/activityCallLog', { router: '/activityCallLog', eventPostfix: 'Call Control' }],
  ['/activityCallLog/transferCall', { router: '/activityCallLog/transferCall', eventPostfix: 'Transfer' }],
  ['/activityCallLog/activeCallList', { router: '/activityCallLog/activeCallList', eventPostfix: 'Active Call List' }],
  ['/activityCallLog/disposition', { router: '/activityCallLog/disposition', eventPostfix: 'Disposition' }],
  ['/history', { router: '/history', eventPostfix: 'Call History' }],
  ['/settings', { router: '/settings', eventPostfix: 'Settings' }],
]);

/**
 * Routes that require matching the second path segment
 * e.g., /agent/dialer should match instead of just /agent
 */
export const needMatchSecondRoutes = ['agent'];

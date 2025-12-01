import {
  trackRouters as trackRoutersBase,
} from '@ringcentral-integration/commons/modules/AnalyticsV2/analyticsRouters';

export const trackRouters = trackRoutersBase
  .concat([
    {
      eventPostfix: 'Leads',
      router: '/leads', 
    },
  ]);

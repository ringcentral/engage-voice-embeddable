import { ObjectMap } from '@ringcentral-integration/core/lib/ObjectMap';

export const trackEvents = ObjectMap.fromObject({
  fetchLeads: 'Fetch leads',
  callLead: 'Call lead',
  manualPassLead: 'Manual pass lead',
  viewLead: 'View lead',
  logCall: 'Log call',
} as const);


import type { EvClient } from '../EvClient';
import type { EvAuth } from '../EvAuth';

export interface Deps {
  evClient: EvClient;
  evAuth: EvAuth;
}

export interface Lead {
  ani: string;
  aniE164: string;
  campaignId: string;
  city: string;
  countryCode: string;
  countryId: string;
  destination: string;
  destinationE164: string;
  dnis: string;
  dnisE164: string;
  email: string;
  externId: string;
  firstName: string;
  lastName: string;
  midName: string;
  leadId: string;
  leadState: string;
  leadPriority: string;
  leadPasses: string;
  state: string;
  title: string;
  suffix: string;
  zip: string;
  validUntil: string;
  gateKeeper: string;
  listDesc: string;
  showListName: boolean;
  showLeadPasses: boolean;
  requestId: string;
  dialedList: string[];
  completed: boolean;
}

export interface EvLeadsOptions {}

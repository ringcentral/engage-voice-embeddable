/**
 * EvLeads options for configuration
 */
export interface EvLeadsOptions {
  // Optional configuration options
}

/**
 * Lead data
 */
export interface Lead {
  leadId: string;
  requestId: string;
  externId: string;
  firstName?: string;
  lastName?: string;
  destination: string | string[];
  leadState: string;
  completed?: boolean;
  dialedList?: string[];
  [key: string]: any;
}

/**
 * Manual pass parameters
 */
export interface ManualPassParams {
  lead: Lead;
  dispositionId: string;
  notes: string;
  callback: boolean;
  callbackDTS: string;
}

/**
 * EvCallHistory options for configuration
 */
export interface EvCallHistoryOptions {
  // Optional configuration options
}

/**
 * Call party info (agent or contact)
 */
export interface CallParty {
  name: string;
  phoneNumber: string;
}

/**
 * Formatted call entry - compatible with CallsListPage from micro-phone
 */
export interface FormattedCall {
  id: string;
  direction: string;
  /** Agent party info */
  agent: CallParty;
  /** Contact party info */
  contact: CallParty;
  from: CallParty;
  to: CallParty;
  fromName: string;
  toName: string;
  fromMatches: ContactMatch[];
  toMatches: ContactMatch[];
  activityMatches: ActivityMatch[];
  startTime: number;
  isDisposed?: boolean;
  /** Call result status - used for filtering (e.g., 'Missed', 'Answered', 'Answered Elsewhere') */
  result?: string;
  /** Whether the call is logged in CRM */
  isLogged?: boolean;
  /** Telephony session ID */
  telephonySessionId?: string;
  /** Session ID */
  sessionId?: string;
}

/**
 * Contact match
 */
export interface ContactMatch {
  id: string;
  name: string;
  type: string;
  profileImageUrl?: string;
}

/**
 * Activity match
 */
export interface ActivityMatch {
  contactId?: string;
  [key: string]: any;
}

/**
 * Contact match mapping
 */
export interface ContactMatchMapping {
  [key: string]: ContactMatch[];
}

/**
 * Activity match mapping
 */
export interface ActivityMatchMapping {
  [key: string]: ActivityMatch[];
}

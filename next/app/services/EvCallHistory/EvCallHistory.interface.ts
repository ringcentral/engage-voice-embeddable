/**
 * EvCallHistory options for configuration
 */
export interface EvCallHistoryOptions {
  // Optional configuration options
}

/**
 * Formatted call entry - compatible with CallsListPage from micro-phone
 */
export interface FormattedCall {
  id: string;
  direction: string;
  from: { name: string; phoneNumber: string };
  to: { name: string; phoneNumber: string };
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

import type { ReactNode } from 'react';

/**
 * Lead data interface
 */
export interface Lead {
  /** Lead ID */
  leadId?: string;
  /** First name */
  firstName?: string;
  /** Middle name */
  midName?: string;
  /** Last name */
  lastName?: string;
  /** Destination phone number */
  destination?: string;
  /** Destination in E.164 format */
  destinationE164?: string;
  /** Campaign ID */
  campaignId?: string;
  /** Lead state */
  leadState?: string;
}

/**
 * Phone number display data
 */
export interface PhoneNumberData {
  /** Formatted phone number for display */
  formatted: string;
  /** Raw destination number */
  destination: string;
}

/**
 * Props for LeadItem component
 */
export interface LeadItemProps {
  /** Lead data */
  lead: Lead;
  /** Phone numbers to display */
  phoneNumbers: PhoneNumberData[];
  /** Display name */
  displayName: string;
  /** Whether dialing is allowed */
  allowDial?: boolean;
  /** Whether the agent is currently dialing */
  isDialing?: boolean;
  /** Whether buttons should be disabled */
  disabled?: boolean;
  /** Callback when dial button is clicked */
  onDial?: (destination: string) => void;
  /** Callback when view lead button is clicked */
  onViewLead?: () => void;
  /** Callback when manual pass button is clicked */
  onManualPass?: () => void;
  /** Whether to show view lead button */
  showViewLeadButton?: boolean;
  /** Whether to show manual pass button */
  showManualPassButton?: boolean;
  /** Whether manual pass is disabled */
  disableManualPass?: boolean;
  /** Custom hover actions */
  hoverActions?: ReactNode;
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
}

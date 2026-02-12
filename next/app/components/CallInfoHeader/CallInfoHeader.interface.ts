import type { ReactNode } from 'react';
import type { CallStatus } from '../StatusBadge';

/**
 * Call info item for displaying call metadata (e.g., DNIS, Call ID)
 */
export interface CallInfoItem {
  /** Attribute key identifier */
  attr: string;
  /** Display name label */
  name: string;
  /** Display content value */
  content: string;
}

/**
 * Props for CallInfoHeader component
 */
export interface CallInfoHeaderProps {
  /** Contact name to display */
  contactName?: string;
  /** Phone number to display */
  phoneNumber: string;
  /** Call status */
  status?: CallStatus;
  /** Call direction */
  direction?: 'inbound' | 'outbound';
  /** Avatar or icon element */
  avatar?: ReactNode;
  /** Whether the call is on hold */
  isOnHold?: boolean;
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
  /** Additional action buttons */
  actions?: ReactNode;
  /** Follow-up info strings (e.g., formatted phone number, queue name) */
  followInfos?: string[];
  /** Call metadata info items (e.g., DNIS, Call ID, Term Party) */
  callInfos?: CallInfoItem[];
  /** Callback when a call info value is copied to clipboard */
  onCopySuccess?: (name: string) => void;
}

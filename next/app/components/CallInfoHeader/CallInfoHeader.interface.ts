import type { ReactNode } from 'react';
import type { CallStatus } from '../StatusBadge';

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
  /** Tooltip title for the secondary content (e.g., full date/time on hover) */
  secondaryTitle?: string;
  /** Click handler - navigates to call detail page */
  onClick?: () => void;
}

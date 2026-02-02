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
}

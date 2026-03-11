/**
 * Call status types for Engage Voice
 */
export type CallStatus = 'active' | 'onHold' | 'inbound' | 'outbound' | 'ringing' | 'ended';

/**
 * Props for StatusBadge component
 */
export interface StatusBadgeProps {
  /** Call status */
  status: CallStatus;
  /** Custom label (overrides default status label) */
  label?: string;
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
  /** Size variant */
  size?: 'small' | 'medium';
}

/**
 * Status configuration for each call status
 */
export interface StatusConfig {
  label: string;
  color: 'primary' | 'secondary' | 'warning' | 'success' | 'neutral' | 'danger' | 'default';
  variant: 'outlined' | 'inverted' | 'filled';
}

import type { ReactNode } from 'react';

/**
 * Props for SelectableListItem component
 */
export interface SelectableListItemProps {
  /** Primary text content */
  primary: ReactNode;
  /** Secondary text content (optional) */
  secondary?: ReactNode;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
  /** Size variant */
  size?: 'small' | 'large' | 'auto';
  /** Whether to show divider */
  divider?: boolean;
  /** Hover actions to display */
  hoverActions?: ReactNode;
  /** Leading content (icon, avatar, etc.) */
  leading?: ReactNode;
  /** Trailing content (icon, badge, etc.) */
  trailing?: ReactNode;
}

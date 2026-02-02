import type { ComponentType, ReactNode } from 'react';

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** Title text */
  title: ReactNode;
  /** Description text (optional) */
  description?: ReactNode;
  /** Icon component to display */
  icon?: ComponentType;
  /** Action buttons to display */
  actions?: ReactNode[];
  /** Custom class name */
  className?: string;
  /** Data sign for testing */
  'data-sign'?: string;
}

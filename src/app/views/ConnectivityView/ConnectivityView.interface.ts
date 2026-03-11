import type { ConnectivityType } from '@ringcentral-integration/micro-auth/src/app/services/ConnectivityManager';

/**
 * Extended connectivity type including EV-specific statuses
 */
export type EvConnectivityType =
  | ConnectivityType
  | 'socketDisconnected'
  | 'sipUnstableConnection'
  | 'sipConnecting';

/**
 * Announcement severity level
 */
export type ConnectivitySeverity = 'error' | 'info';

/**
 * Props for the EvConnectivityPanel component
 */
export interface EvConnectivityViewProps {
  className?: string;
  mode: EvConnectivityType | null;
  severity: ConnectivitySeverity;
  loading: boolean;
  retry: boolean;
  onClick: () => void;
}

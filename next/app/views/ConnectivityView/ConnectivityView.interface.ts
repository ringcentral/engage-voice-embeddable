import type { ConnectivityType } from '@ringcentral-integration/micro-auth/src/app/services/ConnectivityManager';

/**
 * Extended connectivity type including EV-specific statuses
 */
export type EvConnectivityType =
  | ConnectivityType
  | 'socketDisconnected'
  | 'sipUnregistered';

/**
 * Props for the EvConnectivityPanel component
 */
export interface EvConnectivityViewProps {
  className?: string;
  mode: EvConnectivityType | null;
  loading: boolean;
  retry: boolean;
  sipRegistering: boolean;
  onClick: () => void;
}

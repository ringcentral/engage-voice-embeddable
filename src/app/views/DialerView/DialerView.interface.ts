import type { DirectoryRecord } from '../../services/EvDirectorySearch';

/**
 * DialerView options for configuration
 */
export interface DialerViewOptions {
  // Optional configuration options
}

/**
 * DialerView props
 */
export interface DialerViewProps {
  // Component props
}

// The directory types now live with the shared search service; re-exported here
// so existing importers of this file keep working
export type {
  DirectoryAccountMainNumber,
  DirectoryRecordAccount,
  DirectoryRecord,
  SearchDirectoryResponse,
} from '../../services/EvDirectorySearch';

/**
 * UI state props returned by getUIProps
 */
export interface DialerViewUIProps {
  toNumber: string;
  hasDialer: boolean;
  isIdle: boolean;
  isOnCall: boolean;
  isPendingDisposition: boolean;
  directoryRecords: DirectoryRecord[];
  isSearchingDirectory: boolean;
  isToNumberPhoneNumber: boolean;
  showKeypad: boolean;
  matchedDirectoryName: string;
  dialDestinationLabel: string;
}

/**
 * UI action functions returned by getUIFunctions
 */
export interface DialerViewUIFunctions {
  onBackspace: () => void;
  onDial: () => Promise<void>;
  onHangup: () => void;
  onInputChange: (value: string) => void;
  onKeypadPress: (key: string) => void;
  onGoToSettings: () => void;
  onDialDirectoryRecord: (record: DirectoryRecord) => void;
}

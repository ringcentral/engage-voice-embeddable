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

/**
 * Main number information for a directory record's account
 */
export interface DirectoryAccountMainNumber {
  formattedPhoneNumber?: string;
  phoneNumber?: string;
  type?: string | null;
  label?: string | null;
}

/**
 * Account information attached to a directory record
 */
export interface DirectoryRecordAccount {
  id?: string;
  mainNumber?: DirectoryAccountMainNumber | null;
}

/**
 * A single corporate directory search record
 */
export interface DirectoryRecord {
  id: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  name?: string | null;
  extensionNumber: string;
  presenceStatus?: string;
  phoneNumbers?: unknown;
  type?: string;
  account?: DirectoryRecordAccount;
}

/**
 * Response shape of evClient.searchDirectory
 */
export interface SearchDirectoryResponse {
  rcAccountId?: string;
  pbxDirectoryEnable?: boolean;
  mainNumber?: string;
  records?: DirectoryRecord[];
}

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
}

/**
 * UI action functions returned by getUIFunctions
 */
export interface DialerViewUIFunctions {
  onBackspace: () => void;
  onDial: () => Promise<void>;
  onHangup: () => void;
  onInputChange: (value: string) => void;
  onGoToSettings: () => void;
  onDialDirectoryRecord: (record: DirectoryRecord) => void;
}

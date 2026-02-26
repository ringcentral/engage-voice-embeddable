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
 * UI state props returned by getUIProps
 */
export interface DialerViewUIProps {
  toNumber: string;
  hasDialer: boolean;
  isIdle: boolean;
  isOnCall: boolean;
  isPendingDisposition: boolean;
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
}

/**
 * Alert severity levels
 */
export type AlertSeverity = 'info' | 'success' | 'warning' | 'error';

/**
 * EV Alert message types
 */
export enum EvAlertMessageTypes {
  // Auth alerts
  NO_AGENT = 'noAgent',
  CONNECT_ERROR = 'connectError',
  UNEXPECTED_AGENT = 'unexpectedAgent',
  INVALID_BROWSER = 'invalidBrowser',
  CONNECT_TIMEOUT = 'connectTimeout',
  OPEN_SOCKET_ERROR = 'openSocketError',
  EXISTING_LOGIN_ENGAGED = 'existingLoginEngaged',
  FORCE_LOGOUT = 'forceLogout',

  // Call alerts
  FAIL_END_CALL = 'failEndCall',
  FAIL_HOLD_CALL = 'failHoldCall',
  FAIL_COLD_TRANSFER = 'failColdTransfer',
  FAIL_WARM_TRANSFER = 'failWarmTransfer',
  FAIL_DIRECT_TRANSFER = 'failDirectTransfer',
  FAIL_VOICEMAIL_TRANSFER = 'failVoicemailTransfer',
  FAIL_VOICEMAIL = 'failVoicemail',
  FAIL_START_WARM_TRANSFER = 'failStartWarmTransfer',
  FAIL_CANCEL_WARM_TRANSFER = 'failCancelWarmTransfer',

  // Disposition alerts
  DISPOSITION_SUBMIT_ERROR = 'dispositionSubmitError',
  DISPOSITION_REQUIRED = 'dispositionRequired',

  // Session alerts
  SESSION_CONFIG_ERROR = 'sessionConfigError',
  SESSION_UPDATE_ERROR = 'sessionUpdateError',

  // Working state alerts
  WORKING_STATE_ERROR = 'workingStateError',

  // Transfer alerts
  TRANSFER_ERROR = 'transferError',
  REQUEUE_ERROR = 'requeueError',

  // Softphone alerts
  WEBRTC_NOT_SUPPORTED = 'webrtcNotSupported',
  MICROPHONE_ACCESS_DENIED = 'microphoneAccessDenied',
}

/**
 * Alert message configuration
 */
export interface AlertMessage {
  type: EvAlertMessageTypes;
  message: string;
  severity: AlertSeverity;
}

/**
 * Props for EvAlertRenderer hook
 */
export interface UseEvAlertOptions {
  /** Current locale */
  currentLocale?: string;
  /** Custom message overrides */
  messageOverrides?: Partial<Record<EvAlertMessageTypes, string>>;
}

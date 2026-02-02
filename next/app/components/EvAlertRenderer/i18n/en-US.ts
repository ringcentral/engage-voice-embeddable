import { EvAlertMessageTypes } from '../EvAlertRenderer.interface';

export default {
  // Auth alerts
  [EvAlertMessageTypes.NO_AGENT]:
    'This RC account has not been assigned any EV agent account. Please contact your admin or supervisor.',
  [EvAlertMessageTypes.CONNECT_ERROR]: 'Authentication error. Please retry later.',
  [EvAlertMessageTypes.UNEXPECTED_AGENT]:
    'This RC account has been assigned an unexpected EV agent account. Please contact your admin or supervisor.',
  [EvAlertMessageTypes.INVALID_BROWSER]: 'WebSocket is NOT supported by your browser.',
  [EvAlertMessageTypes.CONNECT_TIMEOUT]: 'Authorization timeout. Please retry later.',
  [EvAlertMessageTypes.OPEN_SOCKET_ERROR]: 'Connection error. Please retry later.',
  [EvAlertMessageTypes.EXISTING_LOGIN_ENGAGED]: 'Existing login engaged',
  [EvAlertMessageTypes.FORCE_LOGOUT]: 'Your session has been terminated',

  // Call alerts
  [EvAlertMessageTypes.FAIL_END_CALL]: 'Failed to end call. Please try again.',
  [EvAlertMessageTypes.FAIL_HOLD_CALL]: 'Failed to hold/unhold call. Please try again.',
  [EvAlertMessageTypes.FAIL_COLD_TRANSFER]: 'Failed to transfer call. Please try again.',
  [EvAlertMessageTypes.FAIL_WARM_TRANSFER]: 'Failed to complete warm transfer. Please try again.',
  [EvAlertMessageTypes.FAIL_DIRECT_TRANSFER]: 'Failed to direct transfer. Please try again.',
  [EvAlertMessageTypes.FAIL_VOICEMAIL_TRANSFER]: 'Failed to transfer to voicemail. Please try again.',
  [EvAlertMessageTypes.FAIL_VOICEMAIL]: 'Failed to send to voicemail. Please try again.',
  [EvAlertMessageTypes.FAIL_START_WARM_TRANSFER]: 'Failed to start warm transfer. Please try again.',
  [EvAlertMessageTypes.FAIL_CANCEL_WARM_TRANSFER]: 'Failed to cancel warm transfer. Please try again.',

  // Disposition alerts
  [EvAlertMessageTypes.DISPOSITION_SUBMIT_ERROR]: 'Failed to submit disposition. Please try again.',
  [EvAlertMessageTypes.DISPOSITION_REQUIRED]: 'Please select a disposition before ending the call.',

  // Session alerts
  [EvAlertMessageTypes.SESSION_CONFIG_ERROR]: 'Failed to configure session. Please try again.',
  [EvAlertMessageTypes.SESSION_UPDATE_ERROR]: 'Failed to update session. Please try again.',

  // Working state alerts
  [EvAlertMessageTypes.WORKING_STATE_ERROR]: 'Failed to change working state. Please try again.',

  // Transfer alerts
  [EvAlertMessageTypes.TRANSFER_ERROR]: 'Transfer failed. Please try again.',
  [EvAlertMessageTypes.REQUEUE_ERROR]: 'Failed to requeue call. Please try again.',

  // Softphone alerts
  [EvAlertMessageTypes.WEBRTC_NOT_SUPPORTED]: 'WebRTC is not supported by your browser.',
  [EvAlertMessageTypes.MICROPHONE_ACCESS_DENIED]:
    'Microphone access denied. Please enable microphone permissions.',
} as const;

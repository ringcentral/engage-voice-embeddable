export default {
  // Call Status
  noActiveCall: 'No active call',
  activeCall: 'Active call',
  callEnded: 'Call ended',
  unknown: 'Unknown',
  onHold: 'On Hold',

  // Call Controls
  mute: 'Mute',
  unmute: 'Unmute',
  hold: 'Hold',
  unhold: 'Unhold',
  keypad: 'Keypad',
  hangUp: 'Hang Up',
  transfer: 'Transfer',
  requeue: 'Requeue',

  // Transfer Menu
  internalTransfer: 'Internal transfer',
  phoneBookTransfer: 'Phone book transfer',
  queueTransfer: 'Queue transfer',
  enterANumber: 'Enter a number',

  // Recording
  record: 'Record',
  stopRecord: 'Stop Recording',
  pauseRecord: 'Pause',
  resumeRecord: 'Resume',
  startRecording: 'Start recording',
  pauseRecording: 'Pause recording',
  stopRecording: 'Stop recording',
  recording: 'Recording',
  restartTimer: 'Restart timer',

  // Call Log
  callLog: 'Call log',
  disposition: 'Disposition',
  selectDisposition: 'Please select',
  pleaseSelect: 'Please select',
  notes: 'Notes',
  enterNotes: 'Enter notes...',

  // Validation
  dispositionRequired: 'Please choose a disposition before submitting.',
  dispositionError: 'Please choose a disposition before submitting.',
  notesRequired: 'Notes are required for this disposition.',

  // Actions
  submit: 'Submit',
  create: 'Create',
  update: 'Update',
  saving: 'Saving...',
  saved: 'Saved',

  // Agent Script
  viewAgentScript: 'View Agent Script',
  engageScript: 'Engage script',

  // Keypad
  keypadInput: 'Keypad input',
  close: 'Close',

  // Call Info Labels
  dnis: 'DNIS',
  callId: 'Call ID',
  termParty: 'Term Party',
  termReason: 'Term Reason',
  callTime: 'Call Time',

  // Copy
  copySuccess: '{name} copied.',

  // Toast messages
  recordPaused: 'Call recording paused.',
  recordResume: 'Call recording resumed.',
  callDispositionSuccess: 'Call disposition saved successfully.',
  callDispositionFailed: 'Failed to save call disposition.',

  // Active Call
  activeCallList: 'Active Call',
} as const;

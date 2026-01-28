export const thirdPartyMessageTypes = {
  register: 'register',
  matchContacts: 'matchContacts',
  matchCallLogs: 'matchCallLogs',
  logCall: 'logCall',
  viewLead: 'viewLead',
} as const;

export type ThirdPartyMessageType = typeof thirdPartyMessageTypes[keyof typeof thirdPartyMessageTypes];

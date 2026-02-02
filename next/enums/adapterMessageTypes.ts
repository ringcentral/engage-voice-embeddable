export const adapterMessageTypes = {
  init: 'init',
  syncClosed: 'syncClosed',
  syncMinimized: 'syncMinimized',
  syncSize: 'syncSize',
  syncPosition: 'syncPosition',
  clickToDial: 'clickToDial',
  setEnvironment: 'setEnvironment',
  logout: 'logout',
  dialLead: 'dialLead',
  newCall: 'newCall',
  ringCall: 'ringCall',
  endCall: 'endCall',
  sipRingCall: 'sipRingCall',
  sipEndCall: 'sipEndCall',
  callLead: 'callLead',
  loadLeads: 'loadLeads',
  manualPassLead: 'manualPassLead',
  pushAdapterState: 'pushAdapterState',
  checkPopupWindow: 'checkPopupWindow',
} as const;

export type AdapterMessageType = typeof adapterMessageTypes[keyof typeof adapterMessageTypes];

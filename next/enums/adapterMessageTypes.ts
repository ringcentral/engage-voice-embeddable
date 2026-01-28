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
  callLead: 'callLead',
  loadLeads: 'loadLeads',
  pushAdapterState: 'pushAdapterState',
  checkPopupWindow: 'checkPopupWindow',
} as const;

export type AdapterMessageType = typeof adapterMessageTypes[keyof typeof adapterMessageTypes];

import { ObjectMap } from '@ringcentral-integration/core/lib/ObjectMap';

/**
 * Adapter message types used for parent-iframe communication.
 * Must be an ObjectMap instance so AdapterCore can call ObjectMap.prefixValues().
 */
export const adapterMessageTypes = ObjectMap.prefixKeys(
  [
    'init',
    'register',
    'syncClosed',
    'syncMinimized',
    'syncSize',
    'syncPosition',
    'clickToDial',
    'setEnvironment',
    'logout',
    'dialLead',
    'newCall',
    'ringCall',
    'endCall',
    'sipRingCall',
    'sipEndCall',
    'sipRegistered',
    'sipUnregistered',
    'sipUnstable',
    'sipFailed',
    'callLead',
    'loadLeads',
    'viewLead',
    'manualPassLead',
    'pushAdapterState',
    'checkPopupWindow',
    'loginPopup',
  ],
  'rc-ev',
);

export type AdapterMessageType =
  typeof adapterMessageTypes[keyof typeof adapterMessageTypes];

import { ObjectMap } from '@ringcentral-integration/core/lib/ObjectMap';

export default ObjectMap.prefixKeys([
  'init',
  'register',
  'clickToDial',
  'popUpWindow',
  'searchAndScreenPop',
  'matchContacts',
  'matchCallLogs',
  'logCall',
  'syncClosed',
  'syncMinimized',
  'syncSize',
  'syncPosition',
  'pushPresence',
  'pushAdapterState',
  'pushLocale',
  'setEnvironment',
  'newCall',
  'ringCall',
  'loginPopup',
], 'rc-ev');

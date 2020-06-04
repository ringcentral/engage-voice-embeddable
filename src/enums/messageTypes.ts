import { createEnum } from 'ringcentral-integration/lib/Enum';

export default createEnum([
  'init',
  'register',
  'clickToDial',
  'popUpWindow',
  'searchAndScreenPop',
  'matchContacts',
  'matchActivities',
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
], 'rc-ev');

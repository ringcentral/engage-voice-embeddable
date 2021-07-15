import { Locale } from '@ringcentral-integration/commons/modules/LocaleV2';
import { EvCallHistory } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallHistory';
import { EvCallDisposition } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDisposition';
import RouterInteraction from '@ringcentral-integration/widgets/modules/RouterInteraction';
import { EvActivityCallUI } from '../EvActivityCallUI';

export interface Deps {
  evActivityCallUI: EvActivityCallUI;
  evCallHistory: EvCallHistory;
  evCallDisposition: EvCallDisposition;
  locale: Locale;
  routerInteraction: RouterInteraction;
}

export interface EvCallHistoryUIState {}

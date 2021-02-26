import { Locale } from 'ringcentral-integration/modules/LocaleV2';
import { EvCallHistory } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallHistory';
import { EvActivityCallUI } from '../EvActivityCallUI';

export interface Deps {
  evActivityCallUI: EvActivityCallUI;
  evCallHistory: EvCallHistory;
  locale: Locale;
}

export interface EvCallHistoryUIState {}

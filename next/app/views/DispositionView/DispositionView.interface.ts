import type { IvrAlertData } from '../../components/IvrAlertPanel';
import type { CallInfoItem } from '../../components/CallInfoHeader';
import type { DispositionItem, DispositionData, DispositionValidation, DispositionRequired } from '../../components/DispositionForm';
import type { SaveStatus } from './DispositionView.view';

/**
 * Basic call info with follow-up info
 */
export interface DispositionBasicInfo {
  subject: string;
  followInfos: string[];
  callInfos: CallInfoItem[];
}

/**
 * DispositionView external props
 */
export interface DispositionViewProps {
  // Currently no external props needed
}

/**
 * DispositionView UI state props
 */
export interface DispositionViewUIProps {
  currentCall: any;
  callStatus: 'active' | 'callEnd';
  saveStatus: SaveStatus;
  dispositionPickList: DispositionItem[];
  validated: DispositionValidation;
  required: DispositionRequired;
  dispositionData: DispositionData | undefined;
  basicInfo: DispositionBasicInfo | null;
  isInbound: boolean;
  isHistoryMode: boolean;
  showSubmitStep: boolean;
  hideCallNote: boolean;
}

/**
 * DispositionView UI action functions
 */
export interface DispositionViewUIFunctions {
  setViewCallId: (id: string) => void;
  onBack: () => void;
  onUpdateCallLog: (field: string, value: string) => void;
  disposeCall: () => Promise<void>;
}

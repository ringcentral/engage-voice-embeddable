import type { CallInfoItem } from '../../components/CallInfoHeader';
import type { TransferOption } from '../../components/TransferMenu';
import type { IvrAlertData } from '../../components/IvrAlertPanel';
import type { DispositionItem, DispositionData, DispositionValidation, DispositionRequired } from '../../components/DispositionForm';
import type { SaveStatus } from './ActivityCallView.view';

/**
 * Basic call info with call metadata and follow-up info
 */
export interface BasicInfo {
  subject: string;
  callInfos: CallInfoItem[];
  followInfos: string[];
}

/**
 * Call control permission flags
 */
export interface CallControlPermissions {
  allowTransferCall: boolean;
  allowRequeueCall: boolean;
  allowHoldCall: boolean;
  allowHangupCall: boolean;
  allowRecordControl: boolean;
  allowPauseRecord: boolean;
}

/**
 * ActivityCallView external props
 */
export interface ActivityCallViewProps {
  // Currently no external props needed
}

/**
 * ActivityCallView UI state props (returned by getUIProps)
 */
export interface ActivityCallViewUIProps {
  currentCall: any;
  contactName: string;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  callStatus: 'active' | 'callEnd' | 'onHold';
  saveStatus: SaveStatus;
  isKeypadOpen: boolean;
  keypadValue: string;
  dispositionPickList: DispositionItem[];
  ivrAlertData: IvrAlertData[];
  hasAgentScript: boolean;
  callControlPermissions: CallControlPermissions;
  validated: DispositionValidation;
  required: DispositionRequired;
  dispositionData: DispositionData | undefined;
  isIntegratedSoftphone: boolean;
  recordPauseCount: number | undefined;
  timeStamp: number | null;
  basicInfo: BasicInfo | null;
  isMultipleCalls: boolean;
  isInComingCall: boolean;
  showSubmitStep: boolean;
  allowTransfer: boolean;
  allowTransferCall: boolean;
  disableInternalTransfer: boolean;
  hideCallNote: boolean;
  isDefaultRecord: boolean;
  isInbound: boolean;
}

/**
 * ActivityCallView UI action functions (returned by getUIFunctions)
 */
export interface ActivityCallViewUIFunctions {
  onMute: () => void;
  onUnmute: () => void;
  onHold: () => void;
  onUnhold: () => void;
  onHangup: () => Promise<void>;
  onRecord: () => Promise<void>;
  onStopRecord: () => Promise<void>;
  onPauseRecord: () => Promise<void>;
  onResumeRecord: () => void;
  onRestartTimer: () => Promise<void>;
  onActiveCall: () => void;
  onTransferSelect: (option: TransferOption) => void;
  onCopySuccess: (name: string) => void;
  setKeypadOpen: (isOpen: boolean) => void;
  handleKeypadChange: (value: string) => void;
  handleKeypadKeyPress: (digit: string) => void;
  onUpdateCallLog: (field: string, value: string) => void;
  disposeCall: () => Promise<void>;
  openAgentScript: () => void;
  goToRequeueCallPage: () => void;
  goToTransferCallPage: (type: string) => void;
}

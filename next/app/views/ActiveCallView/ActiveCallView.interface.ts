import type { IvrAlertData } from '../../components/IvrAlertPanel';

/**
 * Basic call info with follow-up info
 */
export interface BasicCallInfo {
  subject: string;
  contactName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  followInfos: string[];
}

/**
 * Call control permission flags
 */
export interface ActiveCallPermissions {
  allowTransferCall: boolean;
  allowHoldCall: boolean;
  allowHangupCall: boolean;
  allowRecordControl: boolean;
  allowPauseRecord: boolean;
}

/**
 * ActiveCallView external props
 */
export interface ActiveCallViewProps {
  // Currently no external props needed
}

/**
 * ActiveCallView UI state props
 */
export interface ActiveCallViewUIProps {
  activityCallId: string;
  currentCall: any;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  isKeypadOpen: boolean;
  keypadValue: string;
  ivrAlertData: IvrAlertData[];
  callControlPermissions: ActiveCallPermissions;
  isIntegratedSoftphone: boolean;
  recordPauseCount: number | undefined;
  timeStamp: number | null;
  basicInfo: BasicCallInfo | null;
  isMultipleCalls: boolean;
  isInComingCall: boolean;
  allowTransfer: boolean;
  isDefaultRecord: boolean;
  isInbound: boolean;
  notes: string;
}

/**
 * ActiveCallView UI action functions
 */
export interface ActiveCallViewUIFunctions {
  setCallId: (id: string) => Promise<void>;
  setViewCallId: (id: string) => void;
  onBack: () => void;
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
  onTransfer: () => void;
  onDisposition: () => void;
  setKeypadOpen: (isOpen: boolean) => void;
  handleKeypadChange: (value: string) => void;
  handleKeypadKeyPress: (digit: string) => void;
  onUpdateNotes: (value: string) => void;
}

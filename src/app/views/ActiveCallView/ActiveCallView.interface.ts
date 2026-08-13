import type { IvrAlertData } from '../../components/IvrAlertPanel';
import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvCallDispositionItem,
} from '../../services/EvAgentScript';

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
  isCallDisposed: boolean;
  allowTransfer: boolean;
  isDefaultRecord: boolean;
  isInbound: boolean;
  notes: string;
  hasAgentScript: boolean;
  agentScript: EvAgentScriptData | null;
  agentScriptLoading: boolean;
  agentScriptError: string | null;
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
  setAgentScriptExpanded: (expanded: boolean) => Promise<void>;
  onAgentScriptResult: (
    callId: string,
    result: EvAgentScriptResult,
  ) => Promise<void>;
  onAgentScriptDisposition: (
    callId: string,
    disposition: EvCallDispositionItem,
  ) => Promise<void>;
  getKnowledgeBaseArticles: (
    callId: string,
    groupIds: number[],
  ) => Promise<unknown>;
}

import type { EvSmallCallControlProps } from '../components/EvSmallCallControl';
import type { EvTransferType } from '../enums';

import type {
  EvAgentScriptData,
  EvCallData,
  EvIvrData,
} from './EvData.interface';

/**
 * Call status type - local definition
 */
export type CallStatus = 'ringing' | 'active' | 'hold' | 'ended';

/**
 * Basic call info props - local definition
 */
export interface BasicCallInfoProps {
  callInfos?: Array<{ label: string; value: string }>;
  followInfos?: Array<{ label: string; value: string }>;
}

/**
 * Call log fields props - local definition
 */
export interface CallLogFieldsProps {
  referenceFieldOptions?: Record<string, any>;
}

/**
 * Call log panel props - local definition
 */
export interface CallLogPanelProps {
  currentLocale?: string;
  showSmallCallControl?: boolean;
  isWide?: boolean;
  currentLog?: {
    task?: Record<string, any>;
  };
  goBack?: () => void;
  onUpdateCallLog?: (data: any) => void;
  onSaveCallLog?: () => Promise<void>;
}

export type EvCallLogTask = {
  dispositionId?: string;
  notes?: string;
  [key: string]: any;
};

export type EvCurrentLog = {
  currentEvRawCall: EvCallData;
  task: { [key: string]: any };
  showInfoMeta?: {
    entity: any;
    title: string;
  };
};

export const callLogMethods = {
  create: 'create',
} as const;
export type CallLogMethods = keyof typeof callLogMethods;

export const saveStatus = {
  saved: 'saved',
  saving: 'saving',
  submit: 'submit',
} as const;
export type SaveStatus = keyof typeof saveStatus;

export type EvActivityCallUIProps = {
  scrollTo: string;
  currentLog: EvCurrentLog;
  showRecordCall: boolean;
  isRecording: boolean;
  disableRecordControl: boolean;
  disablePauseRecord: boolean;
  /** The subject for call log info */
  basicInfo?: {
    subject?: string;
    callInfos?: Array<{ label: string; value: string }>;
    followInfos?: Array<{ label: string; value: string }>;
  };
  isInbound: boolean;
  currentEvCall: EvCallData;
  status: CallStatus;
  disableDispose: boolean;
  saveStatus: SaveStatus | CallLogMethods;
  isKeypadOpen?: boolean;
  keypadValue?: string;
  smallCallControlSize: 'medium' | 'small';
  currentCallControlPermission: {
    allowHangupCall?: boolean;
    allowRequeueCall?: boolean;
    allowTransferCall?: boolean;
    allowHoldCall?: boolean;
    allowRecordControl?: boolean;
    allowPauseRecord?: boolean;
  };
  disableInternalTransfer: boolean;
  showMuteButton: boolean;
  ivrAlertData: EvIvrData[];
  agentScriptData?: EvAgentScriptData;
  referenceFieldOptions?: Record<string, any>;
  recordPauseCount: number;
  timeStamp: number;
  currentLocale?: string;
  showSmallCallControl?: boolean;
  isWide?: boolean;
} & Pick<
  EvSmallCallControlProps,
  | 'isOnMute'
  | 'isOnHold'
  | 'isInComingCall'
  | 'isOnActive'
  | 'disableTransfer'
  | 'disableHangup'
  | 'disableActive'
  | 'disableHold'
  | 'disableMute'
>;

export type EvActivityCallUIFunctions = {
  disposeCall: () => Promise<void>;
  goToRequeueCallPage(): void;
  goToTransferCallPage(type: EvTransferType): void;
  onCopySuccess: (name: string) => void;
  setKeypadIsOpen: (status: boolean) => void;
  setKeypadValue: (value: string) => void;
  goBack?: () => void;
  onUpdateCallLog?: (data: any) => void;
  onSaveCallLog?: () => Promise<void>;
} & Pick<
  EvSmallCallControlProps,
  | 'onMute'
  | 'onUnmute'
  | 'onHangup'
  | 'onReject'
  | 'onHold'
  | 'onUnHold'
  | 'onActive'
  | 'onRecord'
  | 'onStopRecord'
  | 'onResumeRecord'
  | 'onPauseRecord'
  | 'onRestartTimer'
>;

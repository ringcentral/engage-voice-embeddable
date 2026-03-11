/**
 * Options for CallHistoryDetailView customization
 */
interface CallHistoryDetailViewOptions {
  onSave?: () => void;
}

/**
 * Props passed to the CallHistoryDetailView component
 */
interface CallHistoryDetailViewProps {
  id?: string;
  method?: string;
}

/**
 * Extra metadata from the raw call / endedCall for the detail view
 */
interface CallDetailMeta {
  dnis?: string;
  queueName?: string;
  callId?: string;
  termParty?: string;
  termReason?: string;
}

/**
 * CallHistoryDetailView UI state props (returned by getUIProps)
 */
interface CallHistoryDetailViewUIProps {
  callDetail: any | undefined;
  callMeta: CallDetailMeta;
  isInbound: boolean;
  isActiveCall: boolean;
  callNotFound: boolean;
}

/**
 * CallHistoryDetailView UI action functions (returned by getUIFunctions)
 */
interface CallHistoryDetailViewUIFunctions {
  onBack: () => void;
}

export type {
  CallHistoryDetailViewOptions,
  CallHistoryDetailViewProps,
  CallHistoryDetailViewUIProps,
  CallHistoryDetailViewUIFunctions,
  CallDetailMeta,
};

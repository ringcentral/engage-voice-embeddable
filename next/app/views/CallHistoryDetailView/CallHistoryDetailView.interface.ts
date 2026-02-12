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
 * Disposition item from the disposition pick list
 */
interface DispositionPickItem {
  dispositionId: string;
  disposition: string;
  isDefault?: boolean;
}

/**
 * Extra metadata from the raw call / endedCall for the detail view
 */
interface CallDetailMeta {
  dnis?: string;
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
  dispositions: DispositionPickItem[];
  isInbound: boolean;
  callNotFound: boolean;
}

/**
 * CallHistoryDetailView UI action functions (returned by getUIFunctions)
 */
interface CallHistoryDetailViewUIFunctions {
  onSave: (callId: string, notes: string, dispositionId: string | null) => Promise<void>;
  onBack: () => void;
}

export type {
  CallHistoryDetailViewOptions,
  CallHistoryDetailViewProps,
  CallHistoryDetailViewUIProps,
  CallHistoryDetailViewUIFunctions,
  CallDetailMeta,
  DispositionPickItem,
};

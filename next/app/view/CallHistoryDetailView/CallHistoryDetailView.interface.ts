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

export type { CallHistoryDetailViewOptions, CallHistoryDetailViewProps };

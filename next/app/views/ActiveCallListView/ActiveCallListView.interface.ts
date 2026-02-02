/**
 * Options for ActiveCallListView customization
 */
interface ActiveCallListViewOptions {
  onCallSelect?: (callId: string) => void;
}

/**
 * Props passed to the ActiveCallListView component
 */
interface ActiveCallListViewProps {
  id?: string;
}

export type { ActiveCallListViewOptions, ActiveCallListViewProps };

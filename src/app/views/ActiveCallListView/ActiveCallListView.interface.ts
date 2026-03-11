import type { EvCallData } from '../../services/EvCallDataSource';

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

/**
 * UI state props for ActiveCallListView
 */
interface ActiveCallListViewUIProps {
  callList: EvCallData[];
  isOnMute: boolean;
  showMuteButton: boolean;
  userName: string;
  isInbound: boolean;
}

/**
 * UI action functions for ActiveCallListView
 */
interface ActiveCallListViewUIFunctions {
  goBack: () => void;
  onHangup: (call: EvCallData) => void;
  onHold: (call: EvCallData) => void;
  onUnHold: (call: EvCallData) => void;
  onMute: () => void;
  onUnmute: () => void;
}

export type {
  ActiveCallListViewOptions,
  ActiveCallListViewProps,
  ActiveCallListViewUIProps,
  ActiveCallListViewUIFunctions,
};

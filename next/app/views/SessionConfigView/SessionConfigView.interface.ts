import type { EvAgent } from '../../services/EvClient/interfaces';

/**
 * SessionConfigView options for configuration
 */
export interface SessionConfigViewOptions {
  /** Custom callback for account re-selection */
  onAccountReChoose?: () => void | Promise<void>;
  /** Whether to show the switch account button */
  showReChooseAccount?: boolean;
}

/**
 * SessionConfigView UI props passed to the component
 */
export interface SessionConfigViewUIProps {
  /** Currently selected agent information */
  selectedAgent: EvAgent | null;
  /** Whether the switch account button should be shown */
  showReChooseAccount: boolean;
  /** Whether the form is in loading state */
  isLoading: boolean;
  /** Current locale for i18n */
  currentLocale: string;
  /** Whether inbound queues section should be shown */
  showInboundQueues: boolean;
  /** Whether skill profile section should be shown */
  showSkillProfile: boolean;
  /** Whether auto answer toggle should be shown */
  showAutoAnswer: boolean;
  /** Whether dial group section should be shown */
  showDialGroup: boolean;
}

/**
 * SessionConfigView UI functions passed to the component
 */
export interface SessionConfigViewUIFunctions {
  /** Callback when user wants to switch account */
  onAccountReChoose: () => void | Promise<void>;
  /** Callback when user clicks continue to configure session */
  setConfigure: () => Promise<void>;
}

/**
 * SessionConfigView props
 */
export interface SessionConfigViewProps {
  // Component props
}

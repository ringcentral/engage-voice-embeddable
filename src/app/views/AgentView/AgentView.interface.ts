import type { SyncTabProps } from '@ringcentral-integration/micro-core/src/app/views';

/**
 * AgentView configuration options
 */
export interface AgentViewOptions {
  /**
   * Default tab to show on initial render
   */
  defaultTab?: string;
}

/**
 * AgentView component props
 */
export interface AgentViewProps {
  /**
   * Optional initial tab to display
   */
  initialTab?: string;
}

/**
 * AgentView panel props for UI binding
 */
export interface AgentViewPanelProps {
  tabs: SyncTabProps['tabs'];
  currentTab: string;
}

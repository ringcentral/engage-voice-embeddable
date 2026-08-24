import type { EvAgentAssistantFrameParams } from '../../services/EvAgentAssistant';

export interface AgentAssistantPanelProps {
  callId: string;
  /**
   * Defaults to true. The side widget turns it off once tabs are shown, because
   * the tab label already names the panel.
   */
  showTitle?: boolean;
  getParams: (
    callId: string,
  ) => Promise<EvAgentAssistantFrameParams | null>;
}

export interface AgentAssistantFrameProps {
  params: EvAgentAssistantFrameParams;
}

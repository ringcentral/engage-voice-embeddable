import type { EvAgentAssistantFrameParams } from '../../services/EvAgentAssistant';

export interface AgentAssistantPanelProps {
  callId: string;
  getParams: (
    callId: string,
  ) => Promise<EvAgentAssistantFrameParams | null>;
}

export interface AgentAssistantFrameProps {
  params: EvAgentAssistantFrameParams;
}

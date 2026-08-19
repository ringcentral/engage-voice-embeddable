import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../../services/EvClient/interfaces';

export interface AgentScriptPanelProps {
  callId: string;
  call: EvBaseCall;
  /**
   * Defaults to true. The side widget turns it off once tabs are shown, because
   * the tab label already names the panel.
   */
  showTitle?: boolean;
  script: EvAgentScriptData | null;
  loading: boolean;
  error: string | null;
  onResultChange: (
    callId: string,
    result: EvAgentScriptResult,
  ) => Promise<void>;
  onDisposition: (
    callId: string,
    disposition: EvCallDispositionItem,
  ) => Promise<void>;
  getKnowledgeBaseArticles: (
    callId: string,
    groupIds: number[],
  ) => Promise<unknown>;
}


import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../../services/EvClient/interfaces';

export interface AgentScriptPanelProps {
  callId: string;
  call: EvBaseCall;
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


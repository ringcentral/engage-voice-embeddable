import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../../services/EvClient/interfaces';
import type { EvAgentScriptModel } from '../../services/EvAgentScript';

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
  /**
   * Build the `{{model.*}}` interpolation root for the renderer. A function
   * rather than a prop so the freshly built object never takes part in the
   * connector's shallow prop comparison.
   */
  getScriptModel: (call: EvBaseCall) => EvAgentScriptModel;
}


import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../../services/EvClient/interfaces';
import type { SideWidgetId, SideWidgetItem } from '../../services/SideWidget';

export interface SideWidgetViewUIProps {
  /** `Root.expanded` — whether the root view's expanded container is rendered. */
  expanded: boolean;
  widgets: SideWidgetItem[];
  currentWidgetId: SideWidgetId | null;
  callId: string;
  currentCall: EvBaseCall | null;
  agentScript: EvAgentScriptData | null;
  agentScriptLoading: boolean;
  agentScriptError: string | null;
}

export interface SideWidgetViewUIFunctions {
  setCurrentWidgetId: (widgetId: SideWidgetId) => Promise<void>;
  onAgentScriptResult: (
    callId: string,
    result: EvAgentScriptResult,
  ) => Promise<void>;
  onAgentScriptDisposition: (
    callId: string,
    disposition: EvCallDispositionItem,
  ) => Promise<void>;
  getKnowledgeBaseArticles: (
    callId: string,
    groupIds: number[],
  ) => Promise<unknown>;
}

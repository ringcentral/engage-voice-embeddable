import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../../services/EvClient/interfaces';
import type { EvAgentAssistantFrameParams } from '../../services/EvAgentAssistant';
import type { EvAgentScriptModel } from '../../services/EvAgentScript';
import type { SideWidgetId, SideWidgetItem } from '../../services/SideWidget';

export interface SideWidgetViewUIProps {
  /**
   * `Root.expanded` — whether the root view's expanded container is rendered,
   * i.e. whether the panels sit beside the main column or overlay it.
   */
  expanded: boolean;
  /**
   * Whether the agent has the widget shown. A hidden widget still renders (kept
   * in the DOM, display-none) so its panels keep their live state.
   */
  visible: boolean;
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
  setVisible: (visible: boolean) => Promise<void>;
  setCanExpandLayout: (canExpandLayout: boolean) => Promise<void>;
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
  getAgentAssistantParams: (
    callId: string,
  ) => Promise<EvAgentAssistantFrameParams | null>;
  /**
   * A UI function rather than a UI prop: it builds a new nested object on every
   * call, which would fail the connector's per-key identity comparison and make
   * the script frame re-initialize on every store dispatch.
   */
  getAgentScriptModel: (call: EvBaseCall) => EvAgentScriptModel;
}

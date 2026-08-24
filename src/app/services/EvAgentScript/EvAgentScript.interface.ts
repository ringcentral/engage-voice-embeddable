import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../EvClient/interfaces';
import type { EvAgentScriptModel } from './formatAgentScriptModel';

export interface EvAgentScriptOptions {
  /**
   * Opt in to the Agent Script side widget. Off unless the host sets the
   * `enableAgentScript` parameter, so an embedding that never asked for the
   * feature keeps the panel hidden even though the call metadata still carries
   * a script id.
   */
  enabled?: boolean;
}

export type EvCallScriptMapping = Record<string, EvAgentScriptData>;

export type EvCallScriptLoadingMapping = Record<string, boolean>;

export type EvCallScriptErrorMapping = Record<string, string | null>;

export type EvCallScriptResultMapping = Record<string, EvAgentScriptResult>;

export interface EvAgentScriptInitializePayload {
  callId: string;
  config: EvAgentScriptData;
  call: EvBaseCall;
  /**
   * The root the renderer interpolates `{{model.*}}` tags against. Built host
   * side by `EvAgentScript.getScriptModel`, because the frame has no access to
   * the agent settings the `{{model.call.agent*}}` tags need.
   */
  model: EvAgentScriptModel;
}

export type AgentScriptHostMessage =
  | {
      type: 'initialize';
      payload: EvAgentScriptInitializePayload;
    }
  | {
      type: 'reset';
      callId: string;
    }
  | {
      type: 'knowledgeBaseResult';
      requestId: string;
      value: unknown;
      error?: string;
    };

export type AgentScriptRendererMessage =
  | { type: 'ready' }
  | {
      type: 'scriptResult';
      callId: string;
      value: EvAgentScriptResult;
    }
  | {
      type: 'updateDisposition';
      callId: string;
      value: EvCallDispositionItem;
    }
  | {
      type: 'getKnowledgeBaseArticles';
      callId: string;
      requestId: string;
      groupIds: number[];
    };

export type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvCallDispositionItem,
};

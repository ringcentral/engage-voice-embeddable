import type {
  EvAgentScriptData,
  EvAgentScriptResult,
  EvBaseCall,
  EvCallDispositionItem,
} from '../EvClient/interfaces';

export interface EvAgentScriptOptions {
  /** Keep the compatibility renderer disabled without removing call metadata. */
  disabled?: boolean;
}

export type EvCallScriptMapping = Record<string, EvAgentScriptData>;

export type EvCallScriptLoadingMapping = Record<string, boolean>;

export type EvCallScriptErrorMapping = Record<string, string | null>;

export type EvCallScriptResultMapping = Record<string, EvAgentScriptResult>;

export interface EvAgentScriptInitializePayload {
  callId: string;
  config: EvAgentScriptData;
  call: EvBaseCall;
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

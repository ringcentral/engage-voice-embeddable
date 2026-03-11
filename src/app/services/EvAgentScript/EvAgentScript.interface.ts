import type { EvAgentScriptResult } from '../EvClient/interfaces';

/**
 * EvAgentScript module interfaces
 */

export interface EvAgentScriptOptions {
  // Options for EvAgentScript module
}

export interface EvCallScriptResultMapping {
  [callId: string]: EvAgentScriptResult;
}

export interface EvAgentScriptData {
  scriptId: string;
  data: any;
}

export interface EvCallDispositionItem {
  dispositionId: string;
  notes: string;
}

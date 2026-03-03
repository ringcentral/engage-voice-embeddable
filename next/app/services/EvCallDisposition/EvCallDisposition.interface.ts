/**
 * EvCallDisposition options for configuration
 */
export interface EvCallDispositionOptions {
  // Optional configuration options
}

/**
 * Call disposition data
 */
export interface EvCallDispositionData {
  dispositionId: string | null;
  notes: string;
  summary: string;
}

/**
 * Call disposition mapping
 */
export interface EvCallDispositionMapping {
  [callId: string]: EvCallDispositionData;
}

/**
 * Disposition state
 */
export interface EvDispositionState {
  disposed: boolean;
}

/**
 * Disposition state mapping
 */
export interface EvDispositionStateMapping {
  [callId: string]: EvDispositionState;
}

export interface EvCallSummaryState {
  segmentId: string;
  orderedPhases: Record<number, string>;
  summary: string;
  isFinal: boolean;
  isLoading: boolean;
  isEditedAfterFinal: boolean;
}

export interface EvCallSummaryStateMapping {
  [callId: string]: EvCallSummaryState;
}

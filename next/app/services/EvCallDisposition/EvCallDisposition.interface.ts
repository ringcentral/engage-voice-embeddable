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

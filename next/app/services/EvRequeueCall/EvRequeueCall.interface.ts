/**
 * EvRequeueCall module interfaces
 */

export interface EvRequeueCallOptions {
  // Options for EvRequeueCall module
}

export interface EvRequeueCallStatus {
  selectedQueueGroupId?: string;
  selectedGateId?: string;
  stayOnCall?: boolean;
  requeuing?: boolean;
}

import type {
  EvACKResponse,
  EvAddSessionNotification,
  EvAgentConfig,
  EvAgentStateResponse,
  EvBaseCall,
  EvDispositionSummaryErrorResponse,
  EvDispositionSummaryPhaseResponse,
  EvDirectAgentTransferResponse,
  EvDropSessionNotification,
  EvEndedCall,
  EvHoldResponse,
  EvLoginResponse,
  EvOffhookInitResponse,
  EvOpenSocketResult,
  EvReceivedTransferCall,
} from './EvSdkResponse.interface';

export type EvSipRingingData = {
  message: string;
  // This type from sip.js => IncomingRequest
  data: string;
};

/**
 * Reports which repair the SDK chose when asked to rotate the SIP registrar:
 * `RESET` rebuilds the session, `UPDATE` only refreshes the offhook flags.
 */
export type EvSipSwitchRegistrarData = {
  message: string;
  status: 'RESET' | 'UPDATE';
};

/**
 * A superseded SIP.js user agent's WebSocket closed. `code` 1000 means the
 * close handshake completed, so anything the SDK had queued on that socket,
 * including a wildcard un-REGISTER, was delivered after the replacement
 * registration and may have wiped it.
 */
export type EvSipSuspectRegistrationData = {
  closedUaId: string | null;
  latestUaId: string | null;
  code: number;
  reason: string;
};

/**
 * Fired once the softphone has re-registered, carrying the offhook flags the
 * SDK was holding when the registration dropped.
 */
export type EvSipDialDestChangedData = {
  message: string;
  dialDest: string;
  maintainOH: boolean;
  autoStartOH: boolean;
};

export interface EvClientCallMapping {
  acknowledgeResponse: EvACKResponse;
  addSessionNotification: EvAddSessionNotification;
  agentDebugEmailNotification: any;
  agentStateResponse: EvAgentStateResponse;
  authenticateResponse: any;
  bargeInResponse: any;
  callbackCancelResponse: any;
  callbacksPendingResponse: any;
  callNotesResponse: any;
  campaignDispositionsResponse: any;
  chatResponse: any;
  chatActiveNotification: any;
  addChatSessionNotification: any;
  chatCancelledNotification: any;
  chatClientReconnectNotification: any;
  chatInactiveNotification: any;
  chatListResponse: any;
  chatMessageNotification: any;
  chatNewNotification: any;
  chatPresentedNotification: any;
  chatRoomStateResponse: any;
  chatStateResponse: any;
  stopAgentChatMonitorNotification: any;
  chatTypingNotification: any;
  closeResponse: any;
  coachResponse: any;
  configureResponse: any;
  dialGroupChangeNotification: any;
  dialGroupChangePendingNotification: any;
  directAgentTransferResponse: EvDirectAgentTransferResponse;
  directAgentTransferListResponse: any;
  directAgentTransferNotification: EvReceivedTransferCall;
  dropSessionNotification: EvDropSessionNotification;
  earlyUiiNotification: any;
  endCallNotification: EvEndedCall;
  gatesChangeNotification: any;
  genericNotification: any;
  genericResponse: any;
  holdResponse: EvHoldResponse;
  leadHistoryResponse: any;
  leadInsertResponse: any;
  leadSearchResponse: any;
  leadUpdateResponse: any;
  loginResponse: EvLoginResponse;
  loginPhase1Response: EvAgentConfig;
  multiSocketResponse: any;
  logoutResponse: any;
  logConsoleResultsResponse: any;
  logResultsResponse: any;
  newCallNotification: EvBaseCall;
  offhookInitResponse: EvOffhookInitResponse;
  offhookTermNotification: any;
  /** `error` is present when the SDK reuses this callback for a failed connect. */
  openResponse: EvOpenSocketResult;
  pauseRecordResponse: any;
  pendingChatDispNotification: any;
  pendingDispNotification: any;
  previewFetchResponse: any;
  previewLeadStateNotification: any;
  recordResponse: any;
  requeueResponse: any;
  reverseMatchNotification: any;
  safeModeFetchResponse: any;
  safeModeSearchResponse: any;
  scriptConfigResponse: any;
  monitorResponse: any;
  agentStats: any;
  agentDailyStats: any;
  campaignStats: any;
  chatQueueStats: any;
  queueStats: any;
  dispositionSummary: EvDispositionSummaryPhaseResponse;
  dispositionSummaryError: EvDispositionSummaryErrorResponse;
  supervisorListResponse: any;
  tcpaSafeLeadStateNotification: { leadState: any };
  webRtcInfoResponse: any;
  coldXferResponse: any;
  warmXferResponse: any;
  searchDirectoryResponse: any;
  extensionPresenceInfo: any;
  sipConnectedNotification: any;
  sipDialDestChangedNotification: EvSipDialDestChangedData;
  sipEndedNotification: any;
  sipMuteResponse: any;
  sipRegisteredNotification: any;
  sipRegistrationFailedNotification: any;
  sipRingingNotification: EvSipRingingData;
  sipSwitchRegistrarNotification: EvSipSwitchRegistrarData;
  sipUnmuteResponse: any;
  sipUnregisteredNotification: any;
  sipUnstableConnectionNotification: any;
  sipSuspectRegistrationNotification: EvSipSuspectRegistrationData;
}

export type EvClientCallBackValueType = keyof EvClientCallMapping;

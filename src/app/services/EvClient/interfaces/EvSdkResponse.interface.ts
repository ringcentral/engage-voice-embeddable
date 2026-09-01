import type {
  AgentTypesType,
  DirectTransferNotificationTypes,
  DirectTransferStatues,
  DirectTransferTypes,
  OriginAgentTypesType,
} from '../../../../enums';

export type EvTokenType = 'Bearer';
export type EvOkFail = 'OK' | 'FAILURE';
export type EvSessionType = 'AGENT' | 'OUTBOUND' | 'INBOUND';

export type EvBaseCall = {
  uii: string;
  agentId: string;
  dialDest: string;
  queueDts: string; // 2019-11-11 12:35:23
  queueTime: string;
  ani: string;
  dnis: string;
  /**
   * E.164 forms of `ani`/`dnis`. The agent library reads them from the
   * `ani_e164`/`dnis_e164` fields of the NEW-CALL, CALL-CANCELED and
   * INTERACTION-PREVIEW notifications, and `EvCallDataSource.addNewCall` spreads
   * the whole raw call, so they reach us even though the documented call schema
   * omits them.
   */
  aniE164?: string;
  dnisE164?: string;
  callType: 'INBOUND' | 'OUTBOUND';
  appUrl: string;
  isMonitoring: boolean;
  allowHold: boolean;
  allowTransfer: boolean;
  allowManualInternationalTransfer: boolean;
  allowDirectAgentTransfer: string;
  allowHangup: boolean;
  allowRequeue: boolean;
  allowEndCallForEveryone: boolean;
  scriptId: string;
  scriptVersion: string;
  surveyId: string;
  surveyPopType: string;
  requeueType: string;
  hangupOnDisposition: boolean;
  queue: EvQueue;
  agentRecording: EvAgentRecording;
  outdialDispositions: EvOutdialDispositions;
  requeueShortcuts: any[];
  baggage: EvBaggage;
  scriptResponse: {};
  lead: EvLead;
  // sessionId: string;
  transferPhoneBook: EvTransferPhoneBookItem[];
  // Dynamic properties set during call lifecycle
  hold?: boolean;
  /**
   * NEW-CALL's segment context. Sub-objects are always present (the agent
   * library defaults them) and leaves default to `''`.
   *
   * Only NEW-CALL's shape is modelled here: the agent library has four
   * divergent `normalizeSegmentContext` variants (new call, call preview, call
   * canceled, chat presented) that must not share one type.
   */
  segmentContext: {
    /** The agent's own leg for this call. */
    segmentId: string;
    preSegmentId: string;
    firstAgentSegmentId: string;
    /** Comma-joined, e.g. `"1,2,3"` — not an array. */
    categoryIds: string;
    agentContext: {
      knowledgeBaseId: string;
      perspectiveRecordingMode: string;
    },
    customerIdentity: {
      id: string;
      ani: string;
      aniE164: string;
    },
    dialog: {
      channelId: string;
      channelType: string;
      dialogDirection: string;
      dialogId: string;
    }
  },
  /** The ADD-SESSION notification this call was last seen on. */
  session?: EvAddSessionNotification;
  endedCall?: boolean;
};

export interface EvACKResponse {
  message: string;
  detail: string;
  uii: string;
  status: EvOkFail;
  type: string;
}

export interface EvEndedCall {
  message: string;
  detail: string;
  uii: string;
  sessionId: string;
  agentId: string;
  callDts: string;
  duration: string;
  termParty: string;
  termReason: string;
  recordingUrl: string;
  dispositionTimeout: string;
}
export interface EvTransferPhoneBookItem {
  name: string;
  destination: string;
  countryId: string;
}

export interface EvLead {
  leadPhone: string;
  showLeadInfo: string;
  extraData: {};
}

export interface EvScriptResponse {
  message: string;
  detail: string;
  status: boolean;
  scriptId: string;
  scriptName?: string;
  version: string;
  json: string; // format as: EvScriptResponseJSON
}

export interface EvBaggage {
  ani: string;
  dnis: string;
  uii: string;
  sourceId: string;
  sourceName: string;
  sourceDesc: string;
  sourceType: string;
  agentFirstName: string;
  agentLastName: string;
  agentExternalId: string;
  agentType: string;
  agentEmail: string;
  agentUserName: string;
  ivrCrmCaseId: string;
  ivrCrmRecordId: string;
  ivrCrmObjectValue: string;
  ivrCrmObjectType: string;
  ivrAlertSubject_1: string;
  ivrAlertBody_1: string;
  ivrAlertSubject_2: string;
  ivrAlertBody_2: string;
  ivrAlertSubject_3: string;
  ivrAlertBody_3: string;
}

export interface EvReceivedTransferCall {
  message: string;
  detail: string;
  status: DirectTransferNotificationTypes;
  agentId: string;
  uii: string;
  ani: string;
  dnis: string;
  sourceType: string;
  sourceId: string;
  sourceName: string;
  voicemailUrl: string;
}

export interface EvAgentRecording {
  default: 'ON' | 'OFF';
  pause: number;
  agentRecording: boolean;
}

export interface EvQueue {
  isCampaign: boolean;
  number: string;
  name: string;
  description: string;
}

export interface EvOutdialDispositions {
  type: string;
  dispositions: EvDisposition[];
}

export interface EvDisposition {
  contactForwarding: boolean;
  dispositionId: string;
  isComplete: boolean;
  isDefault: boolean;
  requireNote: boolean;
  saveSurvey: boolean;
  timeout: string;
  xfer: boolean;
  disposition: string;
}

export interface EvClientOptions {
  options: EvAgentOptions;
  callbacks?: {
    closeResponse: () => void;
    openResponse: (response: EvOpenSocketResult) => void;
  };
}

export type Deps = {
  evClientOptions: EvClientOptions;
};

export interface EvHoldResponse {
  message: string;
  detail: string;
  status: EvOkFail;
  holdState: boolean;
  sessionId: string;
  uii: string;
  holdStartedAt: number | null;
}

export interface EvDropSessionNotification {
  message: string;
  detail: string;
  status: EvOkFail;
  transferEnd: {
    sessionId: string;
    destination: string;
    uii: string;
  };
  sessionId: string;
  uii: string;
}

/**
 * A leg of a transfer/conference, tracked by the agent library for the
 * lifetime of the call and cleared on END-CALL.
 */
export interface EvTransferSession {
  sessionId: string;
  useAgentNameAsDestination: boolean;
  /** `agentName` when `useAgentNameAsDestination`, otherwise `phone`. */
  destination: string;
  /** `phone_e164`; empty when the agent name is used as the destination. */
  destinationE164: string;
  uii: string;
  /** Added by the HOLD request handler, not by ADD-SESSION. */
  onHold?: boolean;
  holdStartedAt?: number | null;
}

/**
 * ADD-SESSION notification.
 *
 * Mirrors `addSession.notification.js` in `@ringcx/agent-sdk`. Absent fields
 * arrive as `''` rather than `undefined`, and the wire literals `"TRUE"` /
 * `"FALSE"` are coerced to real booleans, which is why the flag fields are
 * `boolean | string`.
 *
 * `segmentId` identifies **this session's** leg, not the call: one uii can
 * produce several sessions, each with its own segment id.
 */
export interface EvAddSessionNotification {
  message: string;
  detail: string;
  status: EvOkFail;
  type: string;
  errorCode: string;
  errorParams: Record<string, unknown>;
  sessionId: string;
  uii: string;
  dialogId: string;
  phone: string;
  sessionType: EvSessionType;
  sessionLabel: string;
  allowControl: boolean | string;
  monitoring: boolean | string;
  agentId: string;
  agentName: string;
  recordingUrl: string;
  segmentId: string;
  summary: boolean | string;
  monitoringType: string;
  transferSessions: {
    [P: string]: EvTransferSession;
  };
}

export interface EvOpenSocketResult {
  reconnect?: boolean;
  error?: string;
}

/**
 * Formatted LOGIN response from the Agent SDK.
 *
 * `isReconnect` is only present on a successful Layer 2 reconnect, which is
 * also the only response that carries the server's session state
 * (`is_on_call` / `active_call_uii` / `is_pending_disp`) into the SDK model.
 */
export interface EvLoginResponse {
  status?: string;
  message?: string;
  isReconnect?: boolean;
}

export interface EvAgentInfo {
  type: string;
  data: EvAgentData;
}

export interface EvAgentData {
  authenticateResponse: EvAuthenticateAgentWithRcAccessTokenRes;
  agentConfig: EvAgentConfig;
}

export interface EvAgentOptions {
  authHost: string;
  localTesting: boolean;
  allowMultiSocket: boolean;
  isSecureSocket: boolean;
}

export type EvCallback = (messageType: any, response: any) => void;

export type EvMessageRes = {
  type: string;
  data: EvAgentConfig;
};

export interface EvOffhookInitResponse {
  detail: string;
  message: string;
  monitoring: boolean;
  status: string;
}

export interface EvOffhookTermResponse {
  detail: string;
  message: string;
  monitoring: boolean;
  status: string;
}

export interface EvEarlyUiiResponse {
  agentId: string;
  detail: string;
  message: string;
  status: EvOkFail;
  uii: string;
  /**
   * The pre-routing segment. Often `''` — not every deployment sends it — and
   * it can differ from the segment ADD-SESSION later reports for the agent's
   * own leg, so the two are not interchangeable.
   */
  segmentId: string;
}

export interface EvAgentConfig {
  message: string;
  detail: string;
  status: string;
  agentSettings: EvAgentSettings;
  agentPermissions: EvAgentPermissions;
  applicationSettings: EvApplicationSettings;
  chatSettings: EvChatSettings;
  connectionSettings: EvConnectionSettings;
  inboundSettings: EvInboundSettings;
  outboundSettings: EvOutboundSettings;
  scriptSettings: EvScriptSettings;

  holdState?: boolean;
  sessionId?: string;
  uii?: string;
}

export interface EvScriptSettings {
  availableScripts: EvAvailableScript[];
  loadedScripts: EvAllowLeadUpdatesByCampaign;
}

export interface EvAvailableScript {
  scriptId: string;
  scriptName: string;
}

export interface EvOutboundSettings {
  availableCampaigns: any[];
  availableOutdialGroups: any[];
  insertCampaigns: any[];
  defaultDialGroup: string;
  outdialGroup: EvAllowLeadUpdatesByCampaign;
  previewDialLeads: any[];
  tcpaSafeLeads: any[];
  campaignDispositions: any[];
}

export interface EvInboundSettings {
  availableQueues: EvAvailableQueue[];
  availableSkillProfiles: EvAvailableSkillProfile[];
  queues: any[];
  skillProfile: EvAvailableSkillProfile;
  availableRequeueQueues: EvAvailableRequeueQueue[];
}

export interface EvAvailableSkillProfile {
  profileId: string;
  profileName: string;
  isDefault?: string;
  profileDesc?: string;
}

export interface EvAvailableRequeueQueue {
  gateGroupId: string;
  groupName: string;
  gates: EvGate[];
  skills: EvSkill[];
}

export interface EvSkill {
  skillDesc: string;
  skillId: string;
  skillName: string;
}

export interface EvGate {
  gateDesc: string;
  gateId: string;
  gateName: string;
}

export interface EvAvailableQueue {
  defaultDestOverride?: string;
  gateDesc?: string;
  gateId: string;
  gateName: string;
}

export interface EvConnectionSettings {
  hashCode?: any;
  reconnect: boolean;
}

export interface EvChatSettings {
  availableChatQueues: any[];
  availableChatRooms: EvAvailableChatRoom[];
  chatQueues: any[];
  alias: string;
  availableChatRequeueQueues: any[];
}

export interface EvAvailableChatRoom {
  roomDesc: string;
  roomId: string;
  roomName: string;
}

export interface EvApplicationSettings {
  availableCountries: EvAvailableCountry[];
  isLoggedInIS: boolean;
  socketConnected: boolean;
  socketDest: string;
  isTcpaSafeMode: boolean;
  pciEnabled: boolean;
}

export interface EvAvailableCountry {
  countryId: string;
  countryName: string;
  /** country dialing code, eg. `49` for Germany */
  countryCode?: string;
  rcCountryId?: string;
}

export interface EvAgentPermissions {
  allowBlended: boolean;
  allowCallControl: boolean;
  allowChat: boolean;
  allowCrossQueueRequeue: boolean;
  allowInbound: boolean;
  allowLeadInserts: boolean;
  allowLeadSearch: boolean;
  allowLoginControl: boolean;
  allowLoginUpdates: boolean;
  allowManualCalls: boolean;
  allowManualPass: boolean;
  allowManualIntlCalls: boolean;
  allowManualOutboundGates: boolean;
  allowOffHook: boolean;
  allowOutbound: boolean;
  allowPreviewLeadFilters: boolean;
  allowLeadUpdatesByCampaign: EvAllowLeadUpdatesByCampaign;
  disableSupervisorMonitoring: boolean;
  progressiveEnabled: boolean;
  requireFetchedLeadsCalled: boolean;
  showLeadHistory: boolean;
  allowAutoAnswer: boolean;
  defaultAutoAnswerOn: boolean;
  allowHistoricalDialing: boolean;
  allowAgentStats: boolean;
  allowCampaignStats: boolean;
  allowGateStats: boolean;
  allowChatStats: boolean;
  /**
   * Whether the agent may use Contact Management APIs, including
   * `/api/cm/v1/.../activities`.
   */
  allowContactManagement: boolean;
  /**
   * Account permission (`allow_warm_xfer_on_hold`): put the customer on hold
   * before a warm transfer opens the consult leg.
   */
  allowWarmXferOnHold: boolean;
  /**
   * Account permission (`allow_warm_xfer_auto_unhold`): take the customer off
   * hold again once the agent leaves the consult leg.
   */
  allowWarmXferAutoUnhold: boolean;
  /** Account permission (`enable_agent_assist`) gating the AI Assistant. */
  enableAgentAssist: boolean;
}

interface EvAllowLeadUpdatesByCampaign {}

export interface EvAgentSettings {
  accountId?: any;
  agentId: string;
  agentType: string;
  altDefaultLoginDest: string;
  availableAgentStates: EvAvailableAgentState[];
  callerIds: EvCallerId[];
  callState?: any;
  currentState: string;
  currentStateLabel: string;
  defaultLoginDest: string;
  dialDest: string;
  email: string;
  externalAgentId: string;
  firstName: string;
  guid: string;
  isLoggedIn: boolean;
  isOffhook: boolean;
  isMonitoring: boolean;
  initLoginState: string;
  initLoginStateLabel: string;
  isOutboundPrepay: boolean;
  lastName: string;
  loginDTS: string;
  loginType: string;
  maxBreakTime: string;
  maxLunchTime: string;
  onCall: boolean;
  onManualOutdial: boolean;
  outboundManualDefaultRingtime: string;
  pendingCallbacks: any[];
  pendingDialGroupChange: number;
  phoneLoginPin: string;
  realAgentType: string;
  supervisors: any[];
  totalCalls: number;
  transferNumber: string;
  updateDGFromAdminUI: boolean;
  updateLoginMode: boolean;
  username: string;
  wasMonitoring: boolean;
  agentPassword: string;
  autoAnswerCalls: boolean;
}

export interface EvCallerId {
  description: string;
  number: string;
}

export interface EvAvailableAgentState {
  agentAuxState: string;
  agentState: string;
  rank: string;
}

export interface RawEvAuthenticateAgentWithRcAccessTokenRes {
  platformId: string;
  rcAccessToken: string;
  tokenType: string;
  authType: string;
  accessToken: string;
  refreshToken?: any;
  socketUrl: string;
  socketPort: number;
  agents: RawEvAgent[];
  // Authenticate Error
  message?: string;
  type?: string;
}

export type EvAuthenticateAgentWithRcAccessTokenRes = Omit<
  RawEvAuthenticateAgentWithRcAccessTokenRes,
  'agents'
> & {
  agents: EvAgents;
};

export interface EvAuthenticateAgentWithEngageAccessTokenRes {
  platformId: string;
  tokenType: string;
  engageAccessToken: string;
  authType: string;
  accessToken: string;
  refreshToken: null;
  socketUrl: string;
  socketPort: number;
  agents: RawEvAgent[];
}

export type EvAgent = Omit<RawEvAgent, 'agentType'> & {
  agentType: AgentTypesType;
};

export type EvAgents = EvAgent[];

export interface RawEvAgent {
  agentId: string;
  firstName: string;
  lastName: string;
  email?: any;
  username: string;
  agentType: OriginAgentTypesType;
  rcUserId: number;
  accountId: string;
  accountName: string;
  agentGroupId?: any;
  externalAgentId?: any;
  location?: any;
  team?: any;
  allowLoginControl: boolean;
  allowLoginUpdates: boolean;
  password?: any;
  agentRank?: any;
  initLoginBaseState?: any;
  ghostRnaAction?: any;
  enableSoftphone?: any;
  altDefaultLoginDest?: any;
  phoneLoginPin?: any;
  manualOutboundDefaultCallerId?: any;
  directAgentExtension?: any;
  maxChats?: any;
}

export interface EvDispositionCallOptions {
  uii: string;
  dispId: string;
  notes?: string;
  callback?: boolean;
  callbackDTS?: string;
  contactForwardNumber?: string;
  survey?: string;
  externId?: string;
  leadId?: string;
  requestId?: string;
}

export interface EvDispositionSummaryPhaseResponse {
  final: boolean;
  type: 'SUMMARY';
  status: 'OK'
  summary: string; // summary phase string
  segmentId: number;
  sequenceNo: string;
}

export interface EvDispositionSummaryErrorResponse {
  uii: string;
  requestMessageId: string;
  status: 'ERROR';
  detail: string;
  segmentId: string;
  sessionId: string;
  errorCode: string;
  errorMessage: string;
}

export interface EvLogoutAgentResponse {
  detail: string;
  message: string;
  status: string;
}

export interface EvDirectAgentListItem {
  agentAuxState: string;
  agentId: string;
  agentState: string;
  available: boolean;
  firstName: string;
  lastName: string;
  pendingDisp: boolean;
  stateDuration: string;
  username: string;
}

export interface EvDirectAgentListResponse {
  status: 'true' | 'false';
  message: EvOkFail;
  agents: EvDirectAgentListItem[];
}

export type EvDirectAgentTransferResponse = {
  message: string;
  detail: string;
  status: DirectTransferStatues;
  type: DirectTransferTypes;
};

export interface EvTransferCallResponse {
  agentId: string;
  uii: string;
  sessionId: string;
  status: EvOkFail;
  dialDest: string;
  message: string;
  detail: string;
}

export interface RecordResponse {
  message: string;
  detail: string;
  status: 'FAILURE' | 'OK';
  uii: string;
  state: 'RECORDING' | 'STOPPED';
}

export interface PauseRecordResponse {
  detail: string;
  message: string;
  pause: string;
  state: 'RECORDING' | 'PAUSED';
  status: 'OK' | 'FAILURE';
  uii: string;
}

export type PauseRecord = Omit<PauseRecordResponse, 'pause'> & {
  pause: number;
};

export interface EvColdTransferCallResponse extends EvTransferCallResponse {}

export interface EvWarmTransferCallResponse extends EvTransferCallResponse {}

export interface EvColdTransferIntlCallResponse
  extends EvTransferCallResponse {}

export interface EvWarmTransferIntlCallResponse
  extends EvTransferCallResponse {}

export interface EvRequeueCallResponse {
  message: string;
  detail: string;
  status: EvOkFail;
  agentId: string;
  uii: string;
  queueId: string;
}

export interface EvConfigureAgentOptions {
  dialDest: string;
  queueIds?: string[];
  chatIds?: string[];
  skillProfileId?: string;
  dialGroupId?: string;
  updateFromAdminUI?: boolean;
  isForce?: boolean;
  loginType?: string;
  callback?(): void;
}

export interface EvAgentState {
  agentAuxState: string;
  agentState: string;
}

export interface EvDispositionManualPassOptions {
  dispId: string;
  notes: string;
  callbackDTS?: string;
  leadId?: string;
  requestId?: string;
  externId?: string;
}

export interface EvAgentStateResponse {
  message: string;
  detail: string;
  status: string;
  agentId: string;
  previousState: string;
  currentState: string;
  previousAuxState: string;
  currentAuxState: string;
}

export interface EvAgentScriptResult {
  call: EvBaseCall;
  lead: {};
  model: EvAgentScriptResultModel;
  renderFormValid: boolean;
  scriptComplete: boolean;
}

export interface EvAgentScriptResultModel {
  [callId: string]: { value: any; leadField: string };
}

export interface EvCallDispositionItem {
  dispositionId: string;
  notes: string;
}

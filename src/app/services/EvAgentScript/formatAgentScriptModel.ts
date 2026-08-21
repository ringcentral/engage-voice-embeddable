import { clone } from 'ramda';

import type {
  EvAgentSettings,
  EvBaseCall,
  EvDisposition,
} from '../EvClient/interfaces';

/**
 * The `{{model.call.*}}` namespace: read-only call facts the script author can
 * interpolate. Field names are the renderer's contract, so they mirror the EAG
 * app's `ScriptFormatSvc.formatData` rather than this project's own naming.
 */
export interface EvAgentScriptModelCall {
  uii: string;
  ani: string;
  aniE164: string;
  dnis: string;
  dnisE164: string;
  dispositions: EvDisposition[];
  baggage: {};
  agentExternId: string;
  agentFirstName: string;
  agentLastName: string;
  agentType: string;
  agentEmail: string;
  agentUsername: string;
  campaignName: string;
  campaignId: string;
  queueName: string;
  queueId: string;
  chatQueueName: string;
}

/**
 * The root object the renderer interpolates `{{model.*}}` tags against.
 *
 * `model` is the mutable answer bag the agent fills in; `call` and `lead` are
 * read-only context we inject.
 */
export interface EvAgentScriptModel {
  model: {};
  lead: {};
  call: EvAgentScriptModelCall;
}

const asString = (value: unknown): string =>
  value === null || value === undefined ? '' : `${value}`;

/**
 * Project a call onto the renderer's interpolation model.
 *
 * The renderer sets its interpolation root to whatever `callbacks.getScriptData()`
 * resolves with, so a tag like `{{model.call.ani}}` reads exactly `call.ani` of
 * the returned object. Every key is populated even when the source is missing:
 * AngularJS renders an unresolvable expression as an empty string, so a missing
 * key and an empty value look identical in the script, but a missing *parent*
 * object makes the renderer's own code throw.
 *
 * Deliberately omitted: `enableConversationSummary`. It gates the renderer's AI
 * summary UI, which calls `requestGenerateSummary`/`requestDispositionSummary` —
 * callbacks this host does not implement.
 */
export function formatAgentScriptModel(
  call?: EvBaseCall | null,
  agentSettings?: EvAgentSettings | null,
): EvAgentScriptModel {
  const queue = call?.queue;
  const isCampaign = Boolean(queue?.isCampaign);
  const queueName = asString(queue?.name);
  const queueId = asString(queue?.number);
  const customerIdentity = call?.segmentContext?.customerIdentity;

  return clone({
    // Answers from an earlier pass on this call, so a continued or requeued
    // script reopens with what the agent already entered.
    model: call?.scriptResponse || {},
    lead: call?.lead || {},
    call: {
      uii: asString(call?.uii),
      ani: asString(call?.ani || customerIdentity?.ani),
      aniE164: asString(call?.aniE164 || customerIdentity?.aniE164),
      dnis: asString(call?.dnis),
      dnisE164: asString(call?.dnisE164),
      dispositions: call?.outdialDispositions?.dispositions || [],
      baggage: call?.baggage || {},
      agentExternId: asString(agentSettings?.externalAgentId),
      agentFirstName: asString(agentSettings?.firstName),
      agentLastName: asString(agentSettings?.lastName),
      agentType: asString(agentSettings?.agentType),
      agentEmail: asString(agentSettings?.email),
      agentUsername: asString(agentSettings?.username),
      // A queue is either a campaign or an inbound queue, never both, so only
      // one of these pairs carries data for any given call.
      campaignName: isCampaign ? queueName : '',
      campaignId: isCampaign ? queueId : '',
      queueName: isCampaign ? '' : queueName,
      queueId: isCampaign ? '' : queueId,
      // Chat is not routed through this host, but the tag has to resolve to an
      // empty string rather than stay undefined.
      chatQueueName: '',
    },
  });
}

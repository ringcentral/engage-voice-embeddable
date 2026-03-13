import type { EvBaseCall } from '../app/services/EvClient/interfaces';
import type { EvCallData } from '../app/services/EvCallMonitor/EvCallMonitor.interface';

export interface FormattedEvCall {
  id: string;
  direction: 'INBOUND' | 'OUTBOUND';
  from: {
    phoneNumber: string;
    name?: string;
  };
  to: {
    phoneNumber: string;
    name?: string;
  };
  telephonyStatus: 'CallRing' | 'CallConnected';
  sessionId: string | undefined;
  telephonySessionId: string;
  partyId: string;
  startTime: number | undefined;
  offset: number;
  fromMatches: any[];
  toMatches: any[];
  activityMatches: any[];
  recordingUrl?: string;
}

/**
 * Format a raw EV call into the standardized call log shape for ring events.
 * Used for onRingCall adapter notifications (before contact matching completes).
 */
export function formatEvCallForRing(call: EvBaseCall): FormattedEvCall {
  const isOutbound = call.callType === 'OUTBOUND';
  const fromNumber = isOutbound ? call.dnis : call.ani;
  const toNumber = isOutbound ? call.ani : call.dnis;
  return {
    id: call.uii,
    direction: call.callType,
    from: {
      phoneNumber: fromNumber,
    },
    to: {
      phoneNumber: toNumber,
    },
    telephonyStatus: 'CallRing',
    sessionId: call.session?.sessionId,
    telephonySessionId: call.uii,
    partyId: call.agentId,
    startTime: call.queueDts ? new Date(call.queueDts).getTime() : undefined,
    offset: 0,
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
  };
}

/**
 * Format a raw EV call into the standardized call log shape for connected/ended events.
 * Includes contact match name and recording URL when available.
 */
export function formatEvCallForConnected(call: EvCallData): FormattedEvCall {
  const isOutbound = call.callType === 'OUTBOUND';
  const contactMatches: any[] = call.contactMatches || [];
  const name = contactMatches[0]?.name;
  const fromNumber = isOutbound ? call.dnis : call.ani;
  const toNumber = isOutbound ? call.ani : call.dnis;
  return {
    id: call.uii,
    direction: call.callType,
    from: {
      phoneNumber: fromNumber,
      name: !isOutbound ? name : fromNumber,
    },
    to: {
      phoneNumber: toNumber,
      name: isOutbound ? name : toNumber,
    },
    telephonyStatus: 'CallConnected',
    sessionId: call.session?.sessionId,
    telephonySessionId: call.uii,
    partyId: call.agentId,
    startTime: call.queueDts ? new Date(call.queueDts).getTime() : undefined,
    offset: 0,
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
    recordingUrl: call.session?.recordingUrl,
  };
}

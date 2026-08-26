import type {
  EvBaseCall,
  EvEndedCall,
} from '../app/services/EvClient/interfaces';
import type { EvCallData } from '../app/services/EvCallMonitor/EvCallMonitor.interface';
import { getCallAni, getCallDnis } from './getEvCallNumbers';
import { getEvServerTimestamp } from './getEvServerTimestamp';

function getStartTime(queueDts?: string): number | undefined {
  return queueDts ? getEvServerTimestamp(queueDts) : undefined;
}

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
  duration?: number;
  offset: number;
  fromMatches: any[];
  toMatches: any[];
  activityMatches: any[];
  recordingUrl?: string;
  segmentId?: string;
}

/**
 * Format a raw EV call into the standardized call log shape for ring events.
 * Used for onRingCall adapter notifications (before contact matching completes).
 */
export function formatEvCallForRing(call: EvBaseCall): FormattedEvCall {
  const isOutbound = call.callType === 'OUTBOUND';
  const ani = getCallAni(call);
  const dnis = getCallDnis(call);
  const fromNumber = isOutbound ? dnis : ani;
  const toNumber = isOutbound ? ani : dnis;
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
    startTime: getStartTime(call.queueDts),
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
  const ani = getCallAni(call);
  const dnis = getCallDnis(call);
  const fromNumber = isOutbound ? dnis : ani;
  const toNumber = isOutbound ? ani : dnis;
  const endedCall = call.endedCall as unknown as EvEndedCall | undefined;
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
    startTime: getStartTime(call.queueDts ?? endedCall?.callDts),
    duration: endedCall?.duration ? Number.parseInt(endedCall.duration, 10) : undefined,
    offset: 0,
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
    recordingUrl: endedCall?.recordingUrl ?? call.session?.recordingUrl,
    segmentId: call.session?.segmentId ?? call.segmentContext?.segmentId,
  };
}

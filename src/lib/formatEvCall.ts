import { EvCallData } from '@ringcentral-integration/engage-voice-widgets/interfaces';

export function formatEVCall(evCall: EvCallData) {
  const { callType, dnis, uii, ani, queueDts, agentId, message } = evCall;
  const fromNumber = callType === 'OUTBOUND' ? dnis : ani;
  const toNumber = callType === 'OUTBOUND' ? ani : dnis;
  const status = message === 'Received NEW-CALL notification' ? 'CallRing' : 'CallConnected';
  return {
    id: uii,
    direction: callType,
    from: {
      phoneNumber: fromNumber,
    },
    to: {
      phoneNumber: toNumber,
    },
    telephonyStatus: status,
    sessionId: evCall.session && evCall.session.sessionId,
    telephonySessionId: uii,
    partyId: agentId,
    startTime: new Date(queueDts).getTime(),
    offset: 0,
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
  }
}

import { EvCall } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvData.interface';

function getNameFromContactMapping(contactMapping: any, phoneNumber: string) {
  if (contactMapping[phoneNumber] && contactMapping[phoneNumber].length > 0) {
    return contactMapping[phoneNumber][0].name;
  }
  return phoneNumber;
}

export function formatCallFromEVCall(
  rawCall: EvCall,
  contactMapping: any = {},
) {
  const { callType, dnis, uii, ani, queueDts, agentId } = rawCall;

  // TODO confirm about  dialDest or dnis?
  const fromNumber = callType === 'OUTBOUND' ? dnis : ani;
  // TODO confirm about  dialDest or dnis?
  const toNumber = callType === 'OUTBOUND' ? ani : dnis;

  return {
    id: uii,
    direction: callType,
    from: {
      phoneNumber: fromNumber,
      name: getNameFromContactMapping(contactMapping, fromNumber),
    },
    to: {
      phoneNumber: toNumber,
      name: getNameFromContactMapping(contactMapping, toNumber),
    },
    telephonyStatus: 'CallConnected', // TODO handle with call state and agent state
    sessionId: rawCall.session.sessionId,
    telephonySessionId: uii,
    partyId: agentId,
    startTime: new Date(queueDts).getTime(),
    offset: 0,
    fromMatches: contactMapping[fromNumber],
    toMatches: contactMapping[toNumber],
    activityMatches: [],
  };
}

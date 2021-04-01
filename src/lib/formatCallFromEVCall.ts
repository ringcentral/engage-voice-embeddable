import { keys, reduce } from 'ramda';

import { EvCallData } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvData.interface';

function getNameFromContactMapping(contactMatches: any[], phoneNumber: string) {
  // const result = contactMatches.find(contactMatch => contactMatch.)
  // if (contactMapping[phoneNumber] && contactMapping[phoneNumber].length > 0) {
  //   return contactMapping[phoneNumber][0].name;
  // }
  // return phoneNumber;
  return phoneNumber;
}

export function formatCallFromEVCall(
  rawCall: EvCallData,
  contactMatches: any = [],
) {
  const { callType, dnis, uii, ani, queueDts, agentId, baggage } = rawCall;

  // TODO confirm about  dialDest or dnis?
  const fromNumber = callType === 'OUTBOUND' ? dnis : ani;
  // TODO confirm about  dialDest or dnis?
  const toNumber = callType === 'OUTBOUND' ? ani : dnis;
  const ivrString = reduce(
    (prev, curr) => {
      if (/^ivr./gi.test(curr)) {
        prev.push(`${curr}: ${baggage[curr]};`);
      }
      return prev;
    },
    [],
    keys(baggage),
  ).join('\r\n');
  return {
    id: uii,
    direction: callType,
    from: {
      phoneNumber: fromNumber,
      name: getNameFromContactMapping(contactMatches, fromNumber),
    },
    to: {
      phoneNumber: toNumber,
      name: getNameFromContactMapping(contactMatches, toNumber),
    },
    telephonyStatus: 'CallConnected', // TODO handle with call state and agent state
    sessionId: rawCall.session.sessionId,
    telephonySessionId: uii,
    partyId: agentId,
    startTime: new Date(queueDts).getTime(),
    offset: 0,
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
    baggage,
    ivrString: ivrString,
  };
}

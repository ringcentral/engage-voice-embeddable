import { resolveEndedCallSessions } from '../../../../src/app/utils/resolveEndedCallSessions';

const uii = '202609010459092860002229163987';

describe('resolveEndedCallSessions', () => {
  it('uses the session the backend named', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '1' },
        callIds: [`${uii}$1`, `${uii}$2`],
      }),
    ).toEqual(['1']);
  });

  it('trusts a named session the client has not seen', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '3' },
        callIds: [],
      }),
    ).toEqual(['3']);
  });

  it('recovers the session of a reconnect END-CALL that carries none', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '' },
        callIds: [`${uii}$1`],
      }),
    ).toEqual(['1']);
  });

  it('ends every session of the call when none is named', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '' },
        callIds: [`${uii}$1`, `${uii}$2`],
      }),
    ).toEqual(['1', '2']);
  });

  it('leaves other calls alone when no session is named', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '' },
        callIds: ['otherUii$1', `${uii}$2`],
      }),
    ).toEqual(['2']);
  });

  it('does not mistake a ringing placeholder for a session', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '' },
        callIds: [`${uii}$`],
      }),
    ).toEqual([]);
  });

  it('ends nothing when the agent holds no matching call', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii, sessionId: '' },
        callIds: ['otherUii$1'],
      }),
    ).toEqual([]);
  });

  it('ends nothing for a notification with no call to identify', () => {
    expect(
      resolveEndedCallSessions({
        endedCall: { uii: '', sessionId: '' },
        callIds: [`${uii}$1`],
      }),
    ).toEqual([]);
  });
});

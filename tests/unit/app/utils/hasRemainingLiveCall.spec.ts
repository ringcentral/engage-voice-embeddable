import { hasRemainingLiveCall } from '../../../../src/app/utils/hasRemainingLiveCall';

const endedUii = '202609200207140090000123474677';
const nextUii = '202609200207304408010000024767';

describe('hasRemainingLiveCall', () => {
  it('leaves idle available when the last session ended', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '2' },
        callIds: [`${endedUii}$2`],
      }),
    ).toBe(false);
  });

  it('leaves idle available after Presence already dropped the last session', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '2' },
        callIds: [],
      }),
    ).toBe(false);
  });

  it('keeps the next call when it arrived before this END-CALL ran', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '2' },
        callIds: [`${endedUii}$2`, `${nextUii}$2`],
      }),
    ).toBe(true);
  });

  it('keeps the next call after Presence already dropped the ended session', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '2' },
        callIds: [`${nextUii}$2`],
      }),
    ).toBe(true);
  });

  it('keeps a second session of the same call', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '1' },
        callIds: [`${endedUii}$1`, `${endedUii}$2`],
      }),
    ).toBe(true);
  });

  it('ends every recovered session of a reconnect END-CALL with no session', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '' },
        callIds: [`${endedUii}$1`, `${endedUii}$2`],
      }),
    ).toBe(false);
  });

  it('leaves a different call alone when no session is named', () => {
    expect(
      hasRemainingLiveCall({
        endedCall: { uii: endedUii, sessionId: '' },
        callIds: [`${endedUii}$2`, `${nextUii}$2`],
      }),
    ).toBe(true);
  });
});

import {
  formatEvCallForConnected,
  formatEvCallForRing,
} from './formatEvCall';

describe('formatEvCallForConnected', () => {
  const call = {
    uii: 'uii',
    agentId: 'agent-id',
    callType: 'OUTBOUND',
    ani: '16505550100',
    dnis: '16505550200',
    queueDts: '2026-07-13 10:00:00',
    contactMatches: [],
    session: {
      sessionId: 'session-id',
      recordingUrl: 'session-recording-url',
    },
  } as any;

  it('prefers the E.164 numbers when the notification carries them', () => {
    const result = formatEvCallForConnected({
      ...call,
      aniE164: '+16505550100',
      dnisE164: '+16505550200',
    });

    // OUTBOUND, so from is the DNIS and to is the ANI.
    expect(result.from.phoneNumber).toBe('+16505550200');
    expect(result.to.phoneNumber).toBe('+16505550100');
  });

  it('falls back to ani/dnis when no E.164 form is present', () => {
    const result = formatEvCallForRing(call);

    expect(result.from.phoneNumber).toBe('16505550200');
    expect(result.to.phoneNumber).toBe('16505550100');
  });

  it('uses the recording URL from ended-call data', () => {
    const result = formatEvCallForConnected({
      ...call,
      endedCall: {
        recordingUrl: 'ended-recording-url',
      },
    });

    expect(result.recordingUrl).toBe('ended-recording-url');
    expect(result).not.toHaveProperty('endedCall');
  });

  it('uses the session recording URL by default', () => {
    const result = formatEvCallForConnected(call);

    expect(result.recordingUrl).toBe('session-recording-url');
  });

  it.each([
    ['2026-01-15 10:00:00', '2026-01-15T15:00:00.000Z'],
    ['2026-07-13 10:00:00', '2026-07-13T14:00:00.000Z'],
  ])(
    'interprets queueDts %s in America/New_York',
    (queueDts, expectedUtcTime) => {
      const result = formatEvCallForConnected({ ...call, queueDts });

      expect(result.startTime).toBe(Date.parse(expectedUtcTime));
    },
  );

  it('uses the server timezone for ring events', () => {
    const result = formatEvCallForRing(call);

    expect(result.startTime).toBe(Date.parse('2026-07-13T14:00:00.000Z'));
  });
});

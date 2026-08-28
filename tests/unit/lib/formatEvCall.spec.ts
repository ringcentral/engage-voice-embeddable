import {
  formatEvCallForConnected,
  formatEvCallForRing,
  formatEvCallFromHistory,
} from 'src/lib/formatEvCall';
import { callDirection } from 'src/enums';

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

describe('formatEvCallFromHistory', () => {
  const historyCall = {
    id: 'seg-1$$uii-1',
    direction: callDirection.outbound,
    agent: { name: '', phoneNumber: '(650) 555-0200' },
    contact: { name: 'Jane Doe', phoneNumber: '(650) 555-0100' },
    from: { name: '', phoneNumber: '(650) 555-0200' },
    to: { name: 'Jane Doe', phoneNumber: '(650) 555-0100' },
    fromName: '(650) 555-0200',
    toName: 'Jane Doe',
    fromMatches: [],
    toMatches: [],
    activityMatches: [],
    startTime: Date.parse('2026-07-13T14:00:00.000Z'),
    uii: 'uii-1',
    segmentId: 'seg-1',
    durationMs: 65000,
    recordingUrl: 'https://rec/1.wav',
    dialableNumber: '+16505550100',
    dnis: '+16505550200',
  };

  it('maps a history row onto the local logCall call shape', () => {
    const result = formatEvCallFromHistory(historyCall as any, 'agent-1');
    expect(result).toEqual({
      id: 'uii-1',
      direction: 'OUTBOUND',
      from: {
        phoneNumber: '+16505550200',
        name: '+16505550200',
      },
      to: {
        phoneNumber: '+16505550100',
        name: 'Jane Doe',
      },
      telephonyStatus: 'CallConnected',
      sessionId: 'seg-1',
      telephonySessionId: 'uii-1',
      partyId: 'agent-1',
      startTime: Date.parse('2026-07-13T14:00:00.000Z'),
      duration: 65,
      offset: 0,
      fromMatches: [],
      toMatches: [],
      activityMatches: [],
      recordingUrl: 'https://rec/1.wav',
      segmentId: 'seg-1',
    });
  });

  it('uses raw dialableNumber and dnis, not display-formatted from/to', () => {
    const result = formatEvCallFromHistory(historyCall as any, 'agent-1');
    expect(result?.from.phoneNumber).toBe('+16505550200');
    expect(result?.to.phoneNumber).toBe('+16505550100');
    expect(result?.from.phoneNumber).not.toBe(historyCall.from.phoneNumber);
    expect(result?.to.phoneNumber).not.toBe(historyCall.to.phoneNumber);
  });

  it('strips the @RC_EXT suffix from the raw contact number', () => {
    const result = formatEvCallFromHistory(
      {
        ...historyCall,
        dialableNumber: '122@RC_EXT',
        dnis: '18005550100',
      } as any,
      'agent-1',
    );
    expect(result?.to.phoneNumber).toBe('122');
  });

  it('returns null when the history row has no uii', () => {
    expect(
      formatEvCallFromHistory(
        { ...historyCall, uii: undefined } as any,
        'agent-1',
      ),
    ).toBeNull();
  });

  it('maps inbound history rows to INBOUND', () => {
    const result = formatEvCallFromHistory(
      {
        ...historyCall,
        direction: callDirection.inbound,
        from: { name: 'Jane Doe', phoneNumber: '(650) 555-0100' },
        to: { name: '', phoneNumber: '(650) 555-0200' },
        fromName: 'Jane Doe',
        toName: '(650) 555-0200',
      } as any,
      'agent-1',
    );
    expect(result?.direction).toBe('INBOUND');
    expect(result?.from.phoneNumber).toBe('+16505550100');
    expect(result?.to.phoneNumber).toBe('+16505550200');
    expect(result?.from.name).toBe('Jane Doe');
    expect(result?.to.name).toBe('+16505550200');
  });
});

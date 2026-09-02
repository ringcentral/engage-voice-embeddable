import {
  canRejoinEvSession,
  SESSION_REJOIN_MAX_AGE_MS,
} from '../../../../src/app/utils/canRejoinEvSession';

const NOW = 1_700_000_000_000;

const storedSession = {
  agentId: '42',
  hashCode: 'hash-abc',
  savedAt: NOW - 1000,
};

describe('canRejoinEvSession', () => {
  it('rejoins a fresh session belonging to the same agent', () => {
    expect(
      canRejoinEvSession({ stored: storedSession, agentId: '42', now: NOW }),
    ).toEqual({ canRejoin: true, reason: 'rejoinable' });
  });

  it('compares agent ids across string and number forms', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, agentId: '42' },
      agentId: 42 as unknown as string,
      now: NOW,
    });
    expect(result.canRejoin).toBe(true);
  });

  it('refuses when nothing was stored', () => {
    expect(
      canRejoinEvSession({ stored: null, agentId: '42', now: NOW }),
    ).toEqual({ canRejoin: false, reason: 'noStoredSession' });
  });

  it('refuses when the stored hash code is empty', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, hashCode: '' },
      agentId: '42',
      now: NOW,
    });
    expect(result).toEqual({ canRejoin: false, reason: 'noStoredSession' });
  });

  it('refuses when there is no agent to rejoin as', () => {
    expect(
      canRejoinEvSession({ stored: storedSession, agentId: '', now: NOW }),
    ).toEqual({ canRejoin: false, reason: 'noAgentId' });
  });

  // Reusing another agent's hash code would attach this browser to the wrong
  // server session.
  it('refuses a session belonging to a different agent', () => {
    expect(
      canRejoinEvSession({ stored: storedSession, agentId: '99', now: NOW }),
    ).toEqual({ canRejoin: false, reason: 'agentMismatch' });
  });

  it('refuses a session older than the rejoin window', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, savedAt: NOW - SESSION_REJOIN_MAX_AGE_MS - 1 },
      agentId: '42',
      now: NOW,
    });
    expect(result).toEqual({ canRejoin: false, reason: 'sessionExpired' });
  });

  it('accepts a session exactly at the window boundary', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, savedAt: NOW - SESSION_REJOIN_MAX_AGE_MS },
      agentId: '42',
      now: NOW,
    });
    expect(result.canRejoin).toBe(true);
  });

  it('honours a caller-supplied window', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, savedAt: NOW - 5000 },
      agentId: '42',
      now: NOW,
      maxAgeMs: 1000,
    });
    expect(result.reason).toBe('sessionExpired');
  });

  it('refuses a timestamp from the future', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, savedAt: NOW + 5000 },
      agentId: '42',
      now: NOW,
    });
    expect(result).toEqual({ canRejoin: false, reason: 'invalidTimestamp' });
  });

  it('refuses a session with no recorded timestamp', () => {
    const result = canRejoinEvSession({
      stored: { ...storedSession, savedAt: 0 },
      agentId: '42',
      now: NOW,
    });
    expect(result).toEqual({ canRejoin: false, reason: 'sessionExpired' });
  });
});

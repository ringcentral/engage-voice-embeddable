import {
  ICE_RESTART_MAX_ATTEMPTS,
  isHealthyIceState,
  planIceRestart,
} from '../../../../src/app/utils/planIceRestart';
import type { IceRestartInputs } from '../../../../src/app/utils/planIceRestart';

const buildInputs = (
  overrides: Partial<IceRestartInputs> = {},
): IceRestartInputs => ({
  iceConnectionState: 'disconnected',
  attempts: 0,
  hasSession: true,
  isSignalingConnected: true,
  ...overrides,
});

describe('planIceRestart', () => {
  it('repairs a stalled media path while the dialog is still alive', () => {
    expect(planIceRestart(buildInputs())).toEqual({
      shouldRestart: true,
      reason: 'restartIce',
    });
  });

  it.each(['connected', 'completed', 'checking', 'new', 'closed'])(
    'leaves a %s connection alone',
    (iceConnectionState) => {
      expect(planIceRestart(buildInputs({ iceConnectionState }))).toEqual({
        shouldRestart: false,
        reason: 'notDisconnected',
      });
    },
  );

  it('does not act on failed, where the softphone has already ended the call', () => {
    expect(
      planIceRestart(buildInputs({ iceConnectionState: 'failed' })),
    ).toEqual({ shouldRestart: false, reason: 'notDisconnected' });
  });

  it('skips the repair when signaling cannot carry the re-INVITE', () => {
    expect(
      planIceRestart(buildInputs({ isSignalingConnected: false })),
    ).toEqual({ shouldRestart: false, reason: 'signalingDown' });
  });

  it('skips the repair when no dialog remains', () => {
    expect(planIceRestart(buildInputs({ hasSession: false }))).toEqual({
      shouldRestart: false,
      reason: 'noSession',
    });
  });

  it('stops retrying once the attempt budget is spent', () => {
    expect(
      planIceRestart(buildInputs({ attempts: ICE_RESTART_MAX_ATTEMPTS })),
    ).toEqual({ shouldRestart: false, reason: 'attemptsExhausted' });
  });

  it('still retries while attempts remain', () => {
    expect(
      planIceRestart(buildInputs({ attempts: ICE_RESTART_MAX_ATTEMPTS - 1 }))
        .shouldRestart,
    ).toBe(true);
  });

  it('honours a caller supplied budget', () => {
    expect(
      planIceRestart(buildInputs({ attempts: 1, maxAttempts: 1 })).reason,
    ).toBe('attemptsExhausted');
  });
});

describe('isHealthyIceState', () => {
  it.each(['connected', 'completed'])('treats %s as healthy', (state) => {
    expect(isHealthyIceState(state)).toBe(true);
  });

  it.each(['disconnected', 'failed', 'checking', 'new', 'closed'])(
    'treats %s as not healthy',
    (state) => {
      expect(isHealthyIceState(state)).toBe(false);
    },
  );
});

import {
  shouldRecycleEvSocket,
  SOCKET_STALE_ALIVE_MS,
  SOCKET_RECYCLE_COOLDOWN_MS,
  ONLINE_ECHO_GRACE_MS,
} from '../../../../src/app/utils/shouldRecycleEvSocket';
import type { RecycleEvSocketInputs } from '../../../../src/app/utils/shouldRecycleEvSocket';

const NOW = 1_800_000_000_000;

const zombie: RecycleEvSocketInputs = {
  isLoggedIn: true,
  socketReadyState: 1,
  lastAlive: NOW - SOCKET_STALE_ALIVE_MS - 1000,
  now: NOW,
  lastRecycleAt: 0,
};

describe('shouldRecycleEvSocket', () => {
  it('recycles an open socket whose echoes have gone silent', () => {
    expect(shouldRecycleEvSocket(zombie)).toEqual({
      shouldRecycle: true,
      reason: 'staleAlive',
    });
  });

  it('leaves a healthy socket alone', () => {
    const plan = shouldRecycleEvSocket({ ...zombie, lastAlive: NOW - 500 });
    expect(plan).toEqual({ shouldRecycle: false, reason: 'alive' });
  });

  it('treats staleness exactly at the threshold as still alive', () => {
    const plan = shouldRecycleEvSocket({
      ...zombie,
      lastAlive: NOW - SOCKET_STALE_ALIVE_MS,
    });
    expect(plan.shouldRecycle).toBe(false);
    expect(plan.reason).toBe('alive');
  });

  it('does nothing while the agent is not logged in', () => {
    const plan = shouldRecycleEvSocket({ ...zombie, isLoggedIn: false });
    expect(plan).toEqual({ shouldRecycle: false, reason: 'notLoggedIn' });
  });

  it.each([null, 0, 2, 3])(
    'leaves a socket in readyState %p to the SDK',
    (socketReadyState) => {
      const plan = shouldRecycleEvSocket({ ...zombie, socketReadyState });
      expect(plan).toEqual({ shouldRecycle: false, reason: 'socketNotOpen' });
    },
  );

  it('does not judge a session that never received an echo', () => {
    const plan = shouldRecycleEvSocket({ ...zombie, lastAlive: null });
    expect(plan).toEqual({ shouldRecycle: false, reason: 'noAliveSignal' });
  });

  // after a forced close, lastAlive stays stale until the next session's
  // first echo; without the cooldown the reopened socket would be closed
  // again immediately
  it('does not recycle again inside the cooldown window', () => {
    const plan = shouldRecycleEvSocket({
      ...zombie,
      lastRecycleAt: NOW - SOCKET_RECYCLE_COOLDOWN_MS + 1000,
    });
    expect(plan).toEqual({ shouldRecycle: false, reason: 'cooldown' });
  });

  it('recycles again once the cooldown has passed', () => {
    const plan = shouldRecycleEvSocket({
      ...zombie,
      lastRecycleAt: NOW - SOCKET_RECYCLE_COOLDOWN_MS,
    });
    expect(plan.shouldRecycle).toBe(true);
  });

  it('honours caller-supplied thresholds', () => {
    const plan = shouldRecycleEvSocket({
      ...zombie,
      lastAlive: NOW - 6000,
      staleMs: 5000,
    });
    expect(plan.shouldRecycle).toBe(true);
  });

  describe('with a browser-witnessed network drop', () => {
    // staleness alone would still say "alive" in all of these
    const freshish = {
      ...zombie,
      lastAlive: NOW - 12_000,
    };

    it('condemns the socket once connectivity is back and no echo followed the drop', () => {
      const plan = shouldRecycleEvSocket({
        ...freshish,
        networkDropAt: NOW - 10_000,
        networkOnlineAt: NOW - ONLINE_ECHO_GRACE_MS,
      });
      expect(plan).toEqual({
        shouldRecycle: true,
        reason: 'noEchoSinceNetworkDrop',
      });
    });

    it('waits out the echo grace after coming back online', () => {
      const plan = shouldRecycleEvSocket({
        ...freshish,
        networkDropAt: NOW - 10_000,
        networkOnlineAt: NOW - ONLINE_ECHO_GRACE_MS + 1000,
      });
      expect(plan).toEqual({ shouldRecycle: false, reason: 'alive' });
    });

    it('trusts an echo that arrived after the drop over the drop itself', () => {
      const plan = shouldRecycleEvSocket({
        ...freshish,
        lastAlive: NOW - 2000,
        networkDropAt: NOW - 10_000,
        networkOnlineAt: NOW - ONLINE_ECHO_GRACE_MS,
      });
      expect(plan).toEqual({ shouldRecycle: false, reason: 'alive' });
    });

    it('does nothing while still offline', () => {
      const plan = shouldRecycleEvSocket({
        ...freshish,
        networkDropAt: NOW - 10_000,
        networkOnlineAt: null,
      });
      expect(plan).toEqual({ shouldRecycle: false, reason: 'alive' });
    });

    it('still respects the recycle cooldown', () => {
      const plan = shouldRecycleEvSocket({
        ...freshish,
        networkDropAt: NOW - 10_000,
        networkOnlineAt: NOW - ONLINE_ECHO_GRACE_MS,
        lastRecycleAt: NOW - 1000,
      });
      expect(plan).toEqual({ shouldRecycle: false, reason: 'cooldown' });
    });

    it('prefers the plain staleness reason when both conditions hold', () => {
      const plan = shouldRecycleEvSocket({
        ...zombie,
        networkDropAt: NOW - SOCKET_STALE_ALIVE_MS,
        networkOnlineAt: NOW - ONLINE_ECHO_GRACE_MS,
      });
      expect(plan).toEqual({ shouldRecycle: true, reason: 'staleAlive' });
    });
  });
});

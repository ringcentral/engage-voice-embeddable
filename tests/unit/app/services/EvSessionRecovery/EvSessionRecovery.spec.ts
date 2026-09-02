// The real next-core pulls ESM-only dependencies that the unit jest config
// does not transform; only the decorator shells and the RcModule base are
// needed to exercise this module's logic.
jest.mock('@ringcentral-integration/next-core', () => ({
  injectable: () => (target: any) => target,
  optional: () => () => undefined,
  delegate:
    () =>
      (_target: any, _key: string, descriptor: PropertyDescriptor) =>
        descriptor,
  RcModule: class {
    protected logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  },
  PortManager: class {},
  RouterPlugin: class {},
}));

import { EvSessionRecovery } from 'src/app/services/EvSessionRecovery';
import { EvCallbackTypes } from 'src/app/services/EvClient/enums';

type Listener = (response?: any) => void;

function createDeps() {
  const listeners: Record<string, Listener> = {};
  const evClient = {
    addListener: jest.fn((type: string, listener: Listener) => {
      listeners[type] = listener;
    }),
    getReconnectSnapshot: jest.fn().mockResolvedValue({
      isOnCall: false,
      activeCallUii: '',
      isPendingDisposition: false,
    }),
    getSocketDiagnostics: jest.fn().mockResolvedValue({
      isLoggedIn: false,
      socketReadyState: null,
      lastAlive: null,
      msSinceLastAlive: null,
    }),
    abandonSocket: jest.fn().mockResolvedValue(undefined),
    setAppStatus: jest.fn().mockResolvedValue(undefined),
    loadCurrentCall: jest.fn().mockResolvedValue(undefined),
    forceClearPendingDisposition: jest.fn().mockResolvedValue(undefined),
  };
  const evCall = {
    activityCallId: '',
    setActivityCallId: jest.fn(),
  };
  const evPresence = {
    callIds: [] as string[],
    currentCallUii: '',
    callsMapping: {} as Record<string, unknown>,
  };
  const evWorkingState = {
    isPendingDisposition: false,
    pendingDispositionCallId: '',
    setIsPendingDisposition: jest.fn().mockResolvedValue(undefined),
  };
  const evAuth = {
    refreshEvToken: jest.fn().mockResolvedValue(true),
  };
  const router = { replace: jest.fn() };
  const portManager = { shared: false };
  return {
    listeners,
    evClient,
    evAuth,
    evCall,
    evPresence,
    evWorkingState,
    router,
    portManager,
  };
}

function createRecovery(deps: ReturnType<typeof createDeps>) {
  return new EvSessionRecovery(
    deps.evClient as any,
    deps.evAuth as any,
    deps.evCall as any,
    deps.evPresence as any,
    deps.evWorkingState as any,
    deps.router as any,
    deps.portManager as any,
  );
}

describe('EvSessionRecovery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('reconnect trigger', () => {
    it('reconciles only on a Layer 2 reconnect login response', () => {
      const deps = createDeps();
      const recovery = createRecovery(deps);
      const recoverSession = jest
        .spyOn(recovery, 'recoverSession')
        .mockResolvedValue({ action: 'none', callId: '', reason: 'inSync' });
      const listener = deps.listeners[EvCallbackTypes.LOGIN];
      expect(listener).toBeDefined();

      // a fresh or update login carries no server session state
      listener({ status: 'SUCCESS' });
      listener(undefined);
      // a failed login has nothing to reconcile against either
      listener({ status: 'FAILURE', message: 'nope' });
      expect(recoverSession).not.toHaveBeenCalled();

      listener({ status: 'SUCCESS', isReconnect: true });
      expect(recoverSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('recoverSession', () => {
    it('does nothing when server and client agree', async () => {
      const deps = createDeps();
      const recovery = createRecovery(deps);
      const plan = await recovery.recoverSession();
      expect(plan.action).toBe('none');
      expect(deps.evWorkingState.setIsPendingDisposition).not.toHaveBeenCalled();
      expect(deps.evClient.loadCurrentCall).not.toHaveBeenCalled();
      expect(deps.router.replace).not.toHaveBeenCalled();
    });

    it('renews the Engage token, which may have expired during the outage', async () => {
      const deps = createDeps();
      const recovery = createRecovery(deps);
      await recovery.recoverSession();
      expect(deps.evAuth.refreshEvToken).toHaveBeenCalled();
    });

    it('restores a pending disposition and routes to the disposition page', async () => {
      const deps = createDeps();
      deps.evClient.getReconnectSnapshot.mockResolvedValue({
        isOnCall: false,
        activeCallUii: '',
        isPendingDisposition: true,
      });
      deps.evCall.activityCallId = 'call-9';
      const recovery = createRecovery(deps);

      const plan = await recovery.recoverSession();

      expect(plan.action).toBe('restorePendingDisposition');
      expect(deps.evWorkingState.setIsPendingDisposition).toHaveBeenCalledWith(
        true,
        'call-9',
      );
      expect(deps.router.replace).toHaveBeenCalledWith(
        '/activityCallLog/call-9/disposition',
      );
    });

    it('clears a pending disposition the server has already resolved', async () => {
      const deps = createDeps();
      deps.evWorkingState.isPendingDisposition = true;
      const recovery = createRecovery(deps);

      const plan = await recovery.recoverSession();

      expect(plan.action).toBe('clearPendingDisposition');
      expect(deps.evWorkingState.setIsPendingDisposition).toHaveBeenCalledWith(
        false,
      );
    });

    it('reloads a call the client lost track of', async () => {
      const deps = createDeps();
      deps.evClient.getReconnectSnapshot.mockResolvedValue({
        isOnCall: true,
        activeCallUii: 'uii-7',
        isPendingDisposition: false,
      });
      const recovery = createRecovery(deps);

      const plan = await recovery.recoverSession();

      expect(plan.action).toBe('reloadActiveCall');
      expect(deps.evClient.loadCurrentCall).toHaveBeenCalled();
    });

    it('only cleans up locally on an active-call mismatch, without a second hangup', async () => {
      const deps = createDeps();
      deps.evClient.getReconnectSnapshot.mockResolvedValue({
        isOnCall: true,
        activeCallUii: 'uii-new',
        isPendingDisposition: false,
      });
      deps.evPresence.callIds = ['call-old'];
      deps.evPresence.currentCallUii = 'uii-old';
      deps.evCall.activityCallId = 'call-old';
      const recovery = createRecovery(deps);

      const plan = await recovery.recoverSession();

      expect(plan.action).toBe('forceClearCall');
      // the SDK already hung the stale session up while processing the
      // reconnect response
      expect(deps.evClient.forceClearPendingDisposition).not.toHaveBeenCalled();
      expect(deps.evWorkingState.setIsPendingDisposition).toHaveBeenCalledWith(
        false,
      );
      expect(deps.evCall.setActivityCallId).toHaveBeenCalledWith('');
    });

    it('clears a stale activity pointer when the server has no call', async () => {
      const deps = createDeps();
      deps.evPresence.currentCallUii = 'uii-gone';
      const recovery = createRecovery(deps);

      const plan = await recovery.recoverSession();

      expect(plan.action).toBe('endStaleLocalCall');
      expect(deps.evCall.setActivityCallId).toHaveBeenCalledWith('');
    });
  });

  describe('socket watchdog', () => {
    it('abandons the socket when echoes have gone silent on an open socket', async () => {
      const deps = createDeps();
      deps.evClient.getSocketDiagnostics.mockResolvedValue({
        isLoggedIn: true,
        socketReadyState: 1,
        lastAlive: Date.now() - 60 * 1000,
        msSinceLastAlive: 60 * 1000,
      });
      const recovery = createRecovery(deps);

      await (recovery as any)._checkSocketHealth();

      expect(deps.evClient.abandonSocket).toHaveBeenCalledTimes(1);
      // the banner must flip to "reconnecting" immediately: closing a dead
      // TCP path can take the browser ~20s before CLOSE_SOCKET fires
      expect(deps.evClient.setAppStatus).toHaveBeenCalledWith('RECONNECTING');

      // the reopened socket keeps the stale lastAlive until the next echo;
      // the cooldown keeps the watchdog from closing it again immediately
      await (recovery as any)._checkSocketHealth();
      expect(deps.evClient.abandonSocket).toHaveBeenCalledTimes(1);
    });

    it('leaves a healthy socket alone', async () => {
      const deps = createDeps();
      deps.evClient.getSocketDiagnostics.mockResolvedValue({
        isLoggedIn: true,
        socketReadyState: 1,
        lastAlive: Date.now() - 500,
        msSinceLastAlive: 500,
      });
      const recovery = createRecovery(deps);

      await (recovery as any)._checkSocketHealth();

      expect(deps.evClient.abandonSocket).not.toHaveBeenCalled();
    });

    it('condemns a witnessed network drop without waiting for raw staleness', async () => {
      const deps = createDeps();
      deps.evClient.getSocketDiagnostics.mockResolvedValue({
        isLoggedIn: true,
        socketReadyState: 1,
        // fresh enough that staleness alone would say "alive"
        lastAlive: Date.now() - 12_000,
        msSinceLastAlive: 12_000,
      });
      const recovery = createRecovery(deps);
      (recovery as any)._networkDropAt = Date.now() - 10_000;
      (recovery as any)._networkOnlineAt = Date.now() - 6_000;

      await (recovery as any)._checkSocketHealth();

      expect(deps.evClient.abandonSocket).toHaveBeenCalledTimes(1);
    });

    it('drops the network witness once an echo proves the socket survived', async () => {
      const deps = createDeps();
      deps.evClient.getSocketDiagnostics.mockResolvedValue({
        isLoggedIn: true,
        socketReadyState: 1,
        lastAlive: Date.now() - 1000,
        msSinceLastAlive: 1000,
      });
      const recovery = createRecovery(deps);
      (recovery as any)._networkDropAt = Date.now() - 10_000;
      (recovery as any)._networkOnlineAt = Date.now() - 6_000;

      await (recovery as any)._checkSocketHealth();

      expect(deps.evClient.abandonSocket).not.toHaveBeenCalled();
      expect((recovery as any)._networkDropAt).toBeNull();
    });

    it('leaves an already closed socket to the SDK reconnect loop', async () => {
      const deps = createDeps();
      deps.evClient.getSocketDiagnostics.mockResolvedValue({
        isLoggedIn: true,
        socketReadyState: 3,
        lastAlive: Date.now() - 60 * 1000,
        msSinceLastAlive: 60 * 1000,
      });
      const recovery = createRecovery(deps);

      await (recovery as any)._checkSocketHealth();

      expect(deps.evClient.abandonSocket).not.toHaveBeenCalled();
    });
  });

  describe('forceClearStuckState', () => {
    it('sends the cancelling hangup and resets local state', async () => {
      const deps = createDeps();
      const recovery = createRecovery(deps);

      await recovery.forceClearStuckState();

      expect(deps.evClient.forceClearPendingDisposition).toHaveBeenCalled();
      expect(deps.evWorkingState.setIsPendingDisposition).toHaveBeenCalledWith(
        false,
      );
      expect(deps.evCall.setActivityCallId).toHaveBeenCalledWith('');
    });
  });

  describe('isStuckWithoutCall', () => {
    it('is false while no disposition is pending', () => {
      const deps = createDeps();
      expect(createRecovery(deps).isStuckWithoutCall).toBe(false);
    });

    it('is true when a disposition is pending with no matching local call', () => {
      const deps = createDeps();
      deps.evWorkingState.isPendingDisposition = true;
      deps.evWorkingState.pendingDispositionCallId = 'call-1';
      expect(createRecovery(deps).isStuckWithoutCall).toBe(true);
    });

    it('is false when the pending call still exists locally', () => {
      const deps = createDeps();
      deps.evWorkingState.isPendingDisposition = true;
      deps.evWorkingState.pendingDispositionCallId = 'call-1';
      deps.evPresence.callsMapping = { 'call-1': {} };
      expect(createRecovery(deps).isStuckWithoutCall).toBe(false);
    });
  });
});

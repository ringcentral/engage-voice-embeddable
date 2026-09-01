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
    getSocketDiagnostics: jest.fn().mockResolvedValue({}),
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
  const router = { replace: jest.fn() };
  const portManager = { shared: false };
  return {
    listeners,
    evClient,
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

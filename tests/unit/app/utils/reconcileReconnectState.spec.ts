import {
  reconcileReconnectState,
  reconnectActions,
} from '../../../../src/app/utils/reconcileReconnectState';
import type {
  LocalCallState,
  ReconnectSnapshot,
} from '../../../../src/app/utils/reconcileReconnectState';

const serverIdle: ReconnectSnapshot = {
  isOnCall: false,
  activeCallUii: '',
  isPendingDisposition: false,
};

const clientIdle: LocalCallState = {
  activeCallIds: [],
  activityCallId: '',
  activeCallUii: '',
  isPendingDisposition: false,
};

describe('reconcileReconnectState', () => {
  it('does nothing when both sides agree the agent is idle', () => {
    expect(
      reconcileReconnectState({ snapshot: serverIdle, local: clientIdle }),
    ).toEqual({
      action: reconnectActions.none,
      callId: '',
      reason: 'inSync',
    });
  });

  it('does nothing when both sides agree on the same active call', () => {
    const plan = reconcileReconnectState({
      snapshot: { isOnCall: true, activeCallUii: 'uii-1', isPendingDisposition: false },
      local: {
        ...clientIdle,
        activeCallIds: ['call-1'],
        activityCallId: 'call-1',
        activeCallUii: 'uii-1',
      },
    });
    expect(plan.action).toBe(reconnectActions.none);
  });

  describe('when the server has no call', () => {
    it('ends a call the client still shows, naming the worked-on call', () => {
      const plan = reconcileReconnectState({
        snapshot: serverIdle,
        local: {
          ...clientIdle,
          activeCallIds: ['call-1', 'call-2'],
          activityCallId: 'call-2',
          activeCallUii: 'uii-2',
        },
      });
      expect(plan).toEqual({
        action: reconnectActions.endStaleLocalCall,
        callId: 'call-2',
        reason: 'serverHasNoCall',
      });
    });

    it('falls back to the first active call when none is being worked on', () => {
      const plan = reconcileReconnectState({
        snapshot: serverIdle,
        local: { ...clientIdle, activeCallIds: ['call-1'] },
      });
      expect(plan.action).toBe(reconnectActions.endStaleLocalCall);
      expect(plan.callId).toBe('call-1');
    });

    it('treats a lingering uii with no call ids as a stale local call', () => {
      const plan = reconcileReconnectState({
        snapshot: serverIdle,
        local: { ...clientIdle, activeCallUii: 'uii-1' },
      });
      expect(plan.action).toBe(reconnectActions.endStaleLocalCall);
    });

    it('restores a pending disposition the client is not showing', () => {
      const plan = reconcileReconnectState({
        snapshot: { ...serverIdle, isPendingDisposition: true },
        local: { ...clientIdle, activityCallId: 'call-9' },
      });
      expect(plan).toEqual({
        action: reconnectActions.restorePendingDisposition,
        callId: 'call-9',
        reason: 'serverPendingDisposition',
      });
    });

    it('clears a pending disposition the server has already resolved', () => {
      const plan = reconcileReconnectState({
        snapshot: serverIdle,
        local: { ...clientIdle, isPendingDisposition: true },
      });
      expect(plan).toEqual({
        action: reconnectActions.clearPendingDisposition,
        callId: '',
        reason: 'serverResolvedDisposition',
      });
    });

    it('prefers ending a stale call over restoring a pending disposition', () => {
      const plan = reconcileReconnectState({
        snapshot: { ...serverIdle, isPendingDisposition: true },
        local: { ...clientIdle, activeCallIds: ['call-1'] },
      });
      expect(plan.action).toBe(reconnectActions.endStaleLocalCall);
    });

    it('does nothing when both sides already show a pending disposition', () => {
      const plan = reconcileReconnectState({
        snapshot: { ...serverIdle, isPendingDisposition: true },
        local: { ...clientIdle, isPendingDisposition: true },
      });
      expect(plan.action).toBe(reconnectActions.none);
    });
  });

  describe('when the server has a call', () => {
    it('reloads the call the client lost track of', () => {
      const plan = reconcileReconnectState({
        snapshot: { isOnCall: true, activeCallUii: 'uii-7', isPendingDisposition: false },
        local: clientIdle,
      });
      expect(plan).toEqual({
        action: reconnectActions.reloadActiveCall,
        callId: 'uii-7',
        reason: 'clientLostActiveCall',
      });
    });

    it('force clears when the two sides point at different calls', () => {
      const plan = reconcileReconnectState({
        snapshot: { isOnCall: true, activeCallUii: 'uii-new', isPendingDisposition: false },
        local: {
          ...clientIdle,
          activeCallIds: ['call-old'],
          activityCallId: 'call-old',
          activeCallUii: 'uii-old',
        },
      });
      expect(plan).toEqual({
        action: reconnectActions.forceClearCall,
        callId: 'uii-new',
        reason: 'activeCallMismatch',
      });
    });

    it('does not force clear when the server sent no uii to compare', () => {
      const plan = reconcileReconnectState({
        snapshot: { isOnCall: true, activeCallUii: '', isPendingDisposition: false },
        local: {
          ...clientIdle,
          activeCallIds: ['call-old'],
          activeCallUii: 'uii-old',
        },
      });
      expect(plan.action).toBe(reconnectActions.none);
    });

    it('does not force clear when the client has no uii to compare', () => {
      const plan = reconcileReconnectState({
        snapshot: { isOnCall: true, activeCallUii: 'uii-new', isPendingDisposition: false },
        local: { ...clientIdle, activeCallIds: ['call-old'] },
      });
      expect(plan.action).toBe(reconnectActions.none);
    });
  });
});

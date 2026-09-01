import { planOffhookRecovery } from '../../../../src/app/utils/planOffhookRecovery';
import type { OffhookRecoveryInputs } from '../../../../src/app/utils/planOffhookRecovery';

const base: OffhookRecoveryInputs = {
  isServer: true,
  isIntegratedSoftphone: true,
  isOffhook: false,
  isOffhooking: false,
  hasActiveCall: false,
  offhookLostMidCall: false,
  isManualOffhook: false,
  flags: { autoStartOH: true, maintainOH: false },
};

describe('planOffhookRecovery', () => {
  describe('registrar rotation (SDK reports flags)', () => {
    it('restores the offhook session when the agent had one before the drop', () => {
      const plan = planOffhookRecovery(base);
      expect(plan.shouldRestoreOffhook).toBe(true);
      expect(plan.reason).toBe('restoreOffhook');
    });

    it('carries maintainOH through so END_CALL leaves the restored session alone', () => {
      const plan = planOffhookRecovery({
        ...base,
        flags: { autoStartOH: true, maintainOH: true },
      });
      expect(plan.shouldRestoreOffhook).toBe(true);
      expect(plan.shouldMaintainOffhook).toBe(true);
    });

    it('does not mark a restored session as agent-owned when maintainOH is off', () => {
      expect(planOffhookRecovery(base).shouldMaintainOffhook).toBe(false);
    });

    it('skips when the agent had no audio leg before the drop', () => {
      const plan = planOffhookRecovery({
        ...base,
        flags: { autoStartOH: false, maintainOH: true },
      });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('noOffhookToRestore');
    });

    it('skips when the offhook session survived the registrar rotation', () => {
      const plan = planOffhookRecovery({ ...base, isOffhook: true });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('offhookStillUp');
    });
  });

  describe('same-registrar re-registration (network switch, no flags)', () => {
    // the SDK reports nothing on this path: the leg's death already zeroed
    // autoStartOH through the offhook state, so the active call is the only
    // remaining evidence
    it('rebuilds the leg for a call whose audio was seen dying', () => {
      const plan = planOffhookRecovery({
        ...base,
        hasActiveCall: true,
        offhookLostMidCall: true,
        flags: undefined,
      });
      expect(plan.shouldRestoreOffhook).toBe(true);
      expect(plan.reason).toBe('activeCallWithoutAudioLeg');
    });

    it('keeps a manually started session agent-owned when rebuilding it', () => {
      const plan = planOffhookRecovery({
        ...base,
        hasActiveCall: true,
        offhookLostMidCall: true,
        isManualOffhook: true,
        flags: undefined,
      });
      expect(plan.shouldRestoreOffhook).toBe(true);
      expect(plan.shouldMaintainOffhook).toBe(true);
    });

    // a reload rehydrates persisted call state, so an active-call/no-leg
    // combination without a witnessed loss is stale storage, and restoring
    // from it would put a freshly loaded agent offhook out of nowhere
    it('does not restore from rehydrated call state after a reload', () => {
      const plan = planOffhookRecovery({
        ...base,
        hasActiveCall: true,
        offhookLostMidCall: false,
        flags: undefined,
      });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('noOffhookToRestore');
    });

    it('does nothing on a routine registration refresh with a healthy leg', () => {
      const plan = planOffhookRecovery({
        ...base,
        isOffhook: true,
        hasActiveCall: true,
        flags: undefined,
      });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('offhookStillUp');
    });

    it('does nothing for an idle agent with no flags to act on', () => {
      const plan = planOffhookRecovery({ ...base, flags: undefined });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('noOffhookToRestore');
    });

    it('does not collide with an offhook init already in flight', () => {
      const plan = planOffhookRecovery({
        ...base,
        hasActiveCall: true,
        offhookLostMidCall: true,
        isOffhooking: true,
        flags: undefined,
      });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('offhookInProgress');
    });
  });

  describe('gates', () => {
    it('skips on ports that do not own the SDK', () => {
      const plan = planOffhookRecovery({ ...base, isServer: false });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('notServer');
    });

    it('skips when the agent is not on the integrated softphone', () => {
      const plan = planOffhookRecovery({
        ...base,
        isIntegratedSoftphone: false,
      });
      expect(plan.shouldRestoreOffhook).toBe(false);
      expect(plan.reason).toBe('notIntegratedSoftphone');
    });
  });
});

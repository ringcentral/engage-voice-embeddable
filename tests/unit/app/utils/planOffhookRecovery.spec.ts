import { planOffhookRecovery } from '../../../../src/app/utils/planOffhookRecovery';
import type { OffhookRecoveryInputs } from '../../../../src/app/utils/planOffhookRecovery';

const base: OffhookRecoveryInputs = {
  isServer: true,
  isIntegratedSoftphone: true,
  isOffhook: false,
  flags: { autoStartOH: true, maintainOH: false },
};

describe('planOffhookRecovery', () => {
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

  it('skips when the SDK reported no flags', () => {
    const plan = planOffhookRecovery({ ...base, flags: undefined });
    expect(plan.shouldRestoreOffhook).toBe(false);
    expect(plan.reason).toBe('noFlags');
  });
});

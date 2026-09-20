import { shouldReplaceActivityCallRoute } from '../../../../src/app/utils/shouldReplaceActivityCallRoute';

describe('shouldReplaceActivityCallRoute', () => {
  it('replaces a leftover disposition so Back cannot reopen it', () => {
    expect(
      shouldReplaceActivityCallRoute(
        '/activityCallLog/202609200207140090000123474677$2/disposition',
      ),
    ).toBe(true);
  });

  it('replaces another call control page for the same reason', () => {
    expect(
      shouldReplaceActivityCallRoute(
        '/activityCallLog/202609200207140090000123474677$2',
      ),
    ).toBe(true);
  });

  it('still pushes when the call arrives from the dialer', () => {
    expect(shouldReplaceActivityCallRoute('/agent/dialer')).toBe(false);
  });

  it('still pushes from history so Back can return there', () => {
    expect(shouldReplaceActivityCallRoute('/agent')).toBe(false);
  });
});

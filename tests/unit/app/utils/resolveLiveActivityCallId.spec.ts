import { resolveLiveActivityCallId } from '../../../../src/app/utils/resolveLiveActivityCallId';

const disposedCallId = '202609200207140090000123474677$2';
const answeredCallId = '202609200207304408010000024767$2';

describe('resolveLiveActivityCallId', () => {
  it('keeps the pointer when it still names a live call', () => {
    expect(
      resolveLiveActivityCallId({
        activityCallId: answeredCallId,
        callIds: [answeredCallId],
      }),
    ).toBe(answeredCallId);
  });

  it('recovers the live call after the pointer was cleared', () => {
    expect(
      resolveLiveActivityCallId({
        activityCallId: '',
        callIds: [answeredCallId],
      }),
    ).toBe(answeredCallId);
  });

  it('recovers the live call after the pointer was left on the ended one', () => {
    expect(
      resolveLiveActivityCallId({
        activityCallId: disposedCallId,
        callIds: [answeredCallId],
        excludeCallId: disposedCallId,
      }),
    ).toBe(answeredCallId);
  });

  it('ignores the call being left even when it is still in callIds', () => {
    expect(
      resolveLiveActivityCallId({
        activityCallId: disposedCallId,
        callIds: [disposedCallId, answeredCallId],
        excludeCallId: disposedCallId,
      }),
    ).toBe(answeredCallId);
  });

  it('returns empty when nothing live remains', () => {
    expect(
      resolveLiveActivityCallId({
        activityCallId: disposedCallId,
        callIds: [],
        excludeCallId: disposedCallId,
      }),
    ).toBe('');
  });
});

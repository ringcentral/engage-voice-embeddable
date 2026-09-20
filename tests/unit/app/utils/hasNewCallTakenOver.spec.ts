import { hasNewCallTakenOver } from '../../../../src/app/utils/hasNewCallTakenOver';

const disposedCallId = '202609200207140090000123474677$2';
const answeredCallId = '202609200207304408010000024767$2';

describe('hasNewCallTakenOver', () => {
  it('leaves the teardown alone after the only call ended', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: disposedCallId,
        callIds: [],
      }),
    ).toBe(false);
  });

  it('reports the takeover once the answer moved the pointer', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: answeredCallId,
        callIds: [answeredCallId],
      }),
    ).toBe(true);
  });

  it('reports the takeover before the answer is routed', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: disposedCallId,
        callIds: [answeredCallId],
      }),
    ).toBe(true);
  });

  it('reports the takeover when the pointer was never restored', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: '',
        callIds: [answeredCallId],
      }),
    ).toBe(true);
  });

  it('lets a mid-call disposition return the way it did', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: disposedCallId,
        callIds: [disposedCallId],
      }),
    ).toBe(false);
  });

  it('lets a transfer that keeps a second session return the way it did', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: disposedCallId,
        activityCallId: disposedCallId,
        callIds: [disposedCallId, answeredCallId],
      }),
    ).toBe(false);
  });

  it('leaves a history submit, which owns no call, alone', () => {
    expect(
      hasNewCallTakenOver({
        submittedCallId: '',
        activityCallId: '',
        callIds: [],
      }),
    ).toBe(false);
  });
});

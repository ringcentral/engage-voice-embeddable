import { isOnLiveCallPage } from '../../../../src/app/utils/isOnLiveCallPage';

const liveCallId = '202609200207304408010000024767$2';
const endedCallId = '202609200207140090000123474677$2';

describe('isOnLiveCallPage', () => {
  it('hides the banner on the live call control page', () => {
    expect(isOnLiveCallPage(`/activityCallLog/${liveCallId}`, liveCallId)).toBe(
      true,
    );
  });

  it('hides the banner on the live call transfer page', () => {
    expect(
      isOnLiveCallPage(`/activityCallLog/${liveCallId}/transferCall`, liveCallId),
    ).toBe(true);
  });

  it('shows the banner on a leftover disposition for a different call', () => {
    expect(
      isOnLiveCallPage(
        `/activityCallLog/${endedCallId}/disposition`,
        liveCallId,
      ),
    ).toBe(false);
  });

  it('shows the banner on the dialer', () => {
    expect(isOnLiveCallPage('/agent/dialer', liveCallId)).toBe(false);
  });

  it('shows the banner when there is no live call to hide for', () => {
    expect(isOnLiveCallPage(`/activityCallLog/${endedCallId}`, '')).toBe(false);
  });
});

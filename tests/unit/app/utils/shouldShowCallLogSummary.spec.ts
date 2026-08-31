import { shouldShowCallLogSummary } from 'src/app/utils/shouldShowCallLogSummary';

describe('shouldShowCallLogSummary', () => {
  it('hides summary on the call-log page when activities are not permitted', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: false,
        hasHistoryActivity: false,
        isServerOnlyHistoryCall: true,
        isSessionSummaryEnabled: true,
      }),
    ).toBe(false);
  });

  it('hides summary on the call-log page when GET /activities failed', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: false,
        hasHistoryActivity: false,
        isServerOnlyHistoryCall: false,
        isSessionSummaryEnabled: true,
      }),
    ).toBe(false);
  });

  it('hides summary for a server-only row when GET /activities found no record', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: true,
        hasHistoryActivity: false,
        isServerOnlyHistoryCall: true,
        isSessionSummaryEnabled: true,
      }),
    ).toBe(false);
  });

  it('shows summary for a server-only row backed by an activity record', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: true,
        hasHistoryActivity: true,
        isServerOnlyHistoryCall: true,
        isSessionSummaryEnabled: false,
      }),
    ).toBe(true);
  });

  it('follows the session summary flag when activities loaded for a local history call', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: true,
        hasHistoryActivity: true,
        isServerOnlyHistoryCall: false,
        isSessionSummaryEnabled: true,
      }),
    ).toBe(true);
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: true,
        isActivitiesAccessible: true,
        hasHistoryActivity: true,
        isServerOnlyHistoryCall: false,
        isSessionSummaryEnabled: false,
      }),
    ).toBe(false);
  });

  it('does not use activities access for the live disposition page', () => {
    expect(
      shouldShowCallLogSummary({
        isHistoryMode: false,
        isActivitiesAccessible: false,
        hasHistoryActivity: false,
        isServerOnlyHistoryCall: false,
        isSessionSummaryEnabled: true,
      }),
    ).toBe(true);
  });
});

import { canDialHistoryCall } from 'src/app/services/EvCallHistory/can-dial-history-call';

describe('canDialHistoryCall', () => {
  it('allows dialing when permission, number, and idle state are all set', () => {
    expect(
      canDialHistoryCall({
        phoneNumber: '+12098887638',
        allowHistoricalDialing: true,
        isIdle: true,
      }),
    ).toBe(true);
  });

  it('blocks dialing when allowHistoricalDialing is false', () => {
    expect(
      canDialHistoryCall({
        phoneNumber: '+12098887638',
        allowHistoricalDialing: false,
        isIdle: true,
      }),
    ).toBe(false);
  });

  it('blocks dialing when there is no destination number', () => {
    expect(
      canDialHistoryCall({
        phoneNumber: '',
        allowHistoricalDialing: true,
        isIdle: true,
      }),
    ).toBe(false);
  });

  it('blocks dialing while another call is in progress', () => {
    expect(
      canDialHistoryCall({
        phoneNumber: '+12098887638',
        allowHistoricalDialing: true,
        isIdle: false,
      }),
    ).toBe(false);
  });
});

import { contactMatchIdentifyEncode } from 'src/lib/contactMatchIdentify';
import type { HistoryItemResponse } from 'src/app/services/EvClient/interfaces';
import { getHistoryContactMatchIdentify } from 'src/app/services/EvCallHistory/get-history-contact-match-identify';

function makeItem(
  overrides: Partial<{
    phoneNumber: string | null;
    dialogOrigination: 'INBOUND' | 'OUTBOUND';
  }> = {},
): HistoryItemResponse {
  return {
    agentSegment: {
      segmentId: 'seg-1',
      segmentStart: '2024-03-11T09:06:43Z',
      segmentEnd: null,
      queue: null,
      disposition: null,
      duration: null,
      termParty: null,
      termReason: null,
      productType: null,
      recordingUrl: '',
    },
    dialog: {
      dialogOrigination: overrides.dialogOrigination ?? 'INBOUND',
      dialogId: 'dialog-1',
      dialDisposition: null,
      uii: 'uii-1',
      taskId: null,
      state: 'COMPLETE',
      sessionInformation: {
        displayName: null,
        phoneNumber: overrides.phoneNumber === undefined
          ? '+12098887638'
          : overrides.phoneNumber,
        email: null,
        rcExtention: false,
        title: null,
        edUuid: null,
        firstname: null,
        lastname: null,
      },
      channelConfiguration: { dnis: '+18005551212' },
    },
    outbound: null,
  } as HistoryItemResponse;
}

describe('getHistoryContactMatchIdentify', () => {
  it('returns undefined when the session has no phone number', () => {
    expect(
      getHistoryContactMatchIdentify(makeItem({ phoneNumber: null })),
    ).toBeUndefined();
    expect(
      getHistoryContactMatchIdentify(makeItem({ phoneNumber: '' })),
    ).toBeUndefined();
  });

  it('encodes inbound and outbound identifies like active-call matching', () => {
    expect(getHistoryContactMatchIdentify(makeItem())).toBe(
      contactMatchIdentifyEncode({
        phoneNumber: '+12098887638',
        callType: 'INBOUND',
      }),
    );
    expect(
      getHistoryContactMatchIdentify(
        makeItem({ dialogOrigination: 'OUTBOUND' }),
      ),
    ).toBe(
      contactMatchIdentifyEncode({
        phoneNumber: '+12098887638',
        callType: 'OUTBOUND',
      }),
    );
  });
});

import { callDirection } from 'src/enums';
import { OutboundType } from 'src/app/services/EvClient/interfaces';
import type { HistoryItemResponse } from 'src/app/services/EvClient/interfaces';
import {
  formatHistoryCall,
  getHistoryDisplayName,
  isInvalidHistoryDisplayName,
  makeHistoryCallId,
  parseHistoryCallId,
} from 'src/app/services/EvCallHistory/formatHistoryCall';

const SEGMENT_ID = 'p-v-8cdf8321f5e3445a88603617137f5bd7-1745664761642-19671ba5f2a15';
const UII = '202504260652418139020000000028';
const DIALOG_ID = 's-v-8cdf8321f5e3445a88603617137f5bd7-1745664761642';

function makeItem(overrides: any = {}): HistoryItemResponse {
  const { agentSegment, dialog, outbound, ...rest } = overrides;
  return {
    agentSegment: {
      segmentId: SEGMENT_ID,
      segmentStart: '2024-03-11T09:06:43Z',
      segmentEnd: null,
      queue: null,
      disposition: null,
      duration: null,
      termParty: null,
      termReason: null,
      productType: null,
      recordingUrl: '',
      ...agentSegment,
    },
    dialog: {
      dialogOrigination: 'INBOUND',
      dialogId: DIALOG_ID,
      dialDisposition: null,
      uii: UII,
      taskId: null,
      state: 'COMPLETE',
      ...dialog,
      sessionInformation: {
        displayName: null,
        phoneNumber: '+12098887638',
        email: null,
        rcExtention: false,
        title: null,
        edUuid: null,
        firstname: null,
        lastname: null,
        ...(dialog?.sessionInformation ?? {}),
      },
      channelConfiguration: {
        channelClass: 'VOICE',
        channelType: 'VOICE',
        dnis: null,
        ...(dialog?.channelConfiguration ?? {}),
      },
    },
    outbound: outbound ?? null,
    ...rest,
  } as HistoryItemResponse;
}

describe('makeHistoryCallId / parseHistoryCallId', () => {
  it('round-trips the segment id and uii', () => {
    const id = makeHistoryCallId(makeItem());
    expect(id).toBe(`${SEGMENT_ID}$$${UII}`);
    expect(parseHistoryCallId(id)).toEqual({ segmentId: SEGMENT_ID, uii: UII });
  });

  it('round-trips when the server omits the segment id', () => {
    const id = makeHistoryCallId(makeItem({ agentSegment: { segmentId: null } }));
    expect(id).toBe(`$$${UII}`);
    expect(parseHistoryCallId(id)).toEqual({ segmentId: '', uii: UII });
  });

  it('treats an id with no separator as a bare uii', () => {
    expect(parseHistoryCallId(UII)).toEqual({ segmentId: '', uii: UII });
  });
});

describe('display name resolution', () => {
  it('prefers the lead name, including the middle name', () => {
    const call = formatHistoryCall(
      makeItem({
        dialog: { dialogOrigination: 'OUTBOUND' },
        outbound: {
          type: OutboundType.LEAD,
          campaignId: 1,
          campaignName: 'Winback',
          lead: { firstName: 'Ada', midName: 'M', lastName: 'Lovelace' },
        },
      }),
    );
    expect(call.contact.name).toBe('Ada M Lovelace');
  });

  it.each(['unknown', 'UNKNOWN', 'trunk:carrier-a', 'TRUNK:x'])(
    'rejects the placeholder display name %s',
    (displayName) => {
      expect(isInvalidHistoryDisplayName(displayName)).toBe(true);
      const call = formatHistoryCall(
        makeItem({ dialog: { sessionInformation: { displayName } } }),
      );
      expect(call.contact.name).toBe(call.contact.phoneNumber);
    },
  );

  it('rejects a display name that merely echoes the queue name', () => {
    const call = formatHistoryCall(
      makeItem({
        agentSegment: { queue: { queueId: 1, queueName: 'Support', appUrl: null, backupAppUrl: null } },
        dialog: { sessionInformation: { displayName: 'support' } },
      }),
    );
    expect(call.contact.name).toBe(call.contact.phoneNumber);
  });

  it('rejects a display name that merely echoes the campaign name', () => {
    const call = formatHistoryCall(
      makeItem({
        dialog: { dialogOrigination: 'OUTBOUND', sessionInformation: { displayName: 'Winback' } },
        outbound: { type: OutboundType.MANUAL, campaignId: 1, campaignName: 'Winback', lead: null },
      }),
    );
    expect(call.contact.name).toBe(call.contact.phoneNumber);
  });

  it('rejects a display name that is the number in another format', () => {
    const call = formatHistoryCall(
      makeItem({
        dialog: { sessionInformation: { displayName: '(209) 888-7638' } },
      }),
    );
    expect(call.contact.name).toBe(call.contact.phoneNumber);
  });

  it('keeps a genuine display name', () => {
    const call = formatHistoryCall(
      makeItem({ dialog: { sessionInformation: { displayName: 'Pepe Popo' } } }),
    );
    expect(call.contact.name).toBe('Pepe Popo');
  });

  it('falls back to an empty contact name when there is no number at all', () => {
    const call = formatHistoryCall(
      makeItem({ dialog: { sessionInformation: { phoneNumber: null } } }),
    );
    // Never the localized "unknown" string that formatPhoneNumber returns for ''.
    expect(call.contact.phoneNumber).toBe('');
    expect(call.contact.name).toBe('');
  });

  it('does not treat a queue name as a source when comparing (direct helper)', () => {
    expect(getHistoryDisplayName(makeItem(), '')).toBe('');
  });
});

describe('direction', () => {
  it('puts the contact on `from` for an inbound call', () => {
    const call = formatHistoryCall(makeItem());
    expect(call.direction).toBe(callDirection.inbound);
    expect(call.from).toBe(call.contact);
    expect(call.to).toBe(call.agent);
  });

  it('puts the contact on `to` for an outbound call', () => {
    const call = formatHistoryCall(
      makeItem({ dialog: { dialogOrigination: 'OUTBOUND' } }),
    );
    expect(call.direction).toBe(callDirection.outbound);
    expect(call.from).toBe(call.agent);
    expect(call.to).toBe(call.contact);
  });
});

describe('scalar fields', () => {
  it('parses an offset-bearing ISO segmentStart', () => {
    const call = formatHistoryCall(makeItem());
    expect(call.startTime).toBe(Date.parse('2024-03-11T09:06:43Z'));
  });

  it('yields 0 for an unparseable segmentStart', () => {
    const call = formatHistoryCall(
      makeItem({ agentSegment: { segmentStart: 'not-a-date' } }),
    );
    expect(call.startTime).toBe(0);
  });

  it('prefers the segment interval for the duration', () => {
    const call = formatHistoryCall(
      makeItem({
        agentSegment: {
          segmentStart: '2024-03-11T09:06:43Z',
          segmentEnd: '2024-03-11T09:07:43Z',
          duration: 999,
        },
      }),
    );
    expect(call.durationMs).toBe(60_000);
  });

  it('falls back to `duration` seconds when there is no segment end', () => {
    const call = formatHistoryCall(makeItem({ agentSegment: { duration: 6 } }));
    expect(call.durationMs).toBe(6000);
  });

  it('normalizes an empty recordingUrl to undefined', () => {
    expect(formatHistoryCall(makeItem()).recordingUrl).toBeUndefined();
    expect(
      formatHistoryCall(
        makeItem({ agentSegment: { recordingUrl: 'https://rec/1.wav' } }),
      ).recordingUrl,
    ).toBe('https://rec/1.wav');
  });

  it('keeps the raw phone number as the historical dial destination', () => {
    expect(formatHistoryCall(makeItem()).dialableNumber).toBe('+12098887638');
  });

  it('marks a corporate-directory destination for extension dialing', () => {
    const call = formatHistoryCall(
      makeItem({
        dialog: {
          sessionInformation: {
            phoneNumber: '122',
            rcExtention: true,
          },
        },
      }),
    );
    expect(call.dialableNumber).toBe('122@RC_EXT');
  });

  it('derives isDisposed from the recorded disposition', () => {
    expect(formatHistoryCall(makeItem()).isDisposed).toBe(false);
    const disposed = formatHistoryCall(
      makeItem({ agentSegment: { disposition: { value: 'Sale' } } }),
    );
    expect(disposed.isDisposed).toBe(true);
    expect(disposed.isLogged).toBe(true);
    expect(disposed.disposition).toBe('Sale');
  });

  it('builds the info line as queue, then campaign, then the manual label', () => {
    expect(
      formatHistoryCall(
        makeItem({
          agentSegment: { queue: { queueId: 1, queueName: 'Support', appUrl: null, backupAppUrl: null } },
        }),
      ).infoLine,
    ).toBe('Support');

    expect(
      formatHistoryCall(
        makeItem({
          outbound: { type: OutboundType.LEAD, campaignId: 1, campaignName: 'Winback', lead: {} },
        }),
      ).infoLine,
    ).toBe('Winback');

    expect(
      formatHistoryCall(
        makeItem({
          outbound: { type: OutboundType.MANUAL, campaignId: null, campaignName: null, lead: null },
        }),
        { manualLabel: 'Manual' },
      ).infoLine,
    ).toBe('Manual');
  });

  it('marks a dropped active interaction as no longer active', () => {
    expect(
      formatHistoryCall(makeItem({ dialog: { state: 'ACTIVE' } })).isActive,
    ).toBe(true);
    expect(
      formatHistoryCall(
        makeItem({ dialog: { state: 'ACTIVE' }, agentSegment: { termReason: 'DROP' } }),
      ).isActive,
    ).toBe(false);
  });
});

import type { EvAgentSettings, EvBaseCall } from '../EvClient/interfaces';
import { formatAgentScriptModel } from './formatAgentScriptModel';

const agentSettings = {
  externalAgentId: 'ext-7',
  firstName: 'Ada',
  lastName: 'Lovelace',
  agentType: 'AGENT',
  email: 'ada@example.com',
  username: 'ada',
} as EvAgentSettings;

const call = {
  uii: '2024-uii-1',
  ani: '+16505550100',
  aniE164: '+16505550100',
  dnis: '+16505550199',
  dnisE164: '+16505550199',
  baggage: { source: 'web' },
  scriptResponse: { firstName: 'Grace' },
  lead: { leadPhone: '+16505550100' },
  outdialDispositions: { dispositions: [{ dispositionId: 'd1' }] },
  queue: { isCampaign: false, name: 'Support', number: '800' },
} as unknown as EvBaseCall;

describe('formatAgentScriptModel', () => {
  it('projects call and agent data onto the interpolation model', () => {
    const {
      call: modelCall,
      model,
      lead,
    } = formatAgentScriptModel(call, agentSettings);

    expect(modelCall.uii).toBe('2024-uii-1');
    expect(modelCall.ani).toBe('+16505550100');
    expect(modelCall.dnis).toBe('+16505550199');
    expect(modelCall.dispositions).toEqual([{ dispositionId: 'd1' }]);
    expect(modelCall.baggage).toEqual({ source: 'web' });
    expect(modelCall.agentExternId).toBe('ext-7');
    expect(modelCall.agentFirstName).toBe('Ada');
    expect(modelCall.agentLastName).toBe('Lovelace');
    expect(modelCall.agentType).toBe('AGENT');
    expect(modelCall.agentEmail).toBe('ada@example.com');
    expect(modelCall.agentUsername).toBe('ada');
    // Answers from an earlier pass are restored, not discarded.
    expect(model).toEqual({ firstName: 'Grace' });
    expect(lead).toEqual({ leadPhone: '+16505550100' });
  });

  it('reports an inbound queue as queue* and leaves campaign* empty', () => {
    const { call: modelCall } = formatAgentScriptModel(call, agentSettings);

    expect(modelCall.queueName).toBe('Support');
    expect(modelCall.queueId).toBe('800');
    expect(modelCall.campaignName).toBe('');
    expect(modelCall.campaignId).toBe('');
  });

  it('reports a campaign as campaign* and leaves queue* empty', () => {
    const campaignCall = {
      ...call,
      queue: { isCampaign: true, name: 'Winback', number: '4242' },
    } as unknown as EvBaseCall;

    const { call: modelCall } = formatAgentScriptModel(
      campaignCall,
      agentSettings,
    );

    expect(modelCall.campaignName).toBe('Winback');
    expect(modelCall.campaignId).toBe('4242');
    expect(modelCall.queueName).toBe('');
    expect(modelCall.queueId).toBe('');
  });

  it('falls back to the segment customer identity for ani', () => {
    const segmentCall = {
      uii: 'segment-uii',
      segmentContext: {
        customerIdentity: { ani: '5550100', aniE164: '+15550100' },
      },
    } as unknown as EvBaseCall;

    const { call: modelCall } = formatAgentScriptModel(
      segmentCall,
      agentSettings,
    );

    expect(modelCall.ani).toBe('5550100');
    expect(modelCall.aniE164).toBe('+15550100');
  });

  it('renders every key as an empty value rather than undefined', () => {
    const { call: modelCall, model, lead } = formatAgentScriptModel(null, null);

    expect(model).toEqual({});
    expect(lead).toEqual({});
    expect(modelCall.dispositions).toEqual([]);
    expect(modelCall.baggage).toEqual({});
    Object.entries(modelCall).forEach(([key, value]) => {
      expect(value).toBeDefined();
      if (key !== 'dispositions' && key !== 'baggage') {
        expect(value).toBe('');
      }
    });
  });

  it('omits enableConversationSummary so the AI summary UI stays off', () => {
    const summaryCall = {
      ...call,
      enableConversationSummary: true,
    } as unknown as EvBaseCall;

    const { call: modelCall } = formatAgentScriptModel(
      summaryCall,
      agentSettings,
    );

    expect(modelCall).not.toHaveProperty('enableConversationSummary');
  });

  it('does not mutate or alias the source call', () => {
    const source = {
      ...call,
      baggage: { source: 'web' },
      scriptResponse: { firstName: 'Grace' },
    } as unknown as EvBaseCall;

    const result = formatAgentScriptModel(source, agentSettings);
    (result.call.baggage as any).source = 'mutated';
    (result.model as any).firstName = 'mutated';

    expect((source.baggage as any).source).toBe('web');
    expect((source.scriptResponse as any).firstName).toBe('Grace');
  });
});

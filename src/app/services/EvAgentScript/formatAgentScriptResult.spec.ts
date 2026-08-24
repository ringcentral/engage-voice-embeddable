import { formatAgentScriptResult } from './formatAgentScriptResult';

describe('formatAgentScriptResult', () => {
  it('normalizes raw and wrapped model values without mutating the input', () => {
    const input = {
      call: {} as any,
      lead: {},
      model: {
        raw: 'answer',
        wrapped: { value: ['one', 'two'], leadField: 'customField' },
      } as any,
      renderFormValid: true,
      scriptComplete: false,
    };

    const result = formatAgentScriptResult(input);

    expect(result).not.toBe(input);
    expect(result.model).toEqual({
      raw: { value: 'answer', leadField: '' },
      wrapped: {
        value: ['one', 'two'],
        leadField: 'customField',
      },
    });
    expect(input.model.raw).toBe('answer');
  });
});


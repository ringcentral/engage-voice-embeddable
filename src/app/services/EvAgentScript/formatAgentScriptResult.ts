import { clone, reduce } from 'ramda';

import type {
  EvAgentScriptResult,
  EvAgentScriptResultModel,
} from '../EvClient/interfaces';

export function formatAgentScriptResult(
  scriptResult: EvAgentScriptResult,
): EvAgentScriptResult {
  const resultCopy = clone(scriptResult);

  resultCopy.model = reduce(
    (output, [key, value]) => {
      const normalizedValue =
        value && typeof value === 'object' && 'value' in value
          ? value.value
          : value;

      output[key] = {
        value: normalizedValue,
        leadField:
          value && typeof value === 'object' && 'leadField' in value
            ? value.leadField ?? ''
            : '',
      };
      return output;
    },
    {} as EvAgentScriptResultModel,
    Object.entries(resultCopy.model ?? {}),
  );

  return resultCopy;
}


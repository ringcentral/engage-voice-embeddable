import { callErrors } from '@ringcentral-integration/commons/modules/Call';
import { parse, format, formatTypes } from '@ringcentral-integration/phone-number';
import cleanNumber from '@ringcentral-integration/phone-number/lib/cleanNumber';
import { messageTypes } from '@ringcentral-integration/engage-voice-widgets/enums';
import { EvTypeError } from '@ringcentral-integration/engage-voice-widgets/lib/EvTypeError';

export const parseNumber = (input: string) => {
  const { parsedNumber, isValid, hasInvalidChars } = parse({
    input,
  });

  if (input === '911' || input === '933' || input === '112') {
    throw new EvTypeError({
      type: callErrors.emergencyNumber,
    });
  }

  if (!isValid || hasInvalidChars || !parsedNumber) {
    throw new EvTypeError({
      type: messageTypes.INVALID_NUMBER,
    });
  }

  const formattedNumber = cleanNumber(format({
    phoneNumber: input,
    type: formatTypes.e164,
  }));

  return formattedNumber;
};

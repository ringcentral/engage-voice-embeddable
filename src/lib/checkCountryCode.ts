import countries from 'i18n-iso-countries';

import {
  isE164,
  parse,
  parseIncompletePhoneNumber,
} from '@ringcentral-integration/phone-number';

import { messageTypes } from '@ringcentral-integration/engage-voice-widgets/enums';
import { EvTypeError } from '@ringcentral-integration/engage-voice-widgets/lib/EvTypeError';

export const checkCountryCode = (input: string, availableCountries) => {
  const cleanedNumber: string = parseIncompletePhoneNumber(input.toString());
  const isE164Number = isE164(cleanedNumber);
  if (isE164Number) {
    const { parsedNumber, isValid, hasInvalidChars, parsedCountry } = parse({
      input,
    });
    if (isValid && !hasInvalidChars && parsedNumber) {
      const dialoutCountryCode = countries.alpha2ToAlpha3(parsedCountry);
      if (dialoutCountryCode !== 'USA' && !availableCountries.find(c => c.countryId === dialoutCountryCode)) {
        throw new EvTypeError({
          type: messageTypes.NO_SUPPORT_COUNTRY,
        });
      }
    }
  }
};

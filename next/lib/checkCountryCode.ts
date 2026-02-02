import {
  isE164,
  parse,
  parseIncompletePhoneNumber,
} from '@ringcentral-integration/phone-number';
import countries from 'i18n-iso-countries';

import { messageTypes } from '../enums';

import { EvTypeError } from './EvTypeError';

interface AvailableCountry {
  countryId: string;
}

/**
 * Check if country code is supported
 * @param input - Phone number input
 * @param availableCountries - Optional list of available countries. If not provided, only USA is supported.
 */
export const checkCountryCode = (
  input: string,
  availableCountries?: AvailableCountry[],
) => {
  const cleanedNumber: string = parseIncompletePhoneNumber(input.toString());
  const isE164Number = isE164(cleanedNumber);
  if (isE164Number) {
    const { parsedNumber, isValid, hasInvalidChars, parsedCountry } = parse({
      input,
    });
    if (isValid && !hasInvalidChars && parsedNumber) {
      const dialoutCountryCode = countries.alpha2ToAlpha3(parsedCountry);
      const isCountrySupported =
        dialoutCountryCode === 'USA' ||
        (availableCountries &&
          availableCountries.some((c) => c.countryId === dialoutCountryCode));
      if (!isCountrySupported) {
        throw new EvTypeError({
          type: messageTypes.NO_SUPPORT_COUNTRY,
        });
      }
    }
  }
};

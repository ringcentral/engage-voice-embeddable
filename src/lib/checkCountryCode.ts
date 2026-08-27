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
  countryCode?: string;
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
      const dialoutCountryId = countries.alpha2ToAlpha3(parsedCountry);
      // the national number is the E164 number without `+` and dialing code
      const dialoutCountryCode = cleanedNumber.endsWith(parsedNumber)
        ? cleanedNumber.slice(1, cleanedNumber.length - parsedNumber.length)
        : null;
      const isCountrySupported =
        dialoutCountryId === 'USA' ||
        (availableCountries &&
          availableCountries.some(
            (c) =>
              // `countryId` from agent config is not always ISO alpha-3,
              // eg. Germany is `GER` there but `DEU` in ISO 3166-1,
              // so match on the dialing code first and fall back to the id.
              (!!dialoutCountryCode && c.countryCode === dialoutCountryCode) ||
              c.countryId === dialoutCountryId,
          ));
      if (!isCountrySupported) {
        throw new EvTypeError({
          type: messageTypes.NO_SUPPORT_COUNTRY,
        });
      }
    }
  }
};

import { messageTypes } from '../enums';

import type { AvailableCountry } from './availableCountry';
import { findAvailableCountry, parseNumberCountry } from './availableCountry';
import { EvTypeError } from './EvTypeError';

/**
 * Check if country code is supported
 * @param input - Phone number input
 * @param availableCountries - Optional list of available countries. If not provided, only USA is supported.
 */
export const checkCountryCode = (
  input: string,
  availableCountries?: AvailableCountry[],
) => {
  const numberCountry = parseNumberCountry(input);
  if (!numberCountry) {
    return;
  }
  const isCountrySupported =
    numberCountry.countryId === 'USA' ||
    !!findAvailableCountry(availableCountries, numberCountry);
  if (!isCountrySupported) {
    throw new EvTypeError({
      type: messageTypes.NO_SUPPORT_COUNTRY,
    });
  }
};

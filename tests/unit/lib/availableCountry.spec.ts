import {
  findAvailableCountry,
  formatCountryE164,
  parseNumberCountry,
} from 'src/lib/availableCountry';

// `countryId` of Germany is `GER` in the agent config, ISO 3166-1 has `DEU`
const availableCountries = [
  { countryCode: '1', countryId: 'CAN', countryName: 'Canada' },
  { countryCode: '49', countryId: 'GER', countryName: 'Germany' },
  { countryCode: '1', countryId: 'USA', countryName: 'United States' },
];

describe('parseNumberCountry', () => {
  it('should get the ISO id and the dialing code of an e164 number', () => {
    expect(parseNumberCountry('+49 30 901820')).toEqual({
      countryId: 'DEU',
      countryCode: '49',
    });
  });

  it('should get null for a number without country', () => {
    expect(parseNumberCountry('650 849 8195')).toBeNull();
    expect(parseNumberCountry('1234')).toBeNull();
  });
});

describe('findAvailableCountry', () => {
  it('should find a country whose id is not ISO alpha-3 by dialing code', () => {
    expect(
      findAvailableCountry(availableCountries, {
        countryId: 'DEU',
        countryCode: '49',
      })?.countryId,
    ).toEqual('GER');
  });

  it('should prefer the country id over the shared dialing code', () => {
    expect(
      findAvailableCountry(availableCountries, {
        countryId: 'USA',
        countryCode: '1',
      })?.countryId,
    ).toEqual('USA');
  });

  it('should get undefined when no country matches', () => {
    expect(
      findAvailableCountry(availableCountries, {
        countryId: 'FRA',
        countryCode: '33',
      }),
    ).toBeUndefined();
    expect(findAvailableCountry(undefined, { countryId: 'USA' })).toBeUndefined();
  });
});

describe('formatCountryE164', () => {
  it('should format a national number with the ISO country id', () => {
    expect(
      formatCountryE164('650 849 8195', availableCountries[2]),
    ).toEqual('+16508498195');
  });

  it('should format a national number of a country id that is not ISO alpha-3', () => {
    expect(formatCountryE164('030901820', availableCountries[1])).toEqual(
      '+4930901820',
    );
  });

  it('should keep an e164 number as is', () => {
    expect(formatCountryE164('+49 30 901820', availableCountries[1])).toEqual(
      '+4930901820',
    );
  });
});

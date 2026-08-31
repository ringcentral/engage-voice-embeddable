import { checkCountryCode } from 'src/lib/checkCountryCode';

describe('checkCountryCode', () => {
  it('should throw error when phonenumber is e164 of other country  expect US/CA', () => {
    let error = null;
    try {
      const phonenumber = '+8618877679909';
      checkCountryCode(phonenumber);
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Error Type: NO_SUPPORT_COUNTRY');
  });
  it('should throw error when  phonenumber is e164 of other country expect US/CA', () => {
    let error = null;
    try {
      const phonenumber = '+44 (20) 3743-3124';
      checkCountryCode(phonenumber);
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Error Type: NO_SUPPORT_COUNTRY');
  });

  it('should not throw error when phonenumber is e164 of US/CA', () => {
    const phonenumber = '+1 650 849 8195';
    checkCountryCode(phonenumber);
  });

  it('should not throw error when phonenumber is local number', () => {
    const phonenumber = '650 849 8195';
    checkCountryCode(phonenumber);
  });

  it('should not throw error when country id is not ISO alpha-3 but dialing code matches', () => {
    // agent config uses `GER` for Germany while ISO alpha-3 is `DEU`
    const phonenumber = '+49 30 901820';
    checkCountryCode(phonenumber, [
      { countryId: 'USA', countryCode: '1' },
      { countryId: 'GER', countryCode: '49' },
    ]);
  });

  it('should throw error when phonenumber country is not in available countries', () => {
    let error = null;
    try {
      const phonenumber = '+49 30 901820';
      checkCountryCode(phonenumber, [
        { countryId: 'USA', countryCode: '1' },
        { countryId: 'GBR', countryCode: '44' },
      ]);
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Error Type: NO_SUPPORT_COUNTRY');
  });
});

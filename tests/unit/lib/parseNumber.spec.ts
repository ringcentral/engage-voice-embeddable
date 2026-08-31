import { parseNumber } from 'src/lib/parseNumber';

// `parseNumber` normalizes to E.164 because its callers feed the result
// straight to the agent library as a dial/transfer destination.
describe('parseNumber', () => {
  it('should return an e164 number if phoneNumber is a valid local number', () => {
    const phonenumber = '6508498195';
    const result = parseNumber(phonenumber);
    expect(result).toEqual('+16508498195');
  });

  it('should return an e164 number if phoneNumber is already e164', () => {
    const phonenumber = '+16508498195';
    const result = parseNumber(phonenumber);
    expect(result).toEqual('+16508498195');
  });

  it('should throw error if phoneNumber is invalid', () => {
    let error = null;
    try {
      const phonenumber = '%^&64238478';
      parseNumber(phonenumber);
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Error Type: INVALID_NUMBER');
  });

  it('should throw error if phoneNumber is empty', () => {
    let error = null;
    try {
      const phonenumber = '';
      parseNumber(phonenumber);
    } catch (e) {
      error = e;
    }
    expect(error.message).toEqual('Error Type: INVALID_NUMBER');
  });
});

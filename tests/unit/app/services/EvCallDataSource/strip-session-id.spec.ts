import { stripSessionId } from 'src/app/services/EvCallDataSource/strip-session-id';

describe('stripSessionId', () => {
  it('keeps the complete uii for a two-digit session id', () => {
    expect(stripSessionId('uii$12')).toBe('uii');
  });

  it('strips only the last separator', () => {
    expect(stripSessionId('ui$i$12')).toBe('ui$i');
  });

  it('leaves an unencoded id unchanged', () => {
    expect(stripSessionId('uii')).toBe('uii');
  });
});

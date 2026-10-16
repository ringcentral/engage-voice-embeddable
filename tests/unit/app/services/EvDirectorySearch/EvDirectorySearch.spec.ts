// Picking a corporate directory record on the transfer panel cancels the
// search still in flight, so a late response cannot drop the picked record.
// A cancelled request no longer touches its scope, so cancel has to lower the
// searching flag itself: left raised, the transfer panel treats the destination
// as unsettled and keeps Ask first, Transfer and To voicemail disabled for good.

jest.mock('@ringcentral-integration/next-core', () => ({
  action: (_target: any, _key: string, descriptor: PropertyDescriptor) =>
    descriptor,
  delegate:
    () =>
      (_target: any, _key: string, descriptor: PropertyDescriptor) =>
        descriptor,
  injectable: () => (target: any) => target,
  optional: () => () => undefined,
  state: () => undefined,
  RcModule: class {},
  PortManager: class {},
}));

jest.mock('src/app/services/EvAuth', () => ({ EvAuth: class {} }));
jest.mock('src/app/services/EvClient', () => ({ EvClient: class {} }));

import { EvDirectorySearch } from 'src/app/services/EvDirectorySearch/EvDirectorySearch';
import { directorySearchScopes } from 'src/app/services/EvDirectorySearch/EvDirectorySearch.interface';

const scope = directorySearchScopes.transferManualEntry;

const record = (id: string, extensionNumber: string) => ({
  id,
  extensionNumber,
  firstName: 'John',
  lastName: id,
  type: 'User',
});

function createDirectorySearch() {
  const pendingResponses: Array<(value: unknown) => void> = [];
  const evClient = {
    searchDirectory: jest.fn(
      () =>
        new Promise((resolve) => {
          pendingResponses.push(resolve);
        }),
    ),
  };
  const evAuth = {
    refreshEvToken: jest.fn(async () => true),
    beforeAgentLogout: jest.fn(),
  };
  const directorySearch = new (EvDirectorySearch as any)(evClient, evAuth, {
    shared: false,
  }) as EvDirectorySearch;
  return { directorySearch, evClient, pendingResponses };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('EvDirectorySearch cancel', () => {
  it('lowers the searching flag of a request still in flight and keeps the results', async () => {
    const { directorySearch, evClient, pendingResponses } =
      createDirectorySearch();
    const shown = [record('1', '101'), record('2', '102')];

    await directorySearch.search(scope, 'jo');
    await jest.advanceTimersByTimeAsync(400);
    pendingResponses.shift()!({ mainNumber: '+16505550100', records: shown });
    await jest.advanceTimersByTimeAsync(0);
    expect(directorySearch.getRecords(scope)).toEqual(shown);

    // A refined query goes out while the previous results are still listed
    await directorySearch.search(scope, 'john');
    await jest.advanceTimersByTimeAsync(400);
    expect(evClient.searchDirectory).toHaveBeenCalledTimes(2);
    expect(directorySearch.isSearching(scope)).toBe(true);

    await directorySearch.cancel(scope);

    expect(directorySearch.isSearching(scope)).toBe(false);
    expect(directorySearch.getRecords(scope)).toEqual(shown);

    // The stale response neither replaces the results nor raises the flag
    pendingResponses.shift()!({
      mainNumber: '+16505550100',
      records: [record('3', '103')],
    });
    await jest.advanceTimersByTimeAsync(0);
    expect(directorySearch.isSearching(scope)).toBe(false);
    expect(directorySearch.getRecords(scope)).toEqual(shown);
  });

  it('drops a search still waiting out its debounce', async () => {
    const { directorySearch, evClient } = createDirectorySearch();

    await directorySearch.search(scope, 'jo');
    await directorySearch.cancel(scope);
    await jest.advanceTimersByTimeAsync(400);

    expect(evClient.searchDirectory).not.toHaveBeenCalled();
    expect(directorySearch.isSearching(scope)).toBe(false);
  });

  it('leaves the other scope searching', async () => {
    const { directorySearch } = createDirectorySearch();

    await directorySearch.search(directorySearchScopes.dialer, 'jo');
    await jest.advanceTimersByTimeAsync(400);
    expect(directorySearch.isSearching(directorySearchScopes.dialer)).toBe(
      true,
    );

    await directorySearch.cancel(scope);

    expect(directorySearch.isSearching(directorySearchScopes.dialer)).toBe(
      true,
    );
    expect((directorySearch as any).searches[scope]).toBeUndefined();
  });
});

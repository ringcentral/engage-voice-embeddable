import { hasInboundQueueOrOutdialGroup } from 'src/app/utils/hasInboundQueueOrOutdialGroup';

describe('hasInboundQueueOrOutdialGroup', () => {
  it('returns false when no inbound queue and no outdial group are selected', () => {
    expect(
      hasInboundQueueOrOutdialGroup({
        selectedInboundQueueIds: [],
        dialGroupId: '',
      }),
    ).toBe(false);
  });

  it('returns true when at least one inbound queue is selected', () => {
    expect(
      hasInboundQueueOrOutdialGroup({
        selectedInboundQueueIds: ['queue-1'],
        dialGroupId: '',
      }),
    ).toBe(true);
  });

  it('returns true when an outdial group is selected', () => {
    expect(
      hasInboundQueueOrOutdialGroup({
        selectedInboundQueueIds: [],
        dialGroupId: 'group-1',
      }),
    ).toBe(true);
  });

  it('returns true when both an inbound queue and an outdial group are selected', () => {
    expect(
      hasInboundQueueOrOutdialGroup({
        selectedInboundQueueIds: ['queue-1'],
        dialGroupId: 'group-1',
      }),
    ).toBe(true);
  });
});

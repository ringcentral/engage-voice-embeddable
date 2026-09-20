/**
 * Session config is valid when the agent selected at least one inbound queue
 * or an outdial (dial) group.
 */
export function hasInboundQueueOrOutdialGroup({
  selectedInboundQueueIds = [],
  dialGroupId = '',
}: {
  readonly selectedInboundQueueIds?: readonly string[];
  readonly dialGroupId?: string;
}): boolean {
  const hasInboundQueueSelected = selectedInboundQueueIds.length > 0;
  const hasOutdialGroupSelected = Boolean(dialGroupId);
  return hasInboundQueueSelected || hasOutdialGroupSelected;
}

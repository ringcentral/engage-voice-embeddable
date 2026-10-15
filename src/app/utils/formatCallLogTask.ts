import type { EvCallDispositionData } from '../services/EvCallDisposition/EvCallDisposition.interface';

export interface CallLogTask extends EvCallDispositionData {
  dispositionName: string | null;
}

/**
 * Build the `task` of an `rc-ev-logCall` request for a live or just-ended
 * call.
 *
 * Adds `dispositionName`, the label of the selected disposition from the
 * call's pick list, so third parties need not map `dispositionId` themselves.
 * It is `null` when nothing is selected or the id is not in the pick list.
 */
export function formatCallLogTask(
  disposition: EvCallDispositionData | null | undefined,
  pickList: ReadonlyArray<{ readonly dispositionId: string; readonly label: string }>,
): CallLogTask | undefined {
  if (!disposition) {
    return undefined;
  }
  const { dispositionId } = disposition;
  const dispositionItem = dispositionId
    ? pickList.find(p => p.dispositionId === dispositionId)
    : undefined;
  return {
    ...disposition,
    dispositionName: dispositionItem?.label || null,
  };
}

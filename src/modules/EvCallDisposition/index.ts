import { Module } from '@ringcentral-integration/commons/lib/di';

import { EvCallDisposition as BaseEvCallDisposition } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDisposition';

@Module({
  deps: [],
})
class EvCallDisposition extends BaseEvCallDisposition {
  // override to fix call disposition undefined issue.
  override disposeCall(id: string) {
    const call = this._deps.evCallHistory.callsMapping[id];
    const callDisposition = this.callsMapping[id];
    if (!callDisposition) {
      return;
    }
    const isDisposed =
      this.dispositionStateMapping[id] &&
      this.dispositionStateMapping[id].disposed;
    if (!call.outdialDispositions || isDisposed) return;

    this._deps.evClient.dispositionCall({
      uii: call.uii,
      dispId: callDisposition.dispositionId,
      notes: callDisposition.notes,
    });

    this.setDispositionState(id, { disposed: true });
  }
}

export { EvCallDisposition };

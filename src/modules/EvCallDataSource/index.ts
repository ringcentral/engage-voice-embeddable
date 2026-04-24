import { Module } from '@ringcentral-integration/commons/lib/di';
import { EvCallDataSource as BaseEvCallDataSource } from '@ringcentral-integration/engage-voice-widgets/modules/EvCallDataSource';

import type {
  EvCallData,
  EvEvRequeueCallGate,
} from '@ringcentral-integration/engage-voice-widgets/interfaces/EvData.interface';

@Module({
  deps: [],
})
export class EvCallDataSource extends BaseEvCallDataSource {
  _getCurrentGateData(call: Partial<EvCallData>): EvEvRequeueCallGate {
    const currentGateId = call.queue.number;
    const currentQueueGroup = this._deps.evAuth.availableRequeueQueues.find(
      ({ gates }) => {
        // Fix gates empty issue
        if (!gates) return false;
        return gates.some(({ gateId }) => gateId === currentGateId);
      },
    );
    return {
      gateId: currentGateId,
      gateGroupId: currentQueueGroup?.gateGroupId,
    };
  }
}
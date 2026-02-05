import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import {
  action,
  computed,
  injectable,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { requeueEvents } from '../../../enums';
import { t } from './i18n';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvActiveCallControl } from '../EvActiveCallControl';
import type {
  EvRequeueCallOptions,
  EvRequeueCallStatus,
} from './EvRequeueCall.interface';

/**
 * EvRequeueCall module - Call requeue operations
 * Handles requeuing calls to different queues
 */
@injectable({
  name: 'EvRequeueCall',
})
class EvRequeueCall extends RcModule {
  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private activeCallControl: EvActiveCallControl,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    @optional('EvRequeueCallOptions')
    private evRequeueCallOptions?: EvRequeueCallOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  selectedQueueGroupId = '';

  @storage
  @state
  selectedGateId = '';

  @storage
  @state
  stayOnCall = false;

  @storage
  @state
  requeuing = false;

  /**
   * Check if the current call allows requeue
   */
  @computed((that: EvRequeueCall) => [
    that.evCall.currentCall,
    that.evAuth.agentPermissions,
  ])
  get allowRequeueCall(): boolean {
    const { currentCall } = this.evCall;
    let result = true;
    if (currentCall && !currentCall.endedCall) {
      if (!currentCall.allowRequeue) {
        result = false;
      } else if (
        !this.evAuth.agentPermissions?.allowCrossQueueRequeue &&
        currentCall.callType === 'OUTBOUND' &&
        currentCall.requeueType === 'ADVANCED'
      ) {
        result = false;
      } else if (!this._hasRequeueQueues(currentCall)) {
        result = false;
      }
    }
    return result;
  }

  @action
  setStatus({
    selectedQueueGroupId,
    selectedGateId,
    stayOnCall,
    requeuing,
  }: EvRequeueCallStatus) {
    if (selectedQueueGroupId !== undefined) {
      this.selectedQueueGroupId = selectedQueueGroupId;
    }
    if (selectedGateId !== undefined) {
      this.selectedGateId = selectedGateId;
    }
    if (stayOnCall !== undefined) {
      this.stayOnCall = stayOnCall;
    }
    if (requeuing !== undefined) {
      this.requeuing = requeuing;
    }
  }

  /**
   * Requeue the current call to a different queue
   */
  async requeueCall(): Promise<void> {
    try {
      this.setStatus({ requeuing: true });
      this.toast.info({
        message: t(requeueEvents.START),
      });

      const result = await this.evClient.requeueCall({
        maintain: this.stayOnCall,
        queueId: this.selectedGateId,
      });

      if (result.status === 'FAILURE') {
        throw new Error('Requeue failed');
      }

      if (this.stayOnCall) {
        await this.activeCallControl.hold();
      }

      this.toast.success({
        message: t(requeueEvents.SUCCESS),
      });
    } catch (error) {
      this.toast.danger({
        message: t(requeueEvents.FAILURE),
      });
      throw error;
    } finally {
      this.setStatus({ requeuing: false });
    }
  }

  /**
   * Check if the call has requeue queues available
   */
  private _hasRequeueQueues(currentCall: any): boolean {
    let result = false;
    if (currentCall.requeueType === 'ADVANCED') {
      const queues = this.evAuth.availableQueues;
      result = queues && queues.length > 0;
    } else {
      const shortcuts = currentCall.requeueShortcuts;
      result = shortcuts && shortcuts.length > 0;
    }
    return result;
  }
}

export { EvRequeueCall };

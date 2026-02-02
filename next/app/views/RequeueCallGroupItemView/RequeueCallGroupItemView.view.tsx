import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useState, useMemo } from 'react';

import { EvAuth } from '../../services/EvAuth';
import { EvClient } from '../../services/EvClient';
import type {
  RequeueCallGroupItemViewOptions,
  RequeueCallGroupItemViewProps,
} from './RequeueCallGroupItemView.interface';
import i18n from './i18n';

/**
 * RequeueCallGroupItemView - Queue selection view within a group
 * Allows selecting a specific queue from a group to requeue the call
 */
@injectable({
  name: 'RequeueCallGroupItemView',
})
class RequeueCallGroupItemView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _evClient: EvClient,
    private _router: RouterPlugin,
    @optional('RequeueCallGroupItemViewOptions')
    private _options?: RequeueCallGroupItemViewOptions,
  ) {
    super();
  }

  async requeueCall(gateId: string, maintain: boolean = false) {
    try {
      await this._evClient.requeueCall({
        queueId: gateId,
        skillId: '',
        maintain,
      });
      this._options?.onRequeueComplete?.();
      this._router.push('/calls');
    } catch (error) {
      console.error('Requeue failed:', error);
    }
  }

  cancel() {
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(props?: RequeueCallGroupItemViewProps) {
    const { t } = useLocale(i18n);
    const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

    const { requeueGroups } = useConnector(() => ({
      requeueGroups: this._evAuth.availableRequeueQueues,
    }));

    const groupId = props?.groupId;

    const queues = useMemo(() => {
      const group = requeueGroups.find((g: any) => g.groupId === groupId);
      return group?.gates || [];
    }, [requeueGroups, groupId]);

    const handleSelectQueue = useCallback((queueId: string) => {
      setSelectedQueueId(queueId);
    }, []);

    const handleRequeue = useCallback(async () => {
      if (selectedQueueId) {
        await this.requeueCall(selectedQueueId);
      }
    }, [selectedQueueId]);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('selectQueue')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('chooseQueue')}
        </p>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {queues.length === 0 ? (
            <div className="text-center text-neutral-b2 py-8">
              {t('noQueues')}
            </div>
          ) : (
            queues.map((queue: any) => (
              <button
                key={queue.gateId}
                type="button"
                onClick={() => handleSelectQueue(queue.gateId)}
                className={`w-full p-4 mb-2 border rounded-lg text-left transition-colors ${
                  selectedQueueId === queue.gateId
                    ? 'border-primary-b bg-primary-t10'
                    : 'border-neutral-b4 bg-neutral-base hover:bg-neutral-b5'
                }`}
              >
                <div className="typography-subtitle truncate">
                  {queue.gateName}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          onClick={handleRequeue}
          disabled={!selectedQueueId}
          className="w-full py-3 mb-2 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('requeue')}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }
}

export { RequeueCallGroupItemView };

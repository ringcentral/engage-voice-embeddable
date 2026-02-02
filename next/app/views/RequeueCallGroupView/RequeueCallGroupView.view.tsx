import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import { EvAuth } from '../../services/EvAuth';
import type {
  RequeueCallGroupViewOptions,
  RequeueCallGroupViewProps,
} from './RequeueCallGroupView.interface';
import i18n from './i18n';

/**
 * RequeueCallGroupView - Queue group selection view for requeue
 * Allows selecting a queue group to requeue the call
 */
@injectable({
  name: 'RequeueCallGroupView',
})
class RequeueCallGroupView extends RcViewModule {
  constructor(
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('RequeueCallGroupViewOptions')
    private _options?: RequeueCallGroupViewOptions,
  ) {
    super();
  }

  selectGroup(callId: string, groupId: string) {
    this._router.push(`/calls/${callId}/transferCall/queueGroup/${groupId}`);
  }

  cancel() {
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(props?: RequeueCallGroupViewProps) {
    const { t } = useLocale(i18n);

    const { requeueGroups } = useConnector(() => ({
      requeueGroups: this._evAuth.availableRequeueQueues,
    }));

    const callId = props?.id || 'current';

    const handleSelectGroup = useCallback(
      (groupId: string) => {
        this.selectGroup(callId, groupId);
      },
      [callId],
    );

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('requeueCall')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('selectGroup')}
        </p>

        {/* Queue Group List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {requeueGroups.length === 0 ? (
            <div className="text-center text-neutral-b2 py-8">
              {t('noGroups')}
            </div>
          ) : (
            requeueGroups.map((group: any) => (
              <button
                key={group.groupId}
                type="button"
                onClick={() => handleSelectGroup(group.groupId)}
                className="w-full p-4 mb-2 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
              >
                <div className="typography-subtitle truncate">
                  {group.groupName}
                </div>
                {group.gates?.length > 0 && (
                  <div className="typography-descriptor text-neutral-b2">
                    {group.gates.length} queue(s)
                  </div>
                )}
              </button>
            ))
          )}
        </div>

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

export { RequeueCallGroupView };

import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvCall } from '../../services/EvCall';
import type {
  TransferCallViewOptions,
  TransferCallViewProps,
} from './TransferCallView.interface';
import i18n from './i18n';

/**
 * TransferCallView - Main transfer options selection view
 * Provides options for internal, phone book, manual entry, and queue transfers
 */
@injectable({
  name: 'TransferCallView',
})
class TransferCallView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evCall: EvCall,
    private _router: RouterPlugin,
    @optional('TransferCallViewOptions')
    private _options?: TransferCallViewOptions,
  ) {
    super();
  }

  goToInternalTransfer(callId: string) {
    this._evTransferCall.changeTransferType(transferTypes.internal);
    this._router.push(`/calls/${callId}/transferCall/internal`);
  }

  goToPhoneBookTransfer(callId: string) {
    this._evTransferCall.changeTransferType(transferTypes.phoneBook);
    this._router.push(`/calls/${callId}/transferCall/phoneBook`);
  }

  goToManualEntryTransfer(callId: string) {
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
    this._router.push(`/calls/${callId}/transferCall/manualEntry`);
  }

  goToQueueTransfer(callId: string) {
    this._evTransferCall.changeTransferType(transferTypes.queue);
    this._router.push(`/calls/${callId}/transferCall/queueGroup`);
  }

  cancel() {
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(props?: TransferCallViewProps) {
    const { t } = useLocale(i18n);

    const { allowInternalTransfer, hasPhoneBook, hasRequeueQueues } = useConnector(() => ({
      allowInternalTransfer: this._evTransferCall.allowInternalTransfer,
      hasPhoneBook: this._evTransferCall.transferPhoneBook.length > 0,
      hasRequeueQueues: this._evCall.currentCall?.requeueShortcuts?.length ?? 0 > 0,
    }));

    const callId = props?.id || 'current';

    const handleInternalTransfer = useCallback(() => {
      this.goToInternalTransfer(callId);
    }, [callId]);

    const handlePhoneBookTransfer = useCallback(() => {
      this.goToPhoneBookTransfer(callId);
    }, [callId]);

    const handleManualEntryTransfer = useCallback(() => {
      this.goToManualEntryTransfer(callId);
    }, [callId]);

    const handleQueueTransfer = useCallback(() => {
      this.goToQueueTransfer(callId);
    }, [callId]);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-y-auto">
        <h1 className="typography-title mb-2">{t('transferCall')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('selectTransferType')}
        </p>

        <div className="flex-1 space-y-2">
          {/* Internal Transfer */}
          {allowInternalTransfer && (
            <button
              type="button"
              onClick={handleInternalTransfer}
              className="w-full p-4 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
            >
              <div className="typography-subtitle">{t('internal')}</div>
              <div className="typography-descriptor text-neutral-b2">
                {t('internalDesc')}
              </div>
            </button>
          )}

          {/* Phone Book Transfer */}
          {hasPhoneBook && (
            <button
              type="button"
              onClick={handlePhoneBookTransfer}
              className="w-full p-4 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
            >
              <div className="typography-subtitle">{t('phoneBook')}</div>
              <div className="typography-descriptor text-neutral-b2">
                {t('phoneBookDesc')}
              </div>
            </button>
          )}

          {/* Manual Entry Transfer */}
          <button
            type="button"
            onClick={handleManualEntryTransfer}
            className="w-full p-4 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
          >
            <div className="typography-subtitle">{t('manualEntry')}</div>
            <div className="typography-descriptor text-neutral-b2">
              {t('manualEntryDesc')}
            </div>
          </button>

          {/* Queue Transfer (Requeue) */}
          {hasRequeueQueues && (
            <button
              type="button"
              onClick={handleQueueTransfer}
              className="w-full p-4 border border-neutral-b4 rounded-lg bg-neutral-base hover:bg-neutral-b5 transition-colors text-left"
            >
              <div className="typography-subtitle">{t('queue')}</div>
              <div className="typography-descriptor text-neutral-b2">
                {t('queueDesc')}
              </div>
            </button>
          )}
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="w-full py-3 mt-4 border border-neutral-b4 text-neutral-b1 rounded-lg typography-subtitle hover:bg-neutral-b5 transition-colors"
        >
          {t('cancel')}
        </button>
      </div>
    );
  }
}

export { TransferCallView };

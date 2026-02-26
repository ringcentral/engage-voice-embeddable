import {
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import {
  AppFooterNav,
  AppHeaderNav,
} from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import {
  Select,
  TextField,
  Switch,
  Button,
} from '@ringcentral/spring-ui';
import React, { useCallback } from 'react';

import type { EvTransferType } from '../../../enums';
import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvCall } from '../../services/EvCall';
import { EvAuth } from '../../services/EvAuth';
import { EvRequeueCall } from '../../services/EvRequeueCall';
import type {
  TransferCallViewOptions,
  TransferCallViewProps,
} from './TransferCallView.interface';
import i18n from './i18n';

const TRANSFER_TYPE_LABELS: Record<string, string> = {
  [transferTypes.internal]: 'internal',
  [transferTypes.phoneBook]: 'phoneBook',
  [transferTypes.manualEntry]: 'manualEntry',
  [transferTypes.queue]: 'queue',
};

/**
 * TransferCallView - Transfer confirmation page.
 * Shows selected transfer type, recipient info, stay-on-call toggle,
 * and Transfer/Cancel buttons.
 */
@injectable({
  name: 'TransferCallView',
})
class TransferCallView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evCall: EvCall,
    private _evAuth: EvAuth,
    private _evRequeueCall: EvRequeueCall,
    private _router: RouterPlugin,
    @optional('TransferCallViewOptions')
    private _options?: TransferCallViewOptions,
  ) {
    super();
  }

  get callId(): string {
    return this._evCall.activityCallId;
  }

  get isQueueTransfer(): boolean {
    return this._evTransferCall.transferType === transferTypes.queue;
  }

  /**
   * Resolve display name from transfer type + selection state.
   * Ported from old EvTransferCallUI.selectedCallRecipient.
   */
  @computed((that: TransferCallView) => [
    that._evTransferCall.transferType,
    that._evTransferCall.transferAgentList,
    that._evTransferCall.transferAgentId,
    that._evTransferCall.transferPhoneBook,
    that._evTransferCall.transferPhoneBookSelectedIndex,
    that._evTransferCall.transferRecipientNumber,
    that._evTransferCall.transferRecipientCountryId,
    that._evAuth.availableCountries,
  ])
  get selectedCallRecipient(): string {
    const {
      transferType,
      transferAgentList,
      transferAgentId,
      transferPhoneBook,
      transferPhoneBookSelectedIndex,
      transferRecipientNumber,
      transferRecipientCountryId,
    } = this._evTransferCall;
    const { availableCountries } = this._evAuth;
    if (transferType === transferTypes.internal && transferAgentId) {
      const agent = transferAgentList.find(
        ({ agentId }) => agentId === transferAgentId,
      );
      return agent ? `${agent.firstName} ${agent.lastName}`.trim() : '';
    }
    if (
      transferType === transferTypes.phoneBook &&
      transferPhoneBookSelectedIndex !== null
    ) {
      const phoneBook = transferPhoneBook[transferPhoneBookSelectedIndex];
      if (!phoneBook) return '';
      if (phoneBook.countryId === 'USA') return phoneBook.name;
      const country = availableCountries.find(
        (c: any) => c.countryId === phoneBook.countryId,
      );
      return country
        ? `${phoneBook.name} (${country.countryName || country.countryId})`
        : `${phoneBook.name} (${phoneBook.countryId})`;
    }
    if (transferType === transferTypes.manualEntry && transferRecipientNumber) {
      if (transferRecipientCountryId === 'USA') return transferRecipientNumber;
      const country = availableCountries.find(
        (c: any) => c.countryId === transferRecipientCountryId,
      );
      return country
        ? `${transferRecipientNumber} (${country.countryName || country.countryId})`
        : transferRecipientNumber;
    }
    return '';
  }

  get transferCallDisabled(): boolean {
    if (this.isQueueTransfer) {
      return (
        this._evRequeueCall.requeuing ||
        !this._evRequeueCall.selectedGateId ||
        !!this._evCall.currentCall?.endedCall
      );
    }
    const { endedCall, allowTransfer } = this._evCall.currentCall ?? {};
    return (
      !allowTransfer ||
      !this.selectedCallRecipient ||
      !!endedCall ||
      this._evTransferCall.transferring
    );
  }

  async executeTransfer(): Promise<void> {
    try {
      if (this.isQueueTransfer) {
        await this._evRequeueCall.requeueCall();
      } else {
        await this._evTransferCall.transfer();
      }
      this._router.replace(`/activityCallLog/${this.callId}`);
    } catch (error) {
      this.logger.error('Transfer failed:', error);
    }
  }

  cancelTransfer(): void {
    this._evTransferCall.resetTransferStatus();
    this._options?.onCancel?.();
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  goBack(): void {
    this._router.replace(`/activityCallLog/${this.callId}`);
  }

  navigateToRecipientPage(type: EvTransferType): void {
    const base = `/activityCallLog/${this.callId}/transferCall`;
    switch (type) {
      case transferTypes.internal:
        this._router.replace(`${base}/internal`);
        break;
      case transferTypes.phoneBook:
        this._router.replace(`${base}/phoneBook`);
        break;
      case transferTypes.manualEntry:
        this._router.replace(`${base}/manualEntry`);
        break;
      case transferTypes.queue:
        this._router.replace(`${base}/queueGroup`);
        break;
    }
  }

  component(_props?: TransferCallViewProps) {
    const { t } = useLocale(i18n);

    const {
      transferType,
      selectedRecipient,
      recipientNumber,
      isStayOnCall,
      isDisabled,
      isTransferring,
      allowInternalTransfer,
      hasPhoneBook,
    } = useConnector(() => ({
      transferType: this._evTransferCall.transferType,
      selectedRecipient: this.selectedCallRecipient,
      recipientNumber: this._evTransferCall.getNumber(),
      isStayOnCall: this._evTransferCall.stayOnCall,
      isDisabled: this.transferCallDisabled,
      isTransferring: this._evTransferCall.transferring || this._evRequeueCall.requeuing,
      allowInternalTransfer: this._evTransferCall.allowInternalTransfer,
      hasPhoneBook: this._evTransferCall.transferPhoneBook.length > 0,
    }));

    const handleStayOnCallChange = useCallback(() => {
      this._evTransferCall.changeStayOnCall(isStayOnCall);
    }, [isStayOnCall]);

    const handleTransfer = useCallback(async () => {
      await this.executeTransfer();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancelTransfer();
    }, []);

    const handleGoBack = useCallback(() => {
      this.goBack();
    }, []);

    const handleRecipientClick = useCallback(() => {
      this.navigateToRecipientPage(transferType);
    }, [transferType]);

    const handleTransferTypeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newType = e.target.value as EvTransferType;
        this._evTransferCall.changeTransferType(newType);
        this.navigateToRecipientPage(newType);
      },
      [],
    );

    const typeOptions = [
      ...(allowInternalTransfer
        ? [{ value: transferTypes.internal, label: t('internal') }]
        : []),
      ...(hasPhoneBook
        ? [{ value: transferTypes.phoneBook, label: t('phoneBook') }]
        : []),
      { value: transferTypes.manualEntry, label: t('manualEntry') },
      { value: transferTypes.queue, label: t('queue') },
    ];

    const typeLabel = t(TRANSFER_TYPE_LABELS[transferType] ?? 'manualEntry');

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleGoBack}>
            {t('transfer')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-y-auto px-4 pt-4">
          <div className="mb-4">
            <Select
              data-sign="transferType"
              label={t('transferType')}
              value={transferType}
              onChange={handleTransferTypeChange}
              variant="outlined"
              size="medium"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="mb-4">
            <TextField
              data-sign="callRecipient"
              label={t('callRecipient')}
              value={selectedRecipient}
              placeholder={t('selectRecipient')}
              fullWidth
              clearBtn={false}
              inputProps={{ readOnly: true }}
              onClick={handleRecipientClick}
            />
          </div>

          {recipientNumber && recipientNumber !== selectedRecipient && (
            <div className="mb-4">
              <TextField
                data-sign="callRecipientNumber"
                label={t('callRecipientNumber')}
                value={recipientNumber}
                fullWidth
                clearBtn={false}
                inputProps={{ readOnly: true }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <Switch
              data-sign="stayOnCall"
              checked={isStayOnCall}
              onChange={handleStayOnCallChange}
            />
            <span className="typography-mainText">{t('stayOnCall')}</span>
          </div>

          <div className="flex-1" />

          <div className="flex gap-2 pb-4">
            <Button
              data-sign="cancelTransfer"
              variant="outlined"
              color="neutral"
              fullWidth
              onClick={handleCancel}
            >
              {t('cancel')}
            </Button>
            <Button
              data-sign="executeTransfer"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isDisabled}
              loading={isTransferring}
              onClick={handleTransfer}
            >
              {t('transfer')}
            </Button>
          </div>
        </div>

        <AppFooterNav />
      </>
    );
  }
}

export { TransferCallView };

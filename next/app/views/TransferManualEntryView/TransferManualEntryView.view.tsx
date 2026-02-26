import {
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
  DialTextField,
  DialDelete,
  IconButton,
  Button,
} from '@ringcentral/spring-ui';
import { BackspaceMd } from '@ringcentral/spring-icon';
import React, { useCallback, useState } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvCall } from '../../services/EvCall';
import type {
  TransferManualEntryViewOptions,
  TransferManualEntryViewProps,
} from './TransferManualEntryView.interface';
import i18n from './i18n';

/**
 * TransferManualEntryView - Manual phone number entry for transfer.
 * Presents a DialTextField for entering a number, then navigates
 * back to the transfer page on "Next" (two-step flow).
 */
@injectable({
  name: 'TransferManualEntryView',
})
class TransferManualEntryView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evCall: EvCall,
    private _router: RouterPlugin,
    @optional('TransferManualEntryViewOptions')
    private _options?: TransferManualEntryViewOptions,
  ) {
    super();
  }

  /**
   * Save the entered number, set transfer type, and navigate
   * forward to the transfer confirmation page.
   */
  next(phoneNumber: string) {
    this._evTransferCall.changeRecipientNumber(phoneNumber);
    this._evTransferCall.changeTransferType(transferTypes.manualEntry);
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}/transferCall`,
    );
  }

  cancel() {
    this._evTransferCall.resetTransferStatus();
    this._options?.onCancel?.();
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}`,
    );
  }

  component(_props?: TransferManualEntryViewProps) {
    const { t } = useLocale(i18n);

    const { initialNumber } = useConnector(() => ({
      initialNumber: this._evTransferCall.transferRecipientNumber,
    }));

    const [inputValue, setInputValue] = useState(initialNumber);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    const handleNext = useCallback(() => {
      this.next(inputValue);
    }, [inputValue]);

    const handleDelete = useCallback(() => {
      setInputValue((prev) => prev.slice(0, -1));
    }, []);

    const handleClear = useCallback(() => {
      setInputValue('');
    }, []);

    const isValid = inputValue.trim().length > 0;

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleCancel}>
            {t('callRecipient')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
          <div className="px-4 pt-6">
            <DialTextField
              data-sign="numberField"
              value={inputValue}
              onChange={setInputValue}
              placeholder={t('dialPlaceholder')}
              fullWidth
              onlyAllowKeypadValue
              endAdornment={
                isValid ? (
                  <DialDelete onDelete={handleDelete} onClear={handleClear}>
                    <IconButton
                      symbol={BackspaceMd}
                      variant="icon"
                      size="small"
                      color="neutral"
                      data-sign="deleteButton"
                    />
                  </DialDelete>
                ) : undefined
              }
            />
          </div>
          <div className="flex-1" />
          <div className="px-4 py-4">
            <Button
              data-sign="nextButton"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid}
              onClick={handleNext}
            >
              {t('next')}
            </Button>
          </div>
        </div>

        <AppFooterNav />
      </>
    );
  }
}

export { TransferManualEntryView };

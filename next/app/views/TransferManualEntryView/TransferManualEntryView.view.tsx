import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback } from 'react';

import { EvTransferCall } from '../../services/EvTransferCall';
import { EvAuth } from '../../services/EvAuth';
import type {
  TransferManualEntryViewOptions,
  TransferManualEntryViewProps,
} from './TransferManualEntryView.interface';
import i18n from './i18n';

/**
 * TransferManualEntryView - Manual phone number entry transfer view
 * Allows entering a custom phone number for transfer
 */
@injectable({
  name: 'TransferManualEntryView',
})
class TransferManualEntryView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evAuth: EvAuth,
    private _router: RouterPlugin,
    @optional('TransferManualEntryViewOptions')
    private _options?: TransferManualEntryViewOptions,
  ) {
    super();
  }

  setPhoneNumber(number: string) {
    this._evTransferCall.changeRecipientNumber(number);
  }

  setCountry(countryId: string) {
    this._evTransferCall.changeRecipientCountryId(countryId);
  }

  async warmTransfer() {
    try {
      const params = this._evTransferCall.parseManualEntryNumber();
      await this._evTransferCall.warmTransferCall(params);
      this._options?.onTransferComplete?.();
      this._router.push('/calls');
    } catch (error) {
      console.error('Warm transfer failed:', error);
    }
  }

  async coldTransfer() {
    try {
      const params = this._evTransferCall.parseManualEntryNumber();
      await this._evTransferCall.coldTransferCall(params);
      this._options?.onTransferComplete?.();
      this._router.push('/calls');
    } catch (error) {
      console.error('Cold transfer failed:', error);
    }
  }

  cancel() {
    this._evTransferCall.resetTransferStatus();
    this._options?.onCancel?.();
    this._router.goBack();
  }

  component(_props?: TransferManualEntryViewProps) {
    const { t } = useLocale(i18n);

    const { phoneNumber, countryId, countries, transferring } = useConnector(() => ({
      phoneNumber: this._evTransferCall.transferRecipientNumber,
      countryId: this._evTransferCall.transferRecipientCountryId,
      countries: this._evAuth.availableCountries,
      transferring: this._evTransferCall.transferring,
    }));

    const handlePhoneChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setPhoneNumber(e.target.value);
      },
      [],
    );

    const handleCountryChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setCountry(e.target.value);
      },
      [],
    );

    const handleWarmTransfer = useCallback(async () => {
      await this.warmTransfer();
    }, []);

    const handleColdTransfer = useCallback(async () => {
      await this.coldTransfer();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    const isValid = phoneNumber.trim().length > 0;

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('manualTransfer')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-6">
          {t('enterNumber')}
        </p>

        {/* Phone Number Input */}
        <div className="mb-4">
          <label className="typography-subtitle block mb-2">
            {t('phoneNumber')}
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Enter phone number"
            className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
          />
        </div>

        {/* Country Select */}
        {countries.length > 1 && (
          <div className="mb-6">
            <label className="typography-subtitle block mb-2">
              {t('country')}
            </label>
            <select
              value={countryId}
              onChange={handleCountryChange}
              className="w-full p-3 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
            >
              {countries.map((country: any) => (
                <option key={country.countryId} value={country.countryId}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1" />

        {/* Transfer Buttons */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={handleWarmTransfer}
            disabled={!isValid || transferring}
            className="flex-1 py-3 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('warmTransfer')}
          </button>
          <button
            type="button"
            onClick={handleColdTransfer}
            disabled={!isValid || transferring}
            className="flex-1 py-3 bg-success text-neutral-w0 rounded-lg typography-subtitle hover:bg-success-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('coldTransfer')}
          </button>
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

export { TransferManualEntryView };

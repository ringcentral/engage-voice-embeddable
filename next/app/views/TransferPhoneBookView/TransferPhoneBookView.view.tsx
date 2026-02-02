import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import React, { useCallback, useState } from 'react';

import { EvTransferCall } from '../../services/EvTransferCall';
import type {
  TransferPhoneBookViewOptions,
  TransferPhoneBookViewProps,
} from './TransferPhoneBookView.interface';
import i18n from './i18n';

/**
 * TransferPhoneBookView - Phone book transfer view
 * Allows selecting a contact from the phone book for transfer
 */
@injectable({
  name: 'TransferPhoneBookView',
})
class TransferPhoneBookView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _router: RouterPlugin,
    @optional('TransferPhoneBookViewOptions')
    private _options?: TransferPhoneBookViewOptions,
  ) {
    super();
  }

  selectContact(index: number) {
    this._evTransferCall.changeTransferPhoneBookSelected(index);
  }

  async warmTransfer() {
    try {
      const params = this._evTransferCall.parsePhoneBookNumber();
      await this._evTransferCall.warmTransferCall(params);
      this._options?.onTransferComplete?.();
      this._router.push('/calls');
    } catch (error) {
      console.error('Warm transfer failed:', error);
    }
  }

  async coldTransfer() {
    try {
      const params = this._evTransferCall.parsePhoneBookNumber();
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

  component(_props?: TransferPhoneBookViewProps) {
    const { t } = useLocale(i18n);
    const [searchTerm, setSearchTerm] = useState('');

    const { phoneBook, selectedIndex, transferring } = useConnector(() => ({
      phoneBook: this._evTransferCall.transferPhoneBook,
      selectedIndex: this._evTransferCall.transferPhoneBookSelectedIndex,
      transferring: this._evTransferCall.transferring,
    }));

    const filteredContacts = phoneBook.filter((contact) => {
      const name = contact.phoneBookName.toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
      },
      [],
    );

    const handleSelectContact = useCallback((index: number) => {
      this.selectContact(index);
    }, []);

    const handleWarmTransfer = useCallback(async () => {
      await this.warmTransfer();
    }, []);

    const handleColdTransfer = useCallback(async () => {
      await this.coldTransfer();
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <div className="flex flex-col h-full bg-neutral-base p-4 overflow-hidden">
        <h1 className="typography-title mb-2">{t('phoneBookTransfer')}</h1>
        <p className="typography-descriptor text-neutral-b2 mb-4">
          {t('selectContact')}
        </p>

        {/* Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={t('searchContacts')}
          className="w-full p-3 mb-4 border border-neutral-b4 rounded-lg bg-neutral-base typography-mainText"
        />

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto mb-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center text-neutral-b2 py-8">
              {t('noContacts')}
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.phoneBookItemIndex}
                type="button"
                onClick={() => handleSelectContact(contact.phoneBookItemIndex)}
                className={`w-full p-3 mb-2 border rounded-lg text-left transition-colors ${
                  selectedIndex === contact.phoneBookItemIndex
                    ? 'border-primary-b bg-primary-t10'
                    : 'border-neutral-b4 bg-neutral-base hover:bg-neutral-b5'
                }`}
              >
                <div className="typography-subtitle truncate">
                  {contact.phoneBookName}
                </div>
                <div className="typography-descriptor text-neutral-b2 truncate">
                  {contact.parsedDestination || contact.destination}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Transfer Buttons */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={handleWarmTransfer}
            disabled={selectedIndex === null || transferring}
            className="flex-1 py-3 bg-primary-b text-neutral-w0 rounded-lg typography-subtitle hover:bg-primary-f transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('warmTransfer')}
          </button>
          <button
            type="button"
            onClick={handleColdTransfer}
            disabled={selectedIndex === null || transferring}
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

export { TransferPhoneBookView };

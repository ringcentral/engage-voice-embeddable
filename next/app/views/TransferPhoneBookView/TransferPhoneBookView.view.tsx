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
  TextField,
  VirtualizedList,
  ListItem,
  ListItemText,
} from '@ringcentral/spring-ui';
import React, { useCallback, useState } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvCall } from '../../services/EvCall';
import type {
  TransferPhoneBookViewOptions,
  TransferPhoneBookViewProps,
} from './TransferPhoneBookView.interface';
import i18n from './i18n';

/**
 * TransferPhoneBookView - Phone book contact selection for transfer.
 * Selecting a contact saves the selection and navigates to the
 * transfer confirmation page (two-step flow).
 */
@injectable({
  name: 'TransferPhoneBookView',
})
class TransferPhoneBookView extends RcViewModule {
  constructor(
    private _evTransferCall: EvTransferCall,
    private _evCall: EvCall,
    private _router: RouterPlugin,
    @optional('TransferPhoneBookViewOptions')
    private _options?: TransferPhoneBookViewOptions,
  ) {
    super();
  }

  /**
   * Save the selected contact and navigate to the transfer confirmation page.
   */
  selectContact(index: number): void {
    this._evTransferCall.changeTransferPhoneBookSelected(index);
    this._evTransferCall.changeTransferType(transferTypes.phoneBook);
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}/transferCall`,
    );
  }

  cancel(): void {
    this._router.replace(
      `/activityCallLog/${this._evCall.activityCallId}`,
    );
  }

  component(_props?: TransferPhoneBookViewProps) {
    const { t } = useLocale(i18n);
    const [searchTerm, setSearchTerm] = useState('');

    const { phoneBook } = useConnector(() => ({
      phoneBook: this._evTransferCall.transferPhoneBook,
    }));

    const filteredContacts = phoneBook.filter((contact) => {
      if (!searchTerm) return true;
      const text = searchTerm.toLowerCase();
      return (
        contact.phoneBookName?.toLowerCase().includes(text) ||
        contact.destination?.includes(text) ||
        contact.parsedDestination?.includes(text)
      );
    });

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(e.target.value);
      },
      [],
    );

    const handleSelectContact = useCallback((index: number) => {
      this.selectContact(index);
    }, []);

    const handleCancel = useCallback(() => {
      this.cancel();
    }, []);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={handleCancel}>
            {t('phoneBookTransfer')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <TextField
              data-sign="searchContacts"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t('searchContacts')}
              fullWidth
              size="medium"
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {filteredContacts.length === 0 ? (
              <div className="text-center text-neutral-b2 py-8 typography-mainText">
                {t('noContacts')}
              </div>
            ) : (
              <VirtualizedList
                data={filteredContacts}
                computeItemKey={(_index, contact) =>
                  String(contact.phoneBookItemIndex)
                }
              >
                {(_index, contact) => (
                  <ListItem
                    data-sign="phoneContact"
                    onClick={() =>
                      handleSelectContact(contact.phoneBookItemIndex)
                    }
                    size="large"
                  >
                    <ListItemText
                      primary={contact.phoneBookName}
                      secondary={
                        contact.parsedDestination || contact.destination
                      }
                    />
                  </ListItem>
                )}
              </VirtualizedList>
            )}
          </div>
        </div>

        <AppFooterNav />
      </>
    );
  }
}

export { TransferPhoneBookView };

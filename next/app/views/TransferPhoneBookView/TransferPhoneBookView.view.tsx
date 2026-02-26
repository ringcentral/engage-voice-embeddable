import {
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  useConnector,
  type UIProps,
  type UIFunctions,
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
import React, { useMemo, useRef, useState } from 'react';

import { transferTypes } from '../../../enums';
import { EvTransferCall } from '../../services/EvTransferCall';
import type { EvTransferPhoneBookItem } from '../../services/EvTransferCall/EvTransferCall.interface';
import { EvCall } from '../../services/EvCall';
import type {
  TransferPhoneBookViewOptions,
  TransferPhoneBookViewProps,
  TransferPhoneBookViewUIProps,
  TransferPhoneBookViewUIFunctions,
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

  /**
   * Get UI state props for the component
   */
  getUIProps(): UIProps<TransferPhoneBookViewUIProps> {
    return {
      phoneBook: this._evTransferCall.transferPhoneBook,
    };
  }

  /**
   * Get UI action functions for the component
   */
  getUIFunctions(): UIFunctions<TransferPhoneBookViewUIFunctions> {
    return {
      onSelectContact: (index: number) => this.selectContact(index),
      onCancel: () => this.cancel(),
    };
  }

  component(_props?: TransferPhoneBookViewProps) {
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());
    const uiProps = useConnector(() => this.getUIProps());
    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = useMemo(() => {
      if (!searchTerm) return uiProps.phoneBook;
      const text = searchTerm.toLowerCase();
      return uiProps.phoneBook.filter(
        (contact) =>
          contact.phoneBookName?.toLowerCase().includes(text) ||
          contact.destination?.includes(text) ||
          contact.parsedDestination?.includes(text),
      );
    }, [uiProps.phoneBook, searchTerm]);

    return (
      <>
        <AppHeaderNav override>
          <PageHeader onBackClick={uiFunctions.onCancel}>
            {t('phoneBookTransfer')}
          </PageHeader>
        </AppHeaderNav>

        <div className="flex flex-col flex-1 bg-neutral-base overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <TextField
              data-sign="searchContacts"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <VirtualizedList<EvTransferPhoneBookItem>
                data={filteredContacts}
                computeItemKey={(_index, contact) =>
                  String(contact.phoneBookItemIndex)
                }
              >
                {(_index, contact) => (
                  <ListItem
                    data-sign="phoneContact"
                    onClick={() =>
                      uiFunctions.onSelectContact(contact.phoneBookItemIndex)
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

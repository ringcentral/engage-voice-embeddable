import { Locale, Toast } from '@ringcentral-integration/micro-core/src/app/services';
import { format, formatTypes, isE164, parse } from '@ringcentral-integration/phone-number';
import { alpha2ToAlpha3, alpha3ToAlpha2 } from 'i18n-iso-countries';
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
import { EventEmitter } from 'events';

import type { EvTransferType, TransferStatus } from '../../../enums';
import {
  transferTypes,
  transferStatuses,
  transferEvents,
  transferErrors,
  messageTypes,
} from '../../../enums';
import { parseNumber } from '../../../lib/parseNumber';
import { checkCountryCode } from '../../../lib/checkCountryCode';
import { EvTypeError } from '../../../lib/EvTypeError';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvWorkingState } from '../EvWorkingState';
import { EvSubscription } from '../EvSubscription';
import { EvAgentSession } from '../EvAgentSession';
import type {
  EvTransferCallOptions,
  EvTransferPhoneBookItem,
  EvDirectAgentListItem,
  EvReceivedTransferCall,
  TransferCallParams,
} from './EvTransferCall.interface';

/**
 * EvTransferCall module - Call transfer management
 * Handles warm/cold transfer, internal transfer, and phone book transfers
 */
@injectable({
  name: 'EvTransferCall',
})
class EvTransferCall extends RcModule {
  private _eventEmitter = new EventEmitter();
  private _transferDest: string | null = null;

  constructor(
    private evClient: EvClient,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evWorkingState: EvWorkingState,
    private evSubscription: EvSubscription,
    private evAgentSession: EvAgentSession,
    private toast: Toast,
    private locale: Locale,
    private storagePlugin: StoragePlugin,
    @optional('EvTransferCallOptions')
    private evTransferCallOptions?: EvTransferCallOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  receivedCall: EvReceivedTransferCall | null = null;

  @storage
  @state
  isTransferCancelable = false;

  @storage
  @state
  transferStatus: TransferStatus = transferStatuses.idle;

  @storage
  @state
  transferType: EvTransferType = transferTypes.phoneBook;

  @storage
  @state
  transferAgentId: string | null = null;

  @storage
  @state
  transferAgentList: EvDirectAgentListItem[] = [];

  @storage
  @state
  transferPhoneBookSelectedIndex: number | null = null;

  @storage
  @state
  transferRecipientNumber = '';

  @storage
  @state
  transferRecipientCountryId = 'USA';

  @storage
  @state
  stayOnCall = true;

  get transferring(): boolean {
    return this.transferStatus === transferStatuses.loading;
  }

  get allowManualInternationalTransfer(): boolean {
    return this.evCall.currentCall?.allowManualInternationalTransfer || false;
  }

  get allowInternalTransfer(): boolean {
    return this.evCall.currentCall?.allowDirectAgentTransfer !== '0';
  }

  get isInternalTransfer(): boolean {
    return this.transferType === transferTypes.internal;
  }

  @computed((that: EvTransferCall) => [
    that.evCall.currentCall,
    that.evAuth.availableCountries,
  ])
  get transferPhoneBook(): EvTransferPhoneBookItem[] {
    const currentCall = this.evCall.currentCall;
    if (!currentCall?.transferPhoneBook) {
      return [];
    }
    return currentCall.transferPhoneBook.reduce<EvTransferPhoneBookItem[]>(
      (prev, bookItem, index) => {
        const { countryId: itemCountryId, destination, name } = bookItem;
        let countryId = itemCountryId;
        if (!countryId && isE164(destination)) {
          const { parsedCountry } = parse({
            input: destination,
          });
          countryId = alpha2ToAlpha3(parsedCountry);
        }
        const country = this.evAuth.availableCountries.find(
          (c: any) => c.countryId === countryId,
        );
        if (!country) {
          return prev;
        }
        let parsedDestination = '';
        try {
          parsedDestination = format({
            phoneNumber: destination,
            countryCode: alpha3ToAlpha2(countryId),
            type: formatTypes.e164,
          });
        } catch (e) {
          // ignore
        }
        const countryName =
          countryId !== 'USA' ? country.countryName || countryId : '';
        const phoneBookName = `${name} ${countryName}`;
        prev.push({
          ...bookItem,
          countryId,
          phoneBookName,
          parsedDestination,
          phoneBookItemIndex: index,
        });
        return prev;
      },
      [],
    );
  }

  @action
  setReceivedCall(data: EvReceivedTransferCall | null) {
    this.receivedCall = data;
  }

  @action
  setCancelableTransfer(cancelable: boolean) {
    this.isTransferCancelable = cancelable;
  }

  @action
  resetTransferStatus() {
    this.receivedCall = null;
    this.transferType = transferTypes.phoneBook;
    this.transferAgentId = null;
    this.transferAgentList = [];
    this.transferPhoneBookSelectedIndex = null;
    this.transferRecipientNumber = '';
    this.transferRecipientCountryId = 'USA';
    this.stayOnCall = true;
    this.isTransferCancelable = false;
    this._transferDest = null;
  }

  @action
  changeStayOnCall(value: boolean) {
    this.stayOnCall = !value;
  }

  @action
  changeRecipientCountryId(countryId: string) {
    this.transferRecipientCountryId = countryId;
  }

  @action
  changeTransferType(type: EvTransferType) {
    this.transferType = type;
  }

  @action
  changeAgentList(data: EvDirectAgentListItem[]) {
    const currentAgent = data.find(
      ({ agentId }) => agentId === this.transferAgentId,
    );
    if (!currentAgent) {
      this.transferAgentId = null;
    }
    this.transferAgentList = data;
  }

  @action
  changeRecipientNumber(phoneNumber: string) {
    this.transferRecipientNumber = phoneNumber;
  }

  @action
  changeTransferPhoneBookSelected(index: number) {
    this.transferPhoneBookSelectedIndex = index;
  }

  @action
  changeTransferAgentId(agentId: string) {
    this.transferAgentId = agentId;
  }

  @action
  setTransferStatus(status: TransferStatus) {
    this.transferStatus = status;
  }

  /**
   * Parse manual entry number with country code check
   */
  parseManualEntryNumber(): TransferCallParams {
    if (!this.transferRecipientNumber) {
      throw new EvTypeError({
        type: transferErrors.RECIPIENT_NUMBER_ERROR,
        data: `Abnormal Transfer: this.transferRecipientNumber -> ${this.transferRecipientNumber}`,
      });
    }
    checkCountryCode(this.transferRecipientNumber, this.evAuth.availableCountries);
    const toNumber = parseNumber(this.transferRecipientNumber);
    return { dialDest: toNumber, countryId: this.transferRecipientCountryId };
  }

  /**
   * Parse phone book number with country code check
   */
  parsePhoneBookNumber(): TransferCallParams {
    if (this.transferPhoneBookSelectedIndex === null) {
      throw new EvTypeError({
        type: transferErrors.CONTACT_ID_ERROR,
        data: `Abnormal Transfer: this.transferPhoneBookSelected -> ${this.transferPhoneBookSelectedIndex}`,
      });
    }
    const transferPhoneBookSelected =
      this.transferPhoneBook[this.transferPhoneBookSelectedIndex];
    checkCountryCode(transferPhoneBookSelected.destination, this.evAuth.availableCountries);
    const toNumber = parseNumber(transferPhoneBookSelected.destination);
    return { dialDest: toNumber, countryId: transferPhoneBookSelected.countryId };
  }

  /**
   * Warm transfer call with international support
   */
  async warmTransferCall({ dialDest, countryId }: TransferCallParams): Promise<void> {
    const country = this.evAuth.availableCountries.find(
      (c: any) => c.countryId === countryId,
    );
    if (!country) {
      if (this.allowManualInternationalTransfer) {
        this._transferDest = dialDest;
        await this.evClient.warmTransferIntlCall({
          dialDest,
          countryId,
        });
      } else {
        throw new Error('Unexpected Error: ban transferring international call');
      }
    } else {
      this._transferDest = dialDest;
      await this.evClient.warmTransferCall({ dialDest });
    }
  }

  /**
   * Cold transfer call with international support
   */
  async coldTransferCall({ dialDest, countryId }: TransferCallParams): Promise<void> {
    const country = this.evAuth.availableCountries.find(
      (c: any) => c.countryId === countryId,
    );
    if (!country) {
      if (this.allowManualInternationalTransfer) {
        await this.evClient.coldTransferIntlCall({
          dialDest,
          countryId,
        });
      } else {
        // Ban transferring international call
      }
    } else {
      await this.evClient.coldTransferCall({ dialDest });
    }
  }

  async fetchAgentList(): Promise<void> {
    let data;
    try {
      const result = await this.evClient.fetchDirectAgentList();
      if (result) {
        data = result.agents;
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (Array.isArray(data)) {
        this.changeAgentList(data);
      }
    }
  }

  rejectTransferCall(): void {
    if (!this.receivedCall) return;
    this.evClient.rejectDirectAgentTransferCall(this.receivedCall.uii);
    this.setReceivedCall(null);
  }

  acceptTransferCall(): void {
    if (!this.receivedCall) return;
    this.evWorkingState.setWorkingStateWorking();
    setTimeout(() => this.setReceivedCall(null), 6000);
  }

  onTransferStart(handler: () => void): void {
    this._eventEmitter.on(transferEvents.START, handler);
  }

  onTransferEnd(handler: () => void): void {
    this._eventEmitter.on(transferEvents.END, handler);
  }

  onTransferError(handler: (error: any) => void): void {
    this._eventEmitter.on(transferEvents.ERROR, handler);
  }

  onTransferSuccess(handler: () => void): void {
    this._eventEmitter.on(transferEvents.SUCCESS, handler);
  }

  override onInitOnce() {
    this.evAgentSession.onTriggerConfig(() => {
      this.setTransferStatus(transferStatuses.idle);
    });
  }
}

export { EvTransferCall };

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
  directTransferStatues,
  directTransferTypes,
} from '../../../enums';
import { parseNumber } from '../../../lib/parseNumber';
import { checkCountryCode } from '../../../lib/checkCountryCode';
import { EvTypeError } from '../../../lib/EvTypeError';
import { EvClient } from '../EvClient';
import { EvCallbackTypes } from '../EvClient/enums';
import type { EvDirectAgentTransferResponse } from '../EvClient/interfaces';
import { EvAuth } from '../EvAuth';
import { EvCall } from '../EvCall';
import { EvActiveCallControl } from '../EvActiveCallControl';
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
 * countryId for a destination that is not a dialable phone number.
 *
 * `evAuth.availableCountries` always contains USA, so this reliably takes the
 * domestic branch in warm/coldTransferCall. A country left over from an earlier
 * manual-entry transfer would otherwise push the destination into
 * warmTransferIntlCall (throws) or coldTransferIntlCall (silently no-ops).
 */
const NON_PHONE_DEST_COUNTRY_ID = 'USA';

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
    private evActiveCallControl: EvActiveCallControl,
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

  /**
   * Whether `transferRecipientNumber` is already a fully-qualified EV
   * destination rather than a phone number -- a corporate directory pick is
   * `<mainNumber>*<ext>@RC_EXT`, which `parseNumber` rejects for the `*` and
   * `@`. Persisted alongside the number itself so a reload cannot leave the
   * number set with the flag lost and send it through the parser.
   */
  @storage
  @state
  transferRecipientSkipParse = false;

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
    this.transferRecipientSkipParse = false;
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

  /**
   * Set the manual-entry recipient. `skipParse` is written here rather than
   * through its own setter so the number and the flag can never disagree: any
   * caller that sets a plain phone number also clears the flag.
   */
  @action
  changeRecipientNumber(
    phoneNumber: string,
    options?: { skipParse?: boolean },
  ) {
    this.transferRecipientNumber = phoneNumber;
    this.transferRecipientSkipParse = !!options?.skipParse;
  }

  @action
  changeTransferPhoneBookSelected(index: number | null) {
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
    if (this.transferRecipientSkipParse) {
      return {
        dialDest: this.transferRecipientNumber,
        countryId: NON_PHONE_DEST_COUNTRY_ID,
      };
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
    if (!country && !this.allowManualInternationalTransfer) {
      throw new Error('Unexpected Error: ban transferring international call');
    }
    // Held only once the destination is known to be dialable, so a transfer
    // this module refuses to send never leaves the customer on hold.
    await this._holdBeforeWarmTransfer();
    this._transferDest = dialDest;
    if (!country) {
      await this.evClient.warmTransferIntlCall({
        dialDest,
        countryId,
      });
    } else {
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

  /**
   * Put the customer on hold before a warm transfer opens the consult leg,
   * when the account asks for it, so they do not hear the agent talk to the
   * transfer target. Same rule as eag, which holds on `allowWarmXferOnHold`
   * for both a destination (`CallService.warmXfer`) and a direct agent
   * (`CallService.directAgentTransfer`).
   *
   * The hold is awaited rather than fired alongside the transfer: it has to be
   * in place before the consult leg opens, and a hold the server rejects
   * aborts the transfer instead of transferring un-held.
   */
  private async _holdBeforeWarmTransfer(): Promise<void> {
    if (!this.evAuth.agentPermissions?.allowWarmXferOnHold) return;
    // Holding an already held call would only be answered with an error.
    // `isHold` is what the app writes on the call; `hold` is the raw SDK field.
    const currentCall = this.evCall.currentCall as
      | { isHold?: boolean; hold?: boolean }
      | null;
    if (currentCall?.isHold || currentCall?.hold) return;
    await this.evActiveCallControl.holdAndConfirm();
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

  /**
   * Parse number based on current transfer type.
   * Dispatches to parseManualEntryNumber or parsePhoneBookNumber.
   */
  parseNumber(): TransferCallParams | undefined {
    switch (this.transferType) {
      case transferTypes.phoneBook:
        return this.parsePhoneBookNumber();
      case transferTypes.manualEntry:
        return this.parseManualEntryNumber();
      default:
        return undefined;
    }
  }

  /**
   * Get the raw destination number for the current transfer type.
   */
  getNumber(): string {
    switch (this.transferType) {
      case transferTypes.phoneBook:
        return this.transferPhoneBook[this.transferPhoneBookSelectedIndex!]
          ?.destination ?? '';
      case transferTypes.manualEntry:
        return this.transferRecipientNumber;
      default:
        return '';
    }
  }

  /**
   * Route a transfer call as warm or cold based on stayOnCall setting.
   */
  async transferCall({ dialDest, countryId }: TransferCallParams): Promise<void> {
    if (this.stayOnCall) {
      await this.warmTransferCall({ dialDest, countryId });
    } else {
      await this.coldTransferCall({ dialDest, countryId });
    }
  }

  /**
   * Perform an internal (direct agent) transfer, warm or cold based on stayOnCall.
   */
  async internalTransferCall(): Promise<void> {
    if (!this.transferAgentId) {
      throw new EvTypeError({
        type: transferErrors.AGENT_ID_ERROR,
        data: `Abnormal Transfer: this.transferAgentId -> ${this.transferAgentId}`,
      });
    }
    try {
      await this.fetchAgentList();
    } catch (e) {
      console.warn('fetch agent list error');
      console.error(e);
    }
    if (this.stayOnCall) {
      await this._holdBeforeWarmTransfer();
      await this.evClient.warmDirectAgentTransfer(this.transferAgentId);
    } else {
      await this.evClient.coldDirectAgentTransfer(this.transferAgentId);
    }
  }

  /**
   * Orchestrate the full transfer flow: parse number, set status, dispatch by type.
   */
  async transfer(): Promise<void> {
    try {
      const parsed = this.parseNumber();
      this._eventEmitter.emit(transferEvents.START);
      this.setTransferStatus(transferStatuses.loading);
      switch (this.transferType) {
        case transferTypes.internal:
          await this.internalTransferCall();
          break;
        case transferTypes.phoneBook:
        case transferTypes.manualEntry:
          if (!parsed) {
            throw new EvTypeError({
              type: transferErrors.TYPE_ERROR,
              data: `Abnormal Transfer: failed to parse number for type ${this.transferType}`,
            });
          }
          await this.transferCall(parsed);
          break;
        default:
          throw new EvTypeError({
            type: transferErrors.TYPE_ERROR,
            data: `Abnormal Transfer: this.transferType -> ${this.transferType}`,
          });
      }
      this._eventEmitter.emit(transferEvents.SUCCESS);
    } catch (e) {
      this._eventEmitter.emit(transferEvents.ERROR, e);
      throw e;
    } finally {
      this.setTransferStatus(transferStatuses.idle);
      this._eventEmitter.emit(transferEvents.END);
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

  /**
   * Arm the unhold when a warm transfer to an agent completes and the account
   * asks for it, so leaving the consult leg brings the customer back. Same as
   * eag, which sets `unholdOnHangup` on a WARM/SUCCEEDED direct agent transfer
   * and unholds from `CallService.hangup`.
   */
  private _handleDirectAgentTransferResponse(
    data?: EvDirectAgentTransferResponse,
  ): void {
    if (
      data?.type !== directTransferTypes.WARM ||
      data.status !== directTransferStatues.SUCCEEDED ||
      !this.evAuth.agentPermissions?.allowWarmXferAutoUnhold
    ) {
      return;
    }
    this.evActiveCallControl.setUnholdOnHangup(true);
  }

  override onInitOnce() {
    this.evAgentSession.onTriggerConfig(() => {
      this.setTransferStatus(transferStatuses.idle);
    });
    this.evSubscription
      .subscribe(EvCallbackTypes.DIRECT_AGENT_TRANSFER, (data) => {
        this._handleDirectAgentTransferResponse(data);
      })
      // The call ending is not the agent leaving a consult leg: there is
      // nothing left to take off hold, and the armed unhold must not survive
      // into the next call.
      .subscribe(EvCallbackTypes.END_CALL, () => {
        this.evActiveCallControl.setUnholdOnHangup(false);
      });
  }
}

export { EvTransferCall };

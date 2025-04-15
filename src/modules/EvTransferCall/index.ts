import { Module } from '@ringcentral-integration/commons/lib/di';
import { EvTransferCall as BaseEvTransferCall } from '@ringcentral-integration/engage-voice-widgets/modules/EvTransferCall';
import { transferErrors } from '@ringcentral-integration/engage-voice-widgets/enums';
import { EvTypeError } from '@ringcentral-integration/engage-voice-widgets/lib/EvTypeError';
import { computed } from '@ringcentral-integration/core';
import type { EvTransferViewPhoneBookItem } from '@ringcentral-integration/engage-voice-widgets/interfaces/EvTransferCallUI.interface';
import { format, formatTypes } from '@ringcentral-integration/phone-number';
import { alpha3ToAlpha2, alpha2ToAlpha3 } from 'i18n-iso-countries';
import { isE164, parse } from '@ringcentral-integration/phone-number';
import type { EvClientTransferParams } from '@ringcentral-integration/engage-voice-widgets/lib/EvClient';

import { parseNumber } from '../../lib/parseNumber';
import { checkCountryCode } from '../../lib/checkCountryCode';

@Module({
  deps: [],
})
class EvTransferCall extends BaseEvTransferCall {
  override parseManualEntryNumber() {
    if (!this.transferRecipientNumber) {
      throw new EvTypeError({
        type: transferErrors.RECIPIENT_NUMBER_ERROR,
        data: `Abnormal Transfer: this.transferRecipientNumber -> ${this.transferRecipientNumber}`,
      });
    }
    checkCountryCode(this.transferRecipientNumber, this._deps.evAuth.availableCountries);
    const toNumber = parseNumber(this.transferRecipientNumber);
    return { toNumber, countryId: this.transferRecipientCountryId };
  }

  override parsePhoneBookNumber() {
    if (this.transferPhoneBookSelectedIndex === null) {
      throw new EvTypeError({
        type: transferErrors.CONTACT_ID_ERROR,
        data: `Abnormal Transfer: this.transferPhoneBookSelected -> ${this.transferPhoneBookSelectedIndex}`,
      });
    }
    const transferPhoneBookSelected =
      this.transferPhoneBook[this.transferPhoneBookSelectedIndex];
    checkCountryCode(transferPhoneBookSelected.destination, this._deps.evAuth.availableCountries);
    const toNumber = parseNumber(transferPhoneBookSelected.destination);
    return { toNumber, countryId: transferPhoneBookSelected.countryId };
  }

  @computed((that: EvTransferCall) => [
    that._deps.evCall.currentCall,
    that._deps.evAuth.availableCountries,
  ])
  get transferPhoneBook() {
    return (
      this._deps.evCall.currentCall?.transferPhoneBook?.reduce<
        EvTransferViewPhoneBookItem[]
      >((prev, bookItem, index) => {
        const { countryId: itemCountryId, destination, name } = bookItem;
        let countryId = itemCountryId;
        if (!countryId && isE164(destination)) {
          const { parsedCountry } = parse({
            input: destination,
          });
          countryId = alpha2ToAlpha3(parsedCountry);
        }
        const country = this._deps.evAuth.availableCountries.find(
          (country) => country.countryId === countryId,
        );

        if (typeof country === 'undefined' || country === null) {
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
          //
        }

        const countryName =
          country.countryId !== 'USA'
            ? country.countryName || country.countryId
            : '';
        const phoneBookName = `${name} ${countryName}`;

        prev.push({
          ...bookItem,
          countryId,
          phoneBookName,
          parsedDestination,
          phoneBookItemIndex: index,
        });

        return prev;
      }, []) || []
    );
  }

  async warmTransferCall({ dialDest, countryId }: EvClientTransferParams) {
    const country = this._deps.evAuth.availableCountries.find(
      (country) => country.countryId === countryId,
    );
    if (!country) {
      if (this.allowManualInternationalTransfer) {
        this._transferDest = dialDest;
        await this.evClient.warmTransferIntlCall({
          dialDest,
          countryId,
        });
      } else {
        throw new Error(
          `Unexpected Error: ban transferring international call`,
        );
      }
    } else {
      this._transferDest = dialDest;
      await this.evClient.warmTransferCall({ dialDest });
    }
  }

  async coldTransferCall({ dialDest, countryId }: EvClientTransferParams) {
    const country = this._deps.evAuth.availableCountries.find(
      (country) => country.countryId === countryId,
    );
    if (!country) {
      if (this.allowManualInternationalTransfer) {
        await this.evClient.coldTransferIntlCall({
          dialDest,
          countryId,
        });
      } else {
        // TODO: handle to ban transferring international call
      }
    } else {
      await this.evClient.coldTransferCall({ dialDest });
    }
  }
}

export { EvTransferCall };

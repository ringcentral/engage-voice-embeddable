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
import { Toast } from '@ringcentral-integration/micro-core/src/app/services';

import { dialoutStatuses, messageTypes } from '../../../enums';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSettings } from '../EvSettings';
import type { EvCallOptions, DialoutFormGroup } from './EvCall.interface';

const DEFAULT_RING_TIME = '60';

/**
 * EvCall module - Outbound call management
 * Handles dialout settings, outbound dialing, and call initiation
 */
@injectable({
  name: 'EvCall',
})
class EvCall extends RcModule {
  private _dialoutStatus = dialoutStatuses.idle;
  private _isDialing = false;

  constructor(
    protected evClient: EvClient,
    protected evAuth: EvAuth,
    protected evSettings: EvSettings,
    protected toast: Toast,
    protected storagePlugin: StoragePlugin,
    @optional('EvCallOptions') protected evCallOptions?: EvCallOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  dialoutCallerId = '-1';

  @storage
  @state
  dialoutQueueId = '-1';

  @storage
  @state
  dialoutCountryId = 'USA';

  @storage
  @state
  dialoutRingTime = DEFAULT_RING_TIME;

  @state
  formGroup: DialoutFormGroup = {
    dialoutCallerId: '-1',
    dialoutQueueId: '-1',
    dialoutCountryId: 'USA',
    dialoutRingTime: DEFAULT_RING_TIME,
  };

  get dialoutStatus(): string {
    return this._dialoutStatus;
  }

  get isDialing(): boolean {
    return this._isDialing;
  }

  get isIdle(): boolean {
    return this._dialoutStatus === dialoutStatuses.idle;
  }

  @computed((that: EvCall) => [that.evAuth.callerIds])
  get callerIds() {
    return this.evAuth.callerIds;
  }

  @computed((that: EvCall) => [that.evAuth.availableQueues])
  get availableQueues() {
    return this.evAuth.availableQueues;
  }

  @computed((that: EvCall) => [that.evAuth.availableCountries])
  get availableCountries() {
    return this.evAuth.availableCountries;
  }

  @action
  setFormGroup(data: Partial<DialoutFormGroup>) {
    this.formGroup = { ...this.formGroup, ...data };
  }

  @action
  saveForm() {
    this.dialoutCallerId = this.formGroup.dialoutCallerId;
    this.dialoutQueueId = this.formGroup.dialoutQueueId;
    this.dialoutCountryId = this.formGroup.dialoutCountryId;
    this.dialoutRingTime = this.formGroup.dialoutRingTime;
  }

  @action
  resetOutBoundDialSetting() {
    this.dialoutCallerId = '-1';
    this.dialoutQueueId = '-1';
    this.dialoutCountryId = 'USA';
    this.dialoutRingTime = DEFAULT_RING_TIME;
    this.formGroup = {
      dialoutCallerId: '-1',
      dialoutQueueId: '-1',
      dialoutCountryId: 'USA',
      dialoutRingTime: DEFAULT_RING_TIME,
    };
  }

  resetFormGroup() {
    this.setFormGroup({
      dialoutCallerId: this.dialoutCallerId,
      dialoutQueueId: this.dialoutQueueId,
      dialoutCountryId: this.dialoutCountryId,
      dialoutRingTime: this.dialoutRingTime,
    });
  }

  setDialoutStatus(status: string) {
    this._dialoutStatus = status;
  }

  setPhoneIdle() {
    this._dialoutStatus = dialoutStatuses.idle;
    this._isDialing = false;
  }

  setPhoneDialing() {
    this._dialoutStatus = dialoutStatuses.dialing;
    this._isDialing = true;
  }

  /**
   * Check if ring time is within valid range
   */
  checkDialoutRingTime(): boolean {
    const ringTime = parseInt(this.formGroup.dialoutRingTime, 10);
    const maxRingTime = this.evAuth.outboundManualDefaultRingtime || 60;
    if (ringTime < 10 || ringTime > maxRingTime) {
      this.toast.warning({
        message: messageTypes.INVALID_RING_TIME,
      });
      return false;
    }
    return true;
  }

  /**
   * Initiate an outbound call
   */
  async dialout(phoneNumber: string): Promise<void> {
    if (this._isDialing) {
      return;
    }
    if (!phoneNumber || phoneNumber.trim() === '') {
      this.toast.warning({
        message: messageTypes.EMPTY_PHONE_NUMBER,
      });
      return;
    }
    if (!this.checkDialoutRingTime()) {
      return;
    }
    try {
      this.setPhoneDialing();
      const callerId =
        this.dialoutCallerId === '-1' ? '' : this.dialoutCallerId;
      const queueId = this.dialoutQueueId === '-1' ? '' : this.dialoutQueueId;
      await this.evClient.manualOutdial({
        destination: phoneNumber,
        callerId,
        ringTime: parseInt(this.dialoutRingTime, 10),
        countryId: this.dialoutCountryId,
        queueId,
      });
    } catch (error) {
      this.setPhoneIdle();
      this.toast.danger({
        message: messageTypes.DIALOUT_ERROR,
      });
      throw error;
    }
  }

  /**
   * Cancel an ongoing outbound call
   */
  outdialCancel(uii: string) {
    this.evClient.manualOutdialCancel(uii);
    this.setPhoneIdle();
  }

  /**
   * Reset dialout settings to default, with country code fallback
   */
  @action
  resetOutBoundDialSetting() {
    this.dialoutCallerId = '-1';
    this.dialoutQueueId = '-1';
    this.dialoutCountryId = 'USA';
    // Fallback to first available country if USA is not available
    if (
      this.evAuth.availableCountries.length > 0 &&
      !this.evAuth.availableCountries.find((c: any) => c.countryId === this.dialoutCountryId)
    ) {
      this.dialoutCountryId = this.evAuth.availableCountries[0].countryId;
    }
    this.dialoutRingTime = DEFAULT_RING_TIME;
    const defaultRingTime = parseInt(this.evAuth.outboundManualDefaultRingtime, 10);
    if (!Number.isNaN(defaultRingTime)) {
      this.formGroup.dialoutRingTime = String(defaultRingTime);
      this.dialoutRingTime = String(defaultRingTime);
    }
  }

  /**
   * Preview dial - used for preview campaign dialing
   */
  async previewDial(
    requestId: string,
    leadPhone: string,
    leadPhoneE164: string,
  ): Promise<void> {
    if (this.dialoutStatus === dialoutStatuses.dialing) {
      return;
    }
    this.setPhoneDialing();
    try {
      if (!this.evSettings.isOffhook) {
        const offhookInitResult = await this._getOffhookInitResult();
        this.evClient.offhookInit();
        if (!offhookInitResult || offhookInitResult.status !== 'OK') {
          throw new Error('offhookInit exception error');
        }
      }
      this.evClient.previewDial(requestId, leadPhone, leadPhoneE164);
    } catch (error) {
      if (!this.evSettings.isManualOffhook) {
        this.evClient.offhookTerm();
      }
      this.setPhoneIdle();
      throw error;
    }
  }

  private _getOffhookInitResult(): Promise<any> {
    return new Promise((resolve) => {
      const handler = (data: any) => {
        this.evClient.off('OFFHOOK_INIT', handler);
        resolve(data);
      };
      this.evClient.on('OFFHOOK_INIT', handler);
      setTimeout(() => {
        this.evClient.off('OFFHOOK_INIT', handler);
        resolve(null);
      }, 10000);
    });
  }
}

export { EvCall };

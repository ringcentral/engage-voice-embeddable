import {
  action,
  computed,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  storage,
  StoragePlugin,
  watch,
  delegate,
} from '@ringcentral-integration/next-core';
import { Toast } from '@ringcentral-integration/micro-core/src/app/services';

import { dialoutStatuses, messageTypes } from '../../../enums';
import { t } from './i18n';
import { callErrors } from '../../../enums/callErrors';
import { EvCallbackTypes } from '../EvClient/enums';
import type { EvOffhookInitResponse, EvBaseCall } from '../EvClient/interfaces';
import { EvClient } from '../EvClient';
import { EvAuth } from '../EvAuth';
import { EvSettings } from '../EvSettings';
import { EvPresence } from '../EvPresence';
import { EvAgentSession } from '../EvAgentSession';
import { EvIntegratedSoftphone } from '../EvIntegratedSoftphone';
import { EvSubscription } from '../EvSubscription';
import { EvWorkingState } from '../EvWorkingState';
import { parseNumber } from '../../../lib/parseNumber';
import { checkCountryCode } from '../../../lib/checkCountryCode';
import type {
  EvCallOptions,
  DialoutFormGroup,
  ManualOutdialParams,
  RingTimeLimit,
} from './EvCall.interface';

const DEFAULT_OUTBOUND_SETTING: DialoutFormGroup = {
  dialoutCallerId: '-1',
  dialoutQueueId: '-1',
  dialoutCountryId: 'USA',
  dialoutRingTime: 30,
};

/**
 * EvCall module - Outbound call management
 * Handles dialout settings, outbound dialing, and call initiation
 */
@injectable({
  name: 'EvCall',
})
class EvCall extends RcModule {
  /** Activity call ID from route, set from EvActivityCallUI */
  activityCallId = '';

  ringTimeLimit: RingTimeLimit = {
    min: 20,
    max: 120,
  };

  constructor(
    protected evClient: EvClient,
    protected evAuth: EvAuth,
    protected evSettings: EvSettings,
    protected evPresence: EvPresence,
    protected evAgentSession: EvAgentSession,
    protected evIntegratedSoftphone: EvIntegratedSoftphone,
    protected evSubscription: EvSubscription,
    protected evWorkingState: EvWorkingState,
    protected toast: Toast,
    protected storagePlugin: StoragePlugin,
    protected portManager: PortManager,
    @optional('EvCallOptions') protected evCallOptions?: EvCallOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  @storage
  @state
  dialoutCallerId = DEFAULT_OUTBOUND_SETTING.dialoutCallerId;

  @storage
  @state
  dialoutQueueId = DEFAULT_OUTBOUND_SETTING.dialoutQueueId;

  @storage
  @state
  dialoutCountryId = DEFAULT_OUTBOUND_SETTING.dialoutCountryId;

  @storage
  @state
  dialoutRingTime = DEFAULT_OUTBOUND_SETTING.dialoutRingTime;

  @storage
  @state
  formGroup: DialoutFormGroup = { ...DEFAULT_OUTBOUND_SETTING };

  get ringTime(): number {
    return this.dialoutRingTime;
  }

  get queueId(): string | null {
    return this.dialoutQueueId === '-1' ? null : this.dialoutQueueId;
  }

  get callerId(): string | null {
    return this.dialoutCallerId === '-1' ? null : this.dialoutCallerId;
  }

  get countryId(): string {
    return this.dialoutCountryId;
  }

  get dialoutStatus(): string {
    return this.evPresence.dialoutStatus;
  }

  get isDialing(): boolean {
    return this.evPresence.dialoutStatus === dialoutStatuses.dialing;
  }

  get isIdle(): boolean {
    return this.evPresence.dialoutStatus === dialoutStatuses.idle;
  }

  get currentCall(): EvBaseCall | null {
    const call = this.evPresence.callsMapping[this.activityCallId];
    return this.activityCallId && call ? call : null;
  }

  get isOnLoginSuccess(): boolean {
    return this.ready && this.evAuth.isEvLogged;
  }

  get isInbound(): boolean {
    return this.currentCall?.callType === 'INBOUND';
  }

  get callerIds() {
    return this.evAuth.callerIds;
  }

  get availableQueues() {
    return this.evAuth.availableQueues;
  }

  get availableCountries() {
    return this.evAuth.availableCountries;
  }

  @action
  _setFormGroup(data: Partial<DialoutFormGroup>) {
    this.formGroup = { ...this.formGroup, ...data };
  }

  @delegate('server')
  async setFormGroup(data: Partial<DialoutFormGroup>): Promise<void> {
    this._setFormGroup(data);
  }

  @action
  _saveForm() {
    this.dialoutCallerId = this.formGroup.dialoutCallerId;
    this.dialoutQueueId = this.formGroup.dialoutQueueId;
    this.dialoutCountryId = this.formGroup.dialoutCountryId;
    this.dialoutRingTime = this.formGroup.dialoutRingTime;
  }

  @delegate('server')
  async saveForm(): Promise<void> {
    this._saveForm();
  }

  @action
  _resetOutBoundDialSetting() {
    this.dialoutCallerId = DEFAULT_OUTBOUND_SETTING.dialoutCallerId;
    this.dialoutQueueId = DEFAULT_OUTBOUND_SETTING.dialoutQueueId;
    this.dialoutCountryId = DEFAULT_OUTBOUND_SETTING.dialoutCountryId;
    // Fallback to first available country if USA is not available
    if (
      this.evAuth.availableCountries.length > 0 &&
      !this.evAuth.availableCountries.find(
        (c: any) => c.countryId === this.dialoutCountryId,
      )
    ) {
      this.dialoutCountryId = this.evAuth.availableCountries[0].countryId;
    }
    this.dialoutRingTime = DEFAULT_OUTBOUND_SETTING.dialoutRingTime;
    const defaultRingTime = parseInt(
      this.evAuth.outboundManualDefaultRingtime,
      10,
    );
    if (!Number.isNaN(defaultRingTime)) {
      this.formGroup.dialoutRingTime = defaultRingTime;
      this.dialoutRingTime = defaultRingTime;
    }
    this.formGroup = {
      dialoutCallerId: this.dialoutCallerId,
      dialoutQueueId: this.dialoutQueueId,
      dialoutCountryId: this.dialoutCountryId,
      dialoutRingTime: this.dialoutRingTime,
    };
  }

  @delegate('server')
  async resetOutBoundDialSetting(): Promise<void> {
    this._resetOutBoundDialSetting();
  }

  async resetFormGroup() {
    await this.setFormGroup({
      dialoutCallerId: this.dialoutCallerId,
      dialoutQueueId: this.dialoutQueueId,
      dialoutCountryId: this.dialoutCountryId,
      dialoutRingTime: this.dialoutRingTime,
    });
  }

  /**
   * Alias for resetFormGroup for backwards compatibility
   */
  async resetForm() {
    await this.resetFormGroup();
  }

  setDialoutStatus(status: string) {
    this.evPresence.setDialoutStatus(status as any);
  }

  setPhoneIdle() {
    this.setDialoutStatus(dialoutStatuses.idle);
  }

  setPhoneDialing() {
    this.setDialoutStatus(dialoutStatuses.dialing);
  }

  /**
   * Check if ring time is within valid range and adjust if necessary
   */
  checkDialoutRingTime(): void {
    const dialoutRingTime = Math.min(
      Math.max(this.formGroup.dialoutRingTime, this.ringTimeLimit.min),
      this.ringTimeLimit.max,
    );
    if (dialoutRingTime !== this.formGroup.dialoutRingTime) {
      this.setFormGroup({ dialoutRingTime });
    }
  }

  /**
   * Check if agent is able to make a call
   */
  checkIsAbleToCall(): boolean {
    if (
      this.dialoutStatus !== dialoutStatuses.idle ||
      this.evPresence.calls.length > 0 ||
      this.evWorkingState.isPendingDisposition
    ) {
      this.logger.info(
        'Unavailable to call, have a call or is PendingDisposition.',
      );
      if (this.evPresence.calls.length === 0) {
        this.setPhoneIdle();
      }
      this.toast.danger({
        message: t(messageTypes.FAILED_TO_CALL),
        ttl: 0,
      });
      return false;
    }
    return true;
  }

  initialize() {
    watch(
      this,
      () => this.isOnLoginSuccess,
      (isOnLoginSuccess) => {
        if (isOnLoginSuccess) {
          this.resetFormGroup();
        }
      },
    );
    // Subscribe to call ended events
    this.evSubscription.subscribe(EvCallbackTypes.END_CALL, () => {
      this.setDialoutStatus(dialoutStatuses.idle);
    });
    // Subscribe to TCPA safe lead state
    this.evSubscription.subscribe(
      EvCallbackTypes.TCPA_SAFE_LEAD_STATE,
      (data: any) => {
        if (['INTERCEPT', 'BUSY', 'NOANSWER'].includes(data?.leadState)) {
          if (!this.evSettings.isManualOffhook) {
            this.evClient.offhookTerm();
          }
          this.setPhoneIdle();
        if (data.leadState === 'INTERCEPT') {
          this.toast.info({
            message: t(messageTypes.INTERCEPT),
          });
        }
        }
      },
    );
    // Subscribe to offhook term
    this.evSubscription.subscribe(EvCallbackTypes.OFFHOOK_TERM, () => {
      this.setPhoneIdle();
    });
  }

  override async onInit() {
    if (this.evAuth.isFreshLogin) {
      await this.resetOutBoundDialSetting();
    }
  }

  /**
   * Parse and validate phone number
   */
  private _checkAndParseNumber(phoneNumber: string): string {
    try {
      checkCountryCode(phoneNumber, this.evAuth.availableCountries);
      return parseNumber(phoneNumber);
    } catch (error: any) {
      switch (error.type) {
        case messageTypes.NO_SUPPORT_COUNTRY:
          this.toast.danger({
            message: t(messageTypes.NO_SUPPORT_COUNTRY),
            ttl: 0,
          });
          break;
        case callErrors.emergencyNumber:
          this.toast.danger({
            message: callErrors.emergencyNumber,
          });
          break;
        default:
          this.toast.danger({
            message: callErrors.noToNumber,
          });
          break;
      }
      throw error;
    }
  }

  /**
   * Initiate an outbound call
   */
  async dialout(phoneNumber: string): Promise<void> {
    await this.evPresence.setCurrentCallUii('');
    // Handle integrated softphone
    if (this.evAgentSession.isIntegratedSoftphone) {
      try {
        if (this.evIntegratedSoftphone.sipRegisterSuccess) {
          await this.evIntegratedSoftphone.askAudioPermission(false);
        } else {
          await this.evAgentSession.configureAgent();
          await this.evIntegratedSoftphone.onceRegistered();
        }
      } catch (error) {
        return;
      }
    }
    try {
      const destination = this._checkAndParseNumber(phoneNumber);
      await this._manualOutdial({
        destination,
        callerId: this.callerId,
        countryId: this.countryId,
        queueId: this.queueId,
        ringTime: this.ringTime,
      });
    } catch (error) {
      this.setPhoneIdle();
    }
  }

  /**
   * Cancel an ongoing outbound call
   */
  outdialCancel(): void {
    this.evClient.manualOutdialCancel(this.evPresence.currentCallUii);
  }

  /**
   * Preview dial - used for preview campaign dialing
   */
  async previewDial(
    requestId: string,
    leadPhone: string,
    leadPhoneE164: string,
  ): Promise<void> {
    await this.evPresence.setCurrentCallUii('');
    // Handle integrated softphone
    if (this.evAgentSession.isIntegratedSoftphone) {
      try {
        if (this.evIntegratedSoftphone.sipRegisterSuccess) {
          await this.evIntegratedSoftphone.askAudioPermission(false);
        } else {
          await this.evAgentSession.configureAgent();
          await this.evIntegratedSoftphone.onceRegistered();
        }
      } catch (error) {
        return;
      }
    }
    try {
      await this._previewDial(requestId, leadPhone, leadPhoneE164);
    } catch (error) {
      this.logger.error('previewDial error', error);
      this.setPhoneIdle();
    }
  }

  /**
   * Internal preview dial implementation
   */
  private async _previewDial(
    requestId: string,
    leadPhone: string,
    leadPhoneE164: string,
  ): Promise<void> {
    if (this.dialoutStatus === dialoutStatuses.dialing) {
      return;
    }
    this.setPhoneDialing();
    let offhookInitResult: EvOffhookInitResponse | undefined;
    try {
      if (!this.evSettings.isOffhook) {
        const getOffhookInitResult = this._getOffhookInitResult();
        this.evClient.offhookInit();
        offhookInitResult = await getOffhookInitResult;
      }
      if (
        this.evSettings.isOffhook ||
        (offhookInitResult && offhookInitResult.status === 'OK')
      ) {
        this.evClient.previewDial(requestId, leadPhone, leadPhoneE164);
      } else {
        throw new Error("'offhookInit' exception error");
      }
    } catch (e) {
      if (!this.evSettings.isManualOffhook) {
        this.evClient.offhookTerm();
      }
      throw e;
    }
  }

  /**
   * Internal manual outdial implementation
   */
  private async _manualOutdial({
    callerId = '',
    destination,
    ringTime = DEFAULT_OUTBOUND_SETTING.dialoutRingTime,
    queueId = '',
    countryId = 'USA',
  }: ManualOutdialParams): Promise<void> {
    let offhookInitResult: EvOffhookInitResponse | undefined;
    if (this.dialoutStatus !== dialoutStatuses.dialing) {
      this.setPhoneDialing();
    }
    try {
      if (!this.evSettings.isOffhook) {
        const getOffhookInitResult = this._getOffhookInitResult();
        this.evClient.offhookInit();
        offhookInitResult = await getOffhookInitResult;
      }
      if (
        this.evSettings.isOffhook ||
        (offhookInitResult && offhookInitResult.status === 'OK')
      ) {
        this.logger.info('manualOutdial~~');
        await this.evClient.manualOutdial({
          callerId: callerId || '',
          countryId,
          destination,
          queueId: queueId || '',
          ringTime,
        });
      } else {
        throw new Error("'offhookInit' exception error");
      }
    } catch (e) {
      if (!this.evSettings.isManualOffhook) {
        this.evClient.offhookTerm();
      }
      throw e;
    }
  }

  /**
   * Wait for offhook init result
   */
  private _getOffhookInitResult(): Promise<EvOffhookInitResponse> {
    return new Promise((resolve, reject) => {
      this.evPresence.evPresenceEvents.once(
        EvCallbackTypes.OFFHOOK_INIT,
        (data: EvOffhookInitResponse) => {
          if (data.status === 'OK') {
            resolve(data);
          } else {
            reject(data);
          }
        },
      );
    });
  }
}

export { EvCall };

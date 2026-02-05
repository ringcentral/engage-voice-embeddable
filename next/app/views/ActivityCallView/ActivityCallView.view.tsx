import React, { useState, useCallback, useMemo } from 'react';
import {
  action,
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  state,
  storage,
  StoragePlugin,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { Toast } from '@ringcentral-integration/micro-core/src/app/services';

import { EvPresence } from '../../services/EvPresence';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvCallDisposition } from '../../services/EvCallDisposition';
import { EvWorkingState } from '../../services/EvWorkingState';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { EvActiveCallControl } from '../../services/EvActiveCallControl';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvRequeueCall } from '../../services/EvRequeueCall';
import { EvAgentScript } from '../../services/EvAgentScript';
import { EvAuth } from '../../services/EvAuth';
import { dialoutStatuses, transferTypes } from '../../../enums';
import type { EvBaseCall } from '../../services/EvClient/interfaces';
import i18n, { t as translate } from './i18n';

/**
 * Save status enum
 */
export enum SaveStatus {
  SUBMIT = 'submit',
  SAVING = 'saving',
  SAVED = 'saved',
}

/**
 * ActivityCallView options for configuration
 */
export interface ActivityCallViewOptions {
  hideCallNote?: boolean;
}

/**
 * IVR Alert Data
 */
interface IvrAlertData {
  subject: string;
  body: string;
}

/**
 * Disposition Item
 */
interface DispositionItem {
  dispositionId: string;
  disposition: string;
  requireNote?: boolean;
}

/**
 * ActivityCallView module - Call activity log and keypad
 * Displays current call information, call log form, and keypad
 */
@injectable({
  name: 'ActivityCallView',
})
class ActivityCallView extends RcViewModule {
  constructor(
    private evPresence: EvPresence,
    private evCall: EvCall,
    private evCallMonitor: EvCallMonitor,
    private evCallDisposition: EvCallDisposition,
    private evWorkingState: EvWorkingState,
    private evIntegratedSoftphone: EvIntegratedSoftphone,
    private evActiveCallControl: EvActiveCallControl,
    private evAgentSession: EvAgentSession,
    private evTransferCall: EvTransferCall,
    private evRequeueCall: EvRequeueCall,
    private evAgentScript: EvAgentScript,
    private evAuth: EvAuth,
    private router: RouterPlugin,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    @optional('ActivityCallViewOptions')
    private activityCallViewOptions?: ActivityCallViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

  @storage
  @state
  isKeypadOpen = false;

  @storage
  @state
  keypadValue = '';

  @storage
  @state
  saveStatus: SaveStatus = SaveStatus.SUBMIT;

  @storage
  @state
  validated = {
    dispositionId: true,
    notes: true,
  };

  @storage
  @state
  required = {
    notes: false,
  };

  @action
  setKeypadOpen(isOpen: boolean) {
    this.isKeypadOpen = isOpen;
  }

  @action
  setKeypadValue(value: string) {
    this.keypadValue = value;
  }

  @action
  setSaveStatus(status: SaveStatus) {
    this.saveStatus = status;
  }

  @action
  setValidated(validated: Partial<typeof this.validated>) {
    this.validated = { ...this.validated, ...validated };
  }

  @action
  setRequired(required: Partial<typeof this.required>) {
    this.required = { ...this.required, ...required };
  }

  @action
  resetState() {
    this.isKeypadOpen = false;
    this.keypadValue = '';
    this.saveStatus = SaveStatus.SUBMIT;
    this.validated = { dispositionId: true, notes: true };
    this.required = { notes: false };
  }

  /**
   * Get current call ID
   */
  get callId(): string {
    return this.evCall.activityCallId;
  }

  /**
   * Get current call with enriched contact data
   */
  get currentCall() {
    const call = this.evCall.currentCall;
    if (!call) return null;
    const callId = this.evCallMonitor.getCallId(call.session || {});
    return this.evCallMonitor.callsMapping[callId] || call;
  }

  /**
   * Get main call (first session)
   */
  get currentMainCall() {
    const call = this.currentCall;
    if (!call) return null;
    return this.evActiveCallControl.getMainCall(call.uii);
  }

  /**
   * Get agent recording settings
   */
  get agentRecording() {
    return this.currentMainCall?.agentRecording;
  }

  /**
   * Check if default recording is on
   */
  get isDefaultRecord(): boolean {
    return this.agentRecording?.default === 'ON';
  }

  /**
   * Check if call is inbound
   */
  get isInbound(): boolean {
    return this.evCall.isInbound;
  }

  /**
   * Get call status
   */
  @computed((that: ActivityCallView) => [
    that.currentCall,
    that.currentMainCall,
  ])
  get callStatus(): 'active' | 'callEnd' | 'onHold' {
    if (this.currentCall?.endedCall) {
      return 'callEnd';
    }
    if (this.currentMainCall?.isHold || this.currentMainCall?.hold) {
      return 'onHold';
    }
    return 'active';
  }

  /**
   * Check if on hold
   */
  get isOnHold(): boolean {
    return this.callStatus === 'onHold';
  }

  /**
   * Check if transfer is allowed
   */
  get allowTransfer(): boolean {
    return this.evTransferCall.allowTransferCall || this.evRequeueCall.allowRequeueCall;
  }

  /**
   * Get disposition picklist
   */
  @computed((that: ActivityCallView) => [that.currentCall])
  get dispositionPickList(): DispositionItem[] {
    const dispositions = this.currentCall?.outdialDispositions?.dispositions || [];
    return dispositions.map((item: any) => ({
      ...item,
      label: item.disposition,
      value: item.dispositionId,
    }));
  }

  /**
   * Get IVR alert data from call baggage
   */
  @computed((that: ActivityCallView) => [that.currentCall])
  get ivrAlertData(): IvrAlertData[] {
    const call = this.currentCall;
    const ivrAlertData: IvrAlertData[] = [];
    if (call?.baggage) {
      for (let i = 1; i <= 3; i++) {
        const subject = call.baggage[`ivrAlertSubject_${i}`];
        const body = call.baggage[`ivrAlertBody_${i}`];
        if (subject || body) {
          ivrAlertData.push({
            subject: subject || '',
            body: body || '',
          });
        }
      }
    }
    return ivrAlertData;
  }

  /**
   * Check if agent script is available
   */
  get hasAgentScript(): boolean {
    return this.evAgentScript.getIsAgentScript(this.currentCall);
  }

  /**
   * Get call control permissions
   */
  get callControlPermissions() {
    return {
      allowTransferCall: this.evTransferCall.allowTransferCall,
      allowRequeueCall: this.evRequeueCall.allowRequeueCall,
      allowHoldCall: this.currentMainCall?.allowHold ?? true,
      allowHangupCall: this.currentMainCall?.allowHangup ?? true,
      allowRecordControl: this.agentRecording?.agentRecording ?? false,
      allowPauseRecord: typeof this.agentRecording?.pause === 'number',
    };
  }

  /**
   * Get contact name from matches or fallback to phone number
   */
  getContactName(call: any): string {
    if (!call) return '';
    const contactMatches = call.contactMatches || [];
    if (contactMatches.length > 0) {
      return contactMatches[0].name || call.ani;
    }
    return call.ani || '';
  }

  // Call Control Actions

  hangUp = async () => {
    if (this.currentCall?.session?.sessionId) {
      this.evActiveCallControl.hangUp(this.currentCall.session.sessionId);
    }
    this.setSaveStatus(SaveStatus.SUBMIT);
  };

  hold = () => {
    this.evActiveCallControl.hold();
  };

  unhold = () => {
    this.evActiveCallControl.unhold();
  };

  mute = () => {
    this.evActiveCallControl.mute();
  };

  unmute = () => {
    this.evActiveCallControl.unmute();
  };

  reject = () => {
    this.evActiveCallControl.reject();
  };

  // Recording Actions

  onRecord = async () => {
    try {
      await this.evActiveCallControl.record();
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  onStopRecord = async () => {
    try {
      await this.evActiveCallControl.stopRecord();
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  onPauseRecord = async () => {
    try {
      await this.evActiveCallControl.pauseRecord();
      this.toast.success({
        message: translate('recordPaused'),
      });
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  onResumeRecord = () => {
    this.evActiveCallControl.resumeRecord();
    this.toast.success({
      message: translate('recordResume'),
    });
  };

  // Keypad Actions

  sendDTMF = (digit: string) => {
    this.evActiveCallControl.onKeypadClick(digit);
  };

  handleKeypadClick = (digit: string) => {
    this.setKeypadValue(this.keypadValue + digit);
    this.sendDTMF(digit);
  };

  // Navigation Actions

  goToTransferCallPage = (type: string) => {
    this.evTransferCall.resetTransferStatus();
    this.evTransferCall.fetchAgentList();
    this.router.push(`/activityCallLog/${this.callId}/transferCall/${type}`);
  };

  goToRequeueCallPage = () => {
    const gate = this.evCallMonitor.callsMapping[this.callId]?.gate;
    if (gate) {
      this.evRequeueCall.setStatus({
        selectedQueueGroupId: gate.gateGroupId || '',
        selectedGateId: gate.gateId || '',
        stayOnCall: false,
        requeuing: false,
      });
    }
    this.evTransferCall.changeTransferType(transferTypes.queue);
    this.router.push(`/activityCallLog/${this.callId}/transferCall`);
  };

  goToActiveCallList = () => {
    this.router.push(`/activityCallLog/${this.callId}/activeCallList`);
  };

  goBack = () => {
    this.evCall.setDialoutStatus(dialoutStatuses.idle);
    this.router.push('/agent/dialer');
    this.resetState();
    this.evCall.activityCallId = '';
  };

  // Disposition Actions

  onUpdateCallLog = (field: string, value: string) => {
    const callId = this.callId;
    const currentData = this.evCallDisposition.getDisposition(callId) || {};

    if (field === 'dispositionId') {
      const currentDisposition = this.dispositionPickList.find(
        (item) => item.dispositionId === value,
      );
      const noteRequired = currentDisposition?.requireNote ?? false;
      this.setRequired({ notes: noteRequired });
      this.setValidated({
        dispositionId: !!value,
        notes: !noteRequired || !!currentData.notes,
      });
    }

    this.evCallDisposition.setDisposition(callId, {
      ...currentData,
      [field]: value,
    });
  };

  disposeCall = async () => {
    if (this.saveStatus === SaveStatus.SAVED) {
      this.goBack();
      return;
    }

    const callId = this.callId;
    const saveFields = this.evCallDisposition.getDisposition(callId);

    // Validate
    this.setValidated({
      notes: !this.required.notes || (this.required.notes && !!saveFields?.notes),
    });

    if (!this.validated.dispositionId || !this.validated.notes) {
      return;
    }

    try {
      this.setSaveStatus(SaveStatus.SAVING);
      this.evCallDisposition.disposeCall(callId);

      // Save agent script if applicable
      const call = this.currentCall;
      if (call?.scriptId) {
        this.evAgentScript.setCurrentCallScript(null);
        this.evAgentScript.saveScriptResult(call);
      }

      this.setSaveStatus(SaveStatus.SAVED);
      this.toast.success({ message: translate('callDispositionSuccess') });
      this.evWorkingState.setIsPendingDisposition(false);

      setTimeout(() => this.goBack(), 1000);
    } catch (e) {
      console.error(e);
      this.setSaveStatus(SaveStatus.SUBMIT);
      this.toast.danger({
        message: translate('callDispositionFailed'),
        ttl: 0,
      });
    }
  };

  component() {
    const { t } = useLocale(i18n);

    const {
      currentCall,
      contactName,
      isMuted,
      isOnHold,
      isRecording,
      callStatus,
      saveStatus,
      isKeypadOpen,
      keypadValue,
      dispositionPickList,
      ivrAlertData,
      hasAgentScript,
      callControlPermissions,
      validated,
      required,
      dispositionData,
      isIntegratedSoftphone,
      recordPauseCount,
    } = useConnector(() => {
      const call = this.currentCall;
      const callId = this.callId;
      return {
        currentCall: call,
        contactName: this.getContactName(call),
        isMuted: this.evIntegratedSoftphone.muteActive,
        isOnHold: this.isOnHold,
        isRecording: this.evActiveCallControl.isRecording,
        callStatus: this.callStatus,
        saveStatus: this.saveStatus,
        isKeypadOpen: this.isKeypadOpen,
        keypadValue: this.keypadValue,
        dispositionPickList: this.dispositionPickList,
        ivrAlertData: this.ivrAlertData,
        hasAgentScript: this.hasAgentScript,
        callControlPermissions: this.callControlPermissions,
        validated: this.validated,
        required: this.required,
        dispositionData: this.evCallDisposition.getDisposition(callId),
        isIntegratedSoftphone: this.evAgentSession.isIntegratedSoftphone,
        recordPauseCount: this.agentRecording?.pause,
      };
    });

    const handleHoldToggle = useCallback(() => {
      if (isOnHold) {
        this.unhold();
      } else {
        this.hold();
      }
    }, [isOnHold]);

    const handleMuteToggle = useCallback(() => {
      if (isMuted) {
        this.unmute();
      } else {
        this.mute();
      }
    }, [isMuted]);

    const handleRecordToggle = useCallback(() => {
      if (isRecording) {
        this.onStopRecord();
      } else {
        this.onRecord();
      }
    }, [isRecording]);

    const showCallEnded = callStatus === 'callEnd';
    const showRecordButton = callControlPermissions.allowRecordControl || this.isDefaultRecord;

    if (!currentCall) {
      return (
        <div className="p-4 text-center text-neutral-b2">
          <p className="typography-mainText">{t('noActiveCall')}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base overflow-hidden">
        {/* IVR Alerts */}
        {ivrAlertData.length > 0 && (
          <div className="bg-warning-t10 border-b border-warning p-3">
            {ivrAlertData.map((alert, index) => (
              <div key={index} className="mb-2 last:mb-0">
                {alert.subject && (
                  <div className="typography-subtitleMini text-warning">{alert.subject}</div>
                )}
                {alert.body && (
                  <div className="typography-descriptor text-neutral-b1">{alert.body}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Call Info Header */}
        <div className="p-4 border-b border-neutral-b4">
          <div className="flex items-center justify-between">
            <div>
              <div className="typography-subtitle mb-1">
                {showCallEnded ? t('callEnded') : t('activeCall')}
              </div>
              <div className="typography-mainText text-neutral-b1 truncate">
                {contactName || t('unknown')}
              </div>
              {contactName && contactName !== currentCall.ani && (
                <div className="typography-descriptor text-neutral-b2">
                  {currentCall.ani}
                </div>
              )}
            </div>
            {isOnHold && (
              <span className="px-2 py-1 bg-warning-t20 text-warning typography-descriptorMini rounded">
                {t('onHold')}
              </span>
            )}
          </div>
          {/* Queue info */}
          {currentCall.queue?.name && (
            <div className="typography-descriptor text-neutral-b3 mt-1">
              {currentCall.queue.name}
            </div>
          )}
        </div>

        {/* Call Controls - Only show when call is active */}
        {!showCallEnded && (
          <div className="flex flex-wrap justify-center gap-2 p-3 border-b border-neutral-b4">
            {/* Mute Button - Only for integrated softphone */}
            {isIntegratedSoftphone && (
              <button
                type="button"
                onClick={handleMuteToggle}
                className={`px-3 py-2 rounded-lg typography-descriptorMini ${
                  isMuted ? 'bg-danger text-neutral-w0' : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
                }`}
              >
                {isMuted ? t('unmute') : t('mute')}
              </button>
            )}

            {/* Hold Button */}
            {callControlPermissions.allowHoldCall && (
              <button
                type="button"
                onClick={handleHoldToggle}
                className={`px-3 py-2 rounded-lg typography-descriptorMini ${
                  isOnHold ? 'bg-warning text-neutral-w0' : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
                }`}
              >
                {isOnHold ? t('unhold') : t('hold')}
              </button>
            )}

            {/* Record Button */}
            {showRecordButton && (
              <button
                type="button"
                onClick={handleRecordToggle}
                disabled={!callControlPermissions.allowRecordControl}
                className={`px-3 py-2 rounded-lg typography-descriptorMini ${
                  isRecording ? 'bg-danger text-neutral-w0' : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
                } disabled:opacity-50`}
              >
                {isRecording ? t('stopRecord') : t('record')}
              </button>
            )}

            {/* Pause Record Button */}
            {callControlPermissions.allowPauseRecord && isRecording && (
              <button
                type="button"
                onClick={this.onPauseRecord}
                className="px-3 py-2 rounded-lg typography-descriptorMini bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4"
              >
                {t('pauseRecord')} {recordPauseCount !== undefined && `(${recordPauseCount})`}
              </button>
            )}

            {/* Keypad Button */}
            <button
              type="button"
              onClick={() => this.setKeypadOpen(!isKeypadOpen)}
              className={`px-3 py-2 rounded-lg typography-descriptorMini ${
                isKeypadOpen ? 'bg-primary-b text-neutral-w0' : 'bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4'
              }`}
            >
              {t('keypad')}
            </button>

            {/* Transfer Button */}
            {this.allowTransfer && (
              <button
                type="button"
                onClick={() => this.goToTransferCallPage('internal')}
                className="px-3 py-2 rounded-lg typography-descriptorMini bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4"
              >
                {t('transfer')}
              </button>
            )}

            {/* Requeue Button */}
            {callControlPermissions.allowRequeueCall && (
              <button
                type="button"
                onClick={this.goToRequeueCallPage}
                className="px-3 py-2 rounded-lg typography-descriptorMini bg-neutral-b5 text-neutral-b1 hover:bg-neutral-b4"
              >
                {t('requeue')}
              </button>
            )}

            {/* Hangup Button */}
            {callControlPermissions.allowHangupCall && (
              <button
                type="button"
                onClick={this.hangUp}
                className="px-3 py-2 rounded-lg typography-descriptorMini bg-danger text-neutral-w0 hover:bg-danger-f"
              >
                {t('hangUp')}
              </button>
            )}
          </div>
        )}

        {/* Keypad */}
        {isKeypadOpen && !showCallEnded && (
          <div className="p-4 border-b border-neutral-b4">
            <input
              type="text"
              value={keypadValue}
              readOnly
              aria-label={t('keypadInput')}
              className="w-full p-2 mb-2 text-center typography-title bg-neutral-b5 rounded"
            />
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(
                (digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => this.handleKeypadClick(digit)}
                    className="p-3 typography-subtitle bg-neutral-b5 rounded hover:bg-neutral-b4"
                  >
                    {digit}
                  </button>
                ),
              )}
            </div>
          </div>
        )}

        {/* Agent Script Link */}
        {hasAgentScript && (
          <div className="p-3 border-b border-neutral-b4 bg-primary-t10">
            <button
              type="button"
              onClick={() => this.evAgentScript.setIsDisplayAgentScript(true)}
              className="text-primary-b typography-subtitleMini hover:underline"
            >
              {t('viewAgentScript')}
            </button>
          </div>
        )}

        {/* Call Log Form */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="typography-subtitle mb-4">{t('callLog')}</div>
          <div className="space-y-4">
            {/* Disposition Dropdown */}
            {dispositionPickList.length > 0 && (
              <div>
                <label className="typography-descriptor text-neutral-b2 block mb-1">
                  {t('disposition')} <span className="text-danger">*</span>
                </label>
                <select
                  value={dispositionData?.dispositionId || ''}
                  onChange={(e) => this.onUpdateCallLog('dispositionId', e.target.value)}
                  aria-label={t('disposition')}
                  className={`w-full p-2 border rounded ${
                    !validated.dispositionId ? 'border-danger' : 'border-neutral-b4'
                  }`}
                >
                  <option value="">{t('selectDisposition')}</option>
                  {dispositionPickList.map((item) => (
                    <option key={item.dispositionId} value={item.dispositionId}>
                      {item.disposition}
                    </option>
                  ))}
                </select>
                {!validated.dispositionId && (
                  <p className="typography-descriptor text-danger mt-1">
                    {t('dispositionRequired')}
                  </p>
                )}
              </div>
            )}

            {/* Notes Textarea */}
            {!this.activityCallViewOptions?.hideCallNote && (
              <div>
                <label className="typography-descriptor text-neutral-b2 block mb-1">
                  {t('notes')} {required.notes && <span className="text-danger">*</span>}
                </label>
                <textarea
                  value={dispositionData?.notes || ''}
                  onChange={(e) => this.onUpdateCallLog('notes', e.target.value)}
                  aria-label={t('notes')}
                  maxLength={32000}
                  className={`w-full p-2 border rounded h-24 resize-none ${
                    !validated.notes ? 'border-danger' : 'border-neutral-b4'
                  }`}
                  placeholder={t('enterNotes')}
                />
                {!validated.notes && (
                  <p className="typography-descriptor text-danger mt-1">
                    {t('notesRequired')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t border-neutral-b4">
          <button
            type="button"
            onClick={this.disposeCall}
            disabled={saveStatus === SaveStatus.SAVING}
            className={`w-full py-3 rounded-lg typography-subtitle ${
              saveStatus === SaveStatus.SAVING
                ? 'bg-neutral-b4 text-neutral-b2 cursor-not-allowed'
                : saveStatus === SaveStatus.SAVED
                ? 'bg-success text-neutral-w0'
                : 'bg-primary-b text-neutral-w0 hover:bg-primary-f'
            }`}
          >
            {saveStatus === SaveStatus.SAVING
              ? t('saving')
              : saveStatus === SaveStatus.SAVED
              ? t('saved')
              : t('submit')}
          </button>
        </div>
      </div>
    );
  }
}

export { ActivityCallView };

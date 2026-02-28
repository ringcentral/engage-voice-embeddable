import React, { useCallback, useRef, useEffect } from 'react';
import {
  action,
  autobind,
  computed,
  injectable,
  optional,
  RcViewModule,
  RouterPlugin,
  state,
  storage,
  StoragePlugin,
  useConnector,
  useParams,
  watch,
  PortManager,
  delegate,
  type UIProps,
  type UIFunctions,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { AppFooterNav, AppHeaderNav, AppAnnouncement } from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import { Button, IconButton, Icon } from '@ringcentral/spring-ui';
import { CheckMd, ActiveCallMd, CaretRightMd } from '@ringcentral/spring-icon';

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
import { ThirdPartyService } from '../../services/ThirdPartyService';
import { dialoutStatuses } from '../../../enums';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber/formatPhoneNumber';
import type { EvCallData } from '../../services/EvCallDataSource/EvCallDataSource.interface';
import type { EvCallDispositionData } from '../../services/EvCallDisposition/EvCallDisposition.interface';

import { CallInfoHeader } from '../../components/CallInfoHeader';
import { EvCallControlButtons } from '../../components/EvCallControlButtons';
import { IvrAlertPanel } from '../../components/IvrAlertPanel';
import { DialpadPanel } from '../../components/DialpadPanel';
import { DispositionForm } from '../../components/DispositionForm';
import { RecordCountdown } from '../../components/RecordCountdown';
import type {
  ActivityCallViewProps,
  ActivityCallViewUIProps,
  ActivityCallViewUIFunctions,
} from './ActivityCallView.interface';
import { getCallInfos } from './getCallInfos';
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
  /** Whether the call was picked up directly (not ringing) */
  pickUpDirectly = true;

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
    private thirdPartyService: ThirdPartyService,
    private router: RouterPlugin,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('ActivityCallViewOptions')
    private activityCallViewOptions?: ActivityCallViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onServer(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
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

  @state
  viewCallId = '';

  @storage
  @state
  scrollTo: string | null = null;

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
  setScrollTo(id: string | null) {
    this.scrollTo = id;
  }

  @action
  setViewCallId(id: string) {
    this.viewCallId = id;
  }

  @action
  resetKeypadStatus() {
    this.keypadValue = '';
    this.isKeypadOpen = false;
  }

  @action
  reset() {
    this.isKeypadOpen = false;
    this.keypadValue = '';
    this.saveStatus = SaveStatus.SUBMIT;
    this.validated = { dispositionId: true, notes: true };
    this.required = { notes: false };
    this.scrollTo = null;
  }

  /**
   * Lifecycle: set default recording state on call ringing
   */
  initialize() {
    this.resetKeypadStatus();
    this.evCallMonitor.onCallRinging(() => {
      const stopWatching = watch(
        this,
        () => this.currentMainCall,
        (currentMainCall: any) => {
          if (currentMainCall) {
            this.evActiveCallControl.setIsRecording(this.isDefaultRecord);
          }
          stopWatching();
        },
      );
    });
  }

  /**
   * Whether the view is in history mode (navigated from call history)
   */
  get isHistoryMode(): boolean {
    return this.router.currentPath?.startsWith('/history/') ?? false;
  }

  /**
   * Get current call ID
   */
  get callId(): string {
    return this.viewCallId || this.evCall.activityCallId;
  }

  /**
   * Get current call with enriched contact data
   */
  get currentCall() {
    const id = this.callId;
    if (!id) return null;
    const call = this.evPresence.callsMapping[id];
    if (!call) return null;
    const monitorCallId = this.evCallMonitor.getCallId(call.session || {});
    return this.evCallMonitor.callsMapping[monitorCallId] || call;
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
   * Check if this is an incoming (ringing) call
   */
  get isInComingCall(): boolean {
    return this.evCall.isInbound && !this.pickUpDirectly;
  }

  /**
   * Get call status
   */
  @computed((that: ActivityCallView) => [
    that.currentCall,
    that.currentMainCall,
    that.isHistoryMode,
  ])
  get callStatus(): 'active' | 'callEnd' | 'onHold' {
    if (this.currentCall?.endedCall || this.isHistoryMode) {
      return 'callEnd';
    }
    const mainCall = this.currentMainCall as EvCallData | null;
    if (mainCall?.isHold || mainCall?.hold) {
      return 'onHold';
    }
    return 'active';
  }

  /**
   * Get the active call list (for multi-call scenarios)
   */
  @computed((that: ActivityCallView) => [
    that.callId,
    that.evCallMonitor.callIds,
    that.evCallMonitor.otherCallIds,
    that.evCallMonitor.callsMapping,
  ])
  get callList(): any[] {
    const { callIds, otherCallIds, callsMapping } = this.evCallMonitor;
    return this.evCallMonitor.getActiveCallList(
      callIds,
      otherCallIds,
      callsMapping,
      this.callId,
    );
  }

  /**
   * Check if there are multiple active calls
   */
  @computed((that: ActivityCallView) => [that.callList])
  get isMultipleCalls(): boolean {
    return this.callList.length > 2;
  }

  /**
   * Check if on hold (multi-call aware)
   */
  @computed((that: ActivityCallView) => [
    that.isMultipleCalls,
    that.callList,
    that.currentMainCall,
  ])
  get isOnHold(): boolean {
    if (this.isMultipleCalls) {
      return !!this.callList.find(
        (call: any) =>
          !(call.session?.agentId === this.evAuth.agentId) && !!call.isHold,
      );
    }
    return !!(this.currentMainCall as any)?.isHold || !!this.currentMainCall?.hold;
  }

  /**
   * Whether transfer calls are allowed
   */
  get allowTransferCall(): boolean {
    const call = this.currentCall;
    return !!(call?.allowTransfer && !call?.endedCall);
  }

  /**
   * Check if transfer is allowed (transfer or requeue)
   */
  get allowTransfer(): boolean {
    return this.allowTransferCall || this.evRequeueCall.allowRequeueCall;
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
  @computed((that: ActivityCallView) => [
    that.currentCall,
    that.evRequeueCall.allowRequeueCall,
    that.currentMainCall,
    that.agentRecording,
  ])
  get callControlPermissions() {
    return {
      allowTransferCall: this.allowTransferCall,
      allowRequeueCall: this.evRequeueCall.allowRequeueCall,
      allowHoldCall: this.currentMainCall?.allowHold ?? true,
      allowHangupCall: this.currentMainCall?.allowHangup ?? true,
      allowRecordControl: this.agentRecording?.agentRecording ?? false,
      allowPauseRecord: typeof this.agentRecording?.pause === 'number',
    };
  }

  /**
   * Get basic call info for display
   */
  @computed((that: ActivityCallView) => [that.currentCall])
  get basicInfo() {
    const call = this.currentCall as any;
    if (!call) return null;
    const isInbound = call.callType === 'INBOUND';
    const contactMatches: any[] = call.contactMatches || [];
    const name = contactMatches[0]?.name;
    const fromNumber = isInbound ? call.ani : call.dnis;
    const toNumber = isInbound ? call.dnis : call.ani;
    const fromMatchName = name || fromNumber;
    const toMatchName = name || toNumber;
    const phoneNumber = isInbound ? fromNumber : toNumber;
    const formattedNumber = formatPhoneNumber({ phoneNumber: phoneNumber || '' });
    return {
      subject: isInbound ? fromMatchName : toMatchName,
      followInfos: [
        formattedNumber,
        ...(call.queue?.name ? [call.queue.name] : []),
      ],
      callInfos: getCallInfos(call),
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

  /**
   * Whether to show the submit/disposition step
   */
  get showSubmitStep(): boolean {
    if (!this.activityCallViewOptions?.hideCallNote) {
      return true;
    }
    if (this.dispositionPickList.length === 0) {
      return false;
    }
    if (this.currentCall?.callType === 'INBOUND') {
      return true;
    }
    return false;
  }

  // Call Control Actions

  @delegate('server')
  async hangUp() {
    if (this.currentCall?.session?.sessionId) {
      await this.evActiveCallControl.hangUp(this.currentCall.session.sessionId);
    }
    this.setSaveStatus(SaveStatus.SUBMIT);
  };

  /**
   * Hold or unhold, multi-call aware (navigates to call list if multiple)
   */
  @delegate('server')
  async handleHoldOrUnhold(type: 'hold' | 'unhold') {
    if (this.isMultipleCalls) {
      this.goToActiveCallList();
      return;
    }
    this.evActiveCallControl[type]();
  };

  hold = () => {
    this.handleHoldOrUnhold('hold');
  };

  unhold = () => {
    this.handleHoldOrUnhold('unhold');
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

  onRestartTimer = async () => {
    try {
      await this.evActiveCallControl.pauseRecord();
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  // Keypad Actions

  sendDTMF = (digit: string) => {
    this.evActiveCallControl.onKeypadClick(digit);
  };

  handleKeypadChange = (value: string) => {
    // Detect the new character added and send DTMF for it
    if (value.length > this.keypadValue.length) {
      const newDigit = value.charAt(value.length - 1);
      this.sendDTMF(newDigit);
    }
    this.setKeypadValue(value);
  };

  handleKeypadKeyPress = (digit: string) => {
    this.sendDTMF(digit);
  };

  // Navigation Actions

  goToTransferPage = () => {
    this.evTransferCall.resetTransferStatus();
    this.evTransferCall.fetchAgentList();
    this.router.replace(`/activityCallLog/${this.callId}/transferCall`);
  };

  goToActiveCallList = () => {
    this.router.replace(`/activityCallLog/${this.callId}/activeCallList`);
  };

  /**
   * Navigate to the call details page (read-only info)
   */
  goToCallDetailPage = () => {
    this.router.push(`/history/${this.callId}/detail`);
  };

  @delegate('server')
  async goBack() {
    if (this.isHistoryMode) {
      this.setViewCallId('');
      this.router.goBack();
      this.reset();
      return;
    }
    const isEnded = this.callStatus === 'callEnd';
    this.evCall.setDialoutStatus(dialoutStatuses.idle);
    this.setViewCallId('');
    this.router.goBack();
    this.reset();
    if (isEnded) {
      this.evCall.setActivityCallId('');
    }
  };

  /**
   * Navigate to dialer without submitting disposition
   */
  gotoDialWithoutSubmit = async () => {
    this.logger.info('gotoDialWithoutSubmit');
    await this.doDisposeCall();
    await this.evWorkingState.setIsPendingDisposition(false);
    this.router.push('/agent/dialer');
  };

  // Copy action

  onCopySuccess = (name: string) => {
    this.toast.info({
      message: `${name.toUpperCase()} copied.`,
    });
  };

  // Disposition Actions

  onUpdateCallLog = (field: string, value: string) => {
    const callId = this.callId;
    const currentData = this.evCallDisposition.getDisposition(callId) || { dispositionId: null, notes: '' };
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
    if (field === 'notes' && this.required.notes) {
      this.setValidated({ notes: !!value });
    } else if (field === 'notes') {
      this.setValidated({ notes: true });
    }
    const updatedData: EvCallDispositionData = {
      dispositionId: currentData.dispositionId,
      notes: currentData.notes,
      [field]: value,
    };
    this.evCallDisposition.setDisposition(callId, updatedData);
  };

  /**
   * Core dispose call logic (log and send disposition)
   */
  private async doDisposeCall() {
    try {
      const call = this.currentCall;
      if (call) {
        await this.thirdPartyService.logCall({
          call: {
            id: call.uii,
            direction: call.callType,
            from: { phoneNumber: call.callType === 'OUTBOUND' ? call.dnis : call.ani },
            to: { phoneNumber: call.callType === 'OUTBOUND' ? call.ani : call.dnis },
          },
          task: this.evCallDisposition.getDisposition(this.callId),
          sessionId: this.callId,
        });
      }
    } catch (e) {
      console.error(e);
    }
    this.evCallDisposition.disposeCall(this.callId);
    // Save agent script if applicable
    const call = this.currentCall;
    if (call?.scriptId) {
      this.evAgentScript.setCurrentCallScript(null);
      this.evAgentScript.saveScriptResult(call);
    }
  }

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
      await this.doDisposeCall();
      this.setSaveStatus(SaveStatus.SAVED);
      this.toast.success({ message: translate('callDispositionSuccess') });
      await this.evWorkingState.setIsPendingDisposition(false);
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


  /**
   * Get UI state props for the component
   */
  getUIProps(): UIProps<ActivityCallViewUIProps> {
    const call = this.currentCall;
    const callId = this.callId;
    return {
      activityCallId: this.evCall.activityCallId,
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
      timeStamp: this.evActiveCallControl.timeStamp,
      basicInfo: this.basicInfo,
      isMultipleCalls: this.isMultipleCalls,
      isInComingCall: this.isInComingCall,
      showSubmitStep: this.showSubmitStep,
      allowTransfer: this.allowTransfer,
      hideCallNote: this.activityCallViewOptions?.hideCallNote ?? false,
      isDefaultRecord: this.isDefaultRecord,
      isInbound: this.isInbound,
      isHistoryMode: this.isHistoryMode,
      viewCallId: this.viewCallId,
    };
  }

  @delegate('server')
  async setCallId(id: string) {
    this.evCall.setActivityCallId(id);
  }

  /**
   * Get UI action functions for the component
   */
  getUIFunctions(): UIFunctions<ActivityCallViewUIFunctions> {
    return {
      setCallId: async (id: string) => await this.setCallId(id),
      setViewCallId: (id: string) => this.setViewCallId(id),
      onBack: () => this.goBack(),
      onCallInfoClick: () => this.goToCallDetailPage(),
      onMute: () => this.mute(),
      onUnmute: () => this.unmute(),
      onHold: () => this.hold(),
      onUnhold: () => this.unhold(),
      onHangup: () => this.hangUp(),
      onRecord: () => this.onRecord(),
      onStopRecord: () => this.onStopRecord(),
      onPauseRecord: () => this.onPauseRecord(),
      onResumeRecord: () => this.onResumeRecord(),
      onRestartTimer: () => this.onRestartTimer(),
      onActiveCall: () => this.goToActiveCallList(),
      onTransfer: () => this.goToTransferPage(),
      onCopySuccess: (name) => this.onCopySuccess(name),
      setKeypadOpen: (isOpen) => this.setKeypadOpen(isOpen),
      handleKeypadChange: (value) => this.handleKeypadChange(value),
      handleKeypadKeyPress: (digit) => this.handleKeypadKeyPress(digit),
      onUpdateCallLog: (field, value) => this.onUpdateCallLog(field, value),
      disposeCall: () => this.disposeCall(),
      openAgentScript: () => this.evAgentScript.setIsDisplayAgentScript(true),
    };
  }

  /**
   * Navigate to the current active call page
   */
  goToActiveCall = () => {
    if (this.callId) {
      this.router.push(`/activityCallLog/${this.callId}`);
    }
  };

  /**
   * Check if user is currently on a call-related page
   */
  get isOnActiveCallPage(): boolean {
    const path = this.router.currentPath;
    if (!path) return false;
    return path.startsWith('/activityCallLog/') || path.startsWith('/history/');
  }

  /**
   * Announcement banner component for active call notification.
   * Renders in AppView's AppAnnouncementRender area.
   * Shows when there is an active call and the user is not on the call page.
   */
  @autobind
  Announcement() {
    const { t } = useLocale(i18n);
    const { hasActiveCall, isOnCallPage, contactName, phoneNumber, isInbound } =
      useConnector(() => {
        // Use evCall.currentCall (based on activityCallId) not this.currentCall
        // to avoid showing the banner for history-viewed calls
        const call = this.evCall.currentCall;
        const hasCall = !!call && !call.endedCall;
        const isInbound = call?.callType === 'INBOUND';
        const name = this.getContactName(call);
        const phone = call
          ? (isInbound ? call.ani : call.dnis) || ''
          : '';
        return {
          hasActiveCall: hasCall,
          isOnCallPage: this.isOnActiveCallPage,
          contactName: name,
          phoneNumber: formatPhoneNumber({ phoneNumber: phone }),
          isInbound,
        };
      });
    if (!hasActiveCall || isOnCallPage) {
      return null;
    }
    const displayName = contactName || phoneNumber || t('unknown');
    return (
      <AppAnnouncement>
        <div
          tabIndex={0}
          role="button"
          data-sign="activeCallAnnouncement"
          className="bg-gradient-mixed bg-base-primary-b-high-contrast bg-cover-neutral-b0/30 text-neutral-50 w-full py-2 pl-2 pr-4 flex items-center h-14"
          onClick={this.goToActiveCall}
        >
          <div className="relative">
            <Icon
              className="size-9 flex items-center justify-center"
              size="medium"
              symbol={ActiveCallMd}
              data-sign="active-call-icon"
            />
          </div>
          <div className="flex flex-col mx-3 flex-auto w-0">
            <span className="typography-subtitle truncate">{displayName}</span>
            <span className="typography-mainText truncate">
              {t('activeCall')}
            </span>
          </div>
          <Icon
            symbol={CaretRightMd}
            size="small"
            data-sign="goToActiveCallButton"
          />
        </div>
      </AppAnnouncement>
    );
  }

  component(_props?: ActivityCallViewProps) {
    const params = useParams<{ id?: string; method?: string }>();
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const uiProps = useConnector(() => this.getUIProps());

    const {
      activityCallId,
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
      timeStamp,
      basicInfo,
      isMultipleCalls,
      isInComingCall,
      showSubmitStep,
      allowTransfer,
      hideCallNote,
      isDefaultRecord,
      isInbound,
      isHistoryMode,
      viewCallId,
    } = uiProps;

    // Sync route param :id to viewCallId, and only set evCall.activityCallId for active calls
    useEffect(() => {
      if (params.id) {
        uiFunctions.setViewCallId(params.id);
        if (!isHistoryMode && params.id !== activityCallId) {
          const call = this.evPresence.callsMapping[params.id];
          if (!call?.endedCall) {
            this.logger.info('setCallId~~', params.id);
            uiFunctions.setCallId(params.id);
          }
        }
      }
    }, [params.id]);

    // Reset form state when navigating to a different call
    useEffect(() => {
      if (activityCallId || viewCallId) {
        this.reset();
      }
    }, [activityCallId, viewCallId]);

    const handleHoldToggle = useCallback(() => {
      if (isOnHold) {
        uiFunctions.onUnhold();
      } else {
        uiFunctions.onHold();
      }
    }, [isOnHold, uiFunctions]);

    const handleMuteToggle = useCallback(() => {
      if (isMuted) {
        uiFunctions.onUnmute();
      } else {
        uiFunctions.onMute();
      }
    }, [isMuted, uiFunctions]);

    const handleRecordClick = useCallback(() => {
      if (!callControlPermissions.allowRecordControl) return;
      if (isRecording) {
        if (callControlPermissions.allowPauseRecord) {
          uiFunctions.onPauseRecord();
        } else {
          uiFunctions.onStopRecord();
        }
      } else {
        uiFunctions.onRecord();
      }
    }, [isRecording, callControlPermissions, uiFunctions]);

    const showCallEnded = callStatus === 'callEnd';
    const pageTitle = isHistoryMode
      ? (params.method === 'create' ? t('createCallLog') : t('updateCallLog'))
      : (showCallEnded ? t('callLog') : t('activeCall'));
    const showRecordButton = callControlPermissions.allowRecordControl || isDefaultRecord;
    const isOnActive = isMultipleCalls;
    const showCountdown =
      callControlPermissions.allowPauseRecord &&
      recordPauseCount != null &&
      !isRecording &&
      !!timeStamp;
    if (!currentCall) {
      return (
        <div className="flex flex-col h-full bg-neutral-base">
          <AppHeaderNav override resetImmediately>
            <PageHeader onBackClick={uiFunctions.onBack}>
              {pageTitle}
            </PageHeader>
          </AppHeaderNav>
          <div className="flex-1 flex items-center justify-center text-neutral-b2">
            <p className="typography-mainText">{t('noActiveCall')}</p>
          </div>
          <AppFooterNav />
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-neutral-base overflow-hidden">
        <AppHeaderNav override resetImmediately>
          <PageHeader onBackClick={uiFunctions.onBack}>
            {pageTitle}
          </PageHeader>
        </AppHeaderNav>

        {/* IVR Alerts */}
        {ivrAlertData.length > 0 && (
          <IvrAlertPanel
            ivrAlertData={ivrAlertData}
            isCallEnd={showCallEnded}
          />
        )}

        {/* Call Info Header */}
        <CallInfoHeader
          subject={basicInfo?.subject}
          isInbound={isInbound}
          status={showCallEnded ? 'callEnd' : 'active'}
          isRinging={!showCallEnded}
          followInfos={basicInfo?.followInfos}
          callInfos={basicInfo?.callInfos}
          onClick={uiFunctions.onCallInfoClick}
          actions={
            <IconButton
              symbol={CaretRightMd}
              size="small"
              variant="icon"
              color="neutral"
              onClick={uiFunctions.onCallInfoClick}
              data-sign="viewCallDetailButton"
            />
          }
        />

        {/* IVR Alerts */}
        {ivrAlertData.length > 0 && (
          <IvrAlertPanel
            ivrAlertData={ivrAlertData}
            isCallEnd={showCallEnded}
          />
        )}

        {/* Content area with keypad overlay */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {showSubmitStep ? (
            <div className="flex-1 p-4 overflow-auto">
              <DispositionForm
                dispositionPickList={dispositionPickList}
                dispositionData={dispositionData}
                validated={validated}
                required={required}
                hideCallNote={hideCallNote}
                onFieldChange={uiFunctions.onUpdateCallLog}
                selectPlaceholder={t('pleaseSelect')}
                dispositionErrorText={t('dispositionError')}
                notesErrorText={t('notesRequired')}
                dispositionLabel={t('disposition')}
                notesLabel={t('notes')}
                notesPlaceholder={t('enterNotes')}
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}
          {!showCallEnded && (
            <DialpadPanel
              isOpen={isKeypadOpen}
              value={keypadValue}
              onToggle={uiFunctions.setKeypadOpen}
              onChange={uiFunctions.handleKeypadChange}
              onKeyPress={uiFunctions.handleKeypadKeyPress}
              footer={
                <div className="border-t border-neutral-b4 px-4 py-3">
                  <EvCallControlButtons
                    isMuted={isMuted}
                    isOnHold={isOnHold}
                    isRecording={isRecording}
                    isDefaultRecord={isDefaultRecord}
                    showMuteButton={isIntegratedSoftphone}
                    showHoldButton={callControlPermissions.allowHoldCall}
                    showTransferButton={allowTransfer}
                    showRecordButton={showRecordButton}
                    showHangupButton={!isOnActive}
                    showActiveCallButton={isOnActive}
                    onMute={handleMuteToggle}
                    onHold={handleHoldToggle}
                    onTransfer={uiFunctions.onTransfer}
                    onRecord={handleRecordClick}
                    onHangup={uiFunctions.onHangup}
                    onActiveCall={uiFunctions.onActiveCall}
                    disabled={isInComingCall}
                    disableTransfer={isInComingCall || !allowTransfer}
                    disableRecord={!callControlPermissions.allowRecordControl}
                    size="small"
                  />
                </div>
              }
            />
          )}
        </div>

        {/* Pinned bottom section */}
        <div className="flex-shrink-0">
          {/* Record Countdown */}
          {!showCallEnded && showCountdown && (
            <div className="flex justify-center py-2">
              <RecordCountdown
                recordPauseCount={recordPauseCount!}
                timeStamp={timeStamp!}
                onResumeRecord={uiFunctions.onResumeRecord}
                onRestartTimer={uiFunctions.onRestartTimer}
              />
            </div>
          )}
          {/* Call Controls - pinned at bottom when active */}
          {!showCallEnded && (
            <div className="border-t border-neutral-b4 px-4 py-3">
              <EvCallControlButtons
                isMuted={isMuted}
                isOnHold={isOnHold}
                isRecording={isRecording}
                isDefaultRecord={isDefaultRecord}
                showMuteButton={isIntegratedSoftphone}
                showHoldButton={callControlPermissions.allowHoldCall}
                showTransferButton={allowTransfer}
                showRecordButton={showRecordButton}
                showHangupButton={!isOnActive}
                showActiveCallButton={isOnActive}
                onMute={handleMuteToggle}
                onHold={handleHoldToggle}
                onTransfer={uiFunctions.onTransfer}
                onRecord={handleRecordClick}
                onHangup={uiFunctions.onHangup}
                onActiveCall={uiFunctions.onActiveCall}
                disabled={isInComingCall}
                disableTransfer={isInComingCall || !allowTransfer}
                disableRecord={!callControlPermissions.allowRecordControl}
                size="small"
              />
            </div>
          )}

          {/* Submit Button - Only show when call ended */}
          {showCallEnded && showSubmitStep && (
            <div className="p-4 border-t border-neutral-b4 shadow-[0_-2px_5px_0_rgba(0,0,0,0.15)]">
              <Button
                data-sign="submitButton"
                size="large"
                fullWidth
                disabled={
                  saveStatus === SaveStatus.SAVING ||
                  (saveStatus === SaveStatus.SUBMIT && (
                    (dispositionPickList.length > 0 && !dispositionData?.dispositionId) ||
                    (required.notes && !dispositionData?.notes)
                  ))
                }
                loading={saveStatus === SaveStatus.SAVING}
                onClick={uiFunctions.disposeCall}
                color={saveStatus === SaveStatus.SAVED ? 'success' : 'primary'}
              >
                {saveStatus === SaveStatus.SAVED ? (
                  <Icon symbol={CheckMd} size="medium" />
                ) : saveStatus === SaveStatus.SAVING ? null : (
                  t('submit')
                )}
              </Button>
            </div>
          )}
        </div>
        <AppFooterNav />
      </div>
    );
  }
}

export { ActivityCallView };

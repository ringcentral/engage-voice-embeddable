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
import { IconButton, Icon, Textarea, CallButton } from '@ringcentral/spring-ui';
import { ContactAvatar } from '@ringcentral-integration/micro-contacts/src/app/components';
import {
  ActiveCallMd,
  CaretRightMd,
  TransferCallMd,
  DispositionMd,
  HoldMd,
  MuteMd,
  MicrophoneMd,
  RecordMd,
  DialpadMd,
} from '@ringcentral/spring-icon';

import { EvPresence } from '../../services/EvPresence';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvCallDisposition } from '../../services/EvCallDisposition';
import { EvIntegratedSoftphone } from '../../services/EvIntegratedSoftphone';
import { EvActiveCallControl } from '../../services/EvActiveCallControl';
import { EvAgentSession } from '../../services/EvAgentSession';
import { EvTransferCall } from '../../services/EvTransferCall';
import { EvRequeueCall } from '../../services/EvRequeueCall';
import { EvAgentScript } from '../../services/EvAgentScript';
import { EvAuth } from '../../services/EvAuth';
import { dialoutStatuses } from '../../../enums';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber/formatPhoneNumber';
import type { EvCallData } from '../../services/EvCallDataSource/EvCallDataSource.interface';
import type { EvCallDispositionData } from '../../services/EvCallDisposition/EvCallDisposition.interface';

import { CallControlGrid } from '../../components/CallControlGrid';
import type { CallControlAction } from '../../components/CallControlGrid';
import { IvrAlertPanel } from '../../components/IvrAlertPanel';
import { DialpadPanel } from '../../components/DialpadPanel';
import { RecordCountdown } from '../../components/RecordCountdown';
import type {
  ActiveCallViewProps,
  ActiveCallViewUIProps,
  ActiveCallViewUIFunctions,
} from './ActiveCallView.interface';
import i18n, { t as translate } from './i18n';

/**
 * ActiveCallView options for configuration
 */
export interface ActiveCallViewOptions {
  hideCallNote?: boolean;
}

/**
 * ActiveCallView module - Active call control with Spring UI grid layout
 */
@injectable({
  name: 'ActiveCallView',
})
class ActiveCallView extends RcViewModule {
  pickUpDirectly = true;

  constructor(
    private evPresence: EvPresence,
    private evCall: EvCall,
    private evCallMonitor: EvCallMonitor,
    private evCallDisposition: EvCallDisposition,
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
    private portManager: PortManager,
    @optional('ActiveCallViewOptions')
    private activeCallViewOptions?: ActiveCallViewOptions,
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

  @state
  viewCallId = '';

  @action
  setKeypadOpen(isOpen: boolean) {
    this.isKeypadOpen = isOpen;
  }

  @action
  setKeypadValue(value: string) {
    this.keypadValue = value;
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
  }

  /**
   * Set default recording state on call ringing
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

  get callId(): string {
    return this.viewCallId || this.evCall.activityCallId;
  }

  get currentCall() {
    const id = this.callId;
    if (!id) return null;
    const call = this.evPresence.callsMapping[id];
    if (!call) return null;
    const monitorCallId = this.evCallMonitor.getCallId(call.session || {});
    return this.evCallMonitor.callsMapping[monitorCallId] || call;
  }

  get currentMainCall() {
    const call = this.currentCall;
    if (!call) return null;
    return this.evActiveCallControl.getMainCall(call.uii);
  }

  get agentRecording() {
    return this.currentMainCall?.agentRecording;
  }

  get isDefaultRecord(): boolean {
    return this.agentRecording?.default === 'ON';
  }

  get isInbound(): boolean {
    return this.evCall.isInbound;
  }

  get isInComingCall(): boolean {
    return this.evCall.isInbound && !this.pickUpDirectly;
  }

  @computed((that: ActiveCallView) => [
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

  @computed((that: ActiveCallView) => [that.callList])
  get isMultipleCalls(): boolean {
    return this.callList.length > 2;
  }

  @computed((that: ActiveCallView) => [
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

  get allowTransferCall(): boolean {
    const call = this.currentCall;
    return !!(call?.allowTransfer && !call?.endedCall);
  }

  get allowTransfer(): boolean {
    return this.allowTransferCall || this.evRequeueCall.allowRequeueCall;
  }

  @computed((that: ActiveCallView) => [that.currentCall])
  get ivrAlertData(): Array<{ subject: string; body: string }> {
    const call = this.currentCall;
    const result: Array<{ subject: string; body: string }> = [];
    if (call?.baggage) {
      for (let i = 1; i <= 3; i++) {
        const subject = call.baggage[`ivrAlertSubject_${i}`];
        const body = call.baggage[`ivrAlertBody_${i}`];
        if (subject || body) {
          result.push({ subject: subject || '', body: body || '' });
        }
      }
    }
    return result;
  }

  @computed((that: ActiveCallView) => [
    that.currentCall,
    that.currentMainCall,
    that.agentRecording,
  ])
  get callControlPermissions() {
    return {
      allowTransferCall: this.allowTransferCall,
      allowHoldCall: this.currentMainCall?.allowHold ?? true,
      allowHangupCall: this.currentMainCall?.allowHangup ?? true,
      allowRecordControl: this.agentRecording?.agentRecording ?? false,
      allowPauseRecord: typeof this.agentRecording?.pause === 'number',
    };
  }

  @computed((that: ActiveCallView) => [that.currentCall])
  get basicInfo() {
    const call = this.currentCall as any;
    if (!call) return null;
    const isInbound = call.callType === 'INBOUND';
    const contactMatches: any[] = call.contactMatches || [];
    const contactMatch = contactMatches[0];
    const name = contactMatch?.name;
    const fromNumber = isInbound ? call.ani : call.dnis;
    const toNumber = isInbound ? call.dnis : call.ani;
    const fromMatchName = name || fromNumber;
    const toMatchName = name || toNumber;
    const phoneNumber = isInbound ? fromNumber : toNumber;
    const formattedNumber = formatPhoneNumber({ phoneNumber: phoneNumber || '' });
    return {
      subject: isInbound ? fromMatchName : toMatchName,
      contactName: name,
      phoneNumber: phoneNumber || undefined,
      avatarUrl: contactMatch?.profileImageUrl,
      followInfos: [
        formattedNumber,
        ...(call.queue?.name ? [call.queue.name] : []),
      ],
    };
  }

  getContactName(call: any): string {
    if (!call) return '';
    const contactMatches = call.contactMatches || [];
    if (contactMatches.length > 0) {
      return contactMatches[0].name || call.ani;
    }
    return call.ani || '';
  }

  // Call Control Actions

  @delegate('server')
  async hangUp() {
    if (this.currentCall?.session?.sessionId) {
      await this.evActiveCallControl.hangUp(this.currentCall.session.sessionId);
    }
  }

  @delegate('server')
  async handleHoldOrUnhold(type: 'hold' | 'unhold') {
    if (this.isMultipleCalls) {
      this.goToActiveCallList();
      return;
    }
    this.evActiveCallControl[type]();
  }

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
      this.toast.success({ message: translate('recordPaused') });
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  onResumeRecord = () => {
    this.evActiveCallControl.resumeRecord();
    this.toast.success({ message: translate('recordResume') });
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
    if (value.length > this.keypadValue.length) {
      const newDigit = value.charAt(value.length - 1);
      this.sendDTMF(newDigit);
    }
    this.setKeypadValue(value);
  };

  handleKeypadKeyPress = (digit: string) => {
    this.sendDTMF(digit);
  };

  // Notes Actions

  onUpdateNotes = (value: string) => {
    const callId = this.callId;
    const currentData = this.evCallDisposition.getDisposition(callId) || { dispositionId: null, notes: '' };
    const updatedData: EvCallDispositionData = {
      dispositionId: currentData.dispositionId,
      notes: value,
    };
    this.evCallDisposition.setDisposition(callId, updatedData);
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

  goToDispositionPage = () => {
    this.router.push(`/activityCallLog/${this.callId}/disposition`);
  };

  @delegate('server')
  async goBack() {
    this.evCall.setDialoutStatus(dialoutStatuses.idle);
    this.setViewCallId('');
    this.router.goBack();
    this.reset();
  }

  @delegate('server')
  async setCallId(id: string) {
    this.evCall.setActivityCallId(id);
  }

  goToActiveCall = () => {
    if (this.callId) {
      this.router.push(`/activityCallLog/${this.callId}`);
    }
  };

  get isOnActiveCallPage(): boolean {
    const path = this.router.currentPath;
    if (!path) return false;
    return path.startsWith('/activityCallLog/') || path.startsWith('/history/');
  }

  /**
   * Build the ordered list of call control action buttons.
   * Add, remove, or reorder entries here to change the grid layout.
   */
  /**
   * Build the ordered list of call control action buttons.
   * All buttons are always present; disabled when the user lacks permission.
   * Add or reorder entries here to change the grid layout.
   */
  buildCallActions({
    t,
    isMuted,
    isOnHold,
    isRecording,
    isDefaultRecord,
    isInComingCall,
    callControlPermissions,
    isIntegratedSoftphone,
    allowTransfer,
    showRecordButton,
    uiFunctions,
    handleHoldToggle,
    handleMuteToggle,
    handleRecordClick,
  }: {
    t: (key: string) => string;
    isMuted: boolean;
    isOnHold: boolean;
    isRecording: boolean;
    isDefaultRecord: boolean;
    isInComingCall: boolean;
    callControlPermissions: ActiveCallViewUIProps['callControlPermissions'];
    isIntegratedSoftphone: boolean;
    allowTransfer: boolean;
    showRecordButton: boolean;
    uiFunctions: ActiveCallViewUIFunctions;
    handleHoldToggle: () => void;
    handleMuteToggle: () => void;
    handleRecordClick: () => void;
  }): CallControlAction[] {
    const disableRecord = !callControlPermissions.allowRecordControl;
    const isAutoIndicator = disableRecord && isDefaultRecord;
    const actions: CallControlAction[] = [
      {
        actionType: 'mute',
        symbol: isIntegratedSoftphone && isMuted ? MuteMd : MicrophoneMd,
        label: isMuted ? t('unmute') : t('mute'),
        onClick: handleMuteToggle,
        disabled: isInComingCall || !isIntegratedSoftphone,
        color: isMuted ? 'danger' : 'neutral',
      },
      {
        actionType: 'keypad',
        symbol: DialpadMd,
        label: t('keypad'),
        onClick: () => uiFunctions.setKeypadOpen(true),
        disabled: isInComingCall,
      },
      {
        actionType: 'hold',
        symbol: HoldMd,
        label: isOnHold ? t('unhold') : t('hold'),
        onClick: handleHoldToggle,
        disabled: isInComingCall || !callControlPermissions.allowHoldCall,
        color: isOnHold ? 'warning' : 'neutral',
      },
      {
        actionType: 'transfer',
        symbol: TransferCallMd,
        label: t('transfer'),
        onClick: uiFunctions.onTransfer,
        disabled: isInComingCall || !allowTransfer,
      },
      {
        actionType: 'record' as const,
        symbol: RecordMd,
        label: isRecording ? t('stopRecord') : t('record'),
        onClick: isAutoIndicator ? undefined : handleRecordClick,
        disabled: isInComingCall || disableRecord || !showRecordButton,
        color: (isRecording || isDefaultRecord ? 'danger' : 'neutral') as 'danger' | 'neutral',
        indicator: isAutoIndicator,
        tooltip: isAutoIndicator ? 'Recording' : undefined,
      },
      {
        actionType: 'disposition',
        symbol: DispositionMd,
        label: t('disposition'),
        onClick: uiFunctions.onDisposition,
        disabled: isInComingCall,
      },
    ];
    return actions;
  }

  getUIProps(): UIProps<ActiveCallViewUIProps> {
    const call = this.currentCall;
    const callId = this.callId;
    const dispositionData = this.evCallDisposition.getDisposition(callId);
    return {
      activityCallId: this.evCall.activityCallId,
      currentCall: call,
      isMuted: this.evIntegratedSoftphone.muteActive,
      isOnHold: this.isOnHold,
      isRecording: this.evActiveCallControl.isRecording,
      isKeypadOpen: this.isKeypadOpen,
      keypadValue: this.keypadValue,
      ivrAlertData: this.ivrAlertData,
      callControlPermissions: this.callControlPermissions,
      isIntegratedSoftphone: this.evAgentSession.isIntegratedSoftphone,
      recordPauseCount: this.agentRecording?.pause,
      timeStamp: this.evActiveCallControl.timeStamp,
      basicInfo: this.basicInfo,
      isMultipleCalls: this.isMultipleCalls,
      isInComingCall: this.isInComingCall,
      allowTransfer: this.allowTransfer,
      isDefaultRecord: this.isDefaultRecord,
      isInbound: this.isInbound,
      notes: dispositionData?.notes || '',
    };
  }

  getUIFunctions(): UIFunctions<ActiveCallViewUIFunctions> {
    return {
      setCallId: async (id: string) => await this.setCallId(id),
      setViewCallId: (id: string) => this.setViewCallId(id),
      onBack: () => this.goBack(),
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
      onDisposition: () => this.goToDispositionPage(),
      setKeypadOpen: (isOpen) => this.setKeypadOpen(isOpen),
      handleKeypadChange: (value) => this.handleKeypadChange(value),
      handleKeypadKeyPress: (digit) => this.handleKeypadKeyPress(digit),
      onUpdateNotes: (value) => this.onUpdateNotes(value),
    };
  }

  /**
   * Announcement banner for active call notification
   */
  @autobind
  Announcement() {
    const { t } = useLocale(i18n);
    const { hasActiveCall, isOnCallPage, contactName, phoneNumber } =
      useConnector(() => {
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

  component(_props?: ActiveCallViewProps) {
    const params = useParams<{ id?: string }>();
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const uiProps = useConnector(() => this.getUIProps());

    const {
      activityCallId,
      currentCall,
      isMuted,
      isOnHold,
      isRecording,
      isKeypadOpen,
      keypadValue,
      ivrAlertData,
      callControlPermissions,
      isIntegratedSoftphone,
      recordPauseCount,
      timeStamp,
      basicInfo,
      isMultipleCalls,
      isInComingCall,
      allowTransfer,
      isDefaultRecord,
      isInbound,
      notes,
    } = uiProps;

    useEffect(() => {
      if (params.id) {
        uiFunctions.setViewCallId(params.id);
        if (params.id !== activityCallId) {
          const call = this.evPresence.callsMapping[params.id];
          if (!call?.endedCall) {
            uiFunctions.setCallId(params.id);
          }
        }
      }
    }, [params.id]);

    useEffect(() => {
      if (activityCallId) {
        this.reset();
      }
    }, [activityCallId]);

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

    const handleNotesChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        uiFunctions.onUpdateNotes(e.target.value);
      },
      [uiFunctions],
    );

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
              {t('activeCall')}
            </PageHeader>
          </AppHeaderNav>
          <div className="flex-1 flex items-center justify-center text-neutral-b2">
            <p className="typography-mainText">{t('noActiveCall')}</p>
          </div>
          <AppFooterNav />
        </div>
      );
    }

    const callActions = this.buildCallActions({
      t,
      isMuted,
      isOnHold,
      isRecording,
      isDefaultRecord,
      isInComingCall,
      callControlPermissions,
      isIntegratedSoftphone,
      allowTransfer,
      showRecordButton,
      uiFunctions,
      handleHoldToggle,
      handleMuteToggle,
      handleRecordClick,
    });

    return (
      <div className="flex flex-col h-full bg-neutral-base overflow-hidden">
        <AppHeaderNav override resetImmediately>
          <PageHeader onBackClick={uiFunctions.onBack}>
            {t('activeCall')}
          </PageHeader>
        </AppHeaderNav>

        {ivrAlertData.length > 0 && (
          <IvrAlertPanel
            ivrAlertData={ivrAlertData}
            isCallEnd={false}
          />
        )}

        <div
          data-sign="callInformation"
          className="w-full py-2 pl-2 pr-4 flex items-center"
        >
          <ContactAvatar
            size="large"
            contactName={basicInfo?.contactName}
            phoneNumber={basicInfo?.phoneNumber}
            url={basicInfo?.avatarUrl}
          />
          <div className="flex-auto ml-2 min-w-0">
            <h3
              className="typography-title text-neutral-b0 truncate"
              data-sign="contactName"
            >
              {basicInfo?.subject}
            </h3>
            {basicInfo?.followInfos?.filter(Boolean).map((info, idx) => (
              <p
                key={idx}
                className="typography-descriptorMini text-neutral-b2 truncate"
                data-sign="followInfo"
              >
                {info}
              </p>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="flex-1 flex flex-col overflow-auto">
            {!this.activeCallViewOptions?.hideCallNote && (
              <div className="px-4 pt-3 min-w-0">
                <Textarea
                  placeholder={t('enterCallNotes')}
                  value={notes}
                  onChange={handleNotesChange}
                  data-sign="quickNotesInput"
                  rows={3}
                  maxLength={32000}
                  fullWidth
                />
              </div>
            )}
            <div className="flex-1" />
            <div className="px-6 py-4">
              <CallControlGrid actions={callActions} />
            </div>
          </div>

          <DialpadPanel
            isOpen={isKeypadOpen}
            value={keypadValue}
            onToggle={uiFunctions.setKeypadOpen}
            onChange={uiFunctions.handleKeypadChange}
            onKeyPress={uiFunctions.handleKeypadKeyPress}
          />
        </div>

        <div className="flex-shrink-0">
          {showCountdown && (
            <div className="flex justify-center py-2">
              <RecordCountdown
                recordPauseCount={recordPauseCount!}
                timeStamp={timeStamp!}
                onResumeRecord={uiFunctions.onResumeRecord}
                onRestartTimer={uiFunctions.onRestartTimer}
              />
            </div>
          )}
          <div className="flex justify-center py-4">
            {isOnActive ? (
              <IconButton
                symbol={ActiveCallMd}
                onClick={uiFunctions.onActiveCall}
                disabled={isInComingCall}
                size="large"
                variant="inverted"
                color="success"
                data-sign="activeCallButton"
                TooltipProps={{ title: 'Active Calls' }}
              />
            ) : (
              <CallButton
                variant="end"
                onClick={uiFunctions.onHangup}
                disabled={isInComingCall}
                size="medium"
                data-sign="hangupButton"
                TooltipProps={{ title: t('hangUp') }}
              />
            )}
          </div>
        </div>
        <AppFooterNav />
      </div>
    );
  }
}

export { ActiveCallView };

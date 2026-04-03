import React, { useRef, useEffect, useState } from 'react';
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
  PortManager,
  delegate,
  type UIProps,
  type UIFunctions,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';
import { AppAnnouncement, AppFooterNav, AppHeaderNav } from '@ringcentral-integration/micro-core/src/app/components';
import { PageHeader } from '@ringcentral-integration/next-widgets/components';
import { Toast } from '@ringcentral-integration/micro-core/src/app/services';
import { Announcement, Button, Icon } from '@ringcentral/spring-ui';
import { CheckMd } from '@ringcentral/spring-icon';

import { EvPresence } from '../../services/EvPresence';
import { EvAuth } from '../../services/EvAuth';
import { EvCall } from '../../services/EvCall';
import { EvCallMonitor } from '../../services/EvCallMonitor';
import { EvCallDisposition } from '../../services/EvCallDisposition';
import { EvWorkingState } from '../../services/EvWorkingState';
import { EvAgentScript } from '../../services/EvAgentScript';
import { EvActiveCallControl } from '../../services/EvActiveCallControl';
import { ThirdParty } from '../../services/ThirdParty';
import { EvClient } from '../../services/EvClient';
import { dialoutStatuses } from '../../../enums';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber/formatPhoneNumber';
import { getClockByTimestamp } from '../../../lib/getClockByTimestamp';
import { formatEvCallForConnected } from '../../../lib/formatEvCall';
import type {
  EvCallDispositionData,
} from '../../services/EvCallDisposition/EvCallDisposition.interface';

import { CallInfoHeader } from '../../components/CallInfoHeader';
import { DispositionForm } from '../../components/DispositionForm';
import { getCallInfos } from '../../utils/getCallInfos';
import { shouldShowDispositionSubmitStep } from '../../utils/shouldShowDispositionSubmitStep';
import type {
  DispositionViewProps,
  DispositionViewUIProps,
  DispositionViewUIFunctions,
} from './DispositionView.interface';
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
 * DispositionView options for configuration
 */
export interface DispositionViewOptions {
  hideCallNote?: boolean;
}

/**
 * Disposition Item
 */
interface DispositionItem {
  dispositionId: string;
  disposition: string;
  label: string;
  requireNote?: boolean;
}

/**
 * DispositionView module - Disposition form and call log submission
 */
@injectable({
  name: 'DispositionView',
})
class DispositionView extends RcViewModule {
  private readonly dialerPath = '/agent/dialer';

  constructor(
    private evPresence: EvPresence,
    private evAuth: EvAuth,
    private evCall: EvCall,
    private evCallMonitor: EvCallMonitor,
    private evCallDisposition: EvCallDisposition,
    private evWorkingState: EvWorkingState,
    private evAgentScript: EvAgentScript,
    private evActiveCallControl: EvActiveCallControl,
    private thirdParty: ThirdParty,
    private evClient: EvClient,
    private router: RouterPlugin,
    private toast: Toast,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('DispositionViewOptions')
    private dispositionViewOptions?: DispositionViewOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
  }

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
  _setViewCallId(id: string) {
    this.viewCallId = id;
  }

  @delegate('server')
  async setViewCallId(id: string) {
    this._setViewCallId(id);
  }

  @action
  reset() {
    this.saveStatus = SaveStatus.SUBMIT;
    this.validated = { dispositionId: true, notes: true };
    this.required = { notes: false };
  }

  get isHistoryMode(): boolean {
    return this.router.currentPath?.startsWith('/history/') ?? false;
  }

  get callId(): string {
    return this.viewCallId || this.evCall.activityCallId;
  }

  get hasCurrentCall(): boolean {
    return !!this.currentCall;
  }

  get currentCall() {
    const id = this.callId;
    if (!id) return null;
    const call = this.evPresence.callsMapping[id];
    if (!call) return null;
    const monitorCallId = this.evCallMonitor.getCallId(call.session || {});
    return this.evCallMonitor.callsMapping[monitorCallId] || call;
  }

  @computed((that: DispositionView) => [that.currentCall, that.isHistoryMode])
  get callStatus(): 'active' | 'callEnd' {
    if (this.currentCall?.endedCall || this.isHistoryMode) {
      return 'callEnd';
    }
    return 'active';
  }

  @computed((that: DispositionView) => [that.currentCall])
  get dispositionPickList(): DispositionItem[] {
    const dispositions = this.currentCall?.outdialDispositions?.dispositions || [];
    return dispositions.map((item: any) => ({
      ...item,
      label: item.disposition,
      value: item.dispositionId,
    }));
  }

  /**
   * Whether to show the submit/disposition step
   */
  get showSubmitStep(): boolean {
    return shouldShowDispositionSubmitStep(
      this.currentCall,
      this.dispositionViewOptions,
    );
  }

  @computed((that: DispositionView) => [that.currentCall])
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

  get isInbound(): boolean {
    return this.currentCall?.callType === 'INBOUND';
  }

  get showSummary(): boolean {
    return this.isSummaryEnabled(this.currentCall);
  }

  private getSummarySegmentId(call?: {
    session?: { segmentId?: string };
    segmentContext?: { segmentId?: string };
  } | null): string {
    if (!call) {
      return '';
    }
    return call.session?.segmentId || call.segmentContext?.segmentId || '';
  }

  private isSummaryEnabled(call?: { session?: { summary?: boolean } } | null): boolean {
    if (!call) {
      return false;
    }
    return !!call.session?.summary;
  }

  getContactName(call: any): string {
    if (!call) return '';
    const contactMatches = call.contactMatches || [];
    if (contactMatches.length > 0) {
      return contactMatches[0].name || call.ani;
    }
    return call.ani || '';
  }

  @delegate('server')
  async goBack() {
    if (this.isHistoryMode) {
      this._setViewCallId('');
      this.router.goBack();
      this.reset();
      return;
    }
    const isEnded = this.callStatus === 'callEnd' || !this.hasCurrentCall;
    if (isEnded) {
      this.evCall.setDialoutStatus(dialoutStatuses.idle);
      this._setViewCallId('');
      this.router.replace(this.dialerPath);
      this.reset();
      this.evCall.setActivityCallId('');
    } else {
      this.router.goBack();
      this.reset();
    }
  }

  @delegate('server')
  async onUpdateCallLog(field: string, value: string) {
    const callId = this.callId;
    const currentData = this.evCallDisposition.getDisposition(callId) || {
      dispositionId: null,
      notes: '',
      summary: '',
    };
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
      summary: currentData.summary,
      [field]: value,
    };
    this.evCallDisposition.setDisposition(callId, updatedData);
  };

  @delegate('server')
  async onUpdateSummary(value: string) {
    this.evCallDisposition.setSummary(this.callId, value);
  }

  @delegate('server')
  async requestConversationSummary(callId: string, callStatus: 'active' | 'callEnd') {
    const call = this.evPresence.callsMapping[callId];
    this.logger.info('requestConversationSummary~~', callId, callStatus);
    if (!this.isSummaryEnabled(call)) {
      this.logger.info('requestConversationSummary~~ not enabled', callId, callStatus);
      return;
    }
    const segmentId = this.getSummarySegmentId(call);
    const sessionId = call.session?.sessionId;
    if (!segmentId || !sessionId) {
      return;
    }
    const summaryState = this.evCallDisposition.getSummaryState(callId);
    if (summaryState) {
      if (!summaryState.isFinal) {
        this.logger.info('requestConversationSummary~~ not final', callId, callStatus);
        return;
      }
      // if the summary is edited after the final, we don't need to request again
      if (summaryState.isEditedAfterFinal) {
        this.logger.info('requestConversationSummary~~ not edited after final', callId, callStatus);
        return;
      }
    }
    this.logger.info('requestConversationSummary~~ start request', callId, callStatus);
    const uii = this.evClient.decodeUii(call.uii);
    this.evCallDisposition.startSummaryRequest(callId, segmentId);
    try {
      await this.evClient.requestCallSummary(uii, sessionId, segmentId);
    } catch (error) {
      this.evCallDisposition.setSummaryRequestError(callId, segmentId);
      this.logger.error('requestConversationSummary failed', error);
    }
  }

  @delegate('server')
  async goToPendingDisposition() {
    const callId = this.evWorkingState.pendingDispositionCallId || this.evCall.activityCallId;
    if (!callId) {
      return;
    }
    const call = this.evPresence.callsMapping[callId];
    if (!call || !shouldShowDispositionSubmitStep(call, this.dispositionViewOptions)) {
      await this.evWorkingState.setIsPendingDisposition(false);
      this.router.replace(this.dialerPath);
      return;
    }
    this.router.push(`/activityCallLog/${callId}/disposition`);
  }

  /**
   * Announcement banner shown when agent is in Pending Disposition state.
   * Renders in AppView's AppAnnouncementRender area.
   */
  @autobind
  Announcement() {
    const { t } = useLocale(i18n);
    const { isPendingDisposition, time } = useConnector(() => ({
      isPendingDisposition: this.evWorkingState.isPendingDisposition,
      time: this.evWorkingState.time,
    }));
    const [intervalTime, setIntervalTime] = useState(() => Date.now() - time);
    useEffect(() => {
      if (!isPendingDisposition) return;
      const updateTimer = () => {
        setIntervalTime(Date.now() - time);
      };
      updateTimer();
      const timerId = setInterval(updateTimer, 1000);
      return () => clearInterval(timerId);
    }, [isPendingDisposition, time]);
    if (!isPendingDisposition) {
      return null;
    }
    const timerText = getClockByTimestamp(intervalTime);
    return (
      <AppAnnouncement>
        <Announcement
          severity="neutral"
          className="rounded-none cursor-pointer"
          classes={{ body: 'gap-2' }}
          data-sign="pendingDispositionAnnouncement"
          onClick={() => this.goToPendingDisposition()}
          action={
            <span className="typography-subtitleMini">{timerText}</span>
          }
        >
          {t('pendingDisposition')}
        </Announcement>
      </AppAnnouncement>
    );
  }

  @computed((that: DispositionView) => [that.currentCall])
  get callLogData() {
    const call = this.currentCall;
    if (!call) return null;
    return formatEvCallForConnected(call as any);
  }

  private async doDisposeCall() {
    const call = this.currentCall;
    const disposition = this.evCallDisposition.getDisposition(this.callId);
    try {
      if (this.callLogData) {
        await this.thirdParty.logCall({
          call: this.callLogData,
          task: disposition,
          sessionId: this.callId,
        });
      }
    } catch (e) {
      this.logger.error('thirdParty logCall error~~', e);
    }
    const dialogId = call?.session.dialogId;
    const dispositionId = disposition?.dispositionId;
    await this.evCallDisposition.disposeCall(this.callId);
    if (dialogId && this.summary && dispositionId) {
      const dispositionItem = this.dispositionPickList.find(
        p => p.dispositionId === dispositionId
      );
      const authorized = await this.evAuth.refreshEvToken();
      if (!authorized) {
        return;
      }
      await this.evClient.updateActivityDisposition({
        dialogId,
        params: {
          dispositionName: dispositionItem?.label || '',
          agentSummary: this.summary,
          agentNotes: disposition?.notes || '',
        },
      });
    }
    if (call?.scriptId) {
      this.evAgentScript.setCurrentCallScript(null);
      this.evAgentScript.saveScriptResult(call);
    }
  }

  @delegate('server')
  async disposeCall() {
    if (this.saveStatus === SaveStatus.SAVED) {
      this.goBack();
      return;
    }
    const callId = this.callId;
    const saveFields = this.evCallDisposition.getDisposition(callId);
    this.setValidated({
      notes: !this.required.notes || (this.required.notes && !!saveFields?.notes),
    });
    if (!this.validated.dispositionId || !this.validated.notes) {
      return;
    }
    const shouldGoToDialerAfterSubmit = this.callStatus === 'callEnd' || !this.hasCurrentCall;
    try {
      this.setSaveStatus(SaveStatus.SAVING);
      await this.doDisposeCall();
      this.setSaveStatus(SaveStatus.SAVED);
      this.toast.success({ message: translate('callDispositionSuccess') });
      await this.evWorkingState.setIsPendingDisposition(false);
      setTimeout(() => {
        if (shouldGoToDialerAfterSubmit) {
          this.evCall.setDialoutStatus(dialoutStatuses.idle);
          this._setViewCallId('');
          this.router.replace(this.dialerPath);
          this.reset();
          this.evCall.setActivityCallId('');
          return;
        }
        this.goBack();
      }, 1000);
    } catch (e) {
      console.error(e);
      this.setSaveStatus(SaveStatus.SUBMIT);
      this.toast.danger({
        message: translate('callDispositionFailed'),
        ttl: 0,
      });
    }
  };

  get summary() {
    return this.evCallDisposition.getDisposition(this.callId)?.summary || '';
  }

  getUIProps(): UIProps<DispositionViewUIProps> {
    const callId = this.callId;
    const summaryState = this.evCallDisposition.getSummaryState(callId);
    const segmentId = this.getSummarySegmentId(this.currentCall);
    return {
      currentCall: this.currentCall,
      callStatus: this.callStatus,
      saveStatus: this.saveStatus,
      dispositionPickList: this.dispositionPickList,
      validated: this.validated,
      required: this.required,
      dispositionData: this.evCallDisposition.getDisposition(callId),
      basicInfo: this.basicInfo,
      isInbound: this.isInbound,
      isDisposed: this.evCallDisposition.isDisposed(callId),
      isHistoryMode: this.isHistoryMode,
      showSubmitStep: this.showSubmitStep,
      hideCallNote: this.dispositionViewOptions?.hideCallNote ?? false,
      showSummary: this.showSummary,
      segmentId,
      summary: this.summary,
      isSummaryFinal: summaryState?.isFinal || false,
      isSummaryLoading: summaryState?.isLoading || false,
      isSummaryEdited: summaryState?.isEditedAfterFinal || false,
    };
  }

  getUIFunctions(): UIFunctions<DispositionViewUIFunctions> {
    return {
      setViewCallId: (id: string) => this.setViewCallId(id),
      onBack: () => this.goBack(),
      onUpdateCallLog: (field, value) => this.onUpdateCallLog(field, value),
      onUpdateSummary: (value) => this.onUpdateSummary(value),
      disposeCall: () => this.disposeCall(),
    };
  }

  component(_props?: DispositionViewProps) {
    const params = useParams<{ id?: string; method?: string }>();
    const { t } = useLocale(i18n);
    const { current: uiFunctions } = useRef(this.getUIFunctions());

    const uiProps = useConnector(() => this.getUIProps());

    const {
      currentCall,
      callStatus,
      saveStatus,
      dispositionPickList,
      validated,
      required,
      dispositionData,
      basicInfo,
      isInbound,
      isDisposed,
      isHistoryMode,
      showSubmitStep,
      hideCallNote,
      showSummary,
      segmentId,
      summary,
      isSummaryFinal,
      isSummaryLoading,
      isSummaryEdited,
    } = uiProps;

    useEffect(() => {
      if (params.id) {
        uiFunctions.setViewCallId(params.id);
      }
    }, [params.id]);

    useEffect(() => {
      this.reset();
    }, [params.id]);

    useEffect(() => {
      const callId = params.id || this.callId;
      const canRequestSummary = !!callId &&
        !isHistoryMode &&
        showSummary &&
        !!segmentId &&
        (callStatus === 'active' || this.evWorkingState.isPendingDisposition);
      if (!canRequestSummary) {
        return;
      }
      void this.requestConversationSummary(callId, callStatus);
    }, [params.id, callStatus, showSummary, segmentId, isHistoryMode]);

    const showCallEnded = callStatus === 'callEnd';
    const pageTitle = isHistoryMode
      ? (params.method === 'create' ? t('createCallLog') : t('updateCallLog'))
      : t('callLog');

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

        <CallInfoHeader
          subject={basicInfo?.subject}
          isInbound={isInbound}
          status={showCallEnded ? 'callEnd' : 'active'}
          isRinging={!showCallEnded}
          followInfos={basicInfo?.followInfos}
          callInfos={basicInfo?.callInfos}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {showSubmitStep ? (
            <div className="flex-1 p-4 overflow-auto">
              <DispositionForm
                dispositionPickList={dispositionPickList}
                dispositionData={dispositionData}
                validated={validated}
                required={required}
                hideCallNote={hideCallNote}
                showSummary={showSummary}
                summary={summary}
                isSummaryFinal={isSummaryFinal}
                isSummaryLoading={isSummaryLoading}
                disableDispositionSelect={isDisposed}
                onFieldChange={uiFunctions.onUpdateCallLog}
                onSummaryChange={uiFunctions.onUpdateSummary}
                selectPlaceholder={t('pleaseSelect')}
                dispositionErrorText={t('dispositionError')}
                notesErrorText={t('notesRequired')}
                dispositionLabel={t('disposition')}
                notesLabel={t('notes')}
                notesPlaceholder={t('enterNotes')}
                summaryLabel={isSummaryEdited ? t('summaryEdited') : t('summary')}
                summaryPlaceholder={t('summaryPlaceholder')}
                summaryLoadingText={t('summaryLoading')}
              />
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {showSubmitStep && (
          <div className="flex-shrink-0 p-4 border-t border-neutral-b4 shadow-[0_-2px_5px_0_rgba(0,0,0,0.15)]">
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
        <AppFooterNav />
      </div>
    );
  }
}

export { DispositionView };

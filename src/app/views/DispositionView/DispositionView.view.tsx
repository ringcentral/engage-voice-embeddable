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
import { Announcement, Button, CircularProgressIndicator, Icon } from '@ringcentral/spring-ui';
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
import type { ActivityLog } from '../../services/EvClient/interfaces';
import { EvCallHistory } from '../../services/EvCallHistory';
import { parseHistoryCallId } from '../../services/EvCallHistory/formatHistoryCall';
import { SideWidget } from '../../services/SideWidget';
import { dialoutStatuses } from '../../../enums';
import { formatPhoneNumber } from '../../../lib/FormatPhoneNumber/formatPhoneNumber';
import { getClockByTimestamp } from '../../../lib/getClockByTimestamp';
import { formatEvCallForConnected, formatEvCallFromHistory } from '../../../lib/formatEvCall';
import { getCallAni, getCallDnis } from '../../../lib/getEvCallNumbers';
import type {
  EvCallDispositionData,
} from '../../services/EvCallDisposition/EvCallDisposition.interface';

import { CallInfoHeader } from '../../components/CallInfoHeader';
import { DispositionForm } from '../../components/DispositionForm';
import { SideWidgetToggleButton } from '../../components/SideWidgetToggleButton';
import { getCallInfos } from '../../utils/getCallInfos';
import { shouldShowDispositionSubmitStep } from '../../utils/shouldShowDispositionSubmitStep';
import type {
  DispositionViewProps,
  DispositionViewUIProps,
  DispositionViewUIFunctions,
} from './DispositionView.interface';
import sideWidgetI18n from '../SideWidgetView/i18n';
import i18n, { t as translate } from './i18n';

/**
 * Stands in for a disposition id on a history row, whose recorded disposition
 * is displayed but not selectable.
 */
const RECORDED_DISPOSITION_ID = '__recorded__';

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
    private evCallHistory: EvCallHistory,
    private sideWidget: SideWidget,
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

  /**
   * Deliberately not persisted: this is the outcome of one submit, not
   * something the next call inherits. Storing it meant a session that ended on
   * `SAVED` - the agent navigates away, or the worker restarts, before the
   * delay below hands over to `reset` - came back with the submit button
   * already showing success for a disposition nobody had filled in.
   */
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

  /**
   * The RingCX activity behind a history row.
   *
   * History rows carry no live session, so for a call this browser never
   * handled the activity record is the only source of what was dispositioned.
   */
  @state
  historyActivity: ActivityLog | null = null;

  /**
   * The history row id (`segmentId$$uii`) whose activity is currently loaded.
   * Compared to the route id so the UI can show a spinner before the fetch
   * effect runs, instead of flashing "No active call".
   */
  @state
  historyActivityRowId = '';

  @state
  isHistoryActivityLoading = false;

  /**
   * Guards overlapping history-activity loads when the agent switches rows
   * before the previous request settles.
   */
  private _historyActivityRequestId = 0;

  /**
   * Edits to a server-only history row.
   *
   * Held separately from `EvCallDisposition`, which is keyed by the local call
   * id these rows do not have.
   */
  @state
  historyActivityDraft: { agentNotes: string; agentSummary: string } = {
    agentNotes: '',
    agentSummary: '',
  };

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
  private _setHistoryActivity(activity: ActivityLog | null) {
    this.historyActivity = activity;
    this.historyActivityDraft = {
      agentNotes: activity?.agentNotes || '',
      agentSummary: activity?.agentSummary || activity?.autoSummary || '',
    };
  }

  @action
  private _setHistoryActivityLoadState({
    rowId,
    isLoading,
  }: {
    rowId?: string;
    isLoading: boolean;
  }) {
    this.isHistoryActivityLoading = isLoading;
    if (rowId !== undefined) {
      this.historyActivityRowId = rowId;
    }
  }

  @action
  private _setHistoryActivityDraft(
    field: 'agentNotes' | 'agentSummary',
    value: string,
  ) {
    this.historyActivityDraft = { ...this.historyActivityDraft, [field]: value };
  }

  @delegate('server')
  async updateHistoryActivityDraft(
    field: 'agentNotes' | 'agentSummary',
    value: string,
  ): Promise<void> {
    this._setHistoryActivityDraft(field, value);
  }

  /**
   * Load the activity for a history row, keyed by its segment id.
   *
   * Requires `allowContactManagement` (same gate eag uses for CM / activities).
   * Runs for every history row, including ones with local data, so the form
   * always reflects what the server actually recorded. Always clears the
   * loading flag — including on 404 / permission miss / network errors — so
   * the call-log page does not spin forever.
   */
  @delegate('server')
  async loadHistoryActivity(rowId: string): Promise<void> {
    const requestId = ++this._historyActivityRequestId;
    this._setViewCallId(rowId);
    // Bind the row id immediately so pending UI keys off loading, not a stale
    // previous row, and so a failed request still settles this route.
    this._setHistoryActivityLoadState({ rowId, isLoading: true });
    try {
      if (!this.evAuth.agentPermissions?.allowContactManagement) {
        this._setHistoryActivity(null);
        return;
      }
      const { segmentId } = parseHistoryCallId(rowId);
      if (!segmentId) {
        this._setHistoryActivity(null);
        return;
      }
      const authorized = await this.evAuth.refreshEvToken();
      if (requestId !== this._historyActivityRequestId) {
        return;
      }
      if (!authorized) {
        this._setHistoryActivity(null);
        return;
      }
      const activity = await this.evClient.getActivityBySegmentId(segmentId);
      if (requestId !== this._historyActivityRequestId) {
        return;
      }
      this._setHistoryActivity(activity);
    } catch (error) {
      this.logger.warn('loadHistoryActivity failed', error);
      if (requestId === this._historyActivityRequestId) {
        this._setHistoryActivity(null);
      }
    } finally {
      if (requestId === this._historyActivityRequestId) {
        this._setHistoryActivityLoadState({ rowId, isLoading: false });
      }
    }
  }

  @action
  private _reset() {
    this.saveStatus = SaveStatus.SUBMIT;
    this.validated = { dispositionId: true, notes: true };
    this.required = { notes: false };
  }

  /**
   * Delegated because this state is written by `disposeCall` on the server, so
   * the client cannot clear it on its own: a client-side action is replaced by
   * the server's copy on the next full-state sync, which left the view opening
   * on whatever the previous disposition ended with.
   */
  @delegate('server')
  async reset() {
    this._reset();
  }

  get isHistoryMode(): boolean {
    return this.router.currentPath?.startsWith('/history/') ?? false;
  }

  /**
   * History routes carry the server row id (`<segmentId>$$<uii>`), which is a
   * different id space from the local `<uii>$<sessionId>` keys that
   * `EvCallDisposition`, `EvPresence` and the `rc-ev-logCall` adapter contract
   * all use. Resolve it back to the local id so none of them need to change;
   * it is empty for a call this browser never handled.
   */
  get callId(): string {
    if (this.isHistoryMode && this.viewCallId) {
      const { segmentId } = parseHistoryCallId(this.viewCallId);
      return this.evPresence.getCallIdBySegmentId(segmentId) || '';
    }
    return this.viewCallId || this.evCall.activityCallId;
  }

  /** A history row that only exists server-side, with no local call data. */
  get isServerOnlyHistoryCall(): boolean {
    return this.isHistoryMode && !this.callId;
  }

  /**
   * Server history row for the open call-log route.
   *
   * Used when the activities API is unavailable or returns nothing, so the
   * form can still show the disposition recorded on the history page.
   */
  get historyCall() {
    if (!this.isHistoryMode || !this.viewCallId) {
      return undefined;
    }
    return this.evCallHistory.getCallById(this.viewCallId);
  }

  /**
   * Disposition label for a server-only history call-log form.
   *
   * Prefers the activity record when present; otherwise the history row's
   * disposition field.
   */
  get historyDispositionName(): string {
    return (
      this.historyActivity?.dispositionName ||
      this.historyCall?.disposition ||
      ''
    );
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
    const ani = getCallAni(call);
    const dnis = getCallDnis(call);
    const fromNumber = isInbound ? ani : dnis;
    const toNumber = isInbound ? dnis : ani;
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

  // `summary` arrives from the agent library as a coerced flag: a real boolean
  // when the wire value is TRUE/FALSE, and '' when the field is absent.
  private isSummaryEnabled(
    call?: { session?: { summary?: boolean | string } } | null,
  ): boolean {
    if (!call) {
      return false;
    }
    return !!call.session?.summary;
  }

  getContactName(call: any): string {
    if (!call) return '';
    const ani = getCallAni(call);
    const contactMatches = call.contactMatches || [];
    if (contactMatches.length > 0) {
      return contactMatches[0].name || ani;
    }
    return ani;
  }

  @delegate('server')
  async goBack() {
    if (this.isHistoryMode) {
      this._setViewCallId('');
      this.router.goBack();
      this._reset();
      return;
    }
    const isEnded = this.callStatus === 'callEnd' || !this.hasCurrentCall;
    if (isEnded) {
      this.evCall.setDialoutStatus(dialoutStatuses.idle);
      this._setViewCallId('');
      this.router.replace(this.dialerPath);
      this._reset();
      this.evCall.setActivityCallId('');
    } else {
      this.router.goBack();
      this._reset();
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

  /**
   * Save a history row that only exists server-side.
   *
   * Updates the RingCX activity when one was loaded; always emits
   * `rc-ev-logCall` with the same `{ call, task, sessionId }` shape local
   * dispositions use so CRM logging still works when activities are
   * unavailable. Top-level `sessionId` is the history `segmentId`.
   */
  private async doUpdateHistoryActivity() {
    const activityId = this.historyActivity?.id;
    if (
      activityId &&
      this.evAuth.agentPermissions?.allowContactManagement
    ) {
      const authorized = await this.evAuth.refreshEvToken();
      if (authorized) {
        await this.evClient.updateActivity(activityId, {
          // The disposition itself is not editable here: the pick list only
          // exists on the live call payload, which a server-only row has no
          // access to.
          dispositionName: this.historyDispositionName,
          agentSummary: this.historyActivityDraft.agentSummary,
          agentNotes: this.historyActivityDraft.agentNotes,
        });
      }
    } else if (!activityId) {
      this.logger.info(
        'no activity to update; saving call log via third party only',
      );
    }
    await this.logServerOnlyHistoryCall();
  }

  /**
   * Emit `rc-ev-logCall` for a history row this browser never handled.
   */
  private async logServerOnlyHistoryCall(): Promise<void> {
    const historyCall = this.historyCall;
    const call = historyCall
      ? formatEvCallFromHistory(historyCall, this.evAuth.agentId)
      : null;
    if (!call || !historyCall?.uii || !historyCall.segmentId) {
      return;
    }
    try {
      await this.thirdParty.logCall({
        call,
        task: {
          dispositionId: this.historyDispositionName || null,
          notes: this.historyActivityDraft.agentNotes,
          summary: this.historyActivityDraft.agentSummary,
        },
        // Prefer the local call id when present so CRM match keys align with
        // active-call logging; fall back to segmentId for server-only rows.
        sessionId: historyCall.localCallId || historyCall.segmentId,
      });
    } catch (e) {
      this.logger.error('thirdParty logCall error~~', e);
    }
  }

  private async doDisposeCall() {
    if (this.isServerOnlyHistoryCall) {
      await this.doUpdateHistoryActivity();
      return;
    }
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
      if (authorized) {
        await this.evClient.updateActivityDisposition({
          dialogId,
          params: {
            dispositionName: dispositionItem?.label || '',
            agentSummary: this.summary,
            agentNotes: disposition?.notes || '',
          },
        });
      }
    }
    if (call?.scriptId) {
      await this.evAgentScript.saveScriptResult(call);
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
      if (!this.isHistoryMode) {
        void this.evCallHistory.refresh();
      }
      this.setSaveStatus(SaveStatus.SAVED);
      this.toast.success({ message: translate('callDispositionSuccess') });
      await this.evWorkingState.setIsPendingDisposition(false);
      setTimeout(() => {
        if (shouldGoToDialerAfterSubmit) {
          this.evCall.setDialoutStatus(dialoutStatuses.idle);
          this._setViewCallId('');
          this.router.replace(this.dialerPath);
          this._reset();
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
      isServerOnlyHistoryCall: this.isServerOnlyHistoryCall,
      isHistoryActivityLoading: this.isHistoryActivityLoading,
      historyActivityRowId: this.historyActivityRowId,
      historyActivity: this.historyActivity,
      historyActivityDraft: this.historyActivityDraft,
      historyDispositionName: this.historyDispositionName,
      hasHistoryCall: !!this.historyCall,
      showSubmitStep: this.showSubmitStep,
      hideCallNote: this.dispositionViewOptions?.hideCallNote ?? false,
      showSummary: this.showSummary,
      segmentId,
      summary: this.summary,
      isSummaryFinal: summaryState?.isFinal || false,
      isSummaryLoading: summaryState?.isLoading || false,
      isSummaryEdited: summaryState?.isEditedAfterFinal || false,
      sideWidgets: this.sideWidget.widgets,
      sideWidgetVisible: this.sideWidget.visible,
    };
  }

  getUIFunctions(): UIFunctions<DispositionViewUIFunctions> {
    return {
      setViewCallId: (id: string) => this.setViewCallId(id),
      loadHistoryActivity: (id: string) => this.loadHistoryActivity(id),
      onUpdateHistoryActivityDraft: (
        field: 'agentNotes' | 'agentSummary',
        value: string,
      ) => this.updateHistoryActivityDraft(field, value),
      onBack: () => this.goBack(),
      onUpdateCallLog: (field, value) => this.onUpdateCallLog(field, value),
      onUpdateSummary: (value) => this.onUpdateSummary(value),
      disposeCall: () => this.disposeCall(),
      onToggleSideWidget: () => this.sideWidget.toggleVisible(),
    };
  }

  component(_props?: DispositionViewProps) {
    const params = useParams<{ id?: string; method?: string }>();
    // Merged so the toggle tooltip can name the widgets without a second copy
    // of their labels living here.
    const { t } = useLocale(i18n, sideWidgetI18n);
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
      sideWidgets,
      sideWidgetVisible,
      isServerOnlyHistoryCall,
      isHistoryActivityLoading,
      historyActivityRowId,
      historyActivity,
      historyActivityDraft,
      historyDispositionName,
      hasHistoryCall,
    } = uiProps;

    // The agent script stays available until the disposition is saved, so this
    // route needs its own way back to a widget hidden on the call screen.
    const sideWidgetToggle = sideWidgets.length ? (
      <SideWidgetToggleButton
        visible={sideWidgetVisible}
        onToggle={() => void uiFunctions.onToggleSideWidget()}
        label={t(sideWidgetVisible ? 'hideSideWidget' : 'showSideWidget', {
          widgets: sideWidgets
            .map((widget) => t(widget.nameKey as 'agentScript'))
            .join(', '),
        })}
      />
    ) : undefined;

    useEffect(() => {
      if (params.id) {
        uiFunctions.setViewCallId(params.id);
      }
    }, [params.id]);

    useEffect(() => {
      void this.reset();
    }, [params.id]);

    // A history row's recorded disposition lives on its activity record, which
    // is the only source for a call this browser never handled.
    useEffect(() => {
      if (isHistoryMode && params.id) {
        void uiFunctions.loadHistoryActivity(params.id);
      }
    }, [params.id, isHistoryMode]);

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
    const isHistoryActivityPending =
      isHistoryMode &&
      !!params.id &&
      (historyActivityRowId !== params.id || isHistoryActivityLoading);

    // A history row this browser never handled: there is no local call to
    // disposition, but the RingCX activity still holds what was recorded.
    if (!currentCall && (isServerOnlyHistoryCall || isHistoryActivityPending)) {
      return (
        <div className="flex flex-col h-full bg-neutral-base overflow-hidden">
          <AppHeaderNav override resetImmediately>
            <PageHeader
              onBackClick={uiFunctions.onBack}
              endAdornment={sideWidgetToggle}
            >
              {pageTitle}
            </PageHeader>
          </AppHeaderNav>
          {isHistoryActivityPending ? (
            <div
              className="flex-1 flex items-center justify-center"
              data-sign="historyActivityLoading"
            >
              <CircularProgressIndicator size="medium" />
            </div>
          ) : hasHistoryCall || historyActivity ? (
            <>
              <div className="flex-1 p-4 overflow-auto">
                <DispositionForm
                  // A single synthetic option renders the recorded disposition
                  // in the usual place. The real pick list only exists on a
                  // live call payload, so it stays disabled here. Falls back
                  // to the history row when activities are unavailable.
                  dispositionPickList={
                    historyDispositionName
                      ? [
                          {
                            dispositionId: RECORDED_DISPOSITION_ID,
                            disposition: historyDispositionName,
                          },
                        ]
                      : []
                  }
                  dispositionData={{
                    dispositionId: historyDispositionName
                      ? RECORDED_DISPOSITION_ID
                      : undefined,
                    notes: historyActivityDraft.agentNotes,
                  }}
                  validated={{ dispositionId: true, notes: true }}
                  required={{ notes: false }}
                  hideCallNote={hideCallNote}
                  showSummary
                  summary={historyActivityDraft.agentSummary}
                  isSummaryFinal
                  isSummaryLoading={false}
                  disableDispositionSelect
                  onFieldChange={(field, value) => {
                    if (field === 'notes') {
                      uiFunctions.onUpdateHistoryActivityDraft(
                        'agentNotes',
                        value,
                      );
                    }
                  }}
                  onSummaryChange={(value) =>
                    uiFunctions.onUpdateHistoryActivityDraft(
                      'agentSummary',
                      value,
                    )
                  }
                  selectPlaceholder={t('pleaseSelect')}
                  dispositionErrorText={t('dispositionError')}
                  notesErrorText={t('notesRequired')}
                  dispositionLabel={t('disposition')}
                  notesLabel={t('notes')}
                  notesPlaceholder={t('enterNotes')}
                  summaryLabel={t('summary')}
                  summaryPlaceholder={t('summaryPlaceholder')}
                  summaryLoadingText={t('summaryLoading')}
                />
              </div>
              <div className="flex-shrink-0 p-4 border-t border-neutral-b4 shadow-[0_-2px_5px_0_rgba(0,0,0,0.15)]">
                <Button
                  data-sign="submitButton"
                  fullWidth
                  disabled={saveStatus === SaveStatus.SAVING}
                  onClick={() => void uiFunctions.disposeCall()}
                >
                  {saveStatus === SaveStatus.SAVED ? (
                    <Icon symbol={CheckMd} size="medium" />
                  ) : (
                    t('save')
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-b2">
              <p className="typography-mainText">{t('callLogNotFound')}</p>
            </div>
          )}
          <AppFooterNav />
        </div>
      );
    }

    if (!currentCall) {
      return (
        <div className="flex flex-col h-full bg-neutral-base">
          <AppHeaderNav override resetImmediately>
            <PageHeader
              onBackClick={uiFunctions.onBack}
              endAdornment={sideWidgetToggle}
            >
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
          <PageHeader
            onBackClick={uiFunctions.onBack}
            endAdornment={sideWidgetToggle}
          >
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

import {
  action,
  injectable,
  optional,
  PortManager,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';

import { EvCallbackTypes } from '../EvClient/enums';
import { EvClient } from '../EvClient';
import type {
  EvDispositionSummaryErrorResponse,
  EvDispositionSummaryPhaseResponse,
} from '../EvClient/interfaces';
import { EvPresence } from '../EvPresence';
import { EvSubscription } from '../EvSubscription';
import type {
  EvCallSummaryState,
  EvCallSummaryStateMapping,
  EvCallDispositionOptions,
  EvCallDispositionData,
  EvCallDispositionMapping,
  EvDispositionState,
  EvDispositionStateMapping,
} from './EvCallDisposition.interface';

/**
 * next-core's @action decorator throws in development after 100 calls in 5s.
 * Streaming summary phases easily exceed that, so they are coalesced here.
 */
const SUMMARY_FLUSH_INTERVAL_MS = 100;

interface PendingSummaryPhase {
  readonly callId: string;
  readonly phase: EvDispositionSummaryPhaseResponse;
}

/**
 * EvCallDisposition module - Call disposition management
 * Handles call disposition selection and submission
 */
@injectable({
  name: 'EvCallDisposition',
})
class EvCallDisposition extends RcModule {
  private pendingSummaryPhases: PendingSummaryPhase[] = [];
  private summaryFlushTimer: ReturnType<typeof setTimeout> | null = null;
  private lastSummaryFlushAt: number = 0;

  constructor(
    private evClient: EvClient,
    private evPresence: EvPresence,
    private evSubscription: EvSubscription,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvCallDispositionOptions')
    private evCallDispositionOptions?: EvCallDispositionOptions,
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
  callsMapping: EvCallDispositionMapping = {};

  @storage
  @state
  dispositionStateMapping: EvDispositionStateMapping = {};

  @state
  callSummaryMapping: EvCallSummaryStateMapping = {};

  @action
  setDisposition(id: string, data: EvCallDispositionData) {
    this.callsMapping[id] = data;
  }

  @action
  removeDisposition(id: string) {
    delete this.callsMapping[id];
    delete this.callSummaryMapping[id];
  }

  @action
  setDispositionState(id: string, state: EvDispositionState) {
    this.dispositionStateMapping[id] = state;
  }

  @action
  startSummaryRequest(callId: string, segmentId: string) {
    this.callSummaryMapping[callId] = {
      segmentId,
      orderedPhases: {},
      summary: '',
      isFinal: false,
      isLoading: true,
      isEditedAfterFinal: false,
    };
    const currentDisposition = this.callsMapping[callId];
    if (!currentDisposition) {
      this.callsMapping[callId] = {
        dispositionId: null,
        notes: '',
        summary: '',
      };
      return;
    }
    this.callsMapping[callId].summary = '';
  }

  @action
  setSummaryRequestError(callId: string, segmentId?: string) {
    const currentSummaryState = this.callSummaryMapping[callId];
    if (!currentSummaryState) {
      return;
    }
    if (segmentId && currentSummaryState.segmentId !== segmentId) {
      return;
    }
    currentSummaryState.isLoading = false;
  }

  /**
   * Queue a streaming summary phase. Not an @action: each websocket chunk would
   * otherwise trip next-core's development call-frequency guard.
   */
  upsertSummaryPhase(callId: string, phase: EvDispositionSummaryPhaseResponse): void {
    this.pendingSummaryPhases.push({ callId, phase });
    if (phase.final) {
      this.flushPendingSummaryPhases();
      return;
    }
    this.scheduleSummaryFlush();
  }

  /**
   * Apply an agent-edited call summary and mark it as edited after the
   * streamed summary has finished.
   */
  @action
  setSummary(callId: string, summary: string): void {
    const previousSummary = this.callsMapping[callId]?.summary ?? '';
    this.writeDispositionSummary(callId, summary);
    const currentSummaryState = this.callSummaryMapping[callId];
    if (!currentSummaryState || !currentSummaryState.isFinal) {
      return;
    }
    if (previousSummary === summary) {
      return;
    }
    currentSummaryState.isEditedAfterFinal = true;
  }

  getSummaryState(callId: string): EvCallSummaryState | undefined {
    return this.callSummaryMapping[callId];
  }

  override onInitOnce() {
    // Set default disposition when call is answered
    // This would typically be connected to EvCallMonitor events
  }

  override async onReset() {
    this.clearSummaryFlushTimer();
    this.pendingSummaryPhases = [];
    this.lastSummaryFlushAt = 0;
  }

  private initialize() {
    this.evSubscription.subscribe(
      EvCallbackTypes.SUMMARY,
      (phase?: EvDispositionSummaryPhaseResponse) => {
        if (!phase || phase.status !== 'OK' || phase.type !== 'SUMMARY') {
          return;
        }
        const callId = this.getCallIdBySegmentId(String(phase.segmentId));
        if (!callId) {
          return;
        }
        this.upsertSummaryPhase(callId, phase);
      },
    );
    this.evSubscription.subscribe(
      EvCallbackTypes.SUMMARY_ERROR,
      (error?: EvDispositionSummaryErrorResponse) => {
        if (error?.segmentId) {
          const callId = this.getCallIdBySegmentId(error.segmentId);
          if (callId) {
            this.setSummaryRequestError(callId, error.segmentId);
          }
          return;
        }
        const callIds = Object.keys(this.callSummaryMapping);
        callIds.forEach((callId) => this.setSummaryRequestError(callId));
      },
    );
  }

  /**
   * Dispose a call with the selected disposition
   * Includes safety check to ensure callDisposition exists
   */
  async disposeCall(id: string) {
    const call = this.evPresence.callsMapping[id];
    const callDisposition = this.callsMapping[id];
    // Safety check - return early if no disposition data
    if (!callDisposition) {
      return;
    }
    const isDisposed =
      this.dispositionStateMapping[id] &&
      this.dispositionStateMapping[id].disposed;
    if (!call?.outdialDispositions || isDisposed) {
      return;
    }
    await this.evClient.dispositionCall({
      uii: call.uii,
      dispId: callDisposition.dispositionId || '',
      notes: callDisposition.notes,
    });
    this.setDispositionState(id, { disposed: true });
  }

  /**
   * Initialize disposition for a call with default value
   */
  initDisposition(callId: string, outdialDispositions: any) {
    if (outdialDispositions) {
      const disposition = outdialDispositions.dispositions?.find(
        (d: any) => d.isDefault,
      );
      this.setDisposition(callId, {
        dispositionId: disposition ? disposition.dispositionId : null,
        notes: '',
        summary: '',
      });
    }
  }

  /**
   * Get disposition for a specific call
   */
  getDisposition(id: string): EvCallDispositionData | undefined {
    return this.callsMapping[id];
  }

  /**
   * Check if a call has been disposed
   */
  isDisposed(id: string): boolean {
    return this.dispositionStateMapping[id]?.disposed || false;
  }

  private scheduleSummaryFlush(): void {
    if (this.summaryFlushTimer !== null) {
      return;
    }
    const elapsed: number = Date.now() - this.lastSummaryFlushAt;
    if (this.lastSummaryFlushAt === 0 || elapsed >= SUMMARY_FLUSH_INTERVAL_MS) {
      this.flushQueuedSummaryPhases();
      return;
    }
    this.summaryFlushTimer = setTimeout(() => {
      this.summaryFlushTimer = null;
      this.flushQueuedSummaryPhases();
    }, SUMMARY_FLUSH_INTERVAL_MS - elapsed);
  }

  private flushPendingSummaryPhases(): void {
    this.clearSummaryFlushTimer();
    this.flushQueuedSummaryPhases();
  }

  private flushQueuedSummaryPhases(): void {
    if (this.pendingSummaryPhases.length === 0) {
      return;
    }
    this.applyQueuedSummaryPhases();
    this.lastSummaryFlushAt = Date.now();
  }

  private applyQueuedSummaryPhases(): void {
    if (this.pendingSummaryPhases.length === 0) {
      return;
    }
    const pendingPhases: PendingSummaryPhase[] = this.pendingSummaryPhases.splice(0);
    this.applySummaryPhases(pendingPhases);
  }

  private clearSummaryFlushTimer(): void {
    if (this.summaryFlushTimer === null) {
      return;
    }
    clearTimeout(this.summaryFlushTimer);
    this.summaryFlushTimer = null;
  }

  @action
  private applySummaryPhases(phases: PendingSummaryPhase[]): void {
    phases.forEach(({ callId, phase }) => {
      this.applySummaryPhase(callId, phase);
    });
  }

  private applySummaryPhase(callId: string, phase: EvDispositionSummaryPhaseResponse): void {
    const currentSummaryState = this.callSummaryMapping[callId];
    const sequence = Number(phase.sequenceNo);
    if (Number.isNaN(sequence)) {
      this.logger.warn('Invalid summary sequence number', phase.sequenceNo);
      return;
    }
    if (!currentSummaryState || String(currentSummaryState.segmentId) !== String(phase.segmentId)) {
      return;
    }
    currentSummaryState.orderedPhases[sequence] = phase.summary ?? '';
    const aggregatedSummary = this.buildSummaryBySequence(currentSummaryState.orderedPhases);
    currentSummaryState.summary = aggregatedSummary;
    const isFinal = currentSummaryState.isFinal || phase.final;
    currentSummaryState.isFinal = isFinal;
    currentSummaryState.isLoading = !isFinal;
    if (!currentSummaryState.isEditedAfterFinal) {
      this.writeDispositionSummary(callId, aggregatedSummary);
    }
  }

  private writeDispositionSummary(callId: string, summary: string): void {
    const currentDisposition = this.callsMapping[callId];
    if (!currentDisposition) {
      this.callsMapping[callId] = {
        dispositionId: null,
        notes: '',
        summary,
      };
      return;
    }
    currentDisposition.summary = summary;
  }

  private buildSummaryBySequence(orderedPhases: Record<number, string>): string {
    return Object.keys(orderedPhases)
      .map((key) => Number(key))
      .sort((left, right) => left - right)
      .map((sequence) => orderedPhases[sequence])
      .join('');
  }

  private getCallIdBySegmentId(segmentId: string): string {
    const callIds = Object.keys(this.callSummaryMapping);
    const segmentIdValue = String(segmentId);
    return callIds.find((callId) => {
      const currentSegmentId = this.callSummaryMapping[callId]?.segmentId;
      return String(currentSegmentId) === segmentIdValue;
    }) || '';
  }
}

export { EvCallDisposition };

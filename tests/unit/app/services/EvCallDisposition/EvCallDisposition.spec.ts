jest.mock('@ringcentral-integration/next-core', () => ({
  injectable: () => (target: any) => target,
  optional: () => () => undefined,
  action: (
    _target: any,
    _key: string,
    descriptor: PropertyDescriptor,
  ) => descriptor,
  state: () => undefined,
  storage: () => undefined,
  RcModule: class {
    protected logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  },
  PortManager: class {},
  StoragePlugin: class {},
}));

import { EvCallDisposition } from 'src/app/services/EvCallDisposition';
import { EvCallbackTypes } from 'src/app/services/EvClient/enums';
import type { EvDispositionSummaryPhaseResponse } from 'src/app/services/EvClient/interfaces';

type Listener = (payload?: any) => void;

const SUMMARY_FLUSH_INTERVAL_MS = 100;
const CALL_ID = 'call-1';
const SEGMENT_ID = '42';

function createPhase({
  summary,
  sequenceNo,
  final = false,
  segmentId = Number(SEGMENT_ID),
}: {
  summary: string;
  sequenceNo: string;
  final?: boolean;
  segmentId?: number;
}): EvDispositionSummaryPhaseResponse {
  return {
    final,
    type: 'SUMMARY',
    status: 'OK',
    summary,
    segmentId,
    sequenceNo,
  };
}

function createDeps() {
  const listeners: Record<string, Listener> = {};
  const evClient = {
    dispositionCall: jest.fn(),
  };
  const evPresence = {
    callsMapping: {} as Record<string, unknown>,
  };
  const evSubscription = {
    subscribe: jest.fn((event: string, listener: Listener) => {
      listeners[event] = listener;
      return evSubscription;
    }),
  };
  const storagePlugin = {
    enable: jest.fn(),
  };
  const portManager = { shared: false };
  return {
    listeners,
    evClient,
    evPresence,
    evSubscription,
    storagePlugin,
    portManager,
  };
}

function createDisposition(deps: ReturnType<typeof createDeps>) {
  return new EvCallDisposition(
    deps.evClient as any,
    deps.evPresence as any,
    deps.evSubscription as any,
    deps.storagePlugin as any,
    deps.portManager as any,
  );
}

describe('EvCallDisposition summary streaming', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('applies the first streaming phase immediately', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    deps.listeners[EvCallbackTypes.SUMMARY](
      createPhase({ summary: 'Hello', sequenceNo: '0' }),
    );
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe('Hello');
    expect(disposition.getDisposition(CALL_ID)?.summary).toBe('Hello');
  });

  it('coalesces later phases into one action instead of one per websocket chunk', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    const applySpy = jest.spyOn(disposition as any, 'applySummaryPhases');
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    const listener = deps.listeners[EvCallbackTypes.SUMMARY];
    listener(createPhase({ summary: 'A', sequenceNo: '0' }));
    for (let i = 1; i <= 150; i += 1) {
      listener(createPhase({ summary: String(i), sequenceNo: String(i) }));
    }
    expect(applySpy).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(SUMMARY_FLUSH_INTERVAL_MS);
    expect(applySpy).toHaveBeenCalledTimes(2);
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe(
      `A${Array.from({ length: 150 }, (_, i) => String(i + 1)).join('')}`,
    );
  });

  it('keeps applySummaryPhases well under the @action frequency limit during a long stream', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    const applySpy = jest.spyOn(disposition as any, 'applySummaryPhases');
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    const listener = deps.listeners[EvCallbackTypes.SUMMARY];
    const streamDurationMs = 8000;
    const phaseIntervalMs = 10;
    let sequence = 0;
    for (let elapsed = 0; elapsed <= streamDurationMs; elapsed += phaseIntervalMs) {
      listener(createPhase({ summary: 'x', sequenceNo: String(sequence) }));
      sequence += 1;
      jest.advanceTimersByTime(phaseIntervalMs);
    }
    jest.advanceTimersByTime(SUMMARY_FLUSH_INTERVAL_MS);
    expect(applySpy.mock.calls.length).toBeLessThan(100);
    expect(applySpy.mock.calls.length).toBeGreaterThan(1);
  });

  it('does not call setSummary for streamed phases', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    const setSummarySpy = jest.spyOn(disposition, 'setSummary');
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    deps.listeners[EvCallbackTypes.SUMMARY](
      createPhase({ summary: 'Hello', sequenceNo: '0' }),
    );
    expect(setSummarySpy).not.toHaveBeenCalled();
  });

  it('flushes immediately when the final phase arrives', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    const listener = deps.listeners[EvCallbackTypes.SUMMARY];
    listener(createPhase({ summary: 'Hello', sequenceNo: '0' }));
    listener(createPhase({ summary: ' world', sequenceNo: '1' }));
    listener(createPhase({ summary: '!', sequenceNo: '2', final: true }));
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe('Hello world!');
    expect(disposition.getSummaryState(CALL_ID)?.isFinal).toBe(true);
    expect(disposition.getSummaryState(CALL_ID)?.isLoading).toBe(false);
  });

  it('aggregates out-of-order phases by sequence number', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    const listener = deps.listeners[EvCallbackTypes.SUMMARY];
    listener(createPhase({ summary: 'world', sequenceNo: '1' }));
    listener(createPhase({ summary: 'Hello ', sequenceNo: '0' }));
    jest.advanceTimersByTime(SUMMARY_FLUSH_INTERVAL_MS);
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe('Hello world');
  });

  it('ignores phases for a different segment', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    deps.listeners[EvCallbackTypes.SUMMARY](
      createPhase({ summary: 'Nope', sequenceNo: '0', segmentId: 99 }),
    );
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe('');
  });

  it('keeps an agent edit after the final summary arrives', () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    deps.listeners[EvCallbackTypes.SUMMARY](
      createPhase({ summary: 'auto', sequenceNo: '0', final: true }),
    );
    disposition.setSummary(CALL_ID, 'agent edit');
    disposition.upsertSummaryPhase(
      CALL_ID,
      createPhase({ summary: 'late', sequenceNo: '1' }),
    );
    jest.advanceTimersByTime(SUMMARY_FLUSH_INTERVAL_MS);
    expect(disposition.getDisposition(CALL_ID)?.summary).toBe('agent edit');
    expect(disposition.getSummaryState(CALL_ID)?.isEditedAfterFinal).toBe(true);
  });

  it('drops queued phases on reset', async () => {
    const deps = createDeps();
    const disposition = createDisposition(deps);
    disposition.startSummaryRequest(CALL_ID, SEGMENT_ID);
    const listener = deps.listeners[EvCallbackTypes.SUMMARY];
    listener(createPhase({ summary: 'Hello', sequenceNo: '0' }));
    listener(createPhase({ summary: ' world', sequenceNo: '1' }));
    await disposition.onReset();
    jest.advanceTimersByTime(SUMMARY_FLUSH_INTERVAL_MS);
    expect(disposition.getSummaryState(CALL_ID)?.summary).toBe('Hello');
  });
});

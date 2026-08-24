import React, { useEffect, useState } from 'react';

import type { EvAgentAssistantFrameParams } from '../../services/EvAgentAssistant';
import type { AgentAssistantPanelProps } from './AgentAssistantPanel.interface';
import { AgentAssistantFrame } from './AgentAssistantFrame';

type FrameState =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { status: 'ready'; params: EvAgentAssistantFrameParams };

export function AgentAssistantPanel({
  callId,
  getParams,
  showTitle = true,
}: AgentAssistantPanelProps) {
  // The auth code in the params is single use, so they are resolved once per
  // mount and the frame is remounted (by call id) rather than re-configured.
  const [frameState, setFrameState] = useState<FrameState>({
    status: 'loading',
  });

  useEffect(() => {
    let cancelled = false;
    setFrameState({ status: 'loading' });
    getParams(callId)
      .then((params) => {
        if (cancelled) return;
        setFrameState(
          params ? { status: 'ready', params } : { status: 'unavailable' },
        );
      })
      .catch(() => {
        if (cancelled) return;
        setFrameState({ status: 'unavailable' });
      });
    return () => {
      cancelled = true;
    };
  }, [callId, getParams]);

  return (
    <section
      aria-label="AI Assistant"
      data-sign="agentAssistantPanel"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-neutral-base"
    >
      {showTitle && (
        <div className="flex h-12 flex-shrink-0 items-center border-b border-neutral-b4 px-4">
          <h2 className="typography-title text-neutral-b0">AI Assistant</h2>
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {frameState.status === 'loading' ? (
          <div
            className="flex h-full items-center justify-center text-neutral-b2"
            data-sign="agentAssistantLoading"
          >
            <span className="typography-mainText">Loading AI Assistant…</span>
          </div>
        ) : frameState.status === 'ready' ? (
          <AgentAssistantFrame params={frameState.params} />
        ) : (
          <div
            className="flex h-full items-center justify-center p-6 text-center text-neutral-b2"
            data-sign="agentAssistantUnavailable"
          >
            <span className="typography-mainText">
              AI Assistant is not available for this call
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';

import type {
  AgentScriptHostMessage,
  AgentScriptRendererMessage,
} from '../../services/EvAgentScript';
import type { AgentScriptPanelProps } from './AgentScriptPanel.interface';

const connectMessageType = 'ev-agent-script-connect';
const resultDebounceTime = 250;

type AgentScriptFrameProps = Pick<
  AgentScriptPanelProps,
  | 'callId'
  | 'call'
  | 'script'
  | 'onResultChange'
  | 'onDisposition'
  | 'getKnowledgeBaseArticles'
>;

export function AgentScriptFrame({
  callId,
  call,
  script,
  onResultChange,
  onDisposition,
  getKnowledgeBaseArticles,
}: AgentScriptFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const portRef = useRef<MessagePort | null>(null);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResultRef = useRef<
    Extract<AgentScriptRendererMessage, { type: 'scriptResult' }> | undefined
  >(undefined);
  const [rendererReady, setRendererReady] = useState(false);

  const send = (message: AgentScriptHostMessage) => {
    portRef.current?.postMessage(message);
  };

  useEffect(() => {
    if (!rendererReady || !script) return;
    send({
      type: 'initialize',
      payload: { callId, call, config: script },
    });
  }, [rendererReady, callId, call, script]);

  useEffect(
    () => () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
      const pendingResult = pendingResultRef.current;
      if (pendingResult?.callId === callId) {
        void onResultChange(callId, pendingResult.value);
      }
      portRef.current?.close();
      portRef.current = null;
    },
    [callId, onResultChange],
  );

  const handleRendererMessage = async (
    event: MessageEvent<AgentScriptRendererMessage>,
  ) => {
    const message = event.data;
    if (message.type === 'ready') {
      setRendererReady(true);
      return;
    }
    if ('callId' in message && message.callId !== callId) return;

    switch (message.type) {
      case 'scriptResult':
        pendingResultRef.current = message;
        if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
        resultTimerRef.current = setTimeout(() => {
          pendingResultRef.current = undefined;
          void onResultChange(callId, message.value);
        }, resultDebounceTime);
        break;
      case 'updateDisposition':
        await onDisposition(callId, message.value);
        break;
      case 'getKnowledgeBaseArticles':
        try {
          const value = await getKnowledgeBaseArticles(
            callId,
            message.groupIds,
          );
          send({
            type: 'knowledgeBaseResult',
            requestId: message.requestId,
            value,
          });
        } catch (error) {
          send({
            type: 'knowledgeBaseResult',
            requestId: message.requestId,
            value: null,
            error:
              error instanceof Error
                ? error.message
                : 'Unable to load knowledge-base articles',
          });
        }
        break;
      default:
        break;
    }
  };

  const handleLoad = () => {
    portRef.current?.close();
    setRendererReady(false);
    const channel = new MessageChannel();
    portRef.current = channel.port1;
    channel.port1.onmessage = handleRendererMessage;
    channel.port1.start();
    frameRef.current?.contentWindow?.postMessage(
      { type: connectMessageType },
      window.location.origin,
      [channel.port2],
    );
  };

  return (
    <iframe
      ref={frameRef}
      src="./agentScript.html"
      title="Agent Script"
      data-sign="agentScriptFrame"
      className="block h-full min-h-0 w-full min-w-0 flex-1 border-0 bg-neutral-base"
      onLoad={handleLoad}
    />
  );
}

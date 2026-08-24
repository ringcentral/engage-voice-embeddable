import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import type { AgentAssistantFrameProps } from './AgentAssistantPanel.interface';

/** Message contract of the Agent Assistant app; the strings are its API. */
const assistantMessageOrigin = 'Agent Assistant';
const hostMessageOrigin = 'RCX Host';
const readyMessageType = 'SUBSCRIBE_SUGGESTION_READY';
const ackMessageType = 'SUBSCRIBE_SUGGESTION_ACK';
const initMessageType = 'INIT_SUBSCRIBE_SUGGESTION';

/**
 * Hosts the Agent Assistant app and runs its subscription handshake: the app
 * announces itself with `SUBSCRIBE_SUGGESTION_READY` and only starts listening
 * to the call once we answer with `INIT_SUBSCRIBE_SUGGESTION`, which also hands
 * it the knowledge base contexts. Everything else it needs is in the page query.
 */
export function AgentAssistantFrame({ params }: AgentAssistantFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const acknowledgedRef = useRef(false);

  const src = useMemo(
    () => `${params.pageUrl}?${new URLSearchParams(params.query).toString()}`,
    [params],
  );
  // The page is same origin today but may be served from a CDN later.
  const targetOrigin = useMemo(
    () => new URL(src, window.location.href).origin,
    [src],
  );

  const sendInit = useCallback(() => {
    if (acknowledgedRef.current) return;
    frameRef.current?.contentWindow?.postMessage(
      {
        actionType: initMessageType,
        origin: hostMessageOrigin,
        dialogId: params.dialogId,
        kbContextIds: params.kbContextIds,
      },
      targetOrigin,
    );
  }, [params.dialogId, params.kbContextIds, targetOrigin]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow) return;
      const message = event.data;
      if (!message || message.origin !== assistantMessageOrigin) return;
      if (message.dialogId && message.dialogId !== params.dialogId) return;

      if (message.actionType === readyMessageType) {
        sendInit();
      } else if (message.actionType === ackMessageType) {
        acknowledgedRef.current = true;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [params.dialogId, sendInit]);

  return (
    <iframe
      ref={frameRef}
      src={src}
      title="AI Assistant"
      data-sign="agentAssistantFrame"
      className="block h-full min-h-0 w-full min-w-0 flex-1 border-0 bg-neutral-base"
      // Covers the case where the app is ready before we start listening; a
      // duplicated init is ignored once it has subscribed.
      onLoad={sendInit}
    />
  );
}

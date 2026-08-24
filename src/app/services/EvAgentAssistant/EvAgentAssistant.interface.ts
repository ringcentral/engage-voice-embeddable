export interface EvAgentAssistantOptions {
  disabled?: boolean;
  /**
   * RingCentral client id of the Agent Assistant app. The RC interop code is
   * minted for this client id, so it has to match the client id the assistant
   * authenticates with.
   */
  clientId?: string;
  /**
   * Page that hosts the Agent Assistant bundle. Same-origin today
   * (`./agentAssistant.html`), may become an absolute URL when the page is
   * served from a CDN.
   */
  pageUrl?: string;
}

/**
 * Everything the Agent Assistant frame needs for one call.
 *
 * `query` is passed to the hosting page verbatim - the assistant reads its whole
 * configuration from `window.location.search`, so the key names are its API and
 * must not be renamed. `dialogId` and `kbContextIds` are repeated outside of it
 * because the auto-suggestion handshake sends them over `postMessage`.
 */
export interface EvAgentAssistantFrameParams {
  pageUrl: string;
  dialogId: string;
  kbContextIds: string[];
  query: Record<string, string>;
}

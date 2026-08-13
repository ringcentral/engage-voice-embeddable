import { EventEmitter } from 'events';

import type {
  AgentScriptHostMessage,
  AgentScriptRendererMessage,
} from './app/services/EvAgentScript';

const connectMessageType = 'ev-agent-script-connect';
const toAngularKey = 'to_angular';
const fromAngularKey = 'from_angular';
const agentScriptAssetsUrl =
  'https://cdn.labs.ringcentral.com/ringcx-embeddable/agent-script/0.0.1/';
const gridColumns = 12;
const gridCellHeight = 5;
const gridVerticalMargin = 5;
const gridRowHeight = gridCellHeight + gridVerticalMargin;

/**
 * The bundled GridStack stylesheet switches to a one-column document flow at
 * 768px. Agent Script is intentionally rendered in a 360px side panel, so that
 * media query would always replace the script's absolute grid coordinates
 * with `position: relative`, `width: auto`, and `height: auto`.
 *
 * The stylesheet is loaded from a CDN and cannot reliably be inspected through
 * CSSOM across origins. Restore GridStack's generated desktop geometry as
 * inline important styles instead, after Angular adds or updates grid items.
 */
function restoreGridStackLayout(): void {
  document.querySelectorAll<HTMLElement>('.grid-stack').forEach((stack) => {
    const currentHeight = Number(stack.dataset.gsCurrentHeight);
    if (Number.isFinite(currentHeight) && currentHeight > 0) {
      stack.style.setProperty(
        'height',
        `${currentHeight * gridRowHeight - gridVerticalMargin}px`,
        'important',
      );
    }

    Array.from(stack.children).forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      if (!child.classList.contains('grid-stack-item')) return;

      const x = Number(child.dataset.gsX);
      const y = Number(child.dataset.gsY);
      const width = Number(child.dataset.gsWidth);
      const height = Number(child.dataset.gsHeight);
      if (![x, y, width, height].every(Number.isFinite)) return;

      child.style.setProperty('position', 'absolute', 'important');
      child.style.setProperty(
        'left',
        `${(x / gridColumns) * 100}%`,
        'important',
      );
      child.style.setProperty('top', `${y * gridRowHeight}px`, 'important');
      child.style.setProperty(
        'width',
        `${(width / gridColumns) * 100}%`,
        'important',
      );
      child.style.setProperty(
        'height',
        `${height * gridRowHeight - gridVerticalMargin}px`,
        'important',
      );
      child.style.setProperty('margin-bottom', '0', 'important');
    });
  });
}

let gridLayoutFrame: number | null = null;
const scheduleGridStackLayout = () => {
  if (gridLayoutFrame !== null) return;
  gridLayoutFrame = window.requestAnimationFrame(() => {
    gridLayoutFrame = null;
    restoreGridStackLayout();
  });
};

new MutationObserver(scheduleGridStackLayout).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [
    'data-gs-current-height',
    'data-gs-x',
    'data-gs-y',
    'data-gs-width',
    'data-gs-height',
  ],
});
scheduleGridStackLayout();

const eventKeys = {
  updateScript: 'broadcast-INIT',
  setScriptResult: 'broadcast-SET_SCRIPT_RESULT',
  updateDisposition: 'broadcast-UPDATE_DISPOSITION',
  getKnowledgeBaseArticles: 'broadcast-GET_KNOWLEDGE_BASE_ARTICLES',
};

class AgentScriptFrameApp {
  eventEmitter = new EventEmitter();
  toAngularKey = toAngularKey;
  fromAngularKey = fromAngularKey;
  eventKeys = eventKeys;

  private port: MessagePort | null = null;
  private callId = '';
  private resolvePort!: (port: MessagePort) => void;
  private portReady = new Promise<MessagePort>((resolve) => {
    this.resolvePort = resolve;
  });

  constructor() {
    window.addEventListener('message', this.handleConnectMessage);

    this.eventEmitter.on(fromAngularKey + eventKeys.setScriptResult, (value) => {
      this.send({
        type: 'scriptResult',
        callId: this.callId,
        value,
      });
    });

    this.eventEmitter.on(
      fromAngularKey + eventKeys.updateDisposition,
      (value) => {
        this.send({
          type: 'updateDisposition',
          callId: this.callId,
          value,
        });
      },
    );

    this.eventEmitter.on(
      fromAngularKey + eventKeys.getKnowledgeBaseArticles,
      (groupIds: number[]) => {
        const requestId = this.createRequestId();
        const responseEvent = `${toAngularKey}${eventKeys.getKnowledgeBaseArticles}:${requestId}`;
        this.eventEmitter.once(responseEvent, (value) => {
          this.eventEmitter.emit(
            toAngularKey + eventKeys.getKnowledgeBaseArticles,
            value,
          );
        });
        this.send({
          type: 'getKnowledgeBaseArticles',
          callId: this.callId,
          requestId,
          groupIds,
        });
      },
    );
  }

  async init(): Promise<void> {
    await this.portReady;
    this.send({ type: 'ready' });
  }

  private handleConnectMessage = (event: MessageEvent) => {
    if (
      event.source !== window.parent ||
      event.data?.type !== connectMessageType ||
      !event.ports[0]
    ) {
      return;
    }
    window.removeEventListener('message', this.handleConnectMessage);
    this.port = event.ports[0];
    this.port.onmessage = this.handleHostMessage;
    this.port.start();
    this.resolvePort(this.port);
  };

  private handleHostMessage = (event: MessageEvent<AgentScriptHostMessage>) => {
    const message = event.data;
    switch (message.type) {
      case 'initialize':
        this.callId = message.payload.callId;
        this.eventEmitter.emit(toAngularKey + eventKeys.updateScript, {
          config: message.payload.config,
          call: message.payload.call,
        });
        break;
      case 'reset':
        if (!this.callId || message.callId === this.callId) {
          this.callId = '';
          this.eventEmitter.emit(toAngularKey + eventKeys.updateScript, {
            config: null,
            call: null,
          });
        }
        break;
      case 'knowledgeBaseResult':
        this.eventEmitter.emit(
          `${toAngularKey}${eventKeys.getKnowledgeBaseArticles}:${message.requestId}`,
          message.error ? null : message.value,
        );
        break;
      default:
        break;
    }
  };

  private send(message: AgentScriptRendererMessage): void {
    this.port?.postMessage(message);
  }

  private createRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

declare global {
  interface Window {
    app: AgentScriptFrameApp;
    __settings: { assetsUrl: string };
  }
}

window.__settings = {
  assetsUrl: agentScriptAssetsUrl,
};
window.app = new AgentScriptFrameApp();

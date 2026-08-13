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
const initDebounceTime = 1000;

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

new MutationObserver(scheduleGridStackLayout).observe(
  document.documentElement,
  {
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
  },
);
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

    this.eventEmitter.on(
      fromAngularKey + eventKeys.setScriptResult,
      (value) => {
        this.send({
          type: 'scriptResult',
          callId: this.callId,
          value,
        });
      },
    );

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

function registerAngularRenderer(app: AgentScriptFrameApp): void {
  window.angular
    .module('agent_ui.factories.localeLoader', [])
    .factory('localeLoader', [
      '$q',
      '$http',
      ($q, $http) => {
        let deferred: any;

        return (options: { key: string }) => {
          if (!deferred) {
            deferred = $q.defer();
            const localeUrl = `${
              window.__settings.assetsUrl
            }assets/languages/locale-${options.key}.json?v=${Date.now()}`;

            $http.get(localeUrl).success((data: unknown) => {
              deferred.resolve(data);
            });
          }

          return deferred.promise;
        };
      },
    ]);

  const angularApp = window.angular.module('render', [
    'ui.select',
    'ngSanitize',
    'angular-growl',
    'pascalprecht.translate',
    'formly',
    'formlyBootstrap',
    'gridstack-angular',
    'ngAnimate',
    'ngMaterial',
    'scriptingStudio.render',
    'agent_ui.factories.localeLoader',
  ]);

  angularApp.config([
    '$mdThemingProvider',
    '$translateProvider',
    '$provide',
    ($mdThemingProvider, $translateProvider, $provide) => {
      // The compatibility renderer compiles rich text into a jQuery collection
      // and passes that collection to `.html()`. Newer jQuery versions stringify
      // the nodes as "[object HTMLParagraphElement]". Keep the renderer's
      // compilation behavior, but insert the compiled nodes with `.append()`.
      $provide.decorator('bindHtmlUnsafeDirective', [
        '$delegate',
        '$injector',
        ($delegate, $injector) => {
          $delegate.forEach((directive: any) => {
            const link = (scope: any, element: any, attrs: any) => {
              const htmlExpression = attrs.bindHtmlUnsafe;

              scope.nameWatcher = scope.$watch(
                htmlExpression,
                (html: unknown) => {
                  element.empty();
                  if (!html) return;

                  const $compile = $injector.get('$compile');
                  element.append($compile(html)(scope));
                },
              );
            };

            // Angular normalizes a directive's `link` property into `compile`
            // before decorators run, so replace both hooks.
            directive.link = link;
            directive.compile = () => link;
          });

          return $delegate;
        },
      ]);

      $mdThemingProvider
        .theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('blue');

      $translateProvider.useSanitizeValueStrategy('sanitize');
      $translateProvider.preferredLanguage('us');
      $translateProvider.fallbackLanguage('us');
      $translateProvider.useLoader('localeLoader');
    },
  ]);

  angularApp.provider('$stateParams', function StateParams() {
    this.$get = () => ({ uii: '1' });
  });

  angularApp.controller('AgentScriptHostCtrl', [
    '$scope',
    '$q',
    ($scope, $q) => {
      let recordingState = false;
      let holdState = false;

      const sendToHost = (key: string, value?: unknown) => {
        app.eventEmitter.emit(app.fromAngularKey + key, value);
      };

      const resolvedPromise = (value: unknown) => {
        const deferred = $q.defer();
        deferred.resolve(value);
        return deferred.promise;
      };

      const updateScript = (data: { config: unknown; call: unknown }) => {
        $scope.$apply(() => {
          $scope.config = data.config;
          $scope.call = data.call;
          recordingState = Boolean(
            (data.call as any)?.agentRecording?.agentRecording,
          );
          holdState = Boolean((data.call as any)?.hold);
        });
      };

      const requestKnowledgeBaseArticles = (groupIds: number[]) =>
        $q((resolve) => {
          sendToHost(eventKeys.getKnowledgeBaseArticles, groupIds);
          app.eventEmitter.once(
            app.toAngularKey + eventKeys.getKnowledgeBaseArticles,
            resolve,
          );
        });

      app.eventEmitter.on(
        app.toAngularKey + eventKeys.updateScript,
        updateScript,
      );
      app.init();

      window.setTimeout(() => {
        if (!$scope.config) {
          $scope.$apply(() => {
            $scope.showMessage = 'No Engage Script';
          });
        }
      }, initDebounceTime);

      $scope.uii = 1;
      $scope.callbacks = {
        setScriptResult: (value: unknown) => {
          sendToHost(eventKeys.setScriptResult, value);
          return true;
        },
        isRecording: () => recordingState,
        isOnHold: () => holdState,
        setRecordingState: (value: boolean) => {
          recordingState = Boolean(value);
          return resolvedPromise(recordingState);
        },
        setHoldState: (value: boolean) => {
          holdState = Boolean(value);
          return resolvedPromise(holdState);
        },
        requestColdRequeue: () => resolvedPromise(true),
        requestWarmRequeue: () => resolvedPromise(true),
        requestHangup: () => resolvedPromise(true),
        getScriptData: () =>
          resolvedPromise({
            model: {},
            lead: {},
            call: {
              uii: $scope.uii,
              dispositions:
                $scope.call?.outdialDispositions?.dispositions || [],
            },
          }),
        requestColdTransfer: () => resolvedPromise(true),
        requestWarmTransfer: () => resolvedPromise(true),
        requestDisposition: (
          _uii: unknown,
          disposition: { dispositionId: string },
          notes: string,
        ) => {
          sendToHost(eventKeys.updateDisposition, {
            dispositionId: disposition.dispositionId,
            notes,
          });
          return resolvedPromise(true);
        },
        changeScript: () => undefined,
        allowSendKbArticle: () => undefined,
        sendKbArticle: () => undefined,
        getKnowledgeBaseArticles: requestKnowledgeBaseArticles,
      };
    },
  ]);
}

declare global {
  interface Window {
    app: AgentScriptFrameApp;
    __settings: { assetsUrl: string };
    angular: {
      module: (name: string, dependencies: string[]) => any;
    };
  }
}

window.__settings = {
  assetsUrl: agentScriptAssetsUrl,
};
window.app = new AgentScriptFrameApp();
registerAngularRenderer(window.app);

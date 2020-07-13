import { Module } from 'ringcentral-integration/lib/di';
import MessageTransport from 'ringcentral-integration/lib/MessageTransport';
import {
  RcModuleV2,
  state,
  globalStorage,
  action,
} from '@ringcentral-integration/core/lib/RcModule';
import messageTypes from '../../enums/messageTypes';
import { Interface, DepsModules, State } from './interface';

type AdapterState = RcModuleState<Adapter, State>;

@Module({
  deps: [
    'EvDialerUI',
    'EvCall',
    { dep: 'GlobalStorage', optional: true },
    { dep: 'AdapterOptions', optional: true, spread: true },
  ],
})
class Adapter extends RcModuleV2<DepsModules, AdapterState> implements Interface {
  public messageTypes: typeof messageTypes;
  public transport: MessageTransport;

  private _lastClosed: boolean;
  private _lastPosition: any;
  private _lastMinimized: any;

  constructor({
    globalStorage,
    evDialerUI,
    evCall,
    enableGlobalCache = true,
    targetWindow = window.parent,
  }) {
    super({
      modules: {
        globalStorage,
        evDialerUI,
        evCall,
      },
      enableGlobalCache,
      storageKey: 'Adapter',
    });
    this.messageTypes = messageTypes;
    this.transport = new MessageTransport({
      targetWindow,
    } as any);
    this.addListeners();
    this._lastPosition = {};
    this.onAppStart();
  }

  @globalStorage
  @state
  closed = false;

  @globalStorage
  @state
  minimized = false;

  @globalStorage
  @state
  size = { width: 300, height: 500 };

  @globalStorage
  @state
  position = {
    translateX: null,
    translateY: null,
    minTranslateX: null,
    minTranslateY: null,
  };

  @action
  setClosed(closed) {
    this.closed = closed;
  }

  @action
  setMinimized(minimized) {
    this.minimized = minimized;
  }

  @action
  setSize(size) {
    this.size = size;
  }

  @action
  setPosition(position) {
    this.position = position;
  }

  addListeners() {
    // @ts-ignore
    this.transport.addListeners({
      push: async (payload: any): Promise<any> => {
        if (typeof payload !== 'object') return;
        switch (payload.type) {
          case this.messageTypes.syncClosed:
            this.setClosed(payload.closed);
            break;
          case this.messageTypes.syncMinimized:
            this.setMinimized(payload.minimized);
            break;
          case this.messageTypes.syncSize:
            this.setSize(payload.size);
            break;
          case this.messageTypes.syncPosition:
            this.setPosition(payload.position);
            break;
          case this.messageTypes.clickToDial:
            this.clickToDial(payload.phoneNumber);
            break;
          case this.messageTypes.setEnvironment:
            this.setEnvironment();
            break;
          default:
            break;
        }
      },
    });
  }

  onStateChange() {
    this._pushAdapterState();
  }

  async clickToDial(phoneNumber) {
    this._modules.evDialerUI.setToNumber(phoneNumber);
    this._modules.evDialerUI.setLatestDialoutNumber();
    await this._modules.evCall.dialout(this._modules.evDialerUI.toNumber);
  }

  onAppStart() {
    this.transport._postMessage({
      type: this.messageTypes.init,
    });
  }

  onNewCall(call) {
    this._postMessage({
      type: this.messageTypes.newCall,
      call,
    });
  }

  setEnvironment() {
    if (window.toggleEnv) {
      window.toggleEnv();
    }
  }

  _pushAdapterState() {
    if (
      this._lastClosed !== this.closed ||
      this._lastMinimized !== this.minimized ||
      this._lastPosition.translateX !== this.position.translateX ||
      this._lastPosition.translateY !== this.position.translateY ||
      this._lastPosition.minTranslateX !== this.position.minTranslateX ||
      this._lastPosition.minTranslateY !== this.position.minTranslateY
    ) {
      this._lastClosed = this.closed;
      this._lastMinimized = this.minimized;
      this._lastPosition = this.position;
      this._postMessage({
        type: this.messageTypes.pushAdapterState,
        size: this.size,
        minimized: this.minimized,
        closed: this.closed,
        position: this.position,
      });
    }
  }

  protected response({ requestId, result }) {
    this.transport.response({
      requestId,
      result,
      error: null,
    });
  }

  _postMessage(msg) {
    this.transport._postMessage({
      type: this.transport.events.push,
      payload: msg,
    });
  }

  popUpWindow() {
    this.setMinimized(false);
  }
}

export { Adapter };

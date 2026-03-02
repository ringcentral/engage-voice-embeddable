import {
  action,
  injectable,
  inject,
  optional,
  RcModule,
  state,
  delegate,
  storage,
  StoragePlugin,
  PortManager,
  isSharedWorker,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

/**
 * EvTabManager options for configuration
 */
export interface EvTabManagerOptions {
  fromPopup?: boolean;
}

/**
 * Tab manager event
 */
export interface TabManagerEvent {
  name: string;
  data?: any;
}

/**
 * EvTabManager module - Multi-tab and popup window management
 * Handles tab synchronization, heartbeat, and popup windows
 */
@injectable({
  name: 'TabManager',
})
class TabManager extends RcModule {
  private _eventEmitter = new EventEmitter();
  private _heartBeatExpire = 70000;

  constructor(
    @inject('Prefix') private prefix: string,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvTabManagerOptions')
    private evTabManagerOptions?: EvTabManagerOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    if (this.portManager?.shared) {
      this.portManager.onClient(() => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  initialize() {
    if (this.fromPopup) {
      this.setPopupTabId(this.id);
      window.addEventListener('pagehide', () => {
        if (this.popupTabId === this.id) {
          this.setPopupTabId('');
        }
      });
    }
  }

  get id() {
    return this.portManager?.clientId || '';
  }

  @state
  popupTabId = '';

  @action
  _setPopupTabId(tabId: string) {
    this.popupTabId = tabId;
  }

  @delegate('server')
  async setPopupTabId(tabId: string) {
    this._setPopupTabId(tabId);
  }

  get fromPopup(): boolean {
    return this.evTabManagerOptions?.fromPopup || false;
  }

  get isFirstTab(): boolean {
    if (this.fromPopup) return true;
    if (this.isPopupWindowOpened) return false;
    return this._isFirstTab();
  }

  get isPopupWindowOpened(): boolean {
    return this.popupTabId !== '';
  }

  get hasMultipleTabs(): boolean {
    // Check if multiple tabs are open
    return false; // Simplified implementation
  }

  /**
   * Send event to other tabs
   */
  send(eventName: string, data?: any): void {
    this._sendEventToOtherTabs(this.id, eventName, data);
  }

  @delegate('clients')
  async _sendEventToOtherTabs(currentId: string, eventName: string, data?: any): Promise<void> {
    if (currentId === this.id) {
      return;
    }
    this._eventEmitter.emit(eventName, data);
  }

  private _isFirstTab(): boolean {
    return this.portManager?.isActiveTab || true;
  }

  onTabEvent(callback: (event: TabManagerEvent) => void): void {
    this._eventEmitter.on('tabEvent', callback);
  }
}

export { TabManager };

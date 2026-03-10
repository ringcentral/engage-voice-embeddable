import {
  action,
  injectable,
  inject,
  optional,
  RcModule,
  state,
  delegate,
  StoragePlugin,
  PortManager,
  watch,
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

  constructor(
    @inject('Prefix') private prefix: string,
    private storagePlugin: StoragePlugin,
    private portManager: PortManager,
    @optional('EvTabManagerOptions')
    private evTabManagerOptions?: EvTabManagerOptions,
  ) {
    super();
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
      this._initializePopup().catch((err) => {
        this.logger.error('Failed to initialize popup as main client', err);
      });
    } else {
      this._initializeNonPopup();
    }
  }

  private async _initializePopup(): Promise<void> {
    this.portManager.initMainClient$.next(true);
    await this.setPopupIsBecomingMain(true);
    await this.setPopupTabId(this.id);
    this.portManager.onMainTab(() => {
      this.setPopupIsBecomingMain(false);
    });
    window.addEventListener('pagehide', () => {
      if (this.popupTabId === this.id) {
        this.setPopupTabId('');
      }
    });
  }

  private _initializeNonPopup(): void {
    if (!this.popupIsBecomingMain) {
      this.portManager.initMainClient$.next(true);
    }
    watch(
      this,
      () => this.popupIsBecomingMain,
      (isBecoming) => {
        this.logger.info('popupIsBecomingMain', isBecoming);
        if (isBecoming) {
          globalThis.location.reload();
        } else {
          this.portManager.initMainClient$.next(true);
        }
      },
    );
  }

  get id() {
    return this.portManager?.clientId || '';
  }

  @state
  popupTabId = '';

  @state
  popupIsBecomingMain = false;

  @action
  _setPopupTabId(tabId: string) {
    this.popupTabId = tabId;
  }

  @action
  _setPopupIsBecomingMain(value: boolean) {
    this.popupIsBecomingMain = value;
  }

  @delegate('server')
  async setPopupTabId(tabId: string): Promise<void> {
    this._setPopupTabId(tabId);
  }

  @delegate('server')
  async setPopupIsBecomingMain(value: boolean): Promise<void> {
    this._setPopupIsBecomingMain(value);
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
    return false;
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

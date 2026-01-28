import {
  action,
  injectable,
  inject,
  optional,
  RcModule,
  state,
  storage,
  StoragePlugin,
} from '@ringcentral-integration/next-core';
import { EventEmitter } from 'events';

import { tabManagerEvents } from '../../../enums';

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
  name: 'EvTabManager',
})
class EvTabManager extends RcModule {
  private _eventEmitter = new EventEmitter();
  private _heartBeatInterval = 50000;
  private _heartBeatExpire = 70000;
  private _lastHeartBeat = 0;

  constructor(
    @inject('Prefix') private prefix: string,
    private storagePlugin: StoragePlugin,
    @optional('EvTabManagerOptions')
    private evTabManagerOptions?: EvTabManagerOptions,
  ) {
    super();
    this.storagePlugin.enable(this);
    this._startHeartBeat();
  }

  @state
  isPopupWindowOpened = false;

  @storage
  @state
  event: TabManagerEvent | null = null;

  get enable(): boolean {
    return true;
  }

  get fromPopup(): boolean {
    return this.evTabManagerOptions?.fromPopup || false;
  }

  get isFirstTab(): boolean {
    if (this.fromPopup) return true;
    if (this.isPopupWindowOpened) return false;
    return this._isFirstTab();
  }

  get hasMultipleTabs(): boolean {
    // Check if multiple tabs are open
    return false; // Simplified implementation
  }

  @action
  setIsPopupWindowOpened(opened: boolean) {
    this.isPopupWindowOpened = opened;
  }

  @action
  setEvent(event: TabManagerEvent | null) {
    this.event = event;
  }

  /**
   * Send event to other tabs
   */
  send(eventName: string, data?: any): void {
    const event = { name: eventName, data };
    // Use BroadcastChannel or localStorage for cross-tab communication
    try {
      localStorage.setItem(`${this.prefix}-tab-event`, JSON.stringify({
        ...event,
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.warn('Failed to send tab event:', e);
    }
  }

  override async onInit(): Promise<void> {
    if (this.fromPopup) {
      this.setIsPopupWindowOpened(true);
    } else {
      await this._syncIsPopupWindowOpened();
    }
    this._listenForTabEvents();
  }

  private _startHeartBeat(): void {
    setInterval(() => {
      this._lastHeartBeat = Date.now();
      try {
        localStorage.setItem(`${this.prefix}-tab-heartbeat`, String(this._lastHeartBeat));
      } catch (e) {
        // ignore
      }
    }, this._heartBeatInterval);
  }

  private _isFirstTab(): boolean {
    try {
      const lastHeartBeat = localStorage.getItem(`${this.prefix}-tab-heartbeat`);
      if (!lastHeartBeat) return true;
      const elapsed = Date.now() - parseInt(lastHeartBeat, 10);
      return elapsed > this._heartBeatExpire;
    } catch (e) {
      return true;
    }
  }

  private async _syncIsPopupWindowOpened(): Promise<void> {
    // Check if popup window is opened
    try {
      const popupStatus = localStorage.getItem(`${this.prefix}-popup-opened`);
      this.setIsPopupWindowOpened(popupStatus === 'true');
    } catch (e) {
      this.setIsPopupWindowOpened(false);
    }
  }

  private _listenForTabEvents(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === `${this.prefix}-tab-event` && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          this.setEvent(data);
          this._eventEmitter.emit('tabEvent', data);
        } catch (e) {
          // ignore
        }
      }
    });
  }

  onTabEvent(callback: (event: TabManagerEvent) => void): void {
    this._eventEmitter.on('tabEvent', callback);
  }
}

export { EvTabManager };

import { Module } from '@ringcentral-integration/commons/lib/di';
import { action, state } from '@ringcentral-integration/core';

import { EvTabManager as BaseEvTabManager } from '@ringcentral-integration/engage-voice-widgets/modules/EvTabManager';
import PopupWindowManager from '../../lib/PopupWindowManager';

@Module({
  deps: [],
})
class EvTabManager extends BaseEvTabManager {
  private _popupWindowManager: PopupWindowManager;

  constructor(deps) {
    super(deps);
    this._popupWindowManager = new PopupWindowManager({
      prefix: this._deps.prefix,
      isPopupWindow: this._deps.tabManagerOptions.fromPopup
    });
    if (!this._deps.tabManagerOptions.fromPopup) {
      this._popupWindowManager.on('popupWindowOpened', () => {
        this.setIsPopupWindowOpened(true);
      });
      this._popupWindowManager.on('popupWindowClosed', () => {
        this.setIsPopupWindowOpened(false);
      });
    }
  }

  get popupWindowManager() {
    return  this._popupWindowManager;
  }

  get isFirstTab() {
    if (this._deps.tabManagerOptions.fromPopup) {
      return true;
    }
    if (this.isPopupWindowOpened) {
      return false;
    }
    return this.tabbie?.isFirstTab ?? true;
  }

  @state
  isPopupWindowOpened: boolean = false;

  @action
  setIsPopupWindowOpened(opened) {
    this.isPopupWindowOpened = opened;
  }

  async onInit() {
    if (this._deps.tabManagerOptions.fromPopup) {
      this.setIsPopupWindowOpened(true);
    } else {
      await this._syncIsPopupWindowOpened();
    }
  }

  private async _syncIsPopupWindowOpened() {
    const opened = await this._popupWindowManager.checkPopupWindowOpened();
    this.setIsPopupWindowOpened(opened);
  }
}

export { EvTabManager };

import clsx from 'clsx';
import AdapterCore from '@ringcentral-integration/widgets/lib/AdapterCore';
import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import { popWindow } from '@ringcentral-integration/widgets/lib/popWindow';

import { adapterMessageTypes } from '../../enums/adapterMessageTypes';
import * as styles from './styles.scss';
import popupIconUrl from '../../assets/popup.svg?url';

/**
 * Sandbox attributes for the iframe
 */
const SANDBOX_ATTRIBUTE_VALUE = [
  'allow-same-origin',
  'allow-scripts',
  'allow-forms',
  'allow-popups',
].join(' ');

/**
 * Allow attributes for the iframe (microphone access)
 */
const ALLOW_ATTRIBUTE_VALUE = [
  'microphone',
  // 'camera',
].join(' ');

/**
 * Adapter constructor options
 */
export interface AdapterConstructorOptions {
  logoUrl?: string;
  appUrl: string;
  iconUrl?: string;
  prefix?: string;
  version?: string;
  appWidth?: number;
  appHeight?: number;
  zIndex?: number;
  enablePopup?: boolean;
  fromPopup?: boolean;
  popupPageUri?: string;
}

/**
 * Parent-page Adapter that creates a draggable widget container with an iframe.
 * Extends AdapterCore for drag/resize/minimize functionality.
 */
class Adapter extends AdapterCore {
  _zIndex: number;
  _fromPopup: boolean;
  _enablePopup: boolean;
  _popupPageUri?: string;
  _version?: string;
  _appOrigin: string;
  _iconEl: any;
  _popupEl: any;
  _iconContainerEl: any;
  _popupWindowPromise: Promise<void> | null;
  _popupedWindow: Window | null;
  styleEl: HTMLStyleElement | null;

  constructor({
    logoUrl,
    appUrl,
    iconUrl,
    prefix = 'rc-widget',
    version,
    appWidth = 300,
    appHeight = 500,
    zIndex = 999,
    enablePopup = false,
    fromPopup = false,
    popupPageUri,
  }: AdapterConstructorOptions) {
    const container = document.createElement('div');
    container.id = prefix;
    container.setAttribute('class', clsx(styles.root, styles.loading));
    container.draggable = false;
    super({
      prefix,
      container,
      styles,
      messageTypes: adapterMessageTypes,
      defaultDirection: 'right',
    });
    this._messageTypes = adapterMessageTypes;
    this._zIndex = zIndex;
    this._appWidth = appWidth;
    this._appHeight = appHeight;
    this._fromPopup = fromPopup;
    this._enablePopup = enablePopup;
    this._popupPageUri = popupPageUri;
    this._strings = {};
    this._appOrigin = '';
    this._popupWindowPromise = null;
    this._popupedWindow = null;
    this.styleEl = null;
    this._generateContentDOM();
    this._messageTransport = new MessageTransport({
      targetWindow: this._contentFrameEl.contentWindow,
      origin: this._appOrigin,
    } as any);
    const styleList = document.querySelectorAll('style');
    for (let i = 0; i < styleList.length; ++i) {
      const styleEl = styleList[i];
      if (styleEl.innerHTML.indexOf('https://{{rc-styles}}') > -1) {
        this.styleEl = styleEl;
      }
    }
    if (this.styleEl) {
      this._root.appendChild(this.styleEl.cloneNode(true));
    }
    this._setAppUrl(appUrl);
    this._setLogoUrl(logoUrl);
    this._setIconUrl(iconUrl);
    this._version = version;
    this._messageTransport.addListeners({
      push: (data: any) => {
        this._onMessage(data);
      },
    });
  }

  override _onMessage(msg: any): void {
    if (msg) {
      switch (msg.type) {
        case this._messageTypes.syncClosed:
          this._onSyncClosed(msg.closed);
          break;
        case this._messageTypes.syncMinimized:
          this._onSyncMinimized(msg.minimized);
          break;
        case this._messageTypes.syncSize:
          this._onSyncSize(msg.size);
          break;
        case this._messageTypes.syncPresence:
          this._onPushPresence(msg);
          break;
        case this._messageTypes.pushAdapterState:
          this._onPushAdapterState(msg);
          break;
        default:
          break;
      }
    }
  }

  override _onPushAdapterState(options: any): void {
    if (!this._fromPopup) {
      super._onPushAdapterState(options);
      return;
    }
    super._onPushAdapterState({
      ...options,
      minimized: false,
    });
  }

  override _onSyncMinimized(minimized: boolean): void {
    if (this._fromPopup) {
      return;
    }
    super._onSyncMinimized(minimized);
  }

  override _getContentDOM(
    sandboxAttributeValue: string,
    allowAttributeValue: string,
  ): string {
    return `
      <header class="${this._styles.header}" draggable="false">
        <div class="${this._styles.presence} ${this._styles.NoPresence}">
          <div class="${this._styles.presenceBar}">
          </div>
        </div>
        <div class="${this._styles.iconContainer}">
          <img class="${this._styles.icon}" draggable="false"></img>
        </div>
        <div class="${this._styles.button} ${this._styles.popup}">
          <div class="${this._styles.popupIcon}">
            <img src="${popupIconUrl}" draggable="false" />
          </div>
        </div>
        <div class="${this._styles.button} ${this._styles.toggle}" data-sign="adapterToggle">
          <div class="${this._styles.minimizeIcon}">
            <div class="${this._styles.minimizeIconBar}"></div>
          </div>
        </div>
        <img class="${this._styles.logo}" draggable="false"></img>
      </header>
      <div class="${this._styles.frameContainer}">
        <iframe class="${this._styles.contentFrame}" sandbox="${sandboxAttributeValue}" allow="${allowAttributeValue}" >
        </iframe>
      </div>`;
  }

  override _generateContentDOM(): void {
    this._root.innerHTML = this._getContentDOM(
      SANDBOX_ATTRIBUTE_VALUE,
      ALLOW_ATTRIBUTE_VALUE,
    );
    this._headerEl = this._root.querySelector(`.${this._styles.header}`)!;
    this._logoEl = this._root.querySelector(`.${this._styles.logo}`);
    this._logoEl.addEventListener('dragstart', () => false);
    this._contentFrameContainerEl = this._root.querySelector(
      `.${this._styles.frameContainer}`,
    );
    // toggle button
    this._toggleEl = this._root.querySelector(`.${this._styles.toggle}`);
    this._toggleEl.addEventListener('click', (evt: Event) => {
      evt.stopPropagation();
      this.toggleMinimized();
    });
    // close button
    this._closeEl = this._root.querySelector(`.${this._styles.close}`);
    if (this._closeEl) {
      this._closeEl.addEventListener('click', () => {
        this.setClosed(true);
      });
    }
    this._contentFrameEl = this._root.querySelector(
      `.${this._styles.contentFrame}`,
    );
    this._headerEl.addEventListener('mousedown', (e: MouseEvent) => {
      this._dragging = true;
      this._isClick = true;
      this._dragStartPosition = {
        x: e.clientX,
        y: e.clientY,
        translateX: this._translateX,
        translateY: this._translateY,
        minTranslateX: this._minTranslateX,
        minTranslateY: this._minTranslateY,
      };
      this._renderMainClass();
    });
    this._headerEl.addEventListener('mouseup', () => {
      this._dragging = false;
      this._renderMainClass();
    });
    window.addEventListener('mousemove', this._onWindowMouseMove);
    this._headerEl.addEventListener('mouseenter', () => {
      if (!this._minimized) {
        if ((this as any)._currentStartTime > 0) {
          this._hoverBar = true;
          (this as any)._scrollable = false;
          this._renderCallsBar();
        }
        return;
      }
      this._hoverHeader = true;
      this._renderMainClass();
    });
    this._headerEl.addEventListener('mouseleave', () => {
      this._hoverHeader = false;
      this._hoverBar = false;
      (this as any)._scrollable = false;
      this._renderCallsBar();
      this._renderMainClass();
    });
    this._isClick = true;
    this._headerEl.addEventListener('click', (evt: Event) => {
      if (!this._isClick) return;
      this._onHeaderClicked();
    });
    this._resizeTimeout = null;
    this._resizeTick = null;
    window.addEventListener('resize', this._onWindowResize);
    // hover detection
    this._container.addEventListener('mouseenter', () => {
      this._hover = true;
      this._renderMainClass();
    });
    this._container.addEventListener('mouseleave', () => {
      this._hover = false;
      this._renderMainClass();
    });
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => {
        document.body.appendChild(this._container);
      });
    } else {
      document.body.appendChild(this._container);
    }
    if (typeof this._beforeRender === 'function') {
      this._beforeRender();
    }
    this._render();
  }

  override _beforeRender(): void {
    this._iconEl = this._root.querySelector(`.${this._styles.icon}`);
    this._popupEl = this._root.querySelector(`.${this._styles.popup}`);
    this._iconEl.addEventListener('dragstart', () => false);
    this._iconContainerEl = this._root.querySelector(
      `.${this._styles.iconContainer}`,
    );
    this._popupEl.addEventListener('click', (evt: Event) => {
      evt.stopPropagation();
      this.popupWindow();
    });
  }

  override renderPosition(): void {
    if (this._fromPopup) {
      return;
    }
    super.renderPosition();
  }

  override _syncPosition(): void {
    if (this._fromPopup) {
      return;
    }
    super._syncPosition();
  }

  override renderPresence(): void {
    // No-op for EV adapter
  }

  override _renderCallsBar(): void {
    // No-op for EV adapter
  }

  override _renderMainClass(): void {
    this._container.setAttribute(
      'class',
      clsx(
        this._styles.root,
        this._styles[this._defaultDirection],
        this._closed && this._styles.closed,
        this._minimized && this._styles.minimized,
        this._dragging && this._styles.dragging,
        this._hover && this._styles.hover,
        this._loading && this._styles.loading,
        this._enablePopup && this._styles.showPopup,
      ),
    );
    this._headerEl?.setAttribute(
      'class',
      clsx(
        this._styles.header,
        this._minimized && this._styles.minimized,
        this._ringing && this._styles.ringing,
      ),
    );
  }

  override _renderMinimizedBar(): void {
    this._logoEl.setAttribute(
      'class',
      clsx(
        this._styles.logo,
        this._logoUrl && this._logoUrl !== '' && this._styles.visible,
      ),
    );
  }

  override _onHeaderClicked(): void {
    if (!this._minimized) return;
    this.toggleMinimized();
  }

  override _setAppUrl(appUrl: string): void {
    this._appUrl = appUrl;
    try {
      const parsedUrl = new URL(appUrl);
      this._appOrigin = parsedUrl.origin;
    } catch {
      this._appOrigin = '';
    }
    if (appUrl) {
      this.contentFrameEl.src = appUrl;
      this.contentFrameEl.id = `${this._prefix}-adapter-frame`;
    }
  }

  /**
   * Open a popup window for the widget
   */
  async popupWindow(): Promise<void> {
    if (!this._popupWindowPromise) {
      this._popupWindowPromise = this._popupWindow();
    }
    try {
      await this._popupWindowPromise;
    } catch (e) {
      console.error(e);
    }
    this._popupWindowPromise = null;
  }

  private async _popupWindow(): Promise<void> {
    const isWindowPopuped = await this.transport.request({
      payload: { type: adapterMessageTypes.checkPopupWindow },
    });
    if (isWindowPopuped) {
      if (this._popupedWindow && this._popupedWindow.focus) {
        this._popupedWindow.focus();
      }
      return;
    }
    let popupUri = this._appUrl.replace('app.html', 'popup.html');
    if (this._popupPageUri) {
      popupUri = `${this._popupPageUri}?${popupUri.split('?')[1]}`;
    }
    this._popupedWindow = popWindow(popupUri, 'RCEVPopupWindow', 300, 536);
    this.setMinimized(true);
  }

  /**
   * Set the icon URL for the minimized widget header
   */
  _setIconUrl(iconUrl?: string): void {
    if (this._iconEl && iconUrl) {
      this._iconEl.src = iconUrl;
    }
  }

  override _postMessage(data: any): void {
    if (this._messageTransport) {
      this._messageTransport._postMessage({
        type: this._messageTransport.events.push,
        payload: data,
      });
    }
  }

  override renderAdapterSize(): void {
    super.renderAdapterSize();
    if (this._fromPopup) {
      this._contentFrameContainerEl.style.width = '100%';
      this._contentFrameContainerEl.style.height = 'calc(100% - 36px)';
      this._contentFrameEl.style.width = '100%';
      this._contentFrameEl.style.height = '100%';
    }
  }

  /**
   * Set ringing state (no-op for EV adapter)
   */
  setRinging(_ringing: boolean): void {
    // No-op
  }

  /**
   * Go to presence page (no-op for EV adapter)
   */
  gotoPresence(): void {
    // No-op
  }

  /**
   * Toggle the environment
   */
  setEnvironment(): void {
    this._postMessage({
      type: adapterMessageTypes.setEnvironment,
    });
  }

  /**
   * Send click-to-dial message to the app iframe
   */
  clickToDial(phoneNumber: string): void {
    this._postMessage({
      type: adapterMessageTypes.clickToDial,
      phoneNumber,
    });
  }

  /**
   * Register a third-party service in the app iframe
   */
  registerService(service: any): void {
    this._postMessage({
      type: adapterMessageTypes.register,
      service,
    });
  }

  /**
   * Trigger logout in the app iframe
   */
  logout(): void {
    this._postMessage({
      type: adapterMessageTypes.logout,
    });
  }

  /**
   * Dial a lead via the app iframe
   */
  dialLead(lead: any, destination: string): void {
    this._postMessage({
      type: adapterMessageTypes.dialLead,
      lead,
      destination,
    });
  }

  /**
   * Get the message transport instance
   */
  get transport(): any {
    return this._messageTransport;
  }
}

export default Adapter;

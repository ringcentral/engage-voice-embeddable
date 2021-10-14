import classnames from 'classnames';
import AdapterCore from '@ringcentral-integration/widgets/lib/AdapterCore';
import MessageTransport from '@ringcentral-integration/commons/lib/MessageTransport';
import popWindow from '@ringcentral-integration/widgets/lib/popWindow';

// eslint-disable-next-line
import popupIconUrl from '!url-loader!../../assets/popup.svg';

import url from 'url';

import messageTypes from '../../enums/messageTypes';

import styles from './styles.scss';

const SANDBOX_ATTRIBUTE_VALUE = [
  'allow-same-origin',
  'allow-scripts',
  'allow-forms',
  'allow-popups',
].join(' ');

// chrome 63 mandate the declaration of this attribute for getUserMedia to work in iframes
const ALLOW_ATTRIBUTE_VALUE = [
  'microphone',
  // 'camera',
].join(' ');

class Adapter extends AdapterCore {
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
  } = {}) {
    const container = document.createElement('div');
    container.id = prefix;
    container.setAttribute('class', classnames(styles.root, styles.loading));
    container.draggable = false;
    super({
      prefix,
      container,
      styles,
      messageTypes,
      defaultDirection: 'right',
    });
    this._messageTypes = messageTypes;
    this._zIndex = zIndex;
    this._appWidth = appWidth;
    this._appHeight = appHeight;
    this._fromPopup = fromPopup;
    this._enablePopup = enablePopup;
    this._strings = {};
    this._generateContentDOM();
    this._messageTransport = new MessageTransport({
      targetWindow: this._contentFrameEl.contentWindow,
      origin: this._appOrigin,
    });
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
      push: (data) => {
        this._onMessage(data);
      },
    });
  }

  _onMessage(msg) {
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

  _onPushAdapterState(options) {
    if (!this._fromPopup) {
      return super._onPushAdapterState(options);
    }
    return super._onPushAdapterState({
      ...options,
      minimized: false,
    });
  }

  _onSyncMinimized(minimized) {
    if (this._fromPopup) {
      return;
    }
    super._onSyncMinimized(minimized);
  }

  _getContentDOM(sanboxAttributeValue, allowAttributeValue) {
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
        <iframe class="${this._styles.contentFrame}" sandbox="${sanboxAttributeValue}" allow="${allowAttributeValue}" >
        </iframe>
      </div>`;
  }

  _generateContentDOM() {
    this._root.innerHTML = this._getContentDOM(
      SANDBOX_ATTRIBUTE_VALUE,
      ALLOW_ATTRIBUTE_VALUE,
    );
    this._headerEl = this._root.querySelector(`.${this._styles.header}`);
    this._logoEl = this._root.querySelector(`.${this._styles.logo}`);
    this._logoEl.addEventListener('dragstart', () => false);

    this._contentFrameContainerEl = this._root.querySelector(
      `.${this._styles.frameContainer}`,
    );

    // toggle button
    this._toggleEl = this._root.querySelector(`.${this._styles.toggle}`);
    this._toggleEl.addEventListener('click', (evt) => {
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

    this._headerEl.addEventListener('mousedown', (e) => {
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
        if (this._currentStartTime > 0) {
          this._hoverBar = true;
          this._scrollable = false;
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
      this._scrollable = false;
      this._renderCallsBar();
      this._renderMainClass();
    });

    this._isClick = true;
    this._headerEl.addEventListener('click', (evt) => {
      if (!this._isClick) return;
      this._onHeaderClicked(evt);
    });

    this._resizeTimeout = null;
    this._resizeTick = null;
    window.addEventListener('resize', this._onWindowResize);

    // hover detection for ie
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

  _beforeRender() {
    this._iconEl = this._root.querySelector(`.${this._styles.icon}`);
    this._popupEl = this._root.querySelector(
      `.${this._styles.popup}`
    );
    this._iconEl.addEventListener('dragstart', () => false);
    this._iconContainerEl = this._root.querySelector(
      `.${this._styles.iconContainer}`,
    );
    this._popupEl.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this.popupWindow();
    });
  }

  renderPosition() {
    if (this._fromPopup) {
      return;
    }
    super.renderPosition();
  }

  _syncPosition() {
    if (this._fromPopup) {
      return;
    }
    super._syncPosition();
  }

  renderPresence() {}

  _renderCallsBar() {}

  _renderMainClass() {
    this._container.setAttribute(
      'class',
      classnames(
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
    this._headerEl.setAttribute(
      'class',
      classnames(
        this._styles.header,
        this._minimized && this._styles.minimized,
        this._ringing && this._styles.ringing,
      ),
    );
  }

  _renderMinimizedBar() {
    this._logoEl.setAttribute(
      'class',
      classnames(
        this._styles.logo,
        this._logoUrl && this._logoUrl !== '' && this._styles.visible,
      ),
    );
  }

  _onHeaderClicked() {
    if (!this._minimized) return;
    this.toggleMinimized();
  }

  _setAppUrl(appUrl) {
    this._appUrl = appUrl;
    const { protocol, host } = url.parse(appUrl, false);
    this._appOrigin = `${protocol}//${host}`;
    if (appUrl) {
      this.contentFrameEl.src = appUrl;
      this.contentFrameEl.id = `${this._prefix}-adapter-frame`;
    }
  }

  async popupWindow() {
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

  async _popupWindow() {
    const isWindowPopuped = await this.transport.request({ payload: { type: messageTypes.checkPopupWindow } });
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

  _setIconUrl(iconUrl) {
    this._iconEl.src = iconUrl;
  }

  _postMessage(data) {
    if (this._messageTransport) {
      this._messageTransport._postMessage({
        type: this._messageTransport.events.push,
        payload: data,
      });
    }
  }

  setRinging(ringing) {
    //
  }

  gotoPresence() {
    //
  }

  setEnvironment() {
    this._postMessage({
      type: messageTypes.setEnvironment,
    });
  }

  clickToDial(phoneNumber) {
    this._postMessage({
      type: messageTypes.clickToDial,
      phoneNumber,
    });
  }

  registerService(service) {
    this._postMessage({
      type: messageTypes.register,
      service,
    });
  }

  get transport() {
    return this._messageTransport;
  }
}

export default Adapter;

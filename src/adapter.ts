import { parseUri } from './lib/Adapter/parseUri';

// @ts-ignore
import logoUrl from '!url-loader!brand-logo-path/assets/logo.svg';
// @ts-ignore
import iconUrl from '!url-loader!brand-logo-path/icon.svg';

import Adapter from './lib/Adapter/Adapter';

declare global {
  interface Window {
    RCAdapter: any;
    __ON_RC_POPUP_WINDOW?: number;
  }
}

const prefix = 'engage-voice-embeddable';
const version = process.env.APP_VERSION as string | undefined;
const appUrl = `${process.env.HOSTING_URL || '.'}/app.html`;

let currentScript = document.currentScript as HTMLScriptElement | null;
if (!currentScript) {
  currentScript = document.querySelector('script[src*="adapter.js"]');
}

let paramsUri = (currentScript && currentScript.src) || '';
const fromPopup = window.__ON_RC_POPUP_WINDOW;
if (fromPopup) {
  paramsUri = window.location.href;
}

const {
  clientId,
  clientSecret,
  redirectUri,
  rcServer,
  evServer,
  disableLoginPopup,
  enablePopup,
  popupPageUri,
  jwt,
  jwtOwnerId,
  hideCallNote,
} = parseUri(paramsUri);

/**
 * Convert an object to a URI query string, omitting falsy values
 */
function obj2uri(obj: Record<string, any>): string {
  if (!obj) {
    return '';
  }
  const urlParams: string[] = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      urlParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`,
      );
    }
  });
  return urlParams.join('&');
}

const appUri = `${appUrl}?${obj2uri({
  clientId,
  clientSecret,
  redirectUri,
  rcServer,
  evServer,
  disableLoginPopup,
  fromAdapter: 1,
  fromPopup,
  jwt,
  jwtOwnerId,
  hideCallNote,
  _t: Date.now(),
})}`;

function init(): void {
  if (window.RCAdapter) {
    return;
  }
  window.RCAdapter = new Adapter({
    logoUrl,
    iconUrl,
    appUrl: appUri,
    version,
    prefix,
    enablePopup: !!enablePopup,
    fromPopup: !!fromPopup,
    popupPageUri,
  });
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

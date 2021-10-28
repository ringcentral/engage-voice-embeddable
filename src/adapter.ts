import { parseUri } from './lib/parseURI';

// eslint-disable-next-line
import logoUrl from '!url-loader!brand-logo-path/logo.svg';
// eslint-disable-next-line
import iconUrl from '!url-loader!brand-logo-path/icon.svg';

import Adapter from './lib/Adapter';

import prefix from './prefix';

const version = process.env.APP_VERSION;
const appUrl = `${process.env.HOSTING_URL}/app.html`;

let currentScript = document.currentScript;
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
} = parseUri(paramsUri);

function obj2uri(obj) {
  if (!obj) {
    return '';
  }
  const urlParams = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      urlParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
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
  _t: Date.now(),
})}`;

function init() {
  if (window.RCAdapter) {
    return;
  }
  window.RCAdapter = new Adapter({
    logoUrl,
    iconUrl,
    appUrl: appUri,
    version,
    prefix,
    enablePopup,
    fromPopup: !!fromPopup,
    popupPageUri,
  });
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

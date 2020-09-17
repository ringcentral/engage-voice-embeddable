# Customize Authorization

In widget, it popups a window with [RingCentral authorization uri](https://developers.ringcentral.com/api-reference/Authorization) from [authorization code with PKCE flow](https://medium.com/ringcentral-developers/use-authorization-code-pkce-for-ringcentral-api-in-client-app-e9108f04b5f0) for user login. But you can also implement the popup window out of the widget, and pass authorization code to widget after you get authorization callback.

**Prerequisites**: [Customize `clientId`](customize-client-id.md)

## Get authorization uri

For authorization code with PKCE, the widget will create `code_verifier` and `code_challenge` pair for generating oauth uri and exchanging token. So we need to get oauth login URI from it. 

Firstly, we need to disable popup window in widget:

Just add `disableLoginPopup=1` in widget adapter JS uri or iframe src

```
https://ringcentral.github.io/engage-voice-embeddable/adapter.js?disableLoginPopup=1
```

Secondly, listen `loginPopup` event:

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data) {
    switch (data.type) {
      case 'rc-ev-loginPopup':
        // get login oAuthUri from widget
        console.log('rc-ev-loginPopup:', data.oAuthUri);
        //  window.open(data.oAuthUri); // open oauth uri to login
        break;
      default:
        break;
    }
  }
});
```

## Pass RingCentral authorization code:

```js
document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage({
  type: 'rc-ev-authorization-code',
  callbackUri: "http://localhost:8080/redirect.html?code=authorization_code&state=MTU5OTE0MzE5NTQ5OQ%3D%3D"
}, '*');
```


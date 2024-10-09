# Alternative authorization methods

In the widget, it popups a window with [RingCentral authorization uri](https://developers.ringcentral.com/api-reference/Authorization) from [authorization code with PKCE flow](https://medium.com/ringcentral-developers/use-authorization-code-pkce-for-ringcentral-api-in-client-app-e9108f04b5f0) when user click login button. This is the recommended authorization method for applications like those built on top of RingCX Embeddable. Therefore, no changes are necessary to enable authorization and usage of RingCX Embeddable. However, some developers in specific and rare circumstances may wish to utilize a different method of authorization. This guide will instruct developers on how to do so. 

## JWT flow

Developers can login to RingCX Embeddable using the [JWT auth flow](https://developers.ringcentral.com/guide/authentication/jwt/quick-start) if they so choose. A JWT token is bind to a RingCentral user when it is generated. If developer shares the same JWT token to multiple users, it means that every user of RingCX Embeddable will be logged in as the same RingCentral user, which may undermine the value of RingCentral's audit trail and security practices. Please use at your own risk. For different users, developers need to help them to generate different JWT tokens with their own RingCentral credentials.

!!! warning "JWT auth flow in Embeddable is experimental"
    While the JWT auth flow itself is not experimental, its usage within the context of RingCX Embeddable is. This is due to the fact that using JWT in this way is beyond the intended design of Embeddable, and could be problematic in some circumstances. 

	JWT also requires you to expose your client secret, which if exposed publicly could expose you to some security risks. 

### Adapter JS way

```js
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js?clientId=YOU_OWN_JWT_APP_CLIENT_ID&clientSecret=YOUR_OWN_JWT_APP_CLIENT_SECRET&jwt=JWT_TOKEN&jwtOwnerId=optional_owner_id";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
```

### Iframe way

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://ringcentral.github.io/engage-voice-embeddable/app.html?clientId=YOU_OWN_JWT_APP_CLIENT_ID&clientSecret=YOUR_OWN_JWT_APP_CLIENT_SECRET&jwt=JWT_TOKEN">
</iframe>
```

## Authorization code flow with PKCE

This section is for developers who want to manage login popup window.

**Prerequisites**: [Customize `clientId`](customize-client-id.md)

### Get authorization uri

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

### Pass RingCentral authorization code:

```js
document.querySelector("#engage-voice-embeddable-adapter-frame").contentWindow.postMessage({
  type: 'rc-ev-authorization-code',
  callbackUri: "http://localhost:8080/redirect.html?code=authorization_code&state=MTU5OTE0MzE5NTQ5OQ%3D%3D"
}, '*');
```


# Message Transport

We are using `postMessage` to interact with Engage Voice widget. For developers who are using `Adapter JS way` to integrate this widget, you don't need to case about the message transport as you can use `function` provide from `RCAdapter` object to interact with widget.

For who are using iframe way or can't access `RCAdapter` object, you can create message transport by yourself:

## Send Message to widget

```js
function sendMessageToWidget(message) {
  document.querySelector("#engage-voice-embeddable-adapter-frame").contentWindow.postMessage({
    type: "MessageTransport-push",
    payload: message
  }, '*');
}
```

Example:

Send clickToDial message:

```js
sendMessageToWidget({
  type: "rc-ev-clickToDial",
  phoneNumber: "+16599999999"
});
```

Register service:

```js
sendMessageToWidget({
  type: "rc-ev-register",
  service: {
    name: 'TestService',
    callLoggerEnabled: true,
    contactMatcherEnabled: true,
  }
});
```

## Handle request and response message to widget

Listen message type `MessageTransport-request` for request from widget.

```js
window.addEventListener('message', function(event) {
  var message = event.data;
  if (message.type === 'MessageTransport-request') {
    const requestId = message.requestId;
    const payload = message.payload;
    // handle request ...
  }
}
```

After handling request, response to widget:

```js
function responseMessageToWidget(requestId, result, error) {
  document.querySelector("#engage-voice-embeddable-adapter-frame").contentWindow.postMessage({
    type: "MessageTransport-response",
    requestId: requestId,
    result: result,
    error: error, // error is optional
  }, '*');
}
```

Example:

Handle call log request to widget:

```js
window.addEventListener('message', function(event) {
  var message = event.data;
  if (message.type === 'MessageTransport-request') {
    const requestId = message.requestId;
    const payload = message.payload;
    if (payload.requestType === 'rc-ev-logCall') {
      // log call here ...
      console.log('Log Call:', payload.data);
      responseMessageToWidget(requestId, 'ok');
    }
  }
});
```

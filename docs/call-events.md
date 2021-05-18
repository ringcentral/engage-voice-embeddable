# Call Events

## Call ring event

The event is triggered when user receive a inbound ringing call.

Receive by message event:

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-ringCall') {
      console.log(data.payload.call)
    }
  }
});
```

Or Receive event with `RCAdapter` global object: [demo](api.md#register-a-logger-and-contact-matcher-service)

## New call event

The event is triggered when user start a new call or answer a call.

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-newCall') {
      console.log(data.payload.call)
    }
  }
});
```

Or Receive event with `RCAdapter` global object: [demo](api.md#register-a-logger-and-contact-matcher-service)


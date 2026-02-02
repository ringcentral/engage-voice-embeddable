# Call Events

## Call ring event

The event is triggered when user receive a ringing call.

Receive by message event:

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-ringCall') {
      console.log(data.payload.call)
    }
    if (data.payload.type === 'rc-ev-sipRingCall') {
      console.log(data.payload) // Fired on Integrated softphone ringing, no call information
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

## Call Ended event

The event is triggered when user's call is ended.

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-endCall') {
      console.log(data.payload.call);
    }
    if (data.payload.type === 'rc-ev-sipEndCall') {
      console.log(data.payload); // Fired on Integrated softphone call ended, no call information
    }
  }
});
```

Or Receive event with `RCAdapter` global object: [demo](api.md#register-a-logger-and-contact-matcher-service)

## SIP Connection Events

Events for monitoring SIP/WebRTC connection state (Integrated Softphone mode only):

- `rc-ev-sipRegistered` - SIP successfully registered
- `rc-ev-sipUnregistered` - SIP disconnected/unregistered
- `rc-ev-sipUnstable` - SIP connection unstable/attempting reconnection
- `rc-ev-sipFailed` - SIP registration failed

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-sipRegistered') {
      console.log('SIP registered successfully');
    }
    if (data.payload.type === 'rc-ev-sipUnregistered') {
      console.log('SIP unregistered/disconnected');
    }
    if (data.payload.type === 'rc-ev-sipUnstable') {
      console.log('SIP connection unstable');
    }
    if (data.payload.type === 'rc-ev-sipFailed') {
      console.log('SIP registration failed');
    }
  }
});
```

## Lead events

For preview dial mode:

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === "MessageTransport-push") {
    if (data.payload.type === 'rc-ev-loadLeads') {
      // agent fetch leads
      console.log(data.payload.leads);
    }
    if (data.payload.type === 'rc-ev-callLead') {
      // agent call lead
      console.log(data.payload.lead);
      console.log(data.payload.destination); // phone number
    }
    if (data.payload.type === 'rc-ev-manualPassLead') {
      // agent pass lead manually
      console.log(data.payload.lead);
      console.log(data.payload.dispositionId);
      console.log(data.payload.notes);
      console.log(data.payload.callback); // if need to call back
      console.log(data.payload.callbackTime); // call back time
    }
  }
});
```

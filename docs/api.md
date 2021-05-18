# API

`RCAdapter` is a global object provided by [Adapter JS](get-started.md#adapter-js-way.md). You can use functions from `RCAdapter` to interact with the widget. For using `postMessage` to implement the API, please go to [here](message-transport.md).

### Create a new Call

Init a call with phone number

```js
RCAdapter.clickToDial(phoneNumber)
```

### Register a logger and contact matcher service

```js
var registered = false;
window.addEventListener('message', function(event) {
  var message = event.data;
  if (!registered && message && message.type === 'rc-ev-init') {
    registered = true;
    RCAdapter.registerService({
      name: 'TestService',
      callLoggerEnabled: true,
      contactMatcherEnabled: true, // match contact with phone number
      callLogMatcherEnabled: true, // match call log entity with call id
    });
    RCAdapter.transport.addListeners({
      push: function (data) { // listen push event from rc widget
        // new call event
        if (data.type === 'rc-ev-newCall') {
          console.log('new call:', data.call);
        }
        if (data.type === 'rc-ev-ringCall') {
          console.log('ringing call:', data.call);
        }
      },
      request: function (req) { // listen request event from rc widget
        var payload = req.payload;
        // handle log request
        if (payload.requestType === 'rc-ev-logCall') {
          console.log('logCall:', payload.data);
          RCAdapter.transport.response({
            requestId: req.requestId,
            result: 'ok',
          });
          return;
        }
        // handle match contacts request
        if (payload.requestType === 'rc-ev-matchContacts') {
          var queries = payload.data;
          console.log('matchContacts:', queries);
          var contactMapping = {};
          queries.forEach(function (query) {
            contactMapping[query.phoneNumber] = [{
              id: query.phoneNumber,
              type: 'TestService',
              name: 'Test User ' + query.phoneNumber,
              phoneNumbers: [{
                phoneNumber: query.phoneNumber,
                phoneType: 'direct',
              }]
            }]; // Array
          });
          RCAdapter.transport.response({
            requestId: req.requestId,
            result: contactMapping,
          });
          return;
        }
        if (payload.requestType === 'rc-ev-matchCallLogs') {
          var queries = payload.data;
          console.log('matchCallLogs:', queries);
          var callLogMapping = {};
          // match the logged call entity
          callLogMapping[queries[0]] = [{
            id: your_logged_call_entity_id, // logged call entity id
          }];
          RCAdapter.transport.response({
            requestId: req.requestId,
            result: callLogMapping,
          });
          return;
        }
      }
    });
  }
});
```

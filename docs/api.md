# API

`RCAdapter` is a global object provided by [Adapter JS](get-started.md#adapter-js-way.md). You can use functions from `RCAdapter` to interact with the widget. For using `postMessage` to implement the API, please go to [here](message-transport.md).

### Create a new Call

Init a call with phone number

```js
RCAdapter.clickToDial(phoneNumber);
```

### Logout

```js
RCAdapter.logout();
```

### Register a logger and contact matcher service

Supported feature:

1. Call logger: used to log calls to your CRM/platform
2. Contact matcher: used to show your CRM/platform contact name in the widget
3. Lead viewer (for preview mode): Add a "View lead" button in lead item. Used to open lead page in your CRM/platform

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
      leadViewerEnabled: true, // add "view lead" button
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
        // lead events
        if (data.type === 'rc-ev-loadLeads') {
          // agent fetch leads event
          console.log(data.leads);
        }
        if (data.type === 'rc-ev-callLead') {
          // agent call lead event
          console.log(data.lead);
          console.log(data.destination); // phone number
        }
        if (data.type === 'rc-ev-manualPassLead') {
          // agent pass lead event
          console.log(data.lead);
          console.log(data.dispositionId);
          console.log(data.notes);
          console.log(data.callback); // if need to call back
          console.log(data.callbackTime); // call back time
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
        if (payload.requestType === 'rc-ev-viewLead') {
          var lead = payload.data;
          console.log('agent want to view lead: ', lead);
          RCAdapter.transport.response({
            requestId: req.requestId,
            result: 'ok',
          });
          return;
        }
      }
    });
  }
});
```

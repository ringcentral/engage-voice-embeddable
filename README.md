# Engage Voice Embeddable (Beta)

## Introduction

This is an out-of-the-box embeddable web application that help developers to integrate RingCentral Engage Voice services to their web applications with few code.

## Visit Online

Visit [website](https://ringcentral.github.io/engage-voice-embeddable/) in GitHub pages.

![demo](https://user-images.githubusercontent.com/7036536/80361025-d2c67880-88b2-11ea-9f46-d99303efb46d.png)

## Inject

```html
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

## API

### Create a new Call

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
      contactMatcherEnabled: true,
    });
    RCAdapter.transport.addListeners({
      push: function (data) { // listen push event from rc widget
        // new call event
        if (data.type === 'rc-ev-newCall') {
          console.log('new call:', data.call);
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
      }
    });
  }
});
```

## Awesome Embeddable projects

* RingCentral Engage Voice Embeddable phone for Hubspot CRM - [repo](https://github.com/ringcentral/hubspot-embeddable-engage-phone)

## Contribution and Development

### Clone the code

```
$ git clone https://github.com/ringcentral/engage-voice-embeddable.git
```

### Create a free RingCentral app

1. Create a [RingCentral developer free account](https://developer.ringcentral.com)
2. Create a RingCentral app with platform type - "Browser Based"
3. Add permissions `Read Accounts` and `Webhook Subscription` to your app.
4. Add redirect uri `http://localhost:8080/redirect.html` to your app settings.

### Create environment variables file in project root path

Create `.env` file in project root path:

```
RINGCENTRAL_CLIENT_ID=your_ringcentral_app_client_id
RINGCENTRAL_CLIENT_SECRET=your_ringcentral_app_client_secret
RINGCENTRAL_SERVER=https://platform.ringcentral.com

AUTH_REDIRECT_URI=http://localhost:8080/redirect.html
AUTH_PROXY_URI=http://localhost:8080/proxy.html

ENGAGE_VOICE_AUTH_SERVER=https://engage.ringcentral.com
```

### Start development server

We assume you have pre-installed node.js >= 10 and yarn. 

**It is recommended to use `yarn` instead of `npm`.** We have `yarn.lock` file in source code to lock dependence version. With `yarn`, we can install dependencies with correct version that work well with this project.

```bash
$ yarn       # use yarn to install dependencies
$ yarn start # start a webpack dev server
```

Open site: 'http://localhost:8080/' on browser

## TODO

- [ ] WebRTC support
- [ ] CI build
- [ ] IVR
- [ ] Docs

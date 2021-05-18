# Engage Voice Embeddable (Beta)

[![Build Status](https://github.com/ringcentral/engage-voice-embeddable/workflows/Deploy/badge.svg?branch=master)](https://github.com/ringcentral/engage-voice-embeddable/actions)

## Introduction

This is an out-of-the-box embeddable web application that help developers to integrate [RingCentral Engage Voice](https://www.ringcentral.com/engage/engage-voice.html) services to their web applications with few code.

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

## Documents

* [Get Started](docs/get-started.md)
* [Customize Client ID and environment](docs/customize-client-id.md)
* [Customize Redirect Uri](docs/customize-redirect-uri.md)
* [Customize Authorization](docs/customize-authorization.md)
* [API](docs/api.md)
* [Message Transport](docs/message-transport.md)
* [Call Events](docs/call-events.md)

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
RINGCENTRAL_SERVER=https://platform.ringcentral.com

ENGAGE_VOICE_AUTH_SERVER=https://engage.ringcentral.com
```
**Notice**: Now the Engage Voice service only is supported on production environment. Please make sure your key is graduated into RingCentral production environment.

### Start development server

We assume you have pre-installed node.js >= 10 and yarn. 

**It is recommended to use `yarn` instead of `npm`.** We have `yarn.lock` file in source code to lock dependence version. With `yarn`, we can install dependencies with correct version that work well with this project.

```bash
$ yarn       # use yarn to install dependencies
$ yarn start # start a webpack dev server
```

Open site: 'http://localhost:8080/' on browser

### Deploy on production

If you create pull request to this repository and get merged, CI will deploy it to this repository's github page automatically. But for something that customized, you can deploy it to your own web space, such as your github page.

1. Update `.env` file in production environment
2. Run command to compile code and build release

```
$ yarn build --hosting-url your_host_url
```

Please replace `your_host_uri` with your own web host address, such as `https://ringcentral.github.io/engage-voice-embeddable`.

3. Upload all files in `build/rc` folder to your web space. And visit it in browser.

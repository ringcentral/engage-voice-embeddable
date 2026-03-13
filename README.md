# RingCX Embeddable 1.0 (BETA)

[![Build Status](https://github.com/ringcentral/engage-voice-embeddable/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/ringcentral/engage-voice-embeddable/actions)

## Introduction

This is an out-of-the-box embeddable web application that help developers to integrate [RingCentral RingCX](https://www.ringcentral.com/ringcx.html) services to their web applications with few code.

## Visit Online

Visit [website](https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/index.html) and login with RingCX account to get online demo.

![demo](https://github.com/user-attachments/assets/10e439f1-a3ee-43c0-b9e8-07beb7b99eb5)

## Inject

```html
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js";
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
* [Popup a standalone widget](docs/popup-window.md)

## Supported features

* Agent states
* Voice queues
* Dial modes
  - Manual
  - Predictive dial mode
  - Preview dial mode
* Call disposition
  - Notes
  - Disposition
  - AI Summary

## Unsupported features:

* Dial modes:
  - Preview dial mode with search
  - HCI dialing
  - Progressive dial mode
* Agent scripts

## Contribution and Development

### Clone the code

```
$ git clone https://github.com/ringcentral/engage-voice-embeddable.git
```

### Create a free RingCentral app

1. Create a [RingCentral developer free account](https://developer.ringcentral.com)
2. Create a RingCentral app with platform type - "Browser Based"
3. Add permissions `Read Accounts` to your app.
4. Add redirect uri `http://localhost:8080/redirect.html` to your app settings.

### Create environment variables file in project root path

Create `.env` file in project root path:

```
RINGCENTRAL_CLIENT_ID=your_ringcentral_app_client_id
RINGCENTRAL_SERVER=https://platform.ringcentral.com

ENGAGE_VOICE_AUTH_SERVER=https://engage.ringcentral.com
```
**Notice**: Now the RingCX service only is supported on production environment. Please make sure your key is graduated into RingCentral production environment.

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
$ HOSTING_URL=your_host_url yarn build
```

Please replace `your_host_uri` with your own web host address, such as `https://ringcentral.github.io/engage-voice-embeddable`.

3. Upload all files in `build/rc` folder to your web space. And visit it in browser.
4. Add redirect uri `${your_host_url}/redirect.html` to your RingCentral client ID in RingCentral developers portal

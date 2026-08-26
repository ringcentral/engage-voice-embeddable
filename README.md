# RingCX Embeddable 1.0 (BETA)

[![Build Status](https://github.com/ringcentral/engage-voice-embeddable/actions/workflows/ci.yml/badge.svg?branch=next)](https://github.com/ringcentral/engage-voice-embeddable/actions)

> **This is a beta release.** We welcome your feedback and bug reports — please feel free to [open an issue](https://github.com/ringcentral/engage-voice-embeddable/issues).

> **Looking for the 0.x beta version?** Please visit the [legacy branch](https://github.com/ringcentral/engage-voice-embeddable/tree/master) and its [demo](https://ringcentral.github.io/engage-voice-embeddable/).

> **Upgrading from 0.x?** See the [migration guide](docs/migration-from-0.x.md).

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

* [Migrating from 0.x (Legacy) to 1.0 (Beta)](docs/migration-from-0.x.md)
* [Get Started](docs/get-started.md)
* [Customize Client ID and environment](docs/customize-client-id.md)
* [Customize Redirect Uri](docs/customize-redirect-uri.md)
* [Customize Authorization](docs/customize-authorization.md)
* [API](docs/api.md)
* [Message Transport](docs/message-transport.md)
* [Call Events](docs/call-events.md)
* [Side Widget](docs/side-widget.md)
* [Agent Script](docs/agent-script.md)
* [Initialize Audio](docs/initialize-audio.md)
* [Popup a standalone widget](docs/popup-window.md)

## Supported features

* Agent states
* Voice queues
* Dial modes
  - Manual
  - Predictive dial mode
  - Preview dial mode
* Corporate directory search for dialing
* Call disposition
  - Notes
  - Disposition
  - AI Summary
* Agent scripts (opt-in, see [Agent Script](docs/agent-script.md))

## Unsupported features:

* Dial modes:
  - Preview dial mode with search
  - HCI dialing
  - Progressive dial mode

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

We assume you have pre-installed node.js >= 20 and npm.

We have a `package-lock.json` file in source code to lock dependency versions. Use `npm ci` to install dependencies with the exact locked versions that work well with this project.

```bash
$ npm ci      # install dependencies with locked versions
$ npm start   # start a webpack dev server
```

Open site: 'http://localhost:8080/' on browser

### Deploy on production

If you create pull request to this repository and get merged, CI will deploy it to this repository's github page automatically. But for something that customized, you can deploy it to your own web space, such as your github page.

1. Update `.env` file in production environment
2. Run command to compile code and build release

```
$ HOSTING_URL=your_host_url npm run build
```

Please replace `your_host_uri` with your own web host address, such as `https://ringcentral.github.io/engage-voice-embeddable`.

3. Upload all files in `build/rc` folder to your web space. And visit it in browser.
4. Add redirect uri `${your_host_url}/redirect.html` to your RingCentral client ID in RingCentral developers portal

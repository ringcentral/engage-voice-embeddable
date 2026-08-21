# Migrating from 0.x (Legacy) to 1.0 (Beta)

RingCX Embeddable `1.0` is a full rewrite of the `0.x` beta. The widget has been
rebuilt on RingCentral's next-generation [Spring UI](https://www.npmjs.com/package/@ringcentral/spring-ui)
design system and a new module architecture. For most integrations the migration
is small, because the public integration surface (`RCAdapter`, the `postMessage`
transport, message types, and the iframe element id) stays **backward
compatible**.

In most cases the only **required** change is updating the hosting URL of the
adapter script / iframe.

## What changed at a glance

| | 0.x (Legacy) | 1.0 (Beta) |
| --- | --- | --- |
| Source branch | [`master`](https://github.com/ringcentral/engage-voice-embeddable/tree/master) | [`1.x`](https://github.com/ringcentral/engage-voice-embeddable/tree/1.x) |
| Demo / hosting URL | `https://ringcentral.github.io/engage-voice-embeddable/` | `https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/` |
| UI design system | Juno | Spring UI (new look & feel) |
| `RCAdapter` API | `clickToDial`, `dialLead`, `logout`, `registerService`, `transport` | Same (no change) |
| Message types | `rc-ev-*`, `MessageTransport-*` | Same (no change) |
| Iframe element id | `engage-voice-embeddable-adapter-frame` | Same (no change) |
| Call disposition | Notes, Disposition | Notes, Disposition, **AI Summary** |

## Step 1: Update the hosting URL (required)

The widget moved from GitHub Pages to RingCentral's CDN. Replace the old URL with
the new one everywhere you reference `adapter.js`, `app.html`, `popup.html`, or
`redirect.html`.

**Adapter JS way**

Before (0.x):

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

After (1.0):

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

**Iframe way**

Before (0.x):

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://ringcentral.github.io/engage-voice-embeddable/app.html">
</iframe>
```

After (1.0):

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html">
</iframe>
```

> The iframe element id (`engage-voice-embeddable-adapter-frame`) is unchanged, so
> any `postMessage` code that targets it keeps working without modification.

## Step 2: Update your redirect URI (only if you use your own client id)

If you customize the RingCentral app client id (see
[Customize Client ID](customize-client-id.md)), the default redirect uri also
moved to the new CDN. Add the new redirect uri to your RingCentral app settings
in the [developer portal](https://developer.ringcentral.com):

```
https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/redirect.html
```

You may keep the old redirect uri registered while you transition, then remove it
once all traffic is on 1.0. If you host your own redirect page, no change is
needed — see [Customize Redirect Uri](customize-redirect-uri.md).

## Step 3: Verify your API integration (usually no code change)

The integration API is unchanged between 0.x and 1.0. The following continue to
work as before:

- `RCAdapter.clickToDial(phoneNumber)`
- `RCAdapter.dialLead(lead, destinationE164)`
- `RCAdapter.logout()`
- `RCAdapter.registerService(service)`
- `RCAdapter.transport.addListeners({ push, request })` / `RCAdapter.transport.response(...)`
- All `rc-ev-*` message types and the `MessageTransport-push` / `MessageTransport-request` / `MessageTransport-response` envelopes

See [API](api.md), [Message Transport](message-transport.md), and
[Call Events](call-events.md) for the full reference. No changes are required for
existing call logger, contact matcher, call log matcher, or lead viewer services.

## What's new in 1.0

- **New Spring UI design** — a refreshed, modern look and feel. This is a visual
  change only and does not require any integration changes.
- **Call disposition with AI Summary** — in addition to notes and disposition,
  the widget can now show an AI-generated call summary.
- **Corporate directory search for dialing** — typing a name or number in the
  dialer searches the RingCentral corporate directory, so agents can find a
  colleague and dial their extension directly instead of entering the full
  number.
- **Agent scripts** — the script assigned to a call is rendered in a side panel
  and its answers are saved with the disposition. It is off unless the host opts
  in with `enableAgentScript=1`; see [Agent Script](agent-script.md).
- Ongoing improvements to integrated softphone connection handling. SIP
  connection events (`rc-ev-sipRegistered`, `rc-ev-sipUnregistered`,
  `rc-ev-sipUnstable`, `rc-ev-sipFailed`) are documented in
  [Call Events](call-events.md).

### Still unsupported

The following are still not available in 1.0 (same as 0.x):

- Preview dial mode with search
- HCI dialing
- Progressive dial mode

## If you build from source (self-hosting)

If you forked or built the widget from source rather than embedding the hosted
build, note these project-level changes when moving to the `1.x` branch:

| | 0.x (`master`) | 1.0 (`1.x`) |
| --- | --- | --- |
| Node.js | `>= 10` | `>= 20` |
| Package manager | `yarn` (`yarn.lock`) | `npm` (`package-lock.json`, install with `npm ci`) |
| Start dev server | `yarn start` | `npm start` |
| Production build | `yarn build --hosting-url your_host_url` | `HOSTING_URL=your_host_url npm run build` |
| Build output | `build/rc` | `build/rc` |

See the [README](../README.md#contribution-and-development) for the full
development and deployment instructions.

## Need help?

1.0 is a beta release. If you hit a problem during migration, please
[open an issue](https://github.com/ringcentral/engage-voice-embeddable/issues)
with details about your integration.

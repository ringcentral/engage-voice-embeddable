# Deprecation Notice: RingCX Embeddable

RingCX Embeddable is **deprecated**. RingCX contact center features are now part of [RingCentral Embeddable 3.1.x](https://embeddable.labs.ringcentral.com/3.1.x/), and all new development happens there.

**We recommend migrating your integration to RingCentral Embeddable 3.1.x.**

## Timeline

| Period | Status |
| --- | --- |
| Now – May 31, 2027 | **Maintenance only.** No new features. We still fix bugs. |
| After May 31, 2027 | **End of maintenance.** No more bug fixes or updates. |

## What this means for you

* **No new features.** New RingCX features ship only in RingCentral Embeddable 3.1.x and later.
* **Bug fixes until May 31, 2027.** Until then you can still [report bugs](https://github.com/ringcentral/engage-voice-embeddable/issues), and we will fix them.
* **The hosted widget stays online after May 31, 2027.** Your integration will keep loading from its current URL (for example `https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js`). But we will no longer maintain it, so it may break when RingCX or RingCentral platform services, APIs or browsers change. We will not fix these problems.

To avoid service disruption, finish migrating before May 31, 2027.

## Migrate to RingCentral Embeddable 3.1.x

RingCentral Embeddable 3.1.x supports RingCX (contact center) and RingEX (calls, messages and meetings) in a single widget. It also adds features that RingCX Embeddable doesn't support, such as progressive dial mode.

Main steps:

1. Replace the RingCX Embeddable adapter script or iframe with RingCentral Embeddable 3.1.x, and add `enableRingCX=1` to the widget URL to turn on the RingCX Agent tab.
2. Replace the RingCX Embeddable `rc-ev-*` events and commands with the RingCentral Embeddable `rc-*` protocol.
3. Use `call.source` to identify RingCX calls, and review the call logging and contact matching requirements.
4. Test the integration against the released 3.1.x build before switching your users.

For the full event and API mapping, see the official [RingCX integration and migration guide](https://embeddable.labs.ringcentral.com/integration/ringcx/#migrating-from-the-standalone-ringcx-embeddable). For a feature comparison, see [Differences between RingCentral Embeddable and RingCX Embeddable](differences-with-rc-embeddable.md).

## Still on 0.x?

Don't upgrade to RingCX Embeddable 1.0. Migrate from 0.x directly to RingCentral Embeddable 3.1.x. The 0.x version gets no maintenance.

## Need help?

* RingCentral Embeddable 3.1.x documentation: <https://embeddable.labs.ringcentral.com/3.1.x/>
* RingCentral Embeddable issues: <https://github.com/ringcentral/ringcentral-embeddable/issues>
* RingCX Embeddable bug reports (until May 31, 2027): <https://github.com/ringcentral/engage-voice-embeddable/issues>

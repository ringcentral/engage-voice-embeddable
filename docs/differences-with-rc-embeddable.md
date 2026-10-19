# Differences between RingCentral Embeddable and RingCX Embeddable

[RingCentral Embeddable 3.1](https://embeddable.labs.ringcentral.com/3.1.x/) supports both [RingEX](https://www.ringcentral.com/ringex.html) (calls, messages and meetings) and [RingCX](https://www.ringcentral.com/ringcx.html) (contact center). Standalone RingCX Embeddable focuses on RingCX.

**Developers using standalone RingCX Embeddable are recommended to migrate to RingCentral Embeddable 3.1.** The 3.1 build is released as a beta and adds RingCX support alongside RingEX, including progressive dial mode. Review the [RingCX integration and migration guide](https://embeddable.labs.ringcentral.com/integration/ringcx/#migrating-from-the-standalone-ringcx-embeddable) when migrating an existing integration.

## Features in standalone RingCX Embeddable

These contact center features are also available through RingCX support in RingCentral Embeddable 3.1; they are no longer exclusive to the standalone widget.

* Agent states
* Voice queues
* Outbound campaigns with predictive and preview dial modes
* Agent scripts (opt-in, see [Agent Script](agent-script.md))

Standalone RingCX Embeddable still does not support preview dial mode with search, HCI dialing, or progressive dial mode. See the [supported and unsupported features](../README.md#supported-features). Progressive dial mode is available in RingCentral Embeddable 3.1.

## Features in RingCentral Embeddable 3.1

In addition to RingCX contact center features, RingCentral Embeddable provides RingEX features:

* Presence
* Call queues
* Three-way calling
* Messages
* Video meetings
* Multiple devices (Ring Groups, for RingEX)

For RingCX, 3.1 provides an Agent tab for agent sessions, states, queues and dial groups, call handling, dispositions, preview leads, call history, and optional agent scripts. It also supports progressive dial mode.

## Migration considerations

* Enable RingCX by adding `enableRingCX=1` to the 3.1 widget URL. The Agent tab requires a RingCX account and reuses the RingCentral login.
* Update standalone `rc-ev-*` events and commands to the RingCentral Embeddable `rc-*` protocol using the [migration mapping](https://embeddable.labs.ringcentral.com/integration/ringcx/#migrating-from-the-standalone-ringcx-embeddable).
* RingEX and RingCX calls share the same integration APIs in 3.1. Use `call.source` to identify RingCX calls and review the guide's call logging and contact matching requirements.
* Review the [3.1 setup and known limitations](https://embeddable.labs.ringcentral.com/3.1.x/) and verify your integration against the released build before switching.

## Verification

The standalone dial-mode limitations are documented in the [migration guide](migration-from-0.x.md#still-unsupported). RingCentral Embeddable 3.1 setup and protocol changes are documented in the official references below. Validate progressive dialing with a RingCX dial group configured for progressive mode in the released 3.1 build.

# Citations

* [RingCentral Embeddable 3.1 overview](https://embeddable.labs.ringcentral.com/3.1.x/)
* [RingCX integration and migration guide](https://embeddable.labs.ringcentral.com/integration/ringcx/)

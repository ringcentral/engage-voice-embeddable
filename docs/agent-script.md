# Agent Script

The Agent Script panel renders the RingCX script assigned to the call the agent
is working on, and saves the answers back with the call disposition.

The feature is **off by default**. Turn it on with the `enableAgentScript`
parameter.

## Adapter JS way

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js?enableAgentScript=1";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

## Iframe way

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html?enableAgentScript=1">
</iframe>
```

## What the agent sees

With the parameter set, the panel appears once the agent answers a call whose
campaign has a script assigned to it. A call with no script shows nothing, so
enabling the parameter is safe for an account that only uses scripts on some
campaigns.

The panel is hosted in the [side widget](side-widget.md), which lays itself out
beside the app when there is room for it and as an overlay when there is not.
Read that document for how to give the widget the wider frame, and for the
`rc-ev-sideWidgetOpenNotify` event that tells the host page a panel is waiting.

Answers are kept per call while the agent moves between screens, and are
submitted together with the disposition. Ending the call or logging out clears
them.

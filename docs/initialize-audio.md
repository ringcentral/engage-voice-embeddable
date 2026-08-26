# Initialize Audio

Browsers refuse to play audio until the page has received a user interaction. A
widget that is loaded but never clicked is therefore not allowed to make a
sound, and the ringtone for an incoming call is dropped silently — the agent
sees the call arrive but never hears it.

The feature is **off by default**. Turn it on with the `enableAudioInitPrompt`
parameter, and the widget will offer the agent a way to unlock audio playback
before the first call arrives.

## Adapter JS way

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js?enableAudioInitPrompt=1";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

## Iframe way

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html?enableAudioInitPrompt=1">
</iframe>
```

## What the agent sees

A banner at the top of the widget reading **Audio output is disabled.** with an
**Initialize audio** action. Clicking it plays a short, quiet tone — playing a
sound from inside the click is what actually makes the browser trust the widget
— and the banner goes away once the tone has finished.

If the browser still refuses to play the tone, the banner stays so the agent
knows audio is not working yet.

The banner only appears when all of the following are true, so it never
interrupts a screen where a ringtone could not happen anyway:

* the agent is logged in;
* the session uses the integrated softphone;
* the softphone is registered. While it is still connecting, or after it loses
  its connection, the connectivity banner already occupies the same slot and
  reports the more urgent problem.

Permission to play audio belongs to a single browser tab, and browsers drop it
on reload. The banner is therefore per tab: unlocking audio in one tab does not
unlock it in another, and it reappears after the page is reloaded until the
agent uses it again.

Enabling the parameter is safe for an account that does not use the integrated
softphone, since the banner never appears for those sessions.

# Using your own RingCentral app client id

Developers can config this widget to use their own RingCentral app client id.

1. Create a [RingCentral developer free account](https://developer.ringcentral.com)
2. Create a RingCentral app with platform type - "Browser Based"
3. And add permissions `Read Accounts` and `Webhook Subscriptions` to your app.
4. Add redirect uri `https://ringcentral.github.io/engage-voice-embeddable/redirect.html` to your app settings.

## Adapter JS way

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js?clientId=ringcentral_client_id&rcServer=https://platform.ringcentral.com&evServer=https://engage.ringcentral.com";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

`rcServer` and `evServer` is used to set environment. But we only support Engage Voice in production environment now. They are optional.

## Iframe way

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://ringcentral.github.io/engage-voice-embeddable/app.html?clientId=ringcentral_client_id&rcServer=https://platform.ringcentral.com&evServer=https://engage.ringcentral.com">
</iframe>
```

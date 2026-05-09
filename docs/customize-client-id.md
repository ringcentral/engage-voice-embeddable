# Using your own RingCentral app client id

Developers can config this widget to use their own RingCentral app client id.

1. Create a [RingCentral developer free account](https://developer.ringcentral.com)
2. Create a RingCentral app with platform type - "Browser Based"
3. And add permissions `Read Accounts` to your app.
4. Add redirect uri `https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/redirect.html` to your app settings.

## Adapter JS way

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js?clientId=ringcentral_client_id&rcServer=https://platform.ringcentral.com&evServer=https://engage.ringcentral.com";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

`rcServer` and `evServer` is used to set environment. But we only support RingCX in production environment now. They are optional.

## Iframe way

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html?clientId=ringcentral_client_id&rcServer=https://platform.ringcentral.com&evServer=https://engage.ringcentral.com">
</iframe>
```

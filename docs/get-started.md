# Get Started

> [!WARNING]
> **RingCX Embeddable is deprecated.** For new integrations, use [RingCentral Embeddable 3.1.x](https://embeddable.labs.ringcentral.com/3.1.x/) instead. RingCX Embeddable gets bug fixes only until May 31, 2027. See the [deprecation notice](deprecation.md).

there are two ways to integrate this widget to a web application:

## Adapter JS way

Just add following the following code to a website's header. It will create a widget in your website.

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

## Iframe way

Create a iframe with the following code:

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html">
</iframe>
```

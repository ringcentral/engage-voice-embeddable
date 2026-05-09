# Get Started

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

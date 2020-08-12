# Get Started

there are two ways to integrate this widget to a web application:

## Adapter JS way

Just add following the following code to a website's header. It will create a widget in your website.

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

## Iframe way

Create a iframe with the following code:

```html
<iframe width="300" height="500" id="engage-voice-embeddable-adapter-frame" allow="microphone" src="https://ringcentral.github.io/engage-voice-embeddable/app.html">
</iframe>
```

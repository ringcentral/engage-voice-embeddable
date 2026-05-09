# Customize Redirect Uri

In authorization flow, it will require a valid redirect uri that developer set in developers account. This app offers a default redirect uri option that you can use, https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/redirect.html. And it also supports to config redirect uri.

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/adapter.js?redirectUri=your_redirect_uri";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

Or

```html
<iframe width="300" height="500" id="rc-widget" src="https://cdn.labs.ringcentral.com/ringcx-embeddable/1.0.0/app.html?redirectUri=your_redirect_uri">
</iframe>
```

In your redirect page, it is required add following code to pass auth callback params to this app.

```html
<script>
  // the origin is used for postMessage
  var origin = 'https://ringcentral.github.io'; // origin where the widget is deployed.
  if (window.opener) {
    // pass callbackUri to widget
    window.opener.postMessage({
      callbackUri: window.location.href,
    }, origin);
  }
</script>
```

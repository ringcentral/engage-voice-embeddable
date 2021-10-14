# Popup the widget in a standalone window

Support to open the widget in a popup window, so the widget is opened at a standalone window. User can close web page that embed the widget, and call will not be ended, and still active at popup window.

### To enable this feature:

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js?enablePopup=1";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

After enabled, user will get a popup button at header:

![popup-icon](https://user-images.githubusercontent.com/7036536/137277302-15a58138-61df-4302-805f-8dc9df970c46.png)


### Known issues:

* App can't make a opened popup window into desktop top (Browser limitation)
* App can't open popup window when user have a active call (or call will be disconnected)
* User need to focus at popup window when start or answer a call at popup window for microphone permission at Firefox


## Host the popup window

For some reason, developers need to host [the popup HTML file](https://github.com/ringcentral/engage-voice-embeddable/blob/master/src/popup.html) by themselves. It is required to host [the popup HTML file](https://github.com/ringcentral/engage-voice-embeddable/blob/master/src/popup.html) in your domain, and add your script inside the HTML file. It can be used for resolving cross-origin domain issue.

In this case, we can config the popup button to open your own popup HTML file URI:

```js
<script>
  (function() {
    var rcs = document.createElement("script");
    rcs.src = "https://ringcentral.github.io/engage-voice-embeddable/adapter.js?enablePopup=1&popupPageUri=your_popup_html_file_uri";
    var rcs0 = document.getElementsByTagName("script")[0];
    rcs0.parentNode.insertBefore(rcs, rcs0);
  })();
</script>
```

The HTML file need to be based on code of this [file](https://github.com/ringcentral/engage-voice-embeddable/blob/master/src/popup.html). Then update the `adapter.js` src into absolute address in the file:

```html
<script src="https://ringcentral.github.io/engage-voice-embeddable/adapter.js"></script>
```

Then add your own script in the file.

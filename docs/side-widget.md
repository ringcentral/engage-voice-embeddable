# Side Widget

The side widget hosts the Agent Script panel for the call being worked on. It
has two layouts:

* **Side by side** - the widget sits beside the main 300px column and the widget
  asks the host page to grow the frame to 660px. This needs the host to actually
  honour that width.
* **Overlay** - the widget covers the app. Used when there is no room for the
  side-by-side layout, so the widget is never rendered into a strip the agent
  cannot see.

By default the widget picks the layout by measuring its own usable viewport, so
an embedding that already gives it 600px or more gets the side-by-side layout
with no extra work.

That measurement alone cannot start the frame growing, though: the widget only
asks for the wider frame once it has decided to lay itself out side by side. Tell
it your page honours the request with the `enableSideWidget` parameter, and it
will go straight to the side-by-side layout and open the widget automatically.

```html
<script src=".../adapter.js?enableSideWidget=1"></script>
```

The parameter is forwarded to the app frame, so an iframe embedding can set it on
the app URL directly. The popped-out window ignores it: its host adapter honours
the wider frame, but the window itself stays narrow and clips the overflow with
no scrollbar.

A host that decides at runtime uses `rc-ev-setSideWidgetExtended` below, which
overrides both the parameter and the measurement.

In the overlay case the widget is **registered but not shown**: an overlay
covering the call screen unasked is worse than a hint, so the agent opens it from
the toggle button in the call screen header, whose tooltip names what is waiting
(`Show Agent Script`).

## Widget availability notification

Sent by the widget whenever a side widget becomes available for the current call
or goes away.

```js
window.addEventListener('message', (e) => {
  const data = e.data;
  if (data.type === 'MessageTransport-push') {
    if (data.payload.type === 'rc-ev-sideWidgetOpenNotify') {
      console.log(data.payload.open);    // a side widget exists for this call
      console.log(data.payload.visible); // and is currently on screen
    }
  }
});
```

`open` is the cue to make room: it is `true` as soon as a widget exists, whether
or not it is on screen. `visible` is `false` while the widget is registered but
waiting for the agent to open it, which is what happens when there is no room for
the side-by-side layout.

## Forcing the layout

A host that can grow its container - typically after seeing `open: true` above -
tells the widget so, and the widget switches to the side-by-side layout and opens
a widget that was only waiting for the room. Use this when support depends on
something only known at runtime; otherwise `enableSideWidget` above is simpler.

```js
sendMessageToWidget({
  type: 'rc-ev-setSideWidgetExtended',
  extended: true,
});
```

Pass `extended: false` to force the overlay layout regardless of frame width, or
`null` to drop the override and go back to the widget's own measurement.

`sendMessageToWidget` is defined in [Message Transport](message-transport.md);
the message must be wrapped in the `MessageTransport-push` envelope like every
other message to the widget.

A widget the agent has explicitly closed is never reopened by this message - only
one that was held back for lack of room.

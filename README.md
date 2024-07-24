# magma
🌡️ Record and analyze user activity during UX tests

## Get started

### Recording

To record activity, first install javascript library to your HTML application and initialize user interface.
```html
<script src="magma.js"></script>
<script>magma_display_build();</script>
```

To avoid user interface, you can start and stop programmatically the recording.
```js
// Start capture
magma_capture_start();

// Stop capture
magma_capture_stop();
```

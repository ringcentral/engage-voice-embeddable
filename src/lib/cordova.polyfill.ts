document.addEventListener('deviceready', function () {
  // Just for iOS devices.
  const isIOS = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) > -1;
  if (isIOS && typeof window.cordova !== 'undefined') {
    if (typeof window.cordova.plugins.iosrtc !== 'undefined') {
      window.cordova.plugins.iosrtc.registerGlobals();
    }
  }
});

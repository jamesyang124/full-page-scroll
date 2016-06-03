// IE 9+
// Chrome v
// Firefox v

(function(global, factory) {
  // validate global object, inject it to factory if it is feasible.

  // Polyfill CustomEvent constructor from:
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  (function () {
    if ( typeof global.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = global.document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = global.Event.prototype;
    global.CustomEvent = CustomEvent;
  })();

  try {
    if (!global.document) throw "This plugin requires browser environment.";

    // run when document ready
    if (global.document.readyState != 'loading')
      factory(global, true)();
    else
      document.addEventListener('DOMContentLoaded', factory(global, true));
  } catch(e) {
    console.log("Loading Error: ", e);
  }

})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {

  // https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js
  // Can't be in strict mode, several libs including ASP.NET trace
  // the stack via arguments.caller.callee and Firefox dies if
  // you try to trace through "use strict" call chains. (#13335)
  //"use strict";

  var version = "1.0.0";
  var document = window.document;
  var fpScroll = function(){
    var setTimeoutIds = [];
    var lastYPos = document.body.scrollTop;

    function scrollDefault(event) {
      // clear previous fired event
      setTimeoutIds.forEach(function (e, i, ary) { clearTimeout(e); });
      setTimeoutIds.length = 0;

      if (lastYPos > document.body.scrollTop)
        return (lastYPos = document.body.scrollTop);
      else
        lastYPos = document.body.scrollTop;

      var heightDiff = document.body.scrollTop % window.innerHeight;
      // assume if user scroll over 40% of the window inner height,
      // we do full page scroll -> scroll rest of the page for user.
      // also need to clean unused fullPageScroll
      if (heightDiff === 0 || heightDiff < window.innerHeight * 0.1) return;

      // asynced fired fullpageScroll
      var setTimeoutId = setTimeout(function () {
        window.dispatchEvent(new window.CustomEvent("fullPageScroll"));
      }, 150);

      setTimeoutIds.push(setTimeoutId);
    }

    window.addEventListener("fullPageScroll", function (e) {
      var currentYPos = document.body.scrollTop;
      var divider = parseInt(currentYPos / window.innerHeight);
      var expectedYPos = (++divider) * window.innerHeight;

      if (expectedYPos >= document.body.scrollHeight)
        expectedYPos = expectedYPos - window.innerHeight;

      // this will trigger scroll event as well
      // smooth the scrolling behavior
      document.body.scrollTop = expectedYPos;
    });

    window.addEventListener("scroll", scrollDefault);
  };

  // Handle confliction, global injection
  var _old = window.fpScroll;

  fpScroll.nonConflict = function(mode) {
    window.fpScroll = (mdoe === true) ? _old : fpScroll;

    // return fpScroll so it can be accessible.
    return fpScroll;
  }

  // default override global fpScroll variable.
  if (!noGlobal)
    window.fpScroll = fpScroll;

  return fpScroll;
});

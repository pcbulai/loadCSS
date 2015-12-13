/*!
loadCSS: load a CSS file asynchronously -- on steroids now
[c]2015 @pcbulai, ZSYS. Originally forked from @scottjehl, Filament Group, Inc.
Licensed MIT
*/
(function(w) {
  'use strict';

  function loadCSS(href, options) {
    var doc = w.document,
      style = doc.createElement('link'),
      refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes,
      sheets = doc.styleSheets;
    // Arguments explained:
    // `href` [REQUIRED] is the URL for your CSS file.
    // `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
    // By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
    // `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'
    var opts = {
      rel: (options && options.rel) ? options.rel : 'stylesheet',
      type: (options && options.type) ? options.type : 'text/css',
      media: (options && options.media) ? options.media : 'all',
      before: (options && options.before) ? options.before : refs[refs.length -
        1],
      done: (options && options.done) ? options.done : undefined
    };

    function onloadcssdefined(cb) {
      var resolvedHref = style.href,
        i = sheets.length;
      while (i--) {
        if (sheets[i].href === resolvedHref) {
          return cb();
        }
      }
      setTimeout(function() {
        onloadcssdefined(cb);
      });
    }

    // Defaults for the <link /> element to be created
    style.href = href;
    style.rel = opts.rel;
    style.type = opts.type;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking renderstyle.rel = opts.rel;
    style.media = 'x';

    // Inject link
    /* Note: the ternary preserves the existing behavior of "before" argument,
     * but we could choose to change the argument to "after" in a later release
     * and standardize on ref.nextSibling for all refs.
     *
     * Note: `insertBefore` is used instead of `appendChild`, for safety re:
     * http://www.paulirish.com/2011/surefire-dom-element-insertion/
     */

    opts.before.parentNode.insertBefore(style, (options && options.before ?
      opts.before : opts.before.nextSibling));
    //
    // console.log(opts.before.parentNode);
    /* Once loaded, set link's media back to `all` so that the stylesheet
     * applies once it loads
     */
    style.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(function() {
      style.media = opts.media;

      if (typeof opts.done !== 'undefined') {
        opts.done();
      }
    });

    return style;
  }
  // commonjs
  if (typeof module !== 'undefined') {
    module.exports = loadCSS;
  } else {
    w.loadCSS = loadCSS;
  }
}(typeof global !== 'undefined' ? global : this));


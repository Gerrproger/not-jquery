/*!
 * Not browser
 * @version  v0.9.4
 * @author   Gerrproger
 * Website:  http://gerrproger.github.io/not-jquery
 * Repo:     http://github.com/gerrproger/not-jquery
 * Issues:   http://github.com/gerrproger/not-jquery/issues
 */
(function (root, factory) {
  /*eslint-disable */
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(root, document);
  } else if (typeof define === 'function' && define.amd) {
    define(null, function () {
      factory(root, document);
    });
  } else {
    root.notBrowser = factory(root, document);
  }
})(typeof window !== 'undefined' ? window : this, function (window, document) {
  /*eslint-enable */
  'use strict';

  var notBrowser = function notBrowser() {
    var el = document.createElement('i');
    return (
      !!el &&
      'some' in Array.prototype &&
      'getOwnPropertyNames' in Object &&
      'classList' in el &&
      'querySelectorAll' in el &&
      'textContent' in el &&
      'transition' in el.style
    );
  };
  notBrowser.version = '0.9.4';
  notBrowser.good = notBrowser();

  return notBrowser;
});

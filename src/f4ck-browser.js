/*!
 * F4ck browser
 * @version  v0.1.0
 * @author   Gerrproger
 * Website:  http://gerrproger.github.io/f4ck-jquery
 * Repo:     http://github.com/gerrproger/f4ck-jquery
 * Issues:   http://github.com/gerrproger/f4ck-jquery/issues
 */
;(function (root, factory) {
    "use strict";

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(root, document);
    } else if (typeof define === 'function' && define.amd) {
        define(null, function () {
            factory(root, document);
        });
    } else {
        root.f4Browser = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    "use strict";

    var f4Browser = function f4Browser() {
        var el = document.createElement('i');
        return !!el &&
            ('some' in Array.prototype) &&
            ('getOwnPropertyNames' in Object) &&
            ('classList' in el) &&
            ('querySelectorAll' in el) &&
            ('textContent' in el) &&
            ('transition' in el.style);

    };
    f4Browser.version = '0.1.0';
    f4Browser.good = f4Browser();

    return f4Browser;
}));
/*!
 * F4ck jquery no Ajax
 * @version  v0.7.1
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
        root.f4 = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    "use strict";

    var d = document;
    var f4Browser = window.f4Browser;

    var F4 = function F4(arg) {
        if (f4Browser && !f4Browser.good) {
            return;
        }
        this._addArrayProtos();
        return this.init(arg);
    };
    var f4Proto = F4.prototype;

    f4Proto.init = function (arg) {
        var ret = this.find(arg);

        if (typeof arg === 'function') {
            if (d.readyState === 'complete' || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
                arg.apply(d);
            } else {
                ret.on('DOMContentLoaded', arg);
            }
        }

        return ret;
    };

    f4Proto._addArrayProtos = function () {
        var prototypes = Object.getOwnPropertyNames(Array.prototype);
        each(prototypes, function (i) {
            var name = prototypes[i];
            switch (name) {
                case 'length':
                case 'constructor':
                    break;
                case 'find':
                    f4Proto['findIn'] = Array.prototype[name];
                    break;
                default:
                    f4Proto[name] = Array.prototype[name];
            }
        });
        return this;
    };

    f4Proto._fill = function (els) {
        var res = Object.create(f4Proto);

        els = els.filter(function (item, pos) {
            return els.indexOf(item) === pos;
        });
        els.forEach(function (el, i) {
            res[i] = el;
        });
        res.length = els.length;

        return res;
    };

    f4Proto.find = function (arg) {
        var self = this;
        var elements = [];
        var HTMLDocument = HTMLDocument || Document;
        switch (typeof arg) {
            case 'string':
                query();
                break;
            case 'object':
                if (arg instanceof HTMLElement ||
                    arg instanceof NodeList ||
                    arg instanceof HTMLCollection ||
                    arg instanceof HTMLDocument) {
                    def(arg);
                } else {
                    def(d);
                }
                break;
            default:
                def(d);
        }

        function query() {
            var who = self.length ? self : [d];
            who.forEach(function (el) {
                var res = makeArray(el.querySelectorAll(arg));
                if (res.length) {
                    elements = elements.concat(res);
                }
            });
        }

        function def(el) {
            elements = makeArray(el);
        }

        return this._fill(elements);
    };

    f4Proto.on = function (ev, f, hash) {
        if (undef(hash)) {
            hash = 'default';
        }
        this.forEach(function (el) {
            var evs = el.f4Events;
            if (evs) {
                if (evs[ev]) {
                    if (evs[ev][hash]) {
                        evs[ev][hash].push(f);
                    } else {
                        evs[ev][hash] = [f];
                    }
                } else {
                    evs[ev] = {};
                    evs[ev][hash] = [f];
                }
            } else {
                evs = el.f4Events = {};
                evs[ev] = {};
                evs[ev][hash] = [f];
            }
            el.addEventListener(ev, f);
        });

        return this;
    };

    f4Proto.off = function (ev, hash) {
        var noHash = undef(hash);
        this.forEach(function (el) {
            var evs = el.f4Events;
            if (evs) {
                if (!ev) {
                    if (noHash) {
                        each(evs, function (e) {
                            each(evs[e], function (h) {
                                evs[e][h].forEach(function (f) {
                                    el.removeEventListener(e, f);
                                });
                            });
                        });
                        delete el.f4Events;
                    } else {
                        each(evs, function (e) {
                            if (evs[e][hash]) {
                                evs[e][hash].forEach(function (f) {
                                    el.removeEventListener(e, f);
                                });
                                delete evs[e][hash];
                            }
                        });
                    }
                } else {
                    if (noHash) {
                        if (evs[ev]) {
                            each(evs[ev], function (h) {
                                evs[ev][h].forEach(function (f) {
                                    el.removeEventListener(ev, f);
                                });
                            });
                            delete evs[ev];
                        }
                    } else {
                        if (evs[ev] && evs[ev][hash]) {
                            evs[ev][hash].forEach(function (f) {
                                el.removeEventListener(ev, f);
                            });
                            delete evs[ev][hash];
                        }
                    }
                }
            }
        });

        return this;
    };

    f4Proto.closest = function (arg) {
        var res = [];
        this.forEach(function (el) {
            if (undef(arg) && el.parentElement) {
                res.push(el.parentElement);
            } else {
                while (el = el.parentElement) {
                    el.matches = el.matches || el.msMatchesSelector;
                    if (el.matches(arg)) {
                        res.push(el);
                        break;
                    }
                }
            }
        });

        return this._fill(res);
    };

    f4Proto.remove = function () {
        this.forEach(function (el) {
            el.parentElement.removeChild(el);
        });

        return this;
    };

    f4Proto.html = function (arg) {
        var res = this.map(function (el) {
            if (undef(arg)) {
                return el.innerHTML.trim();
            }
            el.innerHTML = arg;
        });

        return undef(arg) ? arrUnwrap(res) : this;
    };

    f4Proto.text = function (arg) {
        var res = this.map(function (el) {
            if (undef(arg)) {
                return el.textContent.trim();
            }
            el.textContent = arg;
        });

        return undef(arg) ? arrUnwrap(res) : this;
    };

    f4Proto.attr = function (name, val) {
        var res = this.map(function (el) {
            if (undef(val)) {
                if (undef(name)) {
                    var obj = {};
                    makeArray(el.attributes).forEach(function (at) {
                        obj[at.name] = tryParse(at.value);
                    });
                    return obj;
                }
                return tryParse(el.getAttribute(name));
            }
            el.setAttribute(name, val);
        });

        return undef(val) ? arrUnwrap(res) : this;
    };

    f4Proto.data = function (arg) {
        var dat = 'data-';
        if (typeof arg === 'object') {
            each(arg, function (key) {
                this.attr(dat + toDashed(key), arg[key]);
            }.bind(this));
            return this;
        }
        if (!undef(arg)) {
            return this.attr(dat + toDashed(arg));
        }
        var res = this.attr();
        if (res) {
            if (res.length) {
                return res.map(findData);
            }
            return findData(res);
        }
        return res;

        function findData(obj) {
            var data = {};
            each(obj, function (key) {
                if (key.substr(0, 5) === dat) {
                    data[toCamelCased(key.slice(5))] = obj[key];
                }
            });
            return data;
        }
    };

    f4Proto.removeAttr = function (arg) {
        this.forEach(function (el) {
            el.removeAttribute(arg);
        });

        return this;
    };

    f4Proto.removeData = function (arg) {
        arg = 'data-' + toDashed(arg);

        return this.removeAttr(arg);
    };

    f4Proto.addClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            el.classList.add.apply(el.classList, classes);
        });

        return this;
    };

    f4Proto.removeClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            el.classList.remove.apply(el.classList, classes);
        });

        return this;
    };

    f4Proto.toggleClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            makeArray(classes).forEach(function (cl) {
                el.classList.toggle(cl);
            });
        });

        return this;
    };

    f4Proto.hasClass = function (arg) {
        var has = true;
        var notHas = true;
        var res = this.map(function (el) {
            var is = el.classList.contains(arg);
            if (!is) {
                has = is;
            } else {
                notHas = !is;
            }
            return is;
        });

        if (has) {
            return true;
        }
        if (notHas) {
            return false;
        }

        return arrUnwrap(res);
    };

    f4Proto.transitionEnd = function (f, target, propName, pseudoEl) {
        return this.on('transitionend', function (ev) {
            var bf = f.bind(this, ev);
            if ((propName && propName !== ev.propertyName) || (pseudoEl && ('::' + pseudoEl) !== ev.pseudoElement)) {
                return;
            }
            if (target instanceof HTMLElement) {
                if (ev.target === target) {
                    return bf();
                }
                return;
            }
            if (target !== 'all') {
                if (ev.target === this) {
                    return bf();
                }
                return;
            }
            return bf();
        }, 'f4TransitionEnd');
    };


    var Create = function Create() {
        return function init(str) {
            var res = new DOMParser().parseFromString(str, 'text/html');
            return new F4(res.body.children);
        };
    };


    function prettyClass(arg) {
        if (arg.length === 1) {
            return arg[0].split(/\s/g);
        }
        return arg;
    }

    function makeArray(arg) {
        if (undef(arg.length)) {
            arg = [arg];
        }
        return Array.prototype.slice.call(arg);
    }

    function each(obj, f) {
        return Object.keys(obj).forEach(f);
    }

    function undef(arg) {
        return arg === undefined;
    }

    function toDashed(arg) {
        return arg.replace(/([A-Z])/g, function (match) {
            return "-" + match.toLowerCase();
        });
    }

    function toCamelCased(arg) {
        return arg.replace(/-([a-z])/g, function (match) {
            return match[1].toUpperCase();
        });
    }

    function tryParse(arg) {
        try {
            return JSON.parse(arg);
        } catch (e) {
            return arg;
        }
    }

    function arrUnwrap(arr) {
        if (arr.length < 2) {
            return arr[0];
        }
        return arr;
    }


    var f4 = function f4(arg) {
        return new F4(arg);
    };
    f4.create = new Create;
    f4.proto = f4Proto;
    f4.version = '0.7.1';
    f4.noAjax = true;
    if (f4Browser) {
        f4.supported = f4Browser.good;
    }

    return f4;
}));
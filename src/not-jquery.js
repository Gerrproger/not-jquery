/*!
 * Not jquery
 * @version  v0.9.1
 * @author   Gerrproger
 * Website:  http://gerrproger.github.io/not-jquery
 * Repo:     http://github.com/gerrproger/not-jquery
 * Issues:   http://github.com/gerrproger/not-jquery/issues
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
        root.nj = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    "use strict";

    var d = document;
    var notBrowser = window.notBrowser;

    var Nj = function Nj(arg) {
        if (notBrowser && !notBrowser.good) {
            return;
        }
        this._addArrayProtos();
        return this.init(arg);
    };
    var njProto = Nj.prototype;

    njProto.init = function (arg) {
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

    njProto._addArrayProtos = function () {
        var prototypes = Object.getOwnPropertyNames(Array.prototype);
        each(prototypes, function (i) {
            var name = prototypes[i];
            switch (name) {
                case 'length':
                case 'constructor':
                    break;
                case 'find':
                    njProto['findIn'] = Array.prototype[name];
                    break;
                default:
                    njProto[name] = Array.prototype[name];
            }
        });
        return this;
    };

    njProto._fill = function (els) {
        var res = Object.create(njProto);

        els = els.filter(function (item, pos) {
            return els.indexOf(item) === pos;
        });
        els.forEach(function (el, i) {
            res[i] = el;
        });
        res.length = els.length;

        return res;
    };

    njProto.find = function (arg) {
        var self = this;
        var elements = [];
        var HTMLDocument = HTMLDocument || Document;
        switch (typeof arg) {
            case 'string':
                query();
                break;
            case 'object':
                if (arg instanceof HTMLFormElement) {
                    def([arg]);
                }
                else if (arg instanceof HTMLElement ||
                    arg instanceof NodeList ||
                    arg instanceof HTMLCollection ||
                    arg instanceof HTMLDocument) {
                    def(arg);
                }
                else {
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

    njProto.on = function (ev, f, hash) {
        if (undef(hash)) {
            hash = 'default';
        }
        this.forEach(function (el) {
            var evs = el.njEvents;
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
                evs = el.njEvents = {};
                evs[ev] = {};
                evs[ev][hash] = [f];
            }
            el.addEventListener(ev, f);
        });

        return this;
    };

    njProto.off = function (ev, hash) {
        var noHash = undef(hash);
        this.forEach(function (el) {
            var evs = el.njEvents;
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
                        delete el.njEvents;
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

    njProto.closest = function (arg) {
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

    njProto.remove = function () {
        this.forEach(function (el) {
            el.parentElement.removeChild(el);
        });

        return this;
    };

    njProto.html = function (arg) {
        var res = this.map(function (el) {
            if (undef(arg)) {
                return el.innerHTML.trim();
            }
            el.innerHTML = arg;
        });

        return undef(arg) ? arrUnwrap(res) : this;
    };

    njProto.text = function (arg) {
        var res = this.map(function (el) {
            if (undef(arg)) {
                return el.textContent.trim();
            }
            el.textContent = arg;
        });

        return undef(arg) ? arrUnwrap(res) : this;
    };

    njProto.attr = function (name, val) {
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

    njProto.data = function (arg) {
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

    njProto.removeAttr = function (arg) {
        this.forEach(function (el) {
            el.removeAttribute(arg);
        });

        return this;
    };

    njProto.removeData = function (arg) {
        arg = 'data-' + toDashed(arg);

        return this.removeAttr(arg);
    };

    njProto.addClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            makeArray(classes).forEach(function (cl) {
                el.classList.add(cl);
            });
        });

        return this;
    };

    njProto.removeClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            makeArray(classes).forEach(function (cl) {
                el.classList.remove(cl);
            });
        });

        return this;
    };

    njProto.toggleClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            makeArray(classes).forEach(function (cl) {
                el.classList.toggle(cl);
            });
        });

        return this;
    };

    njProto.hasClass = function (arg) {
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

    njProto.transitionEnd = function (f, target, propName, pseudoEl) {
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
        }, 'njTransitionEnd');
    };


    var Create = function Create() {
        return function init(str) {
            var res = new DOMParser().parseFromString(str, 'text/html');
            return new Nj(res.body.children);
        };
    };


    var Ajax = function Ajax() {
        /**
         * @param {object} settings
         * @param {string} settings.url
         * @param {string} settings.method
         * @param {string} settings.user
         * @param {string} settings.password
         * @param {string} settings.body
         * @param {object} settings.form
         * @param {number} settings.timeout
         * @param {object} settings.params
         * @param {object} settings.headers
         * @param {string} settings.dataType (html, json, text, auto)
         * @param {function} settings.beforeSend
         * @param {string} settings.overrideMimeType
         */
        return function init(settings, success, fail) {
            var set = {
                method: (settings.method && settings.method.toUpperCase()) || (settings.form ? 'POST' : 'GET'),
                body: undef(settings.body) ? null : settings.body,
                timeout: settings.timeout || 10000,
                dataType: settings.dataType || 'auto'
            };
            var xhr = new XMLHttpRequest();

            if ((set.method === 'GET' || set.method === 'HEAD') && settings.params) {
                if (settings.url.match(/\?/)) {
                    settings.url += '&';
                } else {
                    settings.url += '?';
                }
                settings.url += Object.keys(settings.params).map(function (key) {
                    return key + '=' + encodeURIComponent(settings.params[key]);
                }).join('&');
            }
            xhr.open(set.method, settings.url, true, settings.user, settings.password);
            xhr.timeout = set.timeout;

            if (settings.form) {
                xhr.setRequestHeader('Content-Type', 'multipart/form-data; charset=UTF-8');
                if (set.body === null) {
                    set.body = new FormData(new Nj(settings.form)[0]);
                }
            }
            else if ((set.method === 'POST' || set.method === 'PUT') && set.body === null && settings.params) {
                xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                set.body = JSON.stringify(settings.params);
            }

            if (settings.headers) {
                each(settings.headers, function (h) {
                    xhr.setRequestHeader(h, settings.headers[h]);
                });
            }
            if (settings.overrideMimeType) {
                xhr.overrideMimeType(settings.overrideMimeType);
            }

            xhr.onload = function () {
                if (xhr.status === 200 && success) {
                    success(xhr, response(xhr));
                } else if (fail) {
                    fail(xhr);
                }
            };
            xhr.onerror = function () {
                if (fail) {
                    fail(xhr);
                }
            };

            if (settings.beforeSend) {
                settings.beforeSend(xhr);
            }
            xhr.send(set.body);

            function response(xhr) {
                var str = xhr.responseText;
                if (set.dataType === 'auto') {
                    var contentType = xhr.getResponseHeader('Content-Type').split(/;/)[0];
                    switch (contentType) {
                        case 'text/html':
                            set.dataType = 'html';
                            break;
                        case 'application/json':
                            set.dataType = 'json';
                            break;
                        case 'text/plain':
                            set.dataType = 'text';
                    }
                }
                switch (set.dataType) {
                    case 'html':
                        return new Create()(str);
                    case 'json':
                        return tryParse(str);
                    case 'text':
                    default:
                        return str;
                }
            }

            return this;
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


    var nj = function nj(arg) {
        return new Nj(arg);
    };
    nj.ajax = new Ajax;
    nj.create = new Create;
    nj.proto = njProto;
    nj.version = '0.9.1';
    if (notBrowser) {
        nj.supported = notBrowser.good;
    }

    return nj;
}));
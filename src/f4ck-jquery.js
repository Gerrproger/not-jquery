/*!
 * F4ck jquery
 * @version  v0.5.0
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
        var res = new Function;
        res.prototype = f4Proto;
        res = new res;

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
                if (arg instanceof HTMLElement || arg instanceof NodeList || arg instanceof HTMLDocument) {
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

    f4Proto.remove = function () {
        this.forEach(function (el) {
            el.parentElement.removeChild(el);
        });

        return this;
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

    f4Proto.hasClass = function (arg) {
        var has = true;
        var res = this.map(function (el) {
            var is = el.classList.contains(arg);
            if (!is) {
                has = is;
            }
            return is;
        });
        if (has) {
            res = has;
        }

        return arrUnwrap(res);
    };

    f4Proto.toggleClass = function (arg) {
        this.forEach(function (el) {
            el.classList.toggle(arg);
        });

        return this;
    };


    var Create = function Create() {
        return function init(str) {
            var res = new DOMParser().parseFromString(str, 'text/html');
            return new F4(res).find('body > *');
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
                method: settings.method.toUpperCase() || 'GET',
                body: undef(settings.body) ? null : settings.body,
                timeout: settings.timeout || 10000,
                dataType: settings.dataType || 'auto'
            };
            var xhr = new XMLHttpRequest();

            if (set.method === 'GET' && settings.params) {
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
                    set.body = new FormData(new F4(settings.form)[0]);
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

            if (settings.beforeSend) {
                settings.beforeSend(xhr);
            }
            xhr.send(set.body);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }

                if (xhr.status === 200 && success) {
                    success(xhr, response(xhr));
                } else if (fail) {
                    fail(xhr);
                }
            };

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
                        return JSON.parse(str);
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


    var f4 = function f4(arg) {
        return new F4(arg);
    };
    f4.ajax = new Ajax;
    f4.create = new Create;
    f4.proto = f4Proto;
    f4.version = '0.5.0';
    if (f4Browser) {
        f4.supported = f4Browser.good;
    }

    return f4;
}));
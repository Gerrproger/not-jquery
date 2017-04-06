/*!
 * F4ck jquery
 * @version  v0.3.1
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
    var events = {};

    var F4 = function F4(arg) {
        this.length = 0;
        this._addArrayProtos();
        return this.init(arg);
    };

    F4.prototype.init = function (arg) {
        this.find(arg);

        if (typeof arg === 'function') {
            var state = d.readyState;
            if (state === 'interactive' || state === 'complete') {
                arg.apply(d);
            } else {
                this.on('DOMContentLoaded', arg);
            }
        }

        return this;
    };

    F4.prototype._addArrayProtos = function () {
        var prototypes = Object.getOwnPropertyNames(Array.prototype);
        each(prototypes, function (i) {
            var name = prototypes[i];
            switch (name) {
                case 'length':
                case 'constructor':
                    break;
                case 'find':
                    F4.prototype['findIn'] = Array.prototype[name];
                    break;
                default:
                    F4.prototype[name] = Array.prototype[name];
            }
        });
        return this;
    };

    F4.prototype._fill = function (els) {
        this.forEach(function (el, i) {
            delete this[i];
        }, this);

        els = els.filter(function (item, pos) {
            return els.indexOf(item) === pos;
        });
        els.forEach(function (el, i) {
            this[i] = el;
        }, this);
        this.length = els.length;

        return this;
    };

    F4.prototype.find = function (arg) {
        var self = this;
        var elements = [];
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

    F4.prototype.on = function (ev, f, hash) {
        if (undef(hash)) {
            hash = 'default';
        }
        this.forEach(function (el) {
            if (events[el]) {
                if (events[el][ev]) {
                    if (events[el][ev][hash]) {
                        events[el][ev][hash].push(f);
                    } else {
                        events[el][ev][hash] = [f];
                    }
                } else {
                    events[el][ev] = {};
                    events[el][ev][hash] = [f];
                }
            } else {
                events[el] = {};
                events[el][ev] = {};
                events[el][ev][hash] = [f];
            }
            el.addEventListener(ev, f);
        });

        return this;
    };

    F4.prototype.off = function (ev, hash) {
        var noHash = undef(hash);
        this.forEach(function (el) {
            if (events[el]) {
                if (!ev) {
                    if (noHash) {
                        each(events[el], function (e) {
                            each(events[el][e], function (h) {
                                events[el][e][h].forEach(function (f) {
                                    el.removeEventListener(e, f);
                                });
                            });
                        });
                        delete events[el];
                    } else {
                        each(events[el], function (e) {
                            if (events[el][e][hash]) {
                                events[el][e][hash].forEach(function (f) {
                                    el.removeEventListener(e, f);
                                });
                                delete events[el][e][hash];
                            }
                        });
                    }
                } else {
                    if (noHash) {
                        each(events[el][ev], function (h) {
                            events[el][ev][h].forEach(function (f) {
                                el.removeEventListener(ev, f);
                            });
                        });
                        delete events[el][ev];
                    } else {
                        if (events[el][ev][hash]) {
                            events[el][ev][hash].forEach(function (f) {
                                el.removeEventListener(ev, f);
                            });
                            delete events[el][ev][hash];
                        }
                    }
                }
            }
        });

        return this;
    };

    F4.prototype.parent = function (arg) {
        var res = [];
        var matches;
        if (!undef(arg)) {
            matches = new F4(arg);
        }
        this.forEach(function (el) {
            if (undef(arg)) {
                res.push(el.parentElement);
            } else {
                while (el = el.parentElement) {
                    if (matches.some(function (match) {
                            if (match === el) {
                                res.push(match);
                                return true;
                            }
                        })) {
                        break;
                    }
                }
            }
        });

        return this._fill(res);
    };

    F4.prototype.html = function (arg) {
        var res = [];
        this.forEach(function (el) {
            if (undef(arg)) {
                res.push(el.innerHTML.trim());
            } else {
                el.innerHTML = arg;
            }
        });
        if (res.length === 1) {
            res = res[0];
        }

        return undef(arg) ? res : this;
    };

    F4.prototype.text = function (arg) {
        var res = [];
        this.forEach(function (el) {
            if (undef(arg)) {
                res.push(el.textContent.trim());
            } else {
                el.textContent = arg;
            }
        });
        if (res.length === 1) {
            res = res[0];
        }

        return undef(arg) ? res : this;
    };

    F4.prototype.attr = function (name, val) {
        var res = [];
        this.forEach(function (el) {
            if (undef(val)) {
                res.push(tryParse(el.getAttribute(name)));
            } else {
                el.setAttribute(name, val);
            }
        });
        if (res.length === 1) {
            res = res[0];
        }

        return undef(val) ? res : this;
    };

    F4.prototype.data = function (arg) {
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
        var res = this.map(function (el) {
            var data = {};
            makeArray(el.attributes).forEach(function (obj) {
                if (obj.name.substr(0, 5) === dat) {
                    data[toCamelCased(obj.name.slice(5))] = tryParse(obj.value);
                }
            });
            return data;
        });
        if (res.length === 1) {
            res = res[0];
        }

        return res;
    };

    F4.prototype.remove = function () {
        this.forEach(function (el) {
            el.parentElement.removeChild(el);
        });

        return this;
    };

    F4.prototype.addClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            el.classList.add.apply(el.classList, classes);
        });

        return this;
    };

    F4.prototype.removeClass = function () {
        var classes = prettyClass(arguments);
        this.forEach(function (el) {
            el.classList.remove.apply(el.classList, classes);
        });

        return this;
    };

    F4.prototype.hasClass = function (arg) {
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
        } else if (res.length === 1) {
            res = res[0];
        }

        return res;
    };

    F4.prototype.toggleClass = function (arg) {
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


    var f4 = function f4(arg) {
        return new F4(arg);
    };
    f4.ajax = new Ajax;
    f4.create = new Create;
    f4.proto = F4.prototype;
    f4.version = '0.3.1';

    return f4;
}));
var mac = /Mac/.test(navigator.platform);
var win = /Win/.test(navigator.platform);
var Event = {
    on: function (e, t, n, r) {
        e.addEventListener(t, n, false);
        if (r) {
            return function () {
                e.removeEventListener(t, n, false)
            }
        }
    },
    off: function (e, t, n) {
        e.removeEventListener(t, n, false)
    },
    preventDefault: function (e) {
        e.preventDefault()
    },
    stopPropagation: function (e) {
        e.stopPropagation()
    },
    stop: function (e) {
        Event.preventDefault(e);
        Event.stopPropagation(e)
    }
};
String.prototype.splice = function (e, t, n) {
    t = +t || 0;
    n = n || "";
    return this.slice(0, e) + n + this.slice(e + t)
};
var Extend = function (e, t) {
    for (var n in t) {
        e[n] = t[n]
    }
    return e
};
var Range = {
    copy: function (e) {
        return {
            line: e.line,
            ch: e.ch,
            x: e.x,
            y: e.y
        }
    },
    equal: function (e, t) {
        return e.line === t.line && e.ch === t.ch
    },
    line: function (e, t) {
        return e.line === t.line
    },
    less: function (e, t) {
        return e.line < t.line || e.line == t.line && e.ch < t.ch
    },
    isWordChar: function (e) {
        return /\w/.test(e) || e.toUpperCase() != e.toLowerCase()
    }
}
Extend(Editor.prototype, {
    addEvents: function () {
        var e = this.element;
        view = e.view, input = e.input;
        Event.on(view, "mousedown", this.onMouseDown.bind(this));
        Event.on(view, "selectstart", Event.preventDefault);
        Event.on(input, "keyup", this.onKeyUp.bind(this));
        Event.on(input, "input", this.onInput.bind(this));
        Event.on(input, "keydown", this.onKeyDown.bind(this));
        Event.on(input, "focus", this.onFocus.bind(this));
        Event.on(input, "blur", this.onBlur.bind(this));
        Event.on(input, "paste", this.onPaste.bind(this))
    },
    onFocus: function (e) {
        if (!this.focused) {
            this.focused = true;
            this.editor.classList.add("focused")
        }
        this.blinkCursor()
    },
    onBlur: function (e) {
        if (this.focused) {
            this.focused = false;
            this.editor.classList.remove("focused")
        }
        this.save();
        this.hideCursor();
        var t = this;
        setTimeout(function () {
            if (!t.focused) t.setShift()
        }, 150)
    },
    onMouseDown: function (e) {
        var t = this,
            n = this.element.view.getBoundingClientRect(),
            r = this.from.line;
        var i = e.y >= n.bottom - 10 ? e.y - 10 : e.y;
        var s = this.getPosition(e.x, i),
            o, u;
        this.setShift(e.shiftKey);
        if (e.target.classList.contains("todo")) {
            this.toggleToDo(s, s);
            return Event.preventDefault(e)
        }
        if (!this.focused) this.onFocus();
        var a = +(new Date);
        if (this.lastDoubleClick && this.lastDoubleClick.time > a - 400 && Range.equal(this.lastDoubleClick.position, s)) {
            Event.preventDefault(e);
            return this.selectLine(s)
        } else if (this.lastClick && this.lastClick.time > a - 400 && Range.equal(this.lastClick.position, s)) {
            this.lastDoubleClick = {
                time: a,
                position: s
            };
            Event.preventDefault(e);
            return this.selectWordAt(s)
        } else {
            this.lastClick = {
                time: a,
                position: s
            }
        }
        Event.preventDefault(e);
        this.updateCursor(s, s);
        o = s;
        s = this.shiftSelecting || s;
        this.updateSelection(s, o);
        var f = function (e) {
            if (e.target.localName == t.mark_container) {
                return Event.preventDefault(e)
            }
            var r, i = t.element.view;
            if (e.y <= n.top + 10) {
                r = o;
                if (i.scrollTop !== 0) {
                    i.scrollTop -= t.line_height;
                    u = setTimeout(function () {
                        f(e)
                    }, 150);
                    if (i.scrollTop === 0) {
                        r = t.getPositionFromChar(1, 0)
                    } else {
                        r = t.getPosition(e.x, e.y + 10)
                    }
                }
            } else if (e.y >= n.bottom - 10) {
                r = o;
                if (i.scrollHeight - i.offsetHeight !== i.scrollTop) {
                    i.scrollTop += t.options.line_height;
                    r = t.getPosition(e.x, e.y - 10);
                    u = setTimeout(function () {
                        f(e)
                    }, 150)
                }
            } else {
                r = t.getPositionFromEvent(e)
            }
            o = r;
            t.updateSelection(s, r)
        };
        var l = Event.on(this.element.view, "mousemove", function (e) {
            clearTimeout(u);
            Event.preventDefault(e);
            f(e)
        }, true);
        var c = Event.on(window, "mouseup", function (e) {
            clearTimeout(u);
            Event.preventDefault(e);
            if (t.focusmode) {
                t.getLine(r).classList.remove("active");
                t.editor.classList.add("focusmode");
                var n = Event.on(t.element.view, "mousewheel", function (e) {
                    t.onMouseWheel();
                    n()
                }, true)
            }
            t.updateView(t.from, t.to);
            t.focusInput();
            l();
            c()
        }, true)
    },
    onMouseWheel: function () {
        this.getLine(this.selectionStart().line).classList.remove("active");
        this.editor.classList.remove("focusmode")
    },
    onKeyDown: function (e) {
        if (!this.focused) {
            this.focusInput()
        }
        var t = keyBindings.keyNames[e.keyCode],
            n, r;
        this.setShift(e.keyCode == 16 || e.shiftKey);
        if (t == null || e.altGraphKey) {
            return null
        }
        if (e.altKey) {
            t = "alt+" + t
        }
        if (e.ctrlKey) {
            t = (mac ? "ctrl" : "super") + "+" + t
        }
        if (e.metaKey) {
            t = "super+" + t
        }
        if (e.shiftKey && (n = keyBindings.bind["shift+" + t])) {
            r = true
        } else {
            n = keyBindings.bind[t]
        } if (typeof n == "string") {
            n = this[n].bind(this)
        }
        if (!n) {
            return false
        }
        if (r) {
            var i = this.shiftSelecting;
            this.shiftSelecting = null;
            n();
            this.shiftSelecting = i
        } else {
            n()
        }
        Event.preventDefault(e)
    },
    onInput: function () {
        var e = this;
        setTimeout(function () {
            e.add()
        }, 5)
    },
    onKeyUp: function (e) {
        if (e.keyCode == 16) {
            this.shiftSelecting = null
        } else {
            this.textPasted = null
        }
    },
    onPaste: function (e) {
        this.textPasted = true
    }
});
var keyBindings = {
    bind: {
        left: "goCharLeft",
        right: "goCharRight",
        up: "goLineUp",
        down: "goLineDown",
        end: "goLineEnd",
        home: "goLineStartSmart",
        pageUp: "goPageUp",
        pageDown: "goPageDown",
        "delete": "delCharRight",
        backspace: "delCharLeft",
        tab: "indentMore",
        "shift+tab": "indentLess",
        enter: "newlineAndIndent",
        insert: "toggleOverwrite",
        "super+enter": "smartNewlineAndIndent",
        "super+d": "toggleFocusMode",
        "super+a": "selectAll",
        "super+z": "undo",
        "shift+super+z": "redo",
        "super+y": "redo",
        "super+up": "goDocStart",
        "super+end": "goDocEnd",
        "super+down": "goDocEnd",
        "alt+left": "goWordLeft",
        "alt+right": "goWordRight",
        "super+left": "goLineStart",
        "super+right": "goLineEnd",
        "alt+backspace": "delWordLeft",
        "ctrl+alt+backspace": "delWordRight",
        "super+backspace": "deleteLine",
        "alt+delete": "delWordRight",
        "super+s": "save",
        "super+f": "find",
        "super+g": "findNext",
        "shift+super+g": "findPrev",
        "super+alt+f": "replace",
        "shift+super+alt+f": "replaceAll",
        "super+f": "toggleFullScreen",
        "super+b": "makeStrong",
        "super+i": "makeEmphasis",
        "super+l": "toggleToDo",
        "super+tab": "toggleDocument",
        "super+e": "toggleWidth",
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageUp",
        "Shift-Ctrl-V": "goPageDown",
        "Ctrl-D": "delCharRight",
        "Ctrl-H": "delCharLeft",
        "Alt-D": "delWordRight",
        "Alt-Backspace": "delWordLeft",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars"
    },
    windows: {
        "super+left": "goWordLeft",
        "super+right": "goWordRight",
        "alt+left": "goLineStart",
        "alt+right": "goLineEnd",
        "super+home": "goDocStart",
        "alt+up": "goDocStart",
        "super+delete": "delWordRight",
        "shift+super+f": "replace",
        "shift+super+r": "replaceAll"
    },
    smartTypingPairs: {
        "<": ">",
        "`": "`"
    }
};
if (win) {
    for (var command in keyBindings.windows) {
        keyBindings.bind[command] = keyBindings.windows[command]
    }
}
var keyNames = {
    3: "enter",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capsLock",
    27: "esc",
    32: "space",
    33: "pageUp",
    34: "pageDown",
    35: "end",
    36: "home",
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    44: "printScrn",
    45: "insert",
    46: "delete",
    59: ";",
    91: "mod",
    92: "mod",
    93: "mod",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    63276: "pageUp",
    63277: "pageDown",
    63275: "end",
    63273: "home",
    63234: "left",
    63232: "up",
    63235: "right",
    63233: "down",
    63302: "insert",
    63272: "delete"
};
keyBindings.keyNames = keyNames;
(function () {
    for (var e = 0; e < 10; e++) keyNames[e + 48] = String(e);
    for (var e = 65; e <= 90; e++) keyNames[e] = String.fromCharCode(e).toLowerCase();
    for (var e = 1; e <= 12; e++) keyNames[e + 111] = keyNames[e + 63235] = "f" + e
})()
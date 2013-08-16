Extend(Editor.prototype, {
    addLines: function (e) {
        e = this.parserLines(e);
        this.element.content.appendChild(e)
    },
    replaceLines: function (e, t, n) {
        var r = this.element.content;
        n = this.parserLines(n);
        if (e === t) {
            r.replaceChild(n, this.getLine(e))
        } else {
            var i = this.getLine(e),
                s = t - e + 1,
                o;
            while (s--) {
                o = i.nextSibling;
                r.removeChild(i);
                i = o
            }
            if (i) {
                r.insertBefore(n, i)
            } else {
                r.appendChild(n)
            }
        }
    },
    updateView: function (e, t) {
        if (this.focusmode) {
            var n = this.getLine(this.from.line);
            if (n) {
                n.classList.remove("active")
            }
            this.getLine(e.line).classList.add("active")
        }
        this.updateSelection(e, t);
        this.updateCursor(e, t);
        this.updateInput()
    },
    getSize: function () {
        return this.element.content.childNodes.length
    },
    getLine: function (e) {
        return this.element.content.childNodes[e - 1]
    },
    getText: function (e, t) {
        var n, r, i;
        n = this.getLine(e);
        r = [n.textContent];
        if (e != t) {
            i = e;
            while (i < t) {
                n = n.nextSibling;
                r.push(n.textContent);
                ++i
            }
        }
        return r.join("\n")
    },
    getContent: function (e, t) {
        var n, r, i, s = 0,
            o;
        n = this.getLine(e.line);
        r = [n.textContent];
        if (!Range.line(e, t)) {
            i = e.line;
            while (i < t.line) {
                s += n.textContent.length;
                n = n.nextSibling;
                r.push(n.textContent);
                ++i
            }
        }
        o = {
            textContent: r.join("\n"),
            selectionStart: e.ch,
            selectionEnd: s + t.ch + r.length - 1
        };
        o.chunk = [o.textContent.slice(0, o.selectionStart), o.textContent.slice(o.selectionStart, o.selectionEnd), o.textContent.slice(o.selectionEnd)];
        return o
    },
    getPositionFromPoint: function (e, t) {
        var n = this.element,
            r = n.wrapper,
            i = n.view;
        e += r.getBoundingClientRect().left + this.padding_width / 2;
        t += i.getBoundingClientRect().top + 8;
        t -= i.scrollTop - parseInt(r.style.paddingTop);
        return this.getPosition(e, t)
    },
    getPositionFromEvent: function (e) {
        return this.getPosition(e.x, e.y)
    },
    getPositionFromChar: function (e, t) {
        var n, r, i, s, o, u, a, f;
        n = this.getLine(e);
        r = document.createTreeWalker(n, NodeFilter.SHOW_TEXT, null, false);
        i = t;
        while (r.nextNode()) {
            n = r.currentNode;
            if (n.textContent.length >= i) {
                break
            }
            i -= n.textContent.length
        }
        o = document.createRange();
        o.selectNodeContents(n);
        o.setStart(o.startContainer, i);
        o.setEnd(o.endContainer, i);
        var l = o.getClientRects(),
            u;
        u = l.length > 1 ? l[1] : l[0];
        var c = this.element,
            h = c.wrapper,
            s = c.content,
            p = this.line_height;
        a = u.left, f = Math.floor((u.top - s.getBoundingClientRect().top) / p);
        return {
            line: e,
            ch: t,
            x: a - h.getBoundingClientRect().left,
            y: f * p
        }
    },
    getPosition: function (e, t) {
        var n = document.caretRangeFromPoint(e, t);
        if (n.startContainer.className === "cursor") {
            this.hideCursor();
            n = document.caretRangeFromPoint(e, t)
        }
        n.expand("character");
        var r = n.startContainer,
            i = n.startOffset,
            s = this.tag_container;
        while (r) {
            if (r.localName == s) {
                break
            }
            if (r.previousSibling) {
                i += r.previousSibling.textContent.length;
                r = r.previousSibling
            } else {
                r = r.parentNode
            }
        }
        var o = 0;
        while (r) {
            r = r.previousSibling;
            ++o
        }
        var u = n.getClientRects(),
            a;
        if (u.length > 1) {
            var a = u[t > u[0].bottom ? 1 : 0]
        } else {
            var a = u[0]
        }
        var f = this.element,
            l = f.wrapper,
            c = f.content,
            h = this.line_height;
        e = a.left, t = Math.floor((a.top - c.getBoundingClientRect().top) / h);
        return {
            line: o,
            ch: i,
            x: e - l.getBoundingClientRect().left,
            y: t * h
        }
    },
    findWord: function (e) {
        var t = this.getLine(e.line).textContent;
        var n = e.ch,
            r = e.ch;
        while (n > 0 && Range.isWordChar(t.charAt(n - 1)))--n;
        while (r < t.length && Range.isWordChar(t.charAt(r)))++r;
        var i = this.getPositionFromChar(e.line, n);
        var s = this.getPositionFromChar(e.line, r);
        return {
            from: i,
            to: s
        }
    },
    findPoint: function (e, t, n) {
        function a() {
            for (var e = i + t, n = t < 0 ? 0 : u; e != n; e += t) {
                i = e;
                o = r.getLine(i);
                return true
            }
        }

        function f(e) {
            if (s == (t < 0 ? 0 : o.textContent.length)) {
                if (!e && a()) s = t < 0 ? o.textContent.length : 0;
                else return false
            } else s += t;
            return true
        }
        var r = this,
            i = e.line,
            s = e.ch,
            o, u = this.getSize() + 1;
        o = this.getLine(i);
        if (n == "char") f();
        else if (n == "column") f(true);
        else if (n == "word") {
            var l = false;
            for (;;) {
                if (t < 0)
                    if (!f()) break;
                if (Range.isWordChar(o.textContent.charAt(s))) l = true;
                else if (l) {
                    if (t < 0) {
                        t = 1;
                        f()
                    }
                    break
                }
                if (t > 0)
                    if (!f()) break
            }
        }
        return this.getPositionFromChar(i, s, t)
    },
    moveHorizontalPoint: function (e, t) {
        var n = this.from,
            r = this.to,
            i = r;
        if (this.shiftSelecting || Range.equal(n, r)) {
            i = this.findPoint(i, e, t)
        } else if (!Range.less(n, r)) {
            i = e < 0 ? r : n
        } else {
            i = e < 0 ? n : r
        }
        this.updateView(this.shiftSelecting ? this.from : i, i)
    },
    moveVerticalPoint: function (e, t) {
        var n = 0,
            r = this.from,
            i = this.to,
            s = i;
        if (t == "page") {
            n = scroller.clientHeight
        } else if (t == "line") {
            n = this.line_height
        }
        if (this.shiftSelecting || Range.equal(r, i)) {
            if (this.previousSelection != null) {
                i.x = this.previousSelection
            }
            var o = Range.copy(i);
            o.y = i.y + n * e;
            this.updateCursor(o, o);
            s = this.getPositionFromPoint(i.x, parseInt(this.element.cursor.style.top))
        } else if (!Range.less(r, i)) {
            s = e < 0 ? i : r
        } else {
            s = e < 0 ? r : i
        }
        this.updateView(this.shiftSelecting ? this.from : s, s);
        this.previousSelection = i.x
    },
    removePoint: function (e, t) {
        var n, r, i, s, o = this.getInputValue(true),
            u = this.selectionStart(),
            a = this.selectionEnd();
        if (this.focusmode) {
            var f = this.element.content.offsetHeight,
                l = this.element.view.scrollTop
        }
        if (!Range.equal(u, a)) {
            i = o[1];
            o = o[0] + o[2];
            n = u
        } else if (e < 0) {
            n = this.findPoint(u, e, t);
            u = n;
            s = this.getContent(u, a);
            r = s.textContent;
            i = r.slice(s.selectionStart, s.selectionEnd);
            o = r.slice(0, s.selectionStart) + o[2]
        } else {
            n = this.findPoint(u, e, t);
            a = n;
            s = this.getContent(u, a);
            r = s.textContent;
            i = r.slice(s.selectionStart, s.selectionEnd);
            o = o[0] + r.slice(s.selectionEnd)
        }
        this.replaceLines(u.line, a.line, o);
        n = this.getPositionFromChar(n.line, n.ch);
        this.addHistory({
            add: "",
            del: i,
            textSelected: this.textSelected ? a : null,
            from: u,
            to: n
        });
        if (this.focusmode) {
            var c = this.element.content.offsetHeight;
            if (f != c) {
                this.element.view.scrollTop = l + c - f
            }
        }
        this.updateView(n, n)
    },
    goCharLeft: function () {
        this.moveHorizontalPoint(-1, "char")
    },
    goCharRight: function () {
        this.moveHorizontalPoint(1, "char")
    },
    goLineUp: function () {
        this.moveVerticalPoint(-1, "line")
    },
    goLineDown: function () {
        this.moveVerticalPoint(1, "line")
    },
    goLineStart: function () {
        var e = this.selectionStart(),
            t;
        t = this.getPositionFromPoint(0, e.y);
        this.updateView(this.shiftSelecting ? this.from : t, t)
    },
    goLineEnd: function () {
        var e = this.selectionStart(),
            t;
        t = this.getPositionFromPoint(this.width, e.y);
        this.updateView(this.shiftSelecting ? this.from : t, t)
    },
    goLineStartSmart: function () {},
    goPageUp: function () {},
    goPageDown: function () {},
    goDocStart: function () {
        var e = this.getPositionFromChar(1, 0);
        this.updateView(this.shiftSelecting ? this.from : e, e)
    },
    goDocEnd: function () {
        var e, t, n = this.getSize();
        t = this.getLine(n);
        e = this.getPositionFromChar(n, t.textContent.length);
        this.update(this.shiftSelecting ? this.from : e, e)
    },
    goWordLeft: function () {
        this.moveHorizontalPoint(-1, "word")
    },
    goWordRight: function () {
        this.moveHorizontalPoint(1, "word")
    },
    delCharRight: function () {
        this.removePoint(1, "char")
    },
    delCharLeft: function () {
        this.removePoint(-1, "char")
    },
    delWordLeft: function () {
        this.removePoint(-1, "word")
    },
    delWordRight: function () {
        this.removePoint(1, "word")
    },
    deleteLine: function () {},
    indent: function (e, t, n, r) {
        var i = e,
            s = e;
        var o = this.getLine(t.line),
            u = n.line - t.line + 1,
            a = [];
        while (u--) {
            if (e < 0) {
                a.push(o.textContent.replace(/^\t/, ""))
            } else {
                a.push("  " + o.textContent)
            }
            o = o.nextSibling
        }
        if (e < 0) {
            i = this.getLine(t.line).textContent === a[0] ? 0 : e;
            s = this.getLine(n.line).textContent === a[a.length - 1] ? 0 : e
        }
        this.replaceLines(t.line, n.line, a);
        if (Range.equal(t, n)) {
            t = n = this.getPositionFromChar(this.from.line, this.from.ch + i)
        } else {
            t = this.getPositionFromChar(this.from.line, this.from.ch + i);
            n = this.getPositionFromChar(this.to.line, this.to.ch + s)
        } if (!r && i != 0 && s != 0) {
            this.addHistory({
                action: "indent",
                dir: e,
                from: t,
                to: n
            })
        }
        this.updateView(t, n)
    },
    indentMore: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd();
        this.indent(1, e, t)
    },
    indentLess: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd();
        this.indent(-1, e, t)
    },
    newlineAndIndent: function () {
        var e = this.inputValue.chunk,
            t, n = this.selectionStart(),
            r = this.selectionEnd(),
            i = n.line + 1,
            s = 0,
            o, u = "\n",
            a = this.textSelected;
        e.splice(1, 1);
        if (this.options.smartNewline) {
            o = Parser.newline(e[0]);
            if (o[0] && !this.shiftSelecting) {
                if (e[0] == o[0] && !(e[1] || this.textSelected)) {
                    e = "";
                    i = n.line;
                    a = o[0];
                    this.replaceLines(i, r.line, e);
                    var f = this.getPositionFromChar(i, 0);
                    this.addHistory({
                        action: "newline",
                        add: "",
                        del: a,
                        textSelected: null,
                        from: f,
                        to: r
                    });
                    this.updateView(f, f);
                    return
                } else {
                    e[1] = o[1] + e[1];
                    s = o[1].length;
                    u += o[1]
                }
            }
        }
        this.replaceLines(n.line, r.line, e);
        var f = this.getPositionFromChar(i, s);
        this.addHistory({
            action: "newline",
            add: u,
            del: a,
            textSelected: this.textSelected ? r : null,
            from: n,
            to: f
        });
        if (this.focusmode) {
            this.element.view.scrollTop = this.element.view.scrollTop + this.line_height
        }
        this.updateView(f, f)
    },
    add: function () {
        var e, t = this.getInputValue(),
            n = this.selectionStart(),
            r = this.selectionEnd(),
            i = n.line,
            s = this.element.input.selectionEnd,
            o = false;
        if (this.focusmode) {
            var u = this.element.content.offsetHeight,
                a = this.element.view.scrollTop
        }
        if (this.textPasted) {
            o = true;
            e = t.slice(this.inputValue.chunk[0].length, s);
            t = t.split(/\r?\n/);
            i = i + t.length - 1;
            s = t[t.length - 1].length - this.inputValue.chunk[2].length
        } else if (this.options.smartTypingPairs) {
            e = t.slice(n.ch, s);
            var f = keyBindings.smartTypingPairs[e];
            if (f) {
                return this.smartTyping(n, r, e, f, false)
            }
        } else {
            e = t.slice(n.ch, s)
        }
        this.replaceLines(n.line, r.line, t);
        var l = this.getPositionFromChar(i, s);
        this.addHistory({
            add: e,
            del: this.textSelected,
            textSelected: this.textSelected ? r : null,
            from: n,
            to: l
        });
        if (this.focusmode) {
            var c = this.element.content.offsetHeight;
            if (u != c) {
                this.element.view.scrollTop = a + c - u
            }
        }
        this.updateView(l, l)
    },
    smartTyping: function (e, t, n, r, i, s) {
        var o = Range.copy(e),
            u = Range.copy(t);
        var a = this.getContent(e, t),
            f = a.chunk[1];
        a = a.chunk[0] + n + a.chunk[1] + r + a.chunk[2];
        this.replaceLines(e.line, t.line, a);
        if (Range.equal(e, t)) {
            e = t = this.getPositionFromChar(e.line, e.ch + n.length)
        } else {
            if (i) {
                t = this.getPositionFromChar(t.line, t.ch + (Range.line(e, t) ? n.length : 0));
                e = this.getPositionFromChar(e.line, e.ch + n.length)
            } else {
                e = t = this.getPositionFromChar(t.line, t.ch + (Range.line(e, t) ? n.length : 0) + r.length)
            }
        } if (!s) {
            this.addHistory({
                action: "smartTyping",
                textSelected: f,
                undo: {
                    from: o,
                    to: u
                },
                from: e,
                to: t,
                open: n,
                close: r,
                select: i
            })
        }
        this.updateView(e, t)
    },
    makeStrong: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd();
        this.smartTyping(e, t, "**", "**", false)
    },
    makeEmphasis: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd();
        this.smartTyping(e, t, "*", "*", false)
    },
    makeDelete: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd();
        this.smartTyping(e, t, "-", "-", false)
    },
    selectWordAt: function (e) {
        var t = this.findWord(e);
        this.updateView(t.from, t.to)
    },
    selectLine: function (e) {
        console.log(this.width);
        var t = this.getPositionFromPoint(0, e.y),
            n = this.getPositionFromPoint(this.width, e.y);
        this.updateView(t, n)
    },
    undo: function () {
        var e = this.getUndo();
        if (e) {
            var t = e.action || "";
            if (t == "indent") {
                this.indent(e.dir < 0 ? 1 : -1, e.from, e.to, true)
            } else if (t == "smartTyping") {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, r);
                var s = e.open.length + e.close.length;
                var o = e.textSelected.length + s;
                var u = i.textContent.splice(i.selectionStart - (e.textSelected ? o : e.open.length), e.textSelected ? o : s, e.textSelected);
                this.replaceLines(n.line, r.line, u);
                this.updateView(e.undo.from, e.undo.to)
            } else if (t == "todo") {
                this.toggleToDo(e.from, e.to, true)
            } else if (e.textSelected) {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, r);
                var u = i.textContent.splice(i.selectionStart, e.add.length, e.del);
                this.replaceLines(n.line, r.line, u);
                this.updateView(n, e.textSelected)
            } else if (e.add == "") {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, n);
                var u = i.textContent.splice(i.selectionStart, "", e.del);
                this.replaceLines(n.line, n.line, u);
                this.updateView(n, r)
            } else {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, r);
                var u = i.textContent.splice(i.selectionStart, e.add.length, "");
                this.replaceLines(n.line, r.line, u);
                this.updateView(n, n)
            }
        }
    },
    redo: function () {
        var e = this.getRedo();
        if (e) {
            var t = e.action || "";
            if (t == "indent") {
                this.indent(e.dir, e.from, e.to, true)
            } else if (t == "smartTyping") {
                this.smartTyping(e.undo.from, e.undo.to, e.open, e.close, e.select, true)
            } else if (t == "todo") {
                this.toggleToDo(e.from, e.to, true)
            } else if (e.textSelected) {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, e.textSelected);
                var s = i.textContent.splice(i.selectionStart, e.del.length, e.add);
                this.replaceLines(n.line, e.textSelected.line, s);
                this.updateView(r, r)
            } else if (e.add == "") {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, r);
                var s = i.textContent.splice(i.selectionStart, e.del.length, "");
                this.replaceLines(n.line, r.line, s);
                this.updateView(n, n)
            } else {
                var n = e.from,
                    r = e.to;
                var i = this.getContent(n, n);
                var s = i.textContent.splice(i.selectionStart, "", e.add);
                this.replaceLines(n.line, n.line, s);
                this.updateView(r, r)
            }
        }
    },
    selectAll: function () {
        var e = this.getSize(),
            t = this.getLine(e),
            n = this.getPositionFromChar(1, 0),
            r = this.getPositionFromChar(e, t.textContent.length);
        this.updateView(n, r)
    },
    toggleToDo: function (e, t, n) {
        e = e || this.selectionStart();
        t = t || this.selectionEnd();
        var r = this.getLine(e.line),
            i = t.line - e.line + 1,
            s = [],
            o, u, a, f;
        while (i--) {
            o = r.textContent;
            u = o[0];
            a = o.slice(1);
            if (u == "+" || u == "-") {
                f = true;
                s.push((u == "+" ? "-" : "+") + a)
            } else {
                s.push(o)
            }
            r = r.nextSibling
        }
        if (f) {
            if (!n) {
                this.addHistory({
                    action: "todo",
                    from: e,
                    to: t
                })
            }
            this.replaceLines(e.line, t.line, s);
            this.updateInput()
        }
    },
    toggleFocusMode: function () {
        var e = this.element,
            t = this.element.wrapper,
            n = this.element.view,
            r = this.line_height;
        if (this.focusmode) {
            this.focusmode = null;
            this.onMouseWheel();
            t.style.padding = r + "px 0";
            n.scrollTop = this.selectionStart().y
        } else {
            this.focusmode = true;
            this.editor.classList.add("focusmode");
            var i = Math.floor(n.getBoundingClientRect().height / 2 / r) * r;
            t.style.padding = i + "px 0";
            var s = this.selectionStart();
            n.scrollTop = s.y;
            var o = this.onMouseWheel.bind(this);
            var u = Event.on(n, "mousewheel", function (e) {
                o();
                u()
            }, true);
            this.getLine(s.line).classList.add("active")
        }
    },
    save: function () {
        var e = this.options.localStorage;
        localStorage[e] = this.getText(1, this.getSize())
    }
})
Extend(Editor.prototype, {
    selectionStart: function () {
        return this.inverted ? this.to : this.from
    },
    selectionEnd: function () {
        return this.inverted ? this.from : this.to
    },
    updateSelection: function (e, t, n) {
        this.from = e;
        this.to = t;
        this.inverted = false;
        if (Range.equal(e, t)) {
            this.inverted = false
        } else if (e.y > t.y || e.y === t.y && e.x > t.x) {
            this.inverted = true
        }
        if (n != false) {
            if (this.inverted) {
                e = this.to;
                t = this.from
            }
            this.setSelection(e, t)
        }
    },
    setSelection: function (e, t) {
        var n = this.element,
            r = n.selectionTop.style,
            i = n.selectionMiddle.style,
            s = n.selectionBottom.style,
            o = this.line_height;
        r.width = i.width = s.width = 0;
        if (!Range.equal(e, t)) {
            if (e.y == t.y) {
                r.top = e.y + "px";
                r.left = e.x + "px";
                r.width = Math.abs(t.x - e.x) + "px";
                r.height = o + "px"
            } else {
                r.top = e.y + "px";
                r.left = e.x + "px";
                r.width = this.width - e.x + this.padding_width + "px";
                r.height = o + "px";
                var u = (t.y - e.y) / o;
                if (u > 1) {
                    i.top = e.y + o + "px";
                    i.left = 0;
                    i.width = this.width + this.padding_width + "px";
                    i.height = t.y - e.y - o + "px"
                } else {
                    i.width = 0
                }
                s.top = t.y + "px";
                s.left = 0;
                s.width = t.x + "px";
                s.height = o + "px"
            }
            this.hideCursor()
        }
    }
})
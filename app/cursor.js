Extend(Editor.prototype, {
    blinkCursor: function (e) {
        clearInterval(this.blinker);
        if (e === false) return;
        var t = true,
            n = this.element.cursor.style;
        n.visibility = "";
        this.blinker = setInterval(function () {
            n.visibility = (t = !t) ? "" : "hidden"
        }, 626)
    },
    hideCursor: function () {
        this.element.cursor.style.display = "none";
        this.blinkCursor(false)
    },
    updateCursor: function (e, t) {
        this.setCursor(t.x, t.y);
        this.element.cursor.scrollIntoViewIfNeeded();
        if (Range.equal(e, t)) {
            this.blinkCursor()
        } else {
            this.hideCursor()
        }
    },
    setCursor: function (e, t) {
        var n = this.element.cursor.style,
            r = this.element.input;
        n.top = t + "px";
        n.left = e - 2 + "px";
        n.display = "";
        r.style.top = t + "px";
        r.style.left = e + 1 + "px"
    }
})
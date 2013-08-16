Extend(Editor.prototype, {
    focusInput: function () {
        this.element.input.focus()
    },
    blurInput: function () {
        this.element.input.blur()
    },
    updateInput: function () {
        var e = this.selectionStart(),
            t = this.selectionEnd(),
            n;
        this.inputValue = n = this.getContent(e, t);
        this.element.input.value = n.textContent;
        this.setInputSelection(n.selectionStart, n.selectionEnd)
    },
    setInputSelection: function (e, t) {
        var n = this.element.input;
        n.selectionStart = e;
        n.selectionEnd = t;
        this.textSelected = this.inputValue.chunk[1]
    },
    setInputValue: function (e) {
        this.element.cursor.value = e
    },
    getInputValue: function (e) {
        var t = this.element.input,
            n = t.value;
        if (e) {
            return [n.slice(0, t.selectionStart), this.textSelected, n.slice(t.selectionEnd)]
        }
        return n
    },
    getInputValueCached: function (e) {
        return this.inputValue
    },
    setShift: function (e) {
        if (e) {
            this.shiftSelecting = this.shiftSelecting || this.selectionStart()
        } else {
            this.shiftSelecting = null
        }
    },
    hasInputSelection: function () {
        try {
            var e = this.element.input;
            return e.selectionStart != e.selectionEnd
        } catch (t) {
            return false
        }
    }
})
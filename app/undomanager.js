Extend(Editor.prototype, {
    addHistory: function (e) {
        this.undomanager.add(e)
    },
    getUndo: function () {
        return this.undomanager.undo()
    },
    getRedo: function () {
        return this.undomanager.redo()
    }
});
var UndoManager = function () {
    this.undoStack = [];
    this.redoStack = []
};
UndoManager.prototype = {
    add: function (e) {
        var t = this.undoStack.pop() || null;
        if (t) {
            var n = t.action || e.action || t.textSelected || e.textSelected || e.del && t.add || e.add && !t.add || e.add && !Range.equal(t.to, e.from) || e.del && !Range.equal(t.from, e.to);
            if (n) {
                this.undoStack.push(t);
                this.undoStack.push(e)
            } else if (t) {
                var r = this.chain(t, e);
                this.undoStack.push(r)
            }
        } else {
            this.undoStack.push(e)
        }
        this.redoStack = []
    },
    undo: function () {
        var e = this.undoStack.pop() || null;
        if (e) {
            this.redoStack.push(e)
        }
        return e
    },
    redo: function () {
        var e = this.redoStack.pop() || null;
        if (e) {
            this.undoStack.push(e)
        }
        return e
    },
    chain: function (e, t) {
        var n = {
            add: e.add + t.add,
            del: t.del + e.del,
            textPasted: null
        };
        n.from = n.add ? e.from : t.from;
        n.to = n.add ? t.to : e.to;
        return n
    }
}
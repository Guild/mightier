Extend(Editor.prototype, {
    create: function () {
        var e = '<section class="editor">' + "<header>" + "</header>" + '<section class="view">' + '<div class="wrapper">' + '<section class="body">' + '<aside class="measure"></aside>' + '<aside class="selection"><mark></mark><mark></mark><mark></mark></aside>' + '<article class="content"></article>' + '<div class="cursor"></div>' + '<textarea class="input" autocorrect="off" autocapitalize="off" wrap="off"></textarea>' + "</section>" + "</div>" + "</section>" + "<footer></footer>" + "</section>";
        var t = document.createElement("div");
        t.innerHTML = e;
        editor = t.firstChild, header = editor.firstChild, footer = editor.lastChild, view = header.nextSibling, wrapper = view.firstChild, body = wrapper.firstChild, measure = body.firstChild, selection = measure.nextSibling, selectionTop = selection.firstChild, selectionMiddle = selectionTop.nextSibling, selectionBottom = selection.lastChild, content = selection.nextSibling, cursor = content.nextSibling, input = cursor.nextSibling;
        this.editor = editor;
        this.element = {
            header: header,
            footer: footer,
            view: view,
            wrapper: wrapper,
            body: body,
            measure: measure,
            selection: selection,
            selectionTop: selectionTop,
            selectionMiddle: selectionMiddle,
            selectionBottom: selectionBottom,
            content: content,
            cursor: cursor,
            input: input
        };
        document.body.appendChild(this.editor)
    },
    setLayout: function (e) {
        var t = this.options;
        var n = this.element.measure,
            r = this.element.wrapper,
            i = this.element.content,
            s = this.tag_container;
        n.innerHTML = "<" + s + ">m</" + s + ">";
        var o = n.firstChild;
        t.max_line = e = e || t.max_line;
        this.width = o.offsetWidth * e;
        this.line_height = o.offsetHeight;
        this.em_width = o.offsetWidth;
        this.padding_width = t.padding_length * this.em_width * 2;
        r.style.width = this.width + this.padding_width + "px";
        r.style.padding = this.line_height + "px 0";
        i.style.padding = "0 " + this.padding_width / 2 + "px"
    },
    setTab: function () {
        var e = this.element.measure,
            t = this.tag_container;
        e.innerHTML = "<" + t + '><span class="tab">  </span></' + t + ">";
        var n = e.firstChild;
        this.tab_width = n.offsetWidth
    }
})
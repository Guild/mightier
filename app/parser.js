Editor.prototype.parserLines = function (e) {
    if (typeof e == "string") e = e.split(/\r?\n/);
    e = e.slice();
    var t = document.createDocumentFragment(),
        n, r;
    while (e.length) {
        r = e.shift();
        n = Parser.line(r, this.tag_container, this.tab_width, this.em_width);
        t.appendChild(n)
    }
    return t
};
var Parser = {
    tab: /^(\t+)(.*)/,
    header: /^(#{1,}\s)(.*)/,
    blockquote: /^((>\s)+)(.*)/,
    list: /^([*+-]\s|\d+\.\s)(.*)/,
    strong: /^(__)(?=\S)([^\0]*?\S)(__)(?!_)|^(\*\*)(?=\S)([^\0]*?\S)(\*\*)(?!\*)/,
    em: /^(_)(?=\S)([^\0]*?\S)(_)(?!_)|^(\*)(?=\S)([^\0]*?\S)(\*)(?!\*)/,
    del: /^(-)(?=\S)([^\0]*?\S)(-)(?!-)/,
    text: /^[^\0]+?(?=[_*-]|$)/,
    pre: document.createElement("pre"),
    escape: function (e) {
        Parser.pre.textContent = e;
        return Parser.pre.innerHTML
    },
    line: function (e, t, n, r) {
        var i, s, o, u;
        s = document.createElement(t);
        if (i = Parser.tab.exec(e)) {
            s.classList.add("code");
            u = i[1].length * n;
            s.style.marginLeft = u + "px";
            o = '<span class="tab" style="margin-left:-' + u + 'px;">' + i[1] + "</span>" + Parser.inline(i[2])
        }
        if (i = Parser.header.exec(e)) {
            s.classList.add("header");
            u = i[1].length * r;
            o = '<span style="margin-left:-' + u + 'px;">' + i[1] + "</span>" + "<strong>" + Parser.inline(i[2]) + "</srong>"
        }
        if (i = Parser.blockquote.exec(e)) {
            s.classList.add("blockquote");
            u = i[1].length * r;
            s.style.marginLeft = u + "px";
            o = '<span style="margin-left:-' + u + 'px;">' + i[1] + "</span>" + Parser.inline(i[3])
        }
        if (i = Parser.list.exec(e)) {
            s.classList.add("list");
            u = i[1].length * r;
            var a = i[1] == "+ " || i[1] == "- " ? '<span class="todo">' + i[1][0] + "</span> " : i[1];
            if (i[1] == "+ ") {
                o = '<span style="margin-left:-' + u + 'px;">' + a + "</span><del>" + Parser.inline(i[2]) + "</del>"
            } else {
                o = '<span style="margin-left:-' + u + 'px;">' + a + "</span>" + Parser.inline(i[2])
            }
        }
        if (!s.classList.length) {
            s.classList.add("paragraph");
            o = Parser.inline(e)
        }
        s.innerHTML = o;
        return s
    },
    inline: function (e) {
        var t, n = [],
            r, i;
        while (e) {
            if (t = Parser.strong.exec(e)) {
                i = t[1] || t[4];
                r = i + "<strong>" + Parser.escape(t[2] || t[5]) + "</strong>" + i;
                n.push(r);
                e = e.slice(t[0].length);
                continue
            }
            if (t = Parser.em.exec(e)) {
                i = t[1] || t[4];
                r = i + "<em>" + Parser.escape(t[2] || t[5]) + "</em>" + i;
                n.push(r);
                e = e.slice(t[0].length);
                continue
            }
            if (t = Parser.del.exec(e)) {
                r = "-<del>" + Parser.escape(t[2]) + "</del>-";
                n.push(r);
                e = e.slice(t[0].length);
                continue
            }
            if (t = Parser.text.exec(e)) {
                n.push(Parser.escape(t[0]));
                e = e.slice(t[0].length);
                continue
            }
        }
        return n.join("")
    },
    newline: function (e) {
        var t, n = "",
            r = "";
        if (t = Parser.tab.exec(e)) {
            n = r = t[1]
        }
        if (t = Parser.list.exec(e)) {
            n = r = t[1], numeric = n.split(".");
            if (numeric.length > 1) {
                numeric[0]++;
                r = numeric.join(".")
            }
        }
        return [n, r]
    }
}
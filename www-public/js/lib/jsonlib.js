if (typeof jsonlib != "object")
    jsonlib = {};
(function(g) {
    function s(b) {
        var a = document.createElement("script"), c = false;
        a.src = b;
        a.async = true;
        a.onload = a.onreadystatechange = function() {
            if (!c && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                c = true;
                a.onload = a.onreadystatechange = e;
                a && a.parentNode && a.parentNode.removeChild(a)
            }
        };
        k || (k = document.getElementsByTagName("head")[0]);
        k.appendChild(a)
    }
    function h(b, a, c, d, m) {
        var n = "?", f = "jsonlib_cb_" + ++t, o;
        a = a || {};
        for (key in a)
            if (a.hasOwnProperty(key))
                n += encodeURIComponent(key) + "=" + encodeURIComponent(a[key]) + "&";
        i[f] = function(j) {
            clearTimeout(o);
            i[f] = e;
            if (c) {
                if (d)
                    j = j.hasOwnProperty(d) ? j[d] : m;
                c(j)
            }
            try {
                delete i[f]
            } catch (v) {
            }
        };
        o = setTimeout(function() {
            i[f] = e;
            c(m);
            try {
                delete i[f]
            } catch (j) {
            }
        }, u);
        s(b + n + "callback=" + f);
        return f
    }
    function p(b) {
        return typeof b.url == "string" && b.url.indexOf("https:") == 0 ? q : l
    }
    function r(b, a, c) {
        if (typeof b == "string")
            a = {url: a,select: b,a: "text"};
        else {
            a = {url: a,a: "text"};
            for (var d in b)
                if (b.hasOwnProperty(d))
                    a[d] = b[d]
        }
        h(p(a) + "fetch", a, c, "content", e)
    }
    var t = (new Date).getTime(), k, i = this, l = "http://call.jsonlib.com/", q = "https://jsonlib.appspot.com/", u = 6E3, e = null;
    g.ip = function(b) {
        h(l + "ip", {}, b, "ip", e)
    };
    g.time = function(b) {
        h(l + "time", {}, b, "time", e)
    };
    g.fetch = function(b, a) {
        if (typeof b == "string")
            b = {url: b};
        h(p(b) + "fetch", b, a, e, {error: "timeout"})
    };
    g.scrape = r;
    g.scrapeattr = function(b, a, c, d) {
        r({select: a,a: "attr_" + b}, c, d)
    };
    g.urandom = function(b, a) {
        if (arguments.length == 1) {
            a = b;
            b = {}
        }
        h(q + "urandom", b, a, "urandom", e)
    }
})(jsonlib);

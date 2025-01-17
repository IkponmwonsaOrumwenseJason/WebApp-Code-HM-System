/*! jQuery Mobile v1.3.2 | Copyright 2010, 2013 jQuery Foundation, Inc. | jquery.org/license */
(function(e, t, n) {
    typeof define == "function" && define.amd ? define(["jquery"], function(r) {
        return n(r, e, t), r.mobile
    }) : n(e.jQuery, e, t)
})(this, document, function(e, t, n, r) {
    (function(e, t, n, r) {
        function x(e) {
            while (e && typeof e.originalEvent != "undefined") e = e.originalEvent;
            return e
        }

        function T(t, n) {
            var i = t.type,
                s, o, a, l, c, h, p, d, v;
            t = e.Event(t), t.type = n, s = t.originalEvent, o = e.event.props, i.search(/^(mouse|click)/) > -1 && (o = f);
            if (s)
                for (p = o.length, l; p;) l = o[--p], t[l] = s[l];
            i.search(/mouse(down|up)|click/) > -1 && !t.which && (t.which = 1);
            if (i.search(/^touch/) !== -1) {
                a = x(s), i = a.touches, c = a.changedTouches, h = i && i.length ? i[0] : c && c.length ? c[0] : r;
                if (h)
                    for (d = 0, v = u.length; d < v; d++) l = u[d], t[l] = h[l]
            }
            return t
        }

        function N(t) {
            var n = {},
                r, s;
            while (t) {
                r = e.data(t, i);
                for (s in r) r[s] && (n[s] = n.hasVirtualBinding = !0);
                t = t.parentNode
            }
            return n
        }

        function C(t, n) {
            var r;
            while (t) {
                r = e.data(t, i);
                if (r && (!n || r[n])) return t;
                t = t.parentNode
            }
            return null
        }

        function k() {
            g = !1
        }

        function L() {
            g = !0
        }

        function A() {
            E = 0, v.length = 0, m = !1, L()
        }

        function O() {
            k()
        }

        function M() {
            _(), c = setTimeout(function() {
                c = 0, A()
            }, e.vmouse.resetTimerDuration)
        }

        function _() {
            c && (clearTimeout(c), c = 0)
        }

        function D(t, n, r) {
            var i;
            if (r && r[t] || !r && C(n.target, t)) i = T(n, t), e(n.target).trigger(i);
            return i
        }

        function P(t) {
            var n = e.data(t.target, s);
            if (!m && (!E || E !== n)) {
                var r = D("v" + t.type, t);
                r && (r.isDefaultPrevented() && t.preventDefault(), r.isPropagationStopped() && t.stopPropagation(), r.isImmediatePropagationStopped() && t.stopImmediatePropagation())
            }
        }

        function H(t) {
            var n = x(t).touches,
                r, i;
            if (n && n.length === 1) {
                r = t.target, i = N(r);
                if (i.hasVirtualBinding) {
                    E = w++, e.data(r, s, E), _(), O(), d = !1;
                    var o = x(t).touches[0];
                    h = o.pageX, p = o.pageY, D("vmouseover", t, i), D("vmousedown", t, i)
                }
            }
        }

        function B(e) {
            if (g) return;
            d || D("vmousecancel", e, N(e.target)), d = !0, M()
        }

        function j(t) {
            if (g) return;
            var n = x(t).touches[0],
                r = d,
                i = e.vmouse.moveDistanceThreshold,
                s = N(t.target);
            d = d || Math.abs(n.pageX - h) > i || Math.abs(n.pageY - p) > i, d && !r && D("vmousecancel", t, s), D("vmousemove", t, s), M()
        }

        function F(e) {
            if (g) return;
            L();
            var t = N(e.target),
                n;
            D("vmouseup", e, t);
            if (!d) {
                var r = D("vclick", e, t);
                r && r.isDefaultPrevented() && (n = x(e).changedTouches[0], v.push({
                    touchID: E,
                    x: n.clientX,
                    y: n.clientY
                }), m = !0)
            }
            D("vmouseout", e, t), d = !1, M()
        }

        function I(t) {
            var n = e.data(t, i),
                r;
            if (n)
                for (r in n)
                    if (n[r]) return !0;
            return !1
        }

        function q() {}

        function R(t) {
            var n = t.substr(1);
            return {
                setup: function(r, s) {
                    I(this) || e.data(this, i, {});
                    var o = e.data(this, i);
                    o[t] = !0, l[t] = (l[t] || 0) + 1, l[t] === 1 && b.bind(n, P), e(this).bind(n, q), y && (l.touchstart = (l.touchstart || 0) + 1, l.touchstart === 1 && b.bind("touchstart", H).bind("touchend", F).bind("touchmove", j).bind("scroll", B))
                },
                teardown: function(r, s) {
                    --l[t], l[t] || b.unbind(n, P), y && (--l.touchstart, l.touchstart || b.unbind("touchstart", H).unbind("touchmove", j).unbind("touchend", F).unbind("scroll", B));
                    var o = e(this),
                        u = e.data(this, i);
                    u && (u[t] = !1), o.unbind(n, q), I(this) || o.removeData(i)
                }
            }
        }
        var i = "virtualMouseBindings",
            s = "virtualTouchID",
            o = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),
            u = "clientX clientY pageX pageY screenX screenY".split(" "),
            a = e.event.mouseHooks ? e.event.mouseHooks.props : [],
            f = e.event.props.concat(a),
            l = {},
            c = 0,
            h = 0,
            p = 0,
            d = !1,
            v = [],
            m = !1,
            g = !1,
            y = "addEventListener" in n,
            b = e(n),
            w = 1,
            E = 0,
            S;
        e.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        };
        for (var U = 0; U < o.length; U++) e.event.special[o[U]] = R(o[U]);
        y && n.addEventListener("click", function(t) {
            var n = v.length,
                r = t.target,
                i, o, u, a, f, l;
            if (n) {
                i = t.clientX, o = t.clientY, S = e.vmouse.clickDistanceThreshold, u = r;
                while (u) {
                    for (a = 0; a < n; a++) {
                        f = v[a], l = 0;
                        if (u === r && Math.abs(f.x - i) < S && Math.abs(f.y - o) < S || e.data(u, s) === f.touchID) {
                            t.preventDefault(), t.stopPropagation();
                            return
                        }
                    }
                    u = u.parentNode
                }
            }
        }, !0)
    })(e, t, n),
    function(e) {
        e.mobile = {}
    }(e),
    function(e, t) {
        var r = {
            touch: "ontouchend" in n
        };
        e.mobile.support = e.mobile.support || {}, e.extend(e.support, r), e.extend(e.mobile.support, r)
    }(e),
    function(e, t, r) {
        function l(t, n, r) {
            var i = r.type;
            r.type = n, e.event.dispatch.call(t, r), r.type = i
        }
        var i = e(n);
        e.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "), function(t, n) {
            e.fn[n] = function(e) {
                return e ? this.bind(n, e) : this.trigger(n)
            }, e.attrFn && (e.attrFn[n] = !0)
        });
        var s = e.mobile.support.touch,
            o = "touchmove scroll",
            u = s ? "touchstart" : "mousedown",
            a = s ? "touchend" : "mouseup",
            f = s ? "touchmove" : "mousemove";
        e.event.special.scrollstart = {
            enabled: !0,
            setup: function() {
                function s(e, n) {
                    r = n, l(t, r ? "scrollstart" : "scrollstop", e)
                }
                var t = this,
                    n = e(t),
                    r, i;
                n.bind(o, function(t) {
                    if (!e.event.special.scrollstart.enabled) return;
                    r || s(t, !0), clearTimeout(i), i = setTimeout(function() {
                        s(t, !1)
                    }, 50)
                })
            }
        }, e.event.special.tap = {
            tapholdThreshold: 750,
            setup: function() {
                var t = this,
                    n = e(t);
                n.bind("vmousedown", function(r) {
                    function a() {
                        clearTimeout(u)
                    }

                    function f() {
                        a(), n.unbind("vclick", c).unbind("vmouseup", a), i.unbind("vmousecancel", f)
                    }

                    function c(e) {
                        f(), s === e.target && l(t, "tap", e)
                    }
                    if (r.which && r.which !== 1) return !1;
                    var s = r.target,
                        o = r.originalEvent,
                        u;
                    n.bind("vmouseup", a).bind("vclick", c), i.bind("vmousecancel", f), u = setTimeout(function() {
                        l(t, "taphold", e.Event("taphold", {
                            target: s
                        }))
                    }, e.event.special.tap.tapholdThreshold)
                })
            }
        }, e.event.special.swipe = {
            scrollSupressionThreshold: 10,
            durationThreshold: 1000,
            horizontalDistanceThreshold: 10,
            verticalDistanceThreshold: 475,
            start: function(t) {
                var n = t.originalEvent.touches ? t.originalEvent.touches[0] : t;
                return {
                    time: (new Date).getTime(),
                    coords: [n.pageX, n.pageY],
                    origin: e(t.target)
                }
            },
            stop: function(e) {
                var t = e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                return {
                    time: (new Date).getTime(),
                    coords: [t.pageX, t.pageY]
                }
            },
            handleSwipe: function(t, n) {
                n.time - t.time < e.event.special.swipe.durationThreshold && Math.abs(t.coords[0] - n.coords[0]) > e.event.special.swipe.horizontalDistanceThreshold && Math.abs(t.coords[1] - n.coords[1]) < e.event.special.swipe.verticalDistanceThreshold && t.origin.trigger("swipe").trigger(t.coords[0] > n.coords[0] ? "swipeleft" : "swiperight")
            },
            setup: function() {
                var t = this,
                    n = e(t);
                n.bind(u, function(t) {
                    function o(t) {
                        if (!i) return;
                        s = e.event.special.swipe.stop(t), Math.abs(i.coords[0] - s.coords[0]) > e.event.special.swipe.scrollSupressionThreshold && t.preventDefault()
                    }
                    var i = e.event.special.swipe.start(t),
                        s;
                    n.bind(f, o).one(a, function() {
                        n.unbind(f, o), i && s && e.event.special.swipe.handleSwipe(i, s), i = s = r
                    })
                })
            }
        }, e.each({
            scrollstop: "scrollstart",
            taphold: "tap",
            swipeleft: "swipe",
            swiperight: "swipe"
        }, function(t, n) {
            e.event.special[t] = {
                setup: function() {
                    e(this).bind(n, e.noop)
                }
            }
        })
    }(e, this)
});
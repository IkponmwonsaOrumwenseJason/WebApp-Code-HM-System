/*! jCarousel - v0.3.0-beta.5 - 2013-08-20
 * http://sorgalla.com/jcarousel
 * Copyright (c) 2013 Jan Sorgalla; Licensed MIT */
(function(t) {
    "use strict";
    var i = t.jCarousel = {};
    i.version = "0.3.0-beta.5";
    var s = /^([+\-]=)?(.+)$/;
    i.parseTarget = function(t) {
        var i = !1,
            e = "object" != typeof t ? s.exec(t) : null;
        return e ? (t = parseInt(e[2], 10) || 0, e[1] && (i = !0, "-=" === e[1] && (t *= -1))) : "object" != typeof t && (t = parseInt(t, 10) || 0), {
            target: t,
            relative: i
        }
    }, i.detectCarousel = function(t) {
        for (var i; t.size() > 0;) {
            if (i = t.filter("[data-jcarousel]"), i.size() > 0) return i;
            if (i = t.find("[data-jcarousel]"), i.size() > 0) return i;
            t = t.parent()
        }
        return null
    }, i.base = function(s) {
        return {
            version: i.version,
            _options: {},
            _element: null,
            _carousel: null,
            _init: t.noop,
            _create: t.noop,
            _destroy: t.noop,
            _reload: t.noop,
            create: function() {
                return this._element.attr("data-" + s.toLowerCase(), !0).data(s, this), !1 === this._trigger("create") ? this : (this._create(), this._trigger("createend"), this)
            },
            destroy: function() {
                return !1 === this._trigger("destroy") ? this : (this._destroy(), this._trigger("destroyend"), this._element.removeData(s).removeAttr("data-" + s.toLowerCase()), this)
            },
            reload: function(t) {
                return !1 === this._trigger("reload") ? this : (t && this.options(t), this._reload(), this._trigger("reloadend"), this)
            },
            element: function() {
                return this._element
            },
            options: function(i, s) {
                if (0 === arguments.length) return t.extend({}, this._options);
                if ("string" == typeof i) {
                    if (s === void 0) return this._options[i] === void 0 ? null : this._options[i];
                    this._options[i] = s
                } else this._options = t.extend({}, this._options, i);
                return this
            },
            carousel: function() {
                return this._carousel || (this._carousel = i.detectCarousel(this.options("carousel") || this._element), this._carousel || t.error('Could not detect carousel for plugin "' + s + '"')), this._carousel
            },
            _trigger: function(i, e, r) {
                var n, o = !1;
                return r = [this].concat(r || []), (e || this._element).each(function() {
                    n = t.Event((i + "." + s).toLowerCase()), t(this).trigger(n, r), n.isDefaultPrevented() && (o = !0)
                }), !o
            }
        }
    }, i.plugin = function(s, e) {
        var r = t[s] = function(i, s) {
            this._element = t(i), this.options(s), this._init(), this.create()
        };
        return r.fn = r.prototype = t.extend({}, i.base(s), e), t.fn[s] = function(i) {
            var e = Array.prototype.slice.call(arguments, 1),
                n = this;
            return "string" == typeof i ? this.each(function() {
                var r = t(this).data(s);
                if (!r) return t.error("Cannot call methods on " + s + " prior to initialization; " + 'attempted to call method "' + i + '"');
                if (!t.isFunction(r[i]) || "_" === i.charAt(0)) return t.error('No such method "' + i + '" for ' + s + " instance");
                var o = r[i].apply(r, e);
                return o !== r && o !== void 0 ? (n = o, !1) : void 0
            }) : this.each(function() {
                var e = t(this).data(s);
                e instanceof r ? e.reload(i) : new r(this, i)
            }), n
        }, r
    }
})(jQuery),
function(t, i) {
    "use strict";
    var s = function(t) {
        return parseFloat(t) || 0
    };
    t.jCarousel.plugin("jcarousel", {
        animating: !1,
        tail: 0,
        inTail: !1,
        resizeTimer: null,
        lt: null,
        vertical: !1,
        rtl: !1,
        circular: !1,
        underflow: !1,
        _options: {
            list: function() {
                return this.element().children().eq(0)
            },
            items: function() {
                return this.list().children()
            },
            animation: 400,
            transitions: !1,
            wrap: null,
            vertical: null,
            rtl: null,
            center: !1
        },
        _list: null,
        _items: null,
        _target: null,
        _first: null,
        _last: null,
        _visible: null,
        _fullyvisible: null,
        _init: function() {
            var t = this;
            return this.onWindowResize = function() {
                t.resizeTimer && clearTimeout(t.resizeTimer), t.resizeTimer = setTimeout(function() {
                    t.reload()
                }, 100)
            }, this
        },
        _create: function() {
            this._reload(), t(i).on("resize.jcarousel", this.onWindowResize)
        },
        _destroy: function() {
            t(i).off("resize.jcarousel", this.onWindowResize)
        },
        _reload: function() {
            this.vertical = this.options("vertical"), null == this.vertical && (this.vertical = this.list().height() > this.list().width()), this.rtl = this.options("rtl"), null == this.rtl && (this.rtl = function(i) {
                if ("rtl" === ("" + i.attr("dir")).toLowerCase()) return !0;
                var s = !1;
                return i.parents("[dir]").each(function() {
                    return /rtl/i.test(t(this).attr("dir")) ? (s = !0, !1) : void 0
                }), s
            }(this._element)), this.lt = this.vertical ? "top" : "left", this._list = null, this._items = null;
            var i = this._target && this.index(this._target) >= 0 ? this._target : this.closest();
            this.circular = "circular" === this.options("wrap"), this.underflow = !1;
            var s = {
                left: 0,
                top: 0
            };
            return i.size() > 0 && (this._prepare(i), this.list().find("[data-jcarousel-clone]").remove(), this._items = null, this.underflow = this._fullyvisible.size() >= this.items().size(), this.circular = this.circular && !this.underflow, s[this.lt] = this._position(i) + "px"), this.move(s), this
        },
        list: function() {
            if (null === this._list) {
                var i = this.options("list");
                this._list = t.isFunction(i) ? i.call(this) : this._element.find(i)
            }
            return this._list
        },
        items: function() {
            if (null === this._items) {
                var i = this.options("items");
                this._items = (t.isFunction(i) ? i.call(this) : this.list().find(i)).not("[data-jcarousel-clone]")
            }
            return this._items
        },
        index: function(t) {
            return this.items().index(t)
        },
        closest: function() {
            var i, e = this,
                r = this.list().position()[this.lt],
                n = t(),
                o = !1,
                a = this.vertical ? "bottom" : this.rtl ? "left" : "right";
            return this.rtl && !this.vertical && (r = -1 * (r + this.list().width() - this.clipping())), this.items().each(function() {
                if (n = t(this), o) return !1;
                var l = e.dimension(n);
                if (r += l, r >= 0) {
                    if (i = l - s(n.css("margin-" + a)), !(0 >= Math.abs(r) - l + i / 2)) return !1;
                    o = !0
                }
            }), n
        },
        target: function() {
            return this._target
        },
        first: function() {
            return this._first
        },
        last: function() {
            return this._last
        },
        visible: function() {
            return this._visible
        },
        fullyvisible: function() {
            return this._fullyvisible
        },
        hasNext: function() {
            if (!1 === this._trigger("hasnext")) return !0;
            var t = this.options("wrap"),
                i = this.items().size() - 1;
            return i >= 0 && (t && "first" !== t || i > this.index(this._last) || this.tail && !this.inTail) ? !0 : !1
        },
        hasPrev: function() {
            if (!1 === this._trigger("hasprev")) return !0;
            var t = this.options("wrap");
            return this.items().size() > 0 && (t && "last" !== t || this.index(this._first) > 0 || this.tail && this.inTail) ? !0 : !1
        },
        clipping: function() {
            return this._element["inner" + (this.vertical ? "Height" : "Width")]()
        },
        dimension: function(t) {
            return t["outer" + (this.vertical ? "Height" : "Width")](!0)
        },
        scroll: function(i, e, r) {
            if (this.animating) return this;
            if (!1 === this._trigger("scroll", null, [i, e])) return this;
            t.isFunction(e) && (r = e, e = !0);
            var n = t.jCarousel.parseTarget(i);
            if (n.relative) {
                var o, a, l, h, u, c, f, d, _ = this.items().size() - 1,
                    p = Math.abs(n.target),
                    m = this.options("wrap");
                if (n.target > 0) {
                    var v = this.index(this._last);
                    if (v >= _ && this.tail) this.inTail ? "both" === m || "last" === m ? this._scroll(0, e, r) : this._scroll(Math.min(this.index(this._target) + p, _), e, r) : this._scrollTail(e, r);
                    else if (o = this.index(this._target), this.underflow && o === _ && ("circular" === m || "both" === m || "last" === m) || !this.underflow && v === _ && ("both" === m || "last" === m)) this._scroll(0, e, r);
                    else if (l = o + p, this.circular && l > _) {
                        for (d = _, u = this.items().get(-1); l > d++;) u = this.items().eq(0), c = this._visible.index(u) >= 0, c && u.after(u.clone(!0).attr("data-jcarousel-clone", !0)), this.list().append(u), c || (f = {}, f[this.lt] = this.dimension(u) * (this.rtl ? -1 : 1), this.moveBy(f)), this._items = null;
                        this._scroll(u, e, r)
                    } else this._scroll(Math.min(l, _), e, r)
                } else if (this.inTail) this._scroll(Math.max(this.index(this._first) - p + 1, 0), e, r);
                else if (a = this.index(this._first), o = this.index(this._target), h = this.underflow ? o : a, l = h - p, 0 >= h && (this.underflow && "circular" === m || "both" === m || "first" === m)) this._scroll(_, e, r);
                else if (this.circular && 0 > l) {
                    for (d = l, u = this.items().get(0); 0 > d++;) {
                        u = this.items().eq(-1), c = this._visible.index(u) >= 0, c && u.after(u.clone(!0).attr("data-jcarousel-clone", !0)), this.list().prepend(u), this._items = null;
                        var g = s(this.list().position()[this.lt]),
                            y = this.dimension(u);
                        this.rtl && !this.vertical ? g += y : g -= y, f = {}, f[this.lt] = g + "px", this.move(f)
                    }
                    this._scroll(u, e, r)
                } else this._scroll(Math.max(l, 0), e, r)
            } else this._scroll(n.target, e, r);
            return this._trigger("scrollend"), this
        },
        moveBy: function(t, i) {
            var e = this.list().position();
            return t.left && (t.left = e.left + s(t.left) + "px"), t.top && (t.top = e.top + s(t.top) + "px"), this.move(t, i)
        },
        move: function(i, s) {
            s = s || {};
            var e = this.options("transitions"),
                r = !!e,
                n = !!e.transforms,
                o = !!e.transforms3d,
                a = s.duration || 0,
                l = this.list();
            if (!r && a > 0) return l.animate(i, s), void 0;
            var h = s.complete || t.noop,
                u = {};
            if (r) {
                var c = l.css(["transitionDuration", "transitionTimingFunction", "transitionProperty"]),
                    f = h;
                h = function() {
                    t(this).css(c), f.call(this)
                }, u = {
                    transitionDuration: (a > 0 ? a / 1e3 : 0) + "s",
                    transitionTimingFunction: e.easing || s.easing,
                    transitionProperty: a > 0 ? function() {
                        return n || o ? "all" : i.left ? "left" : "top"
                    }() : "none",
                    transform: "none"
                }
            }
            o ? u.transform = "translate3d(" + (i.left || 0) + "," + (i.top || 0) + ",0)" : n ? u.transform = "translate(" + (i.left || 0) + "," + (i.top || 0) + ")" : t.extend(u, i), r && a > 0 && l.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", h), l.css(u), 0 >= a && l.each(function() {
                h.call(this)
            })
        },
        _scroll: function(i, e, r) {
            if (this.animating) return t.isFunction(r) && r.call(this, !1), this;
            if ("object" != typeof i ? i = this.items().eq(i) : i.jquery === void 0 && (i = t(i)), 0 === i.size()) return t.isFunction(r) && r.call(this, !1), this;
            this.inTail = !1, this._prepare(i);
            var n = this._position(i),
                o = s(this.list().position()[this.lt]);
            if (n === o) return t.isFunction(r) && r.call(this, !1), this;
            var a = {};
            return a[this.lt] = n + "px", this._animate(a, e, r), this
        },
        _scrollTail: function(i, s) {
            if (this.animating || !this.tail) return t.isFunction(s) && s.call(this, !1), this;
            var e = this.list().position()[this.lt];
            this.rtl ? e += this.tail : e -= this.tail, this.inTail = !0;
            var r = {};
            return r[this.lt] = e + "px", this._update({
                target: this._target.next(),
                fullyvisible: this._fullyvisible.slice(1).add(this._visible.last())
            }), this._animate(r, i, s), this
        },
        _animate: function(i, s, e) {
            if (e = e || t.noop, !1 === this._trigger("animate")) return e.call(this, !1), this;
            this.animating = !0;
            var r = this.options("animation"),
                n = t.proxy(function() {
                    this.animating = !1;
                    var t = this.list().find("[data-jcarousel-clone]");
                    t.size() > 0 && (t.remove(), this._reload()), this._trigger("animateend"), e.call(this, !0)
                }, this),
                o = "object" == typeof r ? t.extend({}, r) : {
                    duration: r
                },
                a = o.complete || t.noop;
            return s === !1 ? o.duration = 0 : t.fx.speeds[o.duration] !== void 0 && (o.duration = t.fx.speeds[o.duration]), o.complete = function() {
                n(), a.call(this)
            }, this.move(i, o), this
        },
        _prepare: function(i) {
            var e, r, n, o = this.index(i),
                a = o,
                l = this.dimension(i),
                h = this.clipping(),
                u = this.vertical ? "bottom" : this.rtl ? "left" : "right",
                c = this.options("center"),
                f = {
                    target: i,
                    first: i,
                    last: i,
                    visible: i,
                    fullyvisible: h >= l ? i : t()
                };
            if (c && (l /= 2, h /= 2), h > l)
                for (;;) {
                    if (e = this.items().eq(++a), 0 === e.size()) {
                        if (!this.circular) break;
                        if (e = this.items().eq(0), i.get(0) === e.get(0)) break;
                        if (r = this._visible.index(e) >= 0, r && e.after(e.clone(!0).attr("data-jcarousel-clone", !0)), this.list().append(e), !r) {
                            var d = {};
                            d[this.lt] = this.dimension(e) * (this.rtl ? -1 : 1), this.moveBy(d)
                        }
                        this._items = null
                    }
                    if (l += this.dimension(e), f.last = e, f.visible = f.visible.add(e), n = s(e.css("margin-" + u)), h >= l - n && (f.fullyvisible = f.fullyvisible.add(e)), l >= h) break
                }
            if (!this.circular && !c && h > l)
                for (a = o;;) {
                    if (0 > --a) break;
                    if (e = this.items().eq(a), 0 === e.size()) break;
                    if (l += this.dimension(e), f.first = e, f.visible = f.visible.add(e), n = s(e.css("margin-" + u)), h >= l - n && (f.fullyvisible = f.fullyvisible.add(e)), l >= h) break
                }
            return this._update(f), this.tail = 0, c || "circular" === this.options("wrap") || "custom" === this.options("wrap") || this.index(f.last) !== this.items().size() - 1 || (l -= s(f.last.css("margin-" + u)), l > h && (this.tail = l - h)), this
        },
        _position: function(t) {
            var i = this._first,
                s = i.position()[this.lt],
                e = this.options("center"),
                r = e ? this.clipping() / 2 - this.dimension(i) / 2 : 0;
            return this.rtl && !this.vertical ? (s -= this.clipping() - this.dimension(i), s += r) : s -= r, !e && (this.index(t) > this.index(i) || this.inTail) && this.tail ? (s = this.rtl ? s - this.tail : s + this.tail, this.inTail = !0) : this.inTail = !1, -s
        },
        _update: function(i) {
            var s, e = this,
                r = {
                    target: this._target || t(),
                    first: this._first || t(),
                    last: this._last || t(),
                    visible: this._visible || t(),
                    fullyvisible: this._fullyvisible || t()
                },
                n = this.index(i.first || r.first) < this.index(r.first),
                o = function(s) {
                    var o = [],
                        a = [];
                    i[s].each(function() {
                        0 > r[s].index(this) && o.push(this)
                    }), r[s].each(function() {
                        0 > i[s].index(this) && a.push(this)
                    }), n ? o = o.reverse() : a = a.reverse(), e._trigger("item" + s + "in", t(o)), e._trigger("item" + s + "out", t(a)), e["_" + s] = i[s]
                };
            for (s in i) o(s);
            return this
        }
    })
}(jQuery, window),
function(t) {
    "use strict";
    t.jcarousel.fn.scrollIntoView = function(i, s, e) {
        var r, n = t.jCarousel.parseTarget(i),
            o = this.index(this._fullyvisible.first()),
            a = this.index(this._fullyvisible.last());
        if (r = n.relative ? 0 > n.target ? Math.max(0, o + n.target) : a + n.target : "object" != typeof n.target ? n.target : this.index(n.target), o > r) return this.scroll(r, s, e);
        if (r >= o && a >= r) return t.isFunction(e) && e.call(this, !1), this;
        for (var l, h = this.items(), u = this.clipping(), c = this.vertical ? "bottom" : this.rtl ? "left" : "right", f = 0;;) {
            if (l = h.eq(r), 0 === l.size()) break;
            if (f += this.dimension(l), f >= u) {
                var d = parseFloat(l.css("margin-" + c)) || 0;
                f - d !== u && r++;
                break
            }
            if (0 >= r) break;
            r--
        }
        return this.scroll(r, s, e)
    }
}(jQuery),
function(t) {
    "use strict";
    t.jCarousel.plugin("jcarouselControl", {
        _options: {
            target: "+=1",
            event: "click",
            method: "scroll"
        },
        _active: null,
        _init: function() {
            this.onDestroy = t.proxy(function() {
                this._destroy(), this.carousel().one("createend.jcarousel", t.proxy(this._create, this))
            }, this), this.onReload = t.proxy(this._reload, this), this.onEvent = t.proxy(function(i) {
                i.preventDefault();
                var s = this.options("method");
                t.isFunction(s) ? s.call(this) : this.carousel().jcarousel(this.options("method"), this.options("target"))
            }, this)
        },
        _create: function() {
            this.carousel().one("destroy.jcarousel", this.onDestroy).on("reloadend.jcarousel scrollend.jcarousel", this.onReload), this._element.on(this.options("event") + ".jcarouselcontrol", this.onEvent), this._reload()
        },
        _destroy: function() {
            this._element.off(".jcarouselcontrol", this.onEvent), this.carousel().off("destroy.jcarousel", this.onDestroy).off("reloadend.jcarousel scrollend.jcarousel", this.onReload)
        },
        _reload: function() {
            var i, s = t.jCarousel.parseTarget(this.options("target")),
                e = this.carousel();
            if (s.relative) i = e.jcarousel(s.target > 0 ? "hasNext" : "hasPrev");
            else {
                var r = "object" != typeof s.target ? e.jcarousel("items").eq(s.target) : s.target;
                i = e.jcarousel("target").index(r) >= 0
            }
            return this._active !== i && (this._trigger(i ? "active" : "inactive"), this._active = i), this
        }
    })
}(jQuery),
function(t) {
    "use strict";
    t.jCarousel.plugin("jcarouselPagination", {
        _options: {
            perPage: null,
            item: function(t) {
                return '<a href="#' + t + '">' + t + "</a>"
            },
            event: "click",
            method: "scroll"
        },
        _pages: {},
        _items: {},
        _currentPage: null,
        _init: function() {
            this.onDestroy = t.proxy(function() {
                this._destroy(), this.carousel().one("createend.jcarousel", t.proxy(this._create, this))
            }, this), this.onReload = t.proxy(this._reload, this), this.onScroll = t.proxy(this._update, this)
        },
        _create: function() {
            this.carousel().one("destroy.jcarousel", this.onDestroy).on("reloadend.jcarousel", this.onReload).on("scrollend.jcarousel", this.onScroll), this._reload()
        },
        _destroy: function() {
            this._clear(), this.carousel().off("destroy.jcarousel", this.onDestroy).off("reloadend.jcarousel", this.onReload).off("scrollend.jcarousel", this.onScroll)
        },
        _reload: function() {
            var i = this.options("perPage");
            if (this._pages = {}, this._items = {}, t.isFunction(i) && (i = i.call(this)), null == i) this._pages = this._calculatePages();
            else
                for (var s, e = parseInt(i, 10) || 0, r = this.carousel().jcarousel("items"), n = 1, o = 0;;) {
                    if (s = r.eq(o++), 0 === s.size()) break;
                    this._pages[n] = this._pages[n] ? this._pages[n].add(s) : s, 0 === o % e && n++
                }
            this._clear();
            var a = this,
                l = this.carousel().data("jcarousel"),
                h = this._element,
                u = this.options("item");
            t.each(this._pages, function(i, s) {
                var e = a._items[i] = t(u.call(a, i, s));
                e.on(a.options("event") + ".jcarouselpagination", t.proxy(function() {
                    var t = s.eq(0);
                    if (l.circular) {
                        var e = l.index(l.target()),
                            r = l.index(t);
                        parseFloat(i) > parseFloat(a._currentPage) ? e > r && (t = "+=" + (l.items().size() - e + r)) : r > e && (t = "-=" + (e + (l.items().size() - r)))
                    }
                    l[this.options("method")](t)
                }, a)), h.append(e)
            }), this._update()
        },
        _update: function() {
            var i, s = this.carousel().jcarousel("target");
            t.each(this._pages, function(t, e) {
                return e.each(function() {
                    return s.is(this) ? (i = t, !1) : void 0
                }), i ? !1 : void 0
            }), this._currentPage !== i && (this._trigger("inactive", this._items[this._currentPage]), this._trigger("active", this._items[i])), this._currentPage = i
        },
        items: function() {
            return this._items
        },
        _clear: function() {
            this._element.empty(), this._currentPage = null
        },
        _calculatePages: function() {
            for (var t, i = this.carousel().data("jcarousel"), s = i.items(), e = i.clipping(), r = 0, n = 0, o = 1, a = {};;) {
                if (t = s.eq(n++), 0 === t.size()) break;
                a[o] = a[o] ? a[o].add(t) : t, r += i.dimension(t), r >= e && (o++, r = 0)
            }
            return a
        }
    })
}(jQuery),
function(t) {
    "use strict";
    t.jCarousel.plugin("jcarouselAutoscroll", {
        _options: {
            target: "+=1",
            interval: 3e3,
            autostart: !0
        },
        _timer: null,
        _init: function() {
            this.onDestroy = t.proxy(function() {
                this._destroy(), this.carousel().one("createend.jcarousel", t.proxy(this._create, this))
            }, this), this.onAnimateEnd = t.proxy(this.start, this)
        },
        _create: function() {
            this.carousel().one("destroy.jcarousel", this.onDestroy), this.options("autostart") && this.start()
        },
        _destroy: function() {
            this.stop(), this.carousel().off("destroy.jcarousel", this.onDestroy)
        },
        start: function() {
            return this.stop(), this.carousel().one("animateend.jcarousel", this.onAnimateEnd), this._timer = setTimeout(t.proxy(function() {
                this.carousel().jcarousel("scroll", this.options("target"))
            }, this), this.options("interval")), this
        },
        stop: function() {
            return this._timer && (this._timer = clearTimeout(this._timer)), this.carousel().off("animateend.jcarousel", this.onAnimateEnd), this
        }
    })
}(jQuery);
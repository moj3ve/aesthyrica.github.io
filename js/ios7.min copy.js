!function() {
    "use strict";
    /**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
    function t(e, i) {
        var o;
        if (i = i || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = i.touchBoundary || 10, this.layer = e, this.tapDelay = i.tapDelay || 200, this.tapTimeout = i.tapTimeout || 700, !t.notNeeded(e)) {
            for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = this, c = 0, s = r.length; c < s; c++)
                a[r[c]] = l(a[r[c]], a);
            n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, i) {
                var o = Node.prototype.removeEventListener;
                "click" === t ? o.call(e, t, n.hijacked || n, i) : o.call(e, t, n, i)
            }, e.addEventListener = function(t, n, i) {
                var o = Node.prototype.addEventListener;
                "click" === t ? o.call(e, t, n.hijacked || (n.hijacked = function(t) {
                    t.propagationStopped || n(t)
                }), i) : o.call(e, t, n, i)
            }), "function" == typeof e.onclick && (o = e.onclick, e.addEventListener("click", function(t) {
                o(t)
            }, !1), e.onclick = null)
        }
        function l(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
        n = navigator.userAgent.indexOf("Android") > 0 && !e,
        i = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
        o = i && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        r = i && /OS [6-7]_\d/.test(navigator.userAgent),
        a = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (t.disabled)
                return !0;
            break;
        case "input":
            if (i && "file" === t.type || t.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }, t.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !n;
        case "input":
            switch (t.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !t.disabled && !t.readOnly;
        default:
            return /\bneedsfocus\b/.test(t.className)
        }
    }, t.prototype.sendClick = function(t, e) {
        var n,
            i;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(), i = e.changedTouches[0], (n = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(t), !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
    }, t.prototype.determineEventType = function(t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }, t.prototype.focus = function(t) {
        var e;
        i && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
    }, t.prototype.updateScrollParent = function(t) {
        var e,
            n;
        if (!(e = t.fastClickScrollParent) || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n, t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }, t.prototype.getTargetElementFromEventTarget = function(t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }, t.prototype.onTouchStart = function(t) {
        var e,
            n,
            r;
        if (t.targetTouches.length > 1)
            return !0;
        if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], i) {
            if ((r = window.getSelection()).rangeCount && !r.isCollapsed)
                return !0;
            if (!o) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier)
                    return t.preventDefault(), !1;
                this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
    }, t.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0],
            n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n
    }, t.prototype.onTouchMove = function(t) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0)
    }, t.prototype.findControl = function(t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, t.prototype.onTouchEnd = function(t) {
        var e,
            a,
            c,
            s,
            l,
            u = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0, !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (l = t.changedTouches[0], (u = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || u).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (c = u.tagName.toLowerCase())) {
            if (e = this.findControl(u)) {
                if (this.focus(u), n)
                    return !1;
                u = e
            }
        } else if (this.needsFocus(u))
            return t.timeStamp - a > 100 || i && window.top !== window && "input" === c ? (this.targetElement = null, !1) : (this.focus(u), this.sendClick(u, t), i && "select" === c || (this.targetElement = null, t.preventDefault()), !1);
        return !(!i || o || !(s = u.fastClickScrollParent) || s.fastClickLastScrollTop === s.scrollTop) || (this.needsClick(u) || (t.preventDefault(), this.sendClick(u, t)), !1)
    }, t.prototype.onTouchCancel = function() {
        this.trackingClick = !1, this.targetElement = null
    }, t.prototype.onMouse = function(t) {
        return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1))))
    }, t.prototype.onClick = function(t) {
        var e;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail || ((e = this.onMouse(t)) || (this.targetElement = null), e)
    }, t.prototype.destroy = function() {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, t.notNeeded = function(t) {
        var e,
            i,
            o;
        if (void 0 === window.ontouchstart)
            return !0;
        if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n)
                return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no"))
                    return !0;
                if (i > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (a && (o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] >= 10 && o[2] >= 3 && (e = document.querySelector("meta[name=viewport]"))) {
            if (-1 !== e.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction))
    }, t.attach = function(e, n) {
        return new t(e, n)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}(), /*! Basic iOS 7 CSS // Apache License 2.0 // hbang.ws */
function(t) {
    "use strict";
    var e = t.documentElement,
        n = e.classList;
    if (-1 != navigator.userAgent.indexOf("Cydia") ? (-1 != t.title.indexOf(" · ") && (t.title = t.title.split(" · ")[0]), n.add("cydia")) : n.remove("cydia", "depiction"), "devicePixelRatio" in window && devicePixelRatio >= 2) {
        var i = t.createElement("div");
        i.style.border = ".5px solid transparent", e.appendChild(i), i.offsetHeight > 0 && n.add("has-subpixel"), devicePixelRatio >= 3 && n.add("has-subpixel-3x"), e.removeChild(i), "FastClick" in window && e.addEventListener("DOMContentLoaded", function() {
            FastClick.attach(e.body)
        })
    }
}(document);



(function(f, e) {
    function c(a, b) {
        function d(a, b) {
            return function() {
                return a.apply(b, arguments)
            }
        }
        b = b || {};
        this.trackingClick = !1;
        this.trackingClickStart = 0;
        this.targetElement = null;
        this.lastTouchIdentifier = this.touchStartY = this.touchStartX = 0;
        this.touchBoundary = b.touchBoundary || 10;
        this.layer = a;
        this.tapDelay = b.tapDelay || 200;
        this.tapTimeout = b.tapTimeout || 700;
        if (!c.notNeeded(a)) {
            for (var l = "onMouse onClick onTouchStart onTouchMove onTouchEnd onTouchCancel".split(" "), e = 0, f = l.length; e < f; e++)
                this[l[e]] = d(this[l[e]], this);
            h && (a.addEventListener("mouseover", this.onMouse, !0), a.addEventListener("mousedown", this.onMouse, !0), a.addEventListener("mouseup", this.onMouse, !0));
            a.addEventListener("click", this.onClick, !0);
            a.addEventListener("touchstart", this.onTouchStart, !1);
            a.addEventListener("touchmove", this.onTouchMove, !1);
            a.addEventListener("touchend", this.onTouchEnd, !1);
            a.addEventListener("touchcancel", this.onTouchCancel, !1);
            Event.prototype.stopImmediatePropagation || (a.removeEventListener = function(b, d, c) {
                var e = Node.prototype.removeEventListener;
                "click" === b ? e.call(a, b, d.hijacked || d, c) : e.call(a, b, d, c)
            }, a.addEventListener = function(b, d, c) {
                var e = Node.prototype.addEventListener;
                "click" === b ? e.call(a, b, d.hijacked || (d.hijacked = function(a) {
                    a.propagationStopped || d(a)
                }), c) : e.call(a, b, d, c)
            });
            if ("function" === typeof a.onclick) {
                var g = a.onclick;
                a.addEventListener("click", function(a) {
                    g(a)
                }, !1);
                a.onclick = null
            }
        }
    }
    var k = navigator.userAgent,
        m = 0 <= k.indexOf("Windows Phone"),
        h = 0 < k.indexOf("Android") && !m,
        g = /iP(ad|hone|od)/.test(k) && !m,
        n = g && /OS 4_\d(_\d)?/.test(k),
        p = g && /OS [6-7]_\d/.test(k),
        q = 0 < k.indexOf("BB10");
    c.prototype.needsClick = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (a.disabled)
                return !0;
            break;
        case "input":
            if (g && "file" === a.type || a.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(a.className)
    };
    c.prototype.needsFocus = function(a) {
        switch (a.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !h;
        case "input":
            switch (a.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !a.disabled && !a.readOnly;
        default:
            return /\bneedsfocus\b/.test(a.className)
        }
    };
    c.prototype.sendClick = function(a, b) {
        e.activeElement && e.activeElement !== a && e.activeElement.blur();
        var d = b.changedTouches[0];
        var c = e.createEvent("MouseEvents");
        c.initMouseEvent(this.determineEventType(a), !0, !0, f, 1, d.screenX, d.screenY, d.clientX, d.clientY, !1, !1, !1, !1, 0, null);
        c.forwardedTouchEvent = !0;
        a.dispatchEvent(c)
    };
    c.prototype.determineEventType = function(a) {
        return h && "select" === a.tagName.toLowerCase() ? "mousedown" : "click"
    };
    c.prototype.focus = function(a) {
        if (g && a.setSelectionRange && 0 !== a.type.indexOf("date") && "time" !== a.type && "month" !== a.type && "email" !== a.type) {
            var b = a.value.length;
            a.setSelectionRange(b, b)
        } else
            a.focus()
    };
    c.prototype.updateScrollParent = function(a) {
        var b = a.fastClickScrollParent;
        if (!b || !b.contains(a)) {
            var d = a;
            do {
                if (d.scrollHeight > d.offsetHeight) {
                    b = d;
                    a.fastClickScrollParent = d;
                    break
                }
                d = d.parentElement
            } while (d)
        }
        b && (b.fastClickLastScrollTop = b.scrollTop)
    };
    c.prototype.getTargetElementFromEventTarget = function(a) {
        return a.nodeType === Node.TEXT_NODE ? a.parentNode : a
    };
    c.prototype.onTouchStart = function(a) {
        if (1 < a.targetTouches.length)
            return !0;
        var b = this.getTargetElementFromEventTarget(a.target);
        var d = a.targetTouches[0];
        if (g) {
            var c = f.getSelection();
            if (c.rangeCount && !c.isCollapsed)
                return !0;
            if (!n) {
                if (d.identifier && d.identifier === this.lastTouchIdentifier)
                    return a.preventDefault(), !1;
                this.lastTouchIdentifier = d.identifier;
                this.updateScrollParent(b)
            }
        }
        this.trackingClick = !0;
        this.trackingClickStart = a.timeStamp;
        this.targetElement = b;
        this.touchStartX = d.pageX;
        this.touchStartY = d.pageY;
        a.timeStamp - this.lastClickTime < this.tapDelay && a.preventDefault();
        return !0
    };
    c.prototype.touchHasMoved = function(a) {
        a = a.changedTouches[0];
        var b = this.touchBoundary;
        return Math.abs(a.pageX - this.touchStartX) > b || Math.abs(a.pageY - this.touchStartY) > b ? !0 : !1
    };
    c.prototype.onTouchMove = function(a) {
        if (!this.trackingClick)
            return !0;
        if (this.targetElement !== this.getTargetElementFromEventTarget(a.target) || this.touchHasMoved(a))
            this.trackingClick = !1, this.targetElement = null;
        return !0
    };
    c.prototype.findControl = function(a) {
        return void 0 !== a.control ? a.control : a.htmlFor ? e.getElementById(a.htmlFor) : a.querySelector("button,input:not([type=hidden]),keygen,meter,output,progress,select,textarea")
    };
    c.prototype.onTouchEnd = function(a) {
        var b = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (a.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0;
        if (a.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        this.cancelNextClick = !1;
        this.lastClickTime = a.timeStamp;
        var d = this.trackingClickStart;
        this.trackingClick = !1;
        this.trackingClickStart = 0;
        if (p) {
            var c = a.changedTouches[0];
            b = e.elementFromPoint(c.pageX - f.pageXOffset, c.pageY - f.pageYOffset) || b;
            b.fastClickScrollParent = this.targetElement.fastClickScrollParent
        }
        c = b.tagName.toLowerCase();
        if ("label" === c) {
            if (d = this.findControl(b)) {
                this.focus(b);
                if (h)
                    return !1;
                b = d
            }
        } else if (this.needsFocus(b)) {
            if (100 < a.timeStamp - d || g && f.top !== f && "input" === c)
                return this.targetElement = null, !1;
            this.focus(b);
            this.sendClick(b, a);
            g && "select" === c || (this.targetElement = null, a.preventDefault());
            return !1
        }
        if (g && !n && (d = b.fastClickScrollParent) && d.fastClickLastScrollTop !== d.scrollTop)
            return !0;
        this.needsClick(b) || (a.preventDefault(), this.sendClick(b, a));
        return !1
    };
    c.prototype.onTouchCancel = function() {
        this.trackingClick = !1;
        this.targetElement = null
    };
    c.prototype.onMouse = function(a) {
        return this.targetElement && !a.forwardedTouchEvent && a.cancelable ? !this.needsClick(this.targetElement) || this.cancelNextClick ? (a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.propagationStopped = !0, a.stopPropagation(), a.preventDefault(), !1) : !0 : !0
    };
    c.prototype.onClick = function(a) {
        if (this.trackingClick)
            return this.targetElement = null, this.trackingClick = !1, !0;
        if ("submit" === a.target.type && 0 === a.detail)
            return !0;
        a = this.onMouse(a);
        a || (this.targetElement = null);
        return a
    };
    c.prototype.destroy = function() {
        var a = this.layer;
        h && (a.removeEventListener("mouseover", this.onMouse, !0), a.removeEventListener("mousedown", this.onMouse, !0), a.removeEventListener("mouseup", this.onMouse, !0));
        a.removeEventListener("click", this.onClick, !0);
        a.removeEventListener("touchstart", this.onTouchStart, !1);
        a.removeEventListener("touchmove", this.onTouchMove, !1);
        a.removeEventListener("touchend", this.onTouchEnd, !1);
        a.removeEventListener("touchcancel", this.onTouchCancel, !1)
    };
    c.notNeeded = function(a) {
        var b,
            c;
        if ("undefined" === typeof f.ontouchstart)
            return !0;
        if (c = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1])
            if (h) {
                if ((b = e.querySelector("meta[name=viewport]")) && (-1 !== b.content.indexOf("user-scalable=no") || 31 < c && e.documentElement.scrollWidth <= f.outerWidth))
                    return !0
            } else
                return !0;
        return q && (b = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), 10 <= b[1] && 3 <= b[2] && (b = e.querySelector("meta[name=viewport]")) && (-1 !== b.content.indexOf("user-scalable=no") || e.documentElement.scrollWidth <= f.outerWidth)) || "none" === a.style.msTouchAction || "manipulation" === a.style.touchAction || 27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (b = e.querySelector("meta[name=viewport]")) && (-1 !== b.content.indexOf("user-scalable=no") || e.documentElement.scrollWidth <= f.outerWidth) ? !0 : "none" === a.style.touchAction || "manipulation" === a.style.touchAction ? !0 : !1
    };
    c.attach = function(a, b) {
        return new c(a, b)
    };
    f.FastClick = c
})(window, document);
(function(a) {
    "use strict";
    var b = a.documentElement,
        c = b.classList;
    navigator.userAgent.indexOf("Cydia") != -1 ? (a.title.indexOf(" \u00b7 ") != -1 ? a.title = a.title.split(" \u00b7 ")[0] : void 0, c.add("cydia")) : c.remove("cydia", "depiction");
    if (window.devicePixelRatio > 1) {
        var d = a.createElement("div");
        d.style.border = ".5px solid transparent";
        b.appendChild(d);
        if (d.offsetHeight)
            c.add("has-subpixel");
        b.removeChild(d);
        if (devicePixelRatio >= 3)
            c.add("has-subpixel-3x")
    }
    if (window.FastClick)
        a.addEventListener("DOMContentLoaded", function() {
            FastClick.attach(a.body)
        })
}(document));
(function(document) {
    "use strict";
    var promo = document.querySelector("#promo");
    if (promo) {
        var promos = document.querySelectorAll("#promo li");
        var chosenOne = Math.floor(Math.random() * promos.length);
        for (var i = 0; i < promos.length; i++) {
            if (i != chosenOne) {
                promo.removeChild(promos[i]);
            }
        }
        promo.classList.add("show");
    }
    if (document.documentElement.classList.contains("cydia")) {
        var base = document.createElement("base");
        base.target = "_open";
        document.head.appendChild(base);
    }
    function parseVersionString(version) {
        var bits = version.split(".");
        return [bits[0], bits[1] ? bits[1] : 0, bits[2] ? bits[2] : 0];
    }
    function compareVersions(ours, theirs) {
        for (var i = 0; i < 4; i++) {
            var a = Number(theirs[i]),
                b = Number(ours[i]);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            }
        }
        return 0;
    }
    var prerequisite = document.querySelector(".prerequisite"),
        version = navigator.appVersion.match(/CPU (iPhone )?OS (\d+)_(\d+)(_(\d+))? like/i);
    if (!prerequisite || !version) {
        return;
    }
    var osVersion = [version[2], version[3], version[5] ? version[5] : 0],
        osString = osVersion[0] + "." + osVersion[1] + (osVersion[2] && osVersion[2] != 0 ? "." + osVersion[2] : ""),
        minString = prerequisite.dataset.minIos,
        maxString = prerequisite.dataset.maxIos,
        minVersion = parseVersionString(minString),
        maxVersion = maxString ? parseVersionString(maxString) : null,
        message = "supported",
        map = [];
    if (compareVersions(minVersion, osVersion) == -1) {
        message = "needs-upgrade";
        map = [minString];
    } else if (maxVersion != null && compareVersions(osVersion, maxVersion) == -1) {
        if ("unsupported" in prerequisite.dataset) {
            message = "unsupported";
            map = [minString, maxString];
        } else {
            message = "unconfirmed";
            map = [osString];
        }
    }
    var i = 0;
    prerequisite.querySelector("p").innerHTML = document.querySelector("#prerequisite-" + message).innerText.replace(/%s/g, function() {
        return map[i++];
    });
    prerequisite.classList.add("show");
}(document));


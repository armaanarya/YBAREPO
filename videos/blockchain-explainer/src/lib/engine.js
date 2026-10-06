(function () {
  // Whiteboard draw-on engine (from the whiteboard-animation skill): every
  // stroke's dashoffset and the hand position are pure functions of scene time t,
  // driven by one paused GSAP tween, so any frame can be seeked exactly.
  var SID = "__SID__";
  var S = __SCHEDULE__;
  var ANGLE = __ANGLE__;
  var REST = { x: 2080, y: 1260 };
  var $ = function (id) {
    return document.getElementById(SID + "-" + id);
  };
  var hand = $("hand");
  var wipe = $("wipe");
  var edge = $("edge");
  var clamp = function (v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  };
  var EASE = {
    lin: function (k) { return k; },
    out: function (k) { return 1 - (1 - k) * (1 - k); },
    io: function (k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; },
  };

  function pathsOf(id) {
    var el = $(id);
    if (!el) throw new Error(SID + ": missing #" + id);
    if (el.tagName.toLowerCase() === "path") return [el];
    return Array.prototype.slice.call(el.querySelectorAll("path.ink"));
  }

  var strokes = [];
  var handStrokes = [];
  S.beats.forEach(function (bt) {
    var ps = [];
    bt.t.forEach(function (id) { ps = ps.concat(pathsOf(id)); });
    var lens = ps.map(function (p) { return p.getTotalLength(); });
    if (bt.parallel) {
      ps.forEach(function (p, i) { strokes.push({ el: p, len: lens[i], a: bt.a, b: bt.b }); });
      return;
    }
    var n = ps.length;
    var span = bt.b - bt.a;
    var gap = n > 1 ? Math.min(bt.gap != null ? bt.gap : 0.09, (span * 0.3) / (n - 1)) : 0;
    var wts = lens.map(function (l) { return l + 18; });
    var W = wts.reduce(function (x, y) { return x + y; }, 0);
    var D = span - gap * (n - 1);
    var t = bt.a;
    ps.forEach(function (p, i) {
      var d = (D * wts[i]) / W;
      var s = { el: p, len: lens[i], a: t, b: t + d };
      strokes.push(s);
      if (bt.hand) handStrokes.push(s);
      t += d + gap;
    });
  });
  handStrokes.sort(function (x, y) { return x.a - y.a; });
  strokes.forEach(function (s) {
    s.el.style.strokeDasharray = s.len + " " + (s.len + 4);
    s.p0 = s.el.getPointAtLength(0);
    s.p1 = s.el.getPointAtLength(s.len);
  });

  var groups = {};
  S.tweens.forEach(function (x) {
    var k = x.t + "|" + x.p;
    (groups[k] = groups[k] || []).push(x);
  });
  var tweenGroups = Object.keys(groups).map(function (k) {
    var parts = k.split("|");
    var list = groups[k].sort(function (a, b) { return a.a - b.a; });
    return { el: parts[0] === "wipe" ? wipe : $(parts[0]), p: parts[1], list: list };
  });

  function pt(s, k) {
    if (k <= 0) return s.p0;
    if (k >= 1) return s.p1;
    return s.el.getPointAtLength(s.len * k);
  }
  function lerp(a, b, u, lift) {
    return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, lift: lift || 0 };
  }

  function handPos(t) {
    var H = handStrokes;
    if (!H.length) return { x: REST.x, y: REST.y, lift: 0 };
    var i = -1;
    for (var j = 0; j < H.length; j++) {
      if (H[j].a <= t) i = j;
      else break;
    }
    if (i >= 0 && t <= H[i].b) {
      var p = pt(H[i], clamp((t - H[i].a) / (H[i].b - H[i].a)));
      return { x: p.x, y: p.y, lift: 0 };
    }
    var prev = i >= 0 ? H[i] : null;
    var next = H[i + 1] || null;
    var from = prev ? prev.p1 : REST;
    var to = next ? next.p0 : REST;
    var t0 = prev ? prev.b : -10;
    var t1 = next ? next.a : S.dur + 10;
    var gap = t1 - t0;
    if (prev && next && gap <= 0.9) {
      var u = EASE.io(clamp((t - t0) / gap));
      var dist = Math.hypot(to.x - from.x, to.y - from.y);
      return lerp(from, to, u, Math.sin(Math.PI * u) * Math.min(16, 3 + dist * 0.03));
    }
    var EX = 0.45;
    if (prev && t < t0 + EX) return lerp(from, REST, EASE.io(clamp((t - t0) / EX)));
    if (next && t > t1 - EX) return lerp(REST, to, EASE.io(clamp((t - (t1 - EX)) / EX)));
    return { x: REST.x, y: REST.y, lift: 0 };
  }

  function apply(el, p, v) {
    if (p === "opacity") el.style.opacity = v;
    else if (p === "wipe") {
      el.style.clipPath = v <= 0 ? "none" : "inset(0 0 0 " + v + "%)";
      edge.style.opacity = v > 0 && v < 100 ? 1 : 0;
      edge.style.transform = "translateX(" + (v * 19.2 - 60) + "px)";
    }
  }

  function render(t) {
    for (var i = 0; i < strokes.length; i++) {
      var s = strokes[i];
      var k = clamp((t - s.a) / (s.b - s.a));
      s.el.style.strokeDashoffset = s.len * (1 - k);
      s.el.style.visibility = k > 0 ? "visible" : "hidden";
    }
    tweenGroups.forEach(function (g) {
      var v = g.list[0].f;
      g.list.forEach(function (x) {
        if (t >= x.a) v = x.f + (x.to - x.f) * EASE[x.e || "io"](clamp((t - x.a) / Math.max(1e-6, x.b - x.a)));
      });
      apply(g.el, g.p, v);
    });
    var h = handPos(t);
    var ang = ANGLE + ((h.x - 960) / 960) * 4 - ((h.y - 540) / 540) * 2;
    hand.setAttribute(
      "transform",
      "translate(" + h.x.toFixed(2) + " " + (h.y - h.lift).toFixed(2) + ") rotate(" + ang.toFixed(2) + ")",
    );
  }

  // A getter/setter clock: GSAP assigns clock.t on every seek, which repaints the board.
  var now = 0;
  var clock = {};
  Object.defineProperty(clock, "t", {
    get: function () { return now; },
    set: function (v) { now = v; render(v); },
  });
  var tl = gsap.timeline({ paused: true });
  tl.fromTo(clock, { t: 0 }, { t: S.dur, duration: S.dur, ease: "none" }, 0);
  render(0);
  window.__debugBoards = window.__debugBoards || {};
  window.__debugBoards[SID] = { render: render, strokes: strokes, hand: handStrokes };
  window.__timelines[SID] = tl;
})();

// Board: collects one scene's SVG ink and its draw schedule.
// Every drawable is an open <path class="ink">; the runtime engine reveals it
// with stroke-dashoffset and parks the marker nib on the growing tip.
import rough from "roughjs";
import { textGlyphs, measure } from "./font.mjs";

const gen = rough.generator();
export const INK = "#161616";
export const GRAY = "#8a8a86";
export const LIGHT = "#b9b9b4";

const round = (d) => d.replace(/-?\d+\.\d{2,}/g, (n) => (+n).toFixed(1));

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");

export class Board {
  constructor(sid, { words, head, dur, speechEnd }) {
    this.sid = sid;
    this.words = words;
    this.head = head;
    this.dur = dur;
    this.speechEnd = speechEnd;
    this.seed = [...sid].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 100000;
    this.rand = mulberry32(this.seed);
    this.root = { id: "content", children: [], attrs: "" };
    this.stack = [this.root];
    this.beats = [];
    this.tweens = [];
    this.n = 0;
  }

  // ---- timing -------------------------------------------------------------
  _find(text, nth) {
    const want = norm(text);
    let seen = 0;
    for (const w of this.words) {
      if (norm(w.text) === want && ++seen === nth) return w;
    }
    throw new Error(`${this.sid}: word "${text}" #${nth} not found`);
  }
  w(text, nth = 1) {
    return +(this.head + this._find(text, nth).start).toFixed(3);
  }
  we(text, nth = 1) {
    return +(this.head + Math.min(this._find(text, nth).end, this.speechEnd)).toFixed(3);
  }

  // ---- structure ----------------------------------------------------------
  // Auto ids start with "_" so they never collide with the readable ids scenes pass in.
  uid(prefix = "e") {
    return `_${prefix}${++this.n}`;
  }
  group(name, fn, attrs = "") {
    const g = { id: name || this.uid("g"), children: [], attrs };
    this.stack.at(-1).children.push(g);
    this.stack.push(g);
    fn();
    this.stack.pop();
    return g.id;
  }
  raw(markup) {
    this.stack.at(-1).children.push(markup);
  }
  ink(d, { w = 6, color = INK, id } = {}) {
    id = id || this.uid("p");
    this.raw(
      `<path id="${this.sid}-${id}" class="ink" d="${round(d)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
    return id;
  }
  // A filled shape that fades in after its outline is drawn (starts hidden).
  fill(d, { color = INK, opacity = 1, id } = {}) {
    id = id || this.uid("f");
    this.raw(`<path id="${this.sid}-${id}" d="${round(d)}" fill="${color}" style="opacity:0" data-o="${opacity}"/>`);
    return id;
  }

  // ---- rough primitives (single stroke each) ------------------------------
  _rough(drawable) {
    return gen.toPaths(drawable)[0].d;
  }
  _opts(o = {}) {
    return {
      seed: Math.floor(this.rand() * 1e6) + 1,
      roughness: o.roughness ?? 0.9,
      bowing: o.bowing ?? 0.8,
      disableMultiStroke: true,
      preserveVertices: o.preserveVertices ?? false,
    };
  }
  line(x1, y1, x2, y2, o = {}) {
    return this.ink(this._rough(gen.line(x1, y1, x2, y2, this._opts(o))), o);
  }
  poly(points, o = {}) {
    return this.ink(this._rough(gen.linearPath(points, this._opts(o))), o);
  }
  curve(points, o = {}) {
    return this.ink(this._rough(gen.curve(points, this._opts(o))), o);
  }
  rect(x, y, w, h, o = {}) {
    return this.ink(this._rough(gen.rectangle(x, y, w, h, this._opts(o))), o);
  }
  circle(cx, cy, d, o = {}) {
    return this.ink(this._rough(gen.circle(cx, cy, d, this._opts({ roughness: 0.6, ...o }))), o);
  }
  ellipse(cx, cy, w, h, o = {}) {
    return this.ink(this._rough(gen.ellipse(cx, cy, w, h, this._opts({ roughness: 0.6, ...o }))), o);
  }
  arc(cx, cy, w, h, start, stop, o = {}) {
    return this.ink(this._rough(gen.arc(cx, cy, w, h, start, stop, false, this._opts({ roughness: 0.5, ...o }))), o);
  }
  path(d, o = {}) {
    return this.ink(this._rough(gen.path(d, this._opts(o))), o);
  }

  // ---- handwriting --------------------------------------------------------
  text(str, x, y, size, o = {}) {
    const w = o.w ?? Math.max(3.2, Math.min(7.5, size * 0.07));
    const glyphs = textGlyphs(str, x, y, size, { anchor: o.anchor, rand: this.rand });
    return this.group(o.id || this.uid("t"), () => glyphs.forEach((d) => this.ink(d, { w, color: o.color ?? INK })));
  }
  measure(str, size) {
    return measure(str, size);
  }
  // Horizontal extent [x1, x2] of `sub` inside `str` written at x with the given anchor.
  span(str, sub, x, size, anchor = "start") {
    const full = measure(str, size);
    const x0 = anchor === "middle" ? x - full / 2 : anchor === "end" ? x - full : x;
    const i = str.indexOf(sub);
    if (i < 0) throw new Error(`"${sub}" not in "${str}"`);
    const x1 = x0 + measure(str.slice(0, i), size);
    return [x1, x1 + measure(sub, size)];
  }

  // ---- marks --------------------------------------------------------------
  // Eraser-style scribble over a box, one continuous stroke.
  scribble(x, y, w, h, o = {}) {
    const n = o.n ?? Math.max(5, Math.round(w / 14));
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const px = x + (w * i) / n + (this.rand() - 0.5) * 6;
      const py = (i % 2 ? y : y + h) + (this.rand() - 0.5) * 6;
      pts.push(`${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return this.ink(pts.join(" "), { w: o.w ?? 7, color: o.color ?? INK, id: o.id });
  }
  // Light hatch shading inside a box, one zigzag stroke.
  hatch(x, y, w, h, o = {}) {
    const gap = o.gap ?? 16;
    const pts = [];
    let i = 0;
    for (let s = 0; s <= w + h; s += gap, i++) {
      const a = [x + Math.min(s, w), y + Math.max(0, s - w)];
      const b = [x + Math.max(0, s - h), y + Math.min(s, h)];
      const [p, q] = i % 2 ? [a, b] : [b, a];
      pts.push(`${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)} L${q[0].toFixed(1)} ${q[1].toFixed(1)}`);
    }
    return this.ink(pts.join(" "), { w: o.w ?? 3, color: o.color ?? LIGHT, id: o.id });
  }
  check(x, y, s = 1, o = {}) {
    return this.poly(
      [
        [x - 22 * s, y],
        [x - 6 * s, y + 18 * s],
        [x + 26 * s, y - 24 * s],
      ],
      { w: 7, roughness: 0.5, ...o },
    );
  }
  cross(x, y, s = 1, { id, ...o } = {}) {
    return this.group(id || this.uid("x"), () => {
      this.line(x - 26 * s, y - 26 * s, x + 26 * s, y + 26 * s, { w: 8, roughness: 0.6, ...o });
      this.line(x + 26 * s, y - 26 * s, x - 26 * s, y + 26 * s, { w: 8, roughness: 0.6, ...o });
    });
  }
  // Curved arrow: shaft through 3 points, then a one-stroke head.
  arrow(p1, mid, p2, o = {}) {
    return this.group(o.id || this.uid("a"), () => {
      this.curve([p1, mid, p2], { w: o.w ?? 6, color: o.color });
      const ang = Math.atan2(p2[1] - mid[1], p2[0] - mid[0]);
      const L = o.head ?? 26;
      const wing = (da) => [p2[0] - L * Math.cos(ang + da), p2[1] - L * Math.sin(ang + da)];
      this.poly([wing(0.5), p2, wing(-0.5)], { w: o.w ?? 6, color: o.color, roughness: 0.3 });
    });
  }
  // Dashed quadratic curve: each dash is its own short stroke.
  dashed(p1, c, p2, o = {}) {
    const dash = o.dash ?? 26;
    const gap = o.gap ?? 18;
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const u = 1 - t;
      pts.push([u * u * p1[0] + 2 * u * t * c[0] + t * t * p2[0], u * u * p1[1] + 2 * u * t * c[1] + t * t * p2[1]]);
    }
    let acc = 0;
    let on = true;
    let cur = [pts[0]];
    const segs = [];
    for (let i = 1; i < pts.length; i++) {
      acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (on) cur.push(pts[i]);
      if (acc >= (on ? dash : gap)) {
        if (on) segs.push(cur);
        on = !on;
        acc = 0;
        cur = [pts[i]];
      }
    }
    if (on && cur.length > 1) segs.push(cur);
    return this.group(o.id || this.uid("d"), () =>
      segs.forEach((s) =>
        this.ink(s.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" "), {
          w: o.w ?? 5,
          color: o.color ?? INK,
        }),
      ),
    );
  }

  // ---- schedule -----------------------------------------------------------
  // Draw every ink path under `targets` across [a, b]. One tip at a time unless parallel.
  draw(targets, a, b, o = {}) {
    targets = [].concat(targets);
    if (!(b > a)) throw new Error(`${this.sid}: bad window ${a}-${b} for ${targets}`);
    this.beats.push({ t: targets, a: +a.toFixed(3), b: +b.toFixed(3), hand: o.hand !== false, parallel: !!o.parallel, gap: o.gap });
  }
  tween(target, p, f, to, a, b, e = "io") {
    this.tweens.push({ t: target, p, f, to, a: +a.toFixed(3), b: +b.toFixed(3), e });
  }
  show(fillId, a, b = a + 0.4) {
    this.tween(fillId, "opacity", 0, 1, a, b, "out");
  }

  // ---- output -------------------------------------------------------------
  markup() {
    const seen = new Set();
    const claim = (id) => {
      if (seen.has(id)) throw new Error(`${this.sid}: duplicate id ${id}`);
      seen.add(id);
    };
    const walk = (node) => {
      if (typeof node === "string") {
        const m = / id="([^"]+)"/.exec(node);
        if (m) claim(m[1]);
      } else {
        claim(`${this.sid}-${node.id}`);
        node.children.forEach(walk);
      }
    };
    walk(this.root);
    const emit = (node) =>
      typeof node === "string"
        ? node
        : `<g id="${this.sid}-${node.id}"${node.attrs ? " " + node.attrs : ""}>${node.children.map(emit).join("")}</g>`;
    return emit(this.root);
  }
  schedule() {
    return { dur: this.dur, beats: this.beats, tweens: this.tweens };
  }
}

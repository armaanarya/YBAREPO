// Reusable doodles. Each returns a group id whose strokes are in draw order.
import { INK, GRAY, LIGHT } from "./draw.mjs";

// Stick figure; (x, y) is the head center. Arms are endpoints relative to the shoulder.
export function person(b, x, y, s = 1, o = {}) {
  const r = 40 * s;
  const shoulder = [x, y + r + 34 * s];
  const hip = [x, y + r + 130 * s];
  const armL = o.armL ?? [-62, 70];
  const armR = o.armR ?? [62, 70];
  return b.group(o.id || b.uid("person"), () => {
    b.circle(x, y, r * 2, { w: 6 });
    if (o.hair === "tuft") b.poly([[x - 12 * s, y - r + 2], [x - 2 * s, y - r - 18 * s], [x + 6 * s, y - r + 2], [x + 16 * s, y - r - 14 * s], [x + 20 * s, y - r + 6]], { w: 5 });
    if (o.hair === "cap") {
      b.arc(x, y - 6 * s, r * 2.05, r * 1.7, Math.PI, Math.PI * 2, { w: 6 });
      b.line(x - r * 1.0, y - 8 * s, x + r * 1.7, y - 10 * s, { w: 6 });
    }
    if (o.hair === "bun") b.circle(x + 4 * s, y - r - 14 * s, 30 * s, { w: 5 });
    if (o.glasses) {
      b.circle(x - 15 * s, y - 4 * s, 22 * s, { w: 4 });
      b.circle(x + 15 * s, y - 4 * s, 22 * s, { w: 4 });
    } else {
      b.line(x - 14 * s, y - 10 * s, x - 14 * s, y - 1 * s, { w: 5, roughness: 0.2 });
      b.line(x + 14 * s, y - 10 * s, x + 14 * s, y - 1 * s, { w: 5, roughness: 0.2 });
    }
    const m = o.mood ?? "smile";
    if (m === "smile") b.curve([[x - 16 * s, y + 12 * s], [x, y + 22 * s], [x + 16 * s, y + 12 * s]], { w: 4.5 });
    if (m === "frown") b.curve([[x - 15 * s, y + 22 * s], [x, y + 13 * s], [x + 15 * s, y + 22 * s]], { w: 4.5 });
    if (m === "flat") b.line(x - 13 * s, y + 17 * s, x + 13 * s, y + 17 * s, { w: 4.5, roughness: 0.2 });
    if (m === "o") b.circle(x, y + 17 * s, 11 * s, { w: 4 });
    b.line(x, y + r, hip[0], hip[1], { w: 6 });
    if (o.tie) b.poly([[x, y + r + 4 * s], [x - 9 * s, y + r + 34 * s], [x, y + r + 58 * s], [x + 9 * s, y + r + 34 * s], [x, y + r + 4 * s]], { w: 4, roughness: 0.3 });
    b.line(shoulder[0], shoulder[1], shoulder[0] + armL[0] * s, shoulder[1] + armL[1] * s, { w: 6 });
    b.line(shoulder[0], shoulder[1], shoulder[0] + armR[0] * s, shoulder[1] + armR[1] * s, { w: 6 });
    b.line(hip[0], hip[1], hip[0] - 46 * s, hip[1] + 112 * s, { w: 6 });
    b.line(hip[0], hip[1], hip[0] + 46 * s, hip[1] + 112 * s, { w: 6 });
  });
}

// Small head-and-shoulders classmate.
export function bust(b, x, y, s = 1, o = {}) {
  return b.group(o.id || b.uid("bust"), () => {
    b.circle(x, y, 44 * s, { w: 4.5 });
    b.arc(x, y + 64 * s, 84 * s, 70 * s, Math.PI, Math.PI * 2, { w: 4.5 });
  });
}

// Spiral-bound notebook: outline, spine, rings.
export function notebook(b, x, y, w, h, o = {}) {
  return b.group(o.id || b.uid("nb"), () => {
    b.rect(x, y, w, h, { w: o.w ?? 6 });
    const rings = o.rings ?? Math.max(3, Math.round(h / 70));
    if (o.spine !== false) b.line(x + 26, y + 6, x + 26, y + h - 6, { w: 3.5, color: GRAY, roughness: 0.4 });
    if (o.ringsOn !== false) {
      for (let i = 0; i < rings; i++) {
        const ry = y + ((i + 0.5) * h) / rings;
        b.line(x - 10, ry, x + 14, ry, { w: 4.5, roughness: 0.2 });
      }
    }
    if (o.ruled) {
      for (let ly = y + 70; ly < y + h - 20; ly += o.ruled) b.line(x + 40, ly, x + w - 18, ly, { w: 2.5, color: LIGHT, roughness: 0.3 });
    }
  });
}

// A page with a folded corner: the "block".
export function page(b, x, y, w, h, o = {}) {
  const f = o.fold ?? Math.min(w, h) * 0.18;
  return b.group(o.id || b.uid("page"), () => {
    b.poly(
      [
        [x + w - f, y],
        [x, y],
        [x, y + h],
        [x + w, y + h],
        [x + w, y + f],
        [x + w - f, y],
      ],
      { w: o.w ?? 6, roughness: 0.6 },
    );
    b.poly(
      [
        [x + w - f, y],
        [x + w - f, y + f],
        [x + w, y + f],
      ],
      { w: 4, roughness: 0.4 },
    );
  });
}

// Wavy placeholder lines that read as "notes" on a page.
export function squiggles(b, x, y, w, rows, o = {}) {
  const gap = o.gap ?? 44;
  return b.group(o.id || b.uid("sq"), () => {
    for (let i = 0; i < rows; i++) {
      const ww = w * (i === rows - 1 ? 0.6 : 0.85 + b.rand() * 0.15);
      const yy = y + i * gap;
      const pts = [];
      const n = Math.max(4, Math.round(ww / 26));
      for (let k = 0; k <= n; k++) pts.push([x + (ww * k) / n, yy + (k % 2 ? -6 : 6) + (b.rand() - 0.5) * 4]);
      b.curve(pts, { w: o.w ?? 3.5, color: o.color ?? GRAY, roughness: 0.3 });
    }
  });
}

// Fingerprint whorl from nested open arcs.
export function fingerprint(b, cx, cy, r, o = {}) {
  return b.group(o.id || b.uid("fp"), () => {
    const rings = 6;
    for (let i = 0; i < rings; i++) {
      const rr = r * (0.18 + (0.82 * i) / (rings - 1));
      const gapA = Math.PI * (0.35 + 0.1 * (i % 3));
      const start = Math.PI * 1.5 + gapA / 2 + i * 0.35;
      b.arc(cx, cy + i * 2, rr * 1.7, rr * 2.1, start, start + Math.PI * 2 - gapA, { w: o.w ?? 4.5, roughness: 0.4 });
    }
  });
}

// Two interlocking chain links between (x1, y) and (x2, y).
export function chain(b, x1, x2, y, o = {}) {
  const L = x2 - x1;
  const h = o.h ?? 46;
  const linkW = L * 0.62;
  const stadium = (cx, cy, w, hh) => {
    const r = hh / 2;
    return `M ${cx - w / 2 + r} ${cy - r} L ${cx + w / 2 - r} ${cy - r} A ${r} ${r} 0 0 1 ${cx + w / 2 - r} ${cy + r} L ${cx - w / 2 + r} ${cy + r} A ${r} ${r} 0 0 1 ${cx - w / 2 + r} ${cy - r}`;
  };
  return b.group(o.id || b.uid("chain"), () => {
    b.path(stadium(x1 + linkW / 2, y, linkW, h), { w: o.w ?? 7, roughness: 0.4 });
    b.path(stadium(x2 - linkW / 2, y + 2, linkW, h), { w: o.w ?? 7, roughness: 0.4 });
  });
}

export function globe(b, cx, cy, r, o = {}) {
  return b.group(o.id || b.uid("globe"), () => {
    b.circle(cx, cy, r * 2, { w: 6 });
    b.ellipse(cx, cy, r * 0.9, r * 2, { w: 3.5, color: GRAY });
    b.arc(cx, cy, r * 2, r * 0.5, 0, Math.PI, { w: 3.5, color: GRAY });
    b.curve([[cx - r * 0.86, cy - r * 0.5], [cx, cy - r * 0.42], [cx + r * 0.86, cy - r * 0.5]], { w: 3, color: GRAY });
    b.curve([[cx - r * 0.86, cy + r * 0.5], [cx, cy + r * 0.6], [cx + r * 0.86, cy + r * 0.5]], { w: 3, color: GRAY });
    // two blobby continents
    b.curve([[cx - r * 0.55, cy - r * 0.2], [cx - r * 0.3, cy - r * 0.38], [cx - r * 0.08, cy - r * 0.1], [cx - r * 0.25, cy + r * 0.22], [cx - r * 0.5, cy + r * 0.12], [cx - r * 0.55, cy - r * 0.2]], { w: 4 });
    b.curve([[cx + r * 0.2, cy + r * 0.05], [cx + r * 0.45, cy - r * 0.15], [cx + r * 0.62, cy + r * 0.12], [cx + r * 0.42, cy + r * 0.42], [cx + r * 0.22, cy + r * 0.3], [cx + r * 0.2, cy + r * 0.05]], { w: 4 });
  });
}

// House sitting on y (baseline).
export function house(b, x, y, s = 1, o = {}) {
  return b.group(o.id || b.uid("house"), () => {
    b.rect(x - 70 * s, y - 110 * s, 140 * s, 110 * s, { w: 6 });
    b.poly([[x - 92 * s, y - 104 * s], [x, y - 186 * s], [x + 92 * s, y - 104 * s]], { w: 6, roughness: 0.5 });
    b.rect(x - 18 * s, y - 56 * s, 36 * s, 56 * s, { w: 4.5 });
  });
}

export function barn(b, x, y, s = 1, o = {}) {
  return b.group(o.id || b.uid("barn"), () => {
    b.poly(
      [
        [x - 100 * s, y],
        [x - 100 * s, y - 120 * s],
        [x - 62 * s, y - 180 * s],
        [x, y - 214 * s],
        [x + 62 * s, y - 180 * s],
        [x + 100 * s, y - 120 * s],
        [x + 100 * s, y],
        [x - 100 * s, y],
      ],
      { w: 6, roughness: 0.5 },
    );
    b.rect(x - 40 * s, y - 92 * s, 80 * s, 92 * s, { w: 5 });
    b.line(x - 40 * s, y - 92 * s, x + 40 * s, y, { w: 4 });
    b.line(x + 40 * s, y - 92 * s, x - 40 * s, y, { w: 4 });
    b.circle(x, y - 148 * s, 34 * s, { w: 4 });
  });
}

export function mangoBox(b, x, y, w, h, o = {}) {
  return b.group(o.id || b.uid("box"), () => {
    b.ellipse(x + w * 0.25, y - 6, w * 0.32, 56, { w: 5 });
    b.ellipse(x + w * 0.52, y - 14, w * 0.32, 60, { w: 5 });
    b.ellipse(x + w * 0.78, y - 6, w * 0.3, 54, { w: 5 });
    b.rect(x, y, w, h, { w: 6 });
    b.line(x + 10, y + 26, x + w - 10, y + 26, { w: 3.5, color: GRAY, roughness: 0.3 });
  });
}

export function lock(b, cx, cy, s = 1, o = {}) {
  return b.group(o.id || b.uid("lock"), () => {
    b.arc(cx, cy - 34 * s, 76 * s, 104 * s, Math.PI, Math.PI * 2, { w: 7 });
    b.line(cx - 38 * s, cy - 34 * s, cx - 38 * s, cy - 6 * s, { w: 7, roughness: 0.2 });
    b.line(cx + 38 * s, cy - 34 * s, cx + 38 * s, cy - 6 * s, { w: 7, roughness: 0.2 });
    b.rect(cx - 58 * s, cy - 8 * s, 116 * s, 92 * s, { w: 7 });
    b.circle(cx, cy + 28 * s, 22 * s, { w: 5 });
    b.line(cx, cy + 38 * s, cx, cy + 62 * s, { w: 5, roughness: 0.2 });
  });
}

export function bill(b, x, y, w, h, o = {}) {
  return b.group(o.id || b.uid("bill"), () => {
    b.rect(x, y, w, h, { w: 6 });
    b.rect(x + 14, y + 14, w - 28, h - 28, { w: 3, color: GRAY });
    b.text("$5", x + w / 2, y + h / 2 + 26, 74, { anchor: "middle" });
    b.circle(x + 40, y + h / 2, 26, { w: 3, color: GRAY });
    b.circle(x + w - 40, y + h / 2, 26, { w: 3, color: GRAY });
  });
}

export function calendar(b, x, y, w, h, label, o = {}) {
  return b.group(o.id || b.uid("cal"), () => {
    b.rect(x, y, w, h, { w: 6 });
    b.line(x + 4, y + h * 0.28, x + w - 4, y + h * 0.28, { w: 5 });
    b.line(x + w * 0.3, y - 18, x + w * 0.3, y + 14, { w: 6, roughness: 0.2 });
    b.line(x + w * 0.7, y - 18, x + w * 0.7, y + 14, { w: 6, roughness: 0.2 });
    b.text(label, x + w / 2, y + h * 0.82, h * 0.42, { anchor: "middle" });
  });
}

// Oval speech bubble with a tail toward (tx, ty).
export function bubble(b, cx, cy, w, h, tx, ty, o = {}) {
  return b.group(o.id || b.uid("bub"), () => {
    b.ellipse(cx, cy, w, h, { w: 5 });
    const ang = Math.atan2(ty - cy, tx - cx);
    const ex = cx + (w / 2) * Math.cos(ang) * 0.97;
    const ey = cy + (h / 2) * Math.sin(ang) * 0.97;
    const px = -Math.sin(ang) * 22;
    const py = Math.cos(ang) * 22;
    b.poly([[ex + px, ey + py], [tx, ty], [ex - px, ey - py]], { w: 5, roughness: 0.3 });
  });
}

export function coin(b, cx, cy, d, o = {}) {
  return b.group(o.id || b.uid("coin"), () => {
    b.circle(cx, cy, d, { w: 5 });
    b.text("$", cx, cy + d * 0.22, d * 0.6, { anchor: "middle" });
  });
}

export function stopwatch(b, cx, cy, r, o = {}) {
  return b.group(o.id || b.uid("sw"), () => {
    b.circle(cx, cy, r * 2, { w: 6 });
    b.line(cx, cy - r, cx, cy - r - 20, { w: 6, roughness: 0.2 });
    b.line(cx - 16, cy - r - 22, cx + 16, cy - r - 22, { w: 6, roughness: 0.2 });
    b.line(cx, cy, cx, cy - r * 0.62, { w: 5, roughness: 0.2 });
    b.line(cx, cy, cx + r * 0.45, cy + r * 0.2, { w: 5, roughness: 0.2 });
  });
}

export { INK, GRAY, LIGHT };

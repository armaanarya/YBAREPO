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

// ---- episode 2: wallets and transactions ----------------------------------

// Rotate a point around (cx, cy) by `a` radians.
const rotAround = (cx, cy, a) => ([px, py]) => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [cx + (px - cx) * c - (py - cy) * s, cy + (px - cx) * s + (py - cy) * c];
};

function roundRect(x, y, w, h, r) {
  return `M ${x + r} ${y} L ${x + w - r} ${y} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} L ${x + r} ${y + h} A ${r} ${r} 0 0 1 ${x} ${y + h - r} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y}`;
}

// Door box of a mailbox drawn with the same arguments (for coins, door swings).
export function mailboxDoor(cx, top, w, h) {
  const domeH = w * 0.28;
  return { x: cx - w * 0.36, y: top + domeH + h * 0.2, w: w * 0.72, h: h - domeH - h * 0.28 };
}
// Mail slot box of a mailbox drawn with the same arguments.
export function mailboxSlot(cx, top, w, h) {
  return { x: cx - w * 0.3, y: top + w * 0.28 + h * 0.04, w: w * 0.6, h: h * 0.07 };
}
// Keyhole center: on the body, just right of the door.
export function mailboxKeyhole(cx, top, w, h) {
  const d = mailboxDoor(cx, top, w, h);
  return [d.x + d.w + (w * 0.14) / 2, d.y + d.h / 2];
}

// The wallet: a front-facing mailbox on a post. Domed top, mail slot (the address),
// door, keyhole on the body (the private key opens it). `top` is the dome's peak.
export function mailbox(b, cx, top, w, h, o = {}) {
  const x = cx - w / 2;
  const domeH = w * 0.28;
  const slot = mailboxSlot(cx, top, w, h);
  const d = mailboxDoor(cx, top, w, h);
  const [kx, ky] = mailboxKeyhole(cx, top, w, h);
  return b.group(o.id || b.uid("mbox"), () => {
    b.path(`M ${x} ${top + h} L ${x} ${top + domeH} Q ${cx} ${top - domeH * 0.9} ${x + w} ${top + domeH} L ${x + w} ${top + h} L ${x} ${top + h}`, { w: 6, roughness: 0.5 });
    b.rect(slot.x, slot.y, slot.w, slot.h, { w: 5, roughness: 0.4 });
    if (o.door !== false) b.rect(d.x, d.y, d.w, d.h, { w: 4.5, roughness: 0.4 });
    if (o.keyhole !== false) {
      b.circle(kx, ky - 8, Math.min(20, w * 0.06), { w: 4 });
      b.line(kx, ky, kx, ky + 20, { w: 4, roughness: 0.2 });
    }
    if (o.post !== false) {
      const base = o.base ?? top + h + 200;
      b.line(cx - 14, top + h, cx - 14, base, { w: 6, roughness: 0.3 });
      b.line(cx + 14, top + h, cx + 14, base, { w: 6, roughness: 0.3 });
    }
  });
}

// Old-style key. (x, y) is the center of the bow; the blade points right, or
// `angle` radians clockwise from there (Math.PI points it left).
export function key(b, x, y, s = 1, o = {}) {
  const R = rotAround(x, y, o.angle ?? 0);
  const P = (pts) => pts.map(([px, py]) => R([x + px * s, y + py * s]));
  return b.group(o.id || b.uid("key"), () => {
    b.circle(x, y, 74 * s, { w: o.w ?? 6 });
    b.circle(x, y, 22 * s, { w: 4 });
    b.poly(P([[36, -8], [196, -8], [196, 30], [176, 30], [176, 14], [158, 14], [158, 30], [138, 30], [138, 8], [36, 8]]), {
      w: o.w ?? 5.5,
      roughness: 0.3,
      preserveVertices: true,
    });
  });
}

// Desktop monitor; (cx, cy) is the screen center, screen is 150s x 100s.
// Gray lines on screen read as "its copy of the notebook" unless o.notes === false.
export function computer(b, cx, cy, s = 1, o = {}) {
  const w = 150 * s;
  const h = 100 * s;
  return b.group(o.id || b.uid("pc"), () => {
    b.rect(cx - w / 2, cy - h / 2, w, h, { w: 5, roughness: 0.5 });
    b.line(cx, cy + h / 2, cx, cy + h / 2 + 24 * s, { w: 5, roughness: 0.2 });
    b.line(cx - 36 * s, cy + h / 2 + 26 * s, cx + 36 * s, cy + h / 2 + 26 * s, { w: 5, roughness: 0.2 });
    if (o.notes !== false) {
      for (let i = 0; i < 3; i++) {
        const yy = cy - h * 0.22 + i * h * 0.22;
        b.line(cx - w * 0.32, yy, cx + w * (i === 2 ? 0.05 : 0.32), yy, { w: 3, color: GRAY, roughness: 0.3 });
      }
    }
  });
}

// Postage stamp with a perforated edge; o.label is written in the middle.
export function stamp(b, x, y, w, h, o = {}) {
  const amp = Math.max(4, Math.min(w, h) * 0.05);
  const n = Math.max(4, Math.round(w / 22));
  const m = Math.max(4, Math.round(h / 22));
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push([x + (w * i) / n, y + (i % 2 ? amp : 0)]);
  for (let i = 1; i <= m; i++) pts.push([x + w - (i % 2 ? amp : 0), y + (h * i) / m]);
  for (let i = 1; i <= n; i++) pts.push([x + w - (w * i) / n, y + h - (i % 2 ? amp : 0)]);
  for (let i = 1; i <= m; i++) pts.push([x + (i % 2 ? amp : 0), y + h - (h * i) / m]);
  return b.group(o.id || b.uid("stamp"), () => {
    b.poly(pts, { w: o.w ?? 4.5, roughness: 0.2, preserveVertices: true });
    b.rect(x + w * 0.17, y + h * 0.17, w * 0.66, h * 0.66, { w: 3, color: GRAY, roughness: 0.4 });
    const size = o.size ?? h * 0.4;
    if (o.label) b.text(o.label, x + w / 2, y + h / 2 + size * 0.36, size, { anchor: "middle" });
  });
}

// Envelope: box plus the V of the flap.
export function envelope(b, x, y, w, h, o = {}) {
  return b.group(o.id || b.uid("env"), () => {
    b.rect(x, y, w, h, { w: o.w ?? 5, roughness: 0.4 });
    b.poly([[x + 4, y + 4], [x + w / 2, y + h * 0.55], [x + w - 4, y + 4]], { w: (o.w ?? 5) - 1, roughness: 0.3 });
  });
}

// Pizza seen from above: crust, cheese edge, cuts, pepperoni.
export function pizza(b, cx, cy, d, o = {}) {
  const cuts = o.cuts ?? 3;
  const peps = o.peps ?? 4;
  return b.group(o.id || b.uid("pizza"), () => {
    b.circle(cx, cy, d, { w: 6 });
    b.circle(cx, cy, d * 0.8, { w: 3.5, color: GRAY });
    for (let i = 0; i < cuts; i++) {
      const a = (i * Math.PI) / cuts + 0.3;
      const r = d * 0.4;
      b.line(cx - r * Math.cos(a), cy - r * Math.sin(a), cx + r * Math.cos(a), cy + r * Math.sin(a), { w: 4, roughness: 0.3 });
    }
    for (let i = 0; i < peps; i++) {
      const a = 0.3 + Math.PI / cuts / 2 + (i * 2 * Math.PI) / peps;
      b.circle(cx + d * 0.25 * Math.cos(a), cy + d * 0.25 * Math.sin(a), d * 0.11, { w: 4 });
    }
  });
}

// Magnifying glass: lens centered on (cx, cy), handle toward `angle` (default down-right).
export function magnifier(b, cx, cy, r, o = {}) {
  const a = o.angle ?? Math.PI / 4;
  const x1 = cx + r * Math.cos(a);
  const y1 = cy + r * Math.sin(a);
  return b.group(o.id || b.uid("mag"), () => {
    b.circle(cx, cy, r * 2, { w: 6 });
    b.arc(cx, cy, r * 1.4, r * 1.4, Math.PI * 1.1, Math.PI * 1.45, { w: 4, color: GRAY });
    b.line(x1, y1, x1 + r * 1.1 * Math.cos(a), y1 + r * 1.1 * Math.sin(a), { w: 13, roughness: 0.2 });
  });
}

// Rounded button centered on (cx, cy) with a handwritten label.
export function button(b, cx, cy, w, h, label, o = {}) {
  const size = o.size ?? h * 0.42;
  return b.group(o.id || b.uid("btn"), () => {
    b.path(roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2.4, 30)), { w: 6, roughness: 0.5 });
    if (label) b.text(label, cx, cy + size * 0.36, size, { anchor: "middle" });
  });
}

export { INK, GRAY, LIGHT };

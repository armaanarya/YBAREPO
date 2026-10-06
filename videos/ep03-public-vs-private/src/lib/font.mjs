// Single-stroke handwriting via EMS Tech (SIL OFL, from the hersheytext package).
// Every glyph is a polyline, so the marker can trace each letter for real.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const FONT_DIR = join(dirname(require.resolve("hersheytext/package.json")), "svg_fonts");

function decode(u) {
  return u
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function loadFont(name) {
  const src = readFileSync(join(FONT_DIR, `${name}.svg`), "utf8");
  const def = +(/<font[^>]*horiz-adv-x="([\d.]+)"/.exec(src)?.[1] || 500);
  const glyphs = {};
  for (const m of src.matchAll(/<glyph([^>]*)\/>/g)) {
    const a = m[1];
    const u = /unicode="([^"]*)"/.exec(a)?.[1];
    if (u === undefined) continue;
    glyphs[decode(u)] = {
      adv: +(/horiz-adv-x="([\d.]+)"/.exec(a)?.[1] ?? def),
      d: /\sd="([^"]*)"/.exec(a)?.[1] || "",
    };
  }
  return glyphs;
}

const FONT = loadFont("EMSTech");

// Parse an M/L polyline glyph into subpaths of [x,y] points (font units, y up).
function glyphPolys(d) {
  const polys = [];
  const tokens = d.trim().split(/\s+/);
  let cur = null;
  for (let i = 0; i < tokens.length; ) {
    const cmd = tokens[i];
    if (cmd === "M" || cmd === "L") {
      const x = +tokens[i + 1];
      const y = +tokens[i + 2];
      if (cmd === "M" || !cur) {
        cur = [];
        polys.push(cur);
      }
      cur.push([x, y]);
      i += 3;
    } else {
      throw new Error(`unsupported glyph command ${cmd}`);
    }
  }
  return polys;
}

export function measure(str, size) {
  let w = 0;
  for (const ch of str) w += (FONT[ch] || FONT["?"]).adv;
  return (w * size) / 1000;
}

// Returns one path `d` per visible glyph, in writing order, in board coordinates.
// `rand` is a seeded PRNG so the small hand-wobble is the same on every render.
export function textGlyphs(str, x, y, size, { anchor = "start", rand = () => 0.5, slant = 0 } = {}) {
  const s = size / 1000;
  let cx = anchor === "middle" ? x - measure(str, size) / 2 : anchor === "end" ? x - measure(str, size) : x;
  const out = [];
  for (const ch of str) {
    const g = FONT[ch] || FONT["?"];
    if (g.d) {
      const rot = ((rand() - 0.5) * 3 * Math.PI) / 180;
      const dy = (rand() - 0.5) * size * 0.04;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const parts = glyphPolys(g.d).map((poly) =>
        poly
          .map(([gx, gy], i) => {
            const lx = gx * s + gy * s * slant;
            const ly = -gy * s;
            const px = cx + lx * cos - ly * sin;
            const py = y + dy + lx * sin + ly * cos;
            return `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
          })
          .join(" "),
      );
      out.push(parts.join(" "));
    }
    cx += g.adv * s;
  }
  return out;
}

// YBA mark as drawable outlines plus a fill that fades in once the outline is done,
// and the standard end card every episode closes on.
import { readFileSync } from "node:fs";
import svgpath from "svgpath";

// The source SVG also carries the wordmark below y=1200 (outside its viewBox); skip it.
export function ybaLogo(b, logoFile, cx, cy, height, { id = "logo" } = {}) {
  const src = readFileSync(logoFile, "utf8").replace(/<clipPath[\s\S]*?<\/clipPath>/g, "");
  const subs = [];
  for (const m of src.matchAll(/<path[^>]*\sd="([^"]+)"/g)) {
    svgpath(m[1])
      .abs()
      .unshort()
      .toString()
      .split(/(?=M)/)
      .forEach((s) => {
        const mm = /^M\s*([-\d.]+)[ ,]+([-\d.]+)/.exec(s);
        if (mm && +mm[2] < 1200 && s.length > 24) subs.push(s.trim());
      });
  }
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  subs.forEach((s) =>
    svgpath(s).iterate((seg, i, x, y) => {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }),
  );
  const k = height / (maxY - minY);
  const tx = cx - ((minX + maxX) / 2) * k;
  const ty = cy - ((minY + maxY) / 2) * k;
  const out = subs.map((s) => svgpath(s).scale(k).translate(tx, ty).round(1).toString());
  const outline = b.group(`${id}Ink`, () => out.forEach((d) => b.ink(d, { w: 5 })));
  const fill = b.fill(out.join(" "), { id: `${id}Fill` });
  return { outline, fill };
}

// Standard closing scene. The narration line should end with
// "... Find us at join Y B A dot org." (spelled so the voice says the letters).
export function endCard(b, { logoFile, nameWord = "youth", findWord = "find", lastWord = "org" }) {
  const logo = ybaLogo(b, logoFile, 960, 360, 430);
  b.text("Youth Blockchain Association", 960, 710, 56, { anchor: "middle", id: "name" });
  b.text("joinyba.org", 960, 880, 110, { anchor: "middle", id: "url" });
  b.curve([[700, 915], [960, 928], [1220, 912]], { id: "under", w: 6 });

  b.draw(logo.outline, 0.15, b.w(nameWord) - 0.35);
  b.show(logo.fill, b.w(nameWord) - 0.4, b.w(nameWord) + 0.2);
  b.draw("name", b.w(nameWord) - 0.3, b.we("association"));
  b.draw("url", b.w(findWord), b.we(lastWord) + 0.1);
  b.draw("under", b.we(lastWord) + 0.15, b.we(lastWord) + 0.6);
}

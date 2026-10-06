// One builder per scene. Positions are in 1920x1080 board pixels; every
// draw window is keyed to the narrator's word timestamps (b.w / b.we).
import { readFileSync } from "node:fs";
import svgpath from "svgpath";
import { GRAY } from "./lib/draw.mjs";
import {
  person, bust, notebook, page, squiggles, fingerprint, chain, globe, house,
  barn, mangoBox, lock, bill, calendar, bubble, coin, stopwatch,
} from "./lib/figures.mjs";

const OWES = "Sam owes you $5";

// ---------------------------------------------------------------------------
export function s01(b) {
  person(b, 380, 360, 1.15, { id: "you", hair: "tuft", armR: [84, 36] });
  b.text("YOU", 380, 830, 64, { anchor: "middle", id: "youL" });
  person(b, 1540, 360, 1.15, { id: "sam", hair: "cap", armL: [-84, 36] });
  b.text("SAM", 1540, 830, 64, { anchor: "middle", id: "samL" });
  bill(b, 830, 400, 260, 120, { id: "bill" });
  b.arrow([570, 585], [960, 630], [1350, 585], { id: "give" });
  b.group("back", () => {
    b.dashed([1350, 700], [960, 790], [570, 700], { w: 5 });
    b.poly([[598, 676], [570, 700], [604, 716]], { w: 5, roughness: 0.3 });
  });
  calendar(b, 860, 110, 200, 170, "FRI", { id: "cal" });
  b.ellipse(960, 233, 190, 96, { id: "ring", w: 5 });
  bubble(b, 1300, 175, 400, 170, 1505, 318, { id: "bub" });
  b.text("what $5?", 1300, 200, 58, { anchor: "middle", id: "what" });

  b.draw(["you", "youL"], 0.15, 1.1);
  b.draw(["sam", "samL"], 1.12, 2.0);
  b.draw("bill", 2.02, 2.95);
  b.draw("give", 2.97, 3.4);
  b.draw("back", b.w("pay") - 0.1, b.w("on"));
  b.draw("cal", b.w("on"), b.we("friday"));
  b.draw("ring", b.w("friday", 2), b.we("comes"));
  b.draw("bub", b.w("and"), b.w("what") - 0.05);
  b.draw("what", b.w("what"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s02(b) {
  person(b, 420, 350, 1.15, { id: "teacher", hair: "bun", glasses: true, armR: [120, 6] });
  notebook(b, 720, 220, 640, 480, { id: "nb" });
  b.group("rules", () => {
    for (let y = 330; y < 680; y += 64) b.line(770, y, 1330, y, { w: 2.5, color: "#c4c4bf", roughness: 0.3 });
  });
  b.text(OWES, 1050, 420, 60, { anchor: "middle", id: "owes" });
  b.text("lost?", 1620, 330, 96, { anchor: "middle", id: "lost" });
  const [x1, x2] = b.span(OWES, "$5", 1050, 60, "middle");
  b.scribble(x1 - 6, 368, x2 - x1 + 12, 64, { id: "scrib" });
  b.text("$0", (x1 + x2) / 2, 520, 60, { anchor: "middle", id: "zero" });

  b.draw("teacher", 0.15, b.w("teacher"));
  b.draw("nb", b.w("teacher") + 0.05, b.we("notebook"));
  b.draw("rules", b.we("notebook"), b.we("notebook") + 0.5, { parallel: true, hand: false });
  b.draw("owes", b.we("notebook"), b.w("that") + 0.2);
  b.draw("lost", b.w("gets") - 0.15, b.we("lost") + 0.2);
  b.draw("scrib", b.w("someone", 2), b.w("changes") + 0.25);
  b.draw("zero", b.w("changes") + 0.3, b.speechEnd + 0.3);
}

// ---------------------------------------------------------------------------
export function s03(b) {
  b.text("BLOCKCHAIN", 960, 150, 84, { anchor: "middle", id: "head" });
  const cols = [250, 770, 1290];
  const rows = [250, 620];
  const nbs = [];
  const texts = [];
  const busts = [];
  rows.forEach((y) =>
    cols.forEach((x) => {
      const i = nbs.length;
      nbs.push(notebook(b, x, y, 380, 230, { id: `nb${i}`, ringsOn: false }));
      texts.push(b.text(OWES, x + 200, y + 135, 40, { anchor: "middle", id: `tx${i}` }));
      busts.push(bust(b, x + 380 + 66, y + 150, 0.62, { id: `bu${i}` }));
    }),
  );

  b.draw("head", 0.15, b.we("different"));
  b.draw(nbs, b.w("it") - 0.1, b.we("notebook"));
  b.draw("tx0", b.w("when"), b.we("dollars"));
  b.draw(texts.slice(1), b.w("the", 2), b.we("down"), { parallel: true, hand: false });
  b.draw(busts, b.w("the", 2), b.w("down"), { parallel: true, hand: false });
}

// ---------------------------------------------------------------------------
export function s04(b) {
  page(b, 640, 190, 520, 660, { id: "page" });
  b.text(OWES, 890, 320, 46, { anchor: "middle", id: "owes" });
  squiggles(b, 690, 420, 420, 5, { id: "notes", gap: 76 });
  b.arrow([1340, 560], [1260, 610], [1192, 560], { id: "arr" });
  b.text("BLOCK", 1520, 560, 120, { anchor: "middle", id: "label" });

  b.draw("page", 0.15, b.w("grouped"));
  b.draw("owes", b.w("grouped"), b.we("pages") - 0.1);
  b.draw("notes", b.we("pages") - 0.1, b.w("each"));
  b.draw("arr", b.w("each"), b.w("called"));
  b.draw("label", b.w("called"), b.we("block") + 0.15);
}

// ---------------------------------------------------------------------------
export function s05(b) {
  page(b, 230, 200, 500, 640, { id: "page", fold: 60 });
  b.text(OWES, 470, 330, 42, { anchor: "middle", id: "owes" });
  squiggles(b, 280, 460, 380, 5, { id: "notes", gap: 72 });
  b.arrow([770, 520], [870, 470], [970, 520], { id: "arr" });
  fingerprint(b, 1250, 450, 150, { id: "fp" });
  b.text("7F3A", 1250, 790, 110, { anchor: "middle", id: "code" });
  const [c1, c2] = b.span(OWES, "5", 470, 42, "middle");
  b.scribble(c1 - 4, 292, c2 - c1 + 8, 44, { id: "scrib5", w: 6 });
  b.text("6", (c1 + c2) / 2, 386, 42, { anchor: "middle", id: "six" });
  b.scribble(1100, 708, 300, 90, { id: "scribCode" });
  b.arrow([1420, 740], [1460, 720], [1500, 740], { id: "arr2" });
  b.text("C94E", 1660, 790, 110, { anchor: "middle", id: "code2" });

  b.draw(["page", "owes", "notes"], 0.05, 0.8, { parallel: true, hand: false });
  b.draw("arr", 0.6, b.w("fingerprint"));
  b.draw("fp", b.w("fingerprint"), b.w("that's") + 0.1);
  b.draw("code", b.w("short"), b.we("page"));
  b.draw("scrib5", b.w("change"), b.we("one"));
  b.draw("six", b.w("letter"), b.we("letter") + 0.1);
  b.draw("scribCode", b.w("fingerprint", 2), b.w("changes"));
  b.draw("arr2", b.w("changes"), b.w("changes") + 0.3);
  b.draw("code2", b.w("changes") + 0.32, b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s06(b) {
  const xs = [120, 780, 1440];
  const W = 360;
  page(b, xs[0], 180, W, 420, { id: "b1" });
  b.text("7F3A", xs[0] + W / 2, 550, 72, { anchor: "middle", id: "c1" });
  page(b, xs[1], 180, W, 420, { id: "b2" });
  b.text("before: 7F3A", xs[1] + 26, 265, 40, { id: "p2", color: GRAY });
  b.text("B204", xs[1] + W / 2, 550, 72, { anchor: "middle", id: "c2" });
  page(b, xs[2], 180, W, 420, { id: "b3" });
  b.text("before: B204", xs[2] + 26, 265, 40, { id: "p3", color: GRAY });
  b.text("58DC", xs[2] + W / 2, 550, 72, { anchor: "middle", id: "c3" });
  squiggles(b, xs[0] + 40, 300, W - 80, 3, { id: "n1", gap: 60 });
  squiggles(b, xs[1] + 40, 340, W - 80, 2, { id: "n2", gap: 60 });
  squiggles(b, xs[2] + 40, 340, W - 80, 2, { id: "n3", gap: 60 });
  b.arrow([xs[0] + W / 2 + 120, 520], [620, 330], [xs[1] + 20, 252], { id: "copy", w: 4, color: GRAY, head: 20 });
  chain(b, xs[0] + W - 10, xs[1] + 10, 400, { id: "ch1" });
  chain(b, xs[1] + W - 10, xs[2] + 10, 400, { id: "ch2" });
  const eq = ["BLOCK", " + CHAIN", " = BLOCKCHAIN"];
  const size = 84;
  let x = 960 - b.measure(eq.join(""), size) / 2;
  eq.forEach((part, i) => {
    b.text(part, x, 820, size, { id: `eq${i}` });
    x += b.measure(part, size);
  });

  b.draw(["b1", "n1"], 0.15, 1.0);
  b.draw("c1", 1.0, 1.75);
  b.draw("b2", b.w("each") - 0.2, b.w("copies"));
  b.draw("copy", b.w("copies"), b.w("fingerprint"));
  b.draw("p2", b.w("fingerprint"), b.we("it"));
  b.draw(["n2", "c2"], b.we("it"), b.w("links") - 0.1);
  b.draw("ch1", b.w("links") - 0.05, b.we("together"));
  b.draw("b3", b.we("together") + 0.05, b.w("chain"));
  b.draw("ch2", b.w("chain"), b.we("chain") + 0.15);
  b.draw(["p3", "n3", "c3"], b.we("chain") + 0.2, b.w("block", 3) - 0.05);
  b.draw("eq0", b.w("block", 3), b.we("block", 3));
  b.draw("eq1", b.w("chain", 2) - 0.05, b.we("chain", 2) + 0.15);
  b.draw("eq2", b.w("blockchain"), b.speechEnd + 0.4);
}

// ---------------------------------------------------------------------------
export function s07(b) {
  const xs = [250, 810, 1370];
  const W = 300;
  const recall = [];
  xs.forEach((x, i) => recall.push(page(b, x, 110, W, 290, { id: `pg${i}` })));
  recall.push(b.text(OWES, xs[1] + W / 2, 200, 34, { anchor: "middle", id: "owes" }));
  recall.push(squiggles(b, xs[0] + 30, 190, W - 60, 2, { id: "sq0", gap: 50 }));
  recall.push(squiggles(b, xs[1] + 30, 260, W - 60, 1, { id: "sq1" }));
  recall.push(squiggles(b, xs[2] + 30, 190, W - 60, 2, { id: "sq2", gap: 50 }));
  const codes = ["7F3A", "B204", "58DC"];
  xs.forEach((x, i) => recall.push(b.text(codes[i], x + W / 2, 370, 52, { anchor: "middle", id: `cd${i}` })));
  recall.push(chain(b, xs[0] + W - 8, xs[1] + 8, 255, { id: "ch1", h: 38 }));
  recall.push(chain(b, xs[1] + W - 8, xs[2] + 8, 255, { id: "ch2", h: 38 }));

  const [d1, d2] = b.span(OWES, "$5", xs[1] + W / 2, 34, "middle");
  b.scribble(d1 - 4, 170, d2 - d1 + 8, 38, { id: "erase", w: 6 });
  const [k1, k2] = b.span("B204", "B204", xs[1] + W / 2, 52, "middle");
  b.scribble(k1 - 6, 324, k2 - k1 + 12, 54, { id: "scribCode", w: 6 });
  b.text("C94E", xs[1] + W / 2, 470, 60, { anchor: "middle", id: "newCode" });
  b.group("crack", () => {
    b.poly([[1235, 200], [1220, 232], [1250, 252], [1228, 282], [1254, 312]], { w: 7, roughness: 0.2 });
  });
  b.cross(1240, 256, 1.5, { id: "brk" });

  const nbX = [150, 440, 730, 1020, 1310, 1600];
  const nbs = nbX.map((x, i) => notebook(b, x, 600, 220, 170, { id: `nb${i}`, ringsOn: false, spine: false }));
  const fives = nbX.slice(1).map((x, i) => b.text("$5", x + 110, 710, 64, { anchor: "middle", id: `f${i}` }));
  const samFive = b.text("$5", nbX[0] + 110, 710, 64, { anchor: "middle", id: "sf" });
  b.scribble(nbX[0] + 62, 650, 96, 70, { id: "sfScrib", w: 6 });
  b.text("SAM", nbX[0] + 110, 840, 52, { anchor: "middle", id: "samL" });
  b.cross(nbX[0] + 110, 685, 2.2, { id: "samX" });
  const checks = nbX.slice(1).map((x) => b.check(x + 110, 835, 1.2));
  b.text("Sam loses.", 1110, 960, 64, { anchor: "middle", id: "loses" });

  b.draw(recall, 0.05, 0.75, { parallel: true, hand: false });
  b.draw("erase", b.w("erases"), b.we("dollars"));
  b.draw("scribCode", b.w("changes"), b.w("fingerprint") + 0.1);
  b.draw("newCode", b.w("fingerprint") + 0.12, b.w("so"));
  b.draw("crack", b.w("chain"), b.w("breaks"));
  b.draw("brk", b.w("breaks"), b.we("breaks") + 0.1);
  b.draw(nbs, b.w("everyone"), b.w("shows"));
  b.draw([samFive, ...fives], b.w("shows"), b.we("dollars", 2), { parallel: true, hand: false });
  b.draw("sfScrib", b.we("dollars", 2), b.we("dollars", 2) + 0.45);
  b.draw("samL", b.we("dollars", 2) + 0.5, b.w("one") - 0.05);
  b.draw("samX", b.w("one"), b.w("against"));
  b.draw(checks, b.w("against"), b.we("class"));
  b.draw("loses", b.w("sam", 2), b.speechEnd + 0.4);
}

// ---------------------------------------------------------------------------
export function s08(b) {
  b.text("WHY IT MATTERS", 960, 120, 72, { anchor: "middle", id: "title" });
  globe(b, 960, 470, 190, { id: "globe" });
  person(b, 300, 400, 0.95, { id: "p1", armR: [70, 30] });
  person(b, 1620, 400, 0.95, { id: "p2", armL: [-70, 30] });
  b.dashed([380, 470], [960, 120], [1540, 470], { id: "agree", w: 5 });
  b.check(960, 300, 1.3, { id: "ok" });
  person(b, 960, 770, 0.62, { id: "boss", tie: true, mood: "flat", armL: [-40, 50], armR: [40, 50] });
  b.cross(960, 840, 2.6, { id: "nope" });

  b.draw("title", 0.15, b.we("matters"));
  b.draw("globe", b.we("matters"), b.w("people"));
  b.draw(["p1", "p2"], b.w("people"), b.we("met") + 0.2);
  b.draw("agree", b.w("agree"), b.we("happened") - 0.2, { gap: 0.02 });
  b.draw("ok", b.we("happened") - 0.15, b.we("happened") + 0.2);
  b.draw("boss", b.w("one") - 0.1, b.w("keeping"));
  b.draw("nope", b.w("keeping"), b.speechEnd + 0.2);
}

// ---------------------------------------------------------------------------
export function s09(b) {
  house(b, 330, 400, 0.95, { id: "h1" });
  house(b, 1000, 400, 0.95, { id: "h2" });
  b.arrow([430, 250], [665, 90], [900, 250], { id: "send" });
  coin(b, 665, 205, 70, { id: "coin" });
  b.text("in minutes", 1460, 330, 76, { anchor: "middle", id: "mins" });

  mangoBox(b, 210, 740, 280, 170, { id: "box" });
  b.text("MANGOES", 350, 850, 40, { anchor: "middle", id: "boxL" });
  b.arrow([540, 830], [650, 770], [760, 830], { id: "trace" });
  barn(b, 920, 920, 0.85, { id: "barn" });
  b.text("7 days", 1450, 700, 84, { anchor: "middle", id: "week" });
  b.group("nope", () => {
    b.line(1290, 676, 1612, 668, { w: 7, roughness: 0.6 });
    b.line(1296, 694, 1606, 690, { w: 7, roughness: 0.6 });
  });
  b.text("2 sec", 1420, 900, 120, { anchor: "middle", id: "fast" });
  stopwatch(b, 1720, 850, 62, { id: "sw" });

  b.draw(["h1", "h2"], 0.15, b.w("money"));
  b.draw(["send", "coin"], b.w("money"), b.we("world"));
  b.draw("mins", b.w("in"), b.we("minutes") + 0.4);
  b.draw(["box", "boxL"], b.w("one"), b.w("trace"));
  b.draw(["trace", "barn"], b.w("trace"), b.we("farm") + 0.3);
  b.draw("week", b.w("that"), b.we("week") + 0.2);
  b.draw("nope", b.w("with"), b.w("about") - 0.05);
  b.draw("fast", b.w("about"), b.we("seconds"));
  b.draw("sw", b.we("seconds"), b.speechEnd + 0.45);
}

// ---------------------------------------------------------------------------
export function s10(b) {
  b.text("not magic", 960, 140, 84, { anchor: "middle", id: "title" });
  page(b, 180, 270, 680, 470, { id: "pg" });
  b.text("The moon is cheese", 500, 430, 52, { anchor: "middle", id: "lie" });
  lock(b, 500, 590, 0.75, { id: "lk1" });
  page(b, 1080, 300, 260, 320, { id: "b1" });
  page(b, 1540, 300, 260, 320, { id: "b2" });
  squiggles(b, 1110, 380, 200, 3, { id: "n1", gap: 60 });
  squiggles(b, 1570, 380, 200, 3, { id: "n2", gap: 60 });
  chain(b, 1330, 1550, 460, { id: "ch" });
  lock(b, 1440, 760, 1.05, { id: "lk2" });

  b.draw("title", 0.1, b.w("if") - 0.1);
  b.draw("pg", b.w("if"), b.w("writes"));
  b.draw("lie", b.w("writes"), b.we("false") + 0.1);
  b.draw("lk1", b.w("blockchain"), b.we("too"));
  b.draw(["b1", "n1", "b2", "n2"], b.w("but"), b.we("job"));
  b.draw("ch", b.we("job"), b.w("record") + 0.2);
  b.draw("lk2", b.w("record") + 0.22, b.we("secret"));
}

// ---------------------------------------------------------------------------
function ybaLogo(b, logoFile, cx, cy, height) {
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
  const outline = b.group("logoInk", () => out.forEach((d) => b.ink(d, { w: 5 })));
  const fill = b.fill(out.join(" "), { id: "logoFill" });
  return { outline, fill, count: out.length };
}

export function s11(b, { logoFile }) {
  const logo = ybaLogo(b, logoFile, 960, 360, 430);
  b.text("Youth Blockchain Association", 960, 710, 56, { anchor: "middle", id: "name" });
  b.text("joinyba.org", 960, 880, 110, { anchor: "middle", id: "url" });
  b.curve([[700, 915], [960, 928], [1220, 912]], { id: "under", w: 6 });

  b.draw(logo.outline, 0.15, b.w("youth") - 0.35);
  b.show(logo.fill, b.w("youth") - 0.4, b.w("youth") + 0.2);
  b.draw("name", b.w("youth") - 0.3, b.we("association"));
  b.draw("url", b.w("find"), b.we("org") + 0.1);
  b.draw("under", b.we("org") + 0.15, b.we("org") + 0.6);
}

export const BUILDERS = { s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11 };

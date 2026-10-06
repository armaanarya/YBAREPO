// One builder per scene. Positions are in 1920x1080 board pixels; every
// draw window is keyed to the narrator's word timestamps (b.w / b.we).
import { GRAY } from "./lib/draw.mjs";
import {
  person, bust, notebook, squiggles, house, barn, mangoBox, lock, coin, stopwatch, globe,
  mailbox, mailboxSlot, key, computer, magnifier, corkboard, pin, cabinet, eyeIcon,
  pencil, card, bankBuilding, books,
} from "./lib/figures.mjs";
import { endCard } from "./lib/logo.mjs";

// Dashed oval (two dashed arcs), for "the club" circle.
function dashedOval(b, cx, cy, w, h, id) {
  return b.group(id, () => {
    b.dashed([cx - w / 2, cy], [cx, cy - h], [cx + w / 2, cy], { w: 4 });
    b.dashed([cx + w / 2, cy], [cx, cy + h], [cx - w / 2, cy], { w: 4 });
  });
}

// Dashed rectangle, one dashed side at a time.
function dashedBox(b, x, y, w, h, id) {
  const side = (p, q) => b.dashed(p, [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], q, { w: 4 });
  return b.group(id, () => {
    side([x, y], [x + w, y]);
    side([x + w, y], [x + w, y + h]);
    side([x + w, y + h], [x, y + h]);
    side([x, y + h], [x, y]);
  });
}

// ---------------------------------------------------------------------------
export function s01(b) {
  const xs = [180, 500, 820, 1140, 1460];
  const recall = [];
  xs.forEach((x, i) => {
    recall.push(notebook(b, x, 110, 220, 140, { id: `nb${i}`, ringsOn: false, spine: false }));
    recall.push(squiggles(b, x + 30, 160, 160, 2, { id: `sq${i}`, gap: 44 }));
    recall.push(bust(b, x + 110, 320, 0.7, { id: `bu${i}` }));
  });
  eyeIcon(b, 420, 560, 160, { id: "eye" });
  b.text("READ", 420, 720, 64, { anchor: "middle", id: "read" });
  pencil(b, 800, 480, 150, { id: "pen", angle: 0.7 });
  b.text("WRITE", 900, 720, 64, { anchor: "middle", id: "write" });
  magnifier(b, 1360, 540, 62, { id: "mag" });
  b.text("CHECK", 1400, 720, 64, { anchor: "middle", id: "check" });
  b.text("?", 960, 950, 150, { anchor: "middle", id: "q" });

  b.draw(recall, 0.05, 0.7, { parallel: true, hand: false });
  b.draw("eye", 3.0, b.w("read") - 0.02);
  b.draw("read", b.w("read"), b.w("write") - 0.02);
  b.draw("pen", b.w("write"), b.w("write") + 0.42);
  b.draw("write", b.w("write") + 0.44, b.w("check") + 0.1);
  b.draw("mag", b.w("check") + 0.12, b.w("check") + 0.52);
  b.draw("check", b.w("check") + 0.54, b.w("that") - 0.02);
  b.draw("q", b.w("depends"), b.speechEnd + 0.3);
}

// ---------------------------------------------------------------------------
export function s02(b) {
  corkboard(b, 640, 110, 680, 540, { id: "cork" });
  notebook(b, 720, 190, 520, 400, { id: "nb", rings: 5 });
  pin(b, 980, 206, { id: "pin" });
  const crowd = [520, 720, 920, 1120, 1320].map((x, i) => bust(b, x, 790, 1.0, { id: `bu${i}` }));
  const rows = [
    ["READ", 300, "r"],
    ["WRITE", 410, "w"],
    ["CHECK", 520, "c"],
  ];
  rows.forEach(([t, y, k]) => {
    b.group(`row_${k}`, () => {
      b.text(t, 140, y, 54);
      b.check(b.measure(t, 54) + 190, y - 16, 0.9);
    });
  });
  b.text("PUBLIC", 300, 700, 92, { anchor: "middle", id: "pub" });
  b.text("Bitcoin", 980, 340, 60, { anchor: "middle", id: "btc" });
  b.text("Ethereum", 980, 460, 60, { anchor: "middle", id: "eth" });

  b.draw("cork", 0.35, 1.3);
  b.draw("nb", 1.32, b.w("pinned"));
  b.draw("pin", b.w("pinned") + 0.02, b.w("classroom"));
  b.draw(crowd, b.w("classroom"), b.we("wall"), { parallel: true, hand: false });
  b.draw("row_r", b.w("anyone"), b.w("add"));
  b.draw("row_w", b.w("add"), b.w("or"));
  b.draw("row_c", b.w("or"), b.w("that's"));
  b.draw("pub", b.w("that's"), b.we("blockchain") + 0.2);
  b.draw("btc", b.w("bitcoin"), b.w("ethereum"));
  b.draw("eth", b.w("ethereum"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s03(b) {
  b.text("PUBLIC", 300, 150, 64, { anchor: "middle", id: "head" });
  card(b, 140, 250, 380, 230, "Visa", { id: "card", size: 60 });
  bankBuilding(b, 820, 780, 0.9, { id: "bank1" });
  bankBuilding(b, 1540, 780, 0.9, { id: "bank2" });
  b.dashed([1180, 300], [1186, 560], [1180, 830], { id: "border", w: 4, color: GRAY });
  b.group("pay", () => {
    b.arrow([900, 470], [1180, 330], [1460, 470], { w: 5 });
    coin(b, 1040, 370, 64);
    coin(b, 1320, 370, 64);
  });
  b.group("fast", () => {
    b.text("faster", 380, 680, 84, { anchor: "middle" });
    b.line(150, 640, 210, 640, { w: 4, roughness: 0.2 });
    b.line(130, 664, 210, 664, { w: 4, roughness: 0.2 });
    b.line(160, 688, 210, 688, { w: 4, roughness: 0.2 });
  });

  b.draw("head", 0.35, 1.5);
  b.draw("card", b.w("visa") - 0.1, b.we("company"));
  b.draw("bank1", b.we("company") + 0.02, b.w("partners"));
  b.draw("bank2", b.w("partners"), b.w("over") - 0.45);
  b.draw("border", b.w("over") - 0.43, b.w("over"), { gap: 0.02 });
  b.draw("pay", b.w("over"), b.we("blockchains") + 0.1);
  b.draw("fast", b.w("that"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s04(b) {
  const MB = [960, 300, 300, 340];
  const slot = mailboxSlot(...MB);
  b.text("PayPal", 330, 200, 80, { anchor: "middle", id: "pp" });
  b.group("coin", () => {
    b.circle(330, 360, 120, { w: 6 });
    b.text("$", 316, 384, 64, { anchor: "middle" });
    b.poly([[340, 346], [356, 334], [356, 386]], { w: 5, roughness: 0.2 }); // flagged 1, so it can't read as "l"
  });
  b.text("on Ethereum", 330, 490, 44, { anchor: "middle", id: "on", color: GRAY });
  mailbox(b, ...MB, { id: "wallet", base: 860 });
  b.arrow([400, 340], [600, 300], [slot.x - 10, slot.y + slot.h / 2], { id: "send" });
  bankBuilding(b, 1560, 800, 0.9, { id: "bank" });
  b.group("closed", () => {
    b.rect(1450, 470, 220, 84, { w: 5 });
    b.text("CLOSED", 1560, 528, 46, { anchor: "middle" });
    b.arc(1740, 190, 110, 110, Math.PI * 0.35, Math.PI * 1.65, { w: 5 });
    b.arc(1772, 190, 90, 96, Math.PI * 0.55, Math.PI * 1.45, { w: 4 });
  });

  b.draw("pp", 0.35, 1.4);
  b.draw("coin", 1.42, 2.3);
  b.draw("on", 2.32, b.w("anyone") - 0.05);
  b.draw("wallet", b.w("anyone"), b.w("hold"));
  b.draw("send", b.w("hold"), b.w("even"));
  b.draw("bank", b.w("even"), b.w("closed"));
  b.draw("closed", b.w("closed"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s05(b) {
  notebook(b, 830, 300, 280, 190, { id: "nb", ringsOn: false });
  cabinet(b, 760, 220, 420, 460, { id: "cab", doors: false });
  lock(b, 1180, 450, 0.8, { id: "lock" });
  const members = [
    [250, 420],
    [330, 370],
    [410, 420],
  ].map(([x, y], i) => bust(b, x, y, 0.8, { id: `m${i}` }));
  dashedOval(b, 330, 440, 380, 170, "club");
  b.text("CLUB", 330, 660, 56, { anchor: "middle", id: "clubL" });
  person(b, 1560, 330, 0.7, { id: "out", mood: "frown" });
  b.cross(1560, 450, 2.2, { id: "no" });
  b.text("PRIVATE", 420, 900, 92, { anchor: "middle", id: "priv" });

  b.draw("nb", b.w("club"), b.w("in"));
  b.draw(["cab", "lock"], b.w("in"), b.we("cabinet") + 0.3);
  b.draw(members, b.w("club", 2) - 0.15, b.w("decides"), { parallel: true, hand: false });
  b.draw("club", b.w("decides"), b.w("read"), { gap: 0.02 });
  b.draw("clubL", b.w("read"), b.w("and"));
  b.draw(["out", "no"], b.w("and"), b.w("that's"));
  b.draw("priv", b.w("that's"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s06(b) {
  b.rect(200, 180, 440, 560, { id: "page" });
  b.text("payments", 420, 300, 56, { anchor: "middle", id: "pay" });
  b.text("$$$", 420, 430, 90, { anchor: "middle", id: "cash" });
  lock(b, 420, 590, 0.9, { id: "lock" });
  const crowd = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) crowd.push(computer(b, 860 + c * 120, 250 + r * 120, 0.5, { id: `cr${r}${c}`, notes: false }));
  b.text("lots of checkers", 1100, 480, 40, { anchor: "middle", id: "lots", color: GRAY });
  const few = [880, 1060, 1240].map((x, i) => computer(b, x, 720, 0.75, { id: `few${i}`, notes: false }));
  stopwatch(b, 1500, 720, 70, { id: "sw" });

  b.draw("page", 0.35, 1.6);
  b.draw(["pay", "cash"], b.w("records"), b.we("payments"));
  b.draw("lock", b.we("payments") + 0.02, b.w("with"));
  b.draw([...crowd, "lots"], b.w("with") - 0.1, b.w("fewer"), { parallel: true, hand: false });
  b.draw(few, b.w("fewer"), b.w("private"));
  b.draw("sw", b.w("run") - 0.1, b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s07(b) {
  b.text("J.P. Morgan", 380, 320, 64, { anchor: "middle", id: "jpm" });
  bankBuilding(b, 380, 680, 1.1, { id: "bank" });
  lock(b, 600, 600, 0.6, { id: "lock" });
  b.text("Kinexys", 380, 800, 72, { anchor: "middle", id: "kin" });
  globe(b, 1240, 430, 170, { id: "globe" });
  house(b, 980, 820, 0.7, { id: "h1" });
  house(b, 1500, 820, 0.7, { id: "h2" });
  b.arrow([1040, 690], [1240, 620], [1440, 690], { id: "move" });
  b.group("clock", () => {
    b.circle(1700, 200, 150, { w: 5 });
    b.text("24/7", 1700, 216, 46, { anchor: "middle" });
  });
  b.text("$ billions a day", 1240, 960, 64, { anchor: "middle", id: "vol" });

  b.draw("jpm", 0.35, b.w("one"));
  b.draw("bank", b.w("one") + 0.02, b.w("runs"));
  b.draw("lock", b.w("private"), b.w("called"));
  b.draw("kin", b.w("called"), b.w("companies") - 0.3);
  b.draw("globe", b.w("companies"), b.w("move"));
  b.draw(["h1", "h2"], b.w("move"), b.w("accounts") + 0.2);
  b.draw("move", b.w("accounts") + 0.22, b.we("countries"));
  b.draw("clock", b.w("any"), b.we("day") + 0.3);
  b.draw("vol", b.w("handles"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s08(b) {
  mangoBox(b, 170, 560, 260, 160, { id: "box" });
  b.text("MANGOES", 300, 670, 40, { anchor: "middle", id: "boxL" });
  b.arrow([460, 640], [560, 590], [660, 640], { id: "a1" });
  barn(b, 820, 740, 0.75, { id: "barn" });
  b.arrow([960, 640], [1060, 590], [1160, 640], { id: "a2" });
  house(b, 1320, 740, 0.95, { id: "store" });
  b.text("STORE", 1320, 800, 40, { anchor: "middle", id: "storeL" });
  b.text("Walmart", 330, 200, 84, { anchor: "middle", id: "wm" });
  dashedBox(b, 130, 400, 1360, 450, "fence");
  lock(b, 810, 410, 0.8, { id: "lock" });
  person(b, 1700, 520, 0.7, { id: "stranger", mood: "frown" });
  b.cross(1700, 640, 2.2, { id: "no" });

  b.draw(["box", "boxL"], 0.35, 1.3);
  b.draw(["a1", "barn"], 1.32, 2.4);
  b.draw(["a2", "store", "storeL"], 2.42, b.w("walmart") - 0.02);
  b.draw("wm", b.w("walmart"), b.w("on"));
  b.draw("fence", b.w("on"), b.we("blockchain"), { parallel: true, hand: false });
  b.draw("lock", b.w("private"), b.w("only"));
  b.draw(["stranger", "no"], b.w("only"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s09(b) {
  const line = "Sam: $5";
  const recall = [
    cabinet(b, 760, 240, 380, 420, { id: "cab", doors: false }),
    notebook(b, 820, 300, 260, 200, { id: "nb", ringsOn: false }),
    b.text(line, 950, 410, 50, { anchor: "middle", id: "entry" }),
  ];
  person(b, 330, 330, 1.0, { id: "sam", hair: "cap", armR: [110, 20] });
  key(b, 470, 420, 0.6, { id: "key" });
  const ins = [1420, 1600].map((x, i) => bust(b, x, 300, 0.9, { id: `in${i}` }));
  b.group("letIn", () => {
    b.arrow([1380, 380], [1280, 360], [1160, 380], { w: 5 });
    b.arrow([1580, 400], [1400, 470], [1160, 470], { w: 5 });
  });
  person(b, 1680, 600, 0.6, { id: "outB", mood: "frown" });
  b.cross(1680, 705, 1.9, { id: "outX" });
  const [x1, x2] = b.span(line, "$5", 950, 50, "middle");
  b.scribble(x1 - 4, 370, x2 - x1 + 8, 44, { id: "erase", w: 6 });
  b.text("$50", 1000, 480, 54, { anchor: "middle", id: "fifty" });
  b.text("TRUST?", 420, 900, 96, { anchor: "middle", id: "trust" });

  b.draw(recall, 0.05, 0.7, { parallel: true, hand: false });
  b.draw("sam", b.w("somebody"), b.w("sam") - 0.05);
  b.draw("key", b.w("sam") - 0.03, b.w("sam", 2));
  b.draw(ins, b.w("sam", 2), b.w("picks") + 0.1, { parallel: true, hand: false });
  b.draw("letIn", b.w("picks") + 0.1, b.w("and"));
  b.draw(["outB", "outX"], b.w("and"), b.w("they"));
  b.draw("erase", b.w("rewrite"), b.we("rewrite") + 0.1);
  b.draw("fifty", b.we("rewrite") + 0.12, b.we("notebook") + 0.3);
  b.draw("trust", b.w("trust") - 0.3, b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s10(b) {
  b.group("grid", () => {
    b.line(300, 310, 1620, 310, { w: 5, roughness: 0.4 });
    b.line(960, 200, 960, 660, { w: 5, roughness: 0.4 });
  });
  b.text("PUBLIC", 630, 270, 72, { anchor: "middle", id: "pubH" });
  b.text("PRIVATE", 1290, 270, 72, { anchor: "middle", id: "privH" });
  const row = (id, mark, x, y, text) =>
    b.group(id, () => {
      if (mark === "y") b.check(x, y - 16, 0.9);
      else b.cross(x, y - 16, 0.6);
      b.text(text, x + 50, y, 48);
    });
  row("p1", "y", 360, 430, "open to all");
  row("p2", "n", 360, 560, "everyone sees");
  row("q1", "y", 1020, 430, "keeps secrets");
  row("q2", "n", 1020, 560, "someone holds the key");
  b.text("J.P. Morgan: both", 960, 800, 72, { anchor: "middle", id: "jpm" });

  b.draw("grid", 0.35, 1.0);
  b.draw("pubH", 1.02, 1.8);
  b.draw("privH", 1.82, 2.8);
  b.draw("p1", b.w("public"), b.we("open") + 0.1);
  b.draw("p2", b.w("but"), b.we("write"));
  b.draw("q1", b.w("private"), b.we("secrets"));
  b.draw("q2", b.we("secrets") + 0.02, b.we("key") + 0.3);
  b.draw("jpm", b.w("morgan") - 0.3, b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s11(b) {
  b.text("YOUR TURN", 760, 140, 92, { anchor: "middle", id: "title" });
  b.group("pause", () => {
    b.circle(1180, 110, 96, { w: 5 });
    b.line(1164, 86, 1164, 134, { w: 7, roughness: 0.2 });
    b.line(1196, 86, 1196, 134, { w: 7, roughness: 0.2 });
  });
  books(b, 220, 680, { id: "books" });
  b.text("library", 340, 760, 48, { anchor: "middle", id: "lib", color: GRAY });
  b.group("pub", () => {
    b.text("PUBLIC?", 880, 470, 68);
    b.rect(1460, 410, 80, 80, { w: 5 });
  });
  b.group("priv", () => {
    b.text("PRIVATE?", 880, 640, 68);
    b.rect(1460, 580, 80, 80, { w: 5 });
  });
  b.text("Why?", 880, 860, 84, { id: "why" });

  b.draw("title", 0.1, b.we("turn") + 0.3);
  b.draw("pause", b.w("pause"), b.we("video"));
  b.draw("books", b.w("your", 2), b.w("library"));
  b.draw("lib", b.w("library"), b.we("blockchain"));
  b.draw("pub", b.w("should"), b.w("or"));
  b.draw("priv", b.w("or"), b.w("why") - 0.05);
  b.draw("why", b.w("why"), b.speechEnd + 0.4);
}

// ---------------------------------------------------------------------------
export function s12(b, { logoFile }) {
  endCard(b, { logoFile });
}

export const BUILDERS = { s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12 };

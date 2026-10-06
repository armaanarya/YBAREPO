// One builder per scene. Positions are in 1920x1080 board pixels; every
// draw window is keyed to the narrator's word timestamps (b.w / b.we).
import { GRAY } from "./lib/draw.mjs";
import {
  person, bust, notebook, page, squiggles, chain, bill, bubble, coin, lock,
  mailbox, mailboxDoor, mailboxSlot, mailboxKeyhole, key, computer, stamp,
  envelope, pizza, magnifier, button,
} from "./lib/figures.mjs";
import { endCard } from "./lib/logo.mjs";

// The wallet mailbox sits in the same spot in s02 and s03.
const MB = [560, 280, 380, 420];

// Hand-signed scrawl across [x1, x2] around baseline y.
function scrawl(b, x1, x2, y, amp, o = {}) {
  const n = 8;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x1 + (x2 - x1) * t + (i % 2 ? 10 : -6), y + (i % 2 ? -amp : amp * 0.5) * (1 - 0.3 * t)]);
  }
  return b.curve(pts, { w: o.w ?? 5, id: o.id, roughness: 0.4 });
}

// ---------------------------------------------------------------------------
export function s01(b) {
  person(b, 330, 330, 1.1, { id: "you", hair: "tuft", armR: [80, 30] });
  b.text("YOU", 330, 770, 60, { anchor: "middle", id: "youL" });
  person(b, 1590, 330, 1.1, { id: "sam", hair: "cap", armL: [-80, 30] });
  b.text("SAM", 1590, 770, 60, { anchor: "middle", id: "samL" });
  bill(b, 830, 110, 260, 120, { id: "bill" });
  b.arrow([520, 560], [960, 610], [1400, 560], { id: "pay" });
  const mini = [];
  [690, 900, 1110].forEach((x, i) => mini.push(page(b, x, 650, 120, 140, { id: `mb${i}`, w: 4.5 })));
  mini.push(chain(b, 802, 908, 720, { id: "mc0", h: 26, w: 5 }));
  mini.push(chain(b, 1012, 1118, 720, { id: "mc1", h: 26, w: 5 }));
  b.text("?", 960, 470, 170, { anchor: "middle", id: "q" });
  button(b, 960, 900, 320, 104, "SEND", { id: "send" });
  b.group("tap", () => {
    b.line(1128, 828, 1150, 796, { w: 4.5, roughness: 0.2 });
    b.line(1144, 852, 1186, 846, { w: 4.5, roughness: 0.2 });
    b.line(1108, 816, 1110, 778, { w: 4.5, roughness: 0.2 });
  });

  b.draw(["you", "youL", "sam", "samL"], 0.05, 0.9, { parallel: true, hand: false });
  b.draw("bill", b.w("five") - 0.1, b.we("dollars") + 0.2);
  b.draw("pay", b.w("now"), b.we("sam", 2) + 0.1);
  b.draw(mini, b.w("paying"), b.we("blockchain") + 0.35);
  b.draw("q", b.w("what"), b.we("happens") + 0.1);
  b.draw("send", b.w("hit") - 0.15, b.we("send"));
  b.draw("tap", b.we("send") + 0.02, b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s02(b) {
  const [cx, top, w, h] = MB;
  const slot = mailboxSlot(cx, top, w, h);
  b.text("WALLET", cx, 200, 84, { anchor: "middle", id: "title" });
  mailbox(b, cx, top, w, h, { id: "mbox", base: 900 });
  b.arrow([1040, 340], [880, 330], [slot.x + slot.w + 26, slot.y + slot.h / 2], { id: "arr" });
  b.text("ADDRESS", 1340, 370, 96, { anchor: "middle", id: "addr" });
  b.text("0x7A3F...", 1340, 480, 64, { anchor: "middle", id: "code", color: GRAY });
  const busts = [1180, 1340, 1500].map((x, i) => bust(b, x, 610, 0.9, { id: `bu${i}` }));
  coin(b, 270, 300, 80, { id: "coin" });
  b.arrow([306, 336], [380, 400], [slot.x - 8, slot.y + slot.h / 2], { id: "drop", w: 5 });

  b.draw("title", 0.15, b.we("wallet") + 0.25);
  b.draw("mbox", b.w("think"), b.w("its"));
  b.draw("arr", b.w("slot") - 0.05, b.w("has") + 0.05);
  b.draw("addr", b.w("has") + 0.07, b.w("can") + 0.1);
  b.draw("code", b.w("can") + 0.12, b.we("see") + 0.2);
  b.draw(busts, b.w("anyone"), b.we("see"), { parallel: true, hand: false });
  b.draw(["coin", "drop"], b.w("send"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s03(b) {
  const [cx, top, w, h] = MB;
  const d = mailboxDoor(cx, top, w, h);
  const [kx, ky] = mailboxKeyhole(cx, top, w, h);
  mailbox(b, cx, top, w, h, { id: "mbox", base: 900 });
  person(b, 1540, 330, 1.05, { id: "you", hair: "tuft", armL: [-110, 20] });
  key(b, 1350, 432, 1, { id: "key", angle: Math.PI });
  b.arrow([1110, 450], [930, 440], [kx + 26, ky - 10], { id: "toHole", w: 4, color: GRAY, head: 20 });
  b.text("PRIVATE KEY", 1080, 170, 100, { anchor: "middle", id: "pk" });
  b.poly(
    [
      [d.x, d.y],
      [d.x - 130, d.y + 30],
      [d.x - 130, d.y + d.h - 30],
      [d.x, d.y + d.h],
    ],
    { id: "swing", w: 4.5, roughness: 0.4 },
  );
  const coins = [
    [492, 616],
    [560, 620],
    [628, 614],
    [526, 552],
    [596, 552],
  ].map(([x, y], i) => coin(b, x, y, 58, { id: `c${i}` }));

  b.draw("mbox", 0.05, 0.6, { parallel: true, hand: false });
  b.draw("you", 0.1, b.w("key") - 0.02);
  b.draw("key", b.w("key"), b.we("it") + 0.1);
  b.draw("toHole", b.we("it") + 0.12, b.w("called"));
  b.draw("pk", b.w("private") - 0.1, b.we("key", 2) + 0.45);
  b.draw("swing", b.w("controls"), b.w("money"));
  b.draw(coins, b.w("money"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s04(b) {
  b.rect(200, 140, 640, 520, { id: "card" });
  b.text("message", 520, 200, 40, { anchor: "middle", id: "lab", color: GRAY });
  b.text("Send $5", 520, 310, 72, { anchor: "middle", id: "l1" });
  b.text("to 0x9C4E", 520, 410, 52, { anchor: "middle", id: "l2", color: GRAY });
  key(b, 1090, 560, 1, { id: "key", angle: Math.PI });
  b.group("sig", () => {
    scrawl(b, 270, 640, 560, 34);
    b.circle(745, 560, 96, { w: 5 });
    b.circle(745, 560, 40, { w: 4 });
  });
  b.text("SIGNATURE", 520, 790, 84, { anchor: "middle", id: "sigL" });
  b.group("mag", () => {
    magnifier(b, 1330, 300, 115);
    scrawl(b, 1260, 1400, 300, 24, { w: 4 });
  });
  b.check(1530, 190, 1.4, { id: "ok" });
  b.group("fake", () => {
    b.rect(1230, 560, 380, 220, { w: 5 });
    b.poly([[1270, 690], [1300, 640], [1320, 700], [1350, 630], [1380, 705], [1420, 645], [1450, 690]], { w: 4, roughness: 1.4 });
  });
  b.cross(1420, 670, 2.3, { id: "no" });

  b.draw("card", b.w("pay"), b.w("write") - 0.1);
  b.draw("lab", b.w("write") - 0.08, b.we("message") + 0.3);
  b.draw("l1", b.w("five"), b.we("dollars"));
  b.draw("l2", b.w("to"), b.we("address"));
  b.draw("key", b.we("address") + 0.02, b.w("signs"));
  b.draw("sig", b.w("signs"), b.we("it") + 0.15);
  b.draw("sigL", b.we("it") + 0.17, b.w("check"));
  b.draw(["mag", "ok"], b.w("check"), b.we("signature") + 0.05);
  b.draw(["fake", "no"], b.w("nobody"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s05(b) {
  const recall = [
    b.rect(220, 130, 520, 340, { id: "card" }),
    b.text("Send $5", 420, 260, 60, { anchor: "middle", id: "l1" }),
    scrawl(b, 270, 520, 400, 24, { id: "sig", w: 4 }),
  ];
  stamp(b, 600, 150, 112, 132, { id: "stamp", label: "$", size: 54 });
  b.text("FEE", 980, 250, 100, { anchor: "middle", id: "fee" });
  b.arrow([870, 230], [800, 180], [730, 210], { id: "feeArr" });
  b.text("busy!", 460, 600, 72, { anchor: "middle", id: "busy" });
  const crowd = [
    [210, 640],
    [400, 660],
    [590, 640],
    [300, 790],
    [500, 800],
  ].map(([x, y], i) => envelope(b, x, y, 150, 100, { id: `e${i}` }));
  stamp(b, 1000, 560, 280, 320, { id: "big", label: "$$$", size: 92 });

  b.draw(recall, 0.05, 0.6, { parallel: true, hand: false });
  b.draw("stamp", b.w("small") - 0.1, b.w("like") - 0.02);
  b.draw(["fee", "feeArr"], b.w("like"), b.we("letter") + 0.2);
  b.draw("busy", b.w("when"), b.we("busy") + 0.1);
  b.draw(crowd, b.w("network"), b.we("busy"), { parallel: true, hand: false });
  b.draw("big", b.w("stamp", 2), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s06(b) {
  b.group("card", () => {
    b.rect(1110, 440, 180, 120, { w: 5 });
    b.text("$5", 1200, 515, 54, { anchor: "middle" });
  });
  const pcs = [
    [800, 500, [1100, 500], [990, 492], [884, 500]],
    [1600, 500, [1300, 500], [1410, 492], [1516, 500]],
    [990, 230, [1150, 430], [1080, 350], [1032, 292]],
    [1410, 230, [1250, 430], [1320, 350], [1368, 292]],
    [990, 770, [1150, 570], [1080, 650], [1032, 706]],
    [1410, 770, [1250, 570], [1320, 650], [1368, 706]],
  ];
  const arrows = pcs.map(([, , p1, mid, p2], i) => b.arrow(p1, mid, p2, { id: `ar${i}`, w: 4, head: 18 }));
  const screens = pcs.map(([x, y], i) => computer(b, x, y, 0.9, { id: `pc${i}`, notes: false }));
  const notes = pcs.map(([x, y], i) =>
    b.group(`nt${i}`, () => {
      for (let k = 0; k < 3; k++) {
        const yy = y - 20 + k * 20;
        b.line(x - 43, yy, x + (k === 2 ? 7 : 43), yy, { w: 3, color: GRAY, roughness: 0.3 });
      }
    }),
  );
  const ticks = pcs.map(([x, y], i) => b.check(x + 84, y - 52, 0.6, { id: `tk${i}`, w: 5 }));
  b.text("CHECKS", 130, 330, 64, { id: "head" });
  b.text("signature real?", 130, 450, 54, { id: "q1" });
  b.check(610, 436, 1.1, { id: "ok1" });
  b.text("have $5?", 130, 600, 54, { id: "q2" });
  b.check(420, 586, 1.1, { id: "ok2" });

  b.draw("card", 0.1, b.w("goes") + 0.1);
  b.draw(arrows, b.w("goes") + 0.12, b.w("computers"), { parallel: true, hand: false });
  b.draw(screens, b.w("computers") - 0.05, b.we("computers") + 0.3, { parallel: true, hand: false });
  b.draw(notes, b.w("copies"), b.we("notebook"), { parallel: true, hand: false });
  b.draw("head", b.w("each"), b.we("checks") + 0.15);
  b.draw("q1", b.we("checks") + 0.17, b.we("real"));
  b.draw("ok1", b.we("real") + 0.02, b.w("do") + 0.1);
  b.draw("q2", b.w("do") + 0.12, b.we("dollars") - 0.05);
  b.draw("ok2", b.we("dollars") - 0.03, b.speechEnd + 0.35);
  b.draw(ticks, b.speechEnd - 0.05, b.speechEnd + 0.45, { parallel: true, hand: false });
}

// ---------------------------------------------------------------------------
export function s07(b) {
  person(b, 260, 330, 1.0, { id: "sam", hair: "cap", armR: [100, 10] });
  b.text("SAM", 260, 700, 56, { anchor: "middle", id: "samL" });
  b.text("0x7A3F", 1500, 170, 64, { anchor: "middle", id: "code" });
  b.text("public", 1500, 245, 48, { anchor: "middle", id: "pub", color: GRAY });
  b.rect(480, 280, 640, 330, { id: "card" });
  b.text("Send ALL", 800, 390, 70, { anchor: "middle", id: "l1" });
  b.text("to Sam", 800, 480, 70, { anchor: "middle", id: "l2" });
  key(b, 1340, 440, 1, { id: "key" });
  b.cross(1440, 440, 2.4, { id: "noKey" });
  b.dashed([560, 560], [800, 566], [1030, 560], { id: "sigLine", w: 4, dash: 22, gap: 16 });
  b.text("?", 1068, 575, 70, { anchor: "middle", id: "q" });
  const xs = [420, 640, 860, 1080, 1300, 1520];
  const pcs = xs.map((x, i) => computer(b, x, 720, 0.75, { id: `pc${i}` }));
  const xs2 = xs.map((x, i) => b.cross(x, 714, 0.9, { id: `x${i}` }));
  b.text("REJECTED", 960, 920, 100, { anchor: "middle", id: "rej" });

  b.draw(["sam", "samL"], 0.1, b.we("sneaky") + 0.2);
  b.draw("code", b.w("your") - 0.08, b.w("is") + 0.02);
  b.draw("pub", b.w("is") + 0.04, b.we("public") + 0.15);
  b.draw("card", b.w("so") + 0.15, b.w("writes") + 0.3);
  b.draw("l1", b.w("writes") + 0.32, b.we("all") + 0.05);
  b.draw("l2", b.we("all") + 0.07, b.we("sam", 3) + 0.1);
  b.draw("key", b.w("without") - 0.05, b.we("key") + 0.1);
  b.draw("noKey", b.w("can't"), b.w("make") + 0.1);
  b.draw("sigLine", b.w("make") + 0.12, b.we("signature") + 0.2, { gap: 0.02 });
  b.draw("q", b.we("signature") + 0.22, b.we("signature") + 0.7);
  b.draw(pcs, b.we("signature") + 0.75, b.w("computer"), { parallel: true, hand: false });
  b.draw(xs2, b.w("says"), b.we("no") - 0.2, { parallel: true, hand: false });
  b.draw("rej", b.w("says"), b.speechEnd + 0.45);
}

// ---------------------------------------------------------------------------
export function s08(b) {
  const recall = [
    page(b, 140, 110, 300, 330, { id: "p0" }),
    page(b, 560, 110, 300, 330, { id: "p1" }),
    squiggles(b, 180, 200, 220, 3, { id: "n0", gap: 56 }),
    squiggles(b, 600, 200, 220, 3, { id: "n1", gap: 56 }),
    b.text("7F3A", 290, 400, 60, { anchor: "middle", id: "c0" }),
    b.text("B204", 710, 400, 60, { anchor: "middle", id: "c1" }),
    chain(b, 432, 568, 275, { id: "ch01", h: 40 }),
  ];
  computer(b, 1590, 270, 0.95, { id: "pc" });
  b.arrow([1500, 280], [1420, 266], [1340, 280], { id: "arr" });
  page(b, 980, 110, 340, 330, { id: "p2" });
  b.text("$5 to Sam", 1140, 230, 50, { anchor: "middle", id: "entry" });
  squiggles(b, 1020, 300, 240, 2, { id: "n2", gap: 56 });
  chain(b, 852, 988, 275, { id: "ch12", h: 40 });
  const nbX = [680, 900, 1120, 1340, 1560];
  const nbs = nbX.map((x, i) => notebook(b, x, 560, 190, 140, { id: `nb${i}`, ringsOn: false, spine: false }));
  const fives = nbX.map((x, i) => b.text("$5", x + 95, 650, 52, { anchor: "middle", id: `f${i}` }));
  person(b, 300, 570, 0.85, { id: "sam", hair: "cap", armR: [80, 10] });
  bill(b, 380, 600, 200, 92, { id: "bill" });

  b.draw(recall, 0.05, 0.6, { parallel: true, hand: false });
  b.draw("pc", b.w("those"), b.w("adds"));
  b.draw("arr", b.w("adds"), b.w("message"));
  b.draw("p2", b.w("message"), b.w("next"));
  b.draw("entry", b.w("next"), b.we("block") + 0.3);
  b.draw("n2", b.we("block") + 0.32, b.w("block", 2));
  b.draw("ch12", b.w("joins"), b.we("chain") + 0.2);
  b.draw(nbs, b.w("every"), b.we("copy") + 0.1, { parallel: true, hand: false });
  b.draw(fives, b.w("updates"), b.we("updates") + 0.2, { parallel: true, hand: false });
  b.draw("sam", b.w("and"), b.w("five"));
  b.draw("bill", b.w("five"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s09(b) {
  page(b, 1100, 150, 520, 600, { id: "pg" });
  b.text("block 57043", 1340, 250, 56, { anchor: "middle", id: "blk" });
  b.group("inside", () => {
    squiggles(b, 1150, 340, 420, 2, { gap: 56 });
    b.text("10,000 BTC", 1160, 520, 54);
    squiggles(b, 1150, 610, 420, 2, { gap: 56 });
  });
  b.text("2010", 460, 200, 120, { anchor: "middle", id: "year" });
  b.text("10,000 bitcoins", 460, 330, 64, { anchor: "middle", id: "amt" });
  b.arrow([460, 365], [474, 418], [460, 470], { id: "arr" });
  pizza(b, 330, 640, 230, { id: "pz0", cuts: 2, peps: 3 });
  pizza(b, 600, 640, 230, { id: "pz1", cuts: 2, peps: 3 });
  magnifier(b, 1309, 500, 172, { id: "mag" }); // ring clears the 10,000 BTC line

  b.draw("pg", 0.1, 0.95);
  b.draw("blk", 0.97, b.w("in") - 0.02);
  b.draw("year", b.w("in"), b.w("programmer"));
  b.draw("amt", b.w("programmer"), b.we("bitcoins"));
  b.draw("arr", b.we("bitcoins") + 0.02, b.we("bitcoins") + 0.3);
  b.draw(["pz0", "pz1"], b.we("bitcoins") + 0.32, b.w("transaction") - 0.05);
  b.draw("inside", b.w("transaction"), b.we("blockchain"));
  b.draw("mag", b.w("anyone"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s10(b) {
  button(b, 480, 200, 300, 110, "UNDO", { id: "undo" });
  b.cross(480, 200, 2.6, { id: "x1" });
  button(b, 1180, 200, 600, 110, "forgot password?", { id: "forgot", size: 50 });
  b.cross(1180, 200, 2.6, { id: "x2" });
  mailbox(b, 640, 470, 240, 280, { id: "mbox", base: 880, keyhole: false });
  const d = mailboxDoor(640, 470, 240, 280);
  const slot = mailboxSlot(640, 470, 240, 280);
  b.group("wrong", () => {
    b.text("?", d.x + d.w / 2, d.y + d.h / 2 + 30, 84, { anchor: "middle" });
    coin(b, 300, 500, 80);
    b.arrow([340, 525], [430, 520], [slot.x - 8, slot.y + slot.h / 2], { w: 5 });
  });
  b.text("gone", 330, 860, 84, { anchor: "middle", id: "gone" });
  b.ellipse(1250, 860, 360, 80, { id: "hole", w: 6 });
  key(b, 1140, 590, 1, { id: "key", angle: 1.15 });
  lock(b, 1640, 650, 1.15, { id: "lock" });

  b.draw("undo", 0.5, b.w("button"));
  b.draw("x1", b.w("button"), b.w("no", 2) - 0.02);
  b.draw("forgot", b.w("no", 2), b.we("button", 2) + 0.15);
  b.draw("x2", b.we("button", 2) + 0.17, b.w("send"));
  b.draw("mbox", b.w("send"), b.w("wrong") + 0.3);
  b.draw("wrong", b.w("wrong") + 0.32, b.we("address") + 0.3);
  b.draw("gone", b.we("address") + 0.32, b.we("gone") + 0.3);
  b.draw("hole", b.w("lose") - 0.1, b.w("private"));
  b.draw("key", b.w("private"), b.we("key") + 0.1);
  b.draw("lock", b.w("nobody"), b.speechEnd + 0.35);
}

// ---------------------------------------------------------------------------
export function s11(b) {
  b.text("YOUR TURN", 760, 140, 92, { anchor: "middle", id: "title" });
  b.group("pause", () => {
    b.circle(1180, 110, 96, { w: 5 });
    b.line(1164, 86, 1164, 134, { w: 7, roughness: 0.2 });
    b.line(1196, 86, 1196, 134, { w: 7, roughness: 0.2 });
  });
  person(b, 300, 430, 1.0, { id: "sam", hair: "cap", armR: [70, -20] });
  bubble(b, 650, 330, 440, 150, 380, 420, { id: "bub" });
  b.text("your key?", 650, 350, 58, { anchor: "middle", id: "ask" });
  b.text("PRIVATE KEY", 960, 540, 64, { id: "r1" });
  b.group("share", () => {
    b.text("share?", 1610, 420, 48, { anchor: "middle", color: GRAY });
    b.rect(1570, 480, 80, 80, { w: 5 });
  });
  b.group("r2", () => {
    b.text("ADDRESS", 960, 720, 64);
    b.rect(1570, 660, 80, 80, { w: 5 });
  });

  b.draw("title", 0.1, b.we("turn") + 0.3);
  b.draw("pause", b.w("pause"), b.we("video"));
  b.draw("sam", b.we("video") + 0.02, b.w("to") - 0.02);
  b.draw("bub", b.w("to"), b.w("private"));
  b.draw("ask", b.w("private") + 0.02, b.w("just") + 0.3);
  b.draw("r1", b.w("just") + 0.32, b.w("do"));
  b.draw("share", b.w("do"), b.we("it") + 0.2);
  b.draw("r2", b.w("what"), b.speechEnd + 0.4);
}

// ---------------------------------------------------------------------------
export function s12(b, { logoFile }) {
  endCard(b, { logoFile });
}

export const BUILDERS = { s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12 };

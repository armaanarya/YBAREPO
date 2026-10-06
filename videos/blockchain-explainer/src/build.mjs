// Builds compositions/frames/NN-*.html (one whiteboard scene each) and index.html
// from SCRIPT (src/script.mjs), the ElevenLabs word timings (audio_meta.json),
// and the scene layouts (src/scenes.mjs).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Board } from "./lib/draw.mjs";
import { HAND_SVG, HAND_ANGLE } from "./hand.mjs";
import { BUILDERS } from "./scenes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HEAD = 0.3; // board is blank this long before the voice starts
const HOLD = 0.55; // finished board holds after the last word
const WIPE = 0.45; // left-to-right wipe into the next scene
const END_HOLD = 2.4; // the end card stays up longer
const BOARD = "#f6f6f2";

const meta = JSON.parse(readFileSync(join(ROOT, "audio_meta.json"), "utf8"));
const engineSrc = readFileSync(join(ROOT, "src/lib/engine.js"), "utf8");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Where speech really ends: ElevenLabs pads each clip with trailing silence.
function speechEnd(file, dur) {
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", file, "-af", "silencedetect=noise=-40dB:d=0.15", "-f", "null", "-"], {
    encoding: "utf8",
  }).stderr;
  const starts = [...log.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...log.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  const last = starts.at(-1);
  if (last !== undefined && (ends.length < starts.length || Math.abs(ends.at(-1) - dur) < 0.06)) return +last.toFixed(3);
  return dur;
}

mkdirSync(join(ROOT, "compositions/frames"), { recursive: true });

let cursor = 0;
const scenes = meta.scenes.map((m, i) => {
  const last = i === meta.scenes.length - 1;
  const se = speechEnd(join(ROOT, m.file), m.duration);
  const dur = +(HEAD + se + (last ? END_HOLD : HOLD + WIPE)).toFixed(3);
  const b = new Board(m.id, { words: m.words, head: HEAD, dur, speechEnd: HEAD + se });
  BUILDERS[m.id](b, { logoFile: join(ROOT, "assets/yba-mark.svg") });
  if (!last) b.tween("wipe", "wipe", 0, 100, dur - WIPE, dur, "io");
  const sched = b.schedule();
  for (const bt of sched.beats) {
    if (bt.b > dur - (last ? 0 : WIPE) + 1e-6) throw new Error(`${m.id}: beat ${bt.t} ends at ${bt.b} after board time ${dur - WIPE}`);
  }
  const file = `compositions/frames/${String(i + 1).padStart(2, "0")}-${slug(m.title)}.html`;
  const sid = m.id;
  const engine = engineSrc
    .replace("__SID__", sid)
    .replace("__SCHEDULE__", JSON.stringify(sched))
    .replace("__ANGLE__", String(HAND_ANGLE));
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${m.title}</title>
  </head>
  <body>
    <template>
      <style>
        #${sid}-root { position: absolute; inset: 0; }
        #${sid}-wipe { position: absolute; inset: 0; }
        #${sid}-svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
        #${sid}-edge {
          position: absolute; top: 0; left: 0; width: 120px; height: 100%; opacity: 0;
          background: linear-gradient(90deg, rgba(246,246,242,0) 0%, rgba(110,110,104,0.12) 50%, rgba(246,246,242,0) 100%);
        }
        #${sid}-hand { filter: drop-shadow(10px 16px 12px rgba(0, 0, 0, 0.16)); }
      </style>
      <div id="${sid}-root" data-composition-id="${sid}" data-width="1920" data-height="1080">
        <div id="${sid}-wipe">
          <svg id="${sid}-svg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
            ${b.markup()}
            <g id="${sid}-hand">${HAND_SVG}</g>
          </svg>
        </div>
        <div id="${sid}-edge"></div>
      </div>
      <script>
${engine}
      </script>
    </template>
  </body>
</html>
`;
  writeFileSync(join(ROOT, file), html);
  const s = { ...m, file, sid, start: +cursor.toFixed(3), dur, speechEnd: se, strokes: b.n };
  cursor += dur;
  return s;
});

const total = +cursor.toFixed(3);
const endCard = scenes.at(-1);
const bugEnd = +(endCard.start + 0.6).toFixed(3);

const hosts = scenes
  .map(
    (s) => `      <div id="${s.sid}" data-composition-id="${s.sid}" data-composition-src="${s.file}"
        data-start="${s.start}" data-duration="${s.dur}" data-track-index="1" data-width="1920" data-height="1080"></div>`,
  )
  .join("\n");
const voices = scenes
  .map((s) => {
    const len = Math.min(s.duration, s.dur - HEAD).toFixed(3);
    return `      <audio id="vo-${s.sid}" src="${s.voiceFile ?? `assets/voice/${s.id}.mp3`}" data-start="${(s.start + HEAD).toFixed(3)}" data-duration="${len}" data-track-index="3" data-volume="1"></audio>`;
  })
  .join("\n");

const index = `<!doctype html>
<html lang="en" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>What is a blockchain?</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: ${BOARD}; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: ${BOARD}; }
      #board {
        position: absolute; inset: 0;
        background: radial-gradient(ellipse at 50% 42%, #fbfbf8 0%, #f5f5f0 62%, #e9e9e3 100%);
      }
      #bug { position: absolute; left: 36px; bottom: 30px; width: 64px; height: 64px; opacity: 0.72; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
      <div id="board" class="clip" data-start="0" data-duration="${total}" data-track-index="0"></div>
${hosts}
      <img id="bug" class="clip" src="assets/yba-mark.svg" alt="YBA" data-start="0" data-duration="${bugEnd}" data-track-index="2" />
${voices}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#bug", { opacity: 0.72 }, { opacity: 0, duration: 0.5, ease: "power1.out" }, ${endCard.start});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
writeFileSync(join(ROOT, "index.html"), index);

writeFileSync(
  join(ROOT, "timeline.json"),
  JSON.stringify(
    scenes.map(({ sid, title, file, start, dur, speechEnd: se, duration }) => ({ sid, title, file, start, dur, speechEnd: se, voice: duration })),
    null,
    1,
  ),
);
for (const s of scenes) console.log(`${s.sid} ${s.start.toFixed(2)}s +${s.dur.toFixed(2)}s  speech ${s.speechEnd.toFixed(2)}s  ${s.title}`);
console.log(`total ${total}s`);

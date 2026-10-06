// One ElevenLabs narration clip per scene, plus word timestamps for the draw timing.
// Usage:
//   node src/tts.mjs --check          key + remaining quota, spends nothing
//   node src/tts.mjs                  generate any missing scenes
//   node src/tts.mjs s03 s07 --force  regenerate specific scenes
// Key lookup order: $ELEVENLABS_API_KEY, ./.env, ~/.config/yba-video/.env
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, VOICE_ID, MODEL_ID, VOICE_SETTINGS } from "./script.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VOICE_DIR = join(ROOT, "assets/voice");
const API = "https://api.elevenlabs.io/v1";

function readEnvFile(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split("\n")
      .filter((l) => /^\s*[A-Z_]+\s*=/.test(l))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "")]),
  );
}
const KEY =
  process.env.ELEVENLABS_API_KEY ||
  readEnvFile(join(ROOT, ".env")).ELEVENLABS_API_KEY ||
  readEnvFile(join(homedir(), ".config/yba-video/.env")).ELEVENLABS_API_KEY;
if (!KEY) {
  console.error(
    "No ElevenLabs key. Put ELEVENLABS_API_KEY=... in this project's .env (gitignored) " +
      "or in ~/.config/yba-video/.env, or export it in the shell.",
  );
  process.exit(2);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const todo = SCENES.filter((s) => {
  if (only.length && !only.includes(s.id)) return false;
  const done = existsSync(join(VOICE_DIR, `${s.id}.mp3`)) && existsSync(join(VOICE_DIR, `${s.id}.words.json`));
  return force || !done;
});

const sub = await fetch(`${API}/user/subscription`, { headers: { "xi-api-key": KEY } });
if (!sub.ok) {
  console.error(`Key check failed: HTTP ${sub.status} ${await sub.text()}`);
  process.exit(2);
}
const quota = await sub.json();
const left = quota.character_limit - quota.character_count;
const need = todo.reduce((n, s) => n + s.say.length, 0);
// Episode 1's quota dropped ~1.7x its script length (cause unconfirmed), so budget for that.
const budget = Math.ceil(need * 1.7);
console.log(
  `ElevenLabs ${quota.tier}: ${left} of ${quota.character_limit} characters left; ` +
    `this run is ${need} script characters (budget ~${budget}).`,
);
if (budget > left) console.warn("Warning: the budget estimate is above what's left this month.");
if (args.includes("--check")) process.exit(0);
if (need > left) {
  console.error("Not enough characters left this month. Trim the script or wait for the reset.");
  process.exit(3);
}

mkdirSync(VOICE_DIR, { recursive: true });

function wordsFromAlignment(al) {
  const words = [];
  let cur = null;
  al.characters.forEach((ch, i) => {
    const start = al.character_start_times_seconds[i];
    const end = al.character_end_times_seconds[i];
    if (/\s/.test(ch)) {
      if (cur) words.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = { text: "", start, end };
    cur.text += ch;
    cur.end = end;
  });
  if (cur) words.push(cur);
  return words.map((w, id) => ({ id, ...w, start: +w.start.toFixed(3), end: +w.end.toFixed(3) }));
}

function probeDuration(file) {
  const out = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
  return +(+out.toString().trim()).toFixed(3);
}

for (const scene of todo) {
  const i = SCENES.indexOf(scene);
  const body = {
    text: scene.say,
    model_id: MODEL_ID,
    voice_settings: VOICE_SETTINGS,
    // Neighboring lines keep the delivery continuous across separate clips.
    previous_text: SCENES[i - 1]?.say,
    next_text: SCENES[i + 1]?.say,
  };
  const res = await fetch(`${API}/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${scene.id}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  const mp3 = join(VOICE_DIR, `${scene.id}.mp3`);
  writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
  const words = wordsFromAlignment(data.alignment);
  writeFileSync(join(VOICE_DIR, `${scene.id}.words.json`), JSON.stringify(words, null, 1));
  console.log(`ok ${scene.id}: ${words.length} words, ${probeDuration(mp3)}s`);
}

const meta = SCENES.map((s) => {
  const mp3 = join(VOICE_DIR, `${s.id}.mp3`);
  if (!existsSync(mp3)) return { id: s.id, title: s.title, missing: true };
  return {
    id: s.id,
    title: s.title,
    file: `assets/voice/${s.id}.mp3`,
    duration: probeDuration(mp3),
    words: JSON.parse(readFileSync(join(VOICE_DIR, `${s.id}.words.json`), "utf8")),
  };
});
writeFileSync(join(ROOT, "audio_meta.json"), JSON.stringify({ voice: VOICE_ID, model: MODEL_ID, scenes: meta }, null, 1));
console.log("total voice", meta.reduce((a, m) => a + (m.duration || 0), 0).toFixed(2), "s");

// Generates one ElevenLabs narration clip per scene plus word timestamps.
// Usage: node src/tts.mjs [--force] [s03 s07 ...]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, VOICE_ID, MODEL_ID, VOICE_SETTINGS } from "./script.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const VOICE_DIR = join(ROOT, "assets/voice");
mkdirSync(VOICE_DIR, { recursive: true });

const env = Object.fromEntries(
  readFileSync(join(ROOT, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const KEY = process.env.ELEVENLABS_API_KEY || env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error("ELEVENLABS_API_KEY missing from .env");

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));

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

for (const [i, scene] of SCENES.entries()) {
  const mp3 = join(VOICE_DIR, `${scene.id}.mp3`);
  const wordsFile = join(VOICE_DIR, `${scene.id}.words.json`);
  if (only.length && !only.includes(scene.id)) continue;
  if (existsSync(mp3) && existsSync(wordsFile) && !force) {
    console.log(`skip ${scene.id} (exists)`);
    continue;
  }
  const body = {
    text: scene.say,
    model_id: MODEL_ID,
    voice_settings: VOICE_SETTINGS,
    previous_text: SCENES[i - 1]?.say,
    next_text: SCENES[i + 1]?.say,
  };
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error(`${scene.id}: HTTP ${res.status} ${await res.text()}`);
  const data = await res.json();
  writeFileSync(mp3, Buffer.from(data.audio_base64, "base64"));
  const words = wordsFromAlignment(data.alignment);
  writeFileSync(wordsFile, JSON.stringify(words, null, 1));
  console.log(`ok ${scene.id}: ${words.length} words, ${probeDuration(mp3)}s`);
}

const meta = SCENES.map((s) => {
  const mp3 = join(VOICE_DIR, `${s.id}.mp3`);
  if (!existsSync(mp3)) return { id: s.id, missing: true };
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

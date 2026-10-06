---
name: yba-whiteboard-video
description: Make narrated whiteboard ("scribe") explainer videos for YBA, the Youth Blockchain Association. A marker hand draws each idea on a whiteboard while an ElevenLabs voice explains it, rendered to a 1080p MP4 with HyperFrames, with the YBA logo in the corner and a joinyba.org end card. Use this whenever the user asks for the next episode of the YBA blockchain video series, a whiteboard / doodle / scribe / hand-drawn explainer, or an explainer video on blockchain, crypto, wallets, smart contracts, Bitcoin, or any topic for middle or high schoolers. Also use it to edit, re-voice, or re-render an existing video under videos/ in YBAREPO, even if the user only says "make another one like the last video".
---

# YBA whiteboard video

Builds the next episode of the YBA curriculum (`references/series-plan.md`), which started with "What is a blockchain?" (`examples/ep01-what-is-a-blockchain/`; its finished board is in `contact-sheet.png` there). The pipeline is deterministic code, not freehand animation. You write the script, the scene layouts, and the word-timed draw schedule, and the bundled engine does the rest.

## The look (keep it the same across episodes)

- **Board.** Off-white whiteboard, 1920×1080, 30 fps. Black, white and gray only, matching the YBA site.
- **Drawing.** Every element is an open stroke drawn by a line-art hand holding a marker. The nib rides the stroke tip. Shapes come from roughjs, so they look hand-drawn.
- **Handwriting.** EMS Tech, a single-stroke font, so the marker writes real letters.
- **Characters.** YOU (tuft of hair) and SAM (cap) carry the story across episodes. Sam is the one who tries to cheat.
- **Scene changes.** One scene per narration line. Each ends with the same left-to-right wipe.
- **Logo.** The YBA mark sits small in the bottom-left on every scene except the last, which is the standard end card: logo traced big, "Youth Blockchain Association", and joinyba.org written and underlined.
- **Voice.** ElevenLabs "Will" (`bIHbv24MWmeRgasZH58o`, `eleven_multilingual_v2`). No music unless the user signs in to HeyGen and asks for it.

## What it depends on

| Need | What | Where it comes from |
|---|---|---|
| Draw-on technique | `whiteboard-animation` skill | `npx -y skills add iart-ai/explainer-video-skills -g -a claude-code -s '*' -y --copy` |
| Video framework | HyperFrames CLI 0.8.119, skills `hyperframes`, `hyperframes-core`, `hyperframes-cli`, `faceless-explainer` | `npx hyperframes skills update faceless-explainer` |
| Script polish | `unslop` skill | already installed |
| Voice | ElevenLabs API key (free tier: 10k chars/month; budget about 2.7k per episode) | `ELEVENLABS_API_KEY` in the project's `.env` (gitignored), `~/.config/yba-video/.env`, or the shell. The user supplies the key. Never write it into the skill, a composition, a commit, or chat. If it's missing or rejected, ask the user. |
| Media tools | node, ffmpeg/ffprobe, Chrome (HyperFrames downloads one), whisper (via `npx hyperframes transcribe`) | Homebrew / HyperFrames |
| npm libs | roughjs, hersheytext (EMS Tech, OFL), svgpath | installed per project by `new-video.sh` |

Run `bash <skill>/scripts/doctor.sh <project-dir>` first. It checks all of the above, and checks the key and remaining quota without printing the key.

## Skills to load (and when)

This skill wraps four others. Load each one with the Skill tool at the step shown, so their full guidance is in context and not just this summary:

| Step | Load | Why |
|---|---|---|
| 1, script | `unslop` | Strips AI tells from the narration before the user sees it |
| 1, script | `hyperframes`, then `faceless-explainer` | The HyperFrames entry point and the explainer workflow this pipeline follows (BRIEF, SCRIPT, storyboard gates). Skip their intake interview: the approved plan and `BRIEF.md` replace it |
| 5, scenes | `whiteboard-animation` (from github.com/iart-ai/explainer-video-skills) | Draw-on rules the engine implements: single open strokes in draw order, nib on the tip, the hand lifts between strokes, outline before fill, one tip at a time, timing tracks the voice |
| 6–8, build / check / render | `hyperframes-core`, `hyperframes-cli` | Composition contract and CLI flags if something fails lint or render |

If any are missing, `scripts/doctor.sh` prints the install command.

## Workflow

1. **Script first, then stop for approval.** The user vets every script before anything is built. Enter plan mode (EnterPlanMode), do only read-only research, and write the plan file with the full script: each scene's spoken line, a "Draw:" note for what appears on the board, the sources for any real-world facts, and the look/voice defaults. Present it with ExitPlanMode and wait. If the user asks for changes, revise and present again. Only after explicit approval do you create files, call ElevenLabs, or render. Once approved, use the wording exactly as approved. Follow "Writing the script" below.
2. **Scaffold.** Run `bash <skill>/scripts/new-video.sh epNN-short-slug` from inside YBAREPO. It creates `videos/epNN-short-slug/` with the HyperFrames project, `src/` pipeline, logo, `.gitignore` and a `BRIEF.md` stub. Fill in `BRIEF.md`, including the source for every real-world fact.
3. **Script into code.** Put the approved lines in `src/script.mjs` verbatim (`TITLE`, `SCENES`, and `HEARD_AS` for anything spelled out for the voice).
4. **Voice.** Run `node src/tts.mjs --check`, which shows quota and spends nothing, then `node src/tts.mjs`. This writes `assets/voice/sNN.mp3`, per-word timestamps, and `audio_meta.json`. To redo one line: `node src/tts.mjs s04 --force`.
5. **Scenes.** Write `src/scenes.mjs`, one builder per scene id. Read `references/scene-api.md` first, and borrow from `examples/ep01-what-is-a-blockchain/scenes.mjs`, since most figures you need are already there. Key every draw window to the words: `b.draw("label", b.w("block"), b.we("block"))` finishes "BLOCK" as the narrator says it.
6. **Build and check.** Run `node src/build.mjs && npx hyperframes lint && npx hyperframes check`. Build throws on duplicate ids, missing voice, or a draw that runs into the wipe. Fix the cause rather than loosening the check.
7. **Look at it.** Run `npx hyperframes snapshot --at <times> --no-end --describe false -o snapshots/passN`, with a mid-draw time and an end-of-board time per scene (`timeline.json` has each scene's start and duration). Read the contact sheets. Check that nothing appears fully formed, text is readable, nothing collides with the corner logo, and the hand isn't drawing the wrong thing. Use `--zoom x,y,w,h` to confirm the nib sits on the tip.
8. **Render.** Run `npx hyperframes render --skill=faceless-explainer --quality high --fps 30 --output renders/<slug>.mp4` in the background. It takes about 3 minutes for a 2-minute video.
9. **Verify.** Run `node <skill>/scripts/verify.mjs`. It probes the MP4, transcribes it and diffs it word by word against the script, and writes `review/contact-sheet.png` from the real render.
10. **Deliver.** Send the MP4 and the contact sheet (SendUserFile). Say what was checked and what changed from the plan. Remind the user that the free ElevenLabs plan requires crediting ElevenLabs and has no commercial license. Don't commit unless asked.

## Writing the script

- **Audience.** Middle schoolers. One idea per scene, short sentences, everyday analogies (notebooks, classmates, lending $5). Reuse You and Sam so each episode builds on the last.
- **Series position.** Episodes 1 ("What is a blockchain?") and 2 ("What happens in a blockchain transaction?", at `videos/ep02-blockchain-transaction`) are done. Check `references/series-plan.md` for which episode is next, its core question, analogy, real example and limit, and don't re-teach what earlier episodes covered beyond a one-line recap.
- **Episode format.** One core question (asked in the opening line), one visual analogy, one real-world example, one risk or limitation, and one short activity: a "Your turn" scene right before the end card that leaves a question or a quick thing to try on the board.
- **Model first, term second.** Show the idea before naming it ("...that's called a private key"). For smart contracts, always say the code enforces rules but is hard to change after deployment and needs outside systems (oracles) for real-world data.
- **Length.** About 90–120 seconds: 8–12 scenes, about 250–300 words. The last scene is always the end-card line ("Want to learn more? In high school, you can join the Youth Blockchain Association. Find us at join Y B A dot org."), or a close variant that keeps "Youth Blockchain Association" and ends with "... org.".
- **Honesty.** Real-world examples must be real and checkable. Note the source in the plan and in `BRIEF.md`. Give at least one honest limit per episode. Leave company names out of narration unless the user wants them.
- **Write for the voice.** Spell out acronyms and URLs the way they should sound ("join Y B A dot org") and map them in `HEARD_AS`. Write numbers as words when the exact phrasing matters.
- **No AI tells.** Load `unslop` and run the draft through it before showing the user: no em dashes, no "it's not just X, it's Y", no puffery.
- **Plan the drawing too.** Every line needs something to draw. If a line has nothing to draw, cut or merge it.

## Editing an existing episode

- Change wording in `src/script.mjs`, then `node src/tts.mjs <ids> --force`, `node src/build.mjs`, and re-render.
- Change visuals in `src/scenes.mjs`, then build. No new voice is needed.
- Don't hand-edit `compositions/frames/*.html`, `index.html` or `SCRIPT.md`. `build.mjs` regenerates them.

## References

- `references/scene-api.md`: the Board and figure API, layout zones, and timing rules. Read it before writing scenes.
- `references/lessons.md`: bugs already hit and how they were fixed (id collisions, the "1" that reads as "I", trailing silence, lint traps). Skim it before step 6.
- `references/series-plan.md`: the 13-episode curriculum (episodes 1–2 done; layer 2 is episode 10), with each episode's core question, analogy, example and limit, plus the finance infrastructure model for episode 13. Read it before drafting any episode.
- `examples/ep01-what-is-a-blockchain/`: the finished first episode's script and scenes.

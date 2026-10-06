---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "A blockchain is a notebook everyone shares, with pages linked so nobody can secretly change the past"
destination: youtube
aspect: 1920x1080
language: en
audience: middle schoolers
length: 110s
angle: concept
voice: elevenlabs/bIHbv24MWmeRgasZH58o
---

## Intent

Explain what a blockchain is and why it matters, simple enough for a middle schooler.
Whiteboard "scribe" style: a hand draws every idea on the board while the narrator talks.
One running story (you lent Sam $5) carries every concept. Ends by pointing high schoolers
to joinyba.org (Youth Blockchain Association).

## Assets

- ../../public/yba-mark.svg — YBA logo. Small bug in the bottom-left for scenes 1-10, drawn big on the end card.

## Customizations

- Draw-on technique from the `whiteboard-animation` skill (iart-ai/explainer-video-skills): open SVG strokes with pathLength=1, a marker hand riding the stroke tip, one clock per scene driving every stroke and the hand.
- Narration: ElevenLabs "Will" (bIHbv24MWmeRgasZH58o), eleven_multilingual_v2, one clip per scene with word timestamps from the with-timestamps endpoint.
- Black / white / gray only, matching the site's storyboard cards.

## Notes

- Script was approved by the user before the build. Do not reword it.
- No captions. No music bed (HeyGen catalog needs sign-in; ElevenLabs key is free tier).
- ElevenLabs key lives in .env (gitignored). Never write it into a composition.

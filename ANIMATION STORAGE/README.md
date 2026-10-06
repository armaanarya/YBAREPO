# ANIMATION STORAGE

Reusable animations and the original homepage box burst are kept here.

- `hero-mark-3d.tsx`: the original Spline integration, preserved before removing the homepage box burst.
- `original-scene.splinecode`: a local snapshot of the original Spline scene, including its scripted 520-box animation.
- `original-hero-dot-flow.tsx`: the original blue dot effect for reference. The live version in `components/site/hero-dot-flow.tsx` now draws only black dots.
- `box-burst.tsx` and `box-burst.module.css`: the simplified 24-box burst-and-return used beside About's goals and in the hackathon intro. It pauses offscreen and in hidden tabs, and becomes a static diamond with reduced motion.

## Use the smaller box animation

```tsx
import { BoxBurst } from '@/ANIMATION STORAGE/box-burst'

<BoxBurst />
```

## Restore the original homepage burst

In `app/view.tsx`, replace the `HeroMark` import and element with:

```tsx
import { HeroMark3D } from '@/ANIMATION STORAGE/hero-mark-3d'

<HeroMark3D />
```

Keep `HeroDotFlow` mounted to retain the current black dots. The archived integration still loads the URL in `lib/spline.ts`. To use the preserved scene independently of Spline hosting, copy `original-scene.splinecode` into `public/animations/` and change `SPLINE_HERO_SCENE` to `/animations/original-scene.splinecode`.

The active homepage renders `components/site/glass-logo.tsx` using `/animations/glass-logo.splinecode`. This local scene is derived from `original-scene.splinecode`, with the embedded motion script, Nodes mesh, and introStarted variable removed. Its camera is reframed for the logo-sized canvas. The original bars and lights remain; the archived black material is retuned to frosted glass with transmission, brighter edge reflections, and a smoother finish. It uses WebGL with mesh shadows disabled to avoid the runtime's shadow shader errors. It renders on demand and stays assembled, including with reduced motion. The SVG remains as a fallback when the scene fails or data saving is enabled.

`HeroMark` still announces a dot wave on page load and on every click. The original exploding scene above remains archived independently.

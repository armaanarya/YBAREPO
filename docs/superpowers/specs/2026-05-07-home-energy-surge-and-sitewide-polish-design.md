# Home "Energy Surge" + Sitewide Scroll Polish — Design

**Date:** 2026-05-07
**Status:** Approved by user, ready for implementation plan
**Approach:** C — dramatic home page surge + sitewide parallax/TextStagger polish

## Problem

The YBA landing page feels static below the hero. The user wants:
- More elements that move on scroll, with horizontal/lateral motion
- A scroll-driven gradient that intensifies up to ~5x then fades to black past the hero
- A consistent polish pass across every page (D answer: equal treatment everywhere)
- A small fix: the top-left navbar logo is invisible on the black background because its SVG paths are `fill="#000000"`

## Goals

1. Add scroll-tied lateral and parallax motion to the home page so the experience feels emotional and alive
2. Replace the static hero gradient with a scroll-driven surge → fade-to-black effect
3. Apply a consistent parallax + TextStagger polish to every inner page (About, Goals, Curriculum, Podcast, Contact)
4. Fix the navbar logo visibility against the dark theme

## Non-Goals

- Replacing the SPA state-routing with real Next.js routes
- Touching the registration form, Supabase backend, or analytics tracking
- Adding new pages or content
- Restructuring inner-page content — only adding motion polish around existing content

## Approach

Three new generic motion primitives carry the heavy lifting; everything else is composition. All primitives use `framer-motion`'s `useScroll` + `useTransform`, which co-exists fine with our existing Lenis smooth scroll. They are gated to respect `prefers-reduced-motion` (each falls back to a static, no-motion render).

### New components

#### `components/ui/gradient-surge.tsx`
Replaces the current `BgGradient` in the Hero. A scroll-driven white-bloom radial gradient.

- Mounts a `motion.div` covering the hero region
- Uses `useScroll` (target: window) and `useTransform`:
  - `scale`: scrollY 0 → 80vh maps to scale 1 → 2.5
  - `opacity`: scrollY 80vh → 120vh maps to opacity 1 → 0
- After 120vh of scroll, the surge is fully transparent and the body's `var(--bg)` (#09090f) shows through
- Inherits the existing white-bloom color stops (already de-purpled)
- API: `<GradientSurge />` — no props in the v1; positioning handled internally with `position: fixed; inset: 0; pointer-events: none; z-index: 0`

#### `components/ui/horizontal-pinned.tsx`
Generic pinned-horizontal scroll section.

- Outer section: `position: relative; height: {heightVh}vh` — controls how much vertical scroll buys horizontal travel
- Inner sticky wrapper: `position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center`
- Children wrapper: `motion.div` with `style={{x}}` where `x = useTransform(scrollYProgress, [0, 1], ['0%', '-{travelPercent}%'])`
- API: `<HorizontalPinned heightVh={300} travelPercent={75}>{children}</HorizontalPinned>`
  - `heightVh` defaults to 300 (3 viewport heights)
  - `travelPercent` defaults to 75 (children translate -75% of their width)
- Reduced-motion fallback: render children in a normal flex row, no sticky/scroll-tied motion

#### `components/ui/parallax-layer.tsx`
Lightweight wrapper that translates its children on `y` based on scroll position × speed.

- Uses `useScroll({target: ref})` with `offset: ['start end', 'end start']` so motion is scoped to when the element is in view
- `y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`])` — positive speed = drifts up as you scroll past, negative = drifts down
- API: `<ParallaxLayer speed={0.3} className="...">{children}</ParallaxLayer>`
- Reduced-motion fallback: render a plain `<div>` with no motion

### Edits to existing components

#### `components/ui/resizable-navbar.tsx` — logo visibility fix
Both desktop and mobile logo image tags currently render the black-fill SVG against the dark nav. Wrap each `<Image src="/yba-mark.svg" ...>` in a span with:

```tsx
<span style={{
  filter: 'invert(1) brightness(2) drop-shadow(0 0 6px rgba(0,0,0,0.4))',
  display: 'inline-flex',
}}>
  <Image src="/yba-mark.svg" alt="YBA" width={30} height={30} priority />
</span>
```

`invert(1)` flips black → white. `brightness(2)` ensures it stays bright at any scroll-blur intensity. The drop-shadow gives a faint dark halo so the white logo doesn't bleed visually when the nav background goes semi-transparent.

#### `components/ui/hero-animated.tsx`
- Keep `BgGradient` exported for backward compatibility (currently consumed only by Hero, but cheap to leave)
- No changes required to `HeroSpotlight` or `Hero` itself; the swap happens in `app/page.tsx`

### Edits to `app/page.tsx`

#### Home page restructure (`HomePage` function)
1. **Hero block:** swap `<BgGradient />` for `<GradientSurge />`. Wrap `<HeroSpotlight />` in `<ParallaxLayer speed={-0.3}>` so the cursor light drifts opposite to scroll direction.
2. **Pillars section:** the existing 4 `BlurFade > TiltCard > GlowCard` cards move out of the vertical 2x2 grid into a `<HorizontalPinned heightVh={300} travelPercent={70}>` reel. The "Three Pillars of YBA" heading stays above the pinned region as a regular section heading.
3. **Marquee chips:** wrap the existing `<Marquee>` in `<ParallaxLayer speed={0.15}>` so the chip text drifts faster than page scroll, intensifying the lateral feel.
4. **Bridge CTA:** keep the existing `<TextStagger>` on the h2. Wrap the GridPattern background in `<ParallaxLayer speed={-0.4}>` so the grid drifts opposite scroll direction.

#### Inner pages polish pass
For `AboutPage`, `GoalsPage`, `CurriculumPage`, `PodcastPage`, `ContactPage`:

- Every section `<h1>` and `<h2>` gets `<TextStagger>` if it doesn't already have one
- Decorative grid backgrounds (where present) get `<ParallaxLayer speed={-0.15}>`
- Visual content blocks (`Image` elements, large card stacks, `YBACalendar`) get `<ParallaxLayer speed={0.2}>`
- Podcast episode cards: staggered `BlurFade delay={i * 0.08}` cascade
- Contact cards: alternate left/right entrance — even-index cards `BlurFade direction='left'`, odd-index `direction='right'` (extends BlurFade with a `direction` prop)
- Goals goals-list rows: `BlurFade delay={i * 0.05}` per row

#### `BlurFade` extension
Add an optional `direction?: 'up' | 'left' | 'right' | 'down'` prop (defaults to `'up'`). When set, replaces the y-offset with the appropriate axis offset. Default behavior unchanged.

## Implementation Order (chunked)

The work is broken into three independently-shippable chunks. Each chunk produces a working build and a visible win:

### Chunk 1: Foundation (low risk, immediate visual win)
- Build `ParallaxLayer`, `GradientSurge` primitives
- Wire `GradientSurge` into Hero (replaces `BgGradient`)
- Wrap `HeroSpotlight` and Bridge CTA grid in `ParallaxLayer`
- Wrap Marquee in `ParallaxLayer`
- Apply navbar logo `invert(1)` filter

### Chunk 2: Horizontal Pinned Pillars (highest impact, highest risk)
- Build `HorizontalPinned` primitive
- Move Pillars cards from vertical grid into pinned horizontal reel
- Test on small laptop screens (1366x768) — verify pinning + scroll math
- Verify Lenis smooth scroll plays nicely with the pin (no scroll jacking conflicts)

### Chunk 3: Inner-pages Polish Pass
- Add `direction` prop to `BlurFade`
- Sweep `TextStagger` across all inner-page headings
- Add `ParallaxLayer` to inner-page visuals and grid backgrounds
- Stagger podcast episode reveal
- Alternate contact card entrance

## Testing

- Manual visual smoke test in dev server at each chunk boundary
- Verify `prefers-reduced-motion` users get static fallback (test in OS settings or DevTools rendering pane)
- Test on small viewport (1366x768) for horizontal pinned section — must complete its travel within the heightVh budget without going off-screen at the top
- Verify mobile (<768px): horizontal pinned section can either pin or fall back to native horizontal scroll. Decision: on mobile, render children as a horizontally-scrollable native flex (`overflow-x: auto; scroll-snap-type: x mandatory`) — no pinning. This matches mobile expectations.
- Verify the navbar logo renders white on initial load AND when nav goes semi-transparent on scroll

## Open Questions

None — all interaction details are specified above.

## Risks

1. **Lenis + sticky pinning interaction:** Lenis can sometimes desync with `position: sticky`. Mitigation: test in Chunk 2 first; if broken, add `data-lenis-prevent` to the pinned section and let it use native scroll within. Acceptable degradation.
2. **Performance:** five concurrent `useScroll` listeners + Lenis + custom cursor on a low-end machine. Mitigation: all `useTransform` calls are GPU-friendly (transform/opacity only, no layout-affecting properties). Should be fine.
3. **Logo invert filter on hover/focus rings:** `invert()` flips the focus ring too. Mitigation: apply the filter only to the inner Image, leaving the focus-visible ring on the outer button untouched.

## Files Touched

```
NEW:  components/ui/gradient-surge.tsx
NEW:  components/ui/horizontal-pinned.tsx
NEW:  components/ui/parallax-layer.tsx
EDIT: components/ui/blur-fade.tsx           (add direction prop)
EDIT: components/ui/resizable-navbar.tsx    (logo invert filter)
EDIT: app/page.tsx                          (Home restructure + inner-page pass)
```

No backend, env, or build-config changes.

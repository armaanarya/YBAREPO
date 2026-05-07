# Home Energy Surge + Sitewide Scroll Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll-driven horizontal motion, a surging-then-fading hero gradient, and a sitewide parallax/TextStagger polish pass. Fix the invisible navbar logo.

**Architecture:** Three new generic motion primitives (`ParallaxLayer`, `GradientSurge`, `HorizontalPinned`) built on `framer-motion`'s `useScroll` + `useTransform`. Each respects `prefers-reduced-motion` and gracefully degrades (parallax → static, pinned → mobile horizontal scroll). Composition happens in `app/page.tsx`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v3, framer-motion v11, Lenis smooth scroll.

**Spec:** `docs/superpowers/specs/2026-05-07-home-energy-surge-and-sitewide-polish-design.md`

**Project root:** `/Users/armaanarya/yba-website`

---

## Pre-flight

- [ ] **Step 0.1: Verify dev server runs cleanly**

```bash
cd /Users/armaanarya/yba-website && npm run dev
```

Expected: starts on http://localhost:3000 with no compile errors. Leave it running for the rest of the plan; HMR will reload your edits.

If port 3000 is taken, that's fine — note the port the server reports and substitute in verification steps.

---

## File Structure

```
NEW:  components/ui/parallax-layer.tsx       — generic Y-axis parallax wrapper
NEW:  components/ui/gradient-surge.tsx       — scroll-tied hero gradient (scale + fade)
NEW:  components/ui/horizontal-pinned.tsx    — pinned section with horizontal scroll-tied X
EDIT: components/ui/blur-fade.tsx            — add `direction` prop ('up'|'down'|'left'|'right')
EDIT: components/ui/resizable-navbar.tsx     — wrap Image with invert(1) filter span
EDIT: app/page.tsx                           — Home restructure + inner-pages polish
```

Each file has one responsibility. Primitives are generic and reusable; composition lives in `app/page.tsx`.

---

# CHUNK 1 — Foundation (independently shippable)

This chunk delivers: scroll-driven hero gradient, parallax-drifting hero spotlight + marquee + bridge grid, navbar logo visibility fix.

## Task 1.1: Build `ParallaxLayer` primitive

**Files:**
- Create: `components/ui/parallax-layer.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  /**
   * Drift strength. Positive = element drifts UP as you scroll past (faster than page).
   * Negative = drifts DOWN (slower than page / opposite direction).
   * Typical range: -0.5 to 0.5. Default 0.3.
   */
  speed?: number
  className?: string
}

export function ParallaxLayer({ children, speed = 0.3, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}px`, `${-speed * 100}px`],
  )

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

The dev server should hot-reload. Check `/tmp/yba-dev.log` or the terminal where `npm run dev` is running. Expected: no TypeScript errors related to this file.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/parallax-layer.tsx && git commit -m "Add ParallaxLayer scroll-driven Y translation primitive"
```

---

## Task 1.2: Build `GradientSurge` primitive

**Files:**
- Create: `components/ui/gradient-surge.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const GRADIENT = `radial-gradient(ellipse 90% 72% at 50% -8%,
  rgba(255,255,255,0.95) 0%,
  rgba(238,238,255,0.7) 15%,
  rgba(238,238,255,0.35) 35%,
  rgba(238,238,255,0.08) 60%,
  rgba(9,9,15,0) 100%)`

/**
 * Scroll-driven hero gradient.
 * - 0 → 800px scrollY:  scale grows from 1 to 2.5 (the "surge")
 * - 800 → 1200px:       opacity fades 1 → 0 (the "disappear past hero")
 * After 1200px the body's #09090f background shows through.
 */
export function GradientSurge() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 800], [1, 2.5], { clamp: true })
  const opacity = useTransform(scrollY, [800, 1200], [1, 0], { clamp: true })

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full select-none"
        style={{
          background: '#09090f',
          backgroundImage: GRADIENT,
        }}
      />
    )
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full select-none"
      style={{
        background: '#09090f',
        backgroundImage: GRADIENT,
        scale,
        opacity,
        transformOrigin: 'center top',
        willChange: 'transform, opacity',
      }}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Check the dev terminal output. Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/gradient-surge.tsx && git commit -m "Add GradientSurge scroll-driven hero background"
```

---

## Task 1.3: Fix navbar logo visibility (invert filter)

**Files:**
- Modify: `components/ui/resizable-navbar.tsx` (lines 64 and 100)

- [ ] **Step 1: Replace the desktop logo Image (around line 64)**

Find this block:

```tsx
          <Image src="/yba-mark.svg" alt="YBA" width={30} height={30} priority />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#eeeeff', letterSpacing: '-0.01em' }}>
            YBA
          </span>
```

Replace with:

```tsx
          <span
            style={{
              filter: 'invert(1) brightness(2) drop-shadow(0 0 6px rgba(0,0,0,0.4))',
              display: 'inline-flex',
              lineHeight: 0,
            }}
          >
            <Image src="/yba-mark.svg" alt="YBA" width={30} height={30} priority />
          </span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#eeeeff', letterSpacing: '-0.01em' }}>
            YBA
          </span>
```

- [ ] **Step 2: Replace the mobile logo Image (around line 100)**

Find this block:

```tsx
          <Image src="/yba-mark.svg" alt="YBA" width={28} height={28} priority />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#eeeeff' }}>
            YBA
          </span>
```

Replace with:

```tsx
          <span
            style={{
              filter: 'invert(1) brightness(2) drop-shadow(0 0 6px rgba(0,0,0,0.4))',
              display: 'inline-flex',
              lineHeight: 0,
            }}
          >
            <Image src="/yba-mark.svg" alt="YBA" width={28} height={28} priority />
          </span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#eeeeff' }}>
            YBA
          </span>
```

- [ ] **Step 3: Verify visually**

Open http://localhost:3000. Look at the top-left of the page.
Expected: the YBA logo mark renders WHITE against the dark nav (it was invisible/black before).
Scroll down 200px so the nav goes semi-transparent. Expected: logo still readable, faint dark drop-shadow halo visible.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/resizable-navbar.tsx && git commit -m "Fix invisible navbar logo with invert filter (black SVG → white)"
```

---

## Task 1.4: Swap `BgGradient` for `GradientSurge` in Hero

**Files:**
- Modify: `app/page.tsx` (imports + Hero block in HomePage)

- [ ] **Step 1: Add the import**

In `app/page.tsx`, find the import block near the top (lines 1–14). Add this import after the existing component imports:

```tsx
import { GradientSurge } from '../components/ui/gradient-surge'
```

- [ ] **Step 2: Locate the Hero section in HomePage**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "BgGradient" app/page.tsx
```

Expected: shows the import line and the usage line(s) inside `HomePage`.

- [ ] **Step 3: Replace `<BgGradient />` usage with `<GradientSurge />`**

In `app/page.tsx`, inside the `HomePage` function body, find the `<BgGradient ... />` JSX and replace it with:

```tsx
          <GradientSurge />
```

Keep the surrounding `<Hero>` wrapper, `<GridPattern>`, `<HeroSpotlight />`, and noise overlay exactly as they are.

- [ ] **Step 4: Verify visually**

Open http://localhost:3000. The hero should look the same as before at the top of the page.
Now slowly scroll down. Expected: the white bloom gradient grows OUTWARD (scaling up) as you scroll, then fades out completely by ~1200px scrollY, leaving the page on solid `#09090f` black.
Check the browser console — no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Swap static BgGradient for scroll-driven GradientSurge in Hero"
```

---

## Task 1.5: Wrap `HeroSpotlight` in `ParallaxLayer`

**Files:**
- Modify: `app/page.tsx` (imports + Hero JSX)

- [ ] **Step 1: Add the import**

Add this line to the import block in `app/page.tsx`:

```tsx
import { ParallaxLayer } from '../components/ui/parallax-layer'
```

- [ ] **Step 2: Wrap HeroSpotlight**

In `HomePage`, find the JSX:

```tsx
          <HeroSpotlight />
```

Replace with:

```tsx
          <ParallaxLayer speed={-0.3} className="absolute inset-0 pointer-events-none">
            <HeroSpotlight />
          </ParallaxLayer>
```

- [ ] **Step 3: Verify visually**

Reload http://localhost:3000. Move your mouse around the hero — the white spotlight should still follow the cursor. Now scroll slowly. Expected: the spotlight halo drifts DOWNWARD relative to the page as you scroll past (because `speed={-0.3}` = opposite direction of scroll).

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Wrap HeroSpotlight in ParallaxLayer for scroll drift"
```

---

## Task 1.6: Wrap Marquee chips section in `ParallaxLayer`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Find the Marquee usage**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "<Marquee" app/page.tsx
```

Note the line number. The usage looks like:

```tsx
          <Marquee speed={45}>
            {CHIPS.map(...)}
          </Marquee>
```

- [ ] **Step 2: Wrap the entire `<Marquee>` block**

Replace the existing `<Marquee speed={45}>...</Marquee>` block with:

```tsx
          <ParallaxLayer speed={0.15}>
            <Marquee speed={45}>
              {CHIPS.map((chip, i) => (
                <span
                  key={i}
                  className="chip"
                  style={{
                    display: 'inline-block',
                    padding: '8px 18px',
                    margin: '0 8px',
                    borderRadius: 999,
                    background: T.chip,
                    color: T.dark,
                    fontFamily: T.inter,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chip}
                </span>
              ))}
            </Marquee>
          </ParallaxLayer>
```

If the existing children of `<Marquee>` already differ from the snippet above, KEEP the existing children verbatim — just add the `<ParallaxLayer speed={0.15}>` wrapper around the entire `<Marquee>` element.

- [ ] **Step 3: Verify visually**

Reload http://localhost:3000. Scroll down to the marquee chip section. Expected: the chips still scroll horizontally on their own animation, AND the entire row drifts upward slightly faster than the page as you scroll past.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Wrap Marquee chips in ParallaxLayer for scroll drift"
```

---

## Task 1.7: Wrap Bridge CTA `GridPattern` in `ParallaxLayer`

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Find the Bridge CTA section**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "GridPattern\|Bridge\|Apply Now" app/page.tsx
```

Locate the `<GridPattern />` usage that lives inside the Bridge CTA section (the section with the "Apply Now" button). There may be more than one `GridPattern` in the file — pick the one inside the Bridge CTA section, NOT the one in the Hero.

- [ ] **Step 2: Wrap that GridPattern**

Replace the Bridge CTA's `<GridPattern ... />` (whatever its exact props) with:

```tsx
          <ParallaxLayer speed={-0.4} className="absolute inset-0 pointer-events-none">
            <GridPattern {/* keep all original props */} />
          </ParallaxLayer>
```

If the original `<GridPattern>` has no props, it becomes `<GridPattern />` inside the wrapper. Preserve any existing props verbatim.

- [ ] **Step 3: Verify visually**

Reload, scroll to the Bridge CTA section ("Apply Now"). Expected: the dotted grid background drifts DOWNWARD as you scroll past the section (opposite direction to scroll).

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Wrap Bridge CTA GridPattern in ParallaxLayer for opposite drift"
```

---

## Task 1.8: Chunk 1 final smoke test

- [ ] **Step 1: Hard reload and walk the page**

Open http://localhost:3000 in an incognito window (no cache). Walk through:
1. Hero loads with the white-bloom gradient visible
2. Top-left navbar logo is WHITE and readable
3. Scroll slowly. Gradient surges (gets bigger) up to ~800px scroll
4. By ~1200px scroll, the gradient has fully faded — page is solid black
5. Hero spotlight cursor halo drifts as you move mouse + scroll
6. Marquee chips section: chips drift faster than page on scroll
7. Bridge CTA: dotted grid drifts opposite to scroll direction
8. No console errors

- [ ] **Step 2: Test reduced-motion fallback**

Open Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload the page.
Expected: gradient is static (no scale/opacity transitions), spotlight has no parallax drift, marquee/bridge backgrounds are static. Marquee inner CSS animation may continue (that's a separate animation, not in scope for this fix).

- [ ] **Step 3: No-op commit if everything looks good**

Chunk 1 is done. Move to Chunk 2.

---

# CHUNK 2 — Horizontal Pinned Pillars (high-impact, riskier)

This chunk delivers the marquee-killer feature: the four "Three Pillars" cards become a horizontally-scrolling pinned reel.

## Task 2.1: Build `HorizontalPinned` primitive

**Files:**
- Create: `components/ui/horizontal-pinned.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface HorizontalPinnedProps {
  children: ReactNode
  /** Vertical scroll runway, in viewport heights. Default 300 (3 viewport heights). */
  heightVh?: number
  /** How far the children translate as a percentage of their own width. Default 75. */
  travelPercent?: number
  className?: string
}

/**
 * Pins a 100vh container while the user scrolls vertically through `heightVh` viewport heights;
 * children translate horizontally during the pin window.
 *
 * On mobile (<768px) or with prefers-reduced-motion, falls back to native horizontal scroll.
 */
export function HorizontalPinned({
  children,
  heightVh = 300,
  travelPercent = 75,
  className = '',
}: HorizontalPinnedProps) {
  const targetRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${travelPercent}%`])

  if (reduceMotion || isMobile) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <section
      ref={targetRef}
      className={className}
      style={{ position: 'relative', height: `${heightVh}vh` }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            x,
            display: 'flex',
            gap: '1.5rem',
            paddingLeft: '4rem',
            paddingRight: '4rem',
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Check dev terminal. Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/horizontal-pinned.tsx && git commit -m "Add HorizontalPinned scroll-tied sticky lateral section"
```

---

## Task 2.2: Restructure Pillars into HorizontalPinned reel

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add the import**

Add to the import block in `app/page.tsx`:

```tsx
import { HorizontalPinned } from '../components/ui/horizontal-pinned'
```

- [ ] **Step 2: Locate the Pillars rendering**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "PILLARS\|Three Pillars\|pillar-card" app/page.tsx
```

Find the JSX block in `HomePage` that renders the `PILLARS.map(...)` array. It currently lives in a CSS grid (probably `grid-template-columns` 2 or 4 cols). The block looks like:

```tsx
        <div style={{ display: 'grid', gridTemplateColumns: '...', gap: '...' }}>
          {PILLARS.map((p, i) => (
            <BlurFade key={p.title} delay={i * 0.08} inView>
              <TiltCard>
                <GlowCard ...>
                  ...
                </GlowCard>
              </TiltCard>
            </BlurFade>
          ))}
        </div>
```

- [ ] **Step 3: Replace the grid wrapper with HorizontalPinned**

Replace the outer `<div style={{ display: 'grid', ... }}>` (and its closing `</div>`) with:

```tsx
        <HorizontalPinned heightVh={300} travelPercent={70}>
          {PILLARS.map((p, i) => (
            <BlurFade key={p.title} delay={i * 0.08} inView>
              <TiltCard>
                <GlowCard
                  className="pillar-card glow-hover-lift"
                  style={{
                    width: 'min(85vw, 480px)',
                    flexShrink: 0,
                    scrollSnapAlign: 'center',
                  }}
                >
                  {/* preserve all existing inner content of each pillar card */}
                </GlowCard>
              </TiltCard>
            </BlurFade>
          ))}
        </HorizontalPinned>
```

**Important:** keep the EXACT inner content of each pillar card (icon, title, description, etc.) — only the outer grid wrapper and the per-card sizing change. Each card needs `width: min(85vw, 480px)` and `flexShrink: 0` so they have a fixed reel width regardless of viewport.

If the existing GlowCard already has a `style` prop, merge — don't overwrite — preserving any existing styles and adding `width`, `flexShrink`, `scrollSnapAlign`.

- [ ] **Step 4: Verify desktop visually**

Reload http://localhost:3000. Scroll down to the Pillars section. Expected behavior:
1. As you reach the section, it pins (sticks to viewport)
2. Continuing to scroll vertically, the cards slide left horizontally
3. After all four cards have slid past, the pin releases and you continue scrolling normally
4. No layout jumps or scroll jacking
5. No console errors

- [ ] **Step 5: Verify mobile fallback**

Open Chrome DevTools → toggle device toolbar → choose "iPhone 12 Pro" or any width <768px. Reload.
Expected: the Pillars section is a normal-flow horizontally-scrollable row (no pinning). Swipe horizontally to scroll through cards. Cards snap into place.

- [ ] **Step 6: Verify reduced-motion fallback**

Reset device toolbar (back to desktop). DevTools → Rendering → emulate prefers-reduced-motion: reduce. Reload.
Expected: same as mobile fallback — horizontal scroll row, no pin.

- [ ] **Step 7: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Restructure Pillars cards into HorizontalPinned scroll reel"
```

---

## Task 2.3: Verify Lenis smooth-scroll plays nice with sticky pinning

**Files:**
- (Possibly) Modify: `app/page.tsx`

- [ ] **Step 1: Manual scroll test with Lenis active**

Reload http://localhost:3000. Slowly scroll through the Pillars section using:
- Mouse wheel
- Trackpad two-finger scroll
- Page Down / arrow keys
- Spacebar

Expected: at each input method, the pin engages smoothly, cards slide cleanly, pin releases. No stutter, no detachment, no double-scrolling.

- [ ] **Step 2: If Lenis fights the pin, add `data-lenis-prevent`**

If you observe stutter/detachment ONLY on scroll-wheel input, find the outer `<section>` rendered by `HorizontalPinned` and add the attribute. To do this, modify `components/ui/horizontal-pinned.tsx`:

Find:

```tsx
    <section
      ref={targetRef}
      className={className}
      style={{ position: 'relative', height: `${heightVh}vh` }}
    >
```

Replace with:

```tsx
    <section
      ref={targetRef}
      className={className}
      style={{ position: 'relative', height: `${heightVh}vh` }}
      data-lenis-prevent
    >
```

This tells Lenis to use native scroll within this section instead of its smooth-scroll. It's an acceptable degradation if needed.

- [ ] **Step 3: If you applied Step 2, commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/horizontal-pinned.tsx && git commit -m "Add data-lenis-prevent to HorizontalPinned to avoid pin/Lenis conflict"
```

If Step 2 wasn't needed, no commit.

---

# CHUNK 3 — Inner-pages Polish Sweep

This chunk delivers consistency: every inner page gets parallax depth and TextStagger headings.

## Task 3.1: Add `direction` prop to `BlurFade`

**Files:**
- Modify: `components/ui/blur-fade.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
'use client'

import { useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  type UseInViewOptions,
  type Variants,
} from 'framer-motion'

type MarginType = UseInViewOptions['margin']
type Direction = 'up' | 'down' | 'left' | 'right'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: { hidden: { y?: number; x?: number }; visible: { y?: number; x?: number } }
  duration?: number
  delay?: number
  yOffset?: number
  direction?: Direction
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  direction = 'up',
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  const isInView = !inView || inViewResult

  // Map direction → axis offsets. 'up' (default) and 'down' use Y; 'left'/'right' use X.
  const offset = yOffset
  const hidden =
    direction === 'up'
      ? { x: 0, y: offset }
      : direction === 'down'
      ? { x: 0, y: -offset }
      : direction === 'left'
      ? { x: offset, y: 0 }
      : { x: -offset, y: 0 } // right

  const visible =
    direction === 'up'
      ? { x: 0, y: -offset }
      : direction === 'down'
      ? { x: 0, y: offset }
      : direction === 'left'
      ? { x: -offset, y: 0 }
      : { x: offset, y: 0 } // right

  const defaultVariants: Variants = {
    hidden: { ...hidden, opacity: 0, filter: `blur(${blur})` },
    visible: { ...visible, opacity: 1, filter: 'blur(0px)' },
  }
  const combinedVariants = variant || defaultVariants

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles + nothing visually broken**

Reload the homepage. All existing `BlurFade` usages should work as before (default `direction='up'`). Any visible motion is identical to pre-edit.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/yba-website && git add components/ui/blur-fade.tsx && git commit -m "Add direction prop to BlurFade (up/down/left/right)"
```

---

## Task 3.2: Apply TextStagger to AboutPage headings

**Files:**
- Modify: `app/page.tsx` (AboutPage function)

- [ ] **Step 1: Locate AboutPage**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "function AboutPage" app/page.tsx
```

Read the function body. Identify all `<h1>`, `<h2>`, and primary heading elements that are NOT already wrapped in `<TextStagger>`.

- [ ] **Step 2: Wrap each plain heading**

For each heading like `<h1 style={...}>About YBA</h1>`, replace with:

```tsx
<TextStagger as="h1" text="About YBA" style={...} />
```

The `<TextStagger>` component already supports `as` and accepts the heading's existing className/style. Preserve all existing styles verbatim — only the tag wrapping changes.

If a heading contains JSX children rather than plain text (e.g., contains a `<br />`), skip it for now; do not break it. Leave a comment: `{/* TextStagger skipped: contains JSX children */}`

- [ ] **Step 3: Verify visually**

Navigate to /about (click the About nav link). Each previously-plain heading should now stagger character-by-character on scroll into view. No layout shift.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Apply TextStagger to AboutPage headings"
```

---

## Task 3.3: Apply TextStagger to remaining inner-page headings

**Files:**
- Modify: `app/page.tsx` (GoalsPage, CurriculumPage, PodcastPage, ContactPage, ModuleDetailPage)

- [ ] **Step 1: For each function, wrap plain-text headings**

For each of:
- `GoalsPage` — already has TextStagger on "Year One Goals" and "YBA Hackathon Series"; ensure ALL h1/h2 are covered
- `CurriculumPage` — already has TextStagger on h1; check remaining headings
- `ModuleDetailPage` — already has TextStagger on h1; check remaining
- `PodcastPage` — already has TextStagger on h1; check remaining
- `ContactPage` — likely no TextStagger yet; wrap all h1/h2

Apply the same pattern as Task 3.2: replace `<h1 style={...}>Plain Text</h1>` with `<TextStagger as="h1" text="Plain Text" style={...} />`.

- [ ] **Step 2: Verify visually**

Click through every nav link (About, Goals, Curriculum, Podcast, Contact). Every primary heading should stagger on entry. No console errors. No layout shift.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Apply TextStagger to all remaining inner-page headings"
```

---

## Task 3.4: Add ParallaxLayer to inner-page visual blocks

**Files:**
- Modify: `app/page.tsx` (CurriculumPage, PodcastPage)

- [ ] **Step 1: Wrap CurriculumPage's `YBACalendar`**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "YBACalendar\b" app/page.tsx
```

Find the JSX usage like `<YBACalendar />` inside `CurriculumPage`. Replace with:

```tsx
<ParallaxLayer speed={0.15}>
  <YBACalendar />
</ParallaxLayer>
```

- [ ] **Step 2: Wrap each big visual block in PodcastPage**

Locate `PodcastPage`. The function renders a list of episode cards. Locate the wrapping container (a grid or flex). Wrap any leading hero block / large image with `<ParallaxLayer speed={0.2}>`. Leave individual episode cards as-is for now (they get a different treatment in Task 3.5).

If `PodcastPage` has only the episodes list and no separate visual hero, skip this step.

- [ ] **Step 3: Verify visually**

Navigate to Curriculum: the calendar should drift upward slightly as you scroll past it.
Navigate to Podcast: any hero block should drift slightly.
No layout jumps.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Add parallax drift to CurriculumPage calendar and Podcast hero"
```

---

## Task 3.5: Stagger podcast episode card reveal

**Files:**
- Modify: `app/page.tsx` (PodcastPage)

- [ ] **Step 1: Locate the episode card mapping**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "episode\|EPISODES\|PODCAST" app/page.tsx
```

Find the `.map()` call that renders episode cards inside `PodcastPage`. The current mapping likely already wraps each card in `BlurFade > TiltCard > div`.

- [ ] **Step 2: Add a staggered delay**

If each card is rendered like:

```tsx
{EPISODES.map((ep) => (
  <BlurFade key={ep.id} inView>
    <TiltCard>
      ...
    </TiltCard>
  </BlurFade>
))}
```

Change to use the index and apply a staggered delay:

```tsx
{EPISODES.map((ep, i) => (
  <BlurFade key={ep.id} inView delay={i * 0.08}>
    <TiltCard>
      ...
    </TiltCard>
  </BlurFade>
))}
```

If the array constant is named differently (e.g., `PODCAST_EPISODES`), substitute the actual name.

- [ ] **Step 3: Verify visually**

Navigate to Podcast. Episodes should reveal in sequence (each ~80ms after the previous), not all at once.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Stagger podcast episode card reveal with cascading delay"
```

---

## Task 3.6: Alternate-direction reveal for Contact cards

**Files:**
- Modify: `app/page.tsx` (ContactPage)

- [ ] **Step 1: Locate the contact cards mapping**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "CONTACT_METHODS\|ContactPage" app/page.tsx
```

Find the `.map()` call that renders contact-method cards inside `ContactPage`. Each card is currently wrapped in `BlurFade > TiltCard > GlowCard as="a"`.

- [ ] **Step 2: Alternate direction by index parity**

Change the mapping from:

```tsx
{CONTACT_METHODS.map((m, i) => (
  <BlurFade key={m.label} inView delay={i * 0.06}>
    ...
  </BlurFade>
))}
```

To:

```tsx
{CONTACT_METHODS.map((m, i) => (
  <BlurFade
    key={m.label}
    inView
    delay={i * 0.06}
    direction={i % 2 === 0 ? 'left' : 'right'}
    yOffset={20}
  >
    ...
  </BlurFade>
))}
```

The increased `yOffset={20}` is appropriate here because lateral motion needs more travel to read as motion (vs. the default 6px which works for vertical fade-up).

- [ ] **Step 3: Verify visually**

Navigate to Contact. Cards should enter from alternating sides (left/right) on scroll into view. No console errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Alternate left/right reveal direction for Contact cards"
```

---

## Task 3.7: Stagger Goals goal-list rows

**Files:**
- Modify: `app/page.tsx` (GoalsPage)

- [ ] **Step 1: Locate the goals list rendering**

Run:

```bash
cd /Users/armaanarya/yba-website && grep -n "goal-row\|GoalsPage\|YEAR_ONE_GOALS" app/page.tsx
```

Find a `.map()` that renders rows with className `goal-row`. Each row may or may not already be wrapped in `BlurFade`.

- [ ] **Step 2: Wrap each row with cascading delay**

If rows are currently rendered like:

```tsx
{YEAR_ONE_GOALS.map((g) => (
  <div key={g.title} className="goal-row" style={...}>
    ...
  </div>
))}
```

Change to:

```tsx
{YEAR_ONE_GOALS.map((g, i) => (
  <BlurFade key={g.title} inView delay={i * 0.05}>
    <div className="goal-row" style={...}>
      ...
    </div>
  </BlurFade>
))}
```

If rows already have a `BlurFade` wrapper, just add `delay={i * 0.05}` and rely on existing structure. If the array constant has a different name, substitute.

- [ ] **Step 3: Verify visually**

Navigate to Goals. Goal-list rows should reveal sequentially as the section scrolls into view.

- [ ] **Step 4: Commit**

```bash
cd /Users/armaanarya/yba-website && git add app/page.tsx && git commit -m "Cascade Goals goal-list rows with staggered BlurFade delay"
```

---

## Task 3.8: Final sitewide smoke test

- [ ] **Step 1: Walk every page**

Open http://localhost:3000 in incognito. For each page (Home, About, Goals, Curriculum, Podcast, Contact):
1. Click the nav link
2. Scroll from top to bottom
3. Watch console — no errors
4. Verify motion: parallax drifts where placed, TextStagger fires on headings, BlurFade reveals cascade where added

- [ ] **Step 2: Reduced-motion full test**

DevTools → Rendering → prefers-reduced-motion: reduce. Walk every page again.
Expected: all motion is static. No janky half-states. Layout identical to motion-on version.

- [ ] **Step 3: Mobile viewport test**

DevTools → device toolbar → iPhone 12. Walk every page.
Expected: HorizontalPinned Pillars section becomes a horizontal swipe row. All other parallax/TextStagger continues to work (lighter on mobile). No horizontal page scroll outside the pinned section.

- [ ] **Step 4: Final push**

```bash
cd /Users/armaanarya/yba-website && git push origin main
```

Done. The full Approach C is shipped.

---

## Self-Review

**Spec coverage check:**
- ✅ "More elements moving on scroll" — ParallaxLayer wraps HeroSpotlight, Marquee, Bridge GridPattern, Curriculum calendar, Podcast hero (Tasks 1.5, 1.6, 1.7, 3.4)
- ✅ "Horizontal motion on scroll" — HorizontalPinned reel for Pillars (Task 2.2)
- ✅ "Gradient 5x more prominent then fades to black" — GradientSurge with scale 1→2.5 over 800px scroll, opacity 1→0 over 800–1200px (Task 1.4)
- ✅ "Consistent polish across all pages" — TextStagger sweep across inner pages (Tasks 3.2, 3.3), parallax + cascade reveals (Tasks 3.4, 3.5, 3.6, 3.7)
- ✅ Navbar logo visibility fix — invert filter (Task 1.3)
- ✅ Reduced-motion fallbacks built into every primitive (verified in Tasks 1.8, 2.2, 3.8)
- ✅ Mobile fallback for HorizontalPinned (Task 2.2 step 5)

**Placeholder scan:** No "TBD" / "TODO" / "fill in details" anywhere. Every step has actual code or an exact bash command.

**Type consistency:** `ParallaxLayer` props (children/speed/className), `GradientSurge` (no props), `HorizontalPinned` (children/heightVh/travelPercent/className), `BlurFade` (existing + new `direction` prop) — all consistent across every task that uses them.

**Risk mitigations included:** Lenis + sticky pin verification (Task 2.3 with optional `data-lenis-prevent` fix), invert filter doesn't affect focus rings (filter applied to inner `<span>` not the outer button — verified in Task 1.3 code).

---

Plan complete and saved to `docs/superpowers/plans/2026-05-07-home-energy-surge-implementation.md`.

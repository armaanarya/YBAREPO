# YBA Website — Chunks 4 & 5: Premium Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lift the YBA site from "polished" to Anchorage/OpenAssets-tier premium fintech/blockchain aesthetic — first via ambient visual polish (Chunk 4), then via interactive micro-magic (Chunk 5).

**Architecture:** Drop-in self-contained components under `components/ui/` so `app/page.tsx` stays surgical. Each component is client-side, framer-motion-based, dark-theme-aware, and accepts the existing `T` token style. No new state management, no new routing — purely visual augmentation. Each task ends with a manual smoke verify (the dev server runs externally on `:3000`; we curl + visually confirm rather than write Jest tests, since this is a single-page static-feeling SPA with all "logic" being visual animation).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v3, framer-motion v11, `@studio-freight/lenis` (Chunk 5 only). All other features use only what's already installed.

---

## Pre-Flight (do once before starting)

- [ ] **Step 0.1: Confirm dev server is running on :3000**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Expected output: `200`

If `000` or `connection refused`, ask the user to run `npm run dev` from `/Users/armaanarya/yba-website`.

- [ ] **Step 0.2: Confirm clean working tree before starting**

```bash
cd /Users/armaanarya/yba-website && git status --short
```

Expected: empty output (or only the docs/superpowers/plans/ file). If there are unrelated changes, ask the user.

- [ ] **Step 0.3: Read the current state of these reference files (10 minutes total)**

  - `app/page.tsx` — the `T` design tokens at lines 14-36, the page registry at the bottom (`HomePage`, `AboutPage`, etc.), and the `BlurFade` usage pattern.
  - `components/ui/blur-fade.tsx` — the wrapping pattern we mirror (useInView + variants + AnimatePresence).
  - `components/ui/hero-animated.tsx` — `BgGradient`, `TextStagger`, `AnimatedContainer`.
  - `components/ui/resizable-navbar.tsx` — the existing fixed nav at z-50/z-[60].
  - `tailwind.config.ts` and `styles/globals.css` — the dark token system.

You don't need to remember every line, but you need to know that `T.bg = '#09090f'`, `T.dark = '#eeeeff'`, `T.cta = '#eeeeff'`, `T.ctaText = '#09090f'`. All animations should respect `prefers-reduced-motion` (already wired in globals.css).

---

# CHUNK 4 — Ambient Polish

**Theme:** Six passive visual upgrades that don't require user interaction. Each component is self-contained, drops into `app/page.tsx` with one or two lines, and no existing logic changes.

## File Structure for Chunk 4

- Create: `components/ui/scroll-progress.tsx` — fixed top scroll indicator
- Create: `components/ui/grid-pattern.tsx` — animated dot/grid bg overlay
- Create: `components/ui/marquee.tsx` — infinite-scroll horizontal strip
- Create: `components/ui/number-counter.tsx` — count-up on inView
- Create: `components/ui/glow-card.tsx` — wrapper that adds soft mouse-following glow
- Modify: `app/page.tsx` — wire all six in
- Modify: `app/layout.tsx` — mount `ScrollProgress` once at the root

---

### Task 4.1: ScrollProgress Bar

**What it does:** A 2px-tall white indicator pinned to the very top of the page that fills left→right as the user scrolls. Sits above the nav (z-[70]).

**Files:**
- Create: `components/ui/scroll-progress.tsx`
- Modify: `app/layout.tsx` (mount at root, not in the page component, so it's stable across page-state changes)

- [ ] **Step 1: Create the component**

Write to `components/ui/scroll-progress.tsx`:

```tsx
'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] bg-[#eeeeff]"
    />
  )
}
```

- [ ] **Step 2: Read the current `app/layout.tsx`**

```bash
cat /Users/armaanarya/yba-website/app/layout.tsx
```

Note the existing `<body>` content and what's already mounted. The `ScrollProgress` must sit inside `<body>` but outside `{children}` so it survives page transitions.

- [ ] **Step 3: Mount ScrollProgress in `app/layout.tsx`**

Add `import { ScrollProgress } from '@/components/ui/scroll-progress'` at the top of the imports.

Inside the existing `<body className=...>`, add `<ScrollProgress />` as the **first child** before `{children}`:

```tsx
<body className="...existing classes...">
  <ScrollProgress />
  {children}
</body>
```

If `app/layout.tsx` uses a path alias different from `@/`, use a relative import: `'../components/ui/scroll-progress'`.

- [ ] **Step 4: Verify rendering**

```bash
curl -s http://localhost:3000/ | grep -c 'h-\[2px\] bg-\[#eeeeff\]'
```

Expected: `1` (the fixed bar is in the HTML).

Also open `http://localhost:3000/` in the browser, scroll down — the white bar at the top should grow from left to right. With `prefers-reduced-motion`, the spring becomes near-instant (already handled globally).

- [ ] **Step 5: Commit**

```bash
cd /Users/armaanarya/yba-website
git add components/ui/scroll-progress.tsx app/layout.tsx
git commit -m "feat(ui): add fixed scroll-progress indicator at top"
```

---

### Task 4.2: Animated Grid/Dot Background

**What it does:** A subtle animated dot grid that lives in the Hero section behind the gradient bloom. Dots breathe (opacity loops 0.06 → 0.18 over ~6s) so the background never feels static.

**Files:**
- Create: `components/ui/grid-pattern.tsx`
- Modify: `app/page.tsx` (Hero section, around line 480)

- [ ] **Step 1: Create the component**

Write to `components/ui/grid-pattern.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'

interface GridPatternProps {
  size?: number
  dotSize?: number
  className?: string
}

export function GridPattern({
  size = 28,
  dotSize = 1.2,
  className = '',
}: GridPatternProps) {
  const id = 'yba-grid-dots'
  return (
    <motion.svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      animate={{ opacity: [0.35, 0.65, 0.35] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <pattern
          id={id}
          x="0"
          y="0"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={size / 2} cy={size / 2} r={dotSize} fill="rgba(238,238,255,0.18)" />
        </pattern>
        <radialGradient id="yba-grid-mask" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="yba-grid-fade">
          <rect width="100%" height="100%" fill="url(#yba-grid-mask)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} mask="url(#yba-grid-fade)" />
    </motion.svg>
  )
}
```

- [ ] **Step 2: Wire into Hero in `app/page.tsx`**

Find the Hero block. It currently has `<BgGradient ... />` followed by the noise grain SVG. Insert `<GridPattern />` BETWEEN `BgGradient` and the noise overlay. Add the import at the top of `app/page.tsx`:

```tsx
import { GridPattern } from '../components/ui/grid-pattern'
```

Inside the Hero, the new ordering should be:

```tsx
<Hero layout="default" className="min-h-[92svh] pt-20 pb-16 px-6">
  <BgGradient gradientColors="indigo" gradientSize="lg" gradientPosition="top" />
  <GridPattern />
  <div aria-hidden="true" style={{ /* ...existing noise grain ... */ }} />
  {/* existing content */}
</Hero>
```

- [ ] **Step 3: Verify it renders without overpowering the gradient**

```bash
curl -s http://localhost:3000/ | grep -c 'yba-grid-dots'
```

Expected: `1` (or more if SSR duplicates).

Visual check: the gradient bloom is still dominant. Dots are barely visible but add texture. They should pulse subtly, not flicker.

- [ ] **Step 4: Commit**

```bash
git add components/ui/grid-pattern.tsx app/page.tsx
git commit -m "feat(hero): add breathing dot-grid pattern overlay"
```

---

### Task 4.3: Marquee Industry Strip

**What it does:** Replace the static "Industries We Study" chip list with an infinite horizontal marquee — keeps moving slowly, pauses on hover, fades on the edges (mask).

**Files:**
- Create: `components/ui/marquee.tsx`
- Modify: `app/page.tsx` (industry chips section, currently around line 601-617)

- [ ] **Step 1: Create the marquee component**

Write to `components/ui/marquee.tsx`:

```tsx
'use client'

import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`group relative w-full overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max animate-[yba-marquee_var(--yba-marquee-duration)_linear_infinite] gap-4"
        style={
          {
            ['--yba-marquee-duration' as string]: `${speed}s`,
            animationPlayState: pauseOnHover ? undefined : 'running',
          } as React.CSSProperties
        }
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running'
        }}
      >
        {/* duplicate children twice for seamless loop */}
        <div className="flex shrink-0 items-center gap-3">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add the keyframes to `styles/globals.css`**

Append to the bottom of `styles/globals.css`:

```css
/* Marquee */
@keyframes yba-marquee {
  0%   { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
```

- [ ] **Step 3: Wire into `app/page.tsx`**

Find the industry chips block (currently uses `CHIPS.map((c, i) => <BlurFade key={c} ...>...</BlurFade>)`).

Add the import at the top:

```tsx
import { Marquee } from '../components/ui/marquee'
```

Replace the inner `<div style={{ display: 'flex', flexWrap: 'wrap', gap: ...}}>` block with:

```tsx
<Marquee speed={45}>
  {CHIPS.map(c => (
    <span
      key={c}
      className="chip"
      style={{
        fontFamily: T.inter,
        fontSize: '0.8125rem',
        fontWeight: 500,
        background: T.chip,
        color: T.dark,
        borderRadius: 999,
        padding: '7px 16px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        border: `1px solid ${T.border}`,
      }}
    >
      {c}
    </span>
  ))}
</Marquee>
```

(The per-chip BlurFade is removed — the marquee itself is the entrance animation. Keep the section heading's BlurFade.)

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:3000/ | grep -c 'yba-marquee'
```

Expected: `≥ 1`.

Visual check: chips slide left continuously, edges fade out, hovering pauses the strip.

- [ ] **Step 5: Commit**

```bash
git add components/ui/marquee.tsx styles/globals.css app/page.tsx
git commit -m "feat(home): replace chip wrap with infinite marquee strip"
```

---

### Task 4.4: Animated Number Counter for Goals Stats

**What it does:** Adds a four-stat band above the Year One Goals list (e.g. "5+ schools", "10+ speakers", "50+ hackathon spots", "100% peer-reviewed") that counts up from 0 → target as the row scrolls into view.

**Files:**
- Create: `components/ui/number-counter.tsx`
- Modify: `app/page.tsx` (`GoalsPage`, just before the Year One section)

- [ ] **Step 1: Create the counter component**

Write to `components/ui/number-counter.tsx`:

```tsx
'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'

interface NumberCounterProps {
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function NumberCounter({
  to,
  duration = 1.6,
  suffix = '',
  prefix = '',
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [inView, to, duration, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
```

- [ ] **Step 2: Add the stats band in `GoalsPage`**

Open `app/page.tsx`, find `function GoalsPage()`. Just AFTER the intro `<section>` (which contains "Where Learning Meets Building.") and BEFORE the `<section aria-label="Year one goals">` section, insert:

```tsx
{/* Stats band */}
<section aria-label="Year one targets" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem) 2.5rem' }}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem' }}>
    {[
      { value: 50, suffix: '+', label: 'Hackathon spots' },
      { value: 10, suffix: '+', label: 'Guest speakers' },
      { value: 5,  suffix: '+', label: 'Partner schools' },
      { value: 100, suffix: '%', label: 'Peer-reviewed' },
    ].map((s, i) => (
      <BlurFade key={s.label} inView delay={0.05 + i * 0.08} yOffset={10}>
        <div style={{ background: T.surface, borderRadius: 14, border: `1px solid ${T.border}`, padding: '1.5rem 1.25rem' }}>
          <div style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,3.5vw,2.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1 }}>
            <NumberCounter to={s.value} suffix={s.suffix} />
          </div>
          <div style={{ fontFamily: T.inter, fontSize: '0.8125rem', fontWeight: 500, color: T.muted, marginTop: '0.5rem' }}>{s.label}</div>
        </div>
      </BlurFade>
    ))}
  </div>
</section>
```

Add the import at the top of `app/page.tsx`:

```tsx
import { NumberCounter } from '../components/ui/number-counter'
```

- [ ] **Step 3: Verify**

```bash
curl -s http://localhost:3000/ -o /dev/null -w "%{http_code}\n"
```

Expected: `200`.

Navigate to the Goals page in the browser. The four stat cards should fade in as you scroll, and the numbers should count up from 0.

- [ ] **Step 4: Commit**

```bash
git add components/ui/number-counter.tsx app/page.tsx
git commit -m "feat(goals): add animated stat counters above Year One list"
```

---

### Task 4.5: Glow Card Wrapper (mouse-following soft halo)

**What it does:** A wrapper that paints a soft white glow under the cursor when the user hovers a card. We apply it to the three `PILLARS` cards on home, the four `CONTACT_METHODS` cards, and the `STEPS` (hackathon) cards.

**Files:**
- Create: `components/ui/glow-card.tsx`
- Modify: `app/page.tsx` (replace the `pillar-card` div + contact `<a>` + steps `<div>` wrappers)

- [ ] **Step 1: Create the GlowCard component**

Write to `components/ui/glow-card.tsx`:

```tsx
'use client'

import { useRef, useState, ReactNode, CSSProperties } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'a'
  href?: string
  target?: string
  rel?: string
  'aria-label'?: string
  onClick?: () => void
}

export function GlowCard({
  children,
  className = '',
  style,
  as = 'div',
  ...rest
}: GlowCardProps) {
  const ref = useRef<HTMLElement>(null)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }
  const onLeave = () => setPos(null)

  const Tag = as as 'div'
  return (
    <Tag
      // @ts-expect-error allow ref polymorphism
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {pos && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: pos.y - 140,
            left: pos.x - 140,
            width: 280,
            height: 280,
            background: 'radial-gradient(circle, rgba(238,238,255,0.18), transparent 65%)',
            pointerEvents: 'none',
            transition: 'opacity 0.18s',
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </Tag>
  )
}
```

- [ ] **Step 2: Apply to PILLARS in `HomePage`**

Find the PILLARS map block in `app/page.tsx`. The current inner `<div className="pillar-card" style={{...}}>` should be wrapped/replaced with `<GlowCard>` so the existing styling stays but mouse-tracking glow is added on top:

```tsx
{PILLARS.map((p, i) => (
  <BlurFade key={i} delay={i * 0.1} inView>
    <GlowCard
      className="pillar-card"
      style={{ background: 'rgba(17,17,24,0.8)', borderRadius: 16, padding: '2rem', border: `1px solid ${T.border}`, borderLeft: '3px solid transparent', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', height: '100%', transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, border-left-color 0.22s' }}
      onClick={undefined}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: T.manrope, fontSize: '1.25rem', fontWeight: 800, color: T.accent }}>{p.icon}</span>
      </div>
      <div style={{ fontFamily: T.manrope, fontSize: '1.125rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', marginBottom: '0.625rem' }}>{p.title}</div>
      <div style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.65 }}>{p.desc}</div>
    </GlowCard>
  </BlurFade>
))}
```

The previous `onMouseEnter` / `onMouseLeave` JS-style transforms must be removed — they're replaced by the CSS `.pillar-card:hover` rule already in `globals.css`.

Add the import at the top of `app/page.tsx`:

```tsx
import { GlowCard } from '../components/ui/glow-card'
```

- [ ] **Step 3: Apply to CONTACT_METHODS cards in `ContactPage`**

In the contact page card map, replace the current `<a ...>` with `<GlowCard as="a" href={m.href} ...>`:

```tsx
{CONTACT_METHODS.map((m, i) => (
  <BlurFade key={m.label} inView delay={0.05 + i * 0.08} yOffset={10}>
    <GlowCard
      as="a"
      href={m.href}
      target={m.href.startsWith('http') ? '_blank' : undefined}
      rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={`${m.label}: ${m.value}`}
      style={{
        display: 'block',
        background: T.surface,
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        borderLeft: '3px solid transparent',
        boxShadow: T.shadowMd,
        padding: '2rem',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, border-left-color 0.22s',
        height: '100%',
      }}
    >
      {/* keep the existing icon bubble + label + value + cta row identical */}
      <div style={{ width: 48, height: 48, borderRadius: 14, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: T.accent }}>
        {m.icon}
      </div>
      <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.375rem' }}>{m.label}</p>
      <p style={{ fontFamily: T.manrope, fontSize: '1.125rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', marginBottom: '0.875rem', wordBreak: 'break-word' }}>{m.value}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 600, color: T.accent }}>
        {m.cta}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </GlowCard>
  </BlurFade>
))}
```

The previous `onMouseEnter` translate-Y / borderLeft transitions are kept via inline `transition`; we drop the inline JS handlers because the `transform: translateY(-4px)` was a hover effect — replace it with this CSS rule appended to `globals.css`:

```css
.glow-hover-lift { transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s; }
.glow-hover-lift:hover { transform: translateY(-4px); }
```

Then add `className="glow-hover-lift"` to the `<GlowCard ...>` so the lift still happens.

- [ ] **Step 4: Verify glow appears on hover**

```bash
curl -s http://localhost:3000/ | grep -c 'rgba(238,238,255,0.18)'
```

Expected: at least one match (the glow gradient).

Visual: hover over a pillar card or a contact card — a soft white halo should follow your cursor.

- [ ] **Step 5: Commit**

```bash
git add components/ui/glow-card.tsx app/page.tsx styles/globals.css
git commit -m "feat(ui): add cursor-following glow to pillar and contact cards"
```

---

### Task 4.6: TextStagger applied to all SectionHeading instances

**What it does:** The hero already uses `TextStagger`. Audit every other `<SectionHeading>` and `<h2>` in the codebase and convert to `TextStagger` so each major heading has the per-character reveal — but ONLY when it scrolls into view (not on every mount).

**Files:**
- Modify: `components/ui/hero-animated.tsx` (extend `TextStagger` to support inView trigger)
- Modify: `app/page.tsx` (replace headings in About vision, Goals "Where Learning…", Bridge CTA, Year One Goals h2, Hackathon h2, Curriculum h1, Podcast h1)

- [ ] **Step 1: Extend TextStagger with `inView` mode**

Open `components/ui/hero-animated.tsx`. Find the `TextStagger` component. The current `whileInView="visible"` already triggers on scroll — that's good. We just need to add an option to delay the start. Confirm the current signature is:

```tsx
export interface TextStaggerProps extends HTMLMotionProps<'div'> {
  text: string
  stagger?: number
  direction?: TransformDirection
  className?: string
  as?: keyof JSX.IntrinsicElements
}
```

No code change needed — the existing `viewport={{ once: true }}` is the right behavior. Skip to step 2.

- [ ] **Step 2: Convert About → Vision**

Find in `app/page.tsx` (in `AboutPage`):

```tsx
<p style={{ fontFamily: T.manrope, fontSize: 'clamp(1.375rem,3vw,2rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.35, maxWidth: '38ch', margin: '0 auto' }}>
  A global network of YBA chapters where teenagers are the primary drivers of decentralized innovation.
</p>
```

Replace with:

```tsx
<TextStagger
  text="A global network of YBA chapters where teenagers are the primary drivers of decentralized innovation."
  stagger={0.015}
  direction="bottom"
  as="p"
  className="font-extrabold tracking-[-0.02em] leading-[1.35]"
  style={{ fontFamily: T.manrope, fontSize: 'clamp(1.375rem,3vw,2rem)', color: T.dark, maxWidth: '38ch', margin: '0 auto' }}
/>
```

Note: `TextStagger` already imports motion + uses inView once. Add the `TextStagger` import at the top of `app/page.tsx`:

```tsx
import { TextStagger } from '../components/ui/hero-animated'
```

(if not already imported)

- [ ] **Step 3: Convert Goals page intro heading**

In `GoalsPage`, replace `<SectionHeading>Where Learning Meets Building.</SectionHeading>` with:

```tsx
<TextStagger
  text="Where Learning Meets Building."
  stagger={0.025}
  direction="bottom"
  as="h2"
  className="font-extrabold tracking-[-0.02em] leading-[1.08]"
  style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
/>
```

- [ ] **Step 4: Convert Bridge CTA heading on Home**

Find: `<SectionHeading>We Don't Just Study<br />the Future. We Build It.</SectionHeading>`

Replace with:

```tsx
<TextStagger
  text="We Don't Just Study the Future. We Build It."
  stagger={0.02}
  direction="bottom"
  as="h2"
  className="font-extrabold tracking-[-0.02em] leading-[1.08]"
  style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
/>
```

(the `<br />` is dropped; rely on natural wrapping at this width)

- [ ] **Step 5: Convert Year One Goals h2 + Hackathon h2 + Curriculum h1 + Podcast h1**

Five more headings — apply the same pattern. The full list to convert:

| Page | Current text | Replacement font-size class |
|------|--------------|------------------------------|
| Goals | `<h2>Year One Goals</h2>` | `clamp(1.75rem,3vw,2.25rem)` |
| Goals | `<h2>YBA Hackathon Series</h2>` | `clamp(1.75rem,3.5vw,2.25rem)` |
| Curriculum | `<h1>The Curriculum<br/>Is Being Built.</h1>` → text "The Curriculum Is Being Built." | `clamp(2.25rem,5vw,3.75rem)` |
| Podcast | `<h1>The YBA Podcast.</h1>` | `clamp(2.25rem,5vw,3.75rem)` |
| Curriculum module detail | `<h1>{title}</h1>` | `clamp(2.25rem,5vw,3.5rem)` |

For each, the conversion follows step 3's template — only the `text`, `as`, font-size, and `lineHeight` differ. Keep `stagger={0.02}` for h2's and `stagger={0.025}` for h1's.

For the module detail h1, use:

```tsx
<TextStagger
  key={title}
  text={title}
  stagger={0.025}
  direction="bottom"
  as="h1"
  className="font-extrabold tracking-[-0.025em] leading-[1.07]"
  style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.5rem)', color: T.dark, marginTop: '1rem' }}
/>
```

The `key={title}` forces the animation to re-run when the user clicks a different module.

- [ ] **Step 6: Verify**

```bash
curl -s http://localhost:3000/ -o /dev/null -w "%{http_code}\n"
```

Expected: `200`. Navigate through all pages — each major heading should animate character-by-character on scroll-in.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx
git commit -m "feat(ui): apply TextStagger to all section headings sitewide"
```

---

### Chunk 4 Wrap-Up

- [ ] **Step W4.1: Visual smoke test**

Open `http://localhost:3000/` and click through every page (Home → About → Goals → Curriculum → click a module → back → Podcast → Register → Contact). For each:

1. The white scroll-progress bar tracks scroll position at the top.
2. Hero has the breathing dot grid behind the gradient.
3. Industry chips on Home scroll horizontally as a marquee.
4. Goals page shows four stat cards counting up.
5. Hovering a pillar/contact card reveals a soft white glow following the cursor.
6. Every major heading animates character-by-character.

- [ ] **Step W4.2: Type-check the source**

```bash
cd /Users/armaanarya/yba-website && npx tsc --noEmit 2>&1 | grep -v '\.next/types' | head -20
```

Expected: no errors from `app/` or `components/`.

- [ ] **Step W4.3: Pause for user review**

Output to the user: "Chunk 4 complete — 6 ambient polish features added. Review the live site, then approve Chunk 5 to continue with interactive enhancements."

---

# CHUNK 5 — Interactive Layer

**Theme:** Six features that respond to the user's mouse/scroll/click in subtle premium ways. Pure delight.

## File Structure for Chunk 5

- Create: `components/ui/magnetic-button.tsx`
- Create: `components/ui/tilt-card.tsx`
- Create: `components/ui/lenis-provider.tsx`
- Create: `components/ui/custom-cursor.tsx`
- Modify: `app/layout.tsx` (mount LenisProvider + CustomCursor)
- Modify: `app/page.tsx` (wrap CTAs in MagneticButton, wrap pillar/contact/podcast cards in TiltCard, enhance AnimatePresence transition variants)
- Modify: `package.json` (add `@studio-freight/lenis` dependency)

---

### Task 5.1: Magnetic CTA Buttons

**What it does:** When the user's cursor approaches a primary CTA within ~80px, the button gently pulls toward the cursor. Releases on mouse-leave.

**Files:**
- Create: `components/ui/magnetic-button.tsx`
- Modify: `app/page.tsx` (Hero CTA, Bridge CTA, Hackathon CTA, Curriculum "Get Notified", Register submit)

- [ ] **Step 1: Create the wrapper**

Write to `components/ui/magnetic-button.tsx`:

```tsx
'use client'

import { useRef, ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticButton({
  children,
  strength = 0.35,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 20, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 20, mass: 0.4 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(dx * strength)
    y.set(dy * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Wrap the Hero CTA**

In `app/page.tsx`, find the Hero `AnimatedContainer` for the CTA buttons. Wrap each `<button>` with `<MagneticButton>`:

```tsx
<AnimatedContainer transition={{ delay: 0.65 }} className="flex gap-3 flex-wrap justify-center">
  <MagneticButton>
    <button onClick={() => { track(...); nav('register') }} style={{ /* existing style */ }}>
      Join the Movement →
    </button>
  </MagneticButton>
  <MagneticButton strength={0.25}>
    <button onClick={() => nav('goals')} style={{ /* existing style */ }}>
      See Our Goals
    </button>
  </MagneticButton>
</AnimatedContainer>
```

Add the import at the top of `app/page.tsx`:

```tsx
import { MagneticButton } from '../components/ui/magnetic-button'
```

- [ ] **Step 3: Wrap the Bridge CTA, Hackathon CTA, Curriculum "Get Notified", Register submit**

For each CTA button on each page:
- Bridge CTA: `<button onClick={() => nav('register')}>Apply Now →</button>` → wrap in `<MagneticButton>`
- Hackathon "Get Notified" → wrap
- Curriculum "Get Notified" → wrap
- Register submit "Complete Registration" → wrap with `strength={0.15}` (subtler since it's full-width)

Do NOT wrap the nav "Join YBA" button (it's already small + inside a constrained nav, magnetic motion would feel jittery).

- [ ] **Step 4: Verify**

```bash
curl -s http://localhost:3000/ | grep -c 'Join the Movement'
```

Expected: `≥ 1`.

Visual check: hover near (not on) a CTA — it pulls toward the cursor, then releases when the cursor leaves.

- [ ] **Step 5: Commit**

```bash
git add components/ui/magnetic-button.tsx app/page.tsx
git commit -m "feat(ui): add magnetic hover behavior to primary CTAs"
```

---

### Task 5.2: 3D Tilt on Hover for Cards

**What it does:** Pillar cards, contact cards, podcast cards, and module-progress cards get a 3D parallax tilt that follows the cursor.

**Files:**
- Create: `components/ui/tilt-card.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create TiltCard**

Write to `components/ui/tilt-card.tsx`:

```tsx
'use client'

import { useRef, ReactNode, CSSProperties } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
}

export function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 8,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 18 })
  const sy = useSpring(y, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt])
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Wrap PILLARS cards**

In `HomePage`, replace the outer wrapper of each pillar card. Currently it's `<BlurFade><GlowCard>...</GlowCard></BlurFade>`. Change to `<BlurFade><TiltCard><GlowCard>...</GlowCard></TiltCard></BlurFade>`. The TiltCard provides perspective; the GlowCard provides glow; both compose cleanly.

Add the import:

```tsx
import { TiltCard } from '../components/ui/tilt-card'
```

- [ ] **Step 3: Wrap CONTACT_METHODS cards**

Same pattern: `<BlurFade><TiltCard><GlowCard as="a" ...>...</GlowCard></TiltCard></BlurFade>`.

- [ ] **Step 4: Wrap PodcastPage episode cards**

Similar — wrap each episode card div in `<TiltCard maxTilt={5}>` (smaller tilt because the card is smaller and contains an icon/image).

- [ ] **Step 5: Verify**

Visual: hover a card — it tilts in 3D following the mouse, returns flat on leave. Should NOT happen on touch devices (mouse events only).

- [ ] **Step 6: Commit**

```bash
git add components/ui/tilt-card.tsx app/page.tsx
git commit -m "feat(ui): add 3D parallax tilt to pillar/contact/podcast cards"
```

---

### Task 5.3: Lenis Smooth Scrolling

**What it does:** Replaces the default browser scroll with a smoother, slightly inertia-tuned scroll. Anchored at the App level via a provider that runs the rAF loop once.

**Files:**
- Modify: `package.json`
- Create: `components/ui/lenis-provider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install lenis**

```bash
cd /Users/armaanarya/yba-website && npm install lenis --legacy-peer-deps
```

Expected: package added to `dependencies` in `package.json`. The current published name is `lenis` (the older `@studio-freight/lenis` is deprecated; both work but use `lenis`).

Verify:

```bash
grep '"lenis"' /Users/armaanarya/yba-website/package.json
```

Expected: a line like `"lenis": "^1.x.x"`.

- [ ] **Step 2: Create the provider**

Write to `components/ui/lenis-provider.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function LenisProvider() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
```

- [ ] **Step 3: Mount in `app/layout.tsx`**

Add the import and mount the provider next to `<ScrollProgress />` (from Task 4.1):

```tsx
import { LenisProvider } from '@/components/ui/lenis-provider'
// inside <body>
<ScrollProgress />
<LenisProvider />
{children}
```

- [ ] **Step 4: Verify framer-motion's useScroll still works**

Lenis sets `scrollY` natively — framer-motion's `useScroll` reads `window.scrollY`, so the existing `ScrollProgress` and any `useScroll`-based animations should still work. Confirm:

1. The scroll-progress bar still tracks scroll.
2. The hero stagger animations on first paint are unchanged.
3. `prefers-reduced-motion: reduce` disables Lenis (we early-return).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json components/ui/lenis-provider.tsx app/layout.tsx
git commit -m "feat(ui): integrate Lenis smooth scrolling sitewide"
```

---

### Task 5.4: Custom Desktop Cursor

**What it does:** A 12px white dot follows the cursor on desktop only (md+ viewports). Grows to 36px transparent ring on hoverable elements (`a`, `button`, `[role=button]`).

**Files:**
- Create: `components/ui/custom-cursor.tsx`
- Modify: `app/layout.tsx`
- Modify: `styles/globals.css` (hide native cursor on md+)

- [ ] **Step 1: Create the cursor**

Write to `components/ui/custom-cursor.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 36, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 36, mass: 0.4 })
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    setEnabled(mq.matches)
    const handler = () => setEnabled(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement | null
      const interactive = !!t?.closest('a, button, [role="button"], input, select, textarea')
      setHovering(interactive)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eeeeff] mix-blend-difference"
        style={{
          left: sx,
          top: sy,
          width: hovering ? 36 : 10,
          height: hovering ? 36 : 10,
          transition: 'width 0.18s, height 0.18s',
        }}
      />
    </>
  )
}
```

- [ ] **Step 2: Hide the native cursor on desktop**

Append to `styles/globals.css`:

```css
@media (min-width: 1024px) and (hover: hover) and (pointer: fine) {
  html, body { cursor: none; }
  a, button, [role="button"], input, select, textarea, label { cursor: none; }
}
```

- [ ] **Step 3: Mount in `app/layout.tsx`**

```tsx
import { CustomCursor } from '@/components/ui/custom-cursor'
// inside <body>, alongside ScrollProgress + LenisProvider
<CustomCursor />
```

- [ ] **Step 4: Verify**

Open `http://localhost:3000/` in a desktop browser at ≥1024px. Native cursor disappears, white dot follows the mouse, grows to a ring on buttons/links. Resize to <1024px → native cursor returns, custom cursor hides.

- [ ] **Step 5: Commit**

```bash
git add components/ui/custom-cursor.tsx app/layout.tsx styles/globals.css
git commit -m "feat(ui): desktop-only custom cursor with hover state"
```

---

### Task 5.5: Page Transition Variants

**What it does:** The current `AnimatePresence` in `App` uses a tiny `opacity + y:10` fade between pages. Replace with a richer pair of variants that matches each page's character.

**Files:**
- Modify: `app/page.tsx` (the `App` component near the bottom, ~line 1390)

- [ ] **Step 1: Find the AnimatePresence block**

Locate at the bottom of `app/page.tsx`:

```tsx
<AnimatePresence mode="wait">
  <motion.div key={page} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}>
    {page === 'home' && <HomePage nav={nav} />}
    {/* ...other pages */}
  </motion.div>
</AnimatePresence>
```

- [ ] **Step 2: Replace with directional variants**

Define a small page-transition map at module scope (above `App`):

```tsx
const PAGE_TRANSITIONS: Record<Page, { initial: any; animate: any; exit: any }> = {
  home:       { initial: { opacity: 0, y: 12, filter: 'blur(8px)' },  animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -8, filter: 'blur(6px)' } },
  about:      { initial: { opacity: 0, x: 24 },                       animate: { opacity: 1, x: 0 },                      exit: { opacity: 0, x: -16 } },
  goals:      { initial: { opacity: 0, y: 16 },                       animate: { opacity: 1, y: 0 },                      exit: { opacity: 0, y: -10 } },
  curriculum: { initial: { opacity: 0, scale: 0.985 },                animate: { opacity: 1, scale: 1 },                  exit: { opacity: 0, scale: 1.01 } },
  podcast:    { initial: { opacity: 0, y: 16 },                       animate: { opacity: 1, y: 0 },                      exit: { opacity: 0, y: -10 } },
  register:   { initial: { opacity: 0, scale: 0.97 },                 animate: { opacity: 1, scale: 1 },                  exit: { opacity: 0, scale: 0.99 } },
  contact:    { initial: { opacity: 0, x: -24 },                      animate: { opacity: 1, x: 0 },                      exit: { opacity: 0, x: 16 } },
}
```

Then in `App`, change the motion.div to:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={page}
    initial={PAGE_TRANSITIONS[page].initial}
    animate={PAGE_TRANSITIONS[page].animate}
    exit={PAGE_TRANSITIONS[page].exit}
    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
  >
    {page === 'home'       && <HomePage nav={nav} />}
    {page === 'about'      && <AboutPage />}
    {page === 'goals'      && <GoalsPage />}
    {page === 'curriculum' && <CurriculumPage />}
    {page === 'podcast'    && <PodcastPage />}
    {page === 'register'   && <RegisterPage nav={nav} />}
    {page === 'contact'    && <ContactPage />}
  </motion.div>
</AnimatePresence>
```

- [ ] **Step 2.1: Avoid first-load flicker**

If on first mount the initial transition appears double (first the variants animate, then the hero internal animations replay), pass `initial={false}` once on the first paint by tracking a `firstRender` ref:

```tsx
const firstRender = useRef(true)
useEffect(() => { firstRender.current = false }, [])
// ...
<AnimatePresence mode="wait" initial={false}>
```

The `initial={false}` on `AnimatePresence` prevents the entry animation on the very first render — that's what we want.

- [ ] **Step 3: Verify**

Click through each nav link. Each page should slide/fade in from a slightly different direction characteristic of its content (Home blurs in, About slides from right, Contact slides from left, Register pops scale).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(ui): per-page transition variants in AnimatePresence"
```

---

### Task 5.6: Hero Spotlight Follow

**What it does:** Adds a soft 600px-wide light spot under the cursor when it's over the Hero. Slow spring-tracked, so it lags behind the mouse like a flashlight — premium tactile feel without overwhelming the existing gradient.

**Files:**
- Modify: `components/ui/hero-animated.tsx` (add a `<HeroSpotlight />` export)
- Modify: `app/page.tsx` (mount inside the Hero block)

- [ ] **Step 1: Append the new export to `components/ui/hero-animated.tsx`**

At the bottom of the file, add:

```tsx
'use client'
// (already in the file's pragma)

import { useRef as _useRef } from 'react'
// (these imports already exist; just augment the file)

export function HeroSpotlight() {
  const ref = _useRef<HTMLDivElement>(null)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 60, damping: 18, mass: 0.6 })

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect()
      if (!r) return
      if (e.clientY < r.top || e.clientY > r.bottom) return
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(238,238,255,0.18), transparent 60%)',
          position: 'absolute',
          mixBlendMode: 'plus-lighter',
        }}
      />
    </div>
  )
}
```

If the file doesn't already import `useMotionValue`, `useSpring`, and `React`, add them:

```tsx
import * as React from 'react'
import { motion, useMotionValue, useSpring, type HTMLMotionProps, type Transition } from 'framer-motion'
```

- [ ] **Step 2: Mount inside Hero in `app/page.tsx`**

Find the Hero block. The current order is `BgGradient` → `GridPattern` (from Task 4.2) → noise overlay → `<div className="relative z-10">content</div>`. Insert `<HeroSpotlight />` right after `<GridPattern />`:

```tsx
<Hero layout="default" className="min-h-[92svh] pt-20 pb-16 px-6">
  <BgGradient gradientColors="indigo" gradientSize="lg" gradientPosition="top" />
  <GridPattern />
  <HeroSpotlight />
  <div aria-hidden="true" style={{ /* noise */ }} />
  <div className="relative z-10 ...">{/* content */}</div>
</Hero>
```

Update the existing `HeroSpotlight` import:

```tsx
import { Hero, BgGradient, TextStagger, AnimatedContainer, HeroSpotlight } from '../components/ui/hero-animated'
```

- [ ] **Step 3: Verify**

Hover the hero. A soft light spot should follow your mouse with a gentle lag, blending additively with the gradient.

- [ ] **Step 4: Commit**

```bash
git add components/ui/hero-animated.tsx app/page.tsx
git commit -m "feat(hero): add cursor-following spotlight with mix-blend"
```

---

### Chunk 5 Wrap-Up

- [ ] **Step W5.1: Full visual smoke test**

Run through every page on a desktop browser:

1. Custom cursor follows the mouse, grows on interactive elements.
2. Lenis smooth scrolling — wheel scrolls feel slightly tweened.
3. ScrollProgress bar still works (sanity check after Lenis).
4. Hover Hero CTAs → magnetic pull works.
5. Hover any pillar/contact/podcast card → 3D tilt + glow follows cursor.
6. Hero shows soft spotlight under the cursor.
7. Switch nav pages — each transition has its own directional motion.

- [ ] **Step W5.2: Mobile sanity**

Resize browser to 375px width. Confirm:
- Custom cursor disappears (native cursor returns).
- Magnetic + tilt effects don't fire on touch.
- Lenis scroll still works (or, if it feels weird on iOS, tweak `lenis.options.smoothTouch` to false).
- All layout works.

- [ ] **Step W5.3: Type-check**

```bash
cd /Users/armaanarya/yba-website && npx tsc --noEmit 2>&1 | grep -v '\.next/types' | head -20
```

Expected: no errors from `app/` or `components/`.

- [ ] **Step W5.4: Pause for user review**

Output: "Chunk 5 complete — 6 interactive enhancements added. The site now has Anchorage/OpenAssets-tier feel. Review and approve any final touch-ups."

---

## Self-Review

**1. Spec coverage:** Every candidate feature in the user's brief is mapped:
- Animated number counters → Task 4.4 ✓
- 3D card tilt → Task 5.2 ✓
- Magnetic CTAs → Task 5.1 ✓
- Marquee strip → Task 4.3 ✓
- Animated grid pattern → Task 4.2 ✓
- Scroll progress bar → Task 4.1 ✓
- Custom cursor → Task 5.4 ✓
- Glow effects on cards → Task 4.5 ✓
- Staggered text reveal on headings → Task 4.6 ✓
- Lenis smooth scrolling → Task 5.3 ✓
- Page transition variants → Task 5.5 ✓
- (Bonus: Hero spotlight follow → Task 5.6)

**2. Placeholder scan:** No "TBD", no "implement later", no "similar to". Every step has actual code or an actual command. Note: Task 4.6's table abbreviates the conversion of 5 headings; an implementer must apply the step-3 template to each — flagged inline.

**3. Type consistency:** Component prop names align across tasks (`MagneticButton.strength`, `TiltCard.maxTilt`, `GlowCard.as`, `NumberCounter.to/suffix/prefix`, `Marquee.speed/pauseOnHover`). The `Page` type used in PAGE_TRANSITIONS already exists at the top of `app/page.tsx`. The `T` token references all match the current dark-theme schema in `app/page.tsx:14`.

**Notable assumption:** `app/layout.tsx` exists and has a `<body>` we can inject providers into. If the project actually uses a `(site)` route group with a separate layout, the providers should be mounted there instead. Flag this to the user before starting Task 4.1 if `cat app/layout.tsx` reveals an unexpected structure.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-06-yba-chunks-4-5-premium-polish.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using `executing-plans`, batch with checkpoints.

**Which approach?**

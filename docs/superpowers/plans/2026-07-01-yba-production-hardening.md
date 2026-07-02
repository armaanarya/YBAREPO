# YBA Website Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Testing note:** This repo has **no test suite** and is a visual Next.js site. "Verify" steps therefore use `npm run build` (TypeScript + compile check) and the **Claude Preview** MCP (`preview_start` / `preview_screenshot` / `preview_inspect` / `preview_console_logs`) for visual + runtime confirmation, plus a real end-to-end signup for backend tasks. Do **not** claim a task done without running its verify step.
>
> **Cost note (Fable 5 execution):** Per `/claude-api-cost-optimization` — batch related edits into a single tool turn where possible, don't re-read files after editing (edits are tracked), and prefer targeted `Edit` over full-file rewrites. Prompt-cache stays warm within a task; group each task's reads together.

**Goal:** Harden the YBA site for production — protect minors' PII, stop the lag, remove the purple scroll bar and white hover glow, convert the letter-by-letter text reveal to a smooth flow-in, and replace the fake curriculum modules with the real Medium articles — without breaking the Supabase backend.

**Architecture:** Next.js 16 App Router. One large client page (`app/page.tsx`) + reusable motion components in `components/ui/`. Backend is two API routes writing to Supabase. Changes are surgical edits plus one new API route (`/api/articles`) that server-fetches and caches the Medium RSS feed.

**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind, framer-motion, Lenis, Supabase JS, `next/font`, `sharp`.

---

### Task 0: Branch + baseline

**Files:** none (setup)

- [ ] **Step 1: Create a working branch**

Run:
```bash
cd /Users/armaanarya/YBAREPO && git checkout -b prod-hardening
```

- [ ] **Step 2: Confirm a clean baseline build**

Run:
```bash
npm install && npm run build
```
Expected: build succeeds. Record any pre-existing warnings so we don't blame them on our changes.

- [ ] **Step 3: Start the preview server for visual checks (keep running)**

Use the Claude Preview MCP `preview_start` with a config named `yba-dev` (`npm run dev`, port `3000`). Confirm the home page renders via `preview_screenshot`. Leave it running for later tasks.

---

## PHASE 1 — Security (data protection first)

### Task 1: Server-only Supabase client + RLS checklist

**Files:**
- Create: `lib/supabase-server.ts`
- Modify: `app/api/signup/route.ts:2`
- Modify: `app/api/analytics/route.ts:2`
- Modify: `lib/supabase.ts` (keep for types; stop using anon client for writes)
- Create: `docs/SUPABASE-RLS.md` (manual dashboard checklist)

- [ ] **Step 1: Add the server-only client (service-role key, never `NEXT_PUBLIC_`)**

Create `lib/supabase-server.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

// Server-only. Uses the service-role key, which MUST NOT be prefixed NEXT_PUBLIC_.
// This bypasses RLS, so it may only ever be imported by API routes / server code.
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!url || !serviceKey) {
  // Fail loud in the server logs; the route will still return a 500 via its try/catch.
  console.error('[supabase-server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseServer = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
```

- [ ] **Step 2: Point both API routes at the server client**

In `app/api/signup/route.ts` change line 2:
```ts
import { supabaseServer as supabase } from '../../../lib/supabase-server'
```
In `app/api/analytics/route.ts` change line 2:
```ts
import { supabaseServer as supabase } from '../../../lib/supabase-server'
```
(The rest of both files keeps using the local name `supabase`, so no further edits here.)

- [ ] **Step 3: Set the env var locally and in Vercel**

Add to `.env.local` (already git-ignored) and to Vercel Project → Settings → Environment Variables:
```
SUPABASE_SERVICE_ROLE_KEY=<service role key from Supabase dashboard → Project Settings → API>
```
Keep the existing `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- [ ] **Step 4: Write the RLS checklist (manual, must be done in Supabase dashboard)**

Create `docs/SUPABASE-RLS.md`:
```markdown
# Supabase RLS — required before launch

Run in Supabase → SQL editor. This makes the API routes (service role) the ONLY
write path and denies the public anon key all read/write on PII tables.

alter table public.signups   enable row level security;
alter table public.analytics enable row level security;

-- Remove any permissive policies first (list them):
--   select * from pg_policies where schemaname='public';
-- Drop anything that grants anon SELECT/INSERT/ALL, then confirm zero anon policies:

-- Verify: as the anon role these must return 0 rows / permission denied.
--   set role anon; select count(*) from public.signups;   -- expect: permission denied / 0
--   select count(*) from public.analytics;                -- expect: permission denied / 0
--   reset role;

Because the routes use the service-role key, they bypass RLS and keep working.
```

- [ ] **Step 5: Verify build + backend still works**

Run: `npm run build` → PASS.
Then in the running preview, submit the registration form with a test email; via `preview_network` confirm `POST /api/signup` returns `{ ok: true }`. Confirm the row landed in Supabase.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase-server.ts app/api/signup/route.ts app/api/analytics/route.ts docs/SUPABASE-RLS.md
git commit -m "security: route DB writes through server-only service-role client + RLS checklist"
```

---

### Task 2: Security headers

**Files:** Modify `next.config.js`

- [ ] **Step 1: Add a `headers()` block**

Replace `next.config.js` with:
```js
/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://*.medium.com https://miro.medium.com https://cdn-images-1.medium.com",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
module.exports = nextConfig
```
> Note: `style-src`/`font-src` allow Google Fonts. **After Task 9 migrates to `next/font`**, tighten by removing the `fonts.googleapis.com` / `fonts.gstatic.com` allowances.

- [ ] **Step 2: Verify headers are served**

Run: `npm run build && npm run start` (port 3000), then:
```bash
curl -sI http://localhost:3000/ | grep -iE 'content-security-policy|x-frame-options|x-content-type|referrer-policy|strict-transport'
```
Expected: all five headers present. Then reload the preview and check `preview_console_logs` for **no** CSP violation errors (fix `connect-src`/`img-src` if any appear).

- [ ] **Step 3: Commit**

```bash
git add next.config.js && git commit -m "security: add CSP and hardening response headers"
```

---

### Task 3: Harden API routes (rate limit, honeypot, size caps, sanitize)

**Files:**
- Create: `lib/rate-limit.ts`
- Create: `lib/sanitize.ts`
- Modify: `app/api/signup/route.ts`
- Modify: `app/api/analytics/route.ts`
- Modify: `app/page.tsx` (add honeypot field to the form)

- [ ] **Step 1: Add a tiny in-memory rate limiter**

Create `lib/rate-limit.ts`:
```ts
// Best-effort in-memory limiter (per serverless instance). Good enough to stop
// casual floods; for hard guarantees move to Upstash/Vercel KV later.
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (b.count >= limit) return false
  b.count++
  return true
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  return (xff?.split(',')[0].trim()) || req.headers.get('x-real-ip') || 'unknown'
}
```

- [ ] **Step 2: Add input sanitizers with length caps**

Create `lib/sanitize.ts`:
```ts
// Strip control chars (except normal whitespace) and clamp length.
export function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return ''
  return v.replace(/[ --]/g, '').trim().slice(0, max)
}

// Clamp arbitrary JSON metadata by serialized size.
export function clampJson(v: unknown, maxBytes: number): unknown {
  if (v == null) return null
  try {
    const s = JSON.stringify(v)
    if (s.length > maxBytes) return { truncated: true }
    return v
  } catch {
    return null
  }
}
```

- [ ] **Step 3: Rewrite `app/api/signup/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '../../../lib/supabase-server'
import { rateLimit, clientIp } from '../../../lib/rate-limit'
import { clean } from '../../../lib/sanitize'

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`signup:${clientIp(req)}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()

    // Honeypot: real users never fill this hidden field.
    if (body.company) return NextResponse.json({ ok: true })

    const name   = clean(body.name, 120)
    const email  = clean(body.email, 254).toLowerCase()
    const school = clean(body.school, 200)
    const grade  = clean(body.grade, 40)
    const build_idea = clean(body.build_idea, 2000)

    if (!name || !email || !school || !grade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const { error } = await supabase.from('signups').insert({
      name, email, school, grade, build_idea: build_idea || null,
    })

    if (error) {
      if (error.code === '23505') return NextResponse.json({ ok: true, duplicate: true })
      console.error('[signup]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Rewrite `app/api/analytics/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer as supabase } from '../../../lib/supabase-server'
import { rateLimit, clientIp } from '../../../lib/rate-limit'
import { clean, clampJson } from '../../../lib/sanitize'

const VALID_EVENTS = new Set([
  'page_view', 'button_click', 'form_start', 'form_submit', 'officer_click',
])

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`analytics:${clientIp(req)}`, 60, 60_000)) {
      return NextResponse.json({ ok: true }) // silently drop; never disrupt UX
    }

    const body = await req.json()
    const event_type = clean(body.event_type, 40)
    if (!VALID_EVENTS.has(event_type)) {
      return NextResponse.json({ error: 'Invalid event_type' }, { status: 400 })
    }

    const { error } = await supabase.from('analytics').insert({
      event_type,
      page: body.page ? clean(body.page, 80) : null,
      metadata: clampJson(body.metadata, 4096),
    })
    if (error) {
      console.error('[analytics]', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[analytics]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

- [ ] **Step 5: Add the honeypot field to the registration form**

In `app/page.tsx`, inside the `<form onSubmit={handleSubmit} ...>` (near `app/page.tsx:1181`), add as the first child:
```tsx
{/* Honeypot — hidden from users, catches bots */}
<input
  type="text" name="company" tabIndex={-1} autoComplete="off"
  aria-hidden="true"
  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
/>
```
Then in `handleSubmit` (near `app/page.tsx:1099`), include it in the POST body:
```tsx
company: fd.get('company'),
```

- [ ] **Step 6: Verify**

Run: `npm run build` → PASS.
Then via preview: submit the form normally → `{ ok: true }` and row inserted. Then run this flood check against `npm run start`:
```bash
for i in $(seq 1 8); do curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/signup -H 'content-type: application/json' -d '{"name":"x","email":"a@b.co","school":"s","grade":"Senior"}'; done
```
Expected: first 5 → `200`, then `429`.

- [ ] **Step 7: Commit**

```bash
git add lib/rate-limit.ts lib/sanitize.ts app/api/signup/route.ts app/api/analytics/route.ts app/page.tsx
git commit -m "security: rate-limit, honeypot, size caps, and input sanitization on API routes"
```

---

## PHASE 2 — Visible UX fixes (purple bar, white glow, text animation)

### Task 4: Remove the purple scroll bar + recolor the purple legend

**Files:**
- Modify: `app/layout.tsx`
- Delete: `components/ui/scroll-progress.tsx`
- Modify: `app/page.tsx` (ScrollLegend usage — recolor)

- [ ] **Step 1: Unmount and delete the progress bar**

In `app/layout.tsx` remove line 3 (`import { ScrollProgress } ...`) and line 35 (`<ScrollProgress />`).
Then:
```bash
git rm components/ui/scroll-progress.tsx
```

- [ ] **Step 2: Recolor the left-edge ScrollLegend (currently violet `#a78bfa`)**

In `app/page.tsx` at the `<ScrollLegend items={[...]}` usage (`app/page.tsx:284`), pass a theme color:
```tsx
<ScrollLegend activeColor="#eeeeff" items={[
```
(Leave the `items` array as-is.)

- [ ] **Step 3: Verify no purple remains**

Run: `npm run build` → PASS.
In preview, `preview_screenshot` the top of the page while scrolled — confirm **no** gradient bar. `preview_inspect` the active `ScrollLegend` tick and confirm its `background-color` is `rgb(238, 238, 255)`, not violet.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ui: remove purple scroll-progress bar and recolor scroll legend to theme"
```

---

### Task 5: Remove the white hover glow + delete dead glow/cursor code

**Files:**
- Modify: `components/ui/glow-card.tsx`
- Delete: `components/ui/custom-cursor.tsx`
- Modify: `components/ui/hero-animated.tsx` (delete `HeroSpotlight`)
- Delete: `components/ui/gradient-surge.tsx`

- [ ] **Step 1: Strip the glow from `GlowCard` (keep it as a plain container so callers don't break)**

Replace `components/ui/glow-card.tsx` with:
```tsx
'use client'

import { ReactNode, CSSProperties } from 'react'

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

// Glow removed per design: this is now a plain container that preserves the
// original API/props so existing call sites keep working.
export function GlowCard({ children, className = '', style, as = 'div', ...rest }: GlowCardProps) {
  const commonProps = { className: `relative ${className}`, style, ...rest }
  if (as === 'a') {
    return <a {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  }
  return <div {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
}
```

- [ ] **Step 2: Delete dead white-glow / cursor code**

```bash
git rm components/ui/custom-cursor.tsx components/ui/gradient-surge.tsx
```
In `components/ui/hero-animated.tsx`, delete the entire `HeroSpotlight` block (`hero-animated.tsx:199-237`) and remove now-unused imports `useMotionValue`, `useSpring` **only if** nothing else in that file uses them (grep first: `grep -n "useMotionValue\|useSpring" components/ui/hero-animated.tsx`).

- [ ] **Step 3: Verify no white glow on hover**

Run: `npm run build` → PASS (fails loudly if any file still imported the deleted symbols — fix those imports if so).
In preview, hover the pillar cards and confirm via `preview_screenshot` there is no radial white glow following the cursor.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "ui: remove white hover glow (GlowCard) and delete dead spotlight/cursor components"
```

---

### Task 6: Replace letter-by-letter reveal with a smooth flow-in

**Files:** Modify `components/ui/hero-animated.tsx` (`TextStagger`)

- [ ] **Step 1: Rewrite `TextStagger` to animate the whole heading as one smooth block**

Replace the `Word` component and `TextStagger` export (`hero-animated.tsx:108-168`) with a single-element fade+rise (keep the same `TextStagger` name, props `text`/`as`/`className`/`style` so all call sites keep working; `stagger`/`direction` become no-ops but remain accepted to avoid touching every call site):
```tsx
export interface TextStaggerProps extends HTMLMotionProps<'div'> {
  text: string
  stagger?: number            // accepted for API compat; no longer used
  direction?: TransformDirection // accepted for API compat; no longer used
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function TextStagger({ text, className, as: Component = 'span', ...props }: TextStaggerProps) {
  const MotionComp = motion(Component as React.ElementType)
  return (
    <MotionComp
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative', className)}
      {...props}
    >
      {text}
    </MotionComp>
  )
}
```
Delete the now-unused `Word` function and `transformVariants`' `Word` usage if `transformVariants` is otherwise unused (grep: `grep -n "transformVariants" components/ui/hero-animated.tsx` — it's still used by `AnimatedContainer`, so keep it).

- [ ] **Step 2: Verify smooth flow-in on every page that uses it**

Run: `npm run build` → PASS.
In preview, load Home, Curriculum, and submit the form (success screen) — each heading should fade+rise as one smooth block, no per-letter typewriter. Screenshot Home hero mid-animation to confirm the whole headline moves together.

- [ ] **Step 3: Commit**

```bash
git add components/ui/hero-animated.tsx && git commit -m "ui: replace per-character text stagger with a single smooth flow-in"
```

---

## PHASE 3 — Performance (the lag)

### Task 7: Trim the always-on scroll-animation stack

**Files:**
- Modify: `components/ui/lenis-provider.tsx`
- Modify: `app/page.tsx` (reduce `HorizontalPinned` runways; remove second Home `GridPattern`)
- Modify: `components/ui/scroll-legend.tsx` (throttle scroll handler)

- [ ] **Step 1: Cap Lenis to reduce continuous rAF churn on low-power devices**

In `components/ui/lenis-provider.tsx`, also bail out when the device is coarse-pointer/touch (native scroll is already smooth there and Lenis adds cost). After the `reduce` check (`lenis-provider.tsx:8-9`) add:
```ts
const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches
if (coarse) return
```

- [ ] **Step 2: Throttle the ScrollLegend scroll handler with rAF**

In `components/ui/scroll-legend.tsx`, replace the `onScroll` wiring (`scroll-legend.tsx:42-55`) so the DOM reads run at most once per frame:
```ts
useEffect(() => {
  let ticking = false
  const compute = () => {
    ticking = false
    const y = window.scrollY + window.innerHeight * 0.35
    let current = items[0]?.id ?? ''
    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el && el.offsetTop <= y) current = item.id
    }
    setActiveId(current)
  }
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(compute) } }
  compute()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [items])
```

- [ ] **Step 3: Reduce the pinned-scroll runways on Home (300vh → 200vh)**

In `app/page.tsx`, change both Home `HorizontalPinned` usages:
- `app/page.tsx:389`: `heightVh={300}` → `heightVh={200}`
- `app/page.tsx:562`: `heightVh={300}` → `heightVh={200}`

- [ ] **Step 4: Remove the duplicate GridPattern on Home**

In `app/page.tsx`, delete the second grid layer inside the `ParallaxLayer` at `app/page.tsx:447-449` (the hero `GridPattern` at `:296` stays):
```tsx
{/* removed duplicate GridPattern parallax layer for perf */}
```

- [ ] **Step 5: Verify smoother scroll**

Run: `npm run build` → PASS.
In preview: scroll Home top-to-bottom; `preview_console_logs` shows no errors; confirm the pillar/officer reels still scroll-translate. Note qualitative smoothness.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "perf: gate Lenis on touch, rAF-throttle scroll legend, shorten pinned runways, dedupe grid"
```

---

### Task 8: Cut per-element mousemove cost + expensive blur reveals

**Files:**
- Modify: `components/ui/tilt-card.tsx`
- Modify: `components/ui/blur-fade.tsx`

- [ ] **Step 1: Disable tilt on touch/coarse pointers (and make it cheap otherwise)**

Read `components/ui/tilt-card.tsx` first. Add an early client check so `onMouseMove`/`getBoundingClientRect` never runs on touch devices: gate the tilt handlers behind a `useState` set from `window.matchMedia('(hover: hover) and (pointer: fine)').matches` in a `useEffect`; when false, render children in a plain `div` with no mouse handlers. (Mirror the existing pattern in `custom-cursor.tsx`/`horizontal-pinned.tsx` for the media-query effect.)

- [ ] **Step 2: Remove the animated `blur()` from BlurFade (keep the fade+rise)**

In `components/ui/blur-fade.tsx`, change the default `blur` handling so no `filter` animates. Edit the `defaultVariants` (`blur-fade.tsx:64-67`) to:
```ts
const defaultVariants: Variants = {
  hidden: { ...hidden, opacity: 0 },
  visible: { ...visible, opacity: 1 },
}
```
(Leave the `blur` prop in the signature for API compat; it's simply unused now.)

- [ ] **Step 3: Verify**

Run: `npm run build` → PASS. In preview, confirm sections still fade/rise into view but without the blur; scroll feels lighter. On a resized mobile viewport (`preview_resize` mobile) confirm cards render without tilt handlers erroring in `preview_console_logs`.

- [ ] **Step 4: Commit**

```bash
git add components/ui/tilt-card.tsx components/ui/blur-fade.tsx
git commit -m "perf: disable tilt on touch, drop animated blur from reveal"
```

---

### Task 9: Self-host fonts via `next/font`

**Files:**
- Modify: `app/layout.tsx`
- Modify: `styles/globals.css` (remove `@import`)
- Modify: `next.config.js` (tighten CSP after fonts are local)

- [ ] **Step 1: Load fonts with `next/font/google`**

In `app/layout.tsx`, add at top:
```tsx
import { Manrope, Inter } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], weight: ['500','600','700','800'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-inter', display: 'swap' })
```
Then put the variables on `<html>`:
```tsx
<html lang="en" className={`${manrope.variable} ${inter.variable}`}>
```

- [ ] **Step 2: Remove the render-blocking `@import` and repoint the CSS var stacks**

In `styles/globals.css`, delete line 1 (the `@import url('https://fonts.googleapis.com...')`). The site references fonts as literal `'Manrope, sans-serif'` / `'Inter, sans-serif'` strings (design tokens `T` in `app/page.tsx` and inline styles), so add fallbacks in `:root` and update `body`:
```css
body { font-family: var(--font-inter), 'Inter', system-ui, sans-serif; }
```
Font family strings elsewhere (`Manrope, sans-serif`) still resolve because `next/font` registers the family name; no need to rewrite every inline style.

- [ ] **Step 3: Tighten CSP (fonts are now first-party)**

In `next.config.js` `securityHeaders`, drop `https://fonts.googleapis.com` from `style-src` and `https://fonts.gstatic.com` from `font-src`.

- [ ] **Step 4: Verify**

Run: `npm run build` → PASS. In preview, confirm headings/body still render in Manrope/Inter (`preview_inspect` a heading's `font-family`), and `preview_console_logs` shows no font/CSP errors.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx styles/globals.css next.config.js
git commit -m "perf: self-host Manrope/Inter via next/font, remove blocking @import, tighten CSP"
```

---

### Task 10: Shrink oversized images

**Files:** `public/officers/*`, `public/armaan.png`, `public/yba-mark.svg`

- [ ] **Step 1: Re-encode officer photos and `armaan.png` to reasonable sizes**

These display at ~64–160px circles but ship at 200–325 KB. Re-encode with `sharp` (already a dep) to width 512, quality 80, as `.webp`. Run:
```bash
cd /Users/armaanarya/YBAREPO && node -e "
const sharp=require('sharp'), fs=require('fs'), p='public/officers';
for (const f of fs.readdirSync(p)) {
  const out=p+'/'+f.replace(/\.(png|jpg|jpeg)$/i,'.webp');
  sharp(p+'/'+f).resize(512,512,{fit:'cover'}).webp({quality:80}).toFile(out).then(()=>console.log('->',out));
}
sharp('public/armaan.png').resize(512).webp({quality:80}).toFile('public/armaan.webp').then(()=>console.log('-> armaan.webp'));
"
```
Then update the `photo:` paths in the officers data (`app/page.tsx:272-274` and nearby) and `armaan.png` reference to the new `.webp` files, and `git rm` the old heavy originals.

- [ ] **Step 2: Investigate `yba-mark.svg` (83 KB)**

Run: `grep -c 'base64' public/yba-mark.svg`. If it contains an embedded raster (base64), export a clean vector or a small optimized PNG and replace the navbar `<Image src="/yba-mark.svg" .../>` references (`resizable-navbar.tsx:71,115`). If it's genuinely vector, run it through SVGO: `npx svgo public/yba-mark.svg`.

- [ ] **Step 3: Verify**

Run: `npm run build` → PASS. In preview, confirm officer photos and the nav logo still render crisply (`preview_screenshot`). Confirm no 404s in `preview_network`.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "perf: re-encode officer/hero images to webp and optimize logo"
```

---

## PHASE 4 — Curriculum → Medium articles

### Task 11: Live Medium article list on the Curriculum page

**Files:**
- Create: `app/api/articles/route.ts`
- Modify: `app/page.tsx` (`CurriculumPage`, remove fake `MODULES` + `ModuleDetailPage` + dead email input)

- [ ] **Step 1: Add a cached RSS→JSON route (no XML entity expansion — regex parse, avoids XXE)**

Create `app/api/articles/route.ts`:
```ts
import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1h

const FEED = 'https://medium.com/feed/youth-blockchain-association'
const PUBLICATION = 'https://medium.com/youth-blockchain-association'

// Curated fallback so the page NEVER renders empty if the feed is unreachable.
const FALLBACK = [
  {
    title: 'What is Blockchain? (For Teens)',
    author: 'Sumedh Seetharaman',
    link: 'https://medium.com/youth-blockchain-association/what-is-blockchain-for-teens-c24d9a85fee1',
    date: '2026-07-01',
    excerpt: 'An introduction to blockchain for teens — the real-world problems it solves and why decentralized record-keeping matters.',
  },
]

type Article = { title: string; author: string; link: string; date: string; excerpt: string }

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))
  if (!m) return ''
  return m[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim()
}

export async function GET() {
  try {
    const res = await fetch(FEED, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`feed ${res.status}`)
    const xml = await res.text()
    const items = xml.split('<item>').slice(1)
    const articles: Article[] = items.map(raw => {
      const block = raw.split('</item>')[0]
      const excerpt = pick(block, 'content:encoded') || pick(block, 'description')
      return {
        title: pick(block, 'title'),
        author: pick(block, 'dc:creator'),
        link: (pick(block, 'link') || PUBLICATION).split('?')[0],
        date: pick(block, 'pubDate'),
        excerpt: excerpt.slice(0, 200),
      }
    }).filter(a => a.title && a.link)

    return NextResponse.json({ articles: articles.length ? articles : FALLBACK, publication: PUBLICATION })
  } catch (err) {
    console.error('[articles]', err)
    return NextResponse.json({ articles: FALLBACK, publication: PUBLICATION })
  }
}
```

- [ ] **Step 2: Rewrite `CurriculumPage` to fetch + render real articles**

Replace `CurriculumPage` (`app/page.tsx:934-1010`). Keep the FAQ accordion block at the end; replace the module list + dead email input with the article list. New body (uses existing `BlurFade`, `Badge`, `TextStagger`, `AnimatedAccordion`, `T` tokens already in scope):
```tsx
function CurriculumPage() {
  const [articles, setArticles] = useState<{title:string;author:string;link:string;date:string;excerpt:string}[]>([])
  const PUB = 'https://medium.com/youth-blockchain-association'

  useEffect(() => {
    fetch('/api/articles').then(r => r.json()).then(d => setArticles(d.articles ?? [])).catch(() => {})
  }, [])

  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Learn on Medium</Badge>
        <TextStagger text="Read. Learn. Build." as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }} />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
          Our curriculum lives as a growing library of articles on Medium — written by YBA students, for students. Start with the fundamentals and follow along as we publish more.
        </p>
        <a href={PUB} target="_blank" rel="noopener noreferrer"
          onClick={() => track('button_click', 'curriculum', { button: 'medium_publication' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem' }}>
          Visit our Medium publication
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </a>
      </BlurFade>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '2.5rem' }}>
        {articles.map((a, i) => (
          <BlurFade key={a.link} inView delay={0.1 + i * 0.06} yOffset={8}>
            <a href={a.link} target="_blank" rel="noopener noreferrer"
              onClick={() => track('button_click', 'curriculum', { button: 'article', title: a.title })}
              style={{ display: 'block', padding: '1.5rem 1.75rem', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, transition: 'border-color 0.18s, transform 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = '' }}>
              <h3 style={{ fontFamily: T.manrope, fontSize: '1.25rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em' }}>{a.title}</h3>
              <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.6, marginTop: '0.5rem' }}>{a.excerpt}</p>
              <span style={{ fontFamily: T.inter, fontSize: '0.75rem', color: T.muted, opacity: 0.7, marginTop: '0.75rem', display: 'inline-block' }}>{a.author}</span>
            </a>
          </BlurFade>
        ))}
        {articles.length === 0 && (
          <p style={{ fontFamily: T.inter, color: T.muted }}>Loading articles…</p>
        )}
      </div>

      {/* FAQ — keep exactly as the current CurriculumPage has it */}
      <BlurFade inView delay={0.1} yOffset={10}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginTop: 'clamp(3rem,6vw,5rem)', marginBottom: '0.875rem' }}>Common questions</p>
        <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>What students ask us most.</h2>
      </BlurFade>
      <BlurFade inView delay={0.2} yOffset={12}>
        <AnimatedAccordion
          items={[
            { question: 'Who is YBA for?', answer: 'High school students (grades 9–12) curious about blockchain, decentralized finance, and the broader Web3 industry. No prior technical background required — we meet you where you are.' },
            { question: 'Is there a cost to participate?', answer: 'No. YBA is free to join. We are funded through partner sponsorships and grants so the program stays accessible to every student.' },
            { question: 'Do I need to know how to code?', answer: 'No coding experience is required.' },
            { question: 'What happens after I apply?', answer: 'We\'ll reach out soon with a schedule for events, podcasts, and meetings. For now, everything is on Sundays.' },
          ]}
          style={{ maxWidth: 760 }}
        />
      </BlurFade>
    </section>
  )
}
```

- [ ] **Step 3: Delete the dead module code**

Remove the module-scope `MODULES` array (`app/page.tsx:782`) and the `ModuleDetailPage` component (`app/page.tsx:875-932`) — both are now unused. Also remove the in-component `MODULES` duplicate (`app/page.tsx:183`) and, if the `CurriculumPreview`/scroll-reveal section that renders those fake modules (`app/page.tsx:193-260` region) is now meaningless, replace its module map with a short teaser + the same "Visit our Medium publication" link (do **not** leave references to `MODULES`). Grep to confirm zero remaining `MODULES` references: `grep -n "MODULES\|ModuleDetailPage" app/page.tsx` → expect no matches.

- [ ] **Step 4: Verify (feed + fallback + backend intact)**

Run: `npm run build` → PASS (fails if any `MODULES`/`ModuleDetailPage` reference remains — remove it).
In preview, open Curriculum: the real article "What is Blockchain? (For Teens)" renders and links to Medium (`preview_snapshot` to confirm the link href). Then simulate feed failure by temporarily blocking network / setting a bad FEED url → confirm the FALLBACK article still shows. Re-confirm `/api/signup` still returns `{ ok: true }` (backend untouched).

- [ ] **Step 5: Commit**

```bash
git add app/api/articles/route.ts app/page.tsx
git commit -m "feat: replace fake curriculum modules with live Medium articles + cached RSS route"
```

---

## PHASE 5 — Final verification

### Task 12: Whole-site verification, reviews, and PR

**Files:** none (verification)

- [ ] **Step 1: Clean production build**

Run: `npm run build` → PASS with no new warnings/errors.

- [ ] **Step 2: Run the diff-scoped review commands (now they have something to scan)**

Run `/security-review` and `/code-review high` against the branch diff. Triage findings; fix any Critical/High inline and commit. (This is where these commands are actually useful — on the real change-set.)

- [ ] **Step 3: End-to-end backend smoke test**

Against `npm run start`: submit a real registration → row appears in Supabase `signups`; navigate pages → `analytics` rows appear; flood test → `429` after the cap.

- [ ] **Step 4: Perf spot-check**

In preview, scroll Home top-to-bottom on desktop and on `preview_resize` mobile — confirm it's smooth and `preview_console_logs` is clean. Optionally run Lighthouse and record before/after Performance scores.

- [ ] **Step 5: Confirm every reported complaint is resolved**

- [ ] No purple bar at top; legend is not violet.
- [ ] No white glow on hover anywhere.
- [ ] All headings flow in smoothly (no per-letter typewriter).
- [ ] Curriculum shows real Medium articles, all linked to Medium.
- [ ] Signup + analytics still work.
- [ ] Scrolling is noticeably smoother.

- [ ] **Step 6: Push and open PR**

```bash
git push -u origin prod-hardening
gh pr create --title "Production hardening: security, performance, UX fixes, Medium curriculum" --body "See docs/AUDIT-REPORT.md and docs/superpowers/plans/2026-07-01-yba-production-hardening.md"
```
Then remind the user to complete the **manual Supabase RLS steps** in `docs/SUPABASE-RLS.md` and set `SUPABASE_SERVICE_ROLE_KEY` in Vercel — those cannot be done from code.

---

## Self-review notes (author checklist run)

- **Spec coverage:** purple bar (Task 4), white glow (Task 5), text animation (Task 6), curriculum→Medium + backend intact (Task 11 + verify steps), lag (Tasks 7–10), security/"exposed keys" (Tasks 1–3 + RLS doc). ✓
- **"Exposed API keys":** confirmed none are hardcoded in the repo; the real risk is RLS on the public anon key (Task 1 + `docs/SUPABASE-RLS.md`). ✓
- **Type consistency:** `TextStagger`, `GlowCard`, `BlurFade` keep their existing prop names so call sites don't break; `supabaseServer` imported under local alias `supabase` in both routes. ✓
- **No placeholders:** every code step has concrete code; design-judgment steps (tilt gating, curriculum teaser) point at an exact existing pattern to copy. ✓
- **Known follow-ups (not blocking):** move rate-limiter to Vercel KV for multi-instance correctness; add an authenticated admin view (must escape stored fields per A6); move personal contact info to a role address.

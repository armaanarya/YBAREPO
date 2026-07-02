# YBA Website — Production Readiness Audit

**Repo:** `armaanarya/YBAREPO` (`yba-website`, Next.js 16 / React 18 / TypeScript / Tailwind + framer-motion + Lenis + Supabase)
**Audited:** 2026-07-01
**Scope:** Full codebase — security, performance, correctness, and the specific UX defects reported.

> **Methodology note.** `/ultrareview` and `/code-review ultra` are billed, user-triggered cloud reviews I cannot launch. `/code-review` and `/security-review` only scan the *pending working-tree diff*, so on a clean checkout they have nothing to report — they belong in the execution phase (run them per change-set before committing). This report is a manual full-codebase audit covering the same ground and more. `/claude-api-cost-optimization` does not apply to the site (it never calls the Claude API); it applies only to how the execution session is run.

---

## Severity legend

| Level | Meaning |
|-------|---------|
| 🔴 **Critical** | Exploitable now, or exposes minors' PII. Fix before/at launch. |
| 🟠 **High** | Real abuse/cost/perf risk in production. Fix soon. |
| 🟡 **Medium** | Should fix; degrades quality, cost, or resilience. |
| 🟢 **Low** | Polish / hygiene. |

---

## A. Security

### A1 🔴 Supabase Row-Level Security is the whole ballgame — verify it
`lib/supabase.ts` builds the client from `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Those are **shipped in the browser bundle** — that is by design for the anon key, *but only safe if Row-Level Security (RLS) is enabled with strict policies on every table.*

The `signups` table stores **minors' PII**: full name, email, school, grade. If RLS is off (or has a permissive `SELECT`/`ALL` policy), anyone who opens DevTools, copies the anon key, and calls the Supabase REST endpoint directly can **dump the entire signups table** — names, emails, and schools of high-school students. This bypasses the API route entirely.

- **Cannot be confirmed from the repo** — it lives in the Supabase dashboard. **This is the #1 action item.**
- Required policies:
  - `signups`: **no** anon `SELECT`; anon `INSERT` only (or, better, revoke anon insert too — see A2).
  - `analytics`: anon `INSERT` only, no `SELECT`.
  - Reads happen only via the service-role key on the server.

### A2 🟠 Server routes use the public anon key, not a service-role key
Both `app/api/signup/route.ts` and `app/api/analytics/route.ts` import the same `NEXT_PUBLIC` anon client. Consequences:
- Writes depend on a **permissive anon INSERT policy**, which also lets any visitor insert directly to Supabase, **bypassing the validation** in the route (email check, field trimming, event allow-list).
- The correct pattern: a **server-only** Supabase client using `SUPABASE_SERVICE_ROLE_KEY` (never `NEXT_PUBLIC_`), and RLS that denies anon writes so the *only* path in is the validated route.

### A3 🟠 No rate limiting on either API route
`/api/signup` and `/api/analytics` accept unlimited unauthenticated POSTs. A trivial script can:
- Flood `analytics` with millions of rows → Supabase storage/egress cost, degraded queries.
- Spam `signups` with junk registrations.
No IP throttle, no per-session cap, no bot check.

### A4 🟠 No bot protection / CAPTCHA on the registration form
`app/page.tsx` registration posts straight to `/api/signup`. Combined with A3, the signup table is open to automated garbage. At minimum add a honeypot field; ideally a lightweight challenge (Cloudflare Turnstile).

### A5 🟡 No input length limits → unbounded storage / abuse
`route.ts` trims strings but caps nothing. `build_idea` (a free-text `<textarea>`) and `analytics.metadata` (arbitrary JSON, stored as-is: `metadata ?? null`) accept payloads of any size. An attacker can push multi-MB rows. Add server-side length caps (e.g. name ≤ 120, email ≤ 254, school ≤ 200, build_idea ≤ 2000, metadata serialized ≤ 4 KB).

### A6 🟡 Stored-data is never sanitized on write (latent stored-XSS)
The data is safe *today* only because nothing renders it back into a page. The moment an admin dashboard displays `name`/`build_idea` without escaping, unsanitized input becomes stored XSS. Since a dashboard is the obvious next feature, strip/limit control characters on write now.

### A7 🟠 No security headers (CSP, framing, MIME, referrer, HSTS)
`next.config.js` and `vercel.json` set **no** `headers()`. The site is:
- **Clickjackable** (no `X-Frame-Options` / `frame-ancestors`).
- Missing `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`.
Add a `headers()` block in `next.config.js`.

### A8 🟢 Personal contact details as the org's identity
`app/page.tsx` contact section hard-codes a personal Gmail (`armaanarya100@gmail.com`) and a personal mobile (`(408) 603-4164`) as the public YBA contact, and that Gmail is presumably where signups land. Fine for a demo; for production, move to a role address (e.g. `hello@ybanetwork.org`) so personal accounts aren't exposed to scraping.

### Injection classes — **cleared** (stated explicitly so it's on record)
- **SQL injection:** N/A. All DB access goes through `supabase.from(...).insert(...)`, which parameterizes. No raw SQL, no string-built queries.
- **Command / code injection:** N/A. No `exec`, `spawn`, `eval`, `child_process`, or dynamic `Function`.
- **Path traversal / file access:** N/A. No user input reaches the filesystem.
- **SSRF / open redirect:** N/A. No server-side fetch of user-supplied URLs; no redirect built from input.
- **XXE:** N/A. No XML parsing (the Medium RSS parser added in the plan must be configured without entity expansion — noted in the plan).
- **ReDoS:** Low. The one regex (email) is linear and bounded once A5 length caps land.
- **Insecure deserialization:** N/A. Only `JSON.parse`/`res.json()` on request bodies.
- **Weak crypto / JWT alg confusion:** N/A. No custom crypto or JWT verification in-app (Supabase handles tokens).
- **Cache poisoning / encoding confusion:** Low, once A7 headers + explicit `Cache-Control` land.

**Net:** the real security surface here is **data protection (RLS + service-role) and abuse control (rate limit + bot + size caps + headers)** — not classic injection.

---

## B. Performance — why it's laggy

The lag is not one bug; it's **many always-on, main-thread animation systems layered on top of each other**, plus a heavy first load. Ranked by impact:

### B1 🔴 Lenis smooth-scroll + multiple framer-motion scroll springs run simultaneously
- `LenisProvider` runs a `requestAnimationFrame` loop **every frame, forever** (`components/ui/lenis-provider.tsx`).
- On top of that, **many** components independently subscribe to scroll via framer-motion:
  - `ScrollProgress` — `useScroll` + `useSpring` (the purple bar).
  - `YBANav` — `useScroll` + `useMotionValueEvent`.
  - `GradientSurge` — `useScroll` + 2× `useTransform`.
  - `HorizontalPinned` — `useScroll` + `useTransform` (**instantiated twice on Home**, plus About).
  - `ParallaxLayer` — `useScroll` + `useTransform` (multiple instances).
  - `ScrollLegend` — its own `scroll` listener recomputing `offsetTop` for every section on every scroll event (layout reads → thrash).
Every scroll frame wakes all of these. Lenis synthesizes scroll frames continuously during momentum, so the whole stack churns even after the user stops touching the wheel. **This is the primary lag source.**

### B2 🟠 Per-element `mousemove` + `getBoundingClientRect` handlers on many cards
`GlowCard`, `TiltCard`, and `MagneticButton` each attach `onMouseMove` that calls `getBoundingClientRect()` on every pointer move. The Home page renders **6+ pillar/officer cards**, each wrapped in `TiltCard` + `GlowCard`. Moving the mouse across the grid fires layout-reading handlers on multiple elements per frame → jank. (`HeroSpotlight` and `CustomCursor` add global `mousemove` listeners too — but see D1, they're dead code.)

### B3 🟠 `HorizontalPinned` uses 300vh pinned scroll runways — twice on Home
Each `HorizontalPinned` reserves `height: 300vh` and drives a `sticky` translate off scroll progress. Two of these on Home means ~6 extra viewport-heights of scroll math and a large composited, translating layer. Expensive on mid/low-end devices and the usual culprit for "scroll feels stuck/heavy."

### B4 🟠 First-load weight: giant client bundle + heavy libs + unoptimized images
- The **entire site is one 1,444-line `'use client'` component** (`app/page.tsx`). Nothing server-renders; everything hydrates on the client → large JS execution before interactive.
- Ships **framer-motion** (large) + **Lenis** to every visitor.
- **Images are heavy source files:** `public/officers/anay.png` 325 KB, `arnav.png` 281 KB, `zeqi.jpg` 293 KB, etc. (~1.5 MB of officer photos), plus `armaan.png` 300 KB and **`yba-mark.svg` at 83 KB** (an SVG that large is almost certainly an embedded raster — it's loaded in the navbar via `next/image`). Next.js image optimization is enabled (good), but the SVG bypasses it and the source PNGs are far larger than needed.

### B5 🟡 `blur()` filter animations on many elements
`BlurFade` animates `filter: blur(6px) → blur(0)` and is wrapped around **every** curriculum row, officer card, and section. Animated blur is one of the most expensive filters to composite; multiplied across a page it stutters the reveal. The blur was already removed from page transitions (see git log) — the same treatment should extend to `BlurFade`'s default.

### B6 🟡 `backdrop-filter: blur()` on scroll-reactive surfaces
The navbar animates `backdropFilter` between `blur(0)` and `blur(16px)` on scroll; the accordion and glass cards also use `backdrop-filter`. Backdrop blur forces per-frame re-rasterization of everything behind it — costly while the value is *animating* on scroll.

### B7 🟢 Google Fonts via CSS `@import` (render-blocking)
`styles/globals.css` line 1 imports Manrope+Inter through a blocking `@import url(fonts.googleapis.com...)`. This blocks first paint and adds a third-party round-trip. Should use `next/font` (self-hosted, preloaded, zero layout shift).

### B8 🟢 `GridPattern` rendered twice on Home
Once in the hero, once inside a `ParallaxLayer`. Two animated grid layers where one would do.

---

## C. Reported UX defects (exact locations)

### C1 The "letters open one-by-one" text animation → wants a quick, smooth flow-in
**Cause:** `TextStagger` in `components/ui/hero-animated.tsx` splits each heading into **words → individual characters**, and animates every character as a separate `motion.span` with `staggerChildren` (per-char slide-up from 100% + opacity). That's the letter-by-letter typewriter reveal, used on the Home hero (`stagger 0.03`), Curriculum (`0.025`), Register success (`0.04`), etc.
**Fix direction:** replace per-character staggering with a single smooth block fade/rise (one motion element per heading, ~0.4–0.5s, `easeOut`, small y-offset, no blur). Apply consistently to every heading site-wide. (Design decision — run through `ui-ux-pro-max` during execution.)

### C2 Purple scroll bar at the top → remove entirely
**Cause:** `<ScrollProgress />` mounted in `app/layout.tsx:35`. The component (`components/ui/scroll-progress.tsx`) draws a `position: fixed` full-width bar with `linear-gradient(90deg, #6366f1, #a855f7, #ec4899)` (indigo→purple→pink) and a purple `boxShadow`.
**Fix:** remove the mount from `layout.tsx` and delete the component. **Also** note the **`ScrollLegend`** left-edge indicator defaults to `activeColor = '#a78bfa'` (violet) — the same purple family the user is rejecting. Recolor it to the theme's `#eeeeff`.

### C3 White glow on hover → remove
**Cause:** `GlowCard` (`components/ui/glow-card.tsx`) renders a cursor-following `radial-gradient(rgba(238,238,255,0.18), transparent)` that fades in on hover. Used at `app/page.tsx:393` (pillars), `:574` (officers), `:1336` (contact/podcast card). That is the white glow.
**Fix:** remove the glow layer (keep the card as a plain container, or drop `GlowCard` for a static `div`). `HoverGlowButton` is already glow-free despite the name. `HeroSpotlight`'s white radial and `CustomCursor`'s white dot also produce white glows **but are not mounted anywhere** (dead code — delete, see D1).

### C4 Curriculum page: replace fake "modules" with the real Medium articles, linked
**Current:** `CurriculumPage` (`app/page.tsx:934`) lists **6 invented modules** from a hard-coded `MODULES` array (`:782`), each opening a fake `ModuleDetailPage` with placeholder content. There's also a dead "Get Notified" email input (`:979`) with no handler.
**Reality:** the Medium publication (`https://medium.com/youth-blockchain-association`) currently has **one** live article:
- **"What is Blockchain? (For Teens)"** — Sumedhseetharaman — <https://medium.com/youth-blockchain-association/what-is-blockchain-for-teens-c24d9a85fee1>
**Fix direction:** replace the modules with a real article list that links out to Medium (`target="_blank" rel="noopener noreferrer"`) and to the publication itself, and make it **auto-update** as they publish — a cached server-side fetch of the Medium RSS (`https://medium.com/feed/youth-blockchain-association`) with a hard-coded fallback so it never renders empty. Also remove/repurpose the dead email input. (Detailed in the plan.)

### C5 "Make sure the backend still works"
The Supabase signup + analytics flow must remain functional through all changes. The plan keeps `/api/signup` and `/api/analytics` intact (only *hardening* them) and adds `/api/articles` for the Medium feed. A post-change verification step exercises a real signup end-to-end.

---

## D. Correctness, dead code & quality

### D1 🟡 Dead components shipped in the tree
- `components/ui/custom-cursor.tsx` — **never imported/mounted.** Adds a global `mousemove` listener + white blend-difference dot *if it were used.* Delete.
- `HeroSpotlight` (in `hero-animated.tsx`) — **never used.** Global `mousemove` white spotlight. Delete.
- `GradientSurge` (`components/ui/gradient-surge.tsx`) — **never imported** in `page.tsx`. Delete or wire intentionally.
Removing dead code shrinks the bundle and removes latent white-glow/listeners.

### D2 🟡 Duplicate `MODULES` definitions
`MODULES` is declared **twice**: once inside a component around `app/page.tsx:183` (curriculum-preview reel) and again at module scope `:782`. Confusing and error-prone; consolidate (and C4 removes the fake data anyway).

### D3 🟢 Dead / non-functional UI
- Curriculum "Get Notified" email input (`:979`) — no state, no submit, no handler. Purely decorative; either wire it to `/api/signup`-style capture or remove.

### D4 🟢 `console.error` left in API routes
`route.ts` logs raw Supabase errors server-side. Harmless (server logs only) but noisy; consider structured logging or gating on non-prod.

### D5 🟢 `next/font` not used; `html` has no font strategy
Combined with B7 — migrating to `next/font/google` fixes both the render-block and the missing `font-display` strategy.

---

## E. Priority order for execution

1. **A1 (verify RLS) + A2 (service-role) + A7 (headers)** — data protection for minors' PII. Non-negotiable for launch.
2. **B1–B3 performance** — the lag the user feels most: trim the scroll-animation stack, cut per-element mousemove handlers, reduce/limit pinned runways.
3. **C2 (purple bar) + C3 (white glow) + C1 (text animation)** — the visible complaints; fast wins.
4. **A3–A6 abuse hardening** — rate limit, honeypot, size caps, sanitize.
5. **C4 (curriculum → Medium)** — feature rebuild.
6. **B4–B8 + D1–D5** — bundle/image/font optimization and cleanup.

Full step-by-step in `docs/superpowers/plans/2026-07-01-yba-production-hardening.md`.

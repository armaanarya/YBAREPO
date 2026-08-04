# YBA File-Based Routing Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the YBA site from a single-URL client-side SPA into real Next.js App Router file-based routes, so every page has its own shareable URL, its own `<title>`/OG metadata, and is independently indexable by search engines.

**Architecture:** `app/page.tsx` (~1900 lines) currently holds all nine pages as separate functions switched by `useState<Page>`. Each page function moves into its own route folder as a co-located `view.tsx` client component, wrapped by a thin server `page.tsx` that exports per-route `metadata`. Shared chrome (nav, footer, Lenis) lifts into `app/layout.tsx` so it never remounts. The two articles gain real `/articles/<slug>` URLs via a dynamic route with `generateStaticParams`.

**Tech Stack:** Next.js 16.2.4 (App Router), React 18.3, TypeScript, framer-motion 11, Lenis 1.3.

**Testing note:** This repo has no test framework (`package.json` scripts are only `dev`/`build`/`start`). Adding one is out of scope for this refactor. Verification per task is therefore `npx tsc --noEmit`, `npm run build`, and browser checks against the dev server — stated explicitly with expected output at each step.

**Refactor note:** This is predominantly a *code move*, not a rewrite. Steps that relocate existing code cite exact source line ranges in the pre-refactor `app/page.tsx` rather than reproducing hundreds of unchanged lines. Steps that write *new* code show that code in full.

---

## Two constraints discovered during recon

These are non-obvious and drive design decisions below. Do not "simplify" past them.

1. **`components/ui/scroll-legend.tsx:75` uses `position: fixed`**, and `ScrollLegend` renders inside `HomePage`. A CSS `transform` on any ancestor creates a containing block and would re-anchor it from the viewport to that ancestor, visibly breaking it. Therefore `app/template.tsx` **animates `opacity` only** — never `y`/`translate`. The old `PAGE_TRANSITIONS` used `y: 14`; that is deliberately dropped.

2. **Lenis owns scroll position.** `LenisProvider` creates the instance inside a `useEffect` and never exposes it. Next's built-in scroll-to-top on navigation calls `window.scrollTo`, but Lenis keeps its own `animatedScroll` value and will snap back — so every navigation would land mid-page. The provider must therefore hold the instance in a ref and reset it explicitly on `pathname` change. Lenis bails out early for reduced-motion and coarse-pointer devices, so the reset needs a `window.scrollTo` fallback for those cases.

---

## File Structure

### New shared modules

| File | Responsibility |
|---|---|
| `lib/theme.ts` | `T` design tokens + `pressHandlers`. Imported by every view. |
| `lib/site-nav.ts` | `NAV_LINKS` as `{ label, href }`. Single source for nav + footer + sitemap. |
| `lib/articles.ts` | `ArticleMeta` type, `ARTICLES`, `MEDIUM_PUB`. **Must stay server-importable** (no `'use client'`, no React) — `generateMetadata` and `sitemap.ts` both read it. |
| `components/site/badge.tsx` | `Badge` |
| `components/site/section-heading.tsx` | `SectionHeading` |
| `components/site/spinning-logo.tsx` | `SpinningLogo` (carries the ~84KB inline SVG on one line) |
| `components/site/site-footer.tsx` | Footer, `<Link>`-based, self-hides on `/register` via `usePathname` |
| `components/site/route-effects.tsx` | Fires `track('page_view', …)` on pathname change |
| `components/articles/blockchain-for-teens.tsx` | Article body, `<Link>` back instead of `onBack` |
| `components/articles/what-is-bitcoin.tsx` | Article body, `<Link>` back instead of `onBack` |

### Route files

Each route is a **server** `page.tsx` (exports `metadata`, renders the view) plus a co-located **client** `view.tsx`. This split is required: `export const metadata` is illegal in a `'use client'` module, and every view needs framer-motion hooks.

| Route | Files | Source lines in old `app/page.tsx` |
|---|---|---|
| `/` | `app/page.tsx`, `app/view.tsx` | `PILLARS`/`CHIPS` 242–248, `ScrollRevealSection` 177–239, `HomePage` 263–445 |
| `/about` | `app/about/{page,view}.tsx` | `OFFICERS`/`TEAM_ACCENT` 249–261, `YEAR_ONE` 448–454, `AboutPage` 456–674 |
| `/curriculum` | `app/curriculum/{page,view}.tsx` | consts 827–829, `YBACalendar` 831–916, `CurriculumPage` 918–960 |
| `/hackathon` | `app/hackathon/{page,view}.tsx` | consts 677–688, `HackathonPage` 690–824 |
| `/institutions` | `app/institutions/{page,view}.tsx` | `Partner`/`PARTNERS` 963–991, `PartnerCard` 993–1060, `InstitutionsPage` 1062–1160 |
| `/articles` | `app/articles/{page,view}.tsx` | `ArticlesPage` list portion 1199–1260 |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | bodies 1262–1355, 1357–1487 → `components/articles/` |
| `/podcast` | `app/podcast/{page,view}.tsx` | `PodcastPage` 1489–1544 |
| `/register` | `app/register/{page,view}.tsx` | `RegisterPage` 1546–1747 |
| `/contact` | `app/contact/{page,view}.tsx` | `CONTACT_METHODS` 1750–1821, `ContactPage` 1823–1896 |

### Modified / new infrastructure

- `app/layout.tsx` — mounts `SiteNav`, `<main>`, `SiteFooter`, `RouteEffects`
- `app/template.tsx` — **new**, opacity-only enter animation
- `app/sitemap.ts` — **new**
- `app/robots.ts` — **new**
- `components/ui/resizable-navbar.tsx` — `href`-based, `usePathname`, `<Link>`
- `components/ui/lenis-provider.tsx` — instance ref + scroll reset on route change

### Deleted

- The `Page` union type, `NAV_LINKS`'s `page` field, `PAGE_TRANSITIONS`, `App()`, and every `nav: (p: Page) => void` prop. All nine `nav('x')` call sites (lines 135, 227, 321, 335, 432, 1145, 1617) become `<Link>` or `useRouter().push`.

---

## Task 1: Extract shared modules

**Files:** Create `lib/theme.ts`, `lib/site-nav.ts`, `lib/articles.ts`, `components/site/badge.tsx`, `components/site/section-heading.tsx`, `components/site/spinning-logo.tsx`

- [ ] **Step 1: Create `lib/theme.ts`** — move `T` (old lines 24–46) and `pressHandlers` (48–53) verbatim, adding `export` to each. Add `import type React from 'react'` for the `pressHandlers` event types.

- [ ] **Step 2: Create `lib/site-nav.ts`** with hrefs replacing the `page` field:

```ts
export type NavLink = { label: string; href: string }

export const NAV_LINKS: NavLink[] = [
  { label: 'Home',         href: '/' },
  { label: 'About',        href: '/about' },
  { label: 'Curriculum',   href: '/curriculum' },
  { label: 'Hackathon',    href: '/hackathon' },
  { label: 'Institutions', href: '/institutions' },
  { label: 'Articles',     href: '/articles' },
  { label: 'Podcast',      href: '/podcast' },
  { label: 'Contact',      href: '/contact' },
]
```

- [ ] **Step 3: Create `lib/articles.ts`** — move `ArticleMeta` (1166–1169), `ARTICLES` (1171–1192), and `MEDIUM_PUB` (1163) verbatim with `export`. **Do not add `'use client'`** and do not import React here; `sitemap.ts` and `generateMetadata` are server-side consumers.

- [ ] **Step 4: Create the three presentational components** — `Badge` (151–163), `SectionHeading` (165–175), `SpinningLogo` (56–73), each with `'use client'` omitted (they are pure and get bundled into whichever client parent imports them), `export` added, and `import { T } from '@/lib/theme'`.

- [ ] **Step 5: Verify it compiles standalone**

Run: `npx tsc --noEmit`
Expected: PASS. The old `app/page.tsx` still has its own copies at this point, so nothing is broken yet — this step only proves the new modules are internally valid.

- [ ] **Step 6: Commit**

```bash
git add lib/theme.ts lib/site-nav.ts lib/articles.ts components/site
git commit -m "refactor: extract shared theme, nav, and article modules"
```

---

## Task 2: Convert the navbar to href-based routing

**Files:** Modify `components/ui/resizable-navbar.tsx`

- [ ] **Step 1: Replace the props contract.** Delete the local `Page` type (line 14) and `NavItem` (16). New contract:

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavLink } from '@/lib/site-nav'

interface YBANavProps { items: NavLink[]; className?: string }
```

- [ ] **Step 2: Derive active state from the pathname.** Inside `YBANav`, replace the `currentPage`/`onNavigate` props with:

```tsx
const pathname = usePathname()
const isActive = (href: string) =>
  href === '/' ? pathname === '/' : pathname.startsWith(href)
```

`startsWith` is deliberate: it keeps **Articles** highlighted while reading `/articles/<slug>`. The `href === '/'` special case stops Home matching every route.

- [ ] **Step 3: Swap every nav `<button>` for `<Link>`.** Logo → `<Link href="/">`, CTA → `<Link href="/register">`, desktop links and mobile menu items → `<Link href={item.href}>`. Keep all existing className/style/framer-motion `layoutId` values exactly as they are so the hover pill and active pill animations survive.

- [ ] **Step 4: Close the mobile menu on navigation.** `<Link>` does not unmount the menu, so add both an explicit handler and a pathname watcher (the watcher covers back/forward navigation):

```tsx
useEffect(() => { setMobileOpen(false) }, [pathname])
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit`
Expected: Errors **only** in `app/page.tsx` (it still passes the removed `currentPage`/`onNavigate` props). That is expected mid-refactor and is fixed in Task 4. No errors inside `resizable-navbar.tsx` itself.

- [ ] **Step 6: Commit**

```bash
git add components/ui/resizable-navbar.tsx
git commit -m "refactor: make navbar href-based with usePathname"
```

---

## Task 3: Lift shared chrome into the layout

**Files:** Modify `app/layout.tsx`, `components/ui/lenis-provider.tsx`; create `components/site/site-nav.tsx`, `components/site/site-footer.tsx`, `components/site/route-effects.tsx`, `app/template.tsx`

- [ ] **Step 1: Create `components/site/site-nav.tsx`** — a one-line client wrapper so the server layout stays a server component:

```tsx
'use client'
import { YBANav } from '@/components/ui/resizable-navbar'
import { NAV_LINKS } from '@/lib/site-nav'

export function SiteNav() { return <YBANav items={NAV_LINKS} /> }
```

- [ ] **Step 2: Create `components/site/site-footer.tsx`** — move `Footer` (old 88–148), replacing the `nav` prop with `<Link>`, and self-hiding on `/register` to preserve current behaviour (`{page !== 'register' && <Footer/>}`):

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// …T, NAV_LINKS imports

export function SiteFooter() {
  const pathname = usePathname()
  if (pathname === '/register') return null
  // …existing markup; NAV_LINKS.map -> <Link href={l.href}>,
  //    "Join YBA →" button -> <Link href="/register">
}
```

- [ ] **Step 3: Add scroll reset to `components/ui/lenis-provider.tsx`.** Hold the instance in a ref and reset on route change. Without this, navigation lands mid-page (see constraint 2).

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export function LenisProvider() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // …existing guards and setup, plus:
    lenisRef.current = lenis
    return () => { cancelAnimationFrame(raf); lenis.destroy(); lenisRef.current = null }
  }, [])

  // Reset scroll on route change. Lenis owns the scroll position when active;
  // on reduced-motion and coarse-pointer devices it never initialises, so fall
  // back to the native call.
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  return null
}
```

- [ ] **Step 4: Create `components/site/route-effects.tsx`.** Preserves the existing `track('page_view', …)` telemetry. Map pathnames back to the **old** page names so the analytics table stays comparable with historical rows:

```tsx
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/track'

function pageName(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/articles/')) return `article:${pathname.slice('/articles/'.length)}`
  return pathname.slice(1)
}

export function RouteEffects() {
  const pathname = usePathname()
  useEffect(() => { track('page_view', pageName(pathname)) }, [pathname])
  return null
}
```

- [ ] **Step 5: Create `app/template.tsx`.** `template.tsx` (unlike `layout.tsx`) remounts per navigation, which is what gives the enter animation. **Opacity only** — see constraint 1.

```tsx
'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 6: Wire up `app/layout.tsx`.** Keep the existing `metadata` export as the site-wide default; per-route exports override it. Add `title.template` so child routes get a consistent suffix:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://joinyba.org'),
  title: {
    default: 'YBA — Youth Blockchain Association',
    template: '%s — YBA',
  },
  // …rest unchanged
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <LenisProvider />
        <RouteEffects />
        <SiteNav />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
```

Note `<main id="main-content">` moves here from the old `App()`, and the nav sits **outside** `template.tsx` — so the transition wrapper never becomes an ancestor of the `position: fixed` navbar.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/template.tsx components/site components/ui/lenis-provider.tsx
git commit -m "refactor: lift nav, footer, and route effects into layout"
```

---

## Task 4: Split the nine pages into routes

**Files:** Create `app/view.tsx` + eight `app/<route>/{page,view}.tsx` pairs; rewrite `app/page.tsx`

Work one route at a time. For each, the `view.tsx` is `'use client'` and holds the moved function body with its `nav` prop removed; the `page.tsx` is a server component holding only metadata.

- [ ] **Step 1: Home.** Move `ScrollRevealSection` (177–239), `PILLARS`/`CHIPS` (242–248) and `HomePage` (263–445) into `app/view.tsx` as `export function HomeView()`. Replace its three `nav()` calls:
  - line 227 `nav('articles')` → wrap in `<Link href="/articles">`
  - line 321 `nav('register')` → `<Link href="/register">`
  - line 335 `nav('about')` → `<Link href="/about">` (button text stays "See Our Goals")
  - line 432 `nav('register')` → `<Link href="/register">`

  Where the existing element is a `<button>` inside `MagneticButton`/`HoverGlowButton`, keep the component and use `useRouter().push(...)` in its `onClick` instead of nesting a button in a link — nesting interactive elements is invalid HTML and breaks keyboard semantics.

  Then rewrite `app/page.tsx` as:

```tsx
import type { Metadata } from 'next'
import { HomeView } from './view'

export const metadata: Metadata = {
  title: 'YBA — Youth Blockchain Association',
  description: 'Empowering the next generation of blockchain builders. High school students learning DeFi, smart contracts, and real-world blockchain applications.',
  alternates: { canonical: '/' },
}

export default function Page() { return <HomeView /> }
```

- [ ] **Step 2: About.** `app/about/view.tsx` gets `OFFICERS`/`TEAM_ACCENT` (249–261), `YEAR_ONE` (448–454), `AboutPage` (456–674) as `AboutView` (no props — it had none). `app/about/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { AboutView } from './view'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Armaan Arya and the student officers building the Youth Blockchain Association — plus our vision and Year One goals.',
  alternates: { canonical: '/about' },
}

export default function Page() { return <AboutView /> }
```

- [ ] **Step 3: Curriculum.** Move 827–829, `YBACalendar` (831–916), `CurriculumPage` (918–960). Metadata title `'Curriculum'`, description `'Peer-reviewed blockchain curriculum built for high schoolers, plus our meeting calendar and frequently asked questions.'`, canonical `/curriculum`.

- [ ] **Step 4: Hackathon.** Move 677–688 and `HackathonPage` (690–824). Metadata title `'Hackathon'`, description `'The YBA Hackathon, Guest Speaker Series, and hands-on blockchain workshops for high school students.'`, canonical `/hackathon`.

- [ ] **Step 5: Institutions.** Move `Partner`/`PARTNERS` (963–991), `PartnerCard` (993–1060), `InstitutionsPage` (1062–1160). Its one `nav('contact')` call (line 1145) becomes `useRouter().push('/contact')` inside the existing `HoverGlowButton` onClick, keeping the `track()` call ahead of it. Metadata title `'Institutions'`, description `'Our partners and sponsors — the institutions bridging YBA students into the Web3 industry.'`, canonical `/institutions`.

- [ ] **Step 6: Podcast, Register, Contact.** Straight moves of 1489–1544, 1546–1747, 1750–1896. Register's `nav('home')` (line 1617) → `useRouter().push('/')`. Metadata:
  - Podcast — title `'Podcast'`, description `'The YBA podcast — conversations with builders, founders, and students in Web3.'`
  - Register — title `'Join YBA'`, description `'Apply to join the Youth Blockchain Association. Free for every high school student.'`, plus `robots: { index: true, follow: true }` (default; stated for clarity)
  - Contact — title `'Contact'`, description `'Get in touch with the Youth Blockchain Association about partnerships, sponsorship, or joining.'`

- [ ] **Step 7: Verify the eight static routes build**

Run: `npm run build`
Expected: the route table lists `○ /`, `○ /about`, `○ /curriculum`, `○ /hackathon`, `○ /institutions`, `○ /podcast`, `○ /register`, `○ /contact` as prerendered static content.

- [ ] **Step 8: Commit**

```bash
git add app
git commit -m "refactor: split SPA pages into file-based routes"
```

---

## Task 5: Give the articles real URLs

**Files:** Create `app/articles/{page,view}.tsx`, `app/articles/[slug]/page.tsx`, `components/articles/*.tsx`

This is the largest SEO win in the plan: both republished Medium articles become independently indexable pages instead of hidden component state.

- [ ] **Step 1: Move the article bodies.** `BlockchainForTeensArticle` (1262–1355) → `components/articles/blockchain-for-teens.tsx`, `WhatIsBitcoinArticle` (1357–1487) → `components/articles/what-is-bitcoin.tsx`. Both are `'use client'`. Replace the `onBack: () => void` prop and its back button with a link — the body no longer needs any props:

```tsx
<Link href="/articles" style={/* existing back-button styles */}>← All articles</Link>
```

- [ ] **Step 2: Create `app/articles/view.tsx`** from the list portion of `ArticlesPage` (1199–1260). Delete the `openSlug` state, the `show()` helper, and the `ARTICLE_COMPONENTS` early-return branch entirely — routing replaces all of it. Each card `<button onClick={show(slug)}>` becomes:

```tsx
<Link href={`/articles/${a.slug}`} onClick={() => track('button_click', 'articles', { button: 'article_open', slug: a.slug })} style={/* existing card styles */}>
```

- [ ] **Step 3: Create `app/articles/page.tsx`**

```tsx
import type { Metadata } from 'next'
import { ArticlesView } from './view'

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Blockchain articles written by YBA students, for students.',
  alternates: { canonical: '/articles' },
}

export default function Page() { return <ArticlesView /> }
```

- [ ] **Step 4: Create `app/articles/[slug]/page.tsx`.** `params` is a Promise in Next 15+ and **must be awaited**:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTICLES } from '@/lib/articles'
import { BlockchainForTeensArticle } from '@/components/articles/blockchain-for-teens'
import { WhatIsBitcoinArticle } from '@/components/articles/what-is-bitcoin'

const BODIES: Record<string, React.ComponentType> = {
  'what-is-blockchain-for-teens': BlockchainForTeensArticle,
  'what-is-bitcoin-a-guide-to-digital-money-and-decentralization': WhatIsBitcoinArticle,
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.dateISO,
      authors: [article.author],
      images: [{ url: article.image, width: article.imageW, height: article.imageH }],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const Body = BODIES[slug]
  if (!Body) notFound()
  return <Body />
}
```

- [ ] **Step 5: Verify both articles prerender**

Run: `npm run build`
Expected: the route table shows `● /articles/[slug]` with both slugs listed beneath it as prerendered paths.

- [ ] **Step 6: Commit**

```bash
git add app/articles components/articles
git commit -m "feat: give each article its own indexable URL"
```

---

## Task 6: Add sitemap and robots

**Files:** Create `app/sitemap.ts`, `app/robots.ts`

Neither exists today, so nothing currently tells a crawler what to fetch.

- [ ] **Step 1: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { NAV_LINKS } from '@/lib/site-nav'
import { ARTICLES } from '@/lib/articles'

const BASE = 'https://joinyba.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...NAV_LINKS.map(l => l.href), '/register'].map(href => ({
    url: `${BASE}${href === '/' ? '' : href}`,
    changeFrequency: 'monthly' as const,
    priority: href === '/' ? 1 : 0.8,
  }))

  const articles = ARTICLES.map(a => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.dateISO),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...pages, ...articles]
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://joinyba.org/sitemap.xml',
  }
}
```

- [ ] **Step 3: Verify both are served**

Run: `npm run build`, then against the dev server:
`curl -s localhost:3000/sitemap.xml | head -20` and `curl -s localhost:3000/robots.txt`
Expected: valid XML listing 11 URLs (8 nav + `/register` + 2 articles); robots.txt referencing the sitemap.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add sitemap and robots"
```

---

## Task 7: Full verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Typecheck and production build**

Run: `npx tsc --noEmit && npm run build`
Expected: both clean. Route table shows 10 static routes plus `/articles/[slug]` with 2 prerendered paths, `/sitemap.xml`, `/robots.txt`.

- [ ] **Step 2: Confirm the SPA scaffolding is fully gone**

Run: `grep -rn "PAGE_TRANSITIONS\|onNavigate\|currentPage\|nav('" app components | grep -v node_modules`
Expected: no output. Any hit means a `nav()` call site was missed.

- [ ] **Step 3: Walk every route in the browser.** For each of `/`, `/about`, `/curriculum`, `/hackathon`, `/institutions`, `/articles`, `/articles/what-is-blockchain-for-teens`, `/articles/what-is-bitcoin-a-guide-to-digital-money-and-decentralization`, `/podcast`, `/register`, `/contact`:
  - loads directly (deep link works — the whole point of this refactor)
  - `document.title` is route-specific, not the generic site title
  - the correct nav item shows its active pill; `/articles/<slug>` keeps **Articles** lit
  - no console errors

- [ ] **Step 4: Check the two constraint-driven regressions specifically.**
  - **Scroll reset:** scroll to the bottom of `/about`, click Curriculum, confirm the new page starts at the top (guards against the Lenis issue).
  - **ScrollLegend:** on `/`, confirm the fixed left-hand jump nav (Intro/Pillars/Curriculum/Apply) is pinned to the viewport and does not drift while scrolling (guards against a transform leaking into `template.tsx`).

- [ ] **Step 5: Check back/forward.** Navigate `/` → `/about` → `/institutions`, then press Back twice. Expected: returns through `/about` to `/`, staying on-site. This behaviour did not exist before the refactor — Back previously left the site entirely.

- [ ] **Step 6: Check mobile.** At 390px: hamburger opens, tapping an item navigates **and closes the menu**, no horizontal overflow on any route.

- [ ] **Step 7: Push**

```bash
git push origin main
```

---

## Self-Review

**Spec coverage.** Real URLs → Tasks 4–5. Per-page metadata → Tasks 4–5. Deep links → Task 7 Step 3. Sitemap/robots → Task 6. No scroll jank → constraint 2, Task 3 Step 3, Task 7 Step 4. Design system preserved → Task 1 extracts `T` unchanged and every move keeps existing styles.

**Placeholders.** None. Every new file is shown in full; every moved file cites exact source lines.

**Type consistency.** `NavLink { label, href }` defined in Task 1 Step 2 is the shape consumed in Task 2 Step 1 and Task 6 Step 1. `ArticleMeta` fields used in `generateMetadata` (`title`, `excerpt`, `dateISO`, `author`, `image`, `imageW`, `imageH`) all exist on the type moved in Task 1 Step 3. View exports are named consistently `<Route>View` and imported under those names.

**Known accepted loss.** The cross-page **exit** animation (`exit: { opacity: 0, y: -6 }`) has no clean App Router equivalent and is dropped; `template.tsx` provides enter-only. Revisiting this with the View Transitions API is a possible follow-up, deliberately out of scope here.

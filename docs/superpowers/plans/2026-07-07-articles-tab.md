# Articles Tab + Curriculum Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Articles" tab to the YBA single-page site that reproduces the org's first Medium article verbatim (headline, subtitle, both images, all text, sources) with a button to the Medium publication, and convert the Curriculum tab to a "Blockchain Content coming soon" (mainly videos) page with all Medium/article material removed.

**Architecture:** The whole site is one client component, `app/page.tsx`, with a `Page` union type, `NAV_LINKS`, one function component per page, `PAGE_TRANSITIONS`, and a render switch in `App`. We follow that pattern exactly: add `'articles'` to the union, a new `ArticlesPage` component with the article content inlined as JSX, rewrite `CurriculumPage`, and update the home-page curriculum preview card so it no longer claims the curriculum is Medium articles. Article images are self-hosted under `public/articles/` (CSP `img-src 'self'` already covers this; no dependency on Medium's CDN).

**Tech Stack:** Next.js 16 (app router, one `'use client'` SPA page), React 18, framer-motion, inline styles with the `T` design-token object. No test runner exists in this repo; verification is `npx tsc --noEmit` + `npm run build`.

**Repo:** `/Users/armaanarya/YBAREPO` (all paths below relative to this root). Work on `main`, commit after each task.

**Content constraint from the user:** all NEW copy we write (curriculum page, home card) must contain no em dashes and no hyphens. The reproduced article text is copied verbatim from the user's own Medium publication and stays untouched.

**Design conventions to follow (read these before writing code):**
- Design tokens: `T` object at `app/page.tsx:24-46` (`T.manrope` for headings, `T.inter` for body, `T.dark` text, `T.muted` secondary, `T.surface`/`T.alt` cards, `T.border`).
- Page shell: `<section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>`.
- Page header pattern: `<BlurFade inView delay={0.05} yOffset={12}>` wrapping `<Badge>`, then `<TextStagger text="..." as="h1" className="font-extrabold tracking-[-0.025em] leading-[1.07]" style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }} />`, then a `<p>` in `T.inter`.
- Buttons/links track analytics via `track('button_click', '<page>', { button: '<name>' })` from `lib/track`.
- WARNING: `app/page.tsx:70` is an 84,000-character data-URI line. Never read the whole file; read targeted ranges and always skip line 70.

---

### Task 1: Self-host the two article images

**Files:**
- Create: `public/articles/blockchain-hero.png`
- Create: `public/articles/blockchain-market-growth.png`

- [ ] **Step 1: Download both images from Medium's CDN**

```bash
mkdir -p /Users/armaanarya/YBAREPO/public/articles
curl -s -A "Mozilla/5.0" -o /Users/armaanarya/YBAREPO/public/articles/blockchain-hero.png "https://miro.medium.com/v2/resize:fit:1400/1*a1HsO4xvYo02i0Bi9pAWQg.png"
curl -s -A "Mozilla/5.0" -o /Users/armaanarya/YBAREPO/public/articles/blockchain-market-growth.png "https://miro.medium.com/v2/resize:fit:1400/1*e2XbRmbiP3w-qIT8YLptMA.png"
```

- [ ] **Step 2: Verify dimensions (these exact numbers are used in `next/image` props in Task 2)**

Run: `sips -g pixelWidth -g pixelHeight /Users/armaanarya/YBAREPO/public/articles/*.png`
Expected: `blockchain-hero.png` = 562 x 574, `blockchain-market-growth.png` = 1400 x 818. (Verified working on 2026-07-07; both URLs return HTTP 200.)

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/YBAREPO && git add public/articles && git commit -m "feat: add self-hosted images for first article"
```

---

### Task 2: Add `ArticlesPage` component

**Files:**
- Modify: `app/page.tsx` (insert immediately BEFORE the line `// ─── Podcast ──────────────────────────────────────────────────────────────────` at ~line 933)

- [ ] **Step 1: Insert the complete component below.**

Anchor: find the closing of `CurriculumPage` (`}` on its own line, ~line 931) followed by the blank line and the `// ─── Podcast` comment. Insert between them:

```tsx
// ─── Articles ─────────────────────────────────────────────────────────────────
const MEDIUM_PUB  = 'https://medium.com/youth-blockchain-association'
const MEDIUM_POST = 'https://medium.com/youth-blockchain-association/what-is-blockchain-for-teens-c24d9a85fee1'

function ArticlesPage() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const srcLink: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Articles</Badge>
        <TextStagger
          text="What is Blockchain? (For Teens)"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <blockquote style={{ fontFamily: T.inter, fontSize: '1.1875rem', fontStyle: 'italic', color: T.muted, lineHeight: 1.6, marginTop: '1.25rem', paddingLeft: '1.25rem', borderLeft: `3px solid ${T.accentMid}` }}>
          Blockchain is a rapidly growing technology, and it’s time to bring our youth into the industry.
        </blockquote>
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Sumedh Seetharaman · Youth Blockchain Association · Jul 1, 2026
        </p>
        <a
          href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer"
          onClick={() => track('button_click', 'articles', { button: 'medium_publication' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem' }}
        >
          Visit our Medium publication
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </a>
      </BlurFade>

      <article>
        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/blockchain-hero.png" alt="What is Blockchain? (For Teens)" width={562} height={574} style={{ width: '100%', maxWidth: 480, height: 'auto', borderRadius: 16, border: `1px solid ${T.border}`, display: 'block', margin: '0 auto' }} />
        </figure>

        <p style={body}>
          Hi everyone! My name is Sumedh Seetharaman, and I am head of finance at the Youth Blockchain Association. Today I would like to discuss a topic that I strongly resonate with, and I hope you enjoy!
        </p>
        <p style={body}>
          Most people think blockchain is just a confusing crypto thing that doesn’t affect real life. But strip away the finance jargon, and it comes down to one question: who gets to control the truth when something goes wrong? The UK Post Office Horizon scandal is the clearest answer I’ve seen. For years, a faulty accounting system reported money missing from local branches. The Post Office believed its software over the people actually working there, and over 700 sub-postmasters were prosecuted for theft and fraud they never committed. Some went to prison. Lives were destroyed over numbers that were wrong from the start. Nobody could prove it because only the post office controlled the records. That’s exactly the problem blockchain exists to prevent. A blockchain is a record that multiple independent parties can see and check at once, not one company’s private system that only they can read. If those transactions had been stored on a blockchain, it would have been much harder for a single, unverifiable version of “the truth” to destroy real people’s lives for over a decade.
        </p>
        <p style={body}>
          That’s basically the whole problem blockchain is trying to solve. Right now, every digital transaction you make goes through somebody else first. Want to send money? Your bank has to approve it. Bought something online? That platform is keeping the record. Even your game skins technically belong to the company, not you. And look, most of the time these middlemen do their job fine. But “most of the time” isn’t the same as always. According to <a style={srcLink} href="https://www.tekrevol.com/blogs/blockchain-statistics-facts/" target="_blank" rel="noopener noreferrer">TekRevol</a>, around 90% of U.S. and European banks were already looking into blockchain by 2025. Even they know their own system isn’t perfect.
        </p>
        <p style={body}>
          So what blockchain actually does is try to cut out that middleman completely. Instead of one company keeping the record, thousands of computers all over the world keep the exact same copy of it at the same time. Every new piece of information gets bundled into a “block” and locked onto the end of every previous block, going all the way back to the very first one ever recorded. If someone wanted to go back and change something, they’d have to redo every single block after it across the majority of those thousands of computers all at once, which is pretty much impossible. According to <a style={srcLink} href="https://coinlaw.io/web3-economy-statistics/" target="_blank" rel="noopener noreferrer">CoinLaw</a>, there are already over 70,000 of these computers running right now. Good luck trying to cheat that.
        </p>
        <p style={body}>
          And before you say, “Okay, cool, but this is just a crypto thing,” it’s really not anymore. Fake sneakers? Blockchain can verify if they’re real. Concert ticket scams where the same ticket gets sold five times? Blockchain fixes that. Hospitals are using it to secure patient records so they can’t be tampered with. Artists use it to prove they actually made something. Even grocery stores are experimenting with it to show exactly where your food came from and who touched it along the way. According to <a style={srcLink} href="https://electroiq.com/stats/blockchain-statistics/" target="_blank" rel="noopener noreferrer">ElectroIQ</a>, the blockchain market is on track to hit over $1 trillion by 2030, and according to <a style={srcLink} href="https://market.us/report/blockchain-technology-market/" target="_blank" rel="noopener noreferrer">Market.us</a>, it could reach as high as $12,895 billion by 2033, up from just $123 billion in 2023. A trillion. For something most people my age think is just a crypto thing.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/blockchain-market-growth.png" alt="Chart of projected blockchain market growth" width={1400} height={818} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
          <figcaption style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }}>
            The blockchain market is growing faster than ever
          </figcaption>
        </figure>

        <p style={body}>
          The actual process of sending something through a blockchain is wild when you think about it. Say you send a friend some crypto. That one action gets broadcast out to thousands of computers immediately, and they all start checking it at the same time. Do you actually have the funds? Is this legit? Once enough of them agree, it checks out, and it gets locked in permanently. No reversals. No “oops, we made a mistake.” It just lives in that chain forever. According to <a style={srcLink} href="https://sqmagazine.co.uk/blockchain-statistics/" target="_blank" rel="noopener noreferrer">SQ Magazine</a>, Ethereum alone handled over 200 million transactions in just the first three months of 2026. That’s not a system that’s struggling.
        </p>
        <p style={body}>
          Most people my age have no clue how big this industry already is. According to <a style={srcLink} href="https://coinlaw.io/crypto-industry-employment-statistics/" target="_blank" rel="noopener noreferrer">CoinLaw</a>, demand for blockchain developers shot up 250% since 2023, and over 66,000 new jobs were added in 2025 alone. And according to <a style={srcLink} href="https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025" target="_blank" rel="noopener noreferrer">Algorand</a>, the average blockchain developer in the U.S. is making $146,250 a year. You don’t even have to be a developer. There’s legal work, design, policy, writing, and marketing; all of it is growing. The teens who actually understand what a blockchain is right now are already ahead of most adults. That’s not something that happens very often, so maybe pay attention this time.
        </p>

        <h3 style={{ fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }}>Sources</h3>
        <ol style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'decimal', wordBreak: 'break-word' }}>
          <li>TekRevol. <em>Blockchain Statistics &amp; Facts 2025.</em> <a style={srcLink} href="https://www.tekrevol.com/blogs/blockchain-statistics-facts/" target="_blank" rel="noopener noreferrer">https://www.tekrevol.com/blogs/blockchain-statistics-facts/</a></li>
          <li>CoinLaw. <em>Web3 Economy Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/web3-economy-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/web3-economy-statistics/</a></li>
          <li>SQ Magazine. <em>Blockchain Statistics 2026.</em> <a style={srcLink} href="https://sqmagazine.co.uk/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://sqmagazine.co.uk/blockchain-statistics/</a></li>
          <li>ElectroIQ. <em>Blockchain Statistics and Facts (2025).</em> <a style={srcLink} href="https://electroiq.com/stats/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://electroiq.com/stats/blockchain-statistics/</a></li>
          <li>CoinLaw. <em>Crypto Industry Employment Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/crypto-industry-employment-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/crypto-industry-employment-statistics/</a></li>
          <li>Algorand. <em>Blockchain Developer Salary and Job Outlook (2025).</em> <a style={srcLink} href="https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025" target="_blank" rel="noopener noreferrer">https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025</a></li>
          <li>Market.us. <em>Blockchain Technology Market.</em> <a style={srcLink} href="https://market.us/report/blockchain-technology-market/" target="_blank" rel="noopener noreferrer">https://market.us/report/blockchain-technology-market/</a></li>
        </ol>

        <p style={body}>Be sure to follow and click applaud!</p>
        <p style={body}>Thank you, everyone!</p>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href={MEDIUM_POST} target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>What is Blockchain? (For Teens)</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}
```

Content fidelity notes for the implementer:
- The text above is the verbatim article body from the publication's RSS feed (`https://medium.com/feed/youth-blockchain-association`, `content:encoded`). Do not paraphrase, "fix", or re-punctuate it. Keep the curly quotes exactly as written.
- Paragraph order, the two figure positions, the figcaption, the Sources heading + 7 numbered sources, and the two closing lines match the Medium post exactly.

- [ ] **Step 2: Type-check**

Run: `cd /Users/armaanarya/YBAREPO && npx tsc --noEmit`
Expected: no errors (the component compiles; `'articles'` is not yet in the `Page` union but nothing here references the `Page` type).

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/YBAREPO && git add app/page.tsx && git commit -m "feat: add ArticlesPage with first Medium article content"
```

---

### Task 3: Wire the Articles tab into nav, transitions, and render switch

**Files:**
- Modify: `app/page.tsx:21` (Page type), `app/page.tsx:76-83` (NAV_LINKS), `app/page.tsx:1320-1328` (PAGE_TRANSITIONS), `app/page.tsx:1359-1365` (render switch). Line numbers are pre-edit; after Task 2 the last two blocks sit ~200 lines lower. Match on content, not line numbers.

- [ ] **Step 1: Add `'articles'` to the Page union**

Replace:
```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'podcast' | 'register' | 'contact'
```
with:
```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'articles' | 'podcast' | 'register' | 'contact'
```

- [ ] **Step 2: Add the nav link (after Curriculum)**

Replace:
```tsx
  { label: 'Curriculum', page: 'curriculum' },
  { label: 'Podcast', page: 'podcast' },
```
with:
```tsx
  { label: 'Curriculum', page: 'curriculum' },
  { label: 'Articles', page: 'articles' },
  { label: 'Podcast', page: 'podcast' },
```

- [ ] **Step 3: Add the page transition entry**

Replace:
```tsx
  curriculum: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  podcast:    { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
```
with:
```tsx
  curriculum: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  articles:   { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  podcast:    { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
```

- [ ] **Step 4: Add the render-switch line**

Replace:
```tsx
            {page === 'curriculum' && <CurriculumPage />}
            {page === 'podcast'    && <PodcastPage />}
```
with:
```tsx
            {page === 'curriculum' && <CurriculumPage />}
            {page === 'articles'   && <ArticlesPage />}
            {page === 'podcast'    && <PodcastPage />}
```

- [ ] **Step 5: Type-check**

Run: `cd /Users/armaanarya/YBAREPO && npx tsc --noEmit`
Expected: no errors. (If `PAGE_TRANSITIONS` were missing the `articles` key, `Record<Page, ...>` would error here; that is the safety net.)

- [ ] **Step 6: Commit**

```bash
cd /Users/armaanarya/YBAREPO && git add app/page.tsx && git commit -m "feat: wire Articles tab into nav and page switch"
```

---

### Task 4: Rewrite `CurriculumPage` (remove Medium/articles, add coming-soon header)

**Files:**
- Modify: `app/page.tsx:853-931` (the whole `CurriculumPage` function, pre-Task-2 numbering; it still sits directly after `YBACalendar` and directly before the new `// ─── Articles` block)

- [ ] **Step 1: Replace the header block and delete the article list**

Replace everything from `function CurriculumPage() {` down to (and including) the article-list `</div>` that precedes `<ParallaxLayer speed={0.15}>` with:

```tsx
function CurriculumPage() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Coming Soon</Badge>
        <TextStagger
          text="Blockchain Content coming soon."
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
          Our full curriculum is on the way, and it will be mainly videos. Clear and engaging video lessons made by students, for students, taking you from the fundamentals of blockchain all the way to the frontier of Web3.
        </p>
      </BlurFade>
```

Specifically, these all get deleted: the `useState` articles state, the `PUB` constant, the `useEffect` fetch of `/api/articles`, the `Learn on Medium` badge, the `Read. Learn. Build.` TextStagger, the "Our curriculum lives as a growing library of articles on Medium" paragraph, the "Visit our Medium publication" button, and the whole `<div style={{ display: 'grid', gap: '1rem', marginTop: '2.5rem' }}>` article-card grid including the `Loading articles…` fallback.

Everything from `<ParallaxLayer speed={0.15}>` (the `YBACalendar`) through the FAQ `AnimatedAccordion` and the closing `</section>` stays exactly as is.

Copy constraint check: the new paragraph contains no em dashes and no hyphens. Keep it that way if you adjust wording.

- [ ] **Step 2: Type-check**

Run: `cd /Users/armaanarya/YBAREPO && npx tsc --noEmit`
Expected: no errors. If `useState`/`useEffect` are now unused imports elsewhere, they are still used by other components in this file; do NOT remove the React imports.

- [ ] **Step 3: Commit**

```bash
cd /Users/armaanarya/YBAREPO && git add app/page.tsx && git commit -m "feat: curriculum page announces video content coming soon"
```

---

### Task 5: Update the home-page curriculum preview card

The home page's `ScrollRevealSection` (`app/page.tsx:176-238`) still says the curriculum "is published as free articles on Medium", which contradicts the new messaging. Update the card copy and point its link at the new Articles tab.

**Files:**
- Modify: `app/page.tsx:176` (component signature), `app/page.tsx:220-231` (card content), `app/page.tsx:395` (call site `<ScrollRevealSection />` inside `HomePage`)

- [ ] **Step 1: Give the component access to `nav`**

Replace:
```tsx
function ScrollRevealSection() {
```
with:
```tsx
function ScrollRevealSection({ nav }: { nav: (p: Page) => void }) {
```

- [ ] **Step 2: Replace the card copy and link**

Replace:
```tsx
                <p style={{ fontFamily: T.inter, fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '56ch' }}>
                  Our curriculum is published as free articles on Medium — blockchain fundamentals, DeFi, and more, written by students for students.
                </p>
                <a
                  href="https://medium.com/youth-blockchain-association" target="_blank" rel="noopener noreferrer"
                  onClick={() => track('button_click', 'home', { button: 'medium_preview' })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 2 }}
                >
                  Read on Medium →
                </a>
```
with:
```tsx
                <p style={{ fontFamily: T.inter, fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '56ch' }}>
                  Our full curriculum is coming soon, and it will be built mainly around videos. Until then, start with our first article, written by students for students.
                </p>
                <button
                  onClick={() => { track('button_click', 'home', { button: 'articles_preview' }); nav('articles') }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 2, background: 'none', border: 'none', borderRadius: 0, cursor: 'pointer', padding: '0 0 2px' }}
                >
                  Read our first article →
                </button>
```
(Note: `border: 'none'` plus `borderBottom` keeps only the underline; `padding: '0 0 2px'` replaces button default padding. New copy has no em dashes and no hyphens.)

- [ ] **Step 3: Pass `nav` at the call site in `HomePage`**

Replace:
```tsx
      <ScrollRevealSection />
```
with:
```tsx
      <ScrollRevealSection nav={nav} />
```
(`HomePage` already receives `nav` as a prop; verify its signature while there.)

- [ ] **Step 4: Type-check**

Run: `cd /Users/armaanarya/YBAREPO && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/armaanarya/YBAREPO && git add app/page.tsx && git commit -m "feat: home curriculum preview points to Articles tab"
```

---

### Task 6: Remove the now-unused `/api/articles` route

`CurriculumPage` was the only consumer (verified via grep: the sole reference was `app/page.tsx:858`, deleted in Task 4). The Articles page is static, so the Medium-feed proxy route is dead code.

**Files:**
- Delete: `app/api/articles/route.ts`

- [ ] **Step 1: Confirm nothing references it anymore**

Run: `grep -rn "api/articles" /Users/armaanarya/YBAREPO/app /Users/armaanarya/YBAREPO/lib /Users/armaanarya/YBAREPO/components /Users/armaanarya/YBAREPO/vercel.json`
Expected: no matches outside `app/api/articles/` itself. If anything else matches, STOP and leave the route in place.

- [ ] **Step 2: Delete and commit**

```bash
cd /Users/armaanarya/YBAREPO && git rm -r app/api/articles && git commit -m "chore: remove unused Medium feed API route"
```

---

### Task 7: Build and verify in the browser

- [ ] **Step 1: Production build**

Run: `cd /Users/armaanarya/YBAREPO && npm run build`
Expected: build succeeds with no type or lint errors.

- [ ] **Step 2: Manual verification via dev server (preview tools)**

Start the dev server (`npm run dev`, port 3000) and verify:
1. Nav shows: Home, About, Goals, Curriculum, Articles, Podcast, Contact.
2. Articles tab: headline "What is Blockchain? (For Teens)", italic subtitle blockquote, byline, "Visit our Medium publication" button (opens `https://medium.com/youth-blockchain-association`), hero image renders, chart image renders with the caption "The blockchain market is growing faster than ever", Sources list has 7 entries, closing lines and the "originally published" footer link are present.
3. Curriculum tab: "Coming Soon" badge, "Blockchain Content coming soon." headline, videos paragraph, calendar and FAQ still intact, and NO Medium button or article cards anywhere on the page.
4. Home page: scroll to the curriculum preview card; it shows the new videos copy and "Read our first article →" navigates to the Articles tab.
5. No console errors (ignore the pre-existing favicon/analytics noise if any).

- [ ] **Step 3: Final commit if any fixups were needed**

```bash
cd /Users/armaanarya/YBAREPO && git status --short
```
Expected: clean tree (everything already committed per task).

---

## Self-Review Notes

- Spec coverage: Articles tab in nav + design-consistent page (Tasks 2, 3), Medium publication button (Task 2), verbatim article with same headline/images/format (Task 2, content from the publication RSS feed), Medium/article removal from Curriculum (Task 4), "Blockchain Content coming soon" + videos copy at top of Curriculum (Task 4), no em dashes or hyphens in all new copy (checked in Tasks 4 and 5), consistency fix for the home preview card that would otherwise still advertise Medium articles (Task 5), dead-code cleanup (Task 6), verification (Task 7).
- Types: `Page` union gains `'articles'` before `PAGE_TRANSITIONS: Record<Page, ...>` is checked; `ScrollRevealSection` prop type matches `nav: (p: Page) => void` used by `Footer` already.
- All images self-hosted; CSP `img-src 'self'` already permits them; no next.config change needed.

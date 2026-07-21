# Hackathon Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new top-nav "Hackathon" tab to the YBA site, move the Bridge to Industry (Guest Speaker) section and the Hackathon card out of the Goals page into it, add a new Workshops card, and turn the old "Get Notified" button into a "Sign Up" link that opens the YBA Google Form.

**Architecture:** The site is a single-file client SPA (`app/page.tsx`) that switches between page components with a `page` state string and an `AnimatePresence` block. A new `HackathonPage()` component is added; the moved sections are cut from `GoalsPage()` and pasted (verbatim, with dash cleanup) into it, plus one new Workshops card that mirrors the existing Hackathon card pattern. Navigation is wired through the `Page` union type (defined in **two** files), the `NAV_LINKS` array, `PAGE_TRANSITIONS`, and the render switch.

**Tech Stack:** Next.js 16 (App Router, client component), React 18, TypeScript, framer-motion, inline-style design tokens (the `T` object). No test framework exists in this repo, so verification is `npx tsc --noEmit` plus in-browser preview (`next dev`, port 3000).

**Design constraints from the request:**
- New tab sits in the top nav "just like Goals and Curriculum" (same `YBANav`).
- Avoid hyphens and em/en dashes in the Hackathon tab's prose (ported text is rewritten to remove them; the rest of the site is left untouched to keep scope tight).
- "Get Notified" becomes "Sign Up" and links to `https://forms.gle/3SSYakeDvPaR4eYc9` (new tab, `rel="noopener noreferrer"`).
- All new/moved UI reuses the existing design tokens (`T`), `Badge`, `TextStagger`, `BlurFade`, `SectionHeading`, and the exact card/step styling already on the page. No new visual language is invented.

**Decisions worth confirming (sensible defaults chosen):**
1. **Nav position:** "Hackathon" is inserted right after "Curriculum" → order becomes Home, About, Goals, Curriculum, Hackathon, Articles, Podcast, Contact (8 items).
2. **Workshops card CTA:** the new Workshops card also gets a matching "Sign Up" button to the same form, for consistency with the Hackathon card. (Easy to drop if you want only one CTA.)
3. **Page intro:** the Hackathon tab gets a short intro header (same pattern as the Goals intro) so the standalone page does not start abruptly under the fixed navbar.

---

## File Structure

- **Modify:** `app/page.tsx`
  - `type Page` (line 21) — add `'hackathon'`.
  - `NAV_LINKS` (lines 76-84) — add Hackathon entry after Curriculum.
  - `STEPS` (lines 619-623) — replace en dash `24–48` with `24 to 48`.
  - `GoalsPage()` (lines 632-747) — delete the `{/* Speaker */}` section and the `{/* Hackathon card */}` section.
  - **Add** `WORKSHOPS` array + `HackathonPage()` function after `GoalsPage()`.
  - `PAGE_TRANSITIONS` (lines 1599-1610) — add `hackathon` key.
  - Render switch (lines 1639-1646) — add `hackathon` line.
- **Modify:** `components/ui/resizable-navbar.tsx`
  - `type Page` (line 14) — add `'hackathon'` (duplicate union that MUST stay in sync).
  - `DesktopLinks` button spacing (lines 189-195) — tighten **only if** the 8th item overlaps the logo/CTA at desktop widths (verification-gated).

No new files. Everything lives in the existing SPA to match the established pattern.

---

## Task 1: Extend the `Page` type in both files

**Files:**
- Modify: `app/page.tsx:21`
- Modify: `components/ui/resizable-navbar.tsx:14`

- [ ] **Step 1: Add `'hackathon'` to the union in `app/page.tsx`**

Replace line 21:

```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'articles' | 'podcast' | 'register' | 'contact'
```

with:

```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'hackathon' | 'articles' | 'podcast' | 'register' | 'contact'
```

- [ ] **Step 2: Add `'hackathon'` to the duplicate union in `components/ui/resizable-navbar.tsx`**

Replace line 14:

```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'articles' | 'podcast' | 'register' | 'contact'
```

with:

```tsx
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'hackathon' | 'articles' | 'podcast' | 'register' | 'contact'
```

- [ ] **Step 3: Typecheck (expected to fail here, that is the point)**

Run: `cd ~/YBAREPO && npx tsc --noEmit`
Expected: errors about `PAGE_TRANSITIONS` missing the `hackathon` property (Record<Page> is now non-exhaustive). This confirms the type change took effect. Later tasks resolve it.

---

## Task 2: Add the Hackathon nav link

**Files:**
- Modify: `app/page.tsx:76-84`

- [ ] **Step 1: Insert the Hackathon entry after Curriculum**

Replace:

```tsx
  { label: 'Curriculum', page: 'curriculum' },
  { label: 'Articles', page: 'articles' },
```

with:

```tsx
  { label: 'Curriculum', page: 'curriculum' },
  { label: 'Hackathon', page: 'hackathon' },
  { label: 'Articles', page: 'articles' },
```

---

## Task 3: Remove the moved sections from `GoalsPage`

**Files:**
- Modify: `app/page.tsx` (inside `GoalsPage`, lines ~676-746)

- [ ] **Step 1: Delete the Speaker section and the Hackathon card**

Delete everything from the `{/* Speaker */}` comment through the closing `</section>` of the `{/* Hackathon card */}` block. Concretely, remove this entire run (the two sections):

```tsx
      {/* Speaker */}
      <section aria-label="Guest Speaker Series" style={{ background: T.alt, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', marginTop: '1rem', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        ... (whole Speaker section) ...
      </section>

      {/* Hackathon card */}
      <section aria-label="Hackathon" style={{ maxWidth: 1160, margin: '3rem auto 0', padding: '0 clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)' }}>
        ... (whole Hackathon card) ...
      </section>
```

After deletion, the tail of `GoalsPage` must read exactly (the Year One Goals section is now the last section):

```tsx
        {YEAR_ONE.map((g, i) => (
          <BlurFade key={i} inView delay={0.1 + i * 0.05} yOffset={8}>
            <div
              className="goal-row"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1.125rem 0.75rem', borderBottom: `1px solid ${T.border}`, borderRadius: 10, marginLeft: '-0.75rem', marginRight: '-0.75rem' }}
              onMouseEnter={e => { e.currentTarget.style.background = T.accentLight; e.currentTarget.style.paddingLeft = '1.25rem' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '0.75rem' }}
            >
              <span style={{ fontFamily: T.manrope, fontWeight: 800, fontSize: '0.8125rem', color: T.dark, opacity: 0.4, minWidth: '2rem', paddingTop: '0.1rem' }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ fontFamily: T.inter, fontSize: '1rem', color: T.dark, lineHeight: 1.6 }}>{g}</span>
            </div>
          </BlurFade>
        ))}
      </section>
    </div>
  )
}
```

Note: `STEPS` (module scope) stays where it is; it will be consumed by `HackathonPage` in Task 5. `YEAR_ONE` keeps its "Launch first YBA Hackathon..." and "Host 10 Guest Speaker sessions..." list items unchanged (they are goals, not the moved sections).

- [ ] **Step 2: Verify GoalsPage still parses**

Run: `cd ~/YBAREPO && npx tsc --noEmit 2>&1 | grep -i goals || echo "no GoalsPage errors"`
Expected: `no GoalsPage errors` (remaining errors are the still-missing `HackathonPage`/`PAGE_TRANSITIONS`, handled next).

---

## Task 4: Clean the en dash in `STEPS`

**Files:**
- Modify: `app/page.tsx:621`

- [ ] **Step 1: Replace the en dash with "to"**

Replace:

```tsx
  { num: '02', title: 'Build Something Real', desc: '24–48 hours to prototype a smart contract or DApp addressing a social or economic problem.' },
```

with:

```tsx
  { num: '02', title: 'Build Something Real', desc: '24 to 48 hours to prototype a smart contract or DApp addressing a social or economic problem.' },
```

---

## Task 5: Add `WORKSHOPS` array and the `HackathonPage` component

**Files:**
- Modify: `app/page.tsx` — insert immediately after the closing `}` of `GoalsPage()` (before the `// ─── Curriculum ───` divider).

- [ ] **Step 1: Insert the Workshops data and the new page component**

Insert this block after `GoalsPage`'s closing brace:

```tsx
// ─── Hackathon ─────────────────────────────────────────────────────────────────
const WORKSHOPS = [
  { num: '01', title: 'How Blockchain Works', desc: 'Blocks, nodes, hashing, and consensus explained from the ground up until the fundamentals finally click.' },
  { num: '02', title: 'Real World Impact',    desc: 'See how blockchain already powers finance, digital identity, supply chains, and more far beyond the hype.' },
  { num: '03', title: 'Hands On Building',     desc: 'Set up a wallet, explore a testnet, and write your first simple smart contract in a guided session.' },
]

const SIGNUP_FORM = 'https://forms.gle/3SSYakeDvPaR4eYc9'

function HackathonPage() {
  return (
    <div>
      {/* Page intro */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 2rem' }}>
        <BlurFade inView delay={0.05} yOffset={12}>
          <TextStagger
            text="Build It. Pitch It. Learn It."
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em] leading-[1.08]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '1.25rem' }}>
            Our hackathons, workshops, and speaker sessions put you in the room with real builders. Learn how blockchain actually works, then use it to ship something that matters.
          </p>
        </BlurFade>
      </section>

      {/* Speaker / Bridge to Industry (moved from Goals) */}
      <section aria-label="Guest Speaker Series" style={{ background: T.alt, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', marginTop: '1rem', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <BlurFade inView delay={0.05} yOffset={10}>
            <Badge>Coming Soon</Badge>
            <SectionHeading size="sm">
              <span style={{ display: 'block', marginTop: '0.875rem' }}>The Bridge to Industry</span>
            </SectionHeading>
            <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '0.875rem' }}>
              Direct access to developers, founders, VCs, and tokenomics specialists. Build your network years ahead of your peers.
            </p>
          </BlurFade>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {['Direct Q&A','Career Pathfinding','Network Before You Graduate'].map((t, i) => (
              <BlurFade key={t} inView delay={0.2 + i * 0.08} yOffset={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, flexShrink: 0, display: 'inline-block' }}/>
                  <span style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark }}>{t}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon card (moved from Goals; button now Sign Up -> form) */}
      <section aria-label="Hackathon" style={{ maxWidth: 1160, margin: '3rem auto 0', padding: '0 clamp(1.25rem,4vw,3rem) clamp(2rem,4vw,3rem)' }}>
        <BlurFade inView delay={0.05} yOffset={14}>
        <div style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadowLg, padding: 'clamp(2rem,4vw,3rem)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, background: `radial-gradient(circle at top right, rgba(238,238,255,0.05), transparent 70%)`, pointerEvents: 'none' }}/>
          <Badge>Coming Soon</Badge>
          <TextStagger
            text="YBA Hackathon Series"
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.25rem)', color: T.dark, marginTop: '1rem' }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '58ch', marginTop: '0.875rem' }}>
            Blockchain hackathons built for teams that mirror agile startup environments. Members rapidly prototype smart contracts and DApps, then pitch to industry judges for feedback and mentorship.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1.125rem', marginTop: '2rem' }}>
            {STEPS.map((s) => (
              <div key={s.num}
                style={{ background: T.alt, borderRadius: 14, padding: '1.375rem', border: `1px solid ${T.border}`, transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentMid; e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = '' }}
              >
                <div style={{ fontFamily: T.manrope, fontSize: '1.75rem', fontWeight: 800, color: T.accent, opacity: 0.25 }}>{s.num}</div>
                <div style={{ fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 700, color: T.dark, marginTop: '0.375rem' }}>{s.title}</div>
                <div style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.6, marginTop: '0.5rem' }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <a href={SIGNUP_FORM} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, textDecoration: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', marginTop: '2rem', transition: 'background 0.2s, transform 0.12s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ctaHover; e.currentTarget.style.boxShadow = '0 4px 16px rgba(238,238,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            aria-label="Sign up for the YBA hackathon"
          >
            Sign Up
          </a>
        </div>
        </BlurFade>
      </section>

      {/* Workshops card (new) */}
      <section aria-label="Workshops" style={{ maxWidth: 1160, margin: '2rem auto 0', padding: '0 clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)' }}>
        <BlurFade inView delay={0.05} yOffset={14}>
        <div style={{ background: T.surface, borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadowLg, padding: 'clamp(2rem,4vw,3rem)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, background: `radial-gradient(circle at top right, rgba(238,238,255,0.05), transparent 70%)`, pointerEvents: 'none' }}/>
          <Badge>Coming Soon</Badge>
          <TextStagger
            text="YBA Workshops"
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.25rem)', color: T.dark, marginTop: '1rem' }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '58ch', marginTop: '0.875rem' }}>
            Interactive sessions that show you how blockchain actually works and why it matters. We go past the buzzwords and into what the technology does today, plus where it can take the world tomorrow.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1.125rem', marginTop: '2rem' }}>
            {WORKSHOPS.map((s) => (
              <div key={s.num}
                style={{ background: T.alt, borderRadius: 14, padding: '1.375rem', border: `1px solid ${T.border}`, transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.accentMid; e.currentTarget.style.boxShadow = T.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = '' }}
              >
                <div style={{ fontFamily: T.manrope, fontSize: '1.75rem', fontWeight: 800, color: T.accent, opacity: 0.25 }}>{s.num}</div>
                <div style={{ fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 700, color: T.dark, marginTop: '0.375rem' }}>{s.title}</div>
                <div style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.6, marginTop: '0.5rem' }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <a href={SIGNUP_FORM} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, textDecoration: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', marginTop: '2rem', transition: 'background 0.2s, transform 0.12s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ctaHover; e.currentTarget.style.boxShadow = '0 4px 16px rgba(238,238,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            aria-label="Sign up for YBA workshops"
          >
            Sign Up
          </a>
        </div>
        </BlurFade>
      </section>
    </div>
  )
}
```

Notes on dash-avoidance in this block: "Team-based" became "built for teams", the em dash before "then pitch" became a comma, "Real World" / "Hands On" are written without hyphens, and no en/em dashes appear in any Workshops copy.

---

## Task 6: Register the page transition and render the page

**Files:**
- Modify: `app/page.tsx:1599-1610` (PAGE_TRANSITIONS)
- Modify: `app/page.tsx:1639-1646` (render switch)

- [ ] **Step 1: Add the `hackathon` transition**

Replace:

```tsx
  curriculum: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  articles:   { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
```

with:

```tsx
  curriculum: { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  hackathon:  { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
  articles:   { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } },
```

- [ ] **Step 2: Add the render branch**

Replace:

```tsx
            {page === 'curriculum' && <CurriculumPage />}
            {page === 'articles'   && <ArticlesPage />}
```

with:

```tsx
            {page === 'curriculum' && <CurriculumPage />}
            {page === 'hackathon'  && <HackathonPage />}
            {page === 'articles'   && <ArticlesPage />}
```

- [ ] **Step 3: Full typecheck must now pass**

Run: `cd ~/YBAREPO && npx tsc --noEmit`
Expected: exits 0 with no output (all `Page` exhaustiveness errors resolved).

---

## Task 7: Verify in the browser and fix navbar overlap if present

**Files:**
- Potentially modify: `components/ui/resizable-navbar.tsx:192` (DesktopLinks button className) — only if overlap is observed.

Context: the navbar was previously tuned for **7** items down to 1024px (commit `bebc235`). Adding an 8th item ("Hackathon", the longest label) may push the links under the logo or the "Join YBA" CTA at narrow desktop widths. This task verifies and, if needed, tightens spacing.

- [ ] **Step 1: Start the dev server via the preview tool**

Use `preview_start` with the YBA dev config (`next dev`, port 3000). Do not use Bash to run the server.

- [ ] **Step 2: Navigate and confirm the tab exists**

Open the app, click "Hackathon" in the top nav. Use `read_page` to confirm the Hackathon page renders the intro, "The Bridge to Industry", "YBA Hackathon Series", and "YBA Workshops" sections, and that "Sign Up" links (`<a href>`) point to `https://forms.gle/3SSYakeDvPaR4eYc9` with `target="_blank"`.

- [ ] **Step 3: Confirm Goals no longer shows the moved sections**

Click "Goals". Confirm it now ends after "Year One Goals" with no Speaker or Hackathon card. Confirm no console errors via `read_console_messages`.

- [ ] **Step 4: Check navbar layout at desktop widths**

`resize_window` to 1280 and 1024 wide. Screenshot the navbar (scrolled state, where it shrinks to a pill). Look for the 8 links overlapping the logo or the "Join YBA" button.

- [ ] **Step 5: If (and only if) overlap is observed, tighten link spacing**

In `components/ui/resizable-navbar.tsx`, in `DesktopLinks`, replace:

```tsx
          className="relative shrink-0 whitespace-nowrap px-2.5 py-2 transition-colors duration-150"
```

with:

```tsx
          className="relative shrink-0 whitespace-nowrap px-2 py-2 transition-colors duration-150"
```

If overlap persists at 1024px, also reduce the font size in the same button's inline `style` from `fontSize: '0.875rem'` to `fontSize: '0.8125rem'`. Re-check at 1280 and 1024 after each change. Stop as soon as all 8 items fit without overlapping the logo or CTA.

- [ ] **Step 6: Check mobile nav**

`resize_window` to mobile (375 wide). Open the hamburger menu and confirm all 8 items plus "Join YBA" list vertically with no clipping (this layout is a simple vertical stack and should already be fine).

- [ ] **Step 7: Capture proof**

Screenshot the Hackathon page (desktop) showing the two moved sections and the new Workshops card, and the navbar with the new tab. Share with the user.

---

## Task 8: Commit

- [ ] **Step 1: Commit the change**

```bash
cd ~/YBAREPO && git add app/page.tsx components/ui/resizable-navbar.tsx docs/superpowers/plans/2026-07-18-hackathon-tab.md && git commit -m "feat: add Hackathon tab with moved sections and Workshops card

Move the Bridge to Industry (Guest Speaker) section and the Hackathon
card out of Goals into a new top-nav Hackathon page, add a Workshops
card, and turn Get Notified into a Sign Up link to the YBA Google Form.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

Note: do not push unless the user asks.

---

## Self-Review

**Spec coverage:**
- New "Hackathon" top-nav tab like Goals/Curriculum → Tasks 1, 2, 6. ✓
- Move Hackathon card (and Bridge to Industry) out of Goals into the new tab → Tasks 3, 5. ✓
- New Workshops card about how blockchain works and its real-world use → Task 5 (`WORKSHOPS` + card). ✓
- Avoid hyphens and em/en dashes in the tab's prose → Task 4 (STEPS) + rewritten copy in Task 5. ✓
- "Get Notified" → "Sign Up" linking to the Google Form → Task 5 (`<a href={SIGNUP_FORM}>`). ✓
- Follow the site's design style → all new/moved UI reuses `T`, `Badge`, `TextStagger`, `BlurFade`, `SectionHeading`, and the exact existing card/step styling. ✓

**Type consistency:** `Page` union updated in both `app/page.tsx` and `resizable-navbar.tsx`; `PAGE_TRANSITIONS` (Record<Page>) gets the `hackathon` key; render switch adds the branch; `STEPS`/`WORKSHOPS`/`SIGNUP_FORM` are module-scoped and referenced consistently. `npx tsc --noEmit` in Task 6 Step 3 is the gate.

**Placeholder scan:** no TBD/TODO; every code step shows full code. The only conditional step (Task 7 Step 5) is verification-gated and specifies the exact before/after.

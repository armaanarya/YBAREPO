'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'

export function NewslettersView() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Newsletters</Badge>
        <TextStagger
          text="The YBA Monthly Update"
          stagger={0.025}
          direction="bottom"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '50ch', marginTop: '1.25rem' }}>
          Each month we share what YBA is building: YBA HACKS, our curriculum, partnerships, outreach, fundraising, and where we could use your help.
        </p>
      </BlurFade>

      <BlurFade inView delay={0.15} yOffset={12}>
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadowMd, padding: 'clamp(1.25rem,3vw,2rem)', marginTop: '2.5rem', maxWidth: 640 }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.dark, opacity: 0.5 }}>October 2026 · Issue 1</p>
          <p style={{ fontFamily: T.manrope, fontSize: '1.375rem', fontWeight: 800, color: T.dark, marginTop: '0.5rem', letterSpacing: '-0.01em' }}>YBA October Update</p>
          <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.6, marginTop: '0.5rem' }}>
            Planning YBA HACKS, our new blockchain curriculum series, partnerships, and a growing student community.
          </p>
          <Link
            href="/newsletters/october-2026"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem', textDecoration: 'none' }}
          >
            Read the October update
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </Link>
        </div>
      </BlurFade>
    </section>
  )
}

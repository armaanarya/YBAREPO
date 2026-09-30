'use client'

import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { GlowCard } from '@/components/ui/glow-card'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'

type Partner = {
  name: string
  url: string
  logo: string
  logoBackground?: string
  tagline: string
  kind: string
  stats?: { value: string; label: string }[]
  body: string[]
}

const PARTNERS: Partner[] = [
  {
    name: 'college.xyz',
    url: 'https://college.xyz',
    logo: '/partners/collegexyz.webp',
    tagline: 'Bridging the gap between talent and industry.',
    kind: 'Collegiate Network · Nonprofit',
    stats: [
      { value: '100+',   label: 'Campus clubs' },
      { value: '2,500+', label: 'Student builders' },
      { value: '100+',   label: 'Bounties hosted' },
    ],
    body: [
      'college.xyz is a nonprofit that connects undergraduates to the crypto industry — bounties from companies like Coinbase and Solana, research and developer programs, conference subsidies, and the annual University Blockchain Conference, the longest-running student-led conference in the space.',
      'They start where we stop. YBA teaches blockchain literacy in grades 9–12; college.xyz turns that literacy into paid bounties, internships, and industry rooms once students reach campus. Together that is one continuous pipeline — a student can meet Web3 as a sophomore in high school and be shipping against a real company bounty by their freshman year of college.',
      'Our first year together focuses on three things: routing YBA members into college.xyz chapters at the schools they commit to, opening their opportunity feed and speaker network to our Guest Speaker Series, and building a shared judging bench so YBA Hackathon projects are reviewed by the same people hiring in the industry.',
    ],
  },
  {
    name: 'Compound Foundation',
    url: 'https://www.compound.xyz/',
    logo: '/partners/compound-foundation.png',
    logoBackground: '#020b0d',
    tagline: 'Ecosystem growth and stewardship for Compound.',
    kind: 'DeFi · Foundation',
    body: [
      'Compound is a decentralized finance protocol for earning yield and borrowing against digital assets. Its Foundation supports the ecosystem through strategic planning, development, partnerships, governance coordination, and community engagement.',
      'For YBA students, Compound is a real example of decentralized lending, protocol security, and community governance. Compound Foundation joins YBA as both a partner and a sponsor.',
    ],
  },
]

function PartnerCard({ p }: { p: Partner }) {
  return (
    <GlowCard
      className="glow-hover-lift partner-card"
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 20,
        padding: 'clamp(1.5rem,3vw,2.5rem)',
        boxShadow: T.shadowMd,
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: 'clamp(1.5rem,4vw,3rem)',
        alignItems: 'start',
      }}
    >
      <div>
        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', background: p.logoBackground ?? T.alt, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={p.logo}
            alt={`${p.name} logo`}
            width={400}
            height={400}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 600, color: T.dark, background: T.chip, border: `1px solid ${T.border}`, borderRadius: 10, padding: '13px 18px', marginTop: '0.875rem', transition: 'background 0.2s, border-color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = T.chipHover; e.currentTarget.style.borderColor = T.borderHover }}
          onMouseLeave={e => { e.currentTarget.style.background = T.chip; e.currentTarget.style.borderColor = T.border }}
        >
          Visit {p.name}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
        </a>
      </div>

      <div>
        <span style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.dark, opacity: 0.45 }}>
          {p.kind}
        </span>
        <h3 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0.5rem 0 0' }}>
          {p.name}
        </h3>
        <p style={{ fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 600, color: T.dark, opacity: 0.75, lineHeight: 1.45, marginTop: '0.5rem' }}>
          {p.tagline}
        </p>

        {p.stats && (
          <div style={{ display: 'flex', gap: 'clamp(1.25rem,3vw,2.5rem)', flexWrap: 'wrap', margin: '1.5rem 0', paddingTop: '1.25rem', borderTop: `1px solid ${T.border}` }}>
            {p.stats.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {p.body.map((para, i) => (
          <p key={i} style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.75, marginTop: i === 0 ? 0 : '1rem' }}>
            {para}
          </p>
        ))}
      </div>
    </GlowCard>
  )
}

export function InstitutionsView() {
  return (
    <div>
      {/* Page intro */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 2rem' }}>
        <BlurFade inView delay={0.05} yOffset={12}>
          <Badge>Institutions</Badge>
          <TextStagger
            text="The Bridge to Industry."
            stagger={0.025}
            direction="bottom"
            as="h1"
            className="font-extrabold tracking-[-0.02em] leading-[1.08]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark, marginTop: '1rem' }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '56ch', marginTop: '1.25rem' }}>
            A high schooler learning Web3 alone hits a wall: there is nowhere to take it next. We close that gap by partnering with the institutions already inside the industry — so the path from a first smart contract to a real role is a straight line, not a guess.
          </p>
        </BlurFade>
      </section>

      {/* Partners */}
      <section aria-label="Partners" style={{ maxWidth: 1160, margin: '0 auto', padding: '1.5rem clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,4rem)' }}>
        <BlurFade inView delay={0.05} yOffset={10}>
          <TextStagger
            text="Partners"
            stagger={0.03}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: T.dark }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '0.75rem', marginBottom: '2rem' }}>
            Organizations we build with — shared programming, shared talent, shared pipeline.
          </p>
        </BlurFade>

        {PARTNERS.map((p, i) => (
          <BlurFade key={p.name} inView delay={0.12 + i * 0.08} yOffset={14}>
            <div style={{ marginTop: i === 0 ? 0 : '1.5rem' }}>
              <PartnerCard p={p} />
            </div>
          </BlurFade>
        ))}
      </section>

      {/* Sponsors */}
      <section aria-label="Sponsors" style={{ background: T.alt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <BlurFade inView delay={0.05} yOffset={10}>
            <TextStagger
              text="Sponsors"
              stagger={0.03}
              direction="bottom"
              as="h2"
              className="font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: T.dark }}
            />
            <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '0.75rem' }}>
              Sponsors help keep YBA free for every student.
            </p>
          </BlurFade>

          <BlurFade inView delay={0.15} yOffset={12}>
            <div
              style={{
                marginTop: '2rem',
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                padding: 'clamp(2rem,4vw,3rem)',
                background: T.surface,
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(1.5rem,4vw,3rem)',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ background: '#020b0d', borderRadius: 12, padding: '1rem', width: 'min(100%, 300px)', flexShrink: 0 }}>
                <Image
                  src="/partners/compound-foundation.png"
                  alt="Compound Foundation logo"
                  width={328}
                  height={96}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
              <div style={{ flex: '1 1 260px' }}>
                <span style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.muted }}>
                  YBA sponsor
                </span>
                <h3 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: '0.5rem' }}>
                  Compound Foundation
                </h3>
                <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, marginTop: '0.875rem' }}>
                  Supporting YBA&apos;s work to make blockchain education accessible to high school students.
                </p>
                <a href="https://www.compound.xyz/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark, marginTop: '1rem', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                  Visit Compound ↗
                </a>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}

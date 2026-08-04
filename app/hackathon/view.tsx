'use client'

import React from 'react'
import { Badge } from '@/components/site/badge'
import { SectionHeading } from '@/components/site/section-heading'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'

const STEPS = [
  { num: '01', title: 'Form Your Team', desc: 'Collaborate across schools and disciplines to tackle real blockchain challenges.' },
  { num: '02', title: 'Build Something Real', desc: '24 to 48 hours to prototype a smart contract or DApp addressing a social or economic problem.' },
  { num: '03', title: 'Pitch to Judges', desc: 'Present to industry professionals for feedback, mentorship, and competitive recognition.' },
]
const WORKSHOPS = [
  { num: '01', title: 'How Blockchain Works', desc: 'Blocks, nodes, hashing, and consensus explained from the ground up until the fundamentals finally click.' },
  { num: '02', title: 'Real World Impact',    desc: 'See how blockchain already powers finance, digital identity, supply chains, and more far beyond the hype.' },
  { num: '03', title: 'Hands On Building',     desc: 'Set up a wallet, explore a testnet, and write your first simple smart contract in a guided session.' },
]

const SIGNUP_FORM = 'https://forms.gle/3SSYakeDvPaR4eYc9'

export function HackathonView() {
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

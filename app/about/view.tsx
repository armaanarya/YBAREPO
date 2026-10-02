'use client'

import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { GlowCard } from '@/components/ui/glow-card'
import { TextStagger } from '@/components/ui/hero-animated'
import { TiltCard } from '@/components/ui/tilt-card'
import { BoxBurst } from '@/ANIMATION STORAGE/box-burst'
import { T } from '@/lib/theme'

type OfficerTeam = 'Curriculum' | 'Marketing' | 'Operations'
const TEAM_ACCENT: Record<OfficerTeam, string> = {
  Curriculum:  '#a5b4fc', // indigo-300
  Marketing:   '#f0abfc', // fuchsia-300
  Operations:  '#86efac', // green-300
}
const OFFICERS: { name: string; role: string; team: OfficerTeam; photo: string }[] = [
  { name: 'Sumedh Seetharaman', role: 'Finance Lead',         team: 'Curriculum', photo: '/officers/sumedh.webp' },
  { name: 'Arnav Mani',         role: 'Engineering Lead',     team: 'Curriculum', photo: '/officers/arnav.webp'  },
  { name: 'Riday Appanagari',   role: 'Head of Mentorship',   team: 'Curriculum', photo: '/officers/riday.webp'  },
  { name: 'Manas Patel',        role: 'Marketing',            team: 'Marketing',  photo: '/officers/manas.webp'  },
  { name: 'Anay Kalchuri',      role: 'Operations',           team: 'Operations', photo: '/officers/anay.webp'   },
]

const YEAR_ONE = [
  'Launch first YBA Hackathon with 50+ participants',
  'Host 10 Guest Speaker sessions in Year 1',
  'Establish YBA chapters at 5+ schools',
  'Partner with collegiate blockchain associations',
  'Create a certified blockchain literacy curriculum for high school students',
]

export function AboutView() {
  return (
    <div>
      <section aria-label="Founder" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)', display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center' }} className="about-grid">
        <BlurFade inView delay={0.05} yOffset={16}>
          <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', background: T.surface, boxShadow: T.shadowLg, border: `1px solid ${T.border}` }}>
            <Image src="/armaan.webp" alt="Armaan Arya, Founder of YBA" width={560} height={700} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </BlurFade>
        <BlurFade inView delay={0.15} yOffset={12}>
          <Badge>Founder &amp; President</Badge>
          <TextStagger as="h1" text="Armaan Arya" stagger={0.03} direction="bottom" style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,4.5vw,3.25rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.08, marginTop: '1rem' }} />
          <div style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.75, marginTop: '1.25rem' }}>
            <p>Armaan founded YBA to help high school students learn about blockchain before college.</p>
            <p style={{ marginTop: '1rem' }}>YBA gives students a place to study the technology together and try building with it.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { href: 'https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg', label: 'TikTok', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
              { href: 'https://www.instagram.com/yba.net9?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr', label: 'Instagram', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg> },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 500, color: T.dark, background: T.chip, borderRadius: 999, padding: '8px 18px', transition: 'background 0.2s', border: `1px solid ${T.border}` }}
                onMouseEnter={e => (e.currentTarget.style.background = T.chipHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.chip)}
                aria-label={`YBA ${s.label}`}
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* Quote */}
      <section aria-label="Founder quote" style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(2rem,4vw,4rem)', alignItems: 'start' }} className="quote-grid">
        <BlurFade inView delay={0.05} yOffset={10}>
          <blockquote style={{ fontFamily: T.manrope, fontSize: 'clamp(1.375rem,2.5vw,1.75rem)', fontWeight: 700, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.35, borderLeft: `3px solid ${T.accent}`, paddingLeft: '1.5rem', margin: 0, position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-0.5rem', left: '1.25rem', fontFamily: T.manrope, fontSize: '4rem', color: T.accent, opacity: 0.18, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }} aria-hidden="true">"</span>
            "Traditional education wasn't preparing my generation for what's coming. So I built the bridge myself."
          </blockquote>
        </BlurFade>
        <BlurFade inView delay={0.18} yOffset={10}>
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.75 }}>
            At YBA, students learn how blockchains record transactions and manage digital ownership. Projects give members a chance to test those ideas and understand their limits.
          </p>
        </BlurFade>
      </section>

      {/* Vision */}
      <section aria-label="Vision" style={{ background: T.alt, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', textAlign: 'center', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <BlurFade inView delay={0.05} yOffset={8}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginBottom: '1rem' }}>Our Vision</p>
          <p style={{ fontFamily: T.manrope, fontSize: 'clamp(1.375rem,3vw,2rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.35, maxWidth: '38ch', margin: '0 auto' }}>
            We want students to start YBA chapters at their schools, share lessons, and work on blockchain projects together.
          </p>
        </BlurFade>
      </section>

      {/* Officers — a wrapping grid in the normal page flow */}
      <section id="officers" aria-label="Officers" style={{ paddingTop: 'clamp(4rem,8vw,7rem)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem) clamp(1.5rem,3vw,2.5rem)' }}>
          <BlurFade delay={0.05} inView yOffset={4}>
            <p style={{ fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginBottom: '0.875rem' }}>
              The Team
            </p>
          </BlurFade>
          <BlurFade delay={0.1} inView yOffset={8}>
            <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, color: T.dark, margin: 0 }}>
              Meet the Officers
            </h2>
          </BlurFade>
          <BlurFade delay={0.18} inView yOffset={6}>
            <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.65, marginTop: '0.875rem', maxWidth: '54ch' }}>
              Meet the students who run our lessons, outreach, and events.
            </p>
          </BlurFade>
        </div>

        <div className="officers-grid">
          {OFFICERS.map((o, i) => {
            const accent = TEAM_ACCENT[o.team]
            return (
              <div key={o.name}>
                <BlurFade delay={i * 0.06} inView>
                  <TiltCard maxTilt={6}>
                    <GlowCard
                      className="officer-card glow-hover-lift"
                      style={{
                        background: 'rgba(17,17,24,0.8)',
                        borderRadius: 16,
                        padding: '1.75rem 1.75rem 1.5rem',
                        border: `1px solid ${T.border}`,
                        borderTop: `2px solid ${accent}`,
                        boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, border-top-color 0.22s',
                      }}
                    >
                      <div
                        style={{
                          width: 168,
                          height: 168,
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: T.alt,
                          border: `1px solid ${T.border}`,
                          boxShadow: `0 0 0 4px rgba(238,238,255,0.04), 0 8px 24px rgba(0,0,0,0.5)`,
                          marginBottom: '1.25rem',
                          flexShrink: 0,
                        }}
                      >
                        {/* The img carries its own dark backing: the photos have alpha holes from
                            background removal, and a background painted inside the img's filter
                            context fills them with the same dark the card showed behind them,
                            under any theme filter. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={o.photo}
                          alt={`${o.name}, ${o.role}`}
                          loading="lazy"
                          decoding="async"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', background: T.alt }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: T.inter,
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: accent,
                          background: `${accent}1a`,
                          border: `1px solid ${accent}33`,
                          borderRadius: 999,
                          padding: '4px 10px',
                          marginBottom: '0.75rem',
                        }}
                      >
                        {o.team}
                      </span>
                      <div style={{ fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '0.25rem' }}>
                        {o.name}
                      </div>
                      <div style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.45 }}>
                        {o.role}
                      </div>
                    </GlowCard>
                  </TiltCard>
                </BlurFade>
              </div>
            )
          })}
        </div>
      </section>

      {/* Goals — closing section of About */}
      <section aria-label="Our goals" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,4vw,3rem) 1.5rem' }}>
        <BlurFade inView delay={0.05} yOffset={4}>
          <p style={{ fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginBottom: '0.875rem' }}>
            Our Goals
          </p>
        </BlurFade>
        <BlurFade inView delay={0.1} yOffset={12}>
          <TextStagger
            text="What we plan to build"
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em] leading-[1.08]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
            Our goals include hackathons where members work in teams, test what they have learned, and present their projects.
          </p>
        </BlurFade>
      </section>

      {/* Year One Goals — staggered reveal */}
      <section aria-label="Year one goals" style={{ maxWidth: 1160, margin: '0 auto', padding: '1.5rem clamp(1.25rem,4vw,3rem) 3rem' }}>
        <BlurFade inView delay={0.05} yOffset={10}>
          <TextStagger
            text="Year One Goals"
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3vw,2.25rem)', color: T.dark, marginBottom: '1.75rem' }}
          />
        </BlurFade>
        <div className="goals-with-animation">
          <div>
            {YEAR_ONE.map((g, i) => (
              <BlurFade key={g} inView delay={0.1 + i * 0.05} yOffset={8}>
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
          </div>
          <BoxBurst />
        </div>
      </section>
    </div>
  )
}

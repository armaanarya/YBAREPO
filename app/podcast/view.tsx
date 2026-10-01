'use client'

import React from 'react'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { TiltCard } from '@/components/ui/tilt-card'
import { T } from '@/lib/theme'

export function PodcastView() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Coming Soon</Badge>
        <TextStagger
          text="The YBA podcast"
          stagger={0.025}
          direction="bottom"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '50ch', marginTop: '1.25rem' }}>
          Our upcoming podcast will feature student-hosted conversations with people working in blockchain. Follow YBA for episode announcements.
        </p>
      </BlurFade>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
        {['001','002','003'].map((ep, i) => (
          <BlurFade key={ep} delay={i * 0.08} inView>
            <TiltCard maxTilt={5}>
              <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadowMd, overflow: 'hidden', height: '100%' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: T.alt, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.cta, display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={T.ctaText}><polygon points="8,5 20,12 8,19"/></svg>
                  </div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.dark, opacity: 0.5 }}>Episode {ep}</p>
                  <p style={{ fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 700, color: T.dark, marginTop: '0.5rem' }}>Coming Soon</p>
                </div>
              </div>
            </TiltCard>
          </BlurFade>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        {[
          { href: 'https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg', label: 'Follow on TikTok' },
          { href: 'https://www.instagram.com/yba.net9?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr', label: 'Follow on Instagram' },
        ].map((s, i) => (
          <BlurFade key={s.label} inView delay={0.5 + i * 0.08} yOffset={8}>
            <a href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 500, color: T.dark, background: T.chip, borderRadius: 999, padding: '10px 20px', transition: 'background 0.2s', border: `1px solid ${T.border}`, display: 'inline-block' }}
              onMouseEnter={e => (e.currentTarget.style.background = T.chipHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.chip)}
            >
              {s.label}
            </a>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

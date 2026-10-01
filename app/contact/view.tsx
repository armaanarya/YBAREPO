'use client'

import React from 'react'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { GlowCard } from '@/components/ui/glow-card'
import { TiltCard } from '@/components/ui/tilt-card'
import { T } from '@/lib/theme'

const CONTACT_METHODS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-10 7L2 7"/>
      </svg>
    ),
    label: 'Email',
    value: 'armaanarya100@gmail.com',
    href: 'mailto:armaanarya100@gmail.com',
    cta: 'Send a message',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Phone',
    value: '(408) 603-4164',
    href: 'tel:+14086034164',
    cta: 'Give us a call',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    label: 'Instagram',
    value: '@yba.net9',
    href: 'https://www.instagram.com/yba.net9?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr',
    cta: 'Follow us',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
    label: 'TikTok',
    value: '@yba.official',
    href: 'https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg',
    cta: 'Follow us',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
    label: 'Donation Page',
    value: 'Support our mission',
    href: 'https://hcb.hackclub.com/donations/start/youth-blockchain-association',
    cta: 'Donate now',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    label: 'Our Links',
    value: 'lnk.bio/theyba',
    href: 'https://lnk.bio/theyba',
    cta: 'See all links',
  },
]

export function ContactView() {
  return (
    <div>
      {/* Header */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 0' }}>
        <Badge>Get in Touch</Badge>
        <h1 className="animate-fade-up" style={{ fontFamily: T.manrope, fontSize: 'clamp(2.5rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.06, marginTop: '1rem' }}>
          We'd love to<br />hear from you.
        </h1>
        <p className="animate-fade-up-2" style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '48ch', marginTop: '1.25rem' }}>
          Contact us with questions about membership or events. For partnerships and sponsorship, email us using the address below.
        </p>
      </section>

      {/* Contact cards */}
      <section aria-label="Contact methods" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,4vw,3rem) clamp(4rem,8vw,6rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
          {CONTACT_METHODS.map((m, i) => (
            <BlurFade key={m.label} inView delay={0.05 + i * 0.08} yOffset={12}>
            <TiltCard maxTilt={6}>
            <GlowCard
              as="a"
              href={m.href}
              target={m.href.startsWith('http') ? '_blank' : undefined}
              rel={m.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={`${m.label}: ${m.value}`}
              className="glow-hover-lift"
              style={{
                display: 'block',
                background: T.surface,
                borderRadius: 16,
                border: `1px solid ${T.border}`,
                borderLeft: '3px solid transparent',
                boxShadow: T.shadowMd,
                padding: '2rem',
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: T.accent }}>
                {m.icon}
              </div>
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted, marginBottom: '0.375rem' }}>
                {m.label}
              </p>
              <p style={{ fontFamily: T.manrope, fontSize: '1.125rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', marginBottom: '0.875rem', wordBreak: 'break-word' }}>
                {m.value}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 600, color: T.accent }}>
                {m.cta}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </GlowCard>
            </TiltCard>
            </BlurFade>
          ))}
        </div>

        {/* Info note */}
        <BlurFade inView delay={0.4} yOffset={10}>
          <div style={{ marginTop: '3rem', padding: '1.5rem 2rem', background: T.alt, borderRadius: 16, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.accent, flexShrink: 0, marginTop: '0.375rem' }} aria-hidden="true"/>
            <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7 }}>
              For <strong style={{ color: T.dark, fontWeight: 600 }}>partnership or sponsorship inquiries</strong>, feel free to reach out via email. We typically respond within 24–48 hours.
            </p>
          </div>
        </BlurFade>
      </section>
    </div>
  )
}

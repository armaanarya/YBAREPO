'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { T } from '@/lib/theme'
import { NAV_LINKS } from '@/lib/site-nav'

const linkStyle: React.CSSProperties = {
  display: 'block', fontFamily: T.inter, fontSize: '0.875rem', color: T.muted,
  padding: '4px 0', textAlign: 'left', transition: 'color 0.2s',
}

export function SiteFooter() {
  const pathname = usePathname()
  // The registration page intentionally has no footer (it was `page !== 'register'`
  // in the old single-page App component).
  if (pathname === '/register') return null

  return (
    <footer style={{ background: '#0a0a12', borderTop: `1px solid ${T.border}`, marginTop: '6rem', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,4vw,3rem)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <Image src="/yba-mark.svg" alt="YBA" width={40} height={40} style={{ filter: 'invert(1) brightness(2)' }}/>
            <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.dark, opacity: 0.55, marginTop: '0.625rem', lineHeight: 1.6 }}>
              Architecting the Future,<br/>One Block at a Time.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Pages</p>
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                  style={linkStyle}
                  onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Social</p>
              <a href="https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                TikTok
              </a>
              <a href={'https://www.instagram.com/yba.net9?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '0.375rem', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.75rem', color: T.dark, opacity: 0.35 }}>© 2026 Youth Blockchain Association. All rights reserved.</p>
          <Link href="/register"
            style={{ fontFamily: T.inter, fontSize: '0.8125rem', fontWeight: 600, background: T.cta, color: T.ctaText, borderRadius: 8, padding: '8px 20px', transition: 'background 0.2s, transform 0.12s' }}
            onMouseEnter={e => (e.currentTarget.style.background = T.ctaHover)}
            onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = '' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
          >
            Join YBA →
          </Link>
        </div>
      </div>
    </footer>
  )
}

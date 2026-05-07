'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { track } from '../lib/track'
import { YBANav } from '../components/ui/resizable-navbar'
import { BlurFade } from '../components/ui/blur-fade'
import { Hero, BgGradient, TextStagger, AnimatedContainer, HeroSpotlight } from '../components/ui/hero-animated'
import { GridPattern } from '../components/ui/grid-pattern'
import { GradientSurge } from '../components/ui/gradient-surge'
import { ParallaxLayer } from '../components/ui/parallax-layer'
import { Marquee } from '../components/ui/marquee'
import { GlowCard } from '../components/ui/glow-card'
import { MagneticButton } from '../components/ui/magnetic-button'
import { TiltCard } from '../components/ui/tilt-card'

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = 'home' | 'about' | 'goals' | 'curriculum' | 'podcast' | 'register' | 'contact'

// ─── Design Tokens ───────────────────────────────────────────────────────────
const T = {
  manrope: 'Manrope, sans-serif',
  inter:   'Inter, sans-serif',
  dark:    '#eeeeff',
  muted:   'rgba(238,238,255,0.5)',
  cta:     '#eeeeff',
  ctaHover:'#d4d4d8',
  ctaText: '#09090f',
  bg:      '#09090f',
  alt:     '#0d0d14',
  surface: '#111118',
  chip:    'rgba(238,238,255,0.08)',
  chipHover: 'rgba(238,238,255,0.15)',
  accent:  '#eeeeff',
  accentLight: 'rgba(238,238,255,0.06)',
  accentMid: 'rgba(238,238,255,0.18)',
  white:   '#111118',
  border:  'rgba(238,238,255,0.1)',
  borderHover: 'rgba(238,238,255,0.25)',
  shadowSm: '0 1px 3px rgba(0,0,0,0.4)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.5)',
  shadowLg: '0 24px 48px -12px rgba(0,0,0,0.7)',
}

// ─── Press feedback helper ────────────────────────────────────────────────────
const pressHandlers = {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'scale(0.96)' },
  onMouseUp:   (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = '' },
  onMouseLeave:(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = '' },
}

// ─── Static Logo ─────────────────────────────────────────────────────────────
function SpinningLogo({ size = 220 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    fetch('/yba-mark.svg').then(r => r.text()).then(svg => {
      el.innerHTML = svg
      const s = el.querySelector('svg')
      if (!s) return
      s.setAttribute('width', '100%')
      s.setAttribute('height', '100%')
      s.style.display = 'block'
      s.querySelectorAll('text, tspan').forEach(el => el.remove())
    })
  }, [])

  return (
    <div
      ref={ref}
      style={{ width: size, height: size, flexShrink: 0 }}
      role="img"
      aria-label="YBA logo"
    />
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Goals', page: 'goals' },
  { label: 'Curriculum', page: 'curriculum' },
  { label: 'Podcast', page: 'podcast' },
  { label: 'Contact', page: 'contact' },
]

function Nav({ current, nav }: { current: Page; nav: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [current])

  const go = (p: Page) => { nav(p); setMenuOpen(false) }

  return (
    <>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: scrolled ? 'rgba(249,249,255,0.92)' : 'rgba(249,249,255,0.72)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
          transition: 'border-color 0.25s, background 0.25s',
          padding: '0 clamp(1.25rem,4vw,3rem)',
          height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => go('home')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', borderRadius: 8 }}
          aria-label="Go to home"
        >
          <Image src="/yba-mark.svg" alt="YBA" width={34} height={34} priority />
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} role="list">
          {NAV_LINKS.map(l => {
            const active = current === l.page
            return (
              <button
                key={l.page}
                role="listitem"
                onClick={() => go(l.page)}
                style={{
                  fontFamily: T.inter, fontSize: '0.875rem', fontWeight: active ? 600 : 500,
                  color: active ? T.dark : T.muted,
                  background: 'transparent',
                  border: 'none', borderRadius: 8,
                  padding: '6px 14px', cursor: 'pointer',
                  transition: 'color 0.18s',
                  display: 'none',
                  position: 'relative',
                }}
                className={`nav-link${active ? ' nav-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = T.dark }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = T.muted }}
              >
                {l.label}
              </button>
            )
          })}

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 4, marginLeft: 8, alignItems: 'center' }}>
            <a
              href="https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg"
              target="_blank" rel="noopener noreferrer"
              aria-label="YBA TikTok"
              style={{ padding: 8, borderRadius: 8, color: T.muted, display: 'flex', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/yba.network_?igsh=NTc4MTIwNjQ2YQ=="
              target="_blank" rel="noopener noreferrer"
              aria-label="YBA Instagram"
              style={{ padding: 8, borderRadius: 8, color: T.muted, display: 'flex', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            {/* Join CTA */}
            <button
              onClick={() => go('register')}
              style={{
                fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 600,
                background: T.cta, color: T.ctaText,
                border: 'none', borderRadius: 8,
                padding: '8px 18px', cursor: 'pointer',
                transition: 'background 0.2s, transform 0.12s',
                marginLeft: 4,
                display: 'none',
              }}
              className="nav-join"
              onMouseEnter={e => (e.currentTarget.style.background = T.ctaHover)}
              onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = '' }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
              onMouseUp={e => (e.currentTarget.style.transform = '')}
            >
              Join
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                padding: 8, borderRadius: 8, background: 'none', border: 'none',
                cursor: 'pointer', color: T.dark, display: 'flex', flexDirection: 'column', gap: 5,
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="nav-hamburger"
            >
              <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none', display: 'block' }}/>
              <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1, display: 'block' }}/>
              <span style={{ width: 20, height: 2, background: 'currentColor', borderRadius: 2, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none', display: 'block' }}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: 'rgba(249,249,255,0.98)', backdropFilter: 'blur(16px)',
              borderBottom: `1px solid ${T.border}`,
              padding: '1rem 1.5rem 1.5rem',
            }}
          >
            {NAV_LINKS.map(l => (
              <button
                key={l.page}
                onClick={() => go(l.page)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  fontFamily: T.inter, fontSize: '1.0625rem', fontWeight: current === l.page ? 600 : 400,
                  color: current === l.page ? T.dark : T.muted,
                  background: 'none', border: 'none',
                  padding: '12px 0', cursor: 'pointer',
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go('register')}
              style={{
                marginTop: '1rem', width: '100%',
                fontFamily: T.inter, fontSize: '1rem', fontWeight: 600,
                background: T.cta, color: T.ctaText,
                border: 'none', borderRadius: 10,
                padding: '14px', cursor: 'pointer',
              }}
            >
              Join the Movement
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .nav-link { display: block !important; }
          .nav-join { display: block !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ nav }: { nav: (p: Page) => void }) {
  return (
    <footer style={{ background: '#0a0a12', borderTop: `1px solid ${T.border}`, marginTop: '6rem', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,4vw,3rem)' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <Image src="/yba-mark.svg" alt="YBA" width={40} height={40}/>
            <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.dark, opacity: 0.55, marginTop: '0.625rem', lineHeight: 1.6 }}>
              Architecting the Future,<br/>One Block at a Time.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Pages</p>
              {NAV_LINKS.map(l => (
                <button key={l.page} onClick={() => nav(l.page)}
                  style={{ display: 'block', fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
                >
                  {l.label}
                </button>
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
              <a href="https://www.instagram.com/yba.network_?igsh=NTc4MTIwNjQ2YQ==" target="_blank" rel="noopener noreferrer"
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
          <button onClick={() => nav('register')}
            style={{ fontFamily: T.inter, fontSize: '0.8125rem', fontWeight: 600, background: T.cta, color: T.ctaText, border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', transition: 'background 0.2s, transform 0.12s' }}
            onMouseEnter={e => (e.currentTarget.style.background = T.ctaHover)}
            onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = '' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
          >
            Join YBA →
          </button>
        </div>
      </div>
    </footer>
  )
}

// ─── Shared Components ────────────────────────────────────────────────────────
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      background: T.chip, color: T.dark, borderRadius: 999,
      padding: '0.375rem 1rem', display: 'inline-block',
      border: `1px solid ${T.border}`,
    }}>
      {children}
    </span>
  )
}

function SectionHeading({ children, size = 'lg' }: { children: React.ReactNode; size?: 'sm' | 'lg' }) {
  return (
    <h2 style={{
      fontFamily: T.manrope,
      fontSize: size === 'lg' ? 'clamp(2rem,4vw,3rem)' : 'clamp(1.5rem,3vw,2rem)',
      fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.08,
    }}>
      {children}
    </h2>
  )
}

// ─── Scroll Reveal Card ───────────────────────────────────────────────────────
function ScrollRevealSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref as React.RefObject<HTMLElement>, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 0.5], [18, 0])
  const scale  = useTransform(scrollYProgress, [0, 0.5], [0.92, 1])
  const y      = useTransform(scrollYProgress, [0, 1], [0, -60])

  const MODULES = [
    { num: '01', title: 'Blockchain Fundamentals', tag: 'Core' },
    { num: '02', title: 'Decentralized Finance (DeFi)', tag: 'Core' },
    { num: '03', title: 'Smart Contracts & Solidity', tag: 'Advanced' },
    { num: '04', title: 'Real-World Use Cases', tag: 'Applied' },
    { num: '05', title: 'Building Your First DApp', tag: 'Project' },
    { num: '06', title: 'Advanced Tokenomics', tag: 'Advanced' },
  ]

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,4vw,2rem)', overflow: 'hidden' }} aria-label="Curriculum preview">
      {/* @ts-ignore */}
      <motion.div style={{ translateY: y }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <Badge>Curriculum — Coming Soon</Badge>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.08, marginTop: '1rem' }}>
            The curriculum that<br />changes everything.
          </h2>
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.65, maxWidth: '48ch', margin: '1.25rem auto 0' }}>
            Peer-reviewed, built for high schoolers, inspired by the world's top blockchain programs.
          </p>
        </div>
      </motion.div>

      {/* Scroll-reveal card */}
      <div style={{ perspective: '1200px', maxWidth: 900, margin: '0 auto' }}>
        {/* @ts-ignore */}
        <motion.div
          style={{
            rotateX: rotate, scale,
            background: '#1a1d24',
            borderRadius: 28, border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 40px 80px -20px rgba(0,0,0,0.5)',
            padding: '4px',
            transformOrigin: 'top center',
          }}
        >
          {/* Window chrome */}
          <div style={{ background: '#111318', borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }}/>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }}/>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }}/>
              <span style={{ fontFamily: T.inter, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>YBA Learning Platform</span>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {MODULES.map((m, i) => (
                <BlurFade key={m.num} inView delay={0.15 + i * 0.06} yOffset={6}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                    borderRadius: 10, padding: '0.75rem 1rem',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ fontFamily: T.manrope, fontWeight: 800, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', minWidth: '2rem' }}>{m.num}</span>
                    <span style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', flex: 1 }}>{m.title}</span>
                    <span style={{
                      fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em',
                      background: m.tag === 'Advanced' ? 'rgba(238,238,255,0.18)' : m.tag === 'Project' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      color: m.tag === 'Advanced' ? '#eeeeff' : m.tag === 'Project' ? '#86efac' : 'rgba(255,255,255,0.5)',
                      borderRadius: 999, padding: '3px 10px',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>{m.tag}</span>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────
const PILLARS = [
  { icon: '◈', title: 'Foundational Literacy', desc: 'Peer-to-peer learning that breaks down blockchain barriers — decentralization, immutability, and transparency made accessible for teenagers.' },
  { icon: '◉', title: 'Real-World Application', desc: 'From DeFi and CBDCs to digital identity and supply chain — we study how blockchain is actively reshaping global industries right now.' },
  { icon: '◎', title: "Build, Don't Just Learn", desc: 'Hackathons, guest speakers, team-based projects, and professional networking — all before you graduate high school.' },
]
const CHIPS = ['Capital Markets','Digital Identity','CBDCs','Supply Chain','Healthcare','Media','DeFi','Stablecoins','Web3','NFTs']

function HomePage({ nav }: { nav: (p: Page) => void }) {
  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <Hero layout="default" className="min-h-[92svh] pt-20 pb-16 px-6">
        {/* Scroll-driven white-bloom gradient (surges then fades to black) */}
        <GradientSurge />

        {/* Animated dot grid */}
        <GridPattern />

        {/* Cursor-following spotlight (with scroll parallax drift) */}
        <ParallaxLayer speed={-0.3} className="absolute inset-0 pointer-events-none">
          <HeroSpotlight />
        </ParallaxLayer>

        {/* Noise grain overlay for premium texture */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            opacity: 0.4,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
          {/* Spinning logo */}
          <AnimatedContainer transition={{ delay: 0.1, duration: 0.6 }}>
            <SpinningLogo size={160} />
          </AnimatedContainer>

          {/* Badge */}
          <AnimatedContainer transition={{ delay: 0.2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: T.accentLight, border: `1px solid ${T.accentMid}`,
              borderRadius: 999, padding: '6px 16px',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, display: 'inline-block' }} />
              <span style={{ fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: T.accent }}>
                Registration 2026 Open
              </span>
            </div>
          </AnimatedContainer>

          {/* Staggered headline */}
          <TextStagger
            text="The Next Generation of Blockchain Builders."
            stagger={0.03}
            direction="bottom"
            className="text-[clamp(2.75rem,6vw,5rem)] leading-[1.05] tracking-[-0.03em] font-extrabold"
            style={{ fontFamily: T.manrope, color: T.dark }}
          />

          {/* Subtitle */}
          <AnimatedContainer transition={{ delay: 0.5 }}>
            <p style={{
              fontFamily: T.inter, fontSize: 'clamp(1rem,1.6vw,1.125rem)',
              color: T.muted, lineHeight: 1.75, maxWidth: '52ch',
            }}>
              YBA empowers high school students to understand, build, and lead within the decentralized future — through peer learning, real events, and direct industry access.
            </p>
          </AnimatedContainer>

          {/* CTAs */}
          <AnimatedContainer transition={{ delay: 0.65 }} className="flex gap-3 flex-wrap justify-center">
            <MagneticButton>
              <button
                onClick={() => { track('button_click', 'home', { button: 'join_hero' }); nav('register') }}
                style={{
                  fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600,
                  background: T.accent, color: T.ctaText,
                  border: 'none', borderRadius: 12, padding: '13px 30px',
                  cursor: 'pointer', transition: 'background 0.2s, transform 0.12s, box-shadow 0.2s',
                  boxShadow: '0 0 0 1px rgba(238,238,255,0.18), 0 4px 24px rgba(238,238,255,0.12)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = T.ctaHover; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(238,238,255,0.3), 0 8px 32px rgba(238,238,255,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(238,238,255,0.18), 0 4px 24px rgba(238,238,255,0.12)' }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
              >
                Join the Movement →
              </button>
            </MagneticButton>
            <MagneticButton strength={0.25}>
              <button
                onClick={() => nav('goals')}
                style={{
                  fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 500,
                  background: 'rgba(238,238,255,0.05)', color: T.dark,
                  border: `1.5px solid ${T.border}`, borderRadius: 12,
                  padding: '13px 26px', cursor: 'pointer',
                  transition: 'border-color 0.2s, background 0.2s, transform 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.background = 'rgba(238,238,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'rgba(238,238,255,0.05)'; e.currentTarget.style.transform = '' }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
              >
                See Our Goals
              </button>
            </MagneticButton>
          </AnimatedContainer>
        </div>
      </Hero>

      {/* Pillar Cards */}
      <section aria-label="Mission pillars" style={{ maxWidth: 1160, margin: '0 auto', padding: '2rem clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem' }}>
          {PILLARS.map((p, i) => (
            <BlurFade key={i} delay={i * 0.1} inView>
              <TiltCard maxTilt={6}>
                <GlowCard
                  className="pillar-card glow-hover-lift"
                  style={{ background: 'rgba(17,17,24,0.8)', borderRadius: 16, padding: '2rem', border: `1px solid ${T.border}`, borderLeft: '3px solid transparent', boxShadow: '0 2px 16px rgba(0,0,0,0.4)', height: '100%', transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s, border-left-color 0.22s' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontFamily: T.manrope, fontSize: '1.25rem', fontWeight: 800, color: T.accent }}>{p.icon}</span>
                  </div>
                  <div style={{ fontFamily: T.manrope, fontSize: '1.125rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', marginBottom: '0.625rem' }}>{p.title}</div>
                  <div style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.65 }}>{p.desc}</div>
                </GlowCard>
              </TiltCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Scroll-reveal curriculum section */}
      <ScrollRevealSection />

      {/* Industry chips — staggered reveal */}
      <section aria-label="Industries we cover" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem) clamp(3rem,5vw,4rem)' }}>
        <BlurFade delay={0.05} inView yOffset={4}>
          <p style={{ fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginBottom: '1rem' }}>
            Industries We Study
          </p>
        </BlurFade>
        <ParallaxLayer speed={0.15}>
          <Marquee speed={45}>
            {CHIPS.map(c => (
              <span
                key={c}
                className="chip"
                style={{
                  fontFamily: T.inter,
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  background: T.chip,
                  color: T.dark,
                  borderRadius: 999,
                  padding: '7px 16px',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  border: `1px solid ${T.border}`,
                }}
              >{c}</span>
            ))}
          </Marquee>
        </ParallaxLayer>
      </section>

      {/* Bridge CTA */}
      <section aria-label="Bridge to industry" style={{ background: T.alt, marginTop: '4rem', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative parallax-drifting grid */}
        <ParallaxLayer speed={-0.4} className="absolute inset-0 pointer-events-none">
          <GridPattern />
        </ParallaxLayer>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <BlurFade delay={0.05} inView yOffset={12} className="flex-1 min-w-[260px]">
            <TextStagger
              text="We Don't Just Study the Future. We Build It."
              stagger={0.02}
              direction="bottom"
              as="h2"
              className="font-extrabold tracking-[-0.02em] leading-[1.08]"
              style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
            />
            <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '1.125rem' }}>
              Our Guest Speaker Series connects members with developers, founders, and VCs from the blockchain world — Q&A sessions, career pathfinding, and network-building before you even graduate.
            </p>
          </BlurFade>
          <BlurFade delay={0.2} inView yOffset={8}>
            <MagneticButton>
              <button
                onClick={() => nav('register')}
                style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, border: 'none', borderRadius: 10, padding: '14px 32px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.2s, transform 0.12s', boxShadow: '0 0 0 1px rgba(238,238,255,0.18)' }}
                onMouseEnter={e => (e.currentTarget.style.background = T.ctaHover)}
                onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = '' }}
                onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
                onMouseUp={e => (e.currentTarget.style.transform = '')}
              >
                Apply Now →
              </button>
            </MagneticButton>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div>
      <section aria-label="Founder" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)', display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 'clamp(2rem,5vw,5rem)', alignItems: 'center' }} className="about-grid">
        <BlurFade inView delay={0.05} yOffset={16}>
          <div style={{ width: '100%', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', background: T.surface, boxShadow: T.shadowLg, border: `1px solid ${T.border}` }}>
            <Image src="/armaan.png" alt="Armaan Arya, Founder of YBA" width={560} height={700} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </BlurFade>
        <BlurFade inView delay={0.15} yOffset={12}>
          <Badge>Founder &amp; President</Badge>
          <h1 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,4.5vw,3.25rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.08, marginTop: '1rem' }}>Armaan Arya</h1>
          <div style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.75, marginTop: '1.25rem' }}>
            <p>A high school student with a mission to bring blockchain literacy to the next generation. Where most students first encounter decentralized technology in college — if at all — Armaan saw the gap and decided to fill it.</p>
            <p style={{ marginTop: '1rem' }}>The Youth Blockchain Association was born from a simple belief: teenagers shouldn't have to wait until university to understand the technology that will define their careers.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { href: 'https://www.tiktok.com/@yba.official?_r=1&_t=ZT-95eKaLZHeYg', label: 'TikTok', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
              { href: 'https://www.instagram.com/yba.network_?igsh=NTc4MTIwNjQ2YQ==', label: 'Instagram', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg> },
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
            Blockchain isn't just a financial tool — it's a foundational shift in how the world handles data, ownership, and trust. By introducing these concepts early, YBA prepares young adults to be creators — not just consumers — of the digital economy.
          </p>
        </BlurFade>
      </section>

      {/* Vision */}
      <section aria-label="Vision" style={{ background: T.alt, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', textAlign: 'center', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <BlurFade inView delay={0.05} yOffset={8}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginBottom: '1rem' }}>Our Vision</p>
          <p style={{ fontFamily: T.manrope, fontSize: 'clamp(1.375rem,3vw,2rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.35, maxWidth: '38ch', margin: '0 auto' }}>
            A global network of YBA chapters where teenagers are the primary drivers of decentralized innovation.
          </p>
        </BlurFade>
      </section>
    </div>
  )
}

// ─── Goals ────────────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Form Your Team', desc: 'Collaborate across schools and disciplines to tackle real blockchain challenges.' },
  { num: '02', title: 'Build Something Real', desc: '24–48 hours to prototype a smart contract or DApp addressing a social or economic problem.' },
  { num: '03', title: 'Pitch to Judges', desc: 'Present to industry professionals for feedback, mentorship, and competitive recognition.' },
]
const YEAR_ONE = [
  'Launch first YBA Hackathon with 50+ participants',
  'Host 10 Guest Speaker sessions in Year 1',
  'Establish YBA chapters at 5+ schools',
  'Partner with collegiate blockchain associations',
  'Create a certified blockchain literacy curriculum for high schoolers',
]

function GoalsPage() {
  return (
    <div>
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 2rem' }}>
        <BlurFade inView delay={0.05} yOffset={12}>
          <TextStagger
            text="Where Learning Meets Building."
            stagger={0.025}
            direction="bottom"
            as="h2"
            className="font-extrabold tracking-[-0.02em] leading-[1.08]"
            style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
          />
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
            YBA is action-driven. We organize real events where members apply knowledge under pressure, collaborate in teams, and ship real blockchain projects.
          </p>
        </BlurFade>
      </section>

      {/* Year One Goals — staggered reveal */}
      <section aria-label="Year one goals" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 clamp(1.25rem,4vw,3rem) 3rem' }}>
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
        {YEAR_ONE.map((g, i) => (
          <BlurFade key={i} inView delay={0.1 + i * 0.08} yOffset={8}>
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

      {/* Speaker */}
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

      {/* Hackathon card */}
      <section aria-label="Hackathon" style={{ maxWidth: 1160, margin: '3rem auto 0', padding: '0 clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)' }}>
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
            Team-based blockchain hackathons mirroring agile startup environments. Members rapidly prototype smart contracts and DApps — then pitch to industry judges for feedback and mentorship.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '1.125rem', marginTop: '2rem' }}>
            {STEPS.map((s, i) => (
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
          <button style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', marginTop: '2rem', transition: 'background 0.2s, transform 0.12s', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseEnter={e => { e.currentTarget.style.background = T.ctaHover; e.currentTarget.style.boxShadow = '0 4px 16px rgba(238,238,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)' }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = '')}
            aria-label="Get notified about YBA hackathon"
          >
            Get Notified
          </button>
        </div>
        </BlurFade>
      </section>
    </div>
  )
}

// ─── Curriculum ───────────────────────────────────────────────────────────────
const MODULES = ['Blockchain Fundamentals','Decentralized Finance (DeFi)','Smart Contracts & Solidity','Real-World Use Cases','Building Your First DApp','Advanced Tokenomics']

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MEETING_START = new Date(2026, 4, 31) // May 31 2026

function YBACalendar() {
  const [month, setMonth] = useState(4) // May = 4 (0-indexed)
  const year = 2026
  const START_M = 4, END_M = 11

  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const firstDayOfWk = new Date(year, month, 1).getDay()

  const isMeeting = (day: number) => {
    const d = new Date(year, month, day)
    return d.getDay() === 0 && d >= MEETING_START
  }

  const cells: (number | null)[] = [
    ...Array(firstDayOfWk).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div style={{ marginTop: '3.5rem' }}>
      <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '1rem' }}>YBA Calendar 2026</p>

      <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadowMd, overflow: 'hidden' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.5rem', borderBottom: `1px solid ${T.border}`, background: T.alt }}>
          <button
            onClick={() => setMonth(m => Math.max(START_M, m - 1))}
            disabled={month === START_M}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: month === START_M ? 'transparent' : T.surface, cursor: month === START_M ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: month === START_M ? T.muted : T.dark, opacity: month === START_M ? 0.3 : 1, transition: 'background 0.15s' }}
            aria-label="Previous month"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span style={{ fontFamily: T.manrope, fontWeight: 700, fontSize: '1.0625rem', color: T.dark }}>{MONTH_NAMES[month]} {year}</span>
          <button
            onClick={() => setMonth(m => Math.min(END_M, m + 1))}
            disabled={month === END_M}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: month === END_M ? 'transparent' : T.surface, cursor: month === END_M ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: month === END_M ? T.muted : T.dark, opacity: month === END_M ? 0.3 : 1, transition: 'background 0.15s' }}
            aria-label="Next month"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0.875rem 1rem 0.25rem' }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ textAlign: 'center', fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, color: d === 'Sun' ? T.accent : T.muted, paddingBottom: '0.5rem' }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', padding: '0 1rem 1.25rem' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const meeting = isMeeting(day)
            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.375rem 0.125rem', borderRadius: 8, background: meeting ? T.accentLight : 'transparent', cursor: meeting ? 'default' : 'default', minHeight: 52 }}>
                <span style={{ fontFamily: T.inter, fontSize: '0.875rem', fontWeight: meeting ? 700 : 400, color: meeting ? T.accent : T.dark }}>{day}</span>
                {meeting && (
                  <span style={{ fontFamily: T.inter, fontSize: '0.5625rem', fontWeight: 600, color: T.accent, textAlign: 'center', lineHeight: 1.3, marginTop: 3 }}>YBA Weekly<br/>Meeting</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: T.accentLight, border: `1.5px solid ${T.accent}`, display: 'inline-block', flexShrink: 0 }}/>
        <span style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted }}>Weekly Meeting</span>
      </div>

      {/* Info card */}
      <div style={{ marginTop: '1.25rem', padding: '1.25rem 1.5rem', background: T.alt, borderRadius: 14, border: `1px solid ${T.border}` }}>
        <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.dark, lineHeight: 1.7 }}>
          This calendar reflects all YBA activities for 2026 — weekly meetings, seminars, guest speaker sessions, hackathons, and everything in between.
        </p>
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '0.625rem' }}>
          If Sundays don't work for your schedule, we're always open to a change — reach out and we'll make it work.
        </p>
      </div>
    </div>
  )
}

function ModuleDetailPage({ index, title, onBack }: { index: number; title: string; onBack: () => void }) {
  const moduleNum = String(index + 1).padStart(2, '0')

  return (
    <section style={{ maxWidth: 920, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 500, color: T.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', marginLeft: '-10px', borderRadius: 8, transition: 'color 0.18s, background 0.18s', marginBottom: '1.75rem' }}
        onMouseEnter={e => { e.currentTarget.style.color = T.dark; e.currentTarget.style.background = T.alt }}
        onMouseLeave={e => { e.currentTarget.style.color = T.muted; e.currentTarget.style.background = 'transparent' }}
        aria-label="Back to curriculum"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Curriculum
      </button>

      <Badge>Module {moduleNum}</Badge>
      <TextStagger
        key={title}
        text={title}
        stagger={0.025}
        direction="bottom"
        as="h1"
        className="font-extrabold tracking-[-0.025em] leading-[1.07]"
        style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.5rem)', color: T.dark, marginTop: '1rem' }}
      />

      {/* Reading section */}
      <div style={{ marginTop: '3rem' }}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Reading</p>
        <div style={{ background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadowSm, padding: 'clamp(1.75rem,3vw,2.5rem)', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, fontStyle: 'italic' }}>Reading content — TBD</p>
        </div>
      </div>

      {/* Video section */}
      <div style={{ marginTop: '2.5rem' }}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Video</p>
        <div style={{ width: '100%', aspectRatio: '16/9', background: T.alt, borderRadius: 16, border: `1px solid ${T.border}`, boxShadow: T.shadowMd, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(238,238,255,0.06), transparent 60%)' }} aria-hidden="true"/>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.25)', position: 'relative', zIndex: 1 }} aria-label="Play video placeholder">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" aria-hidden="true"><polygon points="8,5 20,12 8,19"/></svg>
          </div>
          <span style={{ position: 'absolute', bottom: 16, left: 18, fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', zIndex: 1 }}>TBD</span>
        </div>
      </div>

      {/* Activity section */}
      <div style={{ marginTop: '2.5rem' }}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.35, marginBottom: '0.875rem' }}>Activity</p>
        <div style={{ background: T.alt, borderRadius: 16, border: `1px dashed ${T.borderHover}`, padding: 'clamp(1.75rem,3vw,2.5rem)', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, fontStyle: 'italic' }}>Activity — TBD</p>
        </div>
      </div>
    </section>
  )
}

function CurriculumPage() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)

  if (selectedModule !== null) {
    return <ModuleDetailPage index={selectedModule} title={MODULES[selectedModule]} onBack={() => setSelectedModule(null)} />
  }

  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Coming Soon</Badge>
        <TextStagger
          text="The Curriculum Is Being Built."
          stagger={0.025}
          direction="bottom"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '50ch', marginTop: '1.25rem' }}>
          A rigorous, peer-reviewed blockchain curriculum — from foundational concepts to DeFi protocols. Crafted for high schoolers. Inspired by the best university programs in the world.
        </p>
      </BlurFade>
      <BlurFade inView delay={0.18} yOffset={8}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginTop: '2.5rem', marginBottom: '0.875rem' }}>What's Coming</p>
      </BlurFade>
      <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.surface }}>
        {MODULES.map((m, i) => (
          <BlurFade key={i} inView delay={0.22 + i * 0.06} yOffset={6}>
            <button
              onClick={() => setSelectedModule(i)}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.125rem 1.5rem', background: i % 2 === 0 ? T.surface : T.alt, borderBottom: i < MODULES.length - 1 ? `1px solid ${T.border}` : 'none', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'background 0.18s, padding-left 0.18s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = T.chipHover; e.currentTarget.style.paddingLeft = '1.75rem' }}
              onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? T.surface : T.alt; e.currentTarget.style.paddingLeft = '1.5rem' }}
              aria-label={`Open Module ${i+1}: ${m}`}
            >
              <span style={{ fontFamily: T.manrope, fontWeight: 800, fontSize: '0.75rem', color: T.muted, minWidth: '4rem' }}>Module {i+1}</span>
              <span style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.dark, flex: 1 }}>{m}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </BlurFade>
        ))}
      </div>
      <BlurFade inView delay={0.6} yOffset={8}>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <input aria-label="Email for curriculum updates" placeholder="your@email.com" style={{ fontFamily: T.inter, fontSize: '0.9375rem', background: T.chip, border: `1px solid ${T.border}`, borderRadius: 10, padding: '12px 18px', width: 260, outline: 'none', color: T.dark }} />
          <button style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer' }}>Get Notified</button>
        </div>
      </BlurFade>

      <YBACalendar />
    </section>
  )
}

// ─── Podcast ──────────────────────────────────────────────────────────────────
function PodcastPage() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Coming Soon</Badge>
        <TextStagger
          text="The YBA Podcast."
          stagger={0.025}
          direction="bottom"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '50ch', marginTop: '1.25rem' }}>
          Conversations with the builders, thinkers, and founders shaping the decentralized world — hosted by the next generation asking the real questions.
        </p>
      </BlurFade>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
        {['001','002','003'].map((ep, i) => (
          <BlurFade key={ep} delay={i * 0.1} inView>
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
          { href: 'https://www.instagram.com/yba.network_?igsh=NTc4MTIwNjQ2YQ==', label: 'Follow on Instagram' },
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

// ─── Register ─────────────────────────────────────────────────────────────────
function RegisterPage({ nav }: { nav: (p: Page) => void }) {
  const [done, setDone]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<Record<string,string>>({})
  const startTracked           = useRef(false)
  const trackStart = () => { if (!startTracked.current) { startTracked.current = true; track('form_start', 'register') } }

  const validate = (fd: FormData) => {
    const e: Record<string,string> = {}
    if (!fd.get('name'))   e.name   = 'Name is required'
    if (!fd.get('email'))  e.email  = 'Email is required'
    if (!fd.get('school')) e.school = 'School is required'
    if (!fd.get('grade'))  e.grade  = 'Please select your grade'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const errs = validate(fd)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    track('form_submit', 'register')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       fd.get('name'),
          email:      fd.get('email'),
          school:     fd.get('school'),
          grade:      fd.get('grade'),
          build_idea: fd.get('build'),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unknown error')
      setDone(true)
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Something went wrong — please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '4rem 1.5rem', background: `linear-gradient(135deg, ${T.bg} 0%, ${T.alt} 100%)` }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(22,163,74,0.2)' }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </motion.div>
      <div>
        <h2 style={{ fontFamily: T.manrope, fontSize: '2.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em' }}>You're in.</h2>
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '34ch', marginTop: '0.75rem' }}>Welcome to YBA. We'll reach out with your next steps shortly.</p>
      </div>
      <button
        onClick={() => nav('home')}
        style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, background: T.cta, color: T.ctaText, border: 'none', borderRadius: 10, padding: '12px 28px', cursor: 'pointer', marginTop: '0.5rem', transition: 'background 0.2s, transform 0.12s' }}
        onMouseEnter={e => (e.currentTarget.style.background = T.ctaHover)}
        onMouseLeave={e => { e.currentTarget.style.background = T.cta; e.currentTarget.style.transform = '' }}
        onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
        onMouseUp={e => (e.currentTarget.style.transform = '')}
      >Back to Home</button>
    </motion.div>
  )

  const fieldStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', background: '#f4f4f5', border: `1.5px solid transparent`, borderRadius: 10, fontFamily: T.inter, fontSize: '1rem', color: '#09090f', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }
  const labelStyle: React.CSSProperties = { fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#44474a', display: 'block', marginBottom: '0.5rem' }
  const errStyle: React.CSSProperties   = { fontFamily: T.inter, fontSize: '0.8125rem', color: '#dc2626', marginTop: '0.375rem' }
  const focusBorder = '#09090f'

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, ${T.bg} 0%, ${T.alt} 100%)`, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(5rem,10vw,8rem) 1.25rem 4rem' }}>
      <div style={{ width: '100%', maxWidth: 920, display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 'clamp(2rem,4vw,4rem)', alignItems: 'start' }} className="reg-grid">
        {/* Left copy */}
        <BlurFade inView delay={0.05} yOffset={12}>
        <div style={{ paddingTop: '0.5rem' }}>
          <Badge>Registration 2026</Badge>
          <h1 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.5rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: '1rem' }}>Join the<br/>Movement.</h1>
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '34ch', marginTop: '1.125rem' }}>
            Become part of the next generation of blockchain builders. Your journey into decentralized technology starts here.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['No experience required','Real events & hackathons','Direct industry access'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.dark }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        </BlurFade>

        {/* Right — form */}
        <BlurFade inView delay={0.18} yOffset={12}>
        <div>
          {/* Glass card */}
          <div style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 20, border: `1px solid ${T.border}`, boxShadow: T.shadowLg, padding: 'clamp(1.75rem,4vw,2.5rem)' }}>
            <form onSubmit={handleSubmit} noValidate aria-label="YBA Registration form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="reg-name" style={labelStyle}>Name</label>
                  <input id="reg-name" name="name" type="text" placeholder="Your name" style={{ ...fieldStyle, borderColor: errors.name ? '#dc2626' : 'transparent' }}
                    onFocus={e => { e.target.style.borderColor = focusBorder; trackStart() }} onBlur={e => (e.target.style.borderColor = errors.name ? '#dc2626' : 'transparent')} required aria-describedby={errors.name ? 'err-name' : undefined} aria-invalid={!!errors.name} />
                  {errors.name && <p id="err-name" role="alert" style={errStyle}>{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="reg-email" style={labelStyle}>Email</label>
                  <input id="reg-email" name="email" type="email" placeholder="your@email.com" style={{ ...fieldStyle, borderColor: errors.email ? '#dc2626' : 'transparent' }}
                    onFocus={e => (e.target.style.borderColor = focusBorder)} onBlur={e => (e.target.style.borderColor = errors.email ? '#dc2626' : 'transparent')} required aria-describedby={errors.email ? 'err-email' : undefined} aria-invalid={!!errors.email} />
                  {errors.email && <p id="err-email" role="alert" style={errStyle}>{errors.email}</p>}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="reg-school" style={labelStyle}>School</label>
                  <input id="reg-school" name="school" type="text" placeholder="Your high school" style={{ ...fieldStyle, borderColor: errors.school ? '#dc2626' : 'transparent' }}
                    onFocus={e => (e.target.style.borderColor = focusBorder)} onBlur={e => (e.target.style.borderColor = errors.school ? '#dc2626' : 'transparent')} required aria-invalid={!!errors.school} />
                  {errors.school && <p role="alert" style={errStyle}>{errors.school}</p>}
                </div>
                <div>
                  <label htmlFor="reg-grade" style={labelStyle}>Grade</label>
                  <select id="reg-grade" name="grade" style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer', borderColor: errors.grade ? '#dc2626' : 'transparent' }}
                    onFocus={e => (e.currentTarget.style.borderColor = focusBorder)} onBlur={e => (e.currentTarget.style.borderColor = errors.grade ? '#dc2626' : 'transparent')} required aria-invalid={!!errors.grade}>
                    <option value="">Select grade</option>
                    <option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option>
                  </select>
                  {errors.grade && <p role="alert" style={errStyle}>{errors.grade}</p>}
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="reg-build" style={labelStyle}>What do you want to build? (Put N/A if you don't know)</label>
                <textarea id="reg-build" name="build" rows={3} placeholder="I want to build a decentralized app that..."
                  style={{ ...fieldStyle, resize: 'none' }}
                  onFocus={e => (e.target.style.borderColor = focusBorder)} onBlur={e => (e.target.style.borderColor = 'transparent')} />
              </div>
              {errors.submit && (
                <p role="alert" style={{ fontFamily: T.inter, fontSize: '0.875rem', color: '#dc2626', marginBottom: '0.875rem', padding: '0.75rem 1rem', background: '#fef2f2', borderRadius: 8 }}>
                  {errors.submit}
                </p>
              )}
              <button type="submit" disabled={loading}
                style={{ width: '100%', background: loading ? '#44474a' : '#09090f', color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontFamily: T.manrope, fontSize: '1.0625rem', fontWeight: 700, cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1a1c1e' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#09090f' }}
                aria-busy={loading}
              >
                {loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>}
                {loading ? 'Processing…' : 'Complete Registration'}
              </button>
              <p style={{ fontFamily: T.inter, fontSize: '0.75rem', color: T.muted, textAlign: 'center', marginTop: '1rem' }}>
                By joining, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>

          {/* Officer link — BELOW the white box */}
          <a
            href="https://docs.google.com/forms/u/1/d/e/1FAIpQLSenAFo38AY_SVwQkZxSfRKwD02WtL9WvTbiLDDR6nueIeXeBw/viewform?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleARQvtxleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaeopVqsE6hVUDF8yxmdF6HdYnAx2RW1lP8jIrTMJ-AE2GuKgxuQW-UGaW3K_g_aem_Rl0RZ3E5hOtb2g0W09rogw"
            target="_blank" rel="noopener noreferrer"
            onClick={() => track('officer_click', 'register')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '0.875rem', padding: '1rem 1.25rem',
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              borderRadius: 14, border: `1.5px solid ${T.border}`,
              fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(22,28,37,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = T.border }}
          >
            <span>Interested in Being a YBA Officer?</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        </BlurFade>
      </div>
    </div>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
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
    value: '@yba.network_',
    href: 'https://www.instagram.com/yba.network_?igsh=NTc4MTIwNjQ2YQ==',
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
]

function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 0' }}>
        <Badge>Get in Touch</Badge>
        <h1 className="animate-fade-up" style={{ fontFamily: T.manrope, fontSize: 'clamp(2.5rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.06, marginTop: '1rem' }}>
          We'd love to<br />hear from you.
        </h1>
        <p className="animate-fade-up-2" style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '48ch', marginTop: '1.25rem' }}>
          Questions about YBA, our events, or how to get involved? Reach out through any of the channels below — we respond quickly.
        </p>
      </section>

      {/* Contact cards */}
      <section aria-label="Contact methods" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,4vw,3rem) clamp(4rem,8vw,6rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}>
          {CONTACT_METHODS.map((m, i) => (
            <BlurFade key={m.label} inView delay={0.05 + i * 0.08} yOffset={10}>
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

// ─── App ──────────────────────────────────────────────────────────────────────
const PAGE_TRANSITIONS: Record<Page, { initial: any; animate: any; exit: any }> = {
  home:       { initial: { opacity: 0, y: 12, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: -8, filter: 'blur(6px)' } },
  about:      { initial: { opacity: 0, x: 24 },                       animate: { opacity: 1, x: 0 },                      exit: { opacity: 0, x: -16 } },
  goals:      { initial: { opacity: 0, y: 16 },                       animate: { opacity: 1, y: 0 },                      exit: { opacity: 0, y: -10 } },
  curriculum: { initial: { opacity: 0, scale: 0.985 },                animate: { opacity: 1, scale: 1 },                  exit: { opacity: 0, scale: 1.01 } },
  podcast:    { initial: { opacity: 0, y: 16 },                       animate: { opacity: 1, y: 0 },                      exit: { opacity: 0, y: -10 } },
  register:   { initial: { opacity: 0, scale: 0.97 },                 animate: { opacity: 1, scale: 1 },                  exit: { opacity: 0, scale: 0.99 } },
  contact:    { initial: { opacity: 0, x: -24 },                      animate: { opacity: 1, x: 0 },                      exit: { opacity: 0, x: 16 } },
}

export default function App() {
  const [page, setPage] = useState<Page>('home')

  const nav = (p: Page) => {
    setPage(p)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    track('page_view', p)
  }

  // Track initial page load
  useEffect(() => { track('page_view', 'home') }, [])

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <YBANav
        items={NAV_LINKS.map(l => ({ name: l.label, page: l.page }))}
        currentPage={page}
        onNavigate={nav}
      />
      <main id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={PAGE_TRANSITIONS[page].initial}
            animate={PAGE_TRANSITIONS[page].animate}
            exit={PAGE_TRANSITIONS[page].exit}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {page === 'home'       && <HomePage nav={nav} />}
            {page === 'about'      && <AboutPage />}
            {page === 'goals'      && <GoalsPage />}
            {page === 'curriculum' && <CurriculumPage />}
            {page === 'podcast'    && <PodcastPage />}
            {page === 'register'   && <RegisterPage nav={nav} />}
            {page === 'contact'    && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>
      {page !== 'register' && <Footer nav={nav} />}
    </>
  )
}

'use client'

import React, { useRef } from 'react'
import { Badge } from '@/components/site/badge'
import { HeroMark3D } from '@/components/site/hero-mark-3d'
import { PillarOrbit } from '@/components/site/pillar-orbit'
import { BlurFade } from '@/components/ui/blur-fade'
import { GridPattern } from '@/components/ui/grid-pattern'
import { HeroDotFlow } from '@/components/site/hero-dot-flow'
import { AnimatedContainer, Hero, TextStagger } from '@/components/ui/hero-animated'
import { HoverGlowButton } from '@/components/ui/hover-glow-button'
import { Marquee } from '@/components/ui/marquee'
import { ParallaxLayer } from '@/components/ui/parallax-layer'
import { T } from '@/lib/theme'
import { track } from '@/lib/track'
import { REGISTRATION_FORM_URL } from '@/lib/registration-link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ─── Scroll Reveal Card ───────────────────────────────────────────────────────
function ScrollRevealSection() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref as React.RefObject<HTMLElement>, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 0.5], [18, 0])
  const scale  = useTransform(scrollYProgress, [0, 0.5], [0.92, 1])
  const y      = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section ref={ref} style={{ position: 'relative', padding: 'clamp(4rem,8vw,8rem) clamp(1.25rem,4vw,2rem)', overflow: 'hidden' }} aria-label="Curriculum preview">
      {/* @ts-ignore */}
      <motion.div style={{ translateY: y }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', marginBottom: '3rem' }}>
          <Badge>Curriculum</Badge>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.08, marginTop: '1rem' }}>
            Learn blockchain<br />with other students.
          </h2>
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.65, maxWidth: '48ch', margin: '1.25rem auto 0' }}>
            Student-made lessons for high schoolers, starting with how blockchains work.
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
            <div style={{ padding: 'clamp(1.75rem,3vw,2.5rem)' }}>
              <BlurFade inView delay={0.15} yOffset={6}>
                <p style={{ fontFamily: T.inter, fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: '56ch' }}>
                  We are preparing a curriculum built around video lessons. For now, read our student-written articles on blockchain and Bitcoin.
                </p>
                <button
                  onClick={() => { track('button_click', 'home', { button: 'articles_preview' }); router.push('/articles') }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem', color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0 0 2px' }}
                >
                  Read our articles →
                </button>
              </BlurFade>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const PILLARS = [
  { title: 'Blockchain basics', desc: 'Learn how a shared transaction record works, why past entries are hard to change, and what decentralization means.' },
  { title: 'Blockchain in use', desc: 'Study blockchain uses in finance, digital identity, and supply chains, including where the technology falls short.' },
  { title: 'Student projects', desc: 'Work on projects with other students and hear from people building in blockchain.' },
]
const CHIPS = ['Capital Markets','Digital Identity','CBDCs','Supply Chain','Healthcare','Media','DeFi','Stablecoins','Web3','NFTs']


export function HomeView() {
  const router = useRouter()
  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <div id="hero" className="relative">
      <Hero layout="default" className="min-h-[92svh] pt-20 pb-16 px-6">
        {/* Animated dot grid */}
        <GridPattern />
        {/* Dotted shockwave that flows out with the logo's burst */}
        <HeroDotFlow />

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
          {/* Logo — live Spline scene that bursts across the first screen, then settles here */}
          <div className="relative z-10">
            <HeroMark3D />
          </div>

          {/* Headline — static, no entrance animation */}
          <span
            className="relative text-[clamp(2.75rem,6vw,5rem)] leading-[1.05] tracking-[-0.03em] font-extrabold"
            style={{ fontFamily: T.manrope, color: T.dark }}
          >
            Learn blockchain. Build with other students.
          </span>

          {/* Subtitle */}
          <AnimatedContainer transition={{ delay: 0.5 }}>
            <p style={{
              fontFamily: T.inter, fontSize: 'clamp(1rem,1.6vw,1.125rem)',
              color: T.muted, lineHeight: 1.75, maxWidth: '52ch',
            }}>
              YBA is a student-led community for high schoolers curious about blockchain. Learn the basics together, work on projects, and meet people in the field.
            </p>
          </AnimatedContainer>

          {/* CTAs */}
          <AnimatedContainer transition={{ delay: 0.65 }} className="flex gap-3 flex-wrap justify-center">
            <HoverGlowButton
              className="btn-press"
              onClick={() => { track('button_click', 'home', { button: 'join_hero' }); window.location.assign(REGISTRATION_FORM_URL) }}
              background={T.accent}
              textColor={T.ctaText}
              style={{
                fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600,
                borderRadius: 12, padding: '13px 30px',
                boxShadow: '0 0 0 1px rgba(238,238,255,0.18), 0 4px 24px rgba(238,238,255,0.12)',
              }}
            >
              Join YBA →
            </HoverGlowButton>
            <button
              className="btn-press"
              onClick={() => router.push('/about')}
              style={{
                fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 500,
                background: 'rgba(238,238,255,0.05)', color: T.dark,
                border: `1.5px solid ${T.border}`, borderRadius: 12,
                padding: '13px 26px', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.background = 'rgba(238,238,255,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = 'rgba(238,238,255,0.05)' }}
            >
              See Our Goals
            </button>
          </AnimatedContainer>
        </div>
      </Hero>
      </div>

      <PillarOrbit items={PILLARS} />

      {/* Scroll-reveal curriculum section */}
      <div id="curriculum-preview">
      <ScrollRevealSection />
      </div>

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

      <section id="apply" aria-label="Bridge to industry" style={{ background: T.alt, marginTop: '4rem', padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <BlurFade delay={0.05} inView yOffset={12} className="flex-1 min-w-[260px]">
            <TextStagger
              text="Hear from people building in blockchain."
              stagger={0.02}
              direction="bottom"
              as="h2"
              className="font-extrabold tracking-[-0.02em] leading-[1.08]"
              style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4vw,3rem)', color: T.dark }}
            />
            <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '1.125rem' }}>
              Our planned Guest Speaker Series will give members a chance to ask blockchain developers and founders about their work and how they got started.
            </p>
          </BlurFade>
          <BlurFade delay={0.2} inView yOffset={8}>
            <HoverGlowButton
              className="btn-press"
              onClick={() => window.location.assign(REGISTRATION_FORM_URL)}
              background={T.cta}
              textColor={T.ctaText}
              style={{ fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, borderRadius: 10, padding: '14px 32px', whiteSpace: 'nowrap', boxShadow: '0 0 0 1px rgba(238,238,255,0.18)' }}
            >
              Join YBA →
            </HoverGlowButton>
          </BlurFade>
        </div>
      </section>
    </div>
  )
}

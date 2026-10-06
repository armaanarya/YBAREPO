'use client'

import Link from 'next/link'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'

export function LessonsView() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Curriculum</Badge>
        <TextStagger
          text="All lessons"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
          Start with blockchain basics, learn how transactions work, then compare public and private blockchains. Our first three lessons are available now, with more student-made videos on the way.
        </p>
        <Link href="/curriculum" style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark, marginTop: '1.25rem', textDecoration: 'underline', textUnderlineOffset: 4 }}>
          ← Curriculum overview
        </Link>
      </BlurFade>

      <BlurFade inView delay={0.1} yOffset={12}>
        <div style={{ marginTop: '2.5rem', padding: 'clamp(1.25rem,3vw,2rem)', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>Lesson 1</p>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            What is blockchain?
          </h2>
          <iframe
            src="https://www.youtube.com/embed/ROsq-2XhVHg"
            title="Lesson 1: What is blockchain?"
            style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a
            href="https://www.youtube.com/watch?v=ROsq-2XhVHg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark, marginTop: '1.25rem', textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Watch on YouTube ↗
          </a>
        </div>
      </BlurFade>

      <BlurFade inView delay={0.15} yOffset={12}>
        <div style={{ marginTop: '2.5rem', padding: 'clamp(1.25rem,3vw,2rem)', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>Lesson 2</p>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            What happens in a blockchain transaction?
          </h2>
          <iframe
            src="https://www.youtube.com/embed/NeYV67I9ZC0"
            title="Lesson 2: What happens in a blockchain transaction?"
            style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a
            href="https://www.youtube.com/watch?v=NeYV67I9ZC0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark, marginTop: '1.25rem', textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Watch on YouTube ↗
          </a>
        </div>
      </BlurFade>

      <BlurFade inView delay={0.2} yOffset={12}>
        <div style={{ marginTop: '2.5rem', padding: 'clamp(1.25rem,3vw,2rem)', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
          <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>Lesson 3</p>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Public vs. private blockchains
          </h2>
          <iframe
            src="https://www.youtube.com/embed/H2Y7v54XnQ0"
            title="Lesson 3: Public vs. private blockchains"
            style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a
            href="https://www.youtube.com/watch?v=H2Y7v54XnQ0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark, marginTop: '1.25rem', textDecoration: 'underline', textUnderlineOffset: 4 }}
          >
            Watch on YouTube ↗
          </a>
        </div>
      </BlurFade>

    </section>
  )
}

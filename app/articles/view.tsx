'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { ARTICLES, MEDIUM_PUB } from '@/lib/articles'
import { T } from '@/lib/theme'
import { track } from '@/lib/track'

export function ArticlesView() {
  const ordered = [...ARTICLES].sort((a, b) => b.dateISO.localeCompare(a.dateISO))

  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Articles</Badge>
        <TextStagger
          text="Read. Learn. Build."
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
          Every article we publish, written by YBA students for students. Pick one below, or read them all on Medium.
        </p>
        <a
          href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer"
          onClick={() => track('button_click', 'articles', { button: 'medium_publication' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem' }}
        >
          Visit our Medium publication
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </a>
      </BlurFade>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
        {ordered.map((a, i) => (
          <BlurFade key={a.slug} inView delay={0.1 + i * 0.06} yOffset={8}>
            <Link
              href={`/articles/${a.slug}`}
              onClick={() => track('button_click', 'articles', { button: 'article_open', slug: a.slug })}
              style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', textAlign: 'left', textDecoration: 'none', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', padding: 0, transition: 'border-color 0.18s, transform 0.18s' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = '' }}
            >
              <span style={{ display: 'block', width: '100%', aspectRatio: '16/9', borderBottom: `1px solid ${T.border}`, overflow: 'hidden' }}>
                <Image src={a.image} alt={a.title} width={a.imageW} height={a.imageH} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.375rem 1.5rem 1.5rem' }}>
                <span style={{ display: 'block', fontFamily: T.inter, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.muted }}>{a.date} · {a.author}</span>
                <span style={{ display: 'block', fontFamily: T.manrope, fontSize: '1.25rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{a.title}</span>
                <span style={{ display: 'block', fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.6 }}>{a.excerpt}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontFamily: T.inter, fontSize: '0.875rem', fontWeight: 600, color: T.dark, marginTop: '0.375rem' }}>Read article →</span>
              </span>
            </Link>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

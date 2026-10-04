'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/site/badge'
import { AnimatedAccordion } from '@/components/ui/animated-accordion'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { ParallaxLayer } from '@/components/ui/parallax-layer'
import { StoryboardGrid, type StoryboardItem } from '@/components/site/storyboard/storyboard-grid'
import { ChainArt, PeersArt, SundaysArt, VideoArt } from '@/components/site/storyboard/curriculum-art'
import { T } from '@/lib/theme'

const CURRICULUM: readonly StoryboardItem[] = [
  { title: 'Video lessons', desc: 'The curriculum is built around video lessons for high schoolers.', Art: VideoArt },
  { title: 'Starts with the basics', desc: 'The first lessons cover how blockchains work. No coding experience is required.', Art: ChainArt },
  { title: 'Made by students', desc: 'YBA students make the lessons for other students their age.', Art: PeersArt },
  { title: 'Weekly Sunday meetings', desc: 'We meet every Sunday. The calendar below lists the 2026 dates.', Art: SundaysArt },
]

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
          This calendar shows our weekly Sunday meetings for 2026. We will share dates for other events as they are confirmed.
        </p>
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '0.625rem' }}>
          If Sundays do not work for you, contact us to discuss scheduling.
        </p>
      </div>
    </div>
  )
}

export function CurriculumView() {
  return (
    <section style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Badge>Available Now</Badge>
        <TextStagger
          text="Your first blockchain lesson is here."
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,5vw,3.75rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '52ch', marginTop: '1.25rem' }}>
          Watch our first video lesson on blockchain basics, made by students for high schoolers. More lessons are on the way.
        </p>
        <Link
          href="/curriculum/lessons"
          className="btn-press"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem' }}
        >
          View all lessons →
        </Link>
      </BlurFade>

      <StoryboardGrid items={CURRICULUM} label="What the curriculum includes" headingLevel="h2" />

      <ParallaxLayer speed={0.15}>
        <YBACalendar />
      </ParallaxLayer>

      {/* FAQ */}
      <BlurFade inView delay={0.1} yOffset={10}>
        <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.dark, opacity: 0.4, marginTop: 'clamp(3rem,6vw,5rem)', marginBottom: '0.875rem' }}>
          Common questions
        </p>
        <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Questions about joining YBA
        </h2>
      </BlurFade>
      <BlurFade inView delay={0.2} yOffset={12}>
        <AnimatedAccordion
          items={[
            { question: 'Who is YBA for?', answer: 'YBA is for high school students in grades 9–12 who are curious about blockchain. No technical background is required.' },
            { question: 'Is there a cost to participate?', answer: 'No. YBA is free to join, with support from partner sponsorships and grants.' },
            { question: 'Do I need to know how to code?', answer: 'No coding experience is required.' },
            { question: 'What happens after I apply?', answer: 'We will contact you with meeting details and event updates. Our current meetings are on Sundays.' },
          ]}
          style={{ maxWidth: 760 }}
        />
      </BlurFade>
    </section>
  )
}

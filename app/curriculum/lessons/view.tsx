'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'
import { PUBLISHED_LESSONS, QUIZ_LESSONS } from '@/lib/curriculum'

type Tab = 'videos' | 'quizzes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'videos', label: 'Videos' },
  { id: 'quizzes', label: 'Quizzes' },
]

const cardStyle: React.CSSProperties = {
  padding: 'clamp(1.25rem,3vw,2rem)', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}`,
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted,
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '11px 22px',
  background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem',
}

const linkStyle: React.CSSProperties = {
  display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark,
  textDecoration: 'underline', textUnderlineOffset: 4,
}

function TabSwitch({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div role="tablist" aria-label="Lesson content" style={{ display: 'inline-flex', gap: 4, padding: 4, marginTop: '2rem', background: T.chip, borderRadius: 12, border: `1px solid ${T.border}` }}>
      {TABS.map(t => {
        const active = t.id === tab
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active}
            aria-controls={`panel-${t.id}`}
            onClick={() => onChange(t.id)}
            className="btn-press"
            style={{
              padding: '9px 22px', borderRadius: 9, border: 0, cursor: 'pointer',
              fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem',
              background: active ? T.cta : 'transparent', color: active ? T.ctaText : T.dark,
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

function VideosPanel() {
  return (
    <>
      {PUBLISHED_LESSONS.map((lesson, i) => (
        <BlurFade key={lesson.slug} inView delay={0.05 + i * 0.05} yOffset={12}>
          <div style={{ ...cardStyle, marginTop: '2.5rem' }}>
            <p style={eyebrowStyle}>Lesson {lesson.number}</p>
            <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: T.dark, marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              {lesson.title}
            </h2>
            <iframe
              src={`https://www.youtube.com/embed/${lesson.youtubeId}`}
              title={`Lesson ${lesson.number}: ${lesson.title}`}
              style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem 1.5rem', marginTop: '1.25rem' }}>
              <Link href={`/curriculum/quizzes/${lesson.slug}`} className="btn-press" style={ctaStyle}>
                Take the Lesson {lesson.number} quiz →
              </Link>
              <a href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                Watch on YouTube ↗
              </a>
            </div>
          </div>
        </BlurFade>
      ))}
    </>
  )
}

function QuizzesPanel() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
      {QUIZ_LESSONS.map((lesson, i) => (
        <BlurFade key={lesson.slug} inView delay={0.05 + i * 0.05} yOffset={12}>
          <Link
            href={`/curriculum/quizzes/${lesson.slug}`}
            className="btn-press quiz-card"
            style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 220 }}
          >
            <p style={eyebrowStyle}>Lesson {lesson.number} quiz</p>
            <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.25rem,2.4vw,1.5rem)', fontWeight: 800, color: T.dark, lineHeight: 1.2, marginTop: '0.5rem' }}>
              {lesson.title}
            </h2>
            <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, marginTop: '0.5rem' }}>
              {lesson.quiz.length} questions · about 2 minutes
            </p>
            <span style={{ ...ctaStyle, alignSelf: 'flex-start', marginTop: 'auto' }}>Start quiz →</span>
          </Link>
        </BlurFade>
      ))}
    </div>
  )
}

export function LessonsView() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const tab: Tab = params.get('tab') === 'quizzes' ? 'quizzes' : 'videos'

  const setTab = (t: Tab) => {
    router.replace(t === 'videos' ? pathname : `${pathname}?tab=${t}`, { scroll: false })
  }

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
          Watch each lesson, then take its short quiz to check what you learned. Start with blockchain basics, learn how transactions work, then compare public and private blockchains. More student-made lessons are on the way.
        </p>
        <Link href="/curriculum" style={{ ...linkStyle, marginTop: '1.25rem' }}>
          ← Curriculum overview
        </Link>
        <div>
          <TabSwitch tab={tab} onChange={setTab} />
        </div>
      </BlurFade>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'videos' ? <VideosPanel /> : <QuizzesPanel />}
      </div>
    </section>
  )
}

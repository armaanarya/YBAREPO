'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { T } from '@/lib/theme'
import type { Lesson } from '@/lib/curriculum'

const LETTERS = ['A', 'B', 'C', 'D']

const linkStyle: React.CSSProperties = {
  display: 'inline-block', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600,
  color: T.dark, textDecoration: 'underline', textUnderlineOffset: 4,
}

const ctaStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '11px 22px',
  background: T.cta, color: T.ctaText, borderRadius: 10, border: 0, cursor: 'pointer',
  fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem',
}

const ghostStyle: React.CSSProperties = {
  ...ctaStyle, background: 'transparent', color: T.dark, border: `1px solid ${T.borderHover}`,
}

function resultLine(score: number, total: number) {
  if (score === total) return 'Perfect score. You know this lesson.'
  if (score >= total - 1) return 'Nearly perfect. Nice work.'
  if (score >= total / 2) return 'Good start. Rewatch the video to fill in the gaps.'
  return 'Give the video another watch, then try again.'
}

export function QuizView({ lesson }: { lesson: Lesson }) {
  const total = lesson.quiz.length
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const done = results.length === total && picked === null

  const question = lesson.quiz[index]
  const answered = picked !== null

  const pick = useCallback((i: number) => {
    if (answered || done) return
    setPicked(i)
    setResults(r => [...r, i === question.answer])
  }, [answered, done, question])

  const next = useCallback(() => {
    if (!answered) return
    setPicked(null)
    if (index < total - 1) setIndex(index + 1)
  }, [answered, index, total])

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setResults([])
  }

  // A–D (or 1–4) to answer, Enter to move on.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      const n = LETTERS.indexOf(k) >= 0 ? LETTERS.indexOf(k) : ['1', '2', '3', '4'].indexOf(k)
      if (n >= 0 && n < question.options.length) pick(n)
      // A focused button already turns Enter into a click; don't advance twice.
      else if (e.key === 'Enter' && answered && !(e.target instanceof HTMLButtonElement)) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pick, next, answered, question])

  const score = results.filter(Boolean).length

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Link href="/curriculum/lessons?tab=quizzes" style={{ ...linkStyle, fontSize: '0.875rem' }}>
          ← All quizzes
        </Link>
        <div style={{ marginTop: '1.5rem' }}>
          <Badge>Lesson {lesson.number} quiz</Badge>
        </div>
        <h1 style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.1, marginTop: '1rem' }}>
          {lesson.title}
        </h1>

        {/* Progress: one segment per question */}
        <div aria-hidden style={{ display: 'flex', gap: 6, marginTop: '2rem' }}>
          {lesson.quiz.map((_, i) => {
            const filled = i < results.length
            return (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: T.border, overflow: 'hidden' }}>
                <motion.div
                  initial={false}
                  animate={{ width: filled ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%', background: results[i] === false ? T.muted : T.dark }}
                />
              </div>
            )
          })}
        </div>
      </BlurFade>

      <div style={{ marginTop: '1.5rem', padding: 'clamp(1.25rem,3vw,2rem)', background: T.surface, borderRadius: 16, border: `1px solid ${T.border}` }}>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              role="status"
            >
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>Your score</p>
              <p style={{ fontFamily: T.manrope, fontSize: 'clamp(3.5rem,10vw,5.5rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.04em', lineHeight: 1, marginTop: '0.75rem' }}>
                {score}<span style={{ color: T.muted }}> / {total}</span>
              </p>
              <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.dark, lineHeight: 1.6, marginTop: '1rem' }}>
                {resultLine(score, total)}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button type="button" onClick={restart} className="btn-press" style={ctaStyle}>Retake quiz</button>
                <a href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`} target="_blank" rel="noopener noreferrer" className="btn-press" style={ghostStyle}>
                  Rewatch the video ↗
                </a>
              </div>
              <Link href="/curriculum/lessons?tab=quizzes" style={{ ...linkStyle, marginTop: '1.5rem' }}>
                Try another quiz →
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={{ fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.muted }}>
                Question {index + 1} of {total}
              </p>
              <h2 id="quiz-q" style={{ fontFamily: T.manrope, fontSize: 'clamp(1.25rem,2.6vw,1.625rem)', fontWeight: 700, color: T.dark, lineHeight: 1.3, marginTop: '0.625rem' }}>
                {question.q}
              </h2>

              <div role="group" aria-labelledby="quiz-q" style={{ display: 'grid', gap: '0.625rem', marginTop: '1.5rem' }}>
                {question.options.map((opt, i) => {
                  const isAnswer = i === question.answer
                  const isPicked = i === picked
                  const showRight = answered && isAnswer
                  const showWrong = answered && isPicked && !isAnswer
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pick(i)}
                      disabled={answered}
                      aria-pressed={isPicked}
                      className={answered ? undefined : 'quiz-option'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%', textAlign: 'left',
                        padding: '0.875rem 1rem', borderRadius: 12, cursor: answered ? 'default' : 'pointer',
                        fontFamily: T.inter, fontSize: '1rem', lineHeight: 1.45,
                        background: showRight ? T.cta : 'transparent',
                        color: showRight ? T.ctaText : T.dark,
                        border: `1px ${showWrong ? 'dashed' : 'solid'} ${showRight ? T.cta : showWrong ? T.dark : T.border}`,
                        opacity: answered && !showRight && !showWrong ? 0.45 : 1,
                        transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease, color 0.2s ease',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          flex: 'none', width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center',
                          fontSize: '0.8125rem', fontWeight: 700,
                          background: showRight ? T.ctaText : T.chip,
                          color: showRight ? T.cta : T.dark,
                        }}
                      >
                        {showRight ? '✓' : showWrong ? '✕' : LETTERS[i]}
                      </span>
                      <span style={{ textDecoration: showWrong ? 'line-through' : undefined }}>{opt}</span>
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div role="status" style={{ marginTop: '1.25rem', padding: '1rem 1.125rem', background: T.alt, borderRadius: 12, border: `1px solid ${T.border}` }}>
                      <p style={{ fontFamily: T.manrope, fontWeight: 800, fontSize: '1rem', color: T.dark }}>
                        {picked === question.answer ? 'Correct.' : 'Not quite.'}
                      </p>
                      <p style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.6, marginTop: '0.25rem' }}>
                        {question.why}
                      </p>
                    </div>
                    <button type="button" onClick={next} className="btn-press" style={{ ...ctaStyle, marginTop: '1.25rem' }} autoFocus>
                      {index < total - 1 ? 'Next question →' : 'See my score →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <p style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, marginTop: '1rem' }}>
          Tip: press A–D to answer and Enter to continue.
        </p>
      )}
    </section>
  )
}

'use client'

import React, { useRef, useState } from 'react'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { T } from '@/lib/theme'
import { track } from '@/lib/track'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export function RegisterView() {
  const router = useRouter()
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
          company:    fd.get('company'),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unknown error')
      setDone(true)
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'We could not submit your registration. Please try again.' })
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
        <TextStagger as="h2" text="You're in." stagger={0.04} direction="bottom" style={{ fontFamily: T.manrope, fontSize: '2.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em' }} />
        <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '34ch', marginTop: '0.75rem' }}>Your registration has been received. We will email you with meeting details and next steps.</p>
      </div>
      <button
        onClick={() => router.push('/')}
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
          <h1 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.5rem,5vw,3.75rem)', fontWeight: 800, color: T.dark, letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: '1rem' }}>Join<br/>YBA.</h1>
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '34ch', marginTop: '1.125rem' }}>
            Join other high school students learning about blockchain. Fill out the form and we will contact you with meeting details.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['No experience required','Projects and hackathons','Guest speaker sessions'].map(f => (
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
              {/* Honeypot — hidden from users, catches bots */}
              <input
                type="text" name="company" tabIndex={-1} autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <div className="reg-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
              <div className="reg-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label htmlFor="reg-school" style={labelStyle}>School</label>
                  <input id="reg-school" name="school" type="text" placeholder="Your high school" style={{ ...fieldStyle, borderColor: errors.school ? '#dc2626' : 'transparent' }}
                    onFocus={e => (e.target.style.borderColor = focusBorder)} onBlur={e => (e.target.style.borderColor = errors.school ? '#dc2626' : 'transparent')} required aria-invalid={!!errors.school} />
                  {errors.school && <p role="alert" style={errStyle}>{errors.school}</p>}
                </div>
                <div>
                  <label htmlFor="reg-grade" style={labelStyle}>Grade</label>
                  <select id="reg-grade" name="grade" style={{ ...fieldStyle, appearance: 'none', cursor: 'pointer', borderColor: errors.grade ? '#dc2626' : 'transparent', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2344474a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 36 }}
                    onFocus={e => (e.currentTarget.style.borderColor = focusBorder)} onBlur={e => (e.currentTarget.style.borderColor = errors.grade ? '#dc2626' : 'transparent')} required aria-invalid={!!errors.grade}>
                    <option value="">Select grade</option>
                    <option>Freshman</option><option>Sophomore</option><option>Junior</option><option>Senior</option>
                  </select>
                  {errors.grade && <p role="alert" style={errStyle}>{errors.grade}</p>}
                </div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="reg-build" style={labelStyle}>What would you like to build? (Optional)</label>
                <textarea id="reg-build" name="build" rows={3} placeholder="Share a project idea, or leave this blank."
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
                {loading ? 'Submitting…' : 'Submit registration'}
              </button>
              <p style={{ fontFamily: T.inter, fontSize: '0.75rem', color: '#55555f', textAlign: 'center', marginTop: '1rem' }}>
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
              fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: '#09090f',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = 'rgba(22,28,37,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = T.border }}
          >
            <span>Apply to be a YBA officer</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
        </BlurFade>
      </div>
    </div>
  )
}

'use client'

import { Badge } from '@/components/site/badge'
import { BoxBurst } from '@/ANIMATION STORAGE/box-burst'
import { GlassStepCard } from '@/components/ui/glass-step-card'
import { T } from '@/lib/theme'
import { REGISTRATION_FORM_URL } from '@/lib/registration-link'

const STEPS = [
  { num: '01', title: 'Form a team', desc: 'Team up with students from other schools to choose a problem to work on.' },
  { num: '02', title: 'Prototype or research', desc: 'Spend 24 to 48 hours building a smart contract or decentralized app, or researching a blockchain question around your chosen problem.' },
  { num: '03', title: 'Present to judges', desc: 'Share your prototype or research findings and get feedback from industry professionals.' },
]

const WORKSHOPS = [
  { num: '01', title: 'How Blockchain Works', desc: 'Learn how blocks link together and how computers check transactions.' },
  { num: '02', title: 'Real World Impact', desc: 'Compare uses in finance, digital identity, and supply chains. Discuss what works and what does not.' },
  { num: '03', title: 'Hands On Building', desc: 'Set up a wallet, explore a testnet, and write your first simple smart contract in a guided session.' },
]

const sectionStyle = {
  maxWidth: 1160,
  margin: '0 auto',
  padding: '0 clamp(1.25rem,4vw,3rem) clamp(3rem,6vw,5rem)',
}

export function HackathonView() {
  return (
    <div>
      <section className="hackathon-intro" style={{ ...sectionStyle, paddingTop: 'clamp(5rem,10vw,8rem)', paddingBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: T.manrope, fontSize: 'clamp(2.25rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.08, color: T.dark }}>
            Hackathons, workshops, and speakers
          </h1>
          <p style={{ fontFamily: T.inter, fontSize: '1.0625rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '1.25rem' }}>
            We are planning events where high school students can build blockchain projects, explore research questions, and meet people in the field.
          </p>
        </div>
        <BoxBurst />
      </section>

      <section aria-label="Hackathon" style={sectionStyle}>
        <div className="hackathon-stage">
          <Badge>Coming Soon</Badge>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: T.dark, marginTop: '1rem' }}>
            YBA Hackathon Series
          </h2>
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '58ch', marginTop: '0.875rem' }}>
            Build a prototype or pursue a blockchain research project with a team, then share your work with industry judges for feedback.
          </p>
          <ol className="glass-step-grid" aria-label="Hackathon steps">
            {STEPS.map(step => <GlassStepCard key={step.num} {...step} />)}
          </ol>
          <a className="event-signup btn-press" href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" aria-label="Sign up for the YBA hackathon">
            Sign up for the hackathon
          </a>
        </div>
      </section>

      <section aria-label="Guest Speaker Series" style={{ background: T.alt, padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,4vw,3rem)', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1064, margin: '0 auto' }}>
          <Badge>Coming Soon</Badge>
          <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: T.dark, marginTop: '1rem' }}>
            Guest Speaker Series
          </h2>
          <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '54ch', marginTop: '0.875rem' }}>
            Ask developers and founders about their projects, the problems they face, and careers in blockchain.
          </p>
          <ul style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', flexWrap: 'wrap', listStyle: 'none' }}>
            {['Direct Q&A', 'Explore careers', 'Meet guest speakers'].map(text => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.dark }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: T.accent, flexShrink: 0 }} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Workshops" style={{ ...sectionStyle, paddingTop: 'clamp(3rem,6vw,5rem)' }}>
        <Badge>Coming Soon</Badge>
        <h2 style={{ fontFamily: T.manrope, fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: T.dark, marginTop: '1rem' }}>
          YBA Workshops
        </h2>
        <p style={{ fontFamily: T.inter, fontSize: '1rem', color: T.muted, lineHeight: 1.7, maxWidth: '58ch', marginTop: '0.875rem' }}>
          Our planned workshops cover blockchain basics and guided exercises, including setting up a wallet and testing a simple smart contract.
        </p>
        <ol className="glass-step-grid" aria-label="Workshop topics">
          {WORKSHOPS.map(step => <GlassStepCard key={step.num} {...step} />)}
        </ol>
        <a className="event-signup btn-press" href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" aria-label="Sign up for YBA workshops">
          Sign up for workshops
        </a>
      </section>
    </div>
  )
}

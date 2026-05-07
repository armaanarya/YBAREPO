'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface Testimonial {
  quote: string
  name: string
  role: string
}

interface TestimonialColumnsProps {
  testimonials: Testimonial[]
  /** className for the outer wrapper. */
  className?: string
  /** Inline style for outer wrapper. */
  style?: React.CSSProperties
}

interface ColumnProps {
  items: Testimonial[]
  duration: number
  hideAt?: 'md' | 'lg'
}

function Column({ items, duration, hideAt }: ColumnProps) {
  const hideClass =
    hideAt === 'md' ? 'hide-below-md' : hideAt === 'lg' ? 'hide-below-lg' : ''
  return (
    <div className={hideClass} style={{ overflow: 'hidden', maxHeight: 720 }}>
      <motion.ul
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 18, listStyle: 'none', margin: 0, padding: 0 }}
      >
        {[0, 1].map(loop => (
          <React.Fragment key={loop}>
            {items.map((t, i) => (
              <li
                key={`${loop}-${i}`}
                aria-hidden={loop === 1 ? 'true' : 'false'}
                style={{
                  background: 'rgba(17,17,24,0.6)',
                  border: '1px solid rgba(238,238,255,0.08)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  maxWidth: 320,
                  width: '100%',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.9375rem', color: 'rgba(238,238,255,0.85)', lineHeight: 1.65, margin: 0 }}>
                  {t.quote}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'Manrope, system-ui, sans-serif', fontSize: '0.875rem', fontWeight: 600, color: '#eeeeff' }}>{t.name}</span>
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: 'rgba(238,238,255,0.5)' }}>{t.role}</span>
                </div>
              </li>
            ))}
          </React.Fragment>
        ))}
      </motion.ul>
    </div>
  )
}

/**
 * Three-column infinite-scrolling testimonial wall. Top/bottom faded by mask.
 * Columns pause at different speeds for organic feel.
 */
export function TestimonialColumns({ testimonials, className, style }: TestimonialColumnsProps) {
  // Split into 3 roughly equal slices
  const len = testimonials.length
  const a = Math.ceil(len / 3)
  const b = Math.ceil((2 * len) / 3)
  const col1 = testimonials.slice(0, a)
  const col2 = testimonials.slice(a, b)
  const col3 = testimonials.slice(b)

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        maskImage:
          'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        ...style,
      }}
    >
      <style>{`
        .hide-below-md { display: block; }
        .hide-below-lg { display: block; }
        @media (max-width: 768px) {
          .hide-below-md { display: none; }
          .hide-below-lg { display: none; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .hide-below-lg { display: none; }
        }
      `}</style>
      <Column items={col1.length ? col1 : testimonials} duration={28} />
      <Column items={col2.length ? col2 : testimonials} duration={36} hideAt="md" />
      <Column items={col3.length ? col3 : testimonials} duration={32} hideAt="lg" />
    </div>
  )
}

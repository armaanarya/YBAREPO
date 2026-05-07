'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export interface AccordionItem {
  question: string
  answer: React.ReactNode
}

interface AnimatedAccordionProps {
  items: AccordionItem[]
  /** Optional className. */
  className?: string
  /** Inline style on outer wrapper. */
  style?: React.CSSProperties
}

/**
 * Glassmorphic dark-theme accordion with framer-motion height animation
 * and a +/- icon swap on toggle.
 */
export function AnimatedAccordion({ items, className, style }: AnimatedAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div
      className={className}
      style={{
        background: 'rgba(17,17,24,0.5)',
        border: '1px solid rgba(238,238,255,0.08)',
        borderRadius: 16,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {items.map((item, idx) => {
        const isOpen = openIdx === idx
        return (
          <div
            key={idx}
            style={{
              borderTop: idx === 0 ? 'none' : '1px solid rgba(238,238,255,0.06)',
            }}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '1.25rem 1.5rem',
                background: 'transparent',
                border: 'none',
                color: '#eeeeff',
                fontFamily: 'Manrope, system-ui, sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background 180ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(238,238,255,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ flex: 1, paddingRight: 16, lineHeight: 1.45 }}>{item.question}</span>
              <span
                aria-hidden
                style={{
                  position: 'relative',
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: 12,
                    height: 1.5,
                    background: '#eeeeff',
                    transition: 'transform 240ms ease',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    width: 12,
                    height: 1.5,
                    background: '#eeeeff',
                    transform: isOpen ? 'rotate(0deg)' : 'rotate(90deg)',
                    transition: 'transform 240ms ease',
                  }}
                />
              </span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '0 1.5rem 1.5rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.9375rem',
                  color: 'rgba(238,238,255,0.7)',
                  lineHeight: 1.7,
                }}
              >
                {item.answer}
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}

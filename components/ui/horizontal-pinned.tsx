'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface HorizontalPinnedProps {
  children: ReactNode
  /** Vertical scroll runway, in viewport heights. Default 300 (3 viewport heights). */
  heightVh?: number
  /** How far the children translate as a percentage of their own width. Default 75. */
  travelPercent?: number
  className?: string
}

/**
 * Pins a 100vh container while the user scrolls vertically through `heightVh` viewport heights;
 * children translate horizontally during the pin window.
 *
 * On mobile (<768px) or with prefers-reduced-motion, falls back to native horizontal scroll.
 */
export function HorizontalPinned({
  children,
  heightVh = 300,
  travelPercent = 75,
  className = '',
}: HorizontalPinnedProps) {
  const targetRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const { scrollYProgress } = useScroll({ target: targetRef })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${travelPercent}%`])

  if (reduceMotion || isMobile) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <section
      ref={targetRef}
      className={className}
      style={{ position: 'relative', height: `${heightVh}vh` }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            x,
            display: 'flex',
            gap: '1.5rem',
            paddingLeft: '4rem',
            paddingRight: '4rem',
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}

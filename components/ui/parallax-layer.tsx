'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxLayerProps {
  children: ReactNode
  /**
   * Drift strength. Positive = element drifts UP as you scroll past (faster than page).
   * Negative = drifts DOWN (slower than page / opposite direction).
   * Typical range: -0.5 to 0.5. Default 0.3.
   */
  speed?: number
  className?: string
}

export function ParallaxLayer({ children, speed = 0.3, className = '' }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}px`, `${-speed * 100}px`],
  )

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} style={{ y, willChange: 'transform' }} className={className}>
      {children}
    </motion.div>
  )
}

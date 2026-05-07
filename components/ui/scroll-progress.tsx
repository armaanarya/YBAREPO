'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

interface ScrollProgressProps {
  /** Bar height in px. Default 2. */
  height?: number
  /** Position. Default 'top'. */
  position?: 'top' | 'bottom'
  /** CSS gradient for the bar. */
  gradient?: string
  /** z-index. Default 70 (above navbar shadow, below modals). */
  zIndex?: number
}

/**
 * Page-level scroll progress bar. Spring-physics scaleX 0→1.
 * Fixed, full-width. Sits above all page content.
 */
export function ScrollProgress({
  height = 2,
  position = 'top',
  gradient = 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
  zIndex = 70,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        [position]: 0,
        height,
        background: gradient,
        transformOrigin: '0% 50%',
        scaleX,
        zIndex,
        pointerEvents: 'none',
        boxShadow: '0 0 12px rgba(168, 85, 247, 0.45)',
      }}
    />
  )
}

'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const GRADIENT = `radial-gradient(ellipse 90% 72% at 50% -8%,
  rgba(255,255,255,0.95) 0%,
  rgba(238,238,255,0.7) 15%,
  rgba(238,238,255,0.35) 35%,
  rgba(238,238,255,0.08) 60%,
  rgba(9,9,15,0) 100%)`

/**
 * Scroll-driven hero gradient.
 * - 0 → 800px scrollY:  scale grows from 1 to 2.5 (the "surge")
 * - 800 → 1200px:       opacity fades 1 → 0 (the "disappear past hero")
 * After 1200px the body's #09090f background shows through.
 */
export function GradientSurge() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 800], [1, 2.5], { clamp: true })
  const opacity = useTransform(scrollY, [800, 1200], [1, 0], { clamp: true })

  if (reduceMotion) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full select-none"
        style={{
          background: '#09090f',
          backgroundImage: GRADIENT,
        }}
      />
    )
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full select-none"
      style={{
        background: '#09090f',
        backgroundImage: GRADIENT,
        scale,
        opacity,
        transformOrigin: 'center top',
        willChange: 'transform, opacity',
      }}
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'

interface NumberCounterProps {
  to: number
  duration?: number
  suffix?: string
  prefix?: string
}

export function NumberCounter({
  to,
  duration = 1.6,
  suffix = '',
  prefix = '',
}: NumberCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => controls.stop()
  }, [inView, to, duration, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

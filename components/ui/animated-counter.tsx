'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface AnimatedCounterProps {
  /** Target value to count to. */
  to: number
  /** Starting value. Default 0. */
  from?: number
  /** Duration in seconds. Default 2.0. */
  duration?: number
  /** Prefix string (e.g. '$'). */
  prefix?: string
  /** Suffix string (e.g. '+', 'k'). */
  suffix?: string
  /** Decimal places. Default 0 (integers). */
  decimals?: number
  /** className for the wrapping span. */
  className?: string
  /** Inline style for the wrapping span. */
  style?: React.CSSProperties
  /** Trigger when in view. Default true. */
  inViewTrigger?: boolean
}

/**
 * Animates a number from `from` to `to` when scrolled into view.
 * Uses framer-motion spring physics for natural easing.
 */
export function AnimatedCounter({
  to,
  from = 0,
  duration = 2.0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  style,
  inViewTrigger = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [display, setDisplay] = useState(from)

  const motionValue = useMotionValue(from)
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  const rounded = useTransform(spring, latest =>
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString()
  )

  useEffect(() => {
    if (inViewTrigger && inView) motionValue.set(to)
    else if (!inViewTrigger) motionValue.set(to)
  }, [inView, motionValue, to, inViewTrigger])

  useEffect(() => {
    const unsub = rounded.on('change', v => setDisplay(parseFloat(v)))
    return unsub
  }, [rounded])

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      <motion.span style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>
        {decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString()}
      </motion.span>
      {suffix}
    </span>
  )
}

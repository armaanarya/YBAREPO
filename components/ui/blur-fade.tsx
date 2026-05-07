'use client'

import { useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  type UseInViewOptions,
  type Variants,
} from 'framer-motion'

type MarginType = UseInViewOptions['margin']
type Direction = 'up' | 'down' | 'left' | 'right'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  variant?: { hidden: { y?: number; x?: number }; visible: { y?: number; x?: number } }
  duration?: number
  delay?: number
  yOffset?: number
  direction?: Direction
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
}

export function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  direction = 'up',
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
}: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  const isInView = !inView || inViewResult

  // Map direction → axis offsets. 'up' (default) and 'down' use Y; 'left'/'right' use X.
  const offset = yOffset
  const hidden =
    direction === 'up'
      ? { x: 0, y: offset }
      : direction === 'down'
      ? { x: 0, y: -offset }
      : direction === 'left'
      ? { x: offset, y: 0 }
      : { x: -offset, y: 0 } // right

  const visible =
    direction === 'up'
      ? { x: 0, y: -offset }
      : direction === 'down'
      ? { x: 0, y: offset }
      : direction === 'left'
      ? { x: -offset, y: 0 }
      : { x: offset, y: 0 } // right

  const defaultVariants: Variants = {
    hidden: { ...hidden, opacity: 0, filter: `blur(${blur})` },
    visible: { ...visible, opacity: 1, filter: 'blur(0px)' },
  }
  const combinedVariants = variant || defaultVariants

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{ delay: 0.04 + delay, duration, ease: 'easeOut' }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

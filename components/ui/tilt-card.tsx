'use client'

import { useEffect, useRef, useState, ReactNode, CSSProperties, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxTilt?: number
}

export function TiltCard({
  children,
  className = '',
  style,
  maxTilt = 8,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [interactive, setInteractive] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 18 })
  const sy = useSpring(y, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt])
  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt])

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setInteractive(mq.matches)
    const h = (e: MediaQueryListEvent) => setInteractive(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    x.set((e.clientX - r.left) / r.width - 0.5)
    y.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (!interactive) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...style, rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

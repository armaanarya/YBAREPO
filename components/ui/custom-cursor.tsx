'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 36, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 36, mass: 0.4 })
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    setEnabled(mq.matches)
    const handler = () => setEnabled(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement | null
      const interactive = !!t?.closest('a, button, [role="button"], input, select, textarea')
      setHovering(interactive)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[80] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#eeeeff] mix-blend-difference"
      style={{
        left: sx,
        top: sy,
        width: hovering ? 36 : 10,
        height: hovering ? 36 : 10,
        transition: 'width 0.18s, height 0.18s',
      }}
    />
  )
}

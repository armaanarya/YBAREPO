'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './box-burst.module.css'

// Six cubes along each side of a diamond: 24 boxes in total.
const CORNERS = [[0, -52], [52, 0], [0, 52], [-52, 0]]
const BOXES = Array.from({ length: 24 }, (_, index) => {
  const side = Math.floor(index / 6)
  const t = (index % 6 + 0.5) / 6
  const from = CORNERS[side]
  const to = CORNERS[(side + 1) % 4]
  const x = from[0] + (to[0] - from[0]) * t
  const y = from[1] + (to[1] - from[1]) * t
  const angle = Math.atan2(y, x) + Math.sin(index * 2.4) * 0.35
  const radius = 92 + (index % 4) * 17
  return {
    '--home-x': `${x}px`,
    '--home-y': `${y}px`,
    '--burst-x': `${Math.cos(angle) * radius}px`,
    '--burst-y': `${Math.sin(angle) * radius * 0.82}px`,
    '--turn': `${(index % 2 ? 1 : -1) * (80 + index * 11)}deg`,
    '--delay': `${(index % 6) * 35}ms`,
  } as CSSProperties
})

/** A contained, reusable version of the original logo's burst-and-return. */
export function BoxBurst({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => {
      element.dataset.active = String(visible && !document.hidden && !motion.matches)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { threshold: 0.15 })
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
    }
  }, [])

  return (
    <div ref={ref} className={`${styles.scene} ${className}`} aria-hidden="true" data-active="false">
      {BOXES.map((style, index) => (
        <span key={index} className={styles.cube} style={style}>
          <span className={styles.front} />
          <span className={styles.back} />
          <span className={styles.top} />
          <span className={styles.bottom} />
          <span className={styles.side} />
          <span className={styles.left} />
        </span>
      ))}
    </div>
  )
}

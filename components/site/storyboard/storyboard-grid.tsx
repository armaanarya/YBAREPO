'use client'

import { useEffect, useRef, type ComponentType } from 'react'
import s from './storyboard.module.css'

export type StoryboardItem = { title: string; desc: string; Art: ComponentType }

// Layout follows the four-panel feature grid on base.org: a line-art system
// diagram in a quiet frame, the title and description set beneath it.
export function StoryboardGrid({ items, label, headingLevel = 'h3' }: {
  items: readonly StoryboardItem[]
  label: string
  headingLevel?: 'h2' | 'h3'
}) {
  return (
    <ul className={s.grid} aria-label={label}>
      {items.map(item => <StoryboardCard key={item.title} {...item} Heading={headingLevel} />)}
    </ul>
  )
}

function StoryboardCard({ title, desc, Art, Heading }: StoryboardItem & { Heading: 'h2' | 'h3' }) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Loops run only while the panel is on screen, the tab is visible, and the
  // visitor has not asked for reduced motion.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    const update = () => {
      panel.dataset.active = String(visible && !document.hidden && !motion.matches)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    }, { threshold: 0.25 })
    observer.observe(panel)
    document.addEventListener('visibilitychange', update)
    motion.addEventListener('change', update)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
      motion.removeEventListener('change', update)
    }
  }, [])

  return (
    <li className={s.card}>
      <div ref={panelRef} className={s.panel} data-active="false">
        <Art />
      </div>
      <Heading className={s.title}>{title}</Heading>
      <p className={s.desc}>{desc}</p>
    </li>
  )
}

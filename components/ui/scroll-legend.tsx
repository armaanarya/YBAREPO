'use client'

import { useState, useEffect } from 'react'

interface LegendItem {
  id: string
  name: string
}

interface ScrollLegendProps {
  items: LegendItem[]
  /** Hide on viewports narrower than this (px). Default 1024 (lg). */
  hideBelow?: number
  /** Active accent color. Default '#a78bfa' (violet-400). */
  activeColor?: string
}

/**
 * Fixed left-edge section indicator. Each item is a tick mark; the active
 * section's tick extends + colors. Hovering anywhere on the legend reveals
 * section names. Click to scroll the section into view.
 */
export function ScrollLegend({
  items,
  hideBelow = 1024,
  activeColor = '#a78bfa',
}: ScrollLegendProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  // Hide on small viewports
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${hideBelow}px)`)
    setVisible(mq.matches)
    const h = (e: MediaQueryListEvent) => setVisible(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [hideBelow])

  // Track active section
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.35
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.offsetTop <= y) current = item.id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!visible) return null

  return (
    <nav
      aria-label="Page sections"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        position: 'fixed',
        left: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: '12px 8px',
      }}
    >
      {items.map(item => {
        const isActive = item.id === activeId
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            aria-label={`Jump to ${item.name}`}
            aria-current={isActive ? 'true' : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'block',
                height: 2,
                width: isActive ? 28 : 16,
                background: isActive ? activeColor : 'rgba(238,238,255,0.35)',
                borderRadius: 2,
                transition: 'width 220ms ease, background-color 220ms ease',
                boxShadow: isActive ? `0 0 8px ${activeColor}99` : 'none',
              }}
            />
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                color: isActive ? activeColor : 'rgba(238,238,255,0.7)',
                opacity: hovering ? 1 : 0,
                transform: hovering ? 'translateX(0)' : 'translateX(-6px)',
                transition: 'opacity 220ms ease, transform 220ms ease, color 220ms ease',
                pointerEvents: hovering ? 'auto' : 'none',
              }}
            >
              {item.name}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

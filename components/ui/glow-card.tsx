'use client'

import { useRef, useState, ReactNode, CSSProperties, MouseEvent } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'a'
  href?: string
  target?: string
  rel?: string
  'aria-label'?: string
  onClick?: () => void
}

export function GlowCard({
  children,
  className = '',
  style,
  as = 'div',
  ...rest
}: GlowCardProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }
  const onLeave = () => setPos(null)

  const commonProps = {
    className: `relative overflow-hidden ${className}`,
    style,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    ...rest,
  }

  const inner = (
    <>
      {pos && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: pos.y - 140,
            left: pos.x - 140,
            width: 280,
            height: 280,
            background: 'radial-gradient(circle, rgba(238,238,255,0.18), transparent 65%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </>
  )

  if (as === 'a') return <a {...(commonProps as any)}>{inner}</a>
  return <div {...(commonProps as any)}>{inner}</div>
}

'use client'

import { useRef, ReactNode, CSSProperties, MouseEvent } from 'react'

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
  const glowRef = useRef<HTMLDivElement>(null)

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${x - 140}px, ${y - 140}px)`
      glowRef.current.style.opacity = '1'
    }
  }
  const onLeave = () => {
    if (glowRef.current) glowRef.current.style.opacity = '0'
  }

  const inner = (
    <>
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 280,
          height: 280,
          background: 'radial-gradient(circle, rgba(238,238,255,0.18), transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0,
          transition: 'opacity 200ms ease',
          willChange: 'transform',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>{children}</div>
    </>
  )

  const commonProps = {
    className: `relative overflow-hidden ${className}`,
    style,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    ...rest,
  }

  if (as === 'a') {
    return <a {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>
  }
  return <div {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}>{inner}</div>
}

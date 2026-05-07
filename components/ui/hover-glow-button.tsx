'use client'

import React, { useRef, useState, MouseEvent, ReactNode, CSSProperties } from 'react'

interface HoverGlowButtonProps {
  children: ReactNode
  onClick?: () => void
  glowColor?: string
  background?: string
  textColor?: string
  hoverTextColor?: string
  style?: CSSProperties
  className?: string
  ariaLabel?: string
  disabled?: boolean
}

/**
 * Button that emits a radial gradient glow under the cursor on hover.
 * Designed to drop into YBA's existing CTA pattern — accepts a `style`
 * prop so callers keep their existing inline styling.
 */
export function HoverGlowButton({
  children,
  onClick,
  glowColor = '#a78bfa',
  background = '#eeeeff',
  textColor = '#09090f',
  hoverTextColor,
  style,
  className,
  ariaLabel,
  disabled = false,
}: HoverGlowButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label={ariaLabel}
      disabled={disabled}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background,
        color: hovering && hoverTextColor ? hoverTextColor : textColor,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'color 240ms ease',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: 220,
          height: 220,
          borderRadius: '50%',
          transform: `translate(-50%, -50%) scale(${hovering ? 1.15 : 0})`,
          background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor}99 28%, transparent 65%)`,
          opacity: hovering ? 0.55 : 0,
          transition: 'transform 380ms ease, opacity 280ms ease',
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          zIndex: 0,
        }}
      />
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        {children}
      </span>
    </button>
  )
}

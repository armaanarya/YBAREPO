'use client'

import React, { ReactNode, CSSProperties } from 'react'

interface HoverGlowButtonProps {
  children: ReactNode
  onClick?: () => void
  background?: string
  textColor?: string
  style?: CSSProperties
  className?: string
  ariaLabel?: string
  disabled?: boolean
}

/**
 * Clean CTA button — no cursor tracking, no glow effects.
 * Accepts a `style` prop so callers keep their existing inline styling.
 */
export function HoverGlowButton({
  children,
  onClick,
  background = '#eeeeff',
  textColor = '#09090f',
  style,
  className,
  ariaLabel,
  disabled = false,
}: HoverGlowButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={className}
      style={{
        background,
        color: textColor,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

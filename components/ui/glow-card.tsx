'use client'

import * as React from 'react'
import { ReactNode, CSSProperties } from 'react'

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

// Glow removed per design: plain container preserving the original API so
// existing call sites keep working.
export function GlowCard({ children, className = '', style, as = 'div', ...rest }: GlowCardProps) {
  const commonProps = { className: `relative ${className}`, style, ...rest }
  if (as === 'a') {
    return <a {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  }
  return <div {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
}

import React from 'react'
import { T } from '@/lib/theme'

export function SectionHeading({ children, size = 'lg' }: { children: React.ReactNode; size?: 'sm' | 'lg' }) {
  return (
    <h2 style={{
      fontFamily: T.manrope,
      fontSize: size === 'lg' ? 'clamp(2rem,4vw,3rem)' : 'clamp(1.5rem,3vw,2rem)',
      fontWeight: 800, color: T.dark, letterSpacing: '-0.02em', lineHeight: 1.08,
    }}>
      {children}
    </h2>
  )
}

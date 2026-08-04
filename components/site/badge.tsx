import React from 'react'
import { T } from '@/lib/theme'

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: T.inter, fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      background: T.chip, color: T.dark, borderRadius: 999,
      padding: '0.375rem 1rem', display: 'inline-block',
      border: `1px solid ${T.border}`,
    }}>
      {children}
    </span>
  )
}

import type React from 'react'

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const T = {
  manrope: 'var(--font-manrope), Manrope, sans-serif',
  inter:   'var(--font-inter), Inter, sans-serif',
  dark:    '#eeeeff',
  muted:   'rgba(238,238,255,0.5)',
  cta:     '#eeeeff',
  ctaHover:'#d4d4d8',
  ctaText: '#09090f',
  bg:      '#09090f',
  alt:     '#0d0d14',
  surface: '#111118',
  chip:    'rgba(238,238,255,0.08)',
  chipHover: 'rgba(238,238,255,0.15)',
  accent:  '#eeeeff',
  accentLight: 'rgba(238,238,255,0.06)',
  accentMid: 'rgba(238,238,255,0.18)',
  white:   '#111118',
  border:  'rgba(238,238,255,0.1)',
  borderHover: 'rgba(238,238,255,0.25)',
  shadowSm: '0 1px 3px rgba(0,0,0,0.4)',
  shadowMd: '0 4px 16px rgba(0,0,0,0.5)',
  shadowLg: '0 24px 48px -12px rgba(0,0,0,0.7)',
}

// ─── Press feedback helper ────────────────────────────────────────────────────
export const pressHandlers = {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = 'scale(0.96)' },
  onMouseUp:   (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = '' },
  onMouseLeave:(e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = '' },
}

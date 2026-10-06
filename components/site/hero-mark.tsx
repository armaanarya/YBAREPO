'use client'

import { useCallback, useEffect, useRef } from 'react'
import { GlassLogo } from '@/components/site/glass-logo'
import { announceHeroBurst, clearHeroBurst, type HeroBurst } from '@/lib/hero-burst'

/** The assembled glass mark triggers dots independently of the archived burst. */
export function HeroMark() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const burstRef = useRef<HeroBurst | null>(null)

  const playDots = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const now = performance.now()
    const burst: HeroBurst = {
      burstAt: now,
      returnAt: now + 2180,
      lockAt: now + 2730,
      origin: () => {
        const rect = buttonRef.current?.getBoundingClientRect()
        return rect
          ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
          : { x: window.innerWidth / 2, y: 0 }
      },
    }
    burstRef.current = burst
    announceHeroBurst(burst)
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(playDots)
    return () => {
      cancelAnimationFrame(raf)
      if (burstRef.current) clearHeroBurst(burstRef.current)
    }
  }, [playDots])

  return (
    <button
      ref={buttonRef}
      type="button"
      className="hero-logo btn-press"
      onClick={playDots}
      aria-label="Play YBA logo dot animation"
      title="Click to replay the dots"
    >
      <GlassLogo />
    </button>
  )
}

'use client'

import { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`group relative w-full overflow-hidden ${className}`}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className="flex w-max gap-4"
        style={{ animation: `yba-marquee ${speed}s linear infinite` }}
        onMouseEnter={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused'
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running'
        }}
      >
        <div className="flex shrink-0 items-center gap-3">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-3">
          {children}
        </div>
      </div>
    </div>
  )
}

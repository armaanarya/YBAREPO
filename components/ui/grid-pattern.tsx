import React from 'react'

interface GridPatternProps {
  size?: number
  dotSize?: number
  className?: string
}

export function GridPattern({
  size = 28,
  dotSize = 1.2,
  className = '',
}: GridPatternProps) {
  const id = 'yba-grid-dots'
  return (
    <>
      <style>{`
        @keyframes yba-grid-pulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.65; }
        }
        .yba-grid-svg {
          animation: yba-grid-pulse 6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .yba-grid-svg { animation: none; opacity: 0.4; }
        }
      `}</style>
      <svg
        aria-hidden="true"
        className={`yba-grid-svg pointer-events-none absolute inset-0 h-full w-full ${className}`}
      >
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={size / 2} cy={size / 2} r={dotSize} fill="rgba(238,238,255,0.18)" />
          </pattern>
          <radialGradient id="yba-grid-mask" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="yba-grid-fade">
            <rect width="100%" height="100%" fill="url(#yba-grid-mask)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} mask="url(#yba-grid-fade)" />
      </svg>
    </>
  )
}

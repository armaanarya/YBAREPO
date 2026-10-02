import { useId, type CSSProperties, type ReactNode } from 'react'
import { C } from './palette'
import s from './storyboard.module.css'

export const VIEW_W = 560
export const VIEW_H = 310

type Cls = { className?: string; style?: CSSProperties }

export function Art({ children }: { children: ReactNode }) {
  return (
    <svg className={s.art} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** SVG ids for patterns, clips, and gradients; useId's colons break url(#…). */
export function useSvgId() {
  return useId().replace(/:/g, '')
}

/** A square centered on (x, y). */
export function Sq({ x, y, size = 8, fill, rotate, className, style }: { x: number; y: number; size?: number; fill: string; rotate?: number } & Cls) {
  return (
    <rect
      x={x - size / 2} y={y - size / 2} width={size} height={size} fill={fill}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      className={className} style={style}
    />
  )
}

/** Selection handles on the four corners of a box, as in a design tool. */
export function Handles({ x, y, w, h, size = 6, fill = C.signal, fills, className, style }: {
  x: number; y: number; w: number; h: number; size?: number; fill?: string; fills?: readonly string[]
} & Cls) {
  const corners = [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]
  return (
    <g className={className} style={style}>
      {corners.map(([cx, cy], i) => <Sq key={i} x={cx} y={cy} size={size} fill={fills?.[i] ?? fill} />)}
    </g>
  )
}

/** A dash that travels `d`; give it a motion class for its timing. */
export function Token({ d, color, size = 8, round = false, className = s.flow, style }: {
  d: string; color: string; size?: number; round?: boolean
} & Cls) {
  return (
    <path
      d={d} pathLength={100} stroke={color} strokeWidth={size}
      strokeLinecap={round ? 'round' : 'square'}
      className={`${s.token} ${className}`} style={style}
    />
  )
}

/** Head and shoulders, centered on the chest. */
export function Person({ x, y, color, scale = 1, width = 2.2 }: { x: number; y: number; color: string; scale?: number; width?: number }) {
  const r = 5.5 * scale
  const sw = 9 * scale
  return (
    <g stroke={color} strokeWidth={width} strokeLinecap="round">
      <circle cx={x} cy={y - 6 * scale} r={r} />
      <path d={`M${x - sw},${y + 10 * scale} a${sw},${8 * scale} 0 0 1 ${sw * 2},0`} />
    </g>
  )
}

export function Mic({ x, y, color, fill = color }: { x: number; y: number; color: string; fill?: string }) {
  return (
    <g stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <rect x={x - 5} y={y - 13} width={10} height={17} rx={5} fill={fill} />
      <path d={`M${x - 9},${y - 2} a9,9 0 0 0 18,0`} />
      <path d={`M${x},${y + 7} V${y + 12} M${x - 6},${y + 12} H${x + 6}`} />
    </g>
  )
}

/** Four light rays and four dark diagonals around a mid-gray core. */
export function Sparkle({ x, y }: { x: number; y: number }) {
  const ray = (angle: number, r1: number, r2: number) =>
    `M${polar(x, y, r1, angle).join(',')} L${polar(x, y, r2, angle).join(',')}`
  return (
    <g className={s.twinkle} strokeWidth={2} strokeLinecap="round">
      <path d={[0, 90, 180, 270].map(a => ray(a, 9, 15)).join(' ')} stroke={C.line} />
      <path d={[45, 135, 225, 315].map(a => ray(a, 8, 12)).join(' ')} stroke={C.signal} />
      <Sq x={x} y={y} size={7} fill={C.marker} />
    </g>
  )
}

/** Short radial ticks between two radii. */
export function ticks(cx: number, cy: number, r1: number, r2: number, angles: number[]) {
  return angles.map(deg => {
    const a = (deg * Math.PI) / 180
    return `M${(cx + Math.cos(a) * r1).toFixed(1)},${(cy + Math.sin(a) * r1).toFixed(1)} L${(cx + Math.cos(a) * r2).toFixed(1)},${(cy + Math.sin(a) * r2).toFixed(1)}`
  }).join(' ')
}

/** Point on a circle, screen angle in degrees (0 = right, 90 = down). */
export function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return [+(cx + Math.cos(a) * r).toFixed(1), +(cy + Math.sin(a) * r).toFixed(1)] as const
}

export { s as base }

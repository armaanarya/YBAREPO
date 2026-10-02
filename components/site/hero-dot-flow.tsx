'use client'

import React, { useEffect, useRef } from 'react'
import { onHeroBurst, type HeroBurst } from '@/lib/hero-burst'

// Half of GridPattern's 28px step, starting at the canvas corner, so every
// grid dot lights up along with one dot between each pair.
const SPACING = 14

// Leading edge → trailing glow. The canvas is re-inverted, but the page's
// invert + hue-rotate pair is lossy for saturated colors (#2b2bff comes out
// #3f3f88), so these are the drawn values that land on clear blues:
// #3e6ed7, #5971e8, #7078ff, #a7a7ff.
const COLORS = ['#3868ff', '#5870ef', '#7078ff', '#a7a7ff']
const ALPHA_STEPS = 8
const FRONT_PX = 8 // sharpness of the wave's leading edge
const TRAIL_PX = 55 // how far the glow trails behind it

// Rings sent out by one burst: three outward pulses as the blocks fly out,
// one inward pulse as they rush back into the logo.
const OUT_MS = 1300
const IN_MS = 550
const OUT_RINGS = [
  { delay: 0, strength: 1 },
  { delay: 280, strength: 0.7 },
  { delay: 560, strength: 0.45 },
]

interface Ring {
  at: number
  dur: number
  strength: number
  inward: boolean
  phase: number
}

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3)
const easeInCubic = (p: number) => p * p * p
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * A dotted shockwave over the hero grid, after base.org's "Where the world
 * transacts onchain" section: rings of lit dots flow out from the logo when
 * the 3D mark bursts into blocks, and one flows back in as they return.
 * Renders nothing until the hero mark announces a burst.
 */
export function HeroDotFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let raf = 0
    let dots = { xs: new Float32Array(0), ys: new Float32Array(0), grain: new Float32Array(0) }
    let size = { w: 0, h: 0 }

    const layout = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === size.w && rect.height === size.h) return
      size = { w: rect.width, h: rect.height }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(rect.width / SPACING) + 1
      const rows = Math.ceil(rect.height / SPACING) + 1
      const n = cols * rows
      dots = { xs: new Float32Array(n), ys: new Float32Array(n), grain: new Float32Array(n) }
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = r * cols + c
          dots.xs[k] = c * SPACING
          dots.ys[k] = r * SPACING
          // Stable per-dot brightness so the wave looks dotted, not ruled.
          const h = Math.sin(c * 127.1 + r * 311.7) * 43758.5453
          dots.grain[k] = 0.45 + 0.55 * (h - Math.floor(h))
        }
      }
    }

    const draw = (burst: HeroBurst, rings: Ring[], endAt: number) => {
      const now = performance.now()
      layout()
      ctx.clearRect(0, 0, size.w, size.h)
      if (now > endAt) {
        raf = 0
        return
      }

      const rect = canvas.getBoundingClientRect()
      const o = burst.origin()
      const ox = o.x - rect.left
      const oy = o.y - rect.top
      const rMax = Math.hypot(Math.max(ox, size.w - ox), Math.max(oy, size.h - oy)) + TRAIL_PX

      // Each live ring's radius and strength this frame.
      const live: { r: number; s: number; inward: boolean; phase: number }[] = []
      for (const ring of rings) {
        const p = (now - ring.at) / ring.dur
        if (p < 0 || p > 1) continue
        const r = ring.inward ? rMax * (1 - easeInCubic(p)) : rMax * easeOutCubic(p)
        const fade = ring.inward ? 1 - smoothstep(0.85, 1, p) : 1 - smoothstep(0.7, 1, p)
        live.push({ r, s: ring.strength * fade, inward: ring.inward, phase: ring.phase })
      }

      if (live.length) {
        const buckets: Path2D[] = Array.from({ length: COLORS.length * ALPHA_STEPS }, () => new Path2D())
        const used = new Uint8Array(buckets.length)
        const { xs, ys, grain } = dots
        for (let k = 0; k < xs.length; k++) {
          const dx = xs[k] - ox
          const dy = ys[k] - oy
          const d = Math.sqrt(dx * dx + dy * dy)
          let best = 0
          let bestX = 0
          for (const ring of live) {
            // Distance behind the front: outward rings trail inward, inward rings trail outward.
            const x = ring.inward ? d - ring.r : ring.r - d
            if (x < -3 * FRONT_PX || x > 3 * TRAIL_PX) continue
            const shape = x < 0 ? Math.exp(-((x / FRONT_PX) ** 2)) : Math.exp(-x / TRAIL_PX)
            const lobes = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(3 * Math.atan2(dy, dx) + ring.phase))
            const a = shape * ring.s * lobes
            if (a > best) {
              best = a
              bestX = Math.max(0, x)
            }
          }
          const alpha = best * grain[k]
          if (alpha < 0.05) continue
          const color = bestX < 14 ? 0 : bestX < 34 ? 1 : bestX < 70 ? 2 : 3
          const step = Math.min(ALPHA_STEPS - 1, Math.floor(alpha * ALPHA_STEPS))
          const b = color * ALPHA_STEPS + step
          const radius = 1.2 + 1.6 * Math.min(1, best)
          buckets[b].moveTo(xs[k] + radius, ys[k])
          buckets[b].arc(xs[k], ys[k], radius, 0, Math.PI * 2)
          used[b] = 1
        }
        for (let b = 0; b < buckets.length; b++) {
          if (!used[b]) continue
          ctx.globalAlpha = ((b % ALPHA_STEPS) + 1) / ALPHA_STEPS
          ctx.fillStyle = COLORS[Math.floor(b / ALPHA_STEPS)]
          ctx.fill(buckets[b])
        }
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(() => draw(burst, rings, endAt))
    }

    const unsubscribe = onHeroBurst((burst) => {
      const rings: Ring[] = OUT_RINGS.map((r, i) => ({
        at: burst.burstAt + r.delay, dur: OUT_MS, strength: r.strength, inward: false, phase: i * 2.1,
      }))
      rings.push({ at: burst.lockAt - IN_MS, dur: IN_MS, strength: 0.85, inward: true, phase: 0.7 })
      const endAt = Math.max(...rings.map((r) => r.at + r.dur)) + 50
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => draw(burst, rings, endAt))
    })

    return () => {
      unsubscribe()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div aria-hidden="true" className="yba-dots pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  )
}

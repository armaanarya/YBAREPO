'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Application, SPEObject } from '@splinetool/runtime'
import { SpinningLogo } from '@/components/site/spinning-logo'
import { SPLINE_HERO_SCENE } from '@/lib/spline'
import { announceHeroBurst, clearHeroBurst, type HeroBurst } from '@/lib/hero-burst'

// The scene's Hero Camera (fov 45°, z 5392) frames 4467 world units of height
// at the logo's depth, and the mark is 1072 units tip to tip. On a canvas one
// viewport tall the logo therefore renders at ~24vh, so the slot reserves that.
const VIEW_H = 4467
const LOGO_VH = (1072 / VIEW_H) * 100

// The scene's timeline, measured from when it sets introStarted: the mark
// shatters into node blocks at 0.92s, they rush home at 3.1s and lock at
// 3.65s. Keep in step with T_BURST / T_RETURN / T_LOCK in the scene script.
const BURST_AT_MS = 920
const RETURN_AT_MS = 3100
const LOCK_AT_MS = 3650

// Cursor tilt eases in once the blocks have locked back into the logo.
const TILT_DELAY_MS = LOCK_AT_MS + 550
const TILT_RAMP_MS = 1200
const MAX_TILT_X = 0.12
const MAX_TILT_Y = 0.2

// Fallback if the scene never reports that its intro started.
const REVEAL_TIMEOUT_MS = 2500

function removeSplineBadge(app: Application) {
  // Runtime 2.0.65 draws the badge in its render pipeline, inside the canvas.
  // Keep this private runtime access here so it can be checked on upgrades.
  const runtime = app as Application & {
    _renderer?: { pipeline?: { setWatermark: (texture: null) => void } }
  }
  runtime._renderer?.pipeline?.setWatermark(null)
  app.requestRender()
}

// The scene's motion script sets this once its intro clock is running, so the
// canvas only fades in after the bars have left their resting pose.
function introStarted(app: Application) {
  try {
    return app.getVariable('introStarted') === true
  } catch {
    return false
  }
}

function canRender3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (conn?.saveData) return false
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * The YBA mark as a live Spline scene. The bars flow in, then the mark breaks
 * into hundreds of node blocks that fill the whole landing screen for a couple
 * of seconds before rushing back into the logo. The burst timing is announced
 * for the hero's dot flow (see lib/hero-burst.ts).
 *
 * The 3D canvas covers the first screen of the page (portaled into #hero) and
 * ignores the pointer; the camera is shifted so the logo lands exactly on the
 * slot rendered here in the hero layout. The static SVG mark shows until the
 * scene starts, and stays when WebGL is unavailable or motion is reduced.
 */
export function HeroMark3D() {
  const slotRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (SPLINE_HERO_SCENE && canRender3D()) setHost(document.getElementById('hero'))
  }, [])

  useEffect(() => {
    const layer = layerRef.current
    const canvas = canvasRef.current
    const slot = slotRef.current
    if (!host || !layer || !canvas || !slot) return

    let app: Application | null = null
    let cam: SPEObject | undefined
    let rig: SPEObject | undefined
    let disposed = false
    let raf = 0
    let loadedAt = 0
    let revealed = false
    let burst: HeroBurst | null = null
    let size = { w: 0, h: 0 }
    const pointer = { x: 0, y: 0 }
    const tilt = { x: 0, y: 0 }

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    // Keep the canvas sized to the layer and the logo pinned to the slot.
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!app) return
      // Time everything from the first rendered frame: a tab loaded in the
      // background gets no frames until it is shown.
      if (!loadedAt) loadedAt = now
      const lr = layer.getBoundingClientRect()
      const sr = slot.getBoundingClientRect()
      if (lr.width !== size.w || lr.height !== size.h) {
        size = { w: lr.width, h: lr.height }
        app.setSize(lr.width, lr.height)
      }
      if (cam && lr.height > 0) {
        const unitsPerPx = VIEW_H / lr.height
        cam.position.x = -(sr.left + sr.width / 2 - (lr.left + lr.width / 2)) * unitsPerPx
        cam.position.y = (sr.top + sr.height / 2 - (lr.top + lr.height / 2)) * unitsPerPx
      }
      if (!burst && introStarted(app)) {
        burst = {
          burstAt: now + BURST_AT_MS,
          returnAt: now + RETURN_AT_MS,
          lockAt: now + LOCK_AT_MS,
          origin: () => {
            const r = slot.getBoundingClientRect()
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
          },
        }
        announceHeroBurst(burst)
      }
      if (!revealed && (burst || now - loadedAt > REVEAL_TIMEOUT_MS)) {
        revealed = true
        setStarted(true)
      }
      if (rig) {
        const introAt = burst ? burst.burstAt - BURST_AT_MS : loadedAt
        const ramp = Math.min(1, Math.max(0, (now - introAt - TILT_DELAY_MS) / TILT_RAMP_MS))
        tilt.x += (pointer.y * MAX_TILT_X * ramp - tilt.x) * 0.06
        tilt.y += (pointer.x * MAX_TILT_Y * ramp - tilt.y) * 0.06
        rig.rotation.x = tilt.x
        rig.rotation.y = tilt.y
      }
    }

    // Stop rendering once the hero has scrolled away.
    const visibility = new IntersectionObserver(([entry]) => {
      if (!app) return
      if (entry.isIntersecting) app.play()
      else app.stop()
    })
    visibility.observe(layer)
    window.addEventListener('pointermove', onPointer, { passive: true })

    ;(async () => {
      const { Application } = await import('@splinetool/runtime')
      if (disposed) return
      const instance = new Application(canvas)
      await instance.load(SPLINE_HERO_SCENE)
      if (disposed) {
        instance.dispose()
        return
      }
      instance.setBackgroundColor('rgba(0,0,0,0)')
      removeSplineBadge(instance)
      cam = instance.findObjectByName('Hero Camera')
      rig = instance.findObjectByName('Tilt Rig')
      app = instance
      raf = requestAnimationFrame(frame)
    })().catch(() => {
      // The scene failed to load; the static mark stays in place.
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      visibility.disconnect()
      window.removeEventListener('pointermove', onPointer)
      if (burst) clearHeroBurst(burst)
      app?.dispose()
    }
  }, [host])

  return (
    <div ref={slotRef} style={{ position: 'relative', width: `${LOGO_VH}vh`, height: `${LOGO_VH}vh` }}>
      <div
        aria-hidden={started}
        style={{
          position: 'absolute', inset: '-8%', display: 'grid', placeItems: 'center',
          opacity: started ? 0 : 1, transition: 'opacity 0.2s ease', pointerEvents: 'none',
        }}
      >
        <SpinningLogo size="100%" />
      </div>
      {host && createPortal(
        <div
          ref={layerRef}
          className="yba-spline"
          role="img"
          aria-label="YBA logo"
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
            zIndex: 30, pointerEvents: 'none',
            opacity: started ? 1 : 0, transition: 'opacity 0.25s ease',
          }}
        >
          <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
        </div>,
        host,
      )}
    </div>
  )
}

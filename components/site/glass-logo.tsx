'use client'

import { useEffect, useRef, useState } from 'react'
import type { Application } from '@splinetool/runtime'
import { SpinningLogo } from '@/components/site/spinning-logo'

/** The archived glass mark, with its motion script and burst cubes removed. */
export function GlassLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let disposed = false
    let app: Application | null = null
    let resizeObserver: ResizeObserver | null = null
    const onContextLost = () => setReady(false)
    canvas.addEventListener('webglcontextlost', onContextLost)

    void (async () => {
      const { Application } = await import('@splinetool/runtime')
      if (disposed) return
      app = new Application(canvas, { renderMode: 'auto', renderer: 'webgl', htmlContentMode: 'none' })
      await app.load('/animations/glass-logo.splinecode')
      if (disposed) {
        app.dispose()
        return
      }
      app.setBackgroundColor('rgba(0,0,0,0)')

      // The archived integration uses this runtime hook for its canvas badge.
      const runtime = app as Application & {
        _renderer?: { pipeline?: { setWatermark: (texture: null) => void } }
      }
      runtime._renderer?.pipeline?.setWatermark(null)

      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect()
        if (width > 0 && height > 0) {
          app?.setSize(width, height)
          app?.requestRender()
        }
      }
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
      resize()
      setReady(true)
    })().catch(() => {
      app?.dispose()
      app = null
      // Keep the SVG mark if WebGL or the scene cannot load.
    })

    return () => {
      disposed = true
      canvas.removeEventListener('webglcontextlost', onContextLost)
      resizeObserver?.disconnect()
      app?.dispose()
    }
  }, [])

  return (
    <span className="glass-logo" role="img" aria-label="YBA logo">
      <span className="glass-logo-fallback" aria-hidden="true" style={{ opacity: ready ? 0 : 1 }}>
        <SpinningLogo size="100%" />
      </span>
      <span className="yba-spline glass-logo-scene" aria-hidden="true" style={{ opacity: ready ? 1 : 0 }}>
        <canvas ref={canvasRef} />
      </span>
    </span>
  )
}

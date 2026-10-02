'use client'

import { useEffect, useRef, useState } from 'react'
import { IconCube, IconPlayerPause, IconPlayerPlay, IconUsersGroup, IconWorld } from '@tabler/icons-react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import styles from './pillar-orbit.module.css'

type Pillar = { title: string; desc: string }
const TAU = Math.PI * 2
const STEP = TAU / 3
const ICONS = [IconCube, IconWorld, IconUsersGroup]

// Adapted from Halo Reel by Ruixen, retrieved through 21st.dev MCP.
// https://21st.dev/@ruixen.ui/components/halo-reel
// One motion value places and scales all three cards along the same orbit.
export function PillarOrbit({ items }: { items: readonly Pillar[] }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const controls = useRef<ReturnType<typeof animate> | null>(null)
  const rotation = useMotionValue(0)
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null)
  const inView = useInView(stageRef, { amount: 0.15 })
  const [width, setWidth] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReduceMotion(preference.matches)
      if (preference.matches) controls.current?.stop()
    }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => setWidth(stage.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  const orbiting = width > 0 && reduceMotion === false
  const compact = width < 640
  const phase = compact ? Math.PI / 6 : 0
  const cardWidth = Math.min(compact ? width * 0.78 : width * 0.6, 340)
  const cardHeight = compact ? 340 : 300
  // Bound every point of the orbit, including the widest intermediate angles.
  const horizontalRoom = (width - 24) / 2 - cardWidth * 0.45
  const radiusX = Math.min(350, Math.sqrt(Math.max(0, horizontalRoom ** 2 - (cardWidth * 0.05) ** 2)))
  const radiusY = compact ? 115 : 125

  useMotionValueEvent(rotation, 'change', angle => {
    const front = ((-Math.round((angle + phase) / STEP) % 3) + 3) % 3
    if (front !== activeRef.current) {
      activeRef.current = front
      setActive(front)
    }
  })

  useEffect(() => {
    if (!orbiting || paused || hovered || !inView || !pageVisible) return
    let timer = 0
    let autoControls: ReturnType<typeof animate> | undefined
    const next = () => {
      timer = window.setTimeout(() => {
        const target = (Math.round(rotation.get() / STEP) - 1) * STEP
        autoControls = animate(rotation, target, {
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            next()
          },
        })
        controls.current = autoControls
      }, 6500)
    }
    next()
    return () => {
      window.clearTimeout(timer)
      autoControls?.stop()
    }
  }, [orbiting, paused, hovered, inView, pageVisible, rotation])

  useEffect(() => () => controls.current?.stop(), [])

  const select = (index: number) => {
    setPaused(true)
    controls.current?.stop()
    const current = rotation.get()
    const delta = (((-index * STEP - current + Math.PI) % TAU + TAU) % TAU) - Math.PI
    controls.current = animate(rotation, current + delta, {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    })
  }

  return (
    <section id="pillars" className={styles.section} aria-labelledby="pillars-heading" data-orbit-ready={orbiting}>
      <div className={styles.header}>
        <h2 id="pillars-heading">Learn. Apply. Build.</h2>
        {orbiting && (
          <button
            type="button"
            className={styles.playButton}
            onClick={() => setPaused(value => !value)}
            aria-label={paused ? 'Play pillar rotation' : 'Pause pillar rotation'}
          >
            {paused ? <IconPlayerPlay size={16} aria-hidden="true" /> : <IconPlayerPause size={16} aria-hidden="true" />}
            {paused ? 'Play' : 'Pause'}
          </button>
        )}
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        role={orbiting ? 'region' : undefined}
        aria-roledescription={orbiting ? 'carousel' : undefined}
        aria-label={orbiting ? 'The three YBA pillars. Use left and right arrow keys to choose a pillar.' : undefined}
        tabIndex={orbiting ? 0 : undefined}
        onFocus={() => setPaused(true)}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          select((active + (event.key === 'ArrowRight' ? 1 : 2)) % 3)
        }}
      >
        {orbiting && <div className={styles.track} aria-hidden="true" style={{ width: radiusX * 2, height: radiusY * 2 }} />}
        {items.map((item, index) => (
          <OrbitCard
            key={item.title}
            item={item}
            index={index}
            rotation={rotation}
            orbiting={orbiting}
            phase={phase}
            active={active === index}
            radiusX={radiusX}
            radiusY={radiusY}
            width={cardWidth}
            height={cardHeight}
            onHover={setHovered}
          />
        ))}
      </div>

      {orbiting && (
        <div className={styles.choices} role="group" aria-label="Choose a pillar">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-pressed={active === index}
              aria-controls={`pillar-${index}`}
              onFocus={() => setPaused(true)}
              onClick={() => select(index)}
            >
              <span className={styles.dot} aria-hidden="true" />
              {item.title}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function OrbitCard({ item, index, rotation, orbiting, phase, active, radiusX, radiusY, width, height, onHover }: {
  item: Pillar
  index: number
  rotation: MotionValue<number>
  orbiting: boolean
  phase: number
  active: boolean
  radiusX: number
  radiusY: number
  width: number
  height: number
  onHover: (hovered: boolean) => void
}) {
  const x = useTransform(rotation, angle => Math.sin(index * STEP + angle + phase) * radiusX)
  const y = useTransform(rotation, angle => Math.cos(index * STEP + angle + phase) * radiusY)
  const scale = useTransform(rotation, angle => 0.8 + 0.2 * (Math.cos(index * STEP + angle + phase) + 1) / 2)
  const zIndex = useTransform(scale, value => Math.round(value * 100))
  const Icon = ICONS[index]

  return (
    <motion.article
      id={`pillar-${index}`}
      className={styles.card}
      data-front={active}
      style={orbiting ? { x, y, scale, zIndex, width, height, marginLeft: -width / 2, marginTop: -height / 2 } : { transform: 'none', zIndex: 'auto' }}
      onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(true) }}
      onPointerLeave={() => onHover(false)}
      aria-labelledby={`pillar-title-${index}`}
    >
      <Icon className={styles.icon} size={48} stroke={1.25} aria-hidden="true" />
      <h3 id={`pillar-title-${index}`}>{item.title}</h3>
      <p>{item.desc}</p>
    </motion.article>
  )
}

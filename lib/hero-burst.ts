// ─── Hero burst timing ────────────────────────────────────────────────────────
// The 3D hero mark announces its burst timeline here once the Spline scene's
// intro clock starts; other hero layers (the dot flow) sync to it. Times are
// performance.now() milliseconds; origin() is the logo's center in viewport px.

export interface HeroBurst {
  burstAt: number
  returnAt: number
  lockAt: number
  origin: () => { x: number; y: number }
}

type Listener = (burst: HeroBurst) => void

let current: HeroBurst | null = null
const listeners = new Set<Listener>()

export function announceHeroBurst(burst: HeroBurst) {
  current = burst
  listeners.forEach((listener) => listener(burst))
}

/** Forgets a burst when its announcer unmounts, so it is never replayed. */
export function clearHeroBurst(burst: HeroBurst) {
  if (current === burst) current = null
}

/** Calls back for the burst still playing (if any) and any later one. */
export function onHeroBurst(listener: Listener) {
  if (current && performance.now() < current.lockAt) listener(current)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

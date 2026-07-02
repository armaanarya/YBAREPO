// Best-effort in-memory limiter (per serverless instance). Good enough to stop
// casual floods; for hard guarantees move to Upstash/Vercel KV later.
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()
let lastSweep = Date.now()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  // Lazy sweep of expired buckets so the Map can't grow unbounded on warm
  // instances (no setInterval — it would pin the lambda).
  if (now - lastSweep > 5 * 60_000) {
    buckets.forEach((v, k) => { if (now > v.reset) buckets.delete(k) })
    lastSweep = now
  }
  const b = buckets.get(key)
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (b.count >= limit) return false
  b.count++
  return true
}

export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean)
    // Last hop is the platform-appended peer address — client-supplied
    // segments prepended to the header can't influence it.
    if (parts.length) return parts[parts.length - 1]
  }
  return req.headers.get('x-real-ip') || 'unknown'
}

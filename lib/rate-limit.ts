// Best-effort in-memory limiter (per serverless instance). Good enough to stop
// casual floods; for hard guarantees move to Upstash/Vercel KV later.
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
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
  return (xff?.split(',')[0].trim()) || req.headers.get('x-real-ip') || 'unknown'
}

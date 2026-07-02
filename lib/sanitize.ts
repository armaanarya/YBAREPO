// Strip control chars (except \t \n \r) and clamp length.
export function clean(v: unknown, max: number): string {
  if (typeof v !== 'string') return ''
  return v.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max)
}

// Clamp arbitrary JSON metadata by serialized size.
export function clampJson(v: unknown, maxBytes: number): unknown {
  if (v == null) return null
  try {
    const s = JSON.stringify(v)
    if (s.length > maxBytes) return { truncated: true }
    return v
  } catch {
    return null
  }
}

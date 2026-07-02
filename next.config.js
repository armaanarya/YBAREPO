/** @type {import('next').NextConfig} */
// In dev, Turbopack's Fast Refresh applies hot updates via eval(), so 'unsafe-eval'
// (and a ws: source for the HMR socket) are needed there and ONLY there — the
// production policy stays strict. NODE_ENV is set automatically by next dev/build.
const isDev = process.env.NODE_ENV !== 'production'
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://*.medium.com https://miro.medium.com https://cdn-images-1.medium.com",
      `connect-src 'self' https://*.supabase.co${isDev ? ' ws:' : ''}`,
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
module.exports = nextConfig

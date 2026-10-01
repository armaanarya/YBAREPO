import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import '../styles/globals.css'
import { LenisProvider } from '@/components/ui/lenis-provider'
import { SiteNav } from '@/components/site/site-nav'
import { SiteFooter } from '@/components/site/site-footer'
import { RouteEffects } from '@/components/site/route-effects'

const manrope = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL('https://joinyba.org'),
  // Per-route `metadata` exports override the default; the template appends the
  // site name so child routes read e.g. "Institutions, YBA".
  title: {
    default: 'YBA, Youth Blockchain Association',
    template: '%s, YBA',
  },
  description: 'Join YBA, a student-led community for high schoolers learning about blockchain through peer lessons, projects, and events.',
  keywords: 'blockchain, youth, high school, DeFi, cryptocurrency, education, hackathon',
  openGraph: {
    title: 'YBA, Youth Blockchain Association',
    description: 'Blockchain learning and projects for high school students.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YBA, Youth Blockchain Association',
    description: 'Blockchain learning and projects for high school students.',
    images: ['/twitter-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <LenisProvider />
        <RouteEffects />
        {/* Nav and footer live here, outside app/template.tsx, so the transition
            wrapper never becomes an ancestor of the position: fixed navbar. */}
        <SiteNav />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}

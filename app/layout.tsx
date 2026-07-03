import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import '../styles/globals.css'
import { LenisProvider } from '@/components/ui/lenis-provider'

const manrope = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'YBA — Youth Blockchain Association',
  description: 'Empowering the next generation of blockchain builders. Join high school students learning DeFi, smart contracts, and real-world blockchain applications.',
  keywords: 'blockchain, youth, high school, DeFi, cryptocurrency, education, hackathon',
  openGraph: {
    title: 'YBA — Youth Blockchain Association',
    description: 'Empowering the next generation of blockchain builders.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YBA — Youth Blockchain Association',
    description: 'Empowering the next generation of blockchain builders.',
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
        {children}
      </body>
    </html>
  )
}

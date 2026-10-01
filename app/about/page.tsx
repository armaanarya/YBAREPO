import type { Metadata } from 'next'
import { AboutView } from './view'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet YBA founder Armaan Arya and our student officers. Read about our plans for chapters, events, and blockchain lessons.',
  alternates: { canonical: '/about' },
}

export default function Page() {
  return <AboutView />
}

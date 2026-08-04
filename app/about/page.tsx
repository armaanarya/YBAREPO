import type { Metadata } from 'next'
import { AboutView } from './view'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Armaan Arya and the student officers building the Youth Blockchain Association — plus our vision and Year One goals.',
  alternates: { canonical: '/about' },
}

export default function Page() {
  return <AboutView />
}

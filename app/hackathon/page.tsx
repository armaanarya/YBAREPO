import type { Metadata } from 'next'
import { HackathonView } from './view'

export const metadata: Metadata = {
  title: 'Hackathon',
  description: 'The YBA Hackathon, Guest Speaker Series, and hands-on blockchain workshops for high school students.',
  alternates: { canonical: '/hackathon' },
}

export default function Page() {
  return <HackathonView />
}

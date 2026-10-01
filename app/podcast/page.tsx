import type { Metadata } from 'next'
import { PodcastView } from './view'

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'The upcoming YBA podcast: student-hosted conversations about blockchain.',
  alternates: { canonical: '/podcast' },
}

export default function Page() {
  return <PodcastView />
}

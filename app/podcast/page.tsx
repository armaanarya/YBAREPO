import type { Metadata } from 'next'
import { PodcastView } from './view'

export const metadata: Metadata = {
  title: 'Podcast',
  description: 'The YBA podcast — conversations with builders, founders, and students in Web3.',
  alternates: { canonical: '/podcast' },
}

export default function Page() {
  return <PodcastView />
}

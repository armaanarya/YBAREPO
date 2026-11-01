import type { Metadata } from 'next'
import { OctoberUpdateView } from './view'

export const metadata: Metadata = {
  title: 'YBA October Update | October 2026',
  description: 'The first YBA Monthly Update: YBA HACKS planning, our new curriculum series, partnerships, and community growth.',
  alternates: { canonical: '/newsletters/october-2026' },
}

export default function Page() {
  return <OctoberUpdateView />
}

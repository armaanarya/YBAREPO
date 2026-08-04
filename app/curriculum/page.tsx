import type { Metadata } from 'next'
import { CurriculumView } from './view'

export const metadata: Metadata = {
  title: 'Curriculum',
  description: 'Peer-reviewed blockchain curriculum built for high schoolers, plus our meeting calendar and frequently asked questions.',
  alternates: { canonical: '/curriculum' },
}

export default function Page() {
  return <CurriculumView />
}

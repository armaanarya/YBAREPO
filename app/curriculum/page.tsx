import type { Metadata } from 'next'
import { CurriculumView } from './view'

export const metadata: Metadata = {
  title: 'Curriculum',
  description: 'Preview our upcoming blockchain video lessons, see the weekly meeting calendar, and find answers to questions about joining YBA.',
  alternates: { canonical: '/curriculum' },
}

export default function Page() {
  return <CurriculumView />
}

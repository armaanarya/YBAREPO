import type { Metadata } from 'next'
import { CurriculumView } from './view'

export const metadata: Metadata = {
  title: 'Curriculum',
  description: 'Watch our first blockchain video lesson, see the weekly meeting calendar, and find answers to questions about joining YBA.',
  alternates: { canonical: '/curriculum' },
}

export default function Page() {
  return <CurriculumView />
}

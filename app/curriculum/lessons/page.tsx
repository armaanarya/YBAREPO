import type { Metadata } from 'next'
import { LessonsView } from './view'

export const metadata: Metadata = {
  title: 'Curriculum lessons',
  description: 'Watch all available YBA blockchain video lessons, made by students for high schoolers.',
  alternates: { canonical: '/curriculum/lessons' },
}

export default function Page() {
  return <LessonsView />
}

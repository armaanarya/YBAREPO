import { Suspense } from 'react'
import type { Metadata } from 'next'
import { LessonsView } from './view'

export const metadata: Metadata = {
  title: 'Curriculum lessons',
  description: 'Watch all available YBA blockchain video lessons and take a short quiz on each one, made by students for high schoolers.',
  alternates: { canonical: '/curriculum/lessons' },
}

export default function Page() {
  // LessonsView reads ?tab= with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense>
      <LessonsView />
    </Suspense>
  )
}

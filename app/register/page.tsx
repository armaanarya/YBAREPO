import type { Metadata } from 'next'
import { RegisterView } from './view'

export const metadata: Metadata = {
  title: 'Join YBA',
  description: 'Apply to join the Youth Blockchain Association. Free for every high school student.',
  alternates: { canonical: '/register' },
}

export default function Page() {
  return <RegisterView />
}

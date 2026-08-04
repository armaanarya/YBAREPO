import type { Metadata } from 'next'
import { RegisterView } from './view'

export const metadata: Metadata = {
  // absolute: the '%s — YBA' template would otherwise render "Join YBA — YBA"
  title: { absolute: 'Join YBA — Youth Blockchain Association' },
  description: 'Apply to join the Youth Blockchain Association. Free for every high school student.',
  alternates: { canonical: '/register' },
}

export default function Page() {
  return <RegisterView />
}

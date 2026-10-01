import type { Metadata } from 'next'
import { HomeView } from './view'

export const metadata: Metadata = {
  title: 'YBA, Youth Blockchain Association',
  description: 'YBA is a student-led community for high schoolers learning about blockchain through peer lessons, projects, and events.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomeView />
}

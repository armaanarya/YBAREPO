import type { Metadata } from 'next'
import { NewslettersView } from './view'

export const metadata: Metadata = {
  title: 'Newsletters',
  description: 'The YBA Monthly Update: what the Youth Blockchain Association is building, every month.',
  alternates: { canonical: '/newsletters' },
}

export default function Page() {
  return <NewslettersView />
}

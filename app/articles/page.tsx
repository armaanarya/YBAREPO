import type { Metadata } from 'next'
import { ArticlesView } from './view'

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Blockchain articles written by YBA students, for students.',
  alternates: { canonical: '/articles' },
}

export default function Page() {
  return <ArticlesView />
}

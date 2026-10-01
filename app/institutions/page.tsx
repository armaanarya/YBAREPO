import type { Metadata } from 'next'
import { InstitutionsView } from './view'

export const metadata: Metadata = {
  title: 'Institutions',
  description: 'Meet the organizations partnering with YBA and sponsoring student events.',
  alternates: { canonical: '/institutions' },
}

export default function Page() {
  return <InstitutionsView />
}

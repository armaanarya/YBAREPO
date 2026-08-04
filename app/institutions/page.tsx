import type { Metadata } from 'next'
import { InstitutionsView } from './view'

export const metadata: Metadata = {
  title: 'Institutions',
  description: 'Our partners and sponsors — the institutions bridging YBA students into the Web3 industry.',
  alternates: { canonical: '/institutions' },
}

export default function Page() {
  return <InstitutionsView />
}

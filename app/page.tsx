import type { Metadata } from 'next'
import { HomeView } from './view'

export const metadata: Metadata = {
  title: 'YBA — Youth Blockchain Association',
  description: 'Empowering the next generation of blockchain builders. High school students learning DeFi, smart contracts, and real-world blockchain applications.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return <HomeView />
}

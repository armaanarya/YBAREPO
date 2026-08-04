import type { Metadata } from 'next'
import { ContactView } from './view'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Youth Blockchain Association about partnerships, sponsorship, or joining.',
  alternates: { canonical: '/contact' },
}

export default function Page() {
  return <ContactView />
}

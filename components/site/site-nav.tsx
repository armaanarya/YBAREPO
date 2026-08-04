'use client'

import { YBANav } from '@/components/ui/resizable-navbar'
import { NAV_LINKS } from '@/lib/site-nav'

export function SiteNav() {
  return <YBANav items={NAV_LINKS} />
}

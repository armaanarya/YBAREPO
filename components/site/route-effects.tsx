'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { track } from '@/lib/track'

// Map pathnames back onto the page names the old single-page App reported, so
// rows logged before and after the routing refactor stay comparable.
function pageName(pathname: string): string {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/articles/')) return `article:${pathname.slice('/articles/'.length)}`
  return pathname.slice(1)
}

export function RouteEffects() {
  const pathname = usePathname()

  useEffect(() => { track('page_view', pageName(pathname)) }, [pathname])

  return null
}

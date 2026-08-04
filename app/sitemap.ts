import type { MetadataRoute } from 'next'
import { NAV_LINKS } from '@/lib/site-nav'
import { ARTICLES } from '@/lib/articles'

const BASE = 'https://joinyba.org'

export default function sitemap(): MetadataRoute.Sitemap {
  // /register is not in NAV_LINKS (it is reached via the CTA), so add it here.
  const pages = [...NAV_LINKS.map(l => l.href), '/register'].map(href => ({
    url: `${BASE}${href === '/' ? '' : href}`,
    changeFrequency: 'monthly' as const,
    priority: href === '/' ? 1 : 0.8,
  }))

  const articles = ARTICLES.map(a => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.dateISO),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [...pages, ...articles]
}

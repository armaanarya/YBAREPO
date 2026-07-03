import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1h

const FEED = 'https://medium.com/feed/youth-blockchain-association'
const PUBLICATION = 'https://medium.com/youth-blockchain-association'

type Article = { title: string; author: string; link: string; date: string; excerpt: string }

// Curated fallback so the page NEVER renders empty if the feed is unreachable.
const FALLBACK: Article[] = [
  {
    title: 'What is Blockchain? (For Teens)',
    author: 'Sumedh Seetharaman',
    link: 'https://medium.com/youth-blockchain-association/what-is-blockchain-for-teens-c24d9a85fee1',
    date: 'Wed, 01 Jul 2026 06:22:18 GMT',
    excerpt: 'An introduction to blockchain for teens — the real-world problems it solves and why decentralized record-keeping matters.',
  },
]

// Plain-regex extraction: no XML parser, so no entity expansion (XXE-safe).
const tagPatterns = new Map<string, RegExp>()
function pick(block: string, tag: string): string {
  let re = tagPatterns.get(tag)
  if (!re) {
    re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
    tagPatterns.set(tag, re)
  }
  const m = block.match(re)
  if (!m) return ''
  return m[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim()
}

export async function GET() {
  try {
    const res = await fetch(FEED, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`feed ${res.status}`)
    const xml = await res.text()
    const items = xml.split('<item>').slice(1)
    const articles: Article[] = items.map(raw => {
      const block = raw.split('</item>')[0]
      const excerpt = pick(block, 'content:encoded') || pick(block, 'description')
      return {
        title: pick(block, 'title'),
        author: pick(block, 'dc:creator'),
        link: (pick(block, 'link') || PUBLICATION).split('?')[0],
        date: pick(block, 'pubDate'),
        excerpt: excerpt.slice(0, 200),
      }
    }).filter(a => a.title && a.link.startsWith('https://'))

    return NextResponse.json({ articles: articles.length ? articles : FALLBACK, publication: PUBLICATION })
  } catch (err) {
    console.error('[articles]', err)
    return NextResponse.json({ articles: FALLBACK, publication: PUBLICATION })
  }
}

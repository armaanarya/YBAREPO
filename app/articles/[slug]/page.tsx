import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARTICLES } from '@/lib/articles'
import { BlockchainForTeensArticle } from '@/components/articles/blockchain-for-teens'
import { WhatIsBitcoinArticle } from '@/components/articles/what-is-bitcoin'
import { GlimpseIntoEthereumArticle } from '@/components/articles/glimpse-into-ethereum'
import { WhatAreSmartContractsArticle } from '@/components/articles/what-are-smart-contracts'

const BODIES: Record<string, React.ComponentType> = {
  'what-is-blockchain-for-teens': BlockchainForTeensArticle,
  'what-is-bitcoin-a-guide-to-digital-money-and-decentralization': WhatIsBitcoinArticle,
  'a-glimpse-into-ethereum': GlimpseIntoEthereumArticle,
  'what-are-smart-contracts-programs-that-keep-their-promises': WhatAreSmartContractsArticle,
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.dateISO,
      authors: [article.author],
      images: [{ url: article.image, width: article.imageW, height: article.imageH }],
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const Body = BODIES[slug]
  if (!Body) notFound()
  return <Body />
}

// Article metadata. Server-importable on purpose: app/sitemap.ts and
// app/articles/[slug]/generateMetadata both read this, so keep it free of
// 'use client' and of any React import.

export const MEDIUM_PUB  = 'https://medium.com/youth-blockchain-association'
export const MEDIUM_POST = 'https://medium.com/youth-blockchain-association/what-is-blockchain-for-teens-c24d9a85fee1'

export type ArticleMeta = {
  slug: string; title: string; author: string; date: string; dateISO: string;
  image: string; imageW: number; imageH: number; excerpt: string;
}

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'what-is-blockchain-for-teens',
    title: 'What is Blockchain? (For Teens)',
    author: 'Sumedh Seetharaman',
    date: 'Jul 1, 2026',
    dateISO: '2026-07-01',
    image: '/articles/blockchain-hero.png',
    imageW: 562, imageH: 574,
    excerpt: 'Most people think blockchain is just a confusing crypto thing that doesn’t affect real life. But strip away the finance jargon, and it comes down to one question: who gets to control the truth when something goes wrong?',
  },
  {
    slug: 'what-is-bitcoin-a-guide-to-digital-money-and-decentralization',
    title: 'What Is Bitcoin? A Guide to Digital Money and Decentralization',
    author: 'Arnav Mani',
    date: 'Jul 9, 2026',
    dateISO: '2026-07-09',
    image: '/articles/what-is-bitcoin-hero.png',
    imageW: 480, imageH: 388,
    excerpt: 'On May 22, 2010, a programmer named Laszlo Hanyecz paid 10,000 bitcoins for two pizzas. At the time, it felt like a fair trade.',
  },
]

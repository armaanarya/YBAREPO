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
    excerpt: 'A blockchain is a shared record that computers check using agreed rules. Here is how it works, where it can be useful, and what it cannot guarantee.',
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
  {
    slug: 'a-glimpse-into-ethereum',
    title: 'A glimpse into Ethereum',
    author: 'Armaan Arya',
    date: 'Oct 4, 2026',
    dateISO: '2026-10-04',
    image: '/articles/ethereum-card.png',
    imageW: 1483, imageH: 834,
    excerpt: 'Ethereum is a network of computers that lets people send digital money and use apps built on a shared public record. No single company runs the whole network.',
  },
  {
    slug: 'what-are-smart-contracts-programs-that-keep-their-promises',
    title: 'What are smart contracts? Programs that keep their promises',
    author: 'Arnav Mani',
    date: 'Oct 4, 2026',
    dateISO: '2026-10-04',
    image: '/articles/smart-contracts-hero.png',
    imageW: 1400, imageH: 788,
    excerpt: 'How a vending machine explains the code running Ethereum, what it can do, and where it breaks.',
  },
]

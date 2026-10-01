'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { MEDIUM_PUB } from '@/lib/articles'
import { T } from '@/lib/theme'
import { track } from '@/lib/track'

export function WhatIsBitcoinArticle() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const srcLink: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }
  const h3: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Link
          href="/articles"
          onClick={() => track('button_click', 'articles', { button: 'back_to_articles' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.muted, padding: '4px 0', marginBottom: '1.5rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
        >
          ← All articles
        </Link>
        <Badge>Articles</Badge>
        <TextStagger
          text="What Is Bitcoin? A Guide to Digital Money and Decentralization"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Arnav Mani · Youth Blockchain Association · Jul 9, 2026
        </p>
        <a
          href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer"
          onClick={() => track('button_click', 'articles', { button: 'medium_publication' })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '11px 22px', background: T.cta, color: T.ctaText, borderRadius: 10, fontFamily: T.inter, fontWeight: 600, fontSize: '0.9375rem' }}
        >
          Visit our Medium publication
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
        </a>
      </BlurFade>

      <article>
        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/what-is-bitcoin-hero.png" alt="What Is Bitcoin? A Guide to Digital Money and Decentralization" width={480} height={388} style={{ width: '100%', maxWidth: 480, height: 'auto', borderRadius: 16, border: `1px solid ${T.border}`, display: 'block', margin: '0 auto' }} />
        </figure>

        <p style={body}>
          On May 22, 2010, programmer Laszlo Hanyecz paid <strong>10,000 bitcoins for two pizzas</strong>. The purchase is remembered as Bitcoin Pizza Day. It is an early example of someone using bitcoin to buy something.
        </p>


        <h3 style={h3}>What is Bitcoin?</h3>
        <p style={body}>
          Bitcoin is digital money. It launched in 2009 under the name Satoshi Nakamoto. You can send it online, and the network records the transfer without moving physical coins or notes.
        </p>
        <p style={body}>
          A Bitcoin payment does not require a bank to approve it. Instead, computers on the network check the transaction against shared rules. A service such as Coinbase is a cryptocurrency exchange, where people can buy or sell bitcoin; it is not the currency itself.
        </p>
        <p style={body}>
          <strong>Risk</strong>: Bitcoin can lose value quickly. Understanding how it works does not make buying it a safe investment.
        </p>

        <h3 style={h3}>How the blockchain works</h3>
        <p style={body}>
          Bitcoin's blockchain is a public record of confirmed transactions. Anyone can inspect it. Unlike a bank's internal ledger, copies are stored and checked by independent computers called nodes.
        </p>
        <p style={body}>
          Think of a shared document whose earlier entries are difficult to change. The analogy is limited: Bitcoin uses cryptographic links and proof of work to protect its history, rather than document permissions.
        </p>
        <p style={body}>
          Each full node checks transactions and blocks against the network's rules. An altered copy does not become valid because one computer presents it. Changing confirmed history requires recreating the proof of work and competing with the rest of the network, as the <a style={srcLink} href="https://developer.bitcoin.org/devguide/block_chain.html" target="_blank" rel="noopener noreferrer">Bitcoin developer guide</a> explains.
        </p>
        <p style={body}>
          Miners compete to add a block by finding a hash that meets the network's difficulty target. Other nodes check the proposed block. A valid block lets its miner claim a reward that includes newly issued bitcoin and transaction fees. Blocks arrive about every ten minutes on average, though any one block may take longer or less time.
        </p>
        <p style={body}>
          Bitcoin's current rules cap the supply at <strong>21 million coins</strong>. That limit is one reason people compare it with gold. A limited supply does not guarantee that its price will rise.
        </p>

        <h3 style={h3}>What decentralization means</h3>

        <p style={body}>
          A bank maintains its customers' account records and decides whether to process payments. Using a bank means relying on its systems and policies, including its handling of fees, errors, and account restrictions.
        </p>
        <p style={body}>
          Bitcoin has no single organization approving every transaction. Independent computers follow shared rules to check the record.
        </p>
        <p style={body}>
          In a group project, one person might control the only copy of the document. Sharing copies lets others notice a change. Bitcoin adds rules for accepting changes and proof of work to make rewriting history costly. Agreement comes from those rules, not a vote by every person who owns bitcoin.
        </p>
        <p style={body}>
          Without one central operator, Bitcoin is harder to shut down at a single point. People can propose changes to its software, but participants choose which software and rules to run. Decentralization does not mean the rules can change without agreement.
        </p>

        <h3 style={h3}>Risks to understand</h3>
        <p style={body}>
          Bitcoin payments generally cannot be reversed by a central support team. If you send money to the wrong person, you may need the recipient to refund it. The price can also change sharply. You can check current prices and historical changes on <a style={srcLink} href="https://finance.yahoo.com/quote/BTC-USD/" target="_blank" rel="noopener noreferrer">Yahoo Finance's Bitcoin page</a>. Mining also uses electricity. These risks matter even if you understand the technology.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/what-is-bitcoin-price-chart.png" alt="Chart of the Bitcoin price rising and falling over time" width={1400} height={974} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
          <figcaption style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }}>
            <em>Bitcoin’s price can rise and fall sharply. Source: Yahoo Finance</em>
          </figcaption>
        </figure>

        <h3 style={h3}>Questions to ask before using Bitcoin</h3>
        <p style={body}>
          Bitcoin uses a public transaction record and a network of independent computers to process payments. It makes some kinds of record tampering difficult, but it does not prevent scams or guarantee that funds are safe.
        </p>
        <p style={body}>
          The useful questions are practical. Who controls your wallet? What happens if you lose access? What does a payment cost, and how long might confirmation take? Learning the answers is a better starting point than assuming the technology solves every problem.
        </p>

        <h3 style={h3}>Further reading</h3>
        <ul style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc', wordBreak: 'break-word' }}>
          <li><a style={srcLink} href="https://bitcoin.org/en/how-it-works" target="_blank" rel="noopener noreferrer">Bitcoin.org: how transactions work</a></li>
          <li><a style={srcLink} href="https://bitcoin.org/en/you-need-to-know" target="_blank" rel="noopener noreferrer">Bitcoin.org: risks to understand</a></li>
          <li><a style={srcLink} href="https://finance.yahoo.com/quote/BTC-USD/" target="_blank" rel="noopener noreferrer"><strong>Yahoo Finance, Bitcoin (BTC-USD)</strong></a><strong>:</strong> the live price, recent news, and price history.</li>
          <li><a style={srcLink} href="https://www.nerdwallet.com/article/investing/what-is-bitcoin" target="_blank" rel="noopener noreferrer"><strong>NerdWallet, What Is Bitcoin?</strong></a><strong>:</strong> a clear, beginner-friendly overview.</li>
          <li><a style={srcLink} href="https://www.coinbase.com/learn/crypto-basics/what-is-bitcoin" target="_blank" rel="noopener noreferrer"><strong>Coinbase Learn, What is Bitcoin?</strong></a><strong>:</strong> the basics, explained simply.</li>
        </ul>

        <p style={body}>
          <em>This article is for learning purposes only and isn’t financial advice. Cryptocurrency is high-risk, so always do your own research before making any decisions.</em>
        </p>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href="https://medium.com/youth-blockchain-association/what-is-bitcoin-a-guide-to-digital-money-and-decentralization-a1a21b5b1e6f" target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>What Is Bitcoin? A Guide to Digital Money and Decentralization</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

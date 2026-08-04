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
          On May 22, 2010, a programmer named Laszlo Hanyecz paid <strong>10,000 bitcoins for two pizzas</strong>. At the time, it felt like a fair trade. Today, those same 10,000 bitcoins would be worth <em>hundreds of millions of dollars</em>. People now jokingly celebrate the date as “Bitcoin Pizza Day,” and it’s a perfect reminder of how strange, new, and fast-moving this whole thing is.
        </p>
        <p style={body}>
          So what did Lasso end up spending?
        </p>

        <h3 style={h3}>So what is Bitcoin?</h3>
        <p style={body}>
          Bitcoin is virtual currency and is unlike currencies such as dollars or euros, which you can physically own. Bitcoins are simply deleted or exchanged online; eliminating the need for physical money. Bitcoin has been around since 2009, when it was invented by someone using the pseudonym of Satoshi Nakamoto.
        </p>
        <p style={body}>
          Bitcoin differs from fiat currency, as there is no financial institution or other third party providing approval when sending money through Bitcoin. Instead, as Coinbase (a digital currency exchange, also referred to as a cryptocurrency) explains, “it enables peer-to-peer funds transfer independent of the need for a financial or third-party institution’s involvement”.
        </p>
        <p style={body}>
          <strong>Warning</strong>: investing in and using cryptocurrencies, including Bitcoin, is a speculative investment; we will discuss this later.
        </p>

        <h3 style={h3}>How does it actually work? Meet the “blockchain”</h3>
        <p style={body}>
          The blockchain is a global and public ledger(organized system tracking documents financial transactions) of all Bitcoin transactions that have occurred throughout history. It operates similar to a traditional bank’s ledger but can be accessed by everyone on Earth.
        </p>
        <p style={body}>
          To better understand how the blockchain works, think of a shared Google Document that everyone globally can view, but no one has the capability to edit or delete anything previously written inside of it.
        </p>
        <p style={body}>
          The blockchain is designed in such a way that there exist thousands of computer nodes, each keeping their own copy of the same blockchain; these nodes are located throughout the world and function independently, while continually validating one another’s activities. If an individual were attempting to corrupt the Bitcoin transaction, their altered duplicate would produce a discrepancy among the 1,000s of other copies of the blockchain (i.e. node copies). As a result of an established and internationally accepted (300 million+) set of users, the validity/legitimacy of Bitcoin transactions is validated through the blockchain.
        </p>
        <p style={body}>
          A transaction is recreated in a “block” approximately every-ten-minutes from a large pool of transactions that are combined from around the world in real-time by networks of computers (mining) that are trying to solve a competitive mathematical operation, with the first computer completing the operation receiving newly generated bitcoin as a reward for their efforts.
        </p>
        <p style={body}>
          One last detail worth knowing: there will only <em>ever</em> be <strong>21 million bitcoins</strong> — that limit is built into the code. About 20 million already exist. Because the supply is capped, some people call Bitcoin “digital gold” and hold onto it, hoping it grows in value over time.
        </p>

        <h3 style={h3}>What does “decentralized” mean?</h3>
        <p style={body}>
          This is the single biggest idea behind Bitcoin, so it’s worth slowing down for.
        </p>
        <p style={body}>
          All banking is centralized. There is one centralized entity that controls all banking activity. A centralized entity, such as a bank, keeping official records of your accounts means that all transactions are maintained by that single entity (the bank). For the most part, this is okay, but centralization inherently presents risks of freezing, fees, human error, and hacks, along with the required level of trust in the central entity.
        </p>
        <p style={body}>
          Bitcoin is a decentralized form of currency. Therefore, there is no singular organization that controls Bitcoin. Trust is placed in multiple computers that follow the same publicly defined rules.
        </p>
        <p style={body}>
          Decentralization is similar to the way a group project can be done. In a group project, if one person is in charge they can easily change any of the work done by all of the other group members (without telling them). If there are fixed rules set by the group prior to the project and all group members maintain their own copy of the final project document, then no one individual can make a change without the group being notified and everyone being in agreement about the change being made. The same principle holds true for decentralization, where there is no concentration of centralized power.
        </p>
        <p style={body}>
          Decentralization is important because decentralization makes it much more difficult to shut down a network, much more difficult to censor the activities on a network and completely accessible to everyone with an internet connection. The rules of the network are coded into the network and do not require approval from a CEO or other type of politician to make modifications to the operations and rules of the network.
        </p>

        <h3 style={h3}>The Catch</h3>
        <p style={body}>
          While decentralization can be very attractive, there are real risks and trade-offs to decentralization. Since no one entity controls the public blockchain, there is no customer service to contact if you are scammed or send funds to an incorrect address. Bitcoin has a reputation for being very volatile in terms of price, i.e., it will vary in value quite dramatically from day to day. According to <a style={srcLink} href="https://finance.yahoo.com/quote/BTC-USD/" target="_blank" rel="noopener noreferrer">Yahoo’s real-time BTC-USD price page</a>, as of mid-2026, one bitcoin is worth approximately $64,000, but it has reached as high as approximately $126,000 and has dropped approximately 20% in value in the last month. Finally, bitcoin mining consumes a lot of electricity, which is a legitimate environmental concern.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/what-is-bitcoin-price-chart.png" alt="Chart of the Bitcoin price rising and falling over time" width={1400} height={974} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
          <figcaption style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }}>
            <em>Bitcoin’s price can rise and fall sharply. Source: Yahoo Finance</em>
          </figcaption>
        </figure>

        <h3 style={h3}>The bottom line</h3>
        <p style={body}>
          Bitcoin is an electronic form of currency using a global network rather than one institution (i.e., the banking system) to make transactions. With the blockchain as the underlying infrastructure for this digital currency, it makes it very difficult to commit fraud using Bitcoin as a means of payment. Additionally, since Bitcoin has been built upon a decentralized architecture, there is no authority or institution that has absolute control over it.
        </p>
        <p style={body}>
          This raises questions about whether this new way to transact will become a viable alternative to traditional financial systems, or if it’s just one big risk. The answer is not black and white, depending on who you ask. Either way, now you know exactly how much Laszlo paid for his two pizzas using Bitcoin, which I think puts you further ahead of the learning curve with Bitcoin than most of the people who utilize it.
        </p>

        <h3 style={h3}>Want to dig deeper?</h3>
        <ul style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc', wordBreak: 'break-word' }}>
          <li><a style={srcLink} href="https://finance.yahoo.com/quote/BTC-USD/" target="_blank" rel="noopener noreferrer"><strong>Yahoo Finance — Bitcoin (BTC-USD)</strong></a><strong>:</strong> the live price, recent news, and price history.</li>
          <li><a style={srcLink} href="https://www.nerdwallet.com/article/investing/what-is-bitcoin" target="_blank" rel="noopener noreferrer"><strong>NerdWallet — What Is Bitcoin?</strong></a><strong>:</strong> a clear, beginner-friendly overview.</li>
          <li><a style={srcLink} href="https://www.coinbase.com/learn/crypto-basics/what-is-bitcoin" target="_blank" rel="noopener noreferrer"><strong>Coinbase Learn — What is Bitcoin?</strong></a><strong>:</strong> the basics, explained simply.</li>
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

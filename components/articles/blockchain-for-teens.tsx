'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/site/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { TextStagger } from '@/components/ui/hero-animated'
import { MEDIUM_POST, MEDIUM_PUB } from '@/lib/articles'
import { T } from '@/lib/theme'
import { track } from '@/lib/track'

export function BlockchainForTeensArticle() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const srcLink: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }

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
          text="What is Blockchain? (For Teens)"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <blockquote style={{ fontFamily: T.inter, fontSize: '1.1875rem', fontStyle: 'italic', color: T.muted, lineHeight: 1.6, marginTop: '1.25rem', paddingLeft: '1.25rem', borderLeft: `3px solid ${T.accentMid}` }}>
          A student introduction to shared records and how blockchains work.
        </blockquote>
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Sumedh Seetharaman · Youth Blockchain Association · Jul 1, 2026
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
          <Image src="/articles/blockchain-hero.png" alt="What is Blockchain? (For Teens)" width={562} height={574} style={{ width: '100%', maxWidth: 480, height: 'auto', borderRadius: 16, border: `1px solid ${T.border}`, display: 'block', margin: '0 auto' }} />
        </figure>

        <p style={body}>
          I am Sumedh Seetharaman, finance lead at the Youth Blockchain Association. Here is how I think about blockchain and why it is worth learning about in high school.
        </p>
        <p style={body}>
          A blockchain is a shared record that several computers check using agreed rules. The <a style={srcLink} href="https://www.postofficehorizoninquiry.org.uk/" target="_blank" rel="noopener noreferrer">UK Post Office Horizon scandal</a> shows why access to records and the ability to challenge them matter. Faulty accounting records were used against branch operators, with devastating consequences. A shared record can make changes easier to trace, but a blockchain would not automatically fix bad data or unfair decisions.
        </p>
        <p style={body}>
          When you send money through a bank or buy something online, an organization keeps the transaction record. That arrangement is useful, but you rely on the organization to maintain accurate records and resolve disputes. A public blockchain takes a different approach: participants can check the record themselves.
        </p>
        <p style={body}>
          Transactions are grouped into blocks. Each block links to the one before it through a cryptographic hash, a value calculated from the data. Changing an earlier transaction changes its hash and breaks those links. Different networks use different rules to agree on which blocks to accept. In Bitcoin, rewriting confirmed history requires repeating proof of work and competing with the rest of the network. The <a style={srcLink} href="https://developer.bitcoin.org/devguide/block_chain.html" target="_blank" rel="noopener noreferrer">Bitcoin developer guide</a> explains that process.
        </p>
        <p style={body}>
          Blockchains can also record ticket ownership, product histories, or digital assets. These uses still depend on the surrounding system. Recording a sneaker on a blockchain does not prove the physical shoe is genuine. A supply-chain record is only as useful as the information entered into it.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/blockchain-market-growth.png" alt="Chart of projected blockchain market growth" width={1400} height={818} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
          <figcaption style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }}>
            A blockchain market growth projection. Forecasts depend on their assumptions.
          </figcaption>
        </figure>

        <p style={body}>
          When you send cryptocurrency, your wallet signs a transaction and broadcasts it to the network. Participants check whether it follows the rules before it is added to the chain. Confirmation rules differ across networks. On Bitcoin, later blocks make a confirmed transaction harder to reverse, but a mistaken payment generally has to be refunded by its recipient.
        </p>
        <p style={body}>
          Learning about blockchain can lead you toward software development, design, or questions about law and policy. You do not need to choose a career now. Start by understanding how the record works, try a small project, and ask which problems the technology can actually solve.
        </p>

        <h3 style={{ fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }}>Further reading</h3>
        <ol style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'decimal', wordBreak: 'break-word' }}>
          <li>TekRevol. <em>Blockchain Statistics &amp; Facts 2025.</em> <a style={srcLink} href="https://www.tekrevol.com/blogs/blockchain-statistics-facts/" target="_blank" rel="noopener noreferrer">https://www.tekrevol.com/blogs/blockchain-statistics-facts/</a></li>
          <li>CoinLaw. <em>Web3 Economy Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/web3-economy-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/web3-economy-statistics/</a></li>
          <li>SQ Magazine. <em>Blockchain Statistics 2026.</em> <a style={srcLink} href="https://sqmagazine.co.uk/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://sqmagazine.co.uk/blockchain-statistics/</a></li>
          <li>ElectroIQ. <em>Blockchain Statistics and Facts (2025).</em> <a style={srcLink} href="https://electroiq.com/stats/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://electroiq.com/stats/blockchain-statistics/</a></li>
          <li>CoinLaw. <em>Crypto Industry Employment Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/crypto-industry-employment-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/crypto-industry-employment-statistics/</a></li>
          <li>Algorand. <em>Blockchain Developer Salary and Job Outlook (2025).</em> <a style={srcLink} href="https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025" target="_blank" rel="noopener noreferrer">https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025</a></li>
          <li>Market.us. <em>Blockchain Technology Market.</em> <a style={srcLink} href="https://market.us/report/blockchain-technology-market/" target="_blank" rel="noopener noreferrer">https://market.us/report/blockchain-technology-market/</a></li>
        </ol>

        <p style={body}>
          Follow our Medium publication for more student-written articles.
        </p>
        <p style={body}>
          Thanks for reading.
        </p>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href={MEDIUM_POST} target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>What is Blockchain? (For Teens)</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

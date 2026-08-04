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
          Blockchain is a rapidly growing technology, and it’s time to bring our youth into the industry.
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
          Hi everyone! My name is Sumedh Seetharaman, and I am head of finance at the Youth Blockchain Association. Today I would like to discuss a topic that I strongly resonate with, and I hope you enjoy!
        </p>
        <p style={body}>
          Most people think blockchain is just a confusing crypto thing that doesn’t affect real life. But strip away the finance jargon, and it comes down to one question: who gets to control the truth when something goes wrong? The UK Post Office Horizon scandal is the clearest answer I’ve seen. For years, a faulty accounting system reported money missing from local branches. The Post Office believed its software over the people actually working there, and over 700 sub-postmasters were prosecuted for theft and fraud they never committed. Some went to prison. Lives were destroyed over numbers that were wrong from the start. Nobody could prove it because only the post office controlled the records. That’s exactly the problem blockchain exists to prevent. A blockchain is a record that multiple independent parties can see and check at once, not one company’s private system that only they can read. If those transactions had been stored on a blockchain, it would have been much harder for a single, unverifiable version of “the truth” to destroy real people’s lives for over a decade.
        </p>
        <p style={body}>
          That’s basically the whole problem blockchain is trying to solve. Right now, every digital transaction you make goes through somebody else first. Want to send money? Your bank has to approve it. Bought something online? That platform is keeping the record. Even your game skins technically belong to the company, not you. And look, most of the time these middlemen do their job fine. But “most of the time” isn’t the same as always. According to <a style={srcLink} href="https://www.tekrevol.com/blogs/blockchain-statistics-facts/" target="_blank" rel="noopener noreferrer">TekRevol</a>, around 90% of U.S. and European banks were already looking into blockchain by 2025. Even they know their own system isn’t perfect.
        </p>
        <p style={body}>
          So what blockchain actually does is try to cut out that middleman completely. Instead of one company keeping the record, thousands of computers all over the world keep the exact same copy of it at the same time. Every new piece of information gets bundled into a “block” and locked onto the end of every previous block, going all the way back to the very first one ever recorded. If someone wanted to go back and change something, they’d have to redo every single block after it across the majority of those thousands of computers all at once, which is pretty much impossible. According to <a style={srcLink} href="https://coinlaw.io/web3-economy-statistics/" target="_blank" rel="noopener noreferrer">CoinLaw</a>, there are already over 70,000 of these computers running right now. Good luck trying to cheat that.
        </p>
        <p style={body}>
          And before you say, “Okay, cool, but this is just a crypto thing,” it’s really not anymore. Fake sneakers? Blockchain can verify if they’re real. Concert ticket scams where the same ticket gets sold five times? Blockchain fixes that. Hospitals are using it to secure patient records so they can’t be tampered with. Artists use it to prove they actually made something. Even grocery stores are experimenting with it to show exactly where your food came from and who touched it along the way. According to <a style={srcLink} href="https://electroiq.com/stats/blockchain-statistics/" target="_blank" rel="noopener noreferrer">ElectroIQ</a>, the blockchain market is on track to hit over $1 trillion by 2030, and according to <a style={srcLink} href="https://market.us/report/blockchain-technology-market/" target="_blank" rel="noopener noreferrer">Market.us</a>, it could reach as high as $12,895 billion by 2033, up from just $123 billion in 2023. A trillion. For something most people my age think is just a crypto thing.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/blockchain-market-growth.png" alt="Chart of projected blockchain market growth" width={1400} height={818} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
          <figcaption style={{ fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }}>
            The blockchain market is growing faster than ever
          </figcaption>
        </figure>

        <p style={body}>
          The actual process of sending something through a blockchain is wild when you think about it. Say you send a friend some crypto. That one action gets broadcast out to thousands of computers immediately, and they all start checking it at the same time. Do you actually have the funds? Is this legit? Once enough of them agree, it checks out, and it gets locked in permanently. No reversals. No “oops, we made a mistake.” It just lives in that chain forever. According to <a style={srcLink} href="https://sqmagazine.co.uk/blockchain-statistics/" target="_blank" rel="noopener noreferrer">SQ Magazine</a>, Ethereum alone handled over 200 million transactions in just the first three months of 2026. That’s not a system that’s struggling.
        </p>
        <p style={body}>
          Most people my age have no clue how big this industry already is. According to <a style={srcLink} href="https://coinlaw.io/crypto-industry-employment-statistics/" target="_blank" rel="noopener noreferrer">CoinLaw</a>, demand for blockchain developers shot up 250% since 2023, and over 66,000 new jobs were added in 2025 alone. And according to <a style={srcLink} href="https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025" target="_blank" rel="noopener noreferrer">Algorand</a>, the average blockchain developer in the U.S. is making $146,250 a year. You don’t even have to be a developer. There’s legal work, design, policy, writing, and marketing; all of it is growing. The teens who actually understand what a blockchain is right now are already ahead of most adults. That’s not something that happens very often, so maybe pay attention this time.
        </p>

        <h3 style={{ fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }}>Sources</h3>
        <ol style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'decimal', wordBreak: 'break-word' }}>
          <li>TekRevol. <em>Blockchain Statistics &amp; Facts 2025.</em> <a style={srcLink} href="https://www.tekrevol.com/blogs/blockchain-statistics-facts/" target="_blank" rel="noopener noreferrer">https://www.tekrevol.com/blogs/blockchain-statistics-facts/</a></li>
          <li>CoinLaw. <em>Web3 Economy Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/web3-economy-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/web3-economy-statistics/</a></li>
          <li>SQ Magazine. <em>Blockchain Statistics 2026.</em> <a style={srcLink} href="https://sqmagazine.co.uk/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://sqmagazine.co.uk/blockchain-statistics/</a></li>
          <li>ElectroIQ. <em>Blockchain Statistics and Facts (2025).</em> <a style={srcLink} href="https://electroiq.com/stats/blockchain-statistics/" target="_blank" rel="noopener noreferrer">https://electroiq.com/stats/blockchain-statistics/</a></li>
          <li>CoinLaw. <em>Crypto Industry Employment Statistics 2026.</em> <a style={srcLink} href="https://coinlaw.io/crypto-industry-employment-statistics/" target="_blank" rel="noopener noreferrer">https://coinlaw.io/crypto-industry-employment-statistics/</a></li>
          <li>Algorand. <em>Blockchain Developer Salary and Job Outlook (2025).</em> <a style={srcLink} href="https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025" target="_blank" rel="noopener noreferrer">https://algorand.co/blog/blockchain-developer-salary-and-job-outlook-2025</a></li>
          <li>Market.us. <em>Blockchain Technology Market.</em> <a style={srcLink} href="https://market.us/report/blockchain-technology-market/" target="_blank" rel="noopener noreferrer">https://market.us/report/blockchain-technology-market/</a></li>
        </ol>

        <p style={body}>Be sure to follow and click applaud!</p>
        <p style={body}>Thank you, everyone!</p>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href={MEDIUM_POST} target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>What is Blockchain? (For Teens)</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

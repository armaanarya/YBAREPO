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

const SOURCES: { who: string; title: string; href: string; note: string }[] = [
  { who: 'Axel Adler Jr.', title: 'Stablecoin Market Cap and Bitcoin: Growth, the 2022 Drop and 2026', href: 'https://axeladlerjr.com/stablecoin-market-cap-usdt-usdc-bitcoin-signal/', note: 'updated Nov. 3, 2026' },
  { who: 'Transak', title: 'Stablecoin Market Cap in 2026', href: 'https://transak.com/blog/stablecoin-market-cap-2026', note: 'data as of June 12, 2026' },
  { who: 'Spark', title: 'Stablecoin Market Cap Tracker', href: 'https://www.spark.money/tools/stablecoin-market-cap-tracker', note: 'August 2026 data' },
  { who: 'World Bank', title: 'Remittance Prices Worldwide, Issue 54', href: 'https://remittanceprices.worldbank.org/', note: 'September 2025' },
  { who: 'Cointelegraph', title: 'Stablecoin remittances cost 84% less, Borderless report finds', href: 'https://cointelegraph.com/news/stablecoin-remittances-cost-savings-traditional-transfers', note: 'covering Borderless’s Q3 2026 report' },
  { who: 'Banca d’Italia', title: 'Are Stablecoins Efficient for Remittances? Evidence from a Mystery Shopping Exercise', href: 'https://www.bancaditalia.it/pubblicazioni/mercati-infrastrutture-e-sistemi-di-pagamento/approfondimenti/2026-086/index.html', note: 'Markets, Infrastructures and Payment Systems Paper No. 86 (July 30, 2026)' },
  { who: 'Payment Expert', title: 'Bank of Italy finds no systematic cost advantage for stablecoin remittances', href: 'https://paymentexpert.com/2026/08/03/bank-of-italy-stablecoin-remittances/', note: 'Aug. 3, 2026' },
  { who: 'Digital Today', title: 'Bank of Italy says stablecoin remittances show no consistent cost advantage', href: 'https://www.digitaltoday.co.kr/en/view/87973/bank-of-italy-says-stablecoin-remittances-show-no-consistent-cost-advantage', note: '2026' },
  { who: 'Federal Reserve Board', title: 'In the Shadow of Bank Runs: Lessons from the Silicon Valley Bank Failure and Its Impact on Stablecoins', href: 'https://www.federalreserve.gov/econres/notes/feds-notes/in-the-shadow-of-bank-run-lessons-from-the-silicon-valley-bank-failure-and-its-impact-on-stablecoins-20251217.html', note: 'FEDS Notes (Dec. 17, 2025)' },
  { who: 'Forkast', title: 'Federal Reserve research on stablecoins and bank lending', href: 'https://forkast.news/?p=129574', note: '2026' },
  { who: 'Cointelegraph', title: 'Banks fear stablecoin “bank run,” regulators see limited impact', href: 'https://cointelegraph.com/news/banks-warn-of-stablecoin-bank-run-risk-regulators-see-limited-impact', note: 'Jan. 28, 2026' },
  { who: 'Stablecoin Insider', title: 'Circle and Coinbase Renew USDC Deal to 2029, Terms Unchanged', href: 'https://stablecoininsider.org/circle-coinbase-usdc-agreement-renewal-2029/', note: 'Aug. 18, 2026' },
  { who: 'CryptoSlate', title: 'OCC drops proposed affiliate rewards presumption, but stablecoin yield ban stays', href: 'https://cryptoslate.com/?p=575363', note: 'October 2026' },
  { who: 'Office of the Comptroller of the Currency', title: 'Bulletin 2026–50, GENIUS Act Regulations: Final Rule', href: 'https://occ.gov/news-issuances/bulletins/2026/bulletin-2026-50.html', note: 'Oct. 21, 2026' },
  { who: 'Jones Day', title: 'OCC finalizes stablecoin framework under the GENIUS Act', href: 'https://www.jonesday.com/de/insights/2026/10/occ-finalizes-stablecoin-framework-under-the-genius-act', note: 'October 2026' },
  { who: 'Winston & Taylor', title: 'OCC finalizes GENIUS Act rules for stablecoin issuers', href: 'https://www.winstontaylor.com/insights/occ-finalizes-genius-act-rules-for-stablecoin-issuers', note: 'Oct. 29, 2026' },
  { who: 'Stablecoin Insider', title: 'What Happens to USDT in the US After July 2028?', href: 'https://stablecoininsider.org/genius-act-2028-deadline-stablecoins/', note: '2026' },
  { who: 'Tether', title: 'Terms of Service', href: 'https://tether.to/en/legal/', note: 'last updated Feb. 26, 2026' },
  { who: 'Bankless', title: 'Tether launches US-regulated USA₮ stablecoin', href: 'https://www.bankless.com/read/news/tether-launches-usat-a-federally-regulated-u-s-stablecoin', note: 'Jan. 27, 2026' },
  { who: 'CoinMarketCap', title: 'Tether relocates headquarters to El Salvador', href: 'https://coinmarketcap.com/academy/article/tether-relocates-headquarters-to-el-salvador-after-securing-digital-asset-service-provider-license', note: 'January 2025' },
]

export function StablecoinsArticle() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const srcLink: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }
  const h3: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }
  const img: React.CSSProperties = { width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }
  const caption: React.CSSProperties = { fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }

  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(5rem,10vw,8rem) clamp(1.25rem,4vw,3rem) 4rem', minHeight: '65vh' }}>
      <BlurFade inView delay={0.05} yOffset={12}>
        <Link
          href="/articles"
          onClick={() => track('button_click', 'articles', { button: 'back_to_articles' })}
          style={{ display: 'flex', width: 'fit-content', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontFamily: T.inter, fontSize: '0.9375rem', fontWeight: 600, color: T.muted, padding: '4px 0', marginBottom: '1.5rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = T.dark)}
          onMouseLeave={e => (e.currentTarget.style.color = T.muted)}
        >
          ← All articles
        </Link>
        <Badge>Articles</Badge>
        <TextStagger
          text="Stablecoins: What They Are and Why People Care"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Sumedh Seetharaman · Youth Blockchain Association · Nov 9, 2026
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
          <Image src="/articles/stablecoins-hero.png" alt="A dollar goes to an issuer, who keeps it in reserves of cash and Treasury bills and creates one $1.00 stablecoin token; returning the token deletes it and gives the dollar back" width={1400} height={788} style={img} priority />
          <figcaption style={caption}>
            <em>Every token is backed by a dollar (or something just as safe) in the issuer’s reserves. Diagram: YBA.</em>
          </figcaption>
        </figure>

        <p style={body}>
          A stablecoin is a type of cryptocurrency designed to always be worth the same amount, usually one U.S. dollar. Bitcoin’s price can rise or fall by thousands of dollars in a single week. A stablecoin is supposed to stay at $1.00 the whole time, the way a dollar bill does.
        </p>
        <p style={body}>
          That one feature, a steady price, is the whole point. It lets people use the speed of crypto without the wild price swings.
        </p>

        <h3 style={h3}>How a stablecoin keeps its price</h3>
        <p style={body}>
          Think about a coat check at a concert. You hand over your coat and get a numbered ticket. The ticket has value only because your coat is hanging in the back room, and you can trade the ticket for the coat whenever you want.
        </p>
        <p style={body}>
          Most stablecoins work the same way. A company called an <strong>issuer</strong> takes your dollar and gives you one digital token. The issuer keeps that dollar, or something just as safe, in a pile called the <strong>reserves</strong>. When you want your dollar back, you return the token and the issuer deletes it. This trade is called <strong>redeeming</strong>.
        </p>
        <p style={body}>
          Reserves are usually held as cash in banks and as <strong>Treasury bills</strong>, which are short-term loans to the U.S. government that get paid back within a few months. As long as the reserves stay full and people trust they can redeem, the token stays at about $1.
        </p>
        <p style={body}>
          The tokens live on a <strong>blockchain</strong>, a shared public record of who owns what. Thousands of computers keep copies of that record, so no single bank has to approve each payment. That’s why a stablecoin can move at 3 a.m. on a Sunday, or from the U.S. to the Philippines, in minutes.
        </p>
        <p style={body}>
          Two stablecoins dominate. As of mid-2026, Tether’s USDT held about 59% of the market and Circle’s USDC about 24%. On November 2, 2026, all stablecoins together were worth about $298 billion, according to data compiled by analyst Axel Adler Jr. That’s below the record set in May 2026, which different trackers put somewhere between $315 billion and $323 billion.
        </p>

        <h3 style={h3}>Why they matter: sending money home</h3>
        <p style={body}>
          The clearest use is sending money across borders. Millions of people work in one country and send part of their paycheck to family in another. These payments are called <strong>remittances</strong>, and they are expensive.
        </p>
        <p style={body}>
          According to World Bank data from late 2025, sending $200 to another country cost an average of 6.36%, or about $12.72. Part of that comes from the chain of banks each payment passes through, and part comes from the exchange rate the company gives you.
        </p>
        <p style={body}>
          Stablecoins can cut out some of those middle steps. A stablecoin payments company called Borderless reported that sending $200 through stablecoin services cost a median of about 1%, or $2, in 2026.
        </p>
        <p style={body}>
          Here is what that difference could mean for one person. Say someone sends $200 home every month. At the World Bank average, they would pay about $153 a year in fees. At the Borderless number, they would pay about $24. That’s roughly $130 a year that stays with the family. Keep in mind that this compares a 2026 median with a 2025 average. A median is the middle price in a list, and for prices like these it usually comes out lower than the average, so the real gap is probably smaller than it looks.
        </p>
        <p style={body}>
          There’s a catch, though. Borderless sells stablecoin payments, so it has a reason to publish good numbers. Researchers at the Bank of Italy, Italy’s central bank, ran their own test in March 2026. They sent $200 in USDC in both directions between Italy and five other countries, and costs ranged from 0.30% to 8.96% of the amount.
        </p>
        <p style={body}>
          The direction mattered a lot. Sending from Italy to Argentina looked cheapest at 0.30%, but the researchers warn that number is misleading. They measured it against Argentina’s official exchange rate, which was about 3% off the rate the USDC trades actually used that day. The same gap helped push the reverse route, Argentina to Italy, up to 8.96%. That made it basically tied for most expensive with the route from the United Arab Emirates to Italy, at 8.95%. There, a credit card was the only way to pay, and its 3.8% surcharge drove up the cost.
        </p>
        <p style={body}>
          Moving the token on the blockchain was cheap. Most of the cost came from turning regular money into stablecoins at the start and back into local money at the end. Stablecoins beat the World Bank averages on most routes. But they were cheaper than Wise, a regular money-transfer app, in only three of the seven routes where the two could be compared.
        </p>
        <p style={body}>
          So the honest answer is that stablecoins can make sending money cheaper, depending on the route and the service you use.
        </p>

        <h3 style={h3}>The risks and tradeoffs</h3>
        <p style={body}>
          <strong>A stablecoin is only as good as what backs it.</strong> In March 2023, Circle had $3.3 billion of USDC’s reserves sitting in Silicon Valley Bank when that bank failed. For a weekend, nobody knew if that money was safe, and USDC dropped to about 87 cents. It went back to $1 only after the U.S. government said it would protect the bank’s deposits.
        </p>
        <p style={body}>
          <strong>Some “stablecoins” had no real reserves at all.</strong> TerraUSD, in 2022, tried to hold its price with a computer program tied to a sister token called Luna, instead of with dollars in a bank. When people rushed to sell, the system fell apart and TerraUSD dropped close to zero. People holding TerraUSD and Luna lost tens of billions of dollars between them.
        </p>
        <p style={body}>
          <strong>Stablecoins are not bank accounts.</strong> Money in a U.S. bank is insured by the government’s FDIC up to $250,000 if the bank fails. Stablecoins don’t have that insurance.
        </p>
        <p style={body}>
          <strong>The issuer can’t pay you interest.</strong> The new U.S. stablecoin law, covered below, bans issuers from paying interest to people who hold their tokens. Holding a stablecoin is more like keeping cash in your wallet than putting it in a savings account. Some trading apps still offer “rewards” for keeping stablecoins with them. Those rewards are often paid for by a deal in which the issuer shares its earnings with the app. For example, Circle, the company behind USDC, shares income from its reserves with the exchange Coinbase. The final federal rule dropped a plan to treat many of these deals as banned interest, but it didn’t approve them either. Regulators will judge each one on its own facts, and older programs get no special exemption, so the rewards you see today could change.
        </p>
        <p style={body}>
          <strong>Mistakes are hard to undo.</strong> If you send a stablecoin to the wrong address or to a scammer, there is usually no bank you can call to reverse it.
        </p>
        <p style={body}>
          <strong>Banks are worried.</strong> Banks use the money sitting in checking accounts to make loans, like the mortgage a family takes out to buy a house. If people move a lot of money out of banks and into stablecoins, banks have less to lend. A Federal Reserve paper in 2026 estimated that if $100 billion left bank deposits this way, bank lending could fall by $60 billion to $126 billion. Other experts point out there’s little evidence of that happening so far.
        </p>

        <h3 style={h3}>The new rules</h3>
        <p style={body}>
          For years, stablecoins in the U.S. had no clear rulebook. That changed when the <strong>GENIUS Act</strong> was signed into law on July 18, 2025. It requires issuers to back every token one-for-one with safe assets like cash and Treasury bills, to report what’s in their reserves, and to let people redeem their tokens.
        </p>
        <p style={body}>
          Government agencies have spent the time since writing the detailed rules. In October 2026, the Office of the Comptroller of the Currency, a federal agency that oversees banks, released its final version. It gives issuers up to two business days to pay people back when they redeem. That clock starts only after the issuer has the request and has finished signing up the customer, which includes checking who they are. The deadline counts as met once the issuer starts sending the money, not when the money reaches you, and business days skip weekends. So it doesn’t promise money in your account within 48 hours of asking. The law and that rule both take effect on January 18, 2027. Other agencies are still finishing their parts.
        </p>
        <p style={body}>
          Rules can make reserves safer and easier to check. They can’t remove every risk, and they reach only issuers that fall under U.S. law. That matters for the biggest coin. Tether, the company behind USDT, is based in El Salvador. Its terms of service don’t let U.S. customers buy or redeem USDT directly from the company, although Americans can still find USDT on some trading platforms. Under the new law, platforms serving U.S. customers, including some based overseas, will generally have to stop offering it after July 18, 2028, unless Tether meets the law’s requirements for foreign issuers. Tether launched a separate U.S. coin, USAT, in January 2026 to follow the new rules, and it says it is also working to bring USDT into compliance.
        </p>

        <h3 style={h3}>The question to ask</h3>
        <p style={body}>
          Stablecoins are a faster, sometimes cheaper way to move dollars around the world, with real weaknesses attached. When you hear about a new one, ask two things: what is backing the token, and how sure are you that you can trade it back for a real dollar?
        </p>

        <h3 style={h3}>Sources</h3>
        <ul style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc', wordBreak: 'break-word' }}>
          {SOURCES.map(s => (
            <li key={s.href}>
              {s.who}, <a style={srcLink} href={s.href} target="_blank" rel="noopener noreferrer">{s.title}</a> ({s.note})
            </li>
          ))}
        </ul>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href="https://medium.com/youth-blockchain-association/stablecoins-what-they-are-and-why-people-care-c63782e20ef6" target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>Stablecoins: What They Are and Why People Care</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

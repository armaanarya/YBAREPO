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

const SOURCES: [string, string][] = [
  ['Ethereum overview', 'https://ethereum.org/what-is-ethereum/'],
  ['Blockchain basics', 'https://ethereum.org/developers/docs/intro-to-ethereum/'],
  ['Gas fees explained', 'https://ethereum.org/developers/docs/gas/'],
  ['How smart contracts work', 'https://ethereum.org/developers/docs/smart-contracts/'],
  ['Stablecoins explained', 'https://ethereum.org/stablecoins/'],
  ['DeFi explained', 'https://ethereum.org/defi/'],
  ['NFTs explained', 'https://ethereum.org/nft/'],
  ['Ethereum wallets', 'https://ethereum.org/wallets/'],
  ['How transactions work', 'https://ethereum.org/developers/docs/transactions/'],
  ['Staking explained', 'https://ethereum.org/staking/'],
  ['Ethereum’s energy use', 'https://ethereum.org/energy-consumption/'],
  ['Layer 2 networks', 'https://ethereum.org/layer-2/'],
  ['Ether explained', 'https://ethereum.org/what-is-ether/'],
  ['Security and scam prevention', 'https://ethereum.org/security/'],
]

export function GlimpseIntoEthereumArticle() {
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
          text="A glimpse into Ethereum"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Armaan Arya · Youth Blockchain Association · Oct 4, 2026
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
          <Image src="/articles/ethereum-hero.png" alt="The Ethereum logo" width={540} height={834} style={{ width: '100%', maxWidth: 280, height: 'auto', borderRadius: 16, border: `1px solid ${T.border}`, display: 'block', margin: '0 auto' }} />
        </figure>

        <p style={body}>
          Ethereum is a network of computers that lets people send digital money and use apps built on a shared public record. No single company runs the whole network.
        </p>
        <p style={body}>
          It launched in 2015, created by Vitalik Buterin and a team of co-founders. To understand it, start with that shared record.
        </p>

        <h3 style={h3}>What is a blockchain?</h3>
        <p style={body}>
          Think of a notebook that records payments. Instead of one bank keeping the notebook, many computers keep copies and check new entries against the same rules.
        </p>
        <p style={body}>
          Payments are grouped into batches called blocks. Each block connects to the one before it. This linked record is called a blockchain.
        </p>
        <p style={body}>
          Ethereum uses this system to record transfers and run programs. Having many computers check the record makes it difficult for someone to change it dishonestly.
        </p>

        <h3 style={h3}>Ethereum and ether are different</h3>
        <p style={body}>
          Ethereum is the network. Ether, usually written as ETH, is its digital currency.
        </p>
        <p style={body}>
          When you send ETH or make a change through a program on Ethereum, you pay a transaction fee in ETH. This is called a gas fee. It pays for the work the network does to process your request.
        </p>
        <p style={body}>
          The fee changes depending on how busy the network is and how much work your request needs. It is separate from the amount you send.
        </p>

        <h3 style={h3}>What makes Ethereum different from Bitcoin?</h3>
        <p style={body}>
          Bitcoin was created as a way to send digital money without a bank handling the payment. Ethereum also supports programs called smart contracts.
        </p>
        <p style={body}>
          A smart contract is a program stored on the blockchain. When someone uses it, it follows the rules written in its code.
        </p>
        <p style={body}>
          A vending machine is a useful comparison. You choose a snack and put in enough money. The machine follows its instructions and gives you the snack.
        </p>
        <p style={body}>
          A smart contract can work similarly with digital items. For example, a program could send a digital collectible to a buyer after receiving the required payment.
        </p>
        <p style={body}>
          The word “smart” does not mean the program thinks for itself. People write its rules, and mistakes in those rules can cause problems.
        </p>

        <h3 style={h3}>What do people use it for?</h3>
        <p style={body}>
          Some people use Ethereum to send stablecoins. These are digital currencies designed to keep a steady value. USDC, for example, aims to stay worth one US dollar per coin. That value is a target, not a guarantee.
        </p>
        <p style={body}>
          Others use apps to lend or borrow digital money, or exchange one digital currency for another. These services are often called decentralized finance, or DeFi. Smart contracts handle transactions that a bank or broker would otherwise manage.
        </p>
        <p style={body}>
          Ethereum also supports NFTs. An NFT is a unique digital token that can represent a collectible or another item. The blockchain records which account owns the token. An image linked to an NFT can still be copied.
        </p>

        <h3 style={h3}>What happens when you send money?</h3>
        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/ethereum-send-money.png" alt="Diagram of a decentralized ledger: Alice's payment to Bob passes through a ring of computers that each keep a copy of the record" width={1264} height={656} style={{ width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }} />
        </figure>
        <p style={body}>
          You use a wallet app to access your Ethereum account. The wallet lets you check your balance and approve payments. Your friend gives you an account address, which tells the network where to send the money.
        </p>
        <p style={body}>
          After you approve a payment, the wallet sends it to the network. Computers check that it follows the rules, including whether you have enough money. A valid payment can then be included in a block and added to the shared record.
        </p>
        <p style={body}>
          Participants called validators help check and add blocks. They put up ETH as a deposit, a process called staking. They earn rewards for doing this work, but can lose some of their deposit for breaking the rules. This system is called proof of stake.
        </p>
        <p style={body}>
          Ethereum switched to proof of stake in 2022. The change was called the Merge. The old system used computers competing to solve puzzles. Proof of stake uses much less electricity.
        </p>

        <h3 style={h3}>Why can fees be expensive?</h3>
        <p style={body}>
          Ethereum has limited space for transactions. When lots of people want to use it at once, fees can rise.
        </p>
        <p style={body}>
          Additional networks, such as Base and Arbitrum, process transactions separately and send information back to Ethereum. These are called layer 2 networks. They usually offer lower fees, though the cost and risks depend on the network you use.
        </p>

        <h3 style={h3}>Why do people buy ETH?</h3>
        <p style={body}>
          Some buy ETH to pay transaction fees. Others use it for staking or hope to sell it later at a higher price.
        </p>
        <p style={body}>
          Ethereum also permanently removes part of each transaction fee from circulation. This is called burning ETH. New ETH is created to reward validators, so burning does not mean the total supply always falls.
        </p>
        <p style={body}>
          None of these features guarantees that ETH will rise in price. Its value can fall sharply.
        </p>

        <h3 style={h3}>What can go wrong?</h3>
        <p style={body}>
          Ethereum can be difficult for beginners to use. Sending money to the wrong address can cause a permanent loss, and there is usually no way to undo a completed payment.
        </p>
        <p style={body}>
          Many wallets give you a secret recovery phrase: a set of words used to restore access to your account. Anyone who gets those words may be able to take your funds.
        </p>
        <p style={body}>
          Scams and faulty apps are other risks. A network can work correctly while an app built on it is unsafe.
        </p>
        <p style={body}>
          Ethereum gives people a way to send digital money and use programs on a shared network. Learning how it works is separate from deciding whether to buy ETH.
        </p>

        <h3 style={h3}>Sources</h3>
        <ul style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc', wordBreak: 'break-word' }}>
          {SOURCES.map(([label, href]) => (
            <li key={href}><a style={srcLink} href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>
          ))}
        </ul>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href="https://medium.com/youth-blockchain-association/a-glimpse-into-ethereum-8187b052429a" target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>A glimpse into Ethereum</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

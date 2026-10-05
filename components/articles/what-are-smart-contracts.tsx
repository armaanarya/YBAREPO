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

const PURCHASE_CODE = `function purchase(uint amount) public payable {
    require(msg.value >= amount * 1 ether); // paid enough?
    require(cupcakes >= amount);            // in stock?
    cupcakes -= amount;                     // dispense
}`

export function WhatAreSmartContractsArticle() {
  const body: React.CSSProperties = { fontFamily: T.inter, fontSize: '1.0625rem', color: 'rgba(238,238,255,0.82)', lineHeight: 1.8, marginTop: '1.5rem' }
  const srcLink: React.CSSProperties = { color: T.dark, textDecoration: 'underline', textUnderlineOffset: 3 }
  const h3: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.5rem', fontWeight: 800, color: T.dark, letterSpacing: '-0.01em', marginTop: '3rem' }
  const h4: React.CSSProperties = { fontFamily: T.manrope, fontSize: '1.1875rem', fontWeight: 700, color: T.dark, letterSpacing: '-0.005em', marginTop: '2.25rem' }
  const list: React.CSSProperties = { ...body, paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc' }
  const img: React.CSSProperties = { width: '100%', height: 'auto', borderRadius: 16, border: `1px solid ${T.border}` }
  const caption: React.CSSProperties = { fontFamily: T.inter, fontSize: '0.8125rem', color: T.muted, textAlign: 'center', marginTop: '0.75rem' }

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
          text="What are smart contracts? Programs that keep their promises"
          as="h1"
          className="font-extrabold tracking-[-0.025em] leading-[1.07]"
          style={{ fontFamily: T.manrope, fontSize: 'clamp(2rem,4.5vw,3.25rem)', color: T.dark, marginTop: '1rem' }}
        />
        <p style={{ fontFamily: T.inter, fontSize: '1.125rem', color: T.muted, lineHeight: 1.6, marginTop: '1rem' }}>
          How a vending machine explains the code running Ethereum, what it can do, and where it breaks
        </p>
        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, marginTop: '1.25rem' }}>
          By Arnav Mani · Youth Blockchain Association · Oct 4, 2026
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
          <Image src="/articles/smart-contracts-hero.png" alt="A vending machine and a smart contract side by side, both following the rule: if you paid enough and it's in stock, then dispense" width={1400} height={788} style={img} />
          <figcaption style={caption}>
            <em>Smart contracts follow simple if-then rules, just like a vending machine. Illustration: YBA.</em>
          </figcaption>
        </figure>

        <p style={body}>
          On June 17, 2016, someone drained roughly 3.6 million ether from a program called The DAO, about a third of everything the fund held. Nobody stole a password. Nobody broke into a server. The attacker used the program exactly the way its code allowed.
        </p>
        <p style={body}>
          So was that theft? Or was it the contract doing what it was written to do?
        </p>
        <p style={body}>
          That question is the whole story of smart contracts. To get there, it helps to start with a snack.
        </p>

        <h3 style={h3}>So what is a smart contract?</h3>
        <p style={body}>
          A smart contract is a program that lives on a blockchain and runs automatically when someone triggers it. Ethereum’s documentation describes it as a bundle of code and data sitting at its own address.
        </p>
        <p style={body}>
          Despite the name, it isn’t a legal document, and it isn’t “smart” in the AI sense. It’s a set of if-this-then-that rules that can’t be changed once they’re created. If X happens, do Y. Every time.
        </p>
        <p style={body}>
          The idea is older than Bitcoin. Nick Szabo coined the term in 1994, picturing a digital marketplace where agreements carry themselves out without a middleman. It took until Ethereum went live on July 30, 2015 for a blockchain built to run these programs for anyone.
        </p>

        <h3 style={h3}>The vending machine</h3>
        <p style={body}>
          The comparison Szabo used, and the one Ethereum’s developer docs still open with, is a vending machine.
        </p>
        <p style={body}>
          Think about what happens when you buy a bag of chips. You pick an item, the machine shows a price, you pay, it checks your money, and it hands over the snack. There’s no cashier deciding whether you seem trustworthy. If you only put in $1 for a $2 drink, it doesn’t matter how many times you try, you’re not getting the drink. The rules are built into the machine.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/smart-contracts-vending-machine.png" alt="Side-by-side steps: picking an item, seeing the price, paying, checking money and stock, and dispensing, each matched to the step inside a smart contract" width={1400} height={1033} style={img} />
          <figcaption style={caption}>
            <em>Each step of a vending machine purchase has a direct match in how a smart contract runs. Diagram: YBA, based on ethereum.org’s vending machine example.</em>
          </figcaption>
        </figure>

        <p style={body}>
          A smart contract works the same way, with a few upgrades a real vending machine doesn’t have:
        </p>
        <ul style={list}>
          <li><strong>The rules are public.</strong> Anyone can read a contract’s code before using it, like being able to open up the vending machine and inspect the wiring before you put your money in.</li>
          <li><strong>Nobody owns the plug.</strong> Every node on the Ethereum network stores the same contract, so there’s no single machine someone can switch off.</li>
          <li><strong>It can hold money itself.</strong> A contract is a type of Ethereum account with its own balance. Unless its code gives someone admin powers, nobody controls it; it just runs as programmed.</li>
        </ul>
        <p style={body}>
          Here’s a stripped-down version of what that looks like in Solidity, the most common language for writing smart contracts. It’s simplified from the full cupcake vending machine example on <a style={srcLink} href="https://ethereum.org/developers/docs/smart-contracts/" target="_blank" rel="noopener noreferrer">ethereum.org</a>:
        </p>
        <pre style={{ marginTop: '1.5rem', padding: '1.25rem 1.5rem', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.875rem', lineHeight: 1.7, color: T.dark }}>
          <code>{PURCHASE_CODE}</code>
        </pre>
        <p style={body}>
          Read it like a checklist: did you pay enough, is there enough stock, then hand it over. If either check fails, the whole purchase is cancelled and nothing changes.
        </p>
        <p style={body}>
          Finematics walks through the vending machine comparison and the “code is law” debate in this explainer, about 15 minutes:
        </p>
        <iframe
          src="https://www.youtube.com/embed/pWGLtjG-F5c"
          title="Finematics: smart contracts explained"
          style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', border: 0, borderRadius: 12, marginTop: '1.5rem' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        <h3 style={h3}>How does one actually run?</h3>
        <p style={body}>
          A smart contract goes through the same basic life cycle every time.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/smart-contracts-lifecycle.png" alt="Six steps in the life of a smart contract: write, deploy, live at an address, someone calls it, the network runs it, recorded for good" width={1400} height={858} style={img} />
          <figcaption style={caption}>
            <em>From writing the code to running it on every copy of the blockchain. Diagram: YBA, based on ethereum.org’s developer docs.</em>
          </figcaption>
        </figure>

        <p style={body}>
          First, a developer writes the rules in a language like Solidity. Then they deploy it, which means uploading it to the blockchain. Deploying is a transaction, so it costs gas (a fee paid in ETH for computing power), and it costs far more than a normal ETH transfer.
        </p>
        <p style={body}>
          Once it’s live, the contract sits at its own address. Anyone can interact with it by sending a transaction that calls one of its functions. The network runs the code, agrees on the result, and records it. One detail matters a lot here: contracts can’t be deleted by default, and interactions with them can’t be reversed.
        </p>
        <p style={body}>
          Contracts can also call other contracts. Ethereum’s docs describe them as open APIs that other contracts can build on. That’s why people call them “money legos.” One app can snap onto another without asking permission.
        </p>

        <h3 style={h3}>What can smart contracts do?</h3>
        <p style={body}>
          According to ethereum.org, smart contracts can do essentially anything a computer program can. A few real examples:
        </p>
        <ul style={list}>
          <li><strong>Stablecoins</strong>, which are tokens designed to track a currency like the dollar.</li>
          <li><strong>Automatic currency exchanges.</strong> Apps like Uniswap let people swap tokens without a company in the middle.</li>
          <li><strong>NFTs</strong>, which use contracts to create and track unique digital items.</li>
          <li><strong>Savings with conditions.</strong> You could write a contract that holds money for a kid and only lets them withdraw it after a certain date.</li>
          <li><strong>Insurance</strong> that pays out automatically when a set condition is met.</li>
          <li><strong>Crowdfunding</strong> that only releases the money once a goal is hit.</li>
        </ul>
        <p style={body}>
          The common thread: anywhere you’d normally need a trusted middleman to hold money and follow the rules, a smart contract can try to do that job instead.
        </p>

        <h3 style={h3}>The catch</h3>
        <p style={body}>
          Smart contracts do exactly what they’re told. That’s the selling point, and it’s also the problem.
        </p>

        <h4 style={h4}>Bugs are forever</h4>
        <p style={body}>
          Remember The DAO? It had a flaw called a reentrancy bug. The attacker kept withdrawing ether before the contract could update its balances, a bit like a vending machine that drops your snack before it subtracts your credit, so you can keep hitting the button.
        </p>
        <p style={body}>
          Since the code couldn’t be edited, the Ethereum community had to decide what to do. ETH holders voted, and over 85% supported a hard fork (a permanent change to the blockchain’s rules). On July 20, 2016, Ethereum moved the funds into a new contract whose only function was letting people withdraw their money back.
        </p>
        <p style={body}>
          Not everyone agreed. Some miners refused to fork, arguing the protocol itself wasn’t broken. They kept the original chain running, and it became Ethereum Classic. The two chains still exist today.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/smart-contracts-timeline.png" alt="Timeline from 1994 to 2026: Nick Szabo coins the term, Ethereum goes live, The DAO is drained, the hard fork, the Parity wallet bug, and leftover DAO ETH funding a security endowment" width={1400} height={858} style={img} />
          <figcaption style={caption}>
            <em>Smart contracts went from a 1990s idea to a live technology, with some expensive lessons along the way. Timeline: YBA. Sources: ethereum.org, ethereum.org fork history, Sophos, The Block.</em>
          </figcaption>
        </figure>

        <p style={body}>
          Bugs don’t even need a villain. In November 2017, someone triggered a flaw in a shared piece of code used by Parity’s multi-signature wallets and destroyed it. That locked 513,774 ETH across 587 wallets. Nobody stole the money; it just became unreachable. Parity later admitted it had been warned about the flaw months earlier.
        </p>

        <h4 style={h4}>They can’t see the outside world</h4>
        <p style={body}>
          Say you and a friend want to bet on Saturday’s basketball game using a smart contract. Smart contracts can’t pull in information from outside the blockchain. That’s on purpose: if every node checked a different website, they might disagree, and the whole system depends on agreement.
        </p>
        <p style={body}>
          The workaround is an oracle, a tool that brings outside data onto the blockchain. But now you’re trusting the oracle. As Finematics puts it, oracles reduce the trust you need, but the oracle itself still has to be trusted.
        </p>

        <figure style={{ margin: '2.5rem 0 0' }}>
          <Image src="/articles/smart-contracts-oracles.png" alt="The oracle problem: an oracle carries real-world data such as game scores, weather, and prices onto the blockchain, and you have to trust the oracle" width={1400} height={788} style={img} />
          <figcaption style={caption}>
            <em>Oracles bridge the gap between the blockchain and real life, but they bring back some of the trust smart contracts were supposed to remove. Diagram: YBA.</em>
          </figcaption>
        </figure>

        <p style={body}>
          Some things are hard to capture at all. If you rent a car through a smart contract and scratch the bumper, how would the code ever know?
        </p>

        <h4 style={h4}>Every action costs something, and there are limits</h4>
        <p style={body}>
          Running code on Ethereum costs gas, and contracts have size limits. A single contract can be at most 24KB, so bigger apps get split across several contracts.
        </p>

        <h4 style={h4}>You might not know what you’re signing</h4>
        <p style={body}>
          In theory, anyone can read a contract’s code. In practice, the raw data a wallet asks you to approve is nearly unreadable. Ethereum.org warns about “blind signing,” where users approve transactions without understanding them. A newer standard called Clear Signing (ERC-7730) aims to turn that data into plain-language descriptions, but it’s still rolling out.
        </p>

        <h4 style={h4}>There’s no undo button</h4>
        <p style={body}>
          Because interactions are irreversible, there’s no customer service line to call if you send money to the wrong contract or get tricked into approving something bad.
        </p>

        <h3 style={h3}>The bottom line</h3>
        <p style={body}>
          Smart contracts swap “trust the middleman” for “trust the code.” That trade is great when the code is right, and brutal when it isn’t. They’re why Ethereum can run exchanges and stablecoins with no company in charge. They’re also why one bug in 2016 split a blockchain in two.
        </p>
        <p style={body}>
          Back to the question from the beginning: was The DAO attack theft, or the contract working as written? Ethereum answered by rewriting history. Ethereum Classic answered by leaving it alone. People in the crypto world still argue about it.
        </p>
        <p style={body}>
          Ten years later, the story has an odd ending. More than 75,000 ETH left unclaimed from the 2016 refund now funds an Ethereum security endowment. The leftovers from smart contracts’ most famous failure now pay to prevent the next one.
        </p>

        <h3 style={h3}>Want to dig deeper?</h3>
        <ul style={{ fontFamily: T.inter, fontSize: '0.9375rem', color: T.muted, lineHeight: 1.7, marginTop: '1rem', paddingLeft: '1.25rem', display: 'grid', gap: '0.625rem', listStyle: 'disc', wordBreak: 'break-word' }}>
          <li><strong>ethereum.org: Introduction to smart contracts</strong>: the best non-technical starting point, written by the Ethereum community.</li>
          <li><strong>ethereum.org developer docs: Smart contracts</strong>: the full cupcake vending machine code, plus limitations and multisig wallets.</li>
          <li><strong>ethereum.org: Timeline of Ethereum forks</strong>: the official record of the DAO fork and every upgrade since.</li>
          <li><strong>The Block: The DAO hack at 10</strong>: how the hack happened and what became of the leftover funds.</li>
          <li><strong>Chainlink: What is a smart contract?</strong>: another beginner explainer. Note that Chainlink sells oracle services, so it has a stake in the oracle side of the story.</li>
          <li><strong>Simply Explained: Smart contracts (video)</strong>: a short explainer recommended by ethereum.org. It’s from 2017, but the core concept hasn’t changed.</li>
        </ul>

        <p style={body}>
          <em>This article is for learning purposes only and isn’t financial advice. Cryptocurrency is high-risk, so always do your own research before making any decisions.</em>
        </p>

        <p style={{ fontFamily: T.inter, fontSize: '0.875rem', color: T.muted, lineHeight: 1.7, marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: `1px solid ${T.border}` }}>
          <a style={srcLink} href="https://medium.com/youth-blockchain-association/what-are-smart-contracts-programs-that-keep-their-promises-5548ea69726a" target="_blank" rel="noopener noreferrer" onClick={() => track('button_click', 'articles', { button: 'original_post' })}>What are smart contracts? Programs that keep their promises</a> was originally published in <a style={srcLink} href={MEDIUM_PUB} target="_blank" rel="noopener noreferrer">Youth Blockchain Association</a> on Medium.
        </p>
      </article>
    </section>
  )
}

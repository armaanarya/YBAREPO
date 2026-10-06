---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "Public blockchains let anyone read, write and check; private ones let a club decide, which keeps secrets but means trusting whoever runs it"
destination: youtube
aspect: 1920x1080
language: en
audience: middle schoolers
length: 135s
angle: concept
voice: elevenlabs/bIHbv24MWmeRgasZH58o
---

## Intent

Episode 3 of the YBA blockchain series, "Public vs. private blockchains". It asks who gets to read, write in, and check the shared notebook from episode 1. Public is a notebook pinned to the classroom wall; private is a club notebook in a locked cabinet. Real companies on each side and what the chain does for them: Visa and PayPal (public), J.P. Morgan's Kinexys and Walmart (private). Limit: on a private chain you trust whoever runs it (Sam, in this story). Closes on "it depends on the job", noting J.P. Morgan now uses both.
Whiteboard "scribe" style: a marker hand draws every idea while the narrator talks.
Ends on the standard YBA end card pointing high schoolers to joinyba.org.

## Assets

- assets/yba-mark.svg — YBA logo. Corner bug bottom-left, drawn big on the end card.

## Customizations

- Built with the yba-whiteboard-video skill (draw-on engine from the whiteboard-animation skill).
- Narration: ElevenLabs "Will", one clip per scene with word timestamps.
- Black / white / gray only. Company names are handwritten on the board; no logos.
- Company names appear in narration at the user's request (2026-10-05).

## Notes

- Script approved by the user on 2026-10-05. Do not reword it.
- Facts and sources:
  - Visa (s03). Sept 5, 2023: Visa expanded stablecoin settlement to Solana alongside Ethereum, live pilots with Worldpay and Nuvei; "moved millions of USDC ... to settle fiat-denominated payments authorized over VisaNet", to "improve the speed of cross-border settlement" (Cuy Sheffield). https://investor.visa.com/news/news-details/2023/Visa-Expands-Stablecoin-Settlement-Capabilities-to-Merchant-Acquirers/default.aspx and https://www.theblock.co/post/249153/visa-stablecoin-settlement-solana-ethereum
  - PayPal (s04). Aug 7, 2023: PayPal USD (PYUSD), ERC-20 on Ethereum, issued by Paxos, redeemable 1:1, transferable between PayPal and compatible external wallets. https://newsroom.paypal-corp.com/2023-08-07-PayPal-Launches-U-S-Dollar-Stablecoin
  - J.P. Morgan Kinexys (s07, s10). Rebranded from Onyx Nov 6, 2024; grew out of Quorum, "a permissioned blockchain developed and designed for the needs of financial institutions" (https://www.jpmorgan.com/kinexys/about). "near real-time, 24/7 programmable cross-border transactions and intragroup funding"; over $1.5 trillion cumulative, over $2 billion daily (https://www.jpmorgan.com/insights/payments/blockchain-digital-assets/introducing-kinexys). "Now uses both": JPM Coin (JPMD) live on Base, a public Ethereum layer 2, Nov 12, 2025, complementing the private network (https://www.jpmorgan.com/payments/newsroom/jpm-coin-usd-deposit-token-institutional-clients).
  - Walmart (s08). "We decided to go with Hyperledger Fabric ... it is permissioned." Mangoes traced in 2.2 seconds vs 7 days. https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study
  - Why private (s06). Fabric channels: "a private 'subnet' of communication between two or more specific network members, for the purpose of conducting private and confidential transactions" (https://hyperledger-fabric.readthedocs.io/en/latest/channels.html). Fabric throughput above 3,500 tx/s (Androulaki et al., EuroSys 2018, https://arxiv.org/pdf/1801.10228).
  - Bitcoin and Ethereum are public (s02): anyone can read the chain, send transactions, and run a node.

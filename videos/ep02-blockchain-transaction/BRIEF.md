---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "A transaction is a message your private key signs; the network checks it, adds it to a block, and nobody can undo it or reset a lost key"
destination: youtube
aspect: 1920x1080
language: en
audience: middle schoolers
length: 120s
angle: concept
voice: elevenlabs/bIHbv24MWmeRgasZH58o
---

## Intent

Episode 2 of the YBA blockchain series, "What happens in a blockchain transaction?". It follows one payment from "hit send" to "every copy updates": wallet as a mailbox (slot = address, only key = private key), the key signs the message, a fee works like a stamp, the computers that keep copies of the notebook check it, and one of them adds it to the next block. It picks up from episode 1 (the shared notebook, blocks, fingerprints, the chain). This time you owe Sam, and Sam tries to send your money without your key.
Whiteboard "scribe" style: a marker hand draws every idea while the narrator talks.
Ends on the standard YBA end card pointing high schoolers to joinyba.org.

## Assets

- assets/yba-mark.svg — YBA logo. Corner bug bottom-left, drawn big on the end card.

## Customizations

- Built with the yba-whiteboard-video skill (draw-on engine from the whiteboard-animation skill).
- Narration: ElevenLabs "Will", one clip per scene with word timestamps.
- Black / white / gray only.
- New figures for this episode: mailbox, key, computer, stamp, pizza, magnifier, button.

## Notes

- Script approved by the user on 2026-10-04. Do not reword it.
- Facts and sources:
  - Pizza transaction (s09). On May 22, 2010, a Florida programmer (Laszlo Hanyecz, not named in narration) paid 10,000 BTC for two pizzas. Sources: https://en.bitcoin.it/wiki/Laszlo_Hanyecz and https://www.coindesk.com/opinion/2024/05/22/happy-bitcoin-pizza-day. Checked on chain via Blockstream's API on 2026-10-04: tx a1075db55d416d3ca199f55b6084e2115b9345e16c5cf302fc80e9d5fbf5d48d, confirmed in block 57,043 at 2010-05-22 18:16:31 UTC, 131 inputs, one 10,000 BTC output.
  - Signing and what happens next (s04, s06, s08). The sender's private key signs the transaction, which proves it came from the sender; the transaction is broadcast to the network, a validator includes it in a block, and the block becomes final. Source: https://ethereum.org/en/developers/docs/transactions/ (Bitcoin uses miners instead of validators, so the narration says "one of those computers").
  - Fees rise when the network is busy (s05). The base fee goes up when blocks are fuller than the target. Source: https://ethereum.org/en/developers/docs/gas/. The narration avoids "the fee pays the computers" because Ethereum burns the base fee.
  - Address is public, no one can reset a lost key (s02, s10). ethereum.org compares an address to an email inbox and says "there's no customer support in crypto". Source: https://ethereum.org/en/wallets/. "Nobody can reset it" applies to wallets you hold yourself; custodians come in episode 8.
  - "Five dollars" is a simplification that continues episode 1's story; in practice it would be crypto or a dollar stablecoin worth $5 (stablecoins are episode 7).

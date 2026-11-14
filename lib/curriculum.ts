// ─── Curriculum lessons + quizzes ────────────────────────────────────────────
// Each lesson is one video in the YBA blockchain series. Questions come from
// the episode scripts in videos/*/SCRIPT.md. A lesson's video shows on the
// site once it has a youtubeId; its quiz shows right away.

export type QuizQuestion = {
  q: string
  options: string[]
  answer: number // index into options
  why: string
}

export type Lesson = {
  slug: string
  number: number
  title: string
  youtubeId?: string
  quiz: QuizQuestion[]
}

export const LESSONS: Lesson[] = [
  {
    slug: 'what-is-blockchain',
    number: 1,
    title: 'What is blockchain?',
    youtubeId: 'ROsq-2XhVHg',
    quiz: [
      {
        q: 'In a blockchain, who keeps a copy of the "notebook"?',
        options: ['Only the teacher', 'Only the person who lent the money', 'Everybody in the network', 'A bank in the middle'],
        answer: 2,
        why: 'Instead of one record keeper, everyone gets their own copy.',
      },
      {
        q: 'What is a "block"?',
        options: ['A page of notes grouped together', 'A single dollar sent between friends', 'The password to your account', 'A computer that stores the chain'],
        answer: 0,
        why: 'Notes get grouped into pages, and each page is called a block.',
      },
      {
        q: "What happens to a block's fingerprint if you change even one letter on the page?",
        options: ['Nothing, because fingerprints never change', 'It changes a tiny bit', 'It gets deleted', 'It changes completely'],
        answer: 3,
        why: 'The fingerprint is made from everything on the page, so any change makes a completely different one.',
      },
      {
        q: 'What links the blocks together into a chain?',
        options: ['Each block has the same date', 'Each new block copies the fingerprint of the block before it', 'A boss approves every block', 'Blocks are stored in the same folder'],
        answer: 1,
        why: 'Copying the previous fingerprint links each page to the one before it. Block, chain. Blockchain.',
      },
      {
        q: "Sam secretly erases the $5 from his copy. Why doesn't he get away with it?",
        options: ['The teacher catches him', 'The money is refunded automatically', "The fingerprint changes, the chain breaks, and everyone else's copy still shows the $5", "Blockchains can't be edited at all"],
        answer: 2,
        why: 'One notebook against the whole class. Sam loses.',
      },
      {
        q: 'Which statement about blockchains is TRUE?',
        options: ['A blockchain makes sure everything written in it is true', 'If someone writes something false, the blockchain keeps that too', 'Blockchains need one boss to keep score', 'Blockchains are only used for video games'],
        answer: 1,
        why: "It's a shared record that's hard to change in secret, not a lie detector.",
      },
    ],
  },
  {
    slug: 'blockchain-transaction',
    number: 2,
    title: 'What happens in a blockchain transaction?',
    youtubeId: 'NeYV67I9ZC0',
    quiz: [
      {
        q: 'A wallet is like a mailbox. What is the "slot" that anyone can see?',
        options: ['Your private key', 'Your address', 'Your fee', 'Your signature'],
        answer: 1,
        why: 'Your address is public, so anyone can send you money.',
      },
      {
        q: 'Who controls the money in a wallet?',
        options: ['The bank that made the wallet', 'Whoever knows the address', 'Whoever has the private key', 'The computers on the network'],
        answer: 2,
        why: 'Whoever has the private key controls the money inside.',
      },
      {
        q: 'Why does a transaction include a small fee?',
        options: ["It's like a stamp on a letter, and it costs more when the network is busy", 'It pays back the person you sent money to', "It's a fine for sending money late", 'It unlocks your private key'],
        answer: 0,
        why: 'The fee works like postage. When the network is busy, the stamp costs more.',
      },
      {
        q: 'When your payment goes out, what do the computers on the network check?',
        options: ['Your name and your school', 'That the signature is real and you actually have the money', 'That Sam agrees to receive it', "That you've used this wallet before"],
        answer: 1,
        why: 'Each computer asks: is the signature real, and do you have the five dollars?',
      },
      {
        q: 'Sam knows your address and writes "send all your money to Sam." Why does it fail?',
        options: ['Addresses are secret, so Sam typed it wrong', 'The fee was too low', "Without your private key, Sam can't make your signature", "Sam's wallet is full"],
        answer: 2,
        why: 'Anyone can check a signature, but nobody can fake it without the key.',
      },
      {
        q: 'You send money to the wrong address. What happens?',
        options: ['You hit undo within 24 hours', "You call the blockchain's help desk", 'The network sends it back automatically', "It's gone, because there's no undo button"],
        answer: 3,
        why: "There's no undo button and no forgot-password button on a blockchain.",
      },
    ],
  },
  {
    slug: 'public-vs-private',
    number: 3,
    title: 'Public vs. private blockchains',
    youtubeId: 'H2Y7v54XnQ0',
    quiz: [
      {
        q: 'What makes a blockchain "public"?',
        options: ['Anyone can read it, add to it, or help check it', "It's owned by the government", "It's free to use", "It's only used by big companies"],
        answer: 0,
        why: "A public blockchain is like a notebook pinned to the classroom wall.",
      },
      {
        q: 'Which of these work as public blockchains?',
        options: ["Kinexys and Walmart's mango tracker", 'Bitcoin and Ethereum', 'Roblox and Visa', 'Only bank blockchains'],
        answer: 1,
        why: 'Bitcoin and Ethereum are open to anyone.',
      },
      {
        q: 'In a private blockchain, who decides who can read, write, and check?',
        options: ['Anyone with internet access', 'The government', 'The group running it (the "club")', "Nobody, it's automatic"],
        answer: 2,
        why: 'A private blockchain is like a club notebook in a locked cabinet.',
      },
      {
        q: 'Why might a company choose a private blockchain?',
        options: ['It makes public posts easier', "Some records shouldn't be public, and fewer checkers can make it faster", "Private blockchains can't be changed by anyone", "It's the only kind that can send money"],
        answer: 1,
        why: "A bank's payments shouldn't be public, and a smaller group of checkers can run faster.",
      },
      {
        q: 'J.P. Morgan runs a private blockchain called Kinexys. What do companies use it for?',
        options: ['Tracking library books', 'Selling concert tickets', 'Moving money between their accounts in different countries, any time of day', 'Mining bitcoin'],
        answer: 2,
        why: 'Kinexys handles billions of dollars a day.',
      },
      {
        q: "What's the main catch with private blockchains?",
        options: ["They're always slower than public ones", 'Anyone can read your records', "They can't hold money", 'You have to trust whoever is in charge'],
        answer: 3,
        why: 'Someone runs the club, and if members team up they can rewrite the notebook.',
      },
    ],
  },
  {
    slug: 'smart-contracts',
    number: 4,
    title: 'What is a smart contract?',
    quiz: [
      {
        q: 'The video compares a smart contract to which everyday machine?',
        options: ['A calculator', 'A vending machine', 'A cash register with a cashier', 'A photocopier'],
        answer: 1,
        why: 'Money in plus button pressed equals snack out. The rule is built in.',
      },
      {
        q: 'What is a smart contract?',
        options: ['A paper contract signed online', 'A lawyer who works on the blockchain', 'Rules written in code on a blockchain that anyone can check and nobody can bend', 'A private key that signs payments'],
        answer: 2,
        why: "It's a vending machine built out of code and put on a blockchain.",
      },
      {
        q: "In the class pizza fund, what happens if the fund doesn't reach $100 by Friday?",
        options: ['Sam keeps the money', 'The pizza shop gets paid anyway', 'The teacher decides', 'Everyone gets refunded'],
        answer: 3,
        why: 'The rule says: hit $100 by Friday, pay the pizza shop. If not, refund everyone.',
      },
      {
        q: 'In 2017, AXA sold flight insurance on Ethereum. When did the contract pay out?',
        options: ['When a flight was more than two hours late', 'When a passenger filled out a claim form', 'When AXA cancelled the flight', 'Every time someone flew'],
        answer: 0,
        why: 'If the flight was over two hours late, the contract paid. No forms.',
      },
      {
        q: 'What went wrong with The DAO in 2016?',
        options: ['Nobody used it', 'A bug let an attacker drain ether worth millions, and the code was hard to change', 'The government shut it down', 'It ran out of fees'],
        answer: 1,
        why: 'Once a smart contract is running, its code is hard to change, even with a bug in it.',
      },
      {
        q: "Smart contracts can't see the real world. What brings in outside info, like whether a flight was late?",
        options: ['Miners', 'Wallets', 'Oracles', 'Private keys'],
        answer: 2,
        why: 'Oracles are messengers that bring outside data onto the blockchain.',
      },
    ],
  },
  {
    slug: 'tokens',
    number: 5,
    title: 'What is a token?',
    quiz: [
      {
        q: 'Why does an arcade token mean "one game" inside the arcade?',
        options: ["It's made of valuable metal", 'Because the arcade promises it', "Because it's on a blockchain", 'Because the government says so'],
        answer: 1,
        why: "Outside, it's just metal. Inside, the arcade's promise gives it meaning.",
      },
      {
        q: 'Why do Robux only work inside Roblox?',
        options: ["They're made of code", "They're too expensive", 'Only Roblox keeps the list of who has how many', "They're NFTs"],
        answer: 2,
        why: 'One company keeps the list, so the tokens only work in that company\'s world.',
      },
      {
        q: 'On a blockchain, what keeps track of who owns which tokens?',
        options: ['A bank teller', 'A smart contract', "The token's owner", 'An oracle'],
        answer: 1,
        why: 'A smart contract keeps the list in the shared notebook, and anyone can check it.',
      },
      {
        q: 'What does "non-fungible" mean?',
        options: ['Free to trade', 'Made of paper', 'Worth exactly $1', 'One of a kind'],
        answer: 3,
        why: 'Like a ticket for seat C12, an NFT is one of a kind.',
      },
      {
        q: 'What does Circle promise for each USDC token?',
        options: ['A share of Circle the company', 'You can trade it in for one U.S. dollar', 'One free game', 'A ticket to the Super Bowl'],
        answer: 1,
        why: 'Each USDC is a promise: trade it in, and Circle gives you one dollar.',
      },
      {
        q: 'Starbucks closed its token program in 2024. What does this show?',
        options: ['Tokens disappear when a program ends', 'Tokens always make you an owner of the company', 'A token is only as good as the promise behind it', 'Blockchains can be erased'],
        answer: 2,
        why: 'People kept their stamps, but the perks stopped.',
      },
    ],
  },
  {
    slug: 'crypto-vs-blockchain',
    number: 6,
    title: 'Is crypto just another word for blockchain?',
    quiz: [
      {
        q: 'If a blockchain is a road, what is the road?',
        options: ['The coin drivers pay with', 'The network of computers keeping the shared notebook', 'A shop built along the road', 'A company that sells tokens'],
        answer: 1,
        why: 'The road is the network: all the computers keeping the shared notebook.',
      },
      {
        q: 'On a public road, why do drivers pay a toll in the road\'s own coin?',
        options: ['The computers that check each page need to get paid', 'To buy a piece of the road', 'To become an owner of the company', 'Because the government says so'],
        answer: 0,
        why: 'The toll pays the computers that check each page. That coin is the crypto.',
      },
      {
        q: 'What is the difference between "Bitcoin" and "bitcoin"?',
        options: ['There is no difference', 'Big B is the coin, small b is the road', 'Big B is the road, small b is the coin', 'Big B is a company, small b is an app'],
        answer: 2,
        why: 'With a big B, it\'s the road. With a small b, it\'s the coin.',
      },
      {
        q: 'Broadridge runs a private blockchain where banks lend each other cash. What does it show?',
        options: ['Every blockchain needs a coin', 'Banks can\'t use blockchains', 'Private blockchains only move small amounts', 'Some blockchains have no coin at all'],
        answer: 3,
        why: 'By late 2025 it moved hundreds of billions of dollars a day. No coin needed.',
      },
      {
        q: 'In 2022, the price of ether fell by about two thirds. That same year, an upgrade cut Ethereum\'s energy use by more than 99%. What does this show?',
        options: ['The upgrade broke Ethereum', 'The coin\'s price said nothing about the road', 'Ethereum shut down that year', 'Ether and Ethereum are the same thing'],
        answer: 1,
        why: 'The coin and the road are different things, so the price alone can fool you.',
      },
      {
        q: 'In 2017, Long Island Iced Tea renamed itself Long Blockchain. What happened next?',
        options: ['It built a blockchain for drinks', 'It made its own coin', 'It still sold iced tea, but its stock price shot up anyway', 'It stopped selling iced tea'],
        answer: 2,
        why: 'A name with "blockchain" in it doesn\'t make something worth more.',
      },
    ],
  },
]

// Lessons whose video is on YouTube (Videos tab, home page, curriculum page).
export const PUBLISHED_LESSONS = LESSONS.filter(l => l.youtubeId)

// Lessons whose quiz is live (Quizzes tab and /curriculum/quizzes/[slug]).
export const QUIZ_LESSONS = LESSONS.filter(l => l.quiz.length > 0)

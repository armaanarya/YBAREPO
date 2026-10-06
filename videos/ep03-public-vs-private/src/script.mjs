// Approved narration, one entry per scene. `say` is exactly what the voice reads.
// Edit only after the user approves the script. Then run: node src/tts.mjs
export const TITLE = "Public vs. private blockchains";
// How the transcriber writes spelled-out lines, for scripts/verify.mjs.
export const HEARD_AS = { "join Y B A dot org": "joinyba.org" };

export const VOICE_ID = "bIHbv24MWmeRgasZH58o"; // ElevenLabs "Will" (series voice)
export const MODEL_ID = "eleven_multilingual_v2";
export const VOICE_SETTINGS = {
  stability: 0.45,
  similarity_boost: 0.75,
  style: 0.25,
  use_speaker_boost: true,
  speed: 0.95,
};

export const SCENES = [
  {
    id: "s01",
    title: "Who gets in?",
    say: "So far, everyone in class has had a copy of the notebook. But who gets to read it, write in it, and check it? That depends on the blockchain.",
  },
  {
    id: "s02",
    title: "The wall notebook",
    say: "Some blockchains are like a notebook pinned to the classroom wall. Anyone can read it, add a line, or help check it. That's a public blockchain. Bitcoin and Ethereum work this way.",
  },
  {
    id: "s03",
    title: "Visa",
    say: "Big companies use public chains too. Visa, the card company, has paid some partners in digital dollars over public blockchains. That helps money cross borders faster.",
  },
  {
    id: "s04",
    title: "PayPal",
    say: "PayPal made its own digital dollar on Ethereum. Anyone with a wallet can hold it or send it, even when banks are closed.",
  },
  {
    id: "s05",
    title: "The club notebook",
    say: "Other blockchains are like a club notebook in a locked cabinet. The club decides who can read, write, and check. That's a private blockchain.",
  },
  {
    id: "s06",
    title: "Why lock it?",
    say: "Why lock it? Some records shouldn't be public, like a bank's payments. And with fewer checkers, a private chain can run faster.",
  },
  {
    id: "s07",
    title: "J.P. Morgan",
    say: "J.P. Morgan, one of the biggest banks in the world, runs a private blockchain called Kinexys. Companies use it to move money between their accounts in different countries, any time of day. It handles billions of dollars daily.",
  },
  {
    id: "s08",
    title: "Walmart",
    say: "And the mangoes from episode one? Walmart tracked them on a private blockchain that only invited companies could use.",
  },
  {
    id: "s09",
    title: "Who's in charge?",
    say: "Here's the catch. Somebody runs the club. Say it's Sam. Sam picks who gets in, and if the members team up, they can rewrite the notebook. You have to trust whoever is in charge.",
  },
  {
    id: "s10",
    title: "Which is better?",
    say: "So which one is better? It depends on the job. Public chains are open, but so is everything you write. Private chains keep secrets, but someone holds the key. J.P. Morgan now uses both.",
  },
  {
    id: "s11",
    title: "Your turn",
    hold: 2.5, // the activity stays on the board so viewers can pause
    say: "Your turn. Pause the video. Your school wants to track library books on a blockchain. Should it be public or private? Why?",
  },
  {
    id: "s12",
    title: "Learn more",
    say: "Want to learn more? In high school, you can join the Youth Blockchain Association. Find us at join Y B A dot org.",
  },
];

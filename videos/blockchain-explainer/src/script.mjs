// Approved narration, one entry per scene. `say` is what the voice reads.
export const VOICE_ID = "bIHbv24MWmeRgasZH58o"; // ElevenLabs "Will"
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
    title: "The IOU",
    say: "Say you lend your friend Sam five dollars. Sam promises to pay you back on Friday. Friday comes, and Sam says, what five dollars?",
  },
  {
    id: "s02",
    title: "One notebook",
    say: "Normally you'd want someone to keep track, like a teacher with a notebook. But what if that notebook gets lost, or someone changes it?",
  },
  {
    id: "s03",
    title: "Everyone gets a copy",
    say: "A blockchain does something different. It gives everybody their own copy of the notebook. When you lend Sam five dollars, the whole class writes it down.",
  },
  {
    id: "s04",
    title: "Pages are blocks",
    say: "Those notes get grouped into pages. Each page is called a block.",
  },
  {
    id: "s05",
    title: "The fingerprint",
    say: "Every block gets a fingerprint. That's a short code made from everything on the page. Change even one letter, and the fingerprint changes completely.",
  },
  {
    id: "s06",
    title: "Linking the chain",
    say: "Here's the clever part. Each new block copies down the fingerprint of the block before it. That links the pages together, like a chain. Block, chain. Blockchain.",
  },
  {
    id: "s07",
    title: "Sam tries to cheat",
    say: "Now say Sam sneaks in and erases the five dollars. That changes the page's fingerprint, so the chain breaks. And everyone else's copy still shows the five dollars. One notebook against the whole class. Sam loses.",
  },
  {
    id: "s08",
    title: "Why it matters",
    say: "That's why blockchain matters. People who have never met can agree on what happened, without one boss in the middle keeping score.",
  },
  {
    id: "s09",
    title: "Where it's used",
    say: "People use it to send money across the world in minutes. One grocery company used it to trace mangoes back to the farm. That used to take almost a week. With blockchain, about two seconds.",
  },
  {
    id: "s10",
    title: "It's not magic",
    say: "It's not magic. If someone writes down something false, the blockchain keeps that too. But it's great at one job, a shared record that's really hard to change in secret.",
  },
  {
    id: "s11",
    title: "Learn more",
    say: "Want to learn more? In high school, you can join the Youth Blockchain Association. Find us at join Y B A dot org.",
  },
];

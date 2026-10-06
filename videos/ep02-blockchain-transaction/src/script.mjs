// Approved narration, one entry per scene. `say` is exactly what the voice reads.
// Edit only after the user approves the script. Then run: node src/tts.mjs
export const TITLE = "What happens in a blockchain transaction?";
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
    title: "Hit send",
    say: "Last time, Sam owed you five dollars. Now you owe Sam, and you're paying on a blockchain. So what actually happens when you hit send?",
  },
  {
    id: "s02",
    title: "Your wallet",
    say: "First, you need a wallet. Think of a mailbox. Its slot has an address anyone can see, so anyone can send you money.",
  },
  {
    id: "s03",
    title: "Private key",
    say: "Only you have the key that opens it. That's called your private key. Whoever has it controls the money inside.",
  },
  {
    id: "s04",
    title: "Signing",
    say: "To pay Sam, you write a message. Five dollars to Sam's address. Your key signs it. Anyone can check that signature, but nobody can fake it.",
  },
  {
    id: "s05",
    title: "The fee",
    say: "You also add a small fee, like a stamp on a letter. When the network is busy, the stamp costs more.",
  },
  {
    id: "s06",
    title: "Everyone checks",
    say: "Your message goes out to the computers that keep copies of the notebook. Each one checks. Is the signature real? Do you have five dollars?",
  },
  {
    id: "s07",
    title: "Sam tries it",
    say: "Sam tries something sneaky. Your address is public, so Sam writes, send all your money to Sam. But without your key, Sam can't make your signature. Every computer says no.",
  },
  {
    id: "s08",
    title: "Into the block",
    say: "One of those computers adds your message to the next block. The block joins the chain, every copy updates, and Sam gets the five dollars.",
  },
  {
    id: "s09",
    title: "Pizza, 2010",
    say: "This really happens. In 2010, a programmer paid ten thousand bitcoins for two pizzas. That transaction is still on the blockchain, and anyone can look it up.",
  },
  {
    id: "s10",
    title: "No undo",
    say: "Here's the catch. There's no undo button and no forgot password button. Send to the wrong address, and it's gone. Lose your private key, and nobody can reset it.",
  },
  {
    id: "s11",
    title: "Your turn",
    hold: 2.5, // the activity stays on the board so viewers can pause
    say: "Your turn. Pause the video. Sam asks to see your private key, just for a second. Do you share it? What about your address?",
  },
  {
    id: "s12",
    title: "Learn more",
    say: "Want to learn more? In high school, you can join the Youth Blockchain Association. Find us at join Y B A dot org.",
  },
];

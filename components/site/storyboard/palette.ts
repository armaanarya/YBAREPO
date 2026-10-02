// Storyboard illustration palette: black, white, and grays only, to match the
// rest of the site.
//
// The site renders through `html { filter: invert(1) hue-rotate(180deg) }`, so
// every value here is authored pre-inverted; the comment is the gray a visitor
// actually sees. For a neutral gray that is simply `authored = 255 - visible`.
// Roles, not hues: `signal` marks the active or emphasized part of a drawing,
// `accent`, `support`, and `marker` are quieter grays for secondary details.
export const C = {
  paper: '#000000',       // #FFFFFF
  ink: '#F2F2F2',         // #0D0D0D
  graphite: '#C6C6C6',    // #393939
  slate: '#656565',       // #9A9A9A
  rule: '#353535',        // #CACACA
  line: '#262626',        // #D9D9D9
  fog: '#121212',         // #EDEDED
  signal: '#F2F2F2',      // #0D0D0D
  signalMid: '#A3A3A3',   // #5C5C5C
  signalSoft: '#595959',  // #A6A6A6
  signalWash: '#191919',  // #E6E6E6
  accent: '#474747',      // #B8B8B8
  accentWash: '#141414',  // #EBEBEB
  support: '#757575',     // #8A8A8A
  supportWash: '#1F1F1F', // #E0E0E0
  marker: '#8C8C8C',      // #737373
} as const

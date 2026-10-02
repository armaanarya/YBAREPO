// Storyboard illustration palette.
//
// The site renders through `html { filter: invert(1) hue-rotate(180deg) }`, so
// every value here is authored pre-compensated; the comment is the color a
// visitor actually sees. To add one, pick the visible color and author
// `visible + 1 - 2 * luma(visible)` per channel (luma = .213R + .715G + .072B).
// Saturated dark colors such as #0000FF cannot survive the filter, which is why
// the signal blue is a bright royal blue rather than an electric one.
export const C = {
  paper: '#000000',    // #FFFFFF
  ink: '#F2F2F2',      // #0D0D0D
  graphite: '#C6C6C6', // #393939
  slate: '#5A606E',    // #9AA0AE
  rule: '#30333B',     // #C9CCD4
  line: '#25252B',     // #D9D9DF
  fog: '#121218',      // #ECECF2
  blue: '#4B82FE',     // #4C83FF
  blueMid: '#4B65CE',  // #7C96FF
  blueTint: '#2B4487', // #A3BCFF
  blueWash: '#131730', // #E2E6FF
  pink: '#A8386E',     // #FF8FC6
  pinkWash: '#391326', // #FFD9EC
  lime: '#145B01',     // #89CF76
  limeWash: '#021B02', // #D9F2D9
  sand: '#533A01',     // #DCC289
} as const

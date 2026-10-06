// Marker hand, drawn in a local frame: the nib sits at (0,0) and the marker
// barrel runs along +x. The engine translates the group to the stroke tip and
// rotates it so the arm comes in from the bottom-right.
export const HAND_ANGLE = 34;
export const HAND_SCALE = 0.86;

const SKIN = "#efeeea";
const LINE = "#1a1a1a";
const CREASE = "#9a9a96";

export const HAND_SVG = `
<g class="hand-art" transform="scale(${HAND_SCALE})">
  <!-- forearm in a sleeve, long enough to leave the frame from any nib position -->
  <path d="M 330,-40 L 2600,640 L 2540,930 L 300,110 Z" fill="${SKIN}" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 452,-6 L 2600,640 L 2540,930 L 410,150 C 452,104 470,44 452,-6 Z" fill="#555" stroke="${LINE}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 482,6 C 500,56 486,118 446,160" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>
  <!-- back of the hand -->
  <path d="M 200,-40 C 240,-70 312,-76 350,-52 C 414,-26 460,6 462,46 C 464,92 420,138 360,130 C 298,124 250,100 214,70 Z"
        fill="${SKIN}" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- marker: nib, collar, barrel resting in the web of the hand -->
  <path d="M 0,0 L 22,-8 L 22,8 Z" fill="#111" stroke="#111" stroke-width="2" stroke-linejoin="round"/>
  <rect x="21" y="-11" width="16" height="22" rx="2" fill="#3c3c3c" stroke="#111" stroke-width="2"/>
  <rect x="36" y="-15" width="290" height="30" rx="9" fill="#262626" stroke="#111" stroke-width="2"/>
  <path d="M 48,-7 L 318,-7" stroke="#6a6a6a" stroke-width="3" stroke-linecap="round"/>
  <!-- middle finger tucked under -->
  <path d="M 236,60 C 196,62 160,62 140,70 C 124,78 132,100 152,98 C 186,94 220,92 246,90 Z"
        fill="${SKIN}" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
  <!-- thumb pinching the lower half of the barrel -->
  <path d="M 232,8 C 190,6 142,4 114,6 C 92,8 90,38 110,42 C 148,50 196,60 236,64 Z"
        fill="${SKIN}" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M 112,14 C 118,10 128,11 132,17" fill="none" stroke="${CREASE}" stroke-width="2.5" stroke-linecap="round"/>
  <!-- index finger over the top of the barrel -->
  <path d="M 226,-40 C 182,-44 128,-40 96,-32 C 74,-26 70,-2 88,2 C 128,4 180,2 226,4 Z"
        fill="${SKIN}" stroke="${LINE}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M 90,-22 C 96,-27 106,-26 110,-20" fill="none" stroke="${CREASE}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 168,-38 C 172,-30 172,-22 168,-14" fill="none" stroke="${CREASE}" stroke-width="2.5" stroke-linecap="round"/>
  <!-- knuckle creases -->
  <path d="M 262,-56 C 268,-48 268,-40 262,-32" fill="none" stroke="${CREASE}" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 296,-60 C 302,-52 302,-44 296,-36" fill="none" stroke="${CREASE}" stroke-width="2.5" stroke-linecap="round"/>
</g>`;

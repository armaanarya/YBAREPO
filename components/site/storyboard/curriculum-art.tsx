import { C } from './palette'
import { Art, Handles, Person, Sparkle, Sq, Token, base, useSvgId } from './primitives'
import c from './curriculum-art.module.css'

// ─── Video lessons ───────────────────────────────────────────────────────────
// A lesson plays: blocks link up on screen as the scrubber reaches each chapter.

const MINI_HASH = [
  [C.signal, C.fog, C.signalSoft, C.signal],
  [C.accent, C.signalMid, C.fog, C.signal],
  [C.signalSoft, C.signal, C.support, C.fog],
]

function MiniBlock({ cx, hash, className }: { cx: number; hash: readonly string[]; className?: string }) {
  return (
    <g className={className}>
      <rect x={cx - 17} y={101} width={34} height={34} rx={3} fill={C.paper} stroke={C.ink} strokeWidth={2} />
      {hash.map((fill, i) => <rect key={i} x={cx - 8 + (i % 2) * 10} y={110 + Math.floor(i / 2) * 10} width={6} height={6} fill={fill} />)}
    </g>
  )
}

export function VideoArt() {
  const id = useSvgId()
  return (
    <Art>
      <defs>
        <pattern id={`${id}-dots`} width={12} height={12} patternUnits="userSpaceOnUse">
          <rect x={5} y={5} width={2} height={2} fill={C.fog} />
        </pattern>
      </defs>

      {/* Side tiles: audio, notes, presenter, highlight */}
      {[98, 404].map(x => [76, 142].map(y => (
        <rect key={`${x}-${y}`} x={x} y={y} width={58} height={58} fill={C.paper} stroke={C.line} strokeWidth={2} />
      )))}
      <Handles x={98} y={76} w={364} h={124} size={6} />
      {[C.signal, C.signalMid, C.signal, C.signalSoft, C.signalMid].map((fill, i) => (
        <rect key={i} x={106.5 + i * 9} y={94} width={5} height={28} fill={fill} className={c.vEq}
          style={{ animationDuration: `${0.62 + ((i * 0.37) % 0.5)}s`, animationDelay: `-${i * 0.23}s` }} />
      ))}
      <g stroke={C.ink} strokeWidth={2} strokeLinejoin="round">
        <path d="M115,155 H133 L141,163 V189 H115 Z" fill={C.paper} />
        <path d="M133,155 V163 H141" />
      </g>
      <path d="M120,170 H136 M120,177 H132" stroke={C.line} strokeWidth={2.5} />
      <path d="M120,184 H134" stroke={C.accent} strokeWidth={2.5} />
      <rect x={418} y={90} width={30} height={30} stroke={C.marker} strokeWidth={2} />
      <Handles x={418} y={90} w={30} h={30} size={5} />
      <Person x={433} y={107} color={C.ink} />
      <Sparkle x={433} y={171} />

      {/* Player */}
      <rect x={160} y={30} width={240} height={250} stroke={C.rule} strokeWidth={1.5} />
      <Handles x={160} y={30} w={240} h={250} size={8} />
      <rect x={172} y={42} width={216} height={226} rx={4} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
      <rect x={184} y={54} width={192} height={142} rx={3} fill={`url(#${id}-dots)`} stroke={C.line} strokeWidth={2} />
      <rect x={192} y={62} width={20} height={13} rx={2} fill={C.signal} />
      <path d="M199,65 L206,68.5 L199,72 Z" fill={C.paper} />

      {/* On screen: blocks link together, one per chapter */}
      <path d="M239,118 H263" stroke={C.ink} strokeWidth={2.5} pathLength={100} strokeDasharray={100} className={`${c.vLink} ${c.vLink1}`} />
      <path d="M297,118 H321" stroke={C.ink} strokeWidth={2.5} pathLength={100} strokeDasharray={100} className={`${c.vLink} ${c.vLink2}`} />
      <MiniBlock cx={222} hash={MINI_HASH[0]} />
      <MiniBlock cx={280} hash={MINI_HASH[1]} className={`${c.vBlock} ${c.vBlock2}`} />
      <MiniBlock cx={338} hash={MINI_HASH[2]} className={`${c.vBlock} ${c.vBlock3}`} />
      <g className={c.vSelect}>
        <Handles x={201} y={97} w={42} h={42} size={5} />
      </g>
      <rect x={216} y={160} width={128} height={5} rx={2.5} fill={C.line} />
      <rect x={236} y={172} width={88} height={5} rx={2.5} fill={C.fog} />

      {/* Controls */}
      <rect x={184} y={209} width={20} height={20} rx={2} fill={C.signal} />
      <path d="M190.5,213.5 L199.5,219 L190.5,224.5 Z" fill={C.paper} className={c.vPlay} />
      <g fill={C.paper} className={c.vPause}>
        <rect x={189.5} y={213.5} width={3.4} height={11} />
        <rect x={195.1} y={213.5} width={3.4} height={11} />
      </g>
      <path d="M214,219 H374" stroke={C.line} strokeWidth={4} strokeLinecap="round" />
      <path d="M214,219 H374" stroke={C.signal} strokeWidth={4} strokeLinecap="round" pathLength={100} strokeDasharray={100} className={c.vProg} />
      <Sq x={239.5} y={219} size={6} fill={C.rule} />
      <Sq x={279.5} y={219} size={6} fill={C.rule} />
      <Sq x={239.5} y={219} size={6} fill={C.ink} className={c.vCh1} />
      <Sq x={279.5} y={219} size={6} fill={C.ink} className={c.vCh2} />
      <rect x={209} y={214} width={10} height={10} fill={C.paper} stroke={C.signal} strokeWidth={2} className={c.vKnob} />

      {/* Up next: the highlight steps to the following lesson each loop */}
      {[186, 224, 262, 300, 338].map(x => <rect key={x} x={x} y={240} width={30} height={16} rx={2} fill={C.fog} />)}
      <rect x={186} y={240} width={30} height={16} rx={2} fill={C.signalWash} stroke={C.signal} strokeWidth={2} className={c.vNext} />
    </Art>
  )
}

// ─── Starts with the basics ──────────────────────────────────────────────────
// Transactions drop into a new block, it is sealed and linked, the chain moves on.

const HASH = [C.fog, C.signalSoft, C.fog, C.signalMid, C.fog, C.accentWash, C.fog, C.fog, C.signalSoft]
const MEMPOOL = [C.line, C.accent, C.line, C.support, C.line, C.signalSoft, C.line, C.marker, C.line, C.accent]

function ChainBlock({ cx }: { cx: number }) {
  return (
    <g>
      <rect x={cx - 28} y={132} width={56} height={56} rx={3} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
      <path d={`M${cx - 28},146 H${cx + 28}`} stroke={C.line} strokeWidth={2} />
      <Sq x={cx - 20} y={139} size={5} fill={C.signal} />
      <Sq x={cx - 12} y={139} size={5} fill={C.accent} />
      {HASH.map((fill, i) => <Sq key={i} x={cx - 9 + (i % 3) * 9} y={158 + Math.floor(i / 3) * 9} size={6} fill={fill} />)}
    </g>
  )
}

export function ChainArt() {
  const id = useSvgId()
  return (
    <Art>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={C.paper} />
          <stop offset="0.55" stopColor={C.paper} />
          <stop offset="1" stopColor={C.paper} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Pending transactions */}
      <path d="M96,58 H476" stroke={C.line} strokeWidth={2} />
      <Sq x={96} y={58} size={6} fill={C.rule} />
      <Sq x={476} y={58} size={6} fill={C.rule} />
      {MEMPOOL.map((fill, i) => (
        <Sq key={i} x={124 + i * 30} y={58} fill={fill}
          className={i % 3 === 1 ? base.flicker : undefined} style={i % 3 === 1 ? { animationDelay: `-${i * 0.5}s` } : undefined} />
      ))}
      {[[418, C.accent], [430, C.marker], [442, C.signalSoft]].map(([x, fill], i) => (
        <Sq key={i} x={x as number} y={58} fill={fill as string} className={c.chDrop} style={{ animationDelay: `${i * 0.15}s` }} />
      ))}

      {/* The next block's slot */}
      <rect x={402} y={132} width={56} height={56} rx={3} stroke={C.line} strokeWidth={2} strokeDasharray="4 4" />
      <g className={c.chSelect}>
        <rect x={394} y={124} width={72} height={72} stroke={C.rule} strokeWidth={1.5} />
        <Handles x={394} y={124} w={72} h={72} size={7} />
      </g>

      <g className={c.chMove}>
        <path d="M-300,160 H102 M158,160 H202 M258,160 H302" stroke={C.ink} strokeWidth={2.5} />
        <path d="M358,160 H402" stroke={C.ink} strokeWidth={2.5} pathLength={100} strokeDasharray={100} className={c.chLink} />
        <ChainBlock cx={130} />
        <ChainBlock cx={230} />
        <ChainBlock cx={330} />
        <g className={c.chSettle}><ChainBlock cx={430} /></g>
        <g className={c.chMine}>
          <rect x={402} y={132} width={56} height={56} rx={3} fill={C.signal} />
          <path d="M402,146 H458" stroke={C.paper} strokeWidth={2} />
          {HASH.map((_, i) => (
            <Sq key={i} x={421 + (i % 3) * 9} y={158 + Math.floor(i / 3) * 9} size={6} fill={C.paper}
              className={base.flicker} style={{ animationDuration: `${0.3 + (i % 4) * 0.12}s`, animationDelay: `-${i * 0.07}s` }} />
          ))}
        </g>
      </g>
      {/* Older blocks recede off the left edge */}
      <rect x={0} y={110} width={150} height={100} fill={`url(#${id}-fade)`} />

      {/* Ledger track */}
      <rect x={150} y={244} width={34} height={8} rx={2} fill={C.line} />
      <rect x={376} y={244} width={34} height={8} rx={2} fill={C.line} />
      <path d="M184,248 H376" stroke={C.line} strokeWidth={2} />
      <Sq x={204} y={248} fill={C.accent} />
      <Sq x={240} y={248} fill={C.line} />
      <Sq x={280} y={248} size={10} fill={C.signal} />
      <Sq x={320} y={248} fill={C.line} />
      <Sq x={356} y={248} fill={C.support} />
    </Art>
  )
}

// ─── Made by students ────────────────────────────────────────────────────────
// A lesson passes around a circle of students; each one adds to it in turn.

const ORBIT = 'M280,66 A170,92 0 0 1 280,250 A170,92 0 0 1 280,66 Z'
// Six points spaced evenly by arc length along ORBIT, starting at the top.
const PEERS = [[280, 66], [413.7, 101.2], [413.7, 214.8], [280, 250], [146.3, 214.8], [146.3, 101.2]] as const
const PEER_STEP = 1.2
const peerDelay = (k: number) => ({ animationDelay: `-${(6 - k) * PEER_STEP}s` })

export function PeersArt() {
  return (
    <Art>
      <path d="M456.7,121.1 A188,108 0 0 1 456.7,194.9 M103.3,194.9 A188,108 0 0 1 103.3,121.1" stroke={C.ink} strokeWidth={2} />
      {[[456.7, 121.1, 1], [456.7, 194.9, 1], [103.3, 121.1, -1], [103.3, 194.9, -1]].map(([x, y, dir]) => (
        <g key={`${x}-${y}`}>
          <Sq x={x} y={y} size={6} fill={C.ink} />
          <Sq x={x + dir * 12} y={y} size={5} fill={C.line} />
          <Sq x={x + dir * 21} y={y} size={5} fill={C.line} />
        </g>
      ))}
      <path d={ORBIT} stroke={C.line} strokeWidth={2} />

      {PEERS.map(([x, y]) => <path key={`${x}-${y}`} d={`M${x},${y} L280,158`} stroke={C.line} strokeWidth={1.5} strokeDasharray="3 4" />)}
      {PEERS.map(([x, y], k) => (
        <g key={k}>
          <path d={`M${x},${y} L280,158`} stroke={C.signal} strokeWidth={2} className={c.pLit} style={peerDelay(k)} />
          <Token d={`M${x},${y} L280,158`} color={C.signal} size={8} className={c.pSend} style={peerDelay(k)} />
        </g>
      ))}
      <Token d={ORBIT} color={C.signal} size={9} className={c.pOrbit} />

      {/* The lesson at the center */}
      <rect x={228} y={116} width={104} height={84} stroke={C.rule} strokeWidth={1.5} />
      <Handles x={228} y={116} w={104} h={84} size={6} />
      <g className={c.pCard}>
        <rect x={236} y={124} width={88} height={68} rx={4} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
        <rect x={240} y={128} width={80} height={14} rx={1.5} fill={C.signal} />
        {[246, 253, 260].map(x => <Sq key={x} x={x} y={135} size={4} fill={C.paper} />)}
        <rect x={246} y={150} width={60} height={4} rx={2} fill={C.line} />
        <rect x={246} y={159} width={46} height={4} rx={2} fill={C.line} />
        <rect x={246} y={168} width={54} height={4} rx={2} fill={C.accentWash} />
        <path d="M305,175 L314,180.5 L305,186 Z" fill={C.signal} />
      </g>

      {PEERS.map(([x, y], k) => (
        <g key={k}>
          <circle cx={x} cy={y} r={20} fill={C.paper} stroke={C.line} strokeWidth={2.5} />
          <Person x={x} y={y + 2} color={C.ink} scale={0.95} width={2} />
          <g className={`${c.pNode} ${k === 0 ? c.pNodeStatic : ''}`} style={peerDelay(k)}>
            <circle cx={x} cy={y} r={20} fill={C.signal} />
            <Person x={x} y={y + 2} color={C.paper} scale={0.95} width={2} />
          </g>
        </g>
      ))}

      {[[108, 72, C.signalSoft], [452, 72, C.support], [108, 244, C.accent], [452, 244, C.marker], [196, 84, C.line], [364, 232, C.line]].map(([x, y, fill], i) => (
        <Sq key={i} x={x as number} y={y as number} fill={fill as string}
          className={i > 3 ? base.flicker : undefined} style={i > 3 ? { animationDelay: `-${i * 0.6}s` } : undefined} />
      ))}
    </Art>
  )
}

// ─── Weekly Sunday meetings ──────────────────────────────────────────────────
// The week walks across the calendar; every Sunday fills in and the group meets.

const col = (i: number) => 162.5 + i * 23.5
const row = (i: number) => 106 + i * 23.5
const MEMBER_LANES = [
  { y: 86, d: 'M528,86 C482,86 468,147 444,147', color: C.accent, delay: 0 },
  { y: 124, d: 'M528,124 C488,124 470,153 444,153', color: C.support, delay: -0.08 },
  { y: 190, d: 'M528,190 C488,190 470,161 444,161', color: C.marker, delay: -0.04 },
  { y: 228, d: 'M528,228 C482,228 468,167 444,167', color: C.signalMid, delay: -0.12 },
]

export function SundaysArt() {
  const id = useSvgId()
  return (
    <Art>
      <defs>
        <clipPath id={`${id}-sundays`}>
          {[0, 1, 2, 3, 4].map(r => <rect key={r} x={col(0)} y={row(r)} width={18} height={18} rx={2} />)}
        </clipPath>
      </defs>
      <g transform="translate(-28 0)">
        {/* Months of 2026 */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={99} y={65 + i * 22} width={10} height={10} rx={1.5}
            fill={i === 5 ? C.marker : C.fog} stroke={i === 5 ? C.ink : 'none'} strokeWidth={1.5} />
        ))}
        <path d="M112,180 H146" stroke={C.line} strokeWidth={1.5} strokeDasharray="3 3" />

        {/* Calendar */}
        <rect x={146} y={52} width={192} height={210} rx={4} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
        <Handles x={146} y={52} w={192} h={210} size={7} />
        <path d="M146,84 H338" stroke={C.ink} strokeWidth={2} />
        <rect x={162} y={64} width={56} height={8} rx={2} fill={C.graphite} />
        <rect x={300} y={64} width={8} height={8} stroke={C.line} strokeWidth={1.5} />
        <rect x={314} y={64} width={8} height={8} stroke={C.line} strokeWidth={1.5} />
        {[0, 1, 2, 3, 4, 5, 6].map(i => <rect key={i} x={col(i) + 3} y={93} width={12} height={4} rx={1} fill={i === 0 ? C.signal : C.line} />)}
        {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4, 5, 6].map(i => (
          <rect key={`${r}-${i}`} x={col(i)} y={row(r)} width={18} height={18} rx={2} fill={i === 0 ? C.signalWash : C.fog} />
        )))}
        <g clipPath={`url(#${id}-sundays)`}>
          <rect x={col(0)} y={row(0)} width={18} height={112} fill={C.signal} className={c.sFill} />
        </g>
        <g className={c.sRow}>
          <g className={c.sDay}>
            <rect x={159.5} y={103} width={24} height={24} rx={3} stroke={C.ink} strokeWidth={2} />
            <rect x={159.5} y={103} width={24} height={24} rx={3} stroke={C.signal} strokeWidth={2} className={c.sSunday} />
          </g>
        </g>
        <Sq x={166} y={240} size={8} fill={C.signal} />
        <rect x={176} y={237.5} width={44} height={5} rx={2.5} fill={C.line} />

        {/* The meeting */}
        <path d="M338,157 H392" stroke={C.line} strokeWidth={2} strokeDasharray="5 4" />
        <Token d="M338,157 H392" color={C.signal} size={8} className={c.sSend} />
        {MEMBER_LANES.map(lane => (
          <g key={lane.d}>
            <path d={lane.d} stroke={C.line} strokeWidth={1.5} />
            <Sq x={528} y={lane.y} size={6} fill={C.rule} />
            <Token d={lane.d} color={lane.color} size={9} round className={c.sArrive} style={{ animationDelay: `${lane.delay}s` }} />
          </g>
        ))}
        <rect x={392} y={131} width={52} height={52} fill={C.signal} />
        <Handles x={392} y={131} w={52} h={52} size={7} fills={[C.marker, C.ink, C.ink, C.support]} />
        <g stroke={C.paper} strokeWidth={2} strokeLinecap="round">
          <circle cx={404} cy={151} r={4} />
          <path d="M396,168 a8,7 0 0 1 16,0" />
          <circle cx={432} cy={151} r={4} />
          <path d="M424,168 a8,7 0 0 1 16,0" />
          <circle cx={418} cy={148} r={5.5} fill={C.signal} />
          <path d="M408,170 a10,9 0 0 1 20,0 Z" fill={C.signal} />
        </g>
        <rect x={392} y={131} width={52} height={52} stroke={C.signal} strokeWidth={2} className={c.sPulse} />
      </g>
    </Art>
  )
}

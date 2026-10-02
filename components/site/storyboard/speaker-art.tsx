import { C } from './palette'
import { Art, Handles, Mic, Person, Sparkle, Sq, Token, base, polar, ticks, useSvgId } from './primitives'
import a from './speaker-art.module.css'

// ─── Direct Q&A ──────────────────────────────────────────────────────────────
// A student's question crosses the relay to the speaker; the answer returns.

function QARing({ cx, side, accent, pulseDelay }: { cx: number; side: 'left' | 'right'; accent: string; pulseDelay: string }) {
  const dir = side === 'right' ? 1 : -1
  const angles = side === 'right' ? [-60, -40, -20, 0, 20, 40, 60] : [120, 140, 160, 180, 200, 220, 240]
  return (
    <g>
      <path d={`M${cx},93 A62,62 0 0 ${side === 'right' ? 1 : 0} ${cx},217`} stroke={C.ink} strokeWidth={2} />
      {[93, 217].map(y => (
        <g key={y}>
          <Sq x={cx} y={y} size={6} fill={C.ink} />
          <Sq x={cx - dir * 12} y={y} size={5} fill={C.line} />
          <Sq x={cx - dir * 21} y={y} size={5} fill={C.line} />
        </g>
      ))}
      <circle cx={cx} cy={155} r={45} stroke={C.line} strokeWidth={3} />
      <circle cx={cx} cy={155} r={37} stroke={accent} strokeWidth={2.5} />
      <path d={ticks(cx, 155, 26, 30, angles)} stroke={C.line} strokeWidth={2} strokeLinecap="round" />
      <circle cx={cx} cy={155} r={37} stroke={accent} strokeWidth={2} className={a.qaPulse} style={{ animationDelay: pulseDelay }} />
    </g>
  )
}

const QA_PIXELS: readonly (readonly [number, number, string, number?])[] = [
  [268, 104, C.lime], [276, 104, C.limeWash], [284, 104, C.line], [292, 104, C.blue, 2.2],
  [268, 112, C.lime, 3.1], [276, 112, C.lime], [284, 112, C.blue], [292, 112, C.blue],
  [268, 120, C.limeWash], [276, 120, C.lime], [284, 120, C.blue, 2.6], [292, 120, C.line],
  [268, 128, C.lime], [276, 128, C.line], [284, 128, C.blueMid], [292, 128, C.blue],
  [268, 182, C.lime], [276, 182, C.line], [284, 182, C.blue], [292, 182, C.blue, 2.8],
  [268, 190, C.line], [276, 190, C.lime, 1.9], [284, 190, C.blue], [292, 190, C.blueTint],
  [268, 198, C.lime], [276, 198, C.lime], [284, 198, C.line], [292, 198, C.blue],
  [268, 206, C.limeWash], [276, 206, C.lime], [284, 206, C.blue, 3.4], [292, 206, C.blue],
]

function Wing({ flip }: { flip: boolean }) {
  return (
    <g stroke={C.line} strokeWidth={2} transform={flip ? 'translate(560 0) scale(-1 1)' : undefined}>
      <path d="M228,104 L262,114 V196 L228,206 Z" fill={C.paper} />
      <path d="M239.3,107.3 V202.7 M250.7,110.7 V199.3 M228,130 H262 M228,180 H262" />
      <rect x={239} y={146} width={11} height={18} fill={C.paper} />
    </g>
  )
}

export function QAArt() {
  return (
    <Art>
      <QARing cx={118} side="right" accent={C.lime} pulseDelay="-3s" />
      <QARing cx={442} side="left" accent={C.blue} pulseDelay="0s" />

      {/* Student: a speech bubble with typing dots */}
      <path d="M107,143 H129 A3,3 0 0 1 132,146 V160 A3,3 0 0 1 129,163 H116 L110,169 V163 H107 A3,3 0 0 1 104,160 V146 A3,3 0 0 1 107,143 Z" fill={C.lime} />
      {[111, 118, 125].map((x, i) => (
        <circle key={x} cx={x} cy={153} r={2} fill={C.paper} className={a.qaDot} style={{ animationDelay: `${i * 0.2}s` }} />
      ))}

      {/* Speaker: a microphone that answers */}
      <Mic x={442} y={155} color={C.blue} />
      <g stroke={C.blue} strokeWidth={2} strokeLinecap="round">
        <path d="M456,148 a8,8 0 0 1 0,12" className={a.qaSpeak} />
        <path d="M461,144 a13,13 0 0 1 0,20" className={a.qaSpeak} style={{ animationDelay: '0.15s' }} />
      </g>

      {/* Relay frame */}
      <path d="M224,96 H336 M224,214 H336 M222,96 V214 M338,96 V214" stroke={C.line} strokeWidth={1.5} />
      <Handles x={214} y={86} w={132} h={138} size={8} fills={[C.lime, C.blue, C.lime, C.blue]} />
      <Wing flip={false} />
      <Wing flip />
      {QA_PIXELS.map(([x, y, fill, dur]) => (
        <Sq key={`${x}-${y}`} x={x} y={y} size={6} fill={fill}
          className={dur ? base.flicker : undefined}
          style={dur ? { animationDuration: `${dur}s`, animationDelay: `-${(x + y) % 7 / 3}s` } : undefined} />
      ))}

      {/* Connectors */}
      <path d="M193,155 H268" stroke={C.lime} strokeWidth={2.5} strokeDasharray="7 5" />
      <path d="M292,155 H367" stroke={C.blue} strokeWidth={2.5} strokeDasharray="7 5" />
      <Token d="M193,155 H367" color={C.lime} size={11} className={a.qaAsk} />
      <Token d="M367,155 H193" color={C.blue} size={11} className={a.qaAnswer} />
      <rect x={171} y={144} width={22} height={22} fill={C.lime} />
      <rect x={178} y={151} width={8} height={8} fill={C.paper} />
      <rect x={367} y={144} width={22} height={22} fill={C.blue} />
      <rect x={374} y={151} width={8} height={8} fill={C.paper} />

      {/* Relay coin flips as each message passes */}
      <g className={a.qaCoin}>
        <circle cx={280} cy={155} r={11} fill={C.paper} />
        <path d="M280,144 A11,11 0 0 0 280,166" stroke={C.lime} strokeWidth={2.5} />
        <path d="M280,144 A11,11 0 0 1 280,166" stroke={C.blue} strokeWidth={2.5} />
        <circle cx={280} cy={155} r={5.5} stroke={C.ink} strokeWidth={2} fill={C.paper} />
        <path d="M280,149.5 A5.5,5.5 0 0 0 280,160.5 Z" fill={C.ink} />
      </g>
    </Art>
  )
}

// ─── Explore careers ─────────────────────────────────────────────────────────
// Starting points converge on a session, then fan out to different paths.

const LANES = [72, 102, 132, 178, 208, 238]
const entry = (y: number) => +(155 + (y - 155) * 0.28).toFixed(1)
const inPath = (y: number) => `M58,${y} H150 C200,${y} 205,${entry(y)} 248,${entry(y)}`
const outPath = (y: number) => `M312,${entry(y)} C355,${entry(y)} 360,${y} 410,${y} H502`

const JOURNEYS = [
  { from: 0, to: 2, before: C.ink, after: C.blue, dur: 5.6, delay: 0 },
  { from: 4, to: 0, before: C.slate, after: C.lime, dur: 6.4, delay: -2.1 },
  { from: 2, to: 5, before: C.ink, after: C.pink, dur: 5.2, delay: -3.6 },
  { from: 5, to: 3, before: C.slate, after: C.sand, dur: 6, delay: -1 },
  { from: 1, to: 4, before: C.ink, after: C.blueMid, dur: 6.8, delay: -4.5 },
]

export function CareersArt() {
  return (
    <Art>
      <g stroke={C.line} strokeWidth={2}>
        {LANES.map(y => <path key={`in${y}`} d={inPath(y)} />)}
        {LANES.map(y => <path key={`out${y}`} d={outPath(y)} />)}
      </g>
      {LANES.map(y => (
        <g key={y}>
          <Sq x={58} y={y} size={7} fill={C.line} />
          <Sq x={502} y={y} size={7} fill={C.line} />
        </g>
      ))}
      {JOURNEYS.map(j => (
        <Sq key={j.to} x={502} y={LANES[j.to]} size={7} fill={j.after} className={a.carPing}
          style={{ animationDuration: `${j.dur}s`, animationDelay: `${j.delay}s` }} />
      ))}

      {/* Waypoints along the lanes */}
      <Sq x={96} y={102} size={6} fill={C.line} />
      <Sq x={128} y={178} size={6} fill={C.line} />
      <Sq x={84} y={238} size={6} fill={C.line} />
      <Sq x={132} y={88} size={9} fill={C.line} rotate={45} />
      <Sq x={236} y={133} size={8} fill={C.line} rotate={45} />
      <rect x={95} y={123} width={18} height={18} fill={C.paper} stroke={C.line} strokeWidth={2} />
      <Sq x={104} y={132} size={8} fill={C.ink} />
      <circle cx={92} cy={208} r={11} fill={C.paper} stroke={C.line} strokeWidth={3} />
      <circle cx={92} cy={208} r={5.5} stroke={C.blue} strokeWidth={2.5} />
      <circle cx={214} cy={139} r={8} fill={C.lime} stroke={C.ink} strokeWidth={2} />
      <circle cx={221} cy={180} r={6} fill={C.paper} stroke={C.pink} strokeWidth={2} />
      <circle cx={221} cy={180} r={2.2} fill={C.pink} />

      {/* Travelers: each changes color after the session */}
      {JOURNEYS.map((j, i) => {
        const timing = { animationDuration: `${j.dur}s`, animationDelay: `${j.delay}s` }
        return (
          <g key={i}>
            <Token d={inPath(LANES[j.from])} color={j.before} size={8} className={a.carIn} style={timing} />
            <Token d={outPath(LANES[j.to])} color={j.after} size={i % 2 ? 9 : 10} round={i % 2 === 0} className={a.carOut} style={timing} />
          </g>
        )
      })}

      <g transform="rotate(28 226 164)">
        <rect x={214} y={159} width={24} height={10} rx={2} fill={C.paper} stroke={C.lime} strokeWidth={2} />
        <rect x={219} y={162} width={14} height={4} fill={C.pink} />
      </g>
      <circle cx={336} cy={150} r={10} fill={C.paper} stroke={C.blue} strokeWidth={2.5} />
      <circle cx={336} cy={150} r={4.5} fill={C.pink} />
      <g transform="rotate(-10 382 108)">
        <rect x={372} y={98} width={20} height={20} rx={2} fill={C.paper} stroke={C.sand} strokeWidth={2.5} />
        <Sq x={382} y={108} size={8} fill={C.blue} />
      </g>
      <g transform="rotate(-10 422 80)">
        <rect x={406} y={74} width={32} height={12} rx={2} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
        <rect x={411} y={77.5} width={22} height={5} fill={C.blue} />
      </g>
      <Sq x={346} y={118} size={8} fill={C.line} rotate={45} />
      <Sq x={352} y={194} size={8} fill={C.line} rotate={45} />
      <Sq x={404} y={178} size={12} fill={C.lime} />
      <circle cx={456} cy={178} r={6} fill={C.sand} stroke={C.ink} strokeWidth={2} />
      <rect x={412} y={224} width={16} height={16} rx={1.5} fill={C.paper} stroke={C.pink} strokeWidth={2.5} transform="rotate(8 420 232)" />

      {/* The session: a compass that keeps finding new directions */}
      <rect x={248} y={123} width={64} height={64} fill={C.blue} />
      <Handles x={248} y={123} w={64} h={64} size={7} fills={[C.sand, C.ink, C.ink, C.lime]} />
      <circle cx={280} cy={155} r={25} fill={C.paper} />
      <path d={ticks(280, 155, 19.5, 22.5, [0, 90, 180, 270])} stroke={C.line} strokeWidth={2} />
      <path d={`M${polar(280, 155, 22, 200).join(',')} A22,22 0 0 0 ${polar(280, 155, 22, 70).join(',')}`} stroke={C.lime} strokeWidth={2} />
      <circle cx={280} cy={155} r={17} stroke={C.ink} strokeWidth={2.5} />
      <g className={a.carNeedle}>
        <path d="M280,142 L285.5,155 H274.5 Z" fill={C.blue} />
        <path d="M280,168 L285.5,155 H274.5 Z" fill={C.graphite} />
      </g>
      <circle cx={280} cy={155} r={2.2} fill={C.paper} />
    </Art>
  )
}

// ─── Meet guest speakers ─────────────────────────────────────────────────────
// The schedule picks a speaker; the spotlight and both track markers follow.

const SEATS = [217, 280, 343]

function Track({ y }: { y: number }) {
  return (
    <g>
      <rect x={150} y={y - 4} width={34} height={8} rx={2} fill={C.line} />
      <rect x={376} y={y - 4} width={34} height={8} rx={2} fill={C.line} />
      <path d={`M184,${y} H376`} stroke={C.line} strokeWidth={2} />
      <Sq x={196} y={y} fill={C.pink} />
      <Sq x={248} y={y} fill={C.line} />
      <Sq x={312} y={y} fill={C.line} />
      <Sq x={364} y={y} fill={C.lime} />
      <Sq x={280} y={y} size={10} fill={C.blue} className={a.meetMarker} />
    </g>
  )
}

function Bus({ y, stemTo }: { y: number; stemTo: number }) {
  return (
    <g>
      <path d={`M108,${y} H452 M280,${y} V${stemTo}`} stroke={C.ink} strokeWidth={2} />
      {[108, 280, 452].map(x => <Sq key={x} x={x} y={y} size={6} fill={C.sand} />)}
    </g>
  )
}

export function MeetArt() {
  const id = useSvgId()
  return (
    <Art>
      <defs>
        <pattern id={`${id}-dots`} width={8} height={8} patternUnits="userSpaceOnUse">
          <rect x={3} y={3} width={2.5} height={2.5} fill={C.fog} />
        </pattern>
      </defs>
      <Track y={46} />
      <Track y={264} />
      <Bus y={80} stemTo={104} />
      <Bus y={230} stemTo={206} />

      {/* Calendar and badge on either side */}
      <path d="M100,155 H158 M402,155 H460" stroke={C.line} strokeWidth={2} />
      {[80, 480].map(cx => (
        <g key={cx}>
          <rect x={cx - 20} y={135} width={40} height={40} rx={9} fill={C.paper} stroke={C.line} strokeWidth={2} />
          {[[cx, 135], [cx, 175], [cx - 20, 155], [cx + 20, 155]].map(([x, y]) => (
            <Sq key={`${x}-${y}`} x={x} y={y} size={5} fill={cx < 280 ? C.sand : C.lime} />
          ))}
        </g>
      ))}
      <g stroke={C.ink} strokeWidth={2} strokeLinecap="round">
        <rect x={71} y={148} width={18} height={15} rx={2} />
        <path d="M71,153 H89 M76,145 V150 M84,145 V150" />
      </g>
      <g stroke={C.blue} strokeWidth={2} strokeLinecap="round">
        <rect x={472} y={144} width={16} height={21} rx={3} />
        <path d="M476,159 H484 M477,141 H483" />
        <circle cx={480} cy={152} r={3} fill={C.blue} />
      </g>

      {/* Stage */}
      <rect x={158} y={104} width={244} height={102} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
      <Handles x={158} y={104} w={244} h={102} size={7} />
      <rect x={167} y={112} width={226} height={86} rx={6} fill={C.paper} stroke={C.line} strokeWidth={2.5} />
      {[177, 383].map(x => (
        <g key={x} stroke={C.line} strokeWidth={1.5}>
          <path d={`M${x},125 V185`} strokeWidth={2} />
          <rect x={x - 3.5} y={117.5} width={7} height={7} fill={C.paper} />
          <rect x={x - 3.5} y={185.5} width={7} height={7} fill={C.paper} />
        </g>
      ))}
      {[248.5, 311.5].map(x => (
        <g key={x}>{[134, 142, 150, 158, 166, 174].map(y => <rect key={y} x={x - 2.5} y={y} width={5} height={3} fill={C.pinkWash} />)}</g>
      ))}
      {SEATS.map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 27} y={124} width={54} height={62} rx={2} fill={`url(#${id}-dots)`} stroke={C.line} strokeWidth={1.5} />
          <Handles x={cx - 27} y={124} w={54} h={62} size={4.5} fills={[C.sand, C.blue, C.pink, C.sand]} />
          <Person x={cx} y={162} color={C.ink} scale={1.35} width={2.4} />
          <g className={`${a.meetSpot} ${i === 1 ? a.meetSpotStatic : ''}`} style={{ animationDelay: `${-(3 - i) * 2.5}s` }}>
            <rect x={cx - 27} y={124} width={54} height={62} rx={2} fill={C.blue} />
            <Person x={cx} y={162} color={C.paper} scale={1.35} width={2.4} />
          </g>
        </g>
      ))}

      {/* Loose pixels */}
      {[
        [126, 96, C.line], [146, 96, C.ink], [126, 122, C.blue], [126, 188, C.pink], [126, 214, C.line], [146, 214, C.blue],
        [434, 96, C.line], [414, 96, C.pink], [434, 122, C.blue], [434, 188, C.sand], [434, 214, C.line], [414, 214, C.blue],
      ].map(([x, y, fill], i) => (
        <Sq key={i} x={x as number} y={y as number} fill={fill as string}
          className={i % 4 === 1 ? base.flicker : undefined} style={i % 4 === 1 ? { animationDelay: `-${i * 0.4}s` } : undefined} />
      ))}
    </Art>
  )
}

// ─── Ten sessions in year one ────────────────────────────────────────────────
// The gauge, the dial, and the meter all count to ten together.

const TILE_ROWS = [
  [C.blue, C.fog, C.pink, C.graphite, C.blue, C.limeWash, C.blueTint, C.fog, C.blue, C.fog, C.fog, C.blue, C.blueMid],
  [C.fog, C.fog, C.limeWash, C.fog, C.blueMid, C.fog, C.fog, C.pinkWash, C.blue, C.fog, C.pinkWash, C.fog, C.fog],
  [C.blueTint, C.fog, C.blueMid, C.blue, C.fog, C.blue, C.blue, C.blueMid, C.graphite, C.blueTint, C.limeWash, C.blue, C.slate],
]
const FLICKERING = new Set(['0-3', '0-8', '0-11', '1-4', '1-8', '1-10', '2-1', '2-5', '2-9', '2-12'])
const SEGMENTS = Array.from({ length: 10 }, (_, i) => 219 + i * 15.24)

export function SessionsArt() {
  const id = useSvgId()
  return (
    <Art>
      <defs>
        <clipPath id={`${id}-segments`}>
          {SEGMENTS.map(x => <rect key={x} x={x} y={211} width={12} height={20} />)}
        </clipPath>
      </defs>

      {/* Side panels */}
      {[104, 396].map(x => [70, 136].map(y => (
        <rect key={`${x}-${y}`} x={x} y={y} width={60} height={60} fill={C.paper} stroke={C.line} strokeWidth={2} />
      )))}
      <Handles x={104} y={70} w={352} h={126} size={6} />
      <rect x={117} y={83} width={34} height={34} stroke={C.blue} strokeWidth={2} />
      <Handles x={117} y={83} w={34} h={34} size={5} fill={C.pink} />
      <Mic x={134} y={102} color={C.lime} />
      <circle cx={134} cy={166} r={19} stroke={C.line} strokeWidth={2} strokeDasharray="2 3.4" className={base.spin} />
      <circle cx={134} cy={166} r={12} stroke={C.pink} strokeWidth={2.5} />
      <Sq x={134} y={166} size={8} fill={C.sand} rotate={45} />
      <Sparkle x={426} y={100} />
      <rect x={411} y={153} width={30} height={26} fill={C.paper} stroke={C.sand} strokeWidth={2} />
      <Handles x={411} y={153} w={30} h={26} size={5} />
      <path d="M416,158 V165 M420,158 V165 M424,158 V165 M428,158 V165 M432,158 V165 M436,158 V165" stroke={C.blue} strokeWidth={2} />
      <path d="M416,171 H436" stroke={C.pink} strokeWidth={2} />

      {/* Main console */}
      <rect x={172} y={34} width={216} height={240} stroke={C.rule} strokeWidth={1.5} />
      <Handles x={172} y={34} w={216} h={240} size={8} />
      <rect x={184} y={46} width={192} height={102} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
      <path d="M194,148 V66 L204,56 H356 L366,66 V148" stroke={C.line} strokeWidth={2} />
      <path d="M196,146 A84,84 0 0 1 240.6,71.8 M319.4,71.8 A84,84 0 0 1 364,146" stroke={C.lime} strokeWidth={2.5} />
      <path d="M210.9,135.1 A70,70 0 0 1 349.1,135.1" stroke={C.line} strokeWidth={10} />
      <path d="M210.9,135.1 A70,70 0 0 1 349.1,135.1" stroke={C.blue} strokeWidth={10} pathLength={100} strokeDasharray={100} className={a.gArc} />
      <path d={ticks(280, 146, 52, 58, Array.from({ length: 11 }, (_, k) => 189 + k * 16.2))} stroke={C.line} strokeWidth={2} strokeLinecap="round" />
      <path d="M236,146 A44,44 0 0 1 324,146" stroke={C.ink} strokeWidth={2.5} />
      <path d="M247,146 A33,33 0 0 1 313,146 Z" fill={C.line} />
      <g className={a.gNeedle}>
        <path d="M280,146 V100" stroke={C.blue} strokeWidth={3} strokeLinecap="round" />
        <rect x={275.5} y={141.5} width={9} height={9} fill={C.paper} stroke={C.blue} strokeWidth={2} />
      </g>

      {TILE_ROWS.map((row, r) => row.map((fill, c) => {
        const flickers = FLICKERING.has(`${r}-${c}`)
        return (
          <Sq key={`${r}-${c}`} x={192.4 + c * 14.6} y={163 + r * 14} size={10} fill={fill}
            className={flickers ? base.flicker : undefined}
            style={flickers ? { animationDuration: `${1.8 + ((r * 13 + c) % 5) * 0.4}s`, animationDelay: `-${c * 0.3}s` } : undefined} />
        )
      }))}

      <rect x={184} y={206} width={192} height={30} rx={2} fill={C.paper} stroke={C.ink} strokeWidth={2.5} />
      <rect x={191} y={211} width={20} height={20} fill={C.blue} />
      {SEGMENTS.map(x => <rect key={x} x={x} y={211} width={12} height={20} fill={C.blueWash} />)}
      <g clipPath={`url(#${id}-segments)`}>
        <rect x={219} y={211} width={152.4} height={20} fill={C.blue} className={a.gBar} />
      </g>
    </Art>
  )
}

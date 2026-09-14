import type { ReactNode } from 'react';

import {
  CARD,
  DANGER,
  Dizzy,
  EDGE,
  FAINT,
  Figure,
  LINE,
  PAPER,
  POSES,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  add,
  delay,
  dir,
  organ,
  pt,
  type Joints,
  type OrganTone,
} from './kit';

/*
 * Contagio. Un laboratorio: cuatro frascos de especimen en la mesa, cada uno
 * con su organo del color de su carta (Corazon, Cerebro, Pulmon, Higado). La
 * doctora es neutra: bata del color de la carta en blanco y silueta en tinta.
 * Los virus de la derrota van del color del organo al que atacan.
 */

const GROUND = 126;
const BENCH = 98;
/** Centros de los cuatro frascos sobre la mesa. */
const JARS: [OrganTone, number][] = [
  ['red', 110],
  ['blue', 148],
  ['green', 186],
  ['yellow', 224],
];

/* --- organos, dibujados hacia (0,0) y de unas 24 unidades ------------------ */

const organLine = { stroke: EDGE, strokeWidth: 1.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
const detail = { stroke: EDGE, strokeWidth: 1.1, fill: 'none', strokeLinecap: 'round' as const };

function Heart({ fade = 1 }: { fade?: number }) {
  return (
    <g>
      <path d="M1.5-8.5V-14h5.5M-3-9.5v-3.5" {...organLine} fill="none" strokeWidth={2.6} />
      <path d="M1.5-8.5V-14h5.5M-3-9.5v-3.5" stroke={organ('red')} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <path
        d="M0 11C-7 6-12 1.5-12-4c0-4.4 3-7 6.4-7 2.6 0 4.5 1.3 5.6 3.1C1.1-9.7 3-11 5.6-11 9-11 12-8.4 12-4c0 5.5-5 10-12 15z"
        fill={organ('red')}
        fillOpacity={0.85 * fade}
        {...organLine}
      />
      <path d="M-7-2h3.4l1.8-3.4 2.6 7 2-4h4.4" {...detail} stroke={PAPER} strokeWidth={1.3} />
    </g>
  );
}

function Brain({ fade = 1 }: { fade?: number }) {
  return (
    <g>
      <path
        d="M-1-10.5c-6 0-11 3.6-11 9 0 5.4 4.6 10 11 10zM1-10.5c6 0 11 3.6 11 9 0 5.4-4.6 10-11 10z"
        fill={organ('blue')}
        fillOpacity={0.85 * fade}
        {...organLine}
      />
      <path d="M-4 8.5 -2 12h4l2-3.5" fill={organ('blue')} fillOpacity={0.85 * fade} {...organLine} />
      <path d="M-8-5q3 .5 3.5 3.5M-9.5 2q3-1.5 5 1M-5-9q.5 2.5-1.5 4M8-5q-3 .5-3.5 3.5M9.5 2q-3-1.5-5 1M5-9q-.5 2.5 1.5 4" {...detail} />
    </g>
  );
}

function Lungs({ fade = 1 }: { fade?: number }) {
  const lobe = 'M-2.5-4c0 7-2 10.5-5 14-2 2-4.5 1-4.5-1.5V-1c0-4.4 2.6-8 6-8 2 0 3.5 1.8 3.5 5z';
  return (
    <g>
      <path d="M0-14v10M0-5-4-1M0-5 4-1" {...organLine} fill="none" strokeWidth={2.4} />
      <path d={lobe} fill={organ('green')} fillOpacity={0.85 * fade} {...organLine} />
      <path d={lobe} transform="scale(-1 1)" fill={organ('green')} fillOpacity={0.85 * fade} {...organLine} />
      <path d="M-5-1v7M-5 2-8 5M5-1v7M5 2l3 3" {...detail} />
    </g>
  );
}

function Liver({ fade = 1 }: { fade?: number }) {
  return (
    <g>
      <path
        d="M-13-3c5-5 14-6.5 21-5.2 4.4.8 6.2 3.2 5.4 7-1.2 5.8-7.6 9.6-13.6 9.4C-6.6 8-11.6 3.6-13-3z"
        fill={organ('yellow')}
        fillOpacity={0.85 * fade}
        {...organLine}
      />
      <path d="M1-8.4C-.4-3-.4 3 .6 8.6M-11-1c4-1.6 8-2 12-1.6" {...detail} />
      <ellipse cx={3.5} cy={7.4} rx={2.4} ry={1.8} fill={SOFT} stroke={EDGE} strokeWidth={1.1} />
    </g>
  );
}

const ORGANS: Record<OrganTone, (p: { fade?: number }) => ReactNode> = {
  red: Heart,
  blue: Brain,
  green: Lungs,
  yellow: Liver,
  wild: Heart,
};

/** Virus del color de su organo: bola con espigas rematadas. */
function Virus({ x, y, r = 5, tone, className, i = 0 }: { x: number; y: number; r?: number; tone: OrganTone; className?: string; i?: number }) {
  const spikes = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const d = dir(a + 20);
    return { a, from: add({ x, y }, d, r * 0.8), to: add({ x, y }, d, r * 1.55) };
  });
  return (
    <g className={className} style={delay(i)}>
      {spikes.map((s) => (
        <path key={s.a} d={`M${pt(s.from)}L${pt(s.to)}`} stroke={EDGE} strokeWidth={1.3} strokeLinecap="round" />
      ))}
      <circle cx={x} cy={y} r={r} fill={organ(tone)} stroke={EDGE} strokeWidth={1.3} />
      {spikes.map((s) => (
        <circle key={s.a} cx={s.to.x} cy={s.to.y} r={Math.max(1.2, r * 0.26)} fill={organ(tone)} stroke={EDGE} strokeWidth={0.9} />
      ))}
      <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.22} fill={EDGE} />
      <circle cx={x + r * 0.3} cy={y + r * 0.25} r={r * 0.28} fill={EDGE} />
    </g>
  );
}

/* --- el laboratorio ------------------------------------------------------- */

function Jar({ x, tone, broken = false, glow = false }: { x: number; tone: OrganTone; broken?: boolean; glow?: boolean }) {
  const Organ = ORGANS[tone];
  const top = BENCH - 42;
  // Roto: sin tapa y con el borde de cristal mordido.
  const glass = broken
    ? `M${x - 16} ${BENCH}V${top + 10}l4-6 5 7 3-5 6 6 5-8 5 5 4-4V${BENCH}Z`
    : `M${x - 16} ${BENCH}V${top + 4}q0-4 4-4h24q4 0 4 4V${BENCH}Z`;
  return (
    <g>
      <path d={glass} fill={PAPER} fillOpacity={0.45} stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round" />
      <rect x={x - 14.6} y={top + (broken ? 24 : 9)} width={29.2} height={broken ? 16.6 : 31.6} rx={3} fill={FAINT} fillOpacity={broken ? 0.3 : 0.22} />
      {glow && <circle cx={x} cy={top + 22} r={14} fill={WARM} fillOpacity={0.22} />}
      <g transform={`translate(${x} ${top + 22}) ${broken ? 'rotate(14) scale(1.05)' : 'scale(1.12)'}`}>
        <Organ fade={broken ? 0.55 : 1} />
      </g>
      <path d={`M${x - 11} ${top + 12}v24`} stroke={PAPER} strokeOpacity={0.8} strokeWidth={1.6} strokeLinecap="round" />
      {broken ? (
        <path d={`M${x + 5} ${top + 4}l3 8-4 5 5 7-2 6`} stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      ) : (
        <rect x={x - 17.5} y={top - 5} width={35} height={6} rx={1.5} fill={SOFT} stroke={EDGE} strokeWidth={1.3} />
      )}
    </g>
  );
}

function Bench() {
  return (
    <g stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round">
      <rect x={86} y={BENCH + 6} width={162} height={GROUND - BENCH - 6} fill={LINE} fillOpacity={0.75} />
      <path d={`M167 ${BENCH + 6}V${GROUND}M92 ${BENCH + 13}h69M173 ${BENCH + 13}h69`} fill="none" strokeWidth={1.1} />
      <path d={`M122 ${BENCH + 17}h10M208 ${BENCH + 17}h10`} fill="none" strokeWidth={1.6} strokeLinecap="round" />
      <rect x={80} y={BENCH} width={174} height={6} rx={1.5} fill={CARD} />
    </g>
  );
}

function Room() {
  return (
    <>
      {/* Azulejo de la pared y del suelo. */}
      <g stroke={LINE} strokeWidth={1}>
        {[20, 40, 60, 80].map((y) => (
          <path key={y} d={`M0 ${y}H320`} />
        ))}
      </g>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />
      <path d="M40 126 28 160M100 126l-6 34M160 126v34M220 126l6 34M280 126l12 34" stroke={LINE} strokeWidth={1} />
    </>
  );
}

/** Puerta con ventanuco: en la derrota, la rival se asoma. */
function Door({ rival = false }: { rival?: boolean }) {
  return (
    <g>
      <rect x={6} y={52} width={30} height={74} fill={CARD} fillOpacity={0.6} stroke={SOFT} strokeWidth={1.3} />
      <rect x={12} y={60} width={18} height={20} rx={2} fill={PAPER} fillOpacity={0.8} stroke={SOFT} strokeWidth={1.2} />
      {rival && (
        <g fill={SOFT}>
          <circle cx={21} cy={68} r={4.2} />
          <path d="M13 80c0-5 3.6-7.6 8-7.6s8 2.6 8 7.6z" />
          <circle cx={24.2} cy={66.8} r={2.2} fill="none" stroke={PAPER} strokeWidth={0.9} />
        </g>
      )}
      <circle cx={31} cy={92} r={1.6} fill={SOFT} />
    </g>
  );
}

function Shelf({ tipped = false }: { tipped?: boolean }) {
  return (
    <g stroke={SOFT} strokeWidth={1.2} fill={CARD} fillOpacity={0.6} strokeLinejoin="round">
      <path d="M92 36h78" fill="none" strokeWidth={1.6} />
      <path d="M100 36v-10h6v10M101 26v-3h4v3" />
      <path d="M113 36l5-9v-4h4v4l5 9z" />
      {tipped ? <path d="M136 36v-6h11v6M147 31.5h3v3h-3" /> : <path d="M136 36v-12h8v12M137 24v-2h6v2" />}
      <path d="M152 36v-8h12v8" />
    </g>
  );
}

function Lamp({ flicker = false }: { flicker?: boolean }) {
  return (
    <g>
      <path d="M168 0v10" stroke={SOFT} strokeWidth={1.2} />
      <g className={flicker ? 'story-flicker' : undefined}>
        <path d="M110 97 152 20h32l42 77z" fill={WARM} fillOpacity={flicker ? 0.08 : 0.13} />
        <circle cx={168} cy={20} r={3.6} fill={WARM} fillOpacity={0.9} />
      </g>
      <path d="M158 20q0-10 10-10t10 10z" fill={CARD} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
    </g>
  );
}

function Monitor({ live }: { live: boolean }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M287 78v44M276 122h22" stroke={SOFT} strokeWidth={1.8} fill="none" />
      <circle cx={278} cy={124} r={2} fill={SOFT} />
      <circle cx={296} cy={124} r={2} fill={SOFT} />
      <rect x={264} y={48} width={46} height={30} rx={3} fill={CARD} stroke={EDGE} strokeWidth={1.4} />
      <rect x={268} y={52} width={38} height={22} rx={1.5} fill={SOFT} fillOpacity={0.22} />
      {live ? (
        <path className="story-glow" d="M269 64h8l2.4-7 3.4 13 2.8-9 2 3h6l2-4 2 5 1.6-1h5.6" stroke={WARM} strokeWidth={1.6} fill="none" />
      ) : (
        <>
          <path d="M269 64h36" stroke={SOFT} strokeWidth={1.6} />
          <circle className="story-flicker" style={delay(2)} cx={304} cy={44} r={2.4} fill={DANGER} />
        </>
      )}
      <path d="M300 48v-4" stroke={SOFT} strokeWidth={1.2} />
    </g>
  );
}

/* --- la doctora ------------------------------------------------------------ */

/**
 * La figura se pinta en CARD (la bata con mangas); encima van las piernas y la
 * cabeza en tinta, el faldon de la bata y el fonendo.
 */
function Doctor({ j }: { j: Joints }) {
  const hemL = add(add(j.hip, j.side, -8), j.up, -11);
  const hemR = add(add(j.hip, j.side, 8), j.up, -11);
  const chest = add(j.shoulder, j.up, -8);
  const leg = (h: typeof j.hL, k: typeof j.kneeL, f: typeof j.footL) => (
    <path d={`M${pt(h)}L${pt(k)}L${pt(f)}`} stroke={SOFT} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  );
  return (
    <g>
      {leg(j.hL, j.kneeL, j.footL)}
      {leg(j.hR, j.kneeR, j.footR)}
      <path d={`M${pt(j.sL)}L${pt(j.sR)}L${pt(hemR)}L${pt(hemL)}Z`} fill={CARD} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d={`M${pt(j.sL)}L${pt(j.elbowL)}L${pt(j.handL)}M${pt(j.sR)}L${pt(j.elbowR)}L${pt(j.handR)}`} stroke={CARD} strokeWidth={5.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M${pt(add(j.neck, j.side, -3))}L${pt(chest)}L${pt(add(j.neck, j.side, 3))}`} stroke={EDGE} strokeWidth={1} fill="none" strokeLinejoin="round" />
      <path
        d={`M${pt(add(j.neck, j.side, -3.4))}Q${pt(add(chest, j.side, -4))} ${pt(add(add(chest, j.side, -1), j.up, -3))}`}
        stroke={EDGE}
        strokeWidth={1.1}
        fill="none"
      />
      <circle cx={add(add(chest, j.side, -1), j.up, -4.4).x} cy={add(add(chest, j.side, -1), j.up, -4.4).y} r={1.6} fill={SOFT} stroke={EDGE} strokeWidth={0.8} />
      <circle cx={j.handL.x} cy={j.handL.y} r={2.5} fill={SOFT} />
      <circle cx={j.handR.x} cy={j.handR.y} r={2.5} fill={SOFT} />
      <circle cx={j.head.x} cy={j.head.y} r={j.headR} fill={SOFT} />
      {/* Gorro de quirofano. */}
      <path
        d={`M${pt(add(j.head, j.side, -j.headR - 0.4))}A${j.headR + 0.4} ${j.headR + 0.4} 0 0 1 ${pt(add(j.head, j.side, j.headR + 0.4))}Z`}
        fill={CARD}
        stroke={EDGE}
        strokeWidth={1.1}
      />
    </g>
  );
}

export function ContagioWin() {
  return (
    <Scene>
      <Room />
      <Door />
      <Shelf />
      <Lamp />
      <Monitor live />

      <Bench />
      {JARS.map(([tone, x]) => (
        <Jar key={tone} x={x} tone={tone} glow />
      ))}

      <Figure className="story-bob" x={56} y={102} pose={{ ...POSES.fistR, head: 8, lean: 4 }} color={CARD} front={(j) => <Doctor j={j} />} />

      <g fill={WARM} fillOpacity={0.8}>
        <rect x={96} y={30} width={3} height={2} transform="rotate(30 97 31)" />
        <rect x={190} y={24} width={3} height={2} transform="rotate(-20 191 25)" />
        <rect x={232} y={40} width={3} height={2} transform="rotate(50 233 41)" />
        <rect x={84} y={62} width={3} height={2} transform="rotate(-40 85 63)" />
      </g>
      <Sparkle x={128} y={48} r={4} i={0} />
      <Sparkle x={206} y={44} r={5} i={2} />
      <Sparkle x={244} y={20} r={3.5} i={4} />
    </Scene>
  );
}

export function ContagioLose() {
  return (
    <Scene>
      <Room />
      <Door rival />
      <Shelf tipped />
      <Lamp flicker />
      <Monitor live={false} />

      {/* Charco del frasco volcado, goteando de la mesa al suelo. */}
      <path d="M88 104q-2 8 0 12M92 104v6" stroke={FAINT} strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={90} cy={GROUND + 3} rx={18} ry={3} fill={FAINT} fillOpacity={0.45} />
      <g fill={PAPER} fillOpacity={0.6} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round">
        <path d="M244 130l6-5 3 6z" />
        <path d="M258 134l4-3 2 4z" />
        <path d="M112 132l5-4 1 5z" />
      </g>

      <Bench />
      {/* El Corazon: frasco volcado sobre la mesa, con la tapa fuera. */}
      <g transform={`translate(0 5) rotate(-90 110 ${BENCH - 21})`}>
        <Jar x={110} tone="red" broken />
      </g>
      {JARS.slice(1).map(([tone, x]) => (
        <Jar key={tone} x={x} tone={tone} broken />
      ))}

      {/* Un virus pegado a cada organo y otros escapando de los frascos. */}
      <Virus x={98} y={90} r={4.5} tone="red" />
      <Virus x={154} y={74} r={4.5} tone="blue" />
      <Virus x={180} y={80} r={4.5} tone="green" />
      <Virus x={230} y={82} r={4.5} tone="yellow" />
      <Virus className="story-float" i={0} x={160} y={46} r={5} tone="blue" />
      <Virus className="story-float" i={2} x={210} y={34} r={4} tone="green" />
      <Virus className="story-float" i={1} x={246} y={50} r={4.5} tone="yellow" />

      <Figure x={50} y={123} pose={POSES.slumped} color={CARD} front={(j) => <Doctor j={j} />} />
      <Dizzy x={62} y={86} i={0} />
    </Scene>
  );
}

export const scenes = { win: ContagioWin, lose: ContagioLose };

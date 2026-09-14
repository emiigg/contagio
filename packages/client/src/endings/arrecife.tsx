import type { ReactNode } from 'react';

import { CARD, Dizzy, EDGE, FAINT, LINE, PAPER, SOFT, Scene, Sparkle, WARM, delay, organ } from './kit';

/*
 * Arrecife. Las cuatro cartas son criaturas: Cangrejo rojo, Ballena azul,
 * Tortuga verde y Pez globo amarillo. El agua y el coral son neutros para
 * que el azul siga siendo solo la ballena. En la derrota, las dos amenazas
 * con color van del de su victima: el anzuelo rojo junto al cangrejo y el
 * plastico amarillo junto al pez globo.
 */

const GROUND = 126;
const SURFACE = 22;

type Mood = 'joy' | 'sad' | 'dizzy';

/** Ojo y boca de pocos trazos, con la boca a un lado del ojo para los que miran de perfil. */
function Eye({ x, y, mood, s = 1 }: { x: number; y: number; mood: Mood; s?: number }) {
  const shape = {
    joy: <path d="M-1.6 .6q1.6-2.4 3.2 0" fill="none" />,
    sad: (
      <>
        <circle r={1.3} fill={EDGE} stroke="none" />
        <path d="M-2-2.8l3.2 1" fill="none" />
      </>
    ),
    dizzy: <path d="M-1.5-1.5l3 3m0-3-3 3" />,
  }[mood];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={EDGE} strokeWidth={1.3} strokeLinecap="round">
      {shape}
    </g>
  );
}

function Place({ x, y, s = 1, rot = 0, className, i = 0, children }: { x: number; y: number; s?: number; rot?: number; className?: string; i?: number; children: ReactNode }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>{children}</g>
    </g>
  );
}

interface CreatureProps {
  x: number;
  y: number;
  s?: number;
  rot?: number;
  mood: Mood;
  className?: string;
  i?: number;
}

/* --- las cuatro criaturas -------------------------------------------------- */

/** Pinza abierta, centrada en su base; la de la izquierda se refleja. */
const CLAW = 'M-4 3Q-7-5-1.5-8L0-2.5 2-8.4Q7.5-4 3.6 3z';

function Crab({ flipped = false, ...p }: CreatureProps & { flipped?: boolean }) {
  const red = organ('red');
  const legs = [0, 1, 2].flatMap((k) =>
    [-1, 1].map((sd) => {
      const d = flipped
        ? `M${sd * (7 + k * 2)} ${-2 - k}L${sd * (13 + k * 2.5)} ${-11 + k * 1.5}L${sd * (11 + k * 3.5)} ${-17 + k * 2}`
        : `M${sd * (8 + k * 1.5)} ${2 + k * 1.8}L${sd * (16 + k)} ${-2 + k * 3.5}L${sd * (19 + k * 0.5)} ${7 + k * 2.5}`;
      return <path key={`${k}${sd}`} d={d} />;
    }),
  );
  const arms = flipped ? 'M-10 2l-7 4 -3 1M10 2l7 4 3 1' : 'M-9-3l-6-7 -1-3M9-3l6-7 1-3';
  const claws = flipped
    ? [
        { x: -22, y: 6, r: -100 },
        { x: 22, y: 6, r: 100 },
      ]
    : [
        { x: -16, y: -13, r: -12 },
        { x: 16, y: -13, r: 12 },
      ];
  return (
    <Place {...p}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g stroke={EDGE} strokeWidth={4.2}>
          {legs}
          <path d={arms} />
        </g>
        <g stroke={red} strokeWidth={2.2}>
          {legs}
          <path d={arms} />
        </g>
      </g>
      {claws.map((c) => (
        <path
          key={c.x}
          transform={`translate(${c.x} ${c.y}) rotate(${c.r}) scale(${c.x < 0 ? -1.15 : 1.15} 1.15)`}
          d={CLAW}
          fill={red}
          stroke={EDGE}
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      ))}
      {!flipped && (
        <g>
          <path d="M-4-6l-1.5-7M4-6l1.5-7" stroke={EDGE} strokeWidth={1.4} strokeLinecap="round" />
          <circle cx={-5.5} cy={-14} r={2.8} fill={red} stroke={EDGE} strokeWidth={1.2} />
          <circle cx={5.5} cy={-14} r={2.8} fill={red} stroke={EDGE} strokeWidth={1.2} />
        </g>
      )}
      <ellipse rx={13} ry={8.5} fill={red} stroke={EDGE} strokeWidth={1.4} />
      {flipped ? (
        <>
          {/* Panza arriba: la placa del vientre y la cara, mareada, en ella. */}
          <path d="M-6 4.5q6 3 12 0l-2-8h-8z" fill={PAPER} fillOpacity={0.3} />
          <Eye x={-4} y={-3} mood="dizzy" s={0.9} />
          <Eye x={4} y={-3} mood="dizzy" s={0.9} />
          <path d="M-2.4 2.4q1.2-1 2.4 0t2.4 0" stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <Eye x={-5.5} y={-14} mood={p.mood} s={0.8} />
          <Eye x={5.5} y={-14} mood={p.mood} s={0.8} />
          <path d="M-3.5 0q3.5 4 7 0z" fill={EDGE} stroke={EDGE} strokeWidth={1} strokeLinejoin="round" />
        </>
      )}
    </Place>
  );
}

/** Ballena de perfil mirando a la izquierda, sobre la silueta del glifo. */
function Whale(p: CreatureProps) {
  const blue = organ('blue');
  return (
    <Place {...p}>
      <path d="M-10 7q2 11 13 12-3-7-5-12z" fill={blue} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <g transform="scale(2) translate(-24 -26)">
        <path
          d="M7 26c0-5.4 5-9.6 13-9.6 7.4 0 11.6 3.6 14.6 7.6 1.6-2.8 3.8-4.8 6.8-5.8-.4 3.8-1.6 6.6-3.8 8.6 1.6 2.2 2.8 4.4 3.4 7-3-.4-5.6-1.8-7.4-3.8C31 34 26 36.4 19 36.4 11.6 36.4 7 32 7 26z"
          fill={blue}
          stroke={EDGE}
          strokeWidth={0.7}
          strokeLinejoin="round"
        />
        <path d="M8.6 30.4c5 2.4 12 3 18 .8M9.8 32.8c4 1.8 9 2.2 13.6 1" stroke={PAPER} strokeOpacity={0.5} strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      <path d="M8 4q-3 8-9 10 1-6 3-10z" fill={blue} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <Eye x={-21} y={-3} mood={p.mood} s={1.1} />
      <path
        d={p.mood === 'joy' ? 'M-33 4q5 4 11 1' : 'M-33 6q5-3 10-1'}
        stroke={EDGE}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
      />
    </Place>
  );
}

/** Tortuga de perfil nadando hacia la izquierda. */
function Turtle(p: CreatureProps) {
  const green = organ('green');
  return (
    <Place {...p}>
      <g fill={green} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round">
        <path d="M11 4q9 4 12 11-8 0-13-6z" />
        <path d="M16-1l7 1-6 3z" />
        <circle cx={-21} cy={-3} r={5.6} />
        <path d="M-18-1h5v5h-5z" stroke="none" />
        <path d="M-8 5q-8 5-15 14 9-1 16-8z" />
      </g>
      <path d="M-17 2h34q-2 5-7 5h-20q-5 0-7-5z" fill={green} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M-17 2h34q-2 5-7 5h-20q-5 0-7-5z" fill={PAPER} fillOpacity={0.3} />
      <path d="M-16 2Q-15-15 0-15Q15-15 16 2z" fill={green} stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round" />
      <path
        d="M-5-9h10l3 5-3 5H-5l-3-5zM-5-9l-4-4M5-9l4-4M8-4h7M-8-4h-7M-5 1l-2 1M5 1l2 1"
        fill="none"
        stroke={EDGE}
        strokeOpacity={0.45}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <Eye x={-22.5} y={-4.5} mood={p.mood} s={0.8} />
      <path d={p.mood === 'joy' ? 'M-26-.5q2.5 2 5 .5' : 'M-26 .8q2.5-1.6 5-.3'} stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </Place>
  );
}

const SPIKES = Array.from({ length: 14 }, (_, k) => (k * 360) / 14 + 8);

/** Pez globo hinchado, o desinflado y aplastado contra la arena. */
function Puffer({ flat = false, ...p }: CreatureProps & { flat?: boolean }) {
  const yellow = organ('yellow');
  if (flat) {
    return (
      <Place {...p}>
        <path d="M-9-4l-2-3.5M-3-5.4l-.8-3.8M3-5.4l.8-3.8M9-4l2-3.5" stroke={EDGE} strokeWidth={1.3} strokeLinecap="round" />
        <path d="M14 1l8 4-3 5z" fill={yellow} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
        <path d="M-16 3C-15-4-7-6 1-5.5S14-2 16 2C11 7 4 8-3 8S-14 7-16 3z" fill={yellow} stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round" />
        <path d="M-12 5q10 3 22 0" stroke={PAPER} strokeOpacity={0.45} strokeWidth={1.3} fill="none" strokeLinecap="round" />
        <Eye x={-9} y={-0.5} mood={p.mood} s={0.9} />
        <path d="M-15.5 3.5q1.5-1.6 3.5-.6" stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </Place>
    );
  }
  return (
    <Place {...p}>
      <path d="M11 0l9-7v14z" fill={yellow} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      {SPIKES.map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M-2.2-11.5L0-17 2.2-11.5z" fill={yellow} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
      ))}
      <circle r={12.5} fill={yellow} stroke={EDGE} strokeWidth={1.4} />
      <path d="M-9 5a11 11 0 0 0 17 2" stroke={PAPER} strokeOpacity={0.5} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <path d="M2 2q4 5 9 2-4-4-9-2z" fill={yellow} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
      <Eye x={-5} y={-4} mood={p.mood} s={1.1} />
      <path d="M-11.5 2.5q2 2 4.5 0" stroke={EDGE} strokeWidth={1.3} fill="none" strokeLinecap="round" />
    </Place>
  );
}

/* --- el arrecife ----------------------------------------------------------- */

function Water({ dim = false }: { dim?: boolean }) {
  return (
    <g>
      <rect x={0} y={SURFACE} width={320} height={GROUND - SURFACE} fill={dim ? FAINT : LINE} fillOpacity={dim ? 0.22 : 0.35} />
      <path d={`M0 ${SURFACE}q10-4 20 0t20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0 20 0`} stroke={SOFT} strokeWidth={1.4} fill="none" />
    </g>
  );
}

function Sand({ bleached = false }: { bleached?: boolean }) {
  return (
    <g>
      <path d={`M0 ${GROUND}q40-4 80 0t80 0 80 0 80 0V160H0z`} fill={LINE} fillOpacity={0.7} />
      <path d={`M0 ${GROUND}q40-4 80 0t80 0 80 0 80 0`} stroke={SOFT} strokeWidth={1.5} fill="none" />
      <g fill={SOFT} fillOpacity={0.35}>
        {[18, 64, 112, 150, 196, 238, 282, 306].map((x, k) => (
          <circle key={x} cx={x} cy={134 + (k % 3) * 7} r={1.2} />
        ))}
      </g>
      {!bleached && (
        <path d="M252 138l2 4 4 .4-3 2.8.8 4.2-3.8-2-3.8 2 .8-4.2-3-2.8 4-.4z" fill={WARM} fillOpacity={0.35} stroke={SOFT} strokeWidth={1} strokeLinejoin="round" />
      )}
    </g>
  );
}

/** Coral ramificado: vivo lleva un calor tenue, blanqueado queda en hueso. */
function Coral({ x, s = 1, bleached = false, broken = false }: { x: number; s?: number; bleached?: boolean; broken?: boolean }) {
  const d = broken ? 'M0 0v-14l-8-8v-6M0-14l7-6M-8-22l-5-3' : 'M0 0v-14l-8-8v-10M-8-22l-6-5v-6M0-14l8-8v-12M8-22l6-4v-5M0-6l5-5';
  return (
    <g transform={`translate(${x} ${GROUND + 1}) scale(${s})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={SOFT} strokeWidth={6.4} strokeOpacity={bleached ? 0.55 : 0.7} />
      <path d={d} stroke={bleached ? CARD : WARM} strokeOpacity={bleached ? 1 : 0.55} strokeWidth={4} />
      {bleached || <path d={d} stroke={CARD} strokeOpacity={0.35} strokeWidth={4} />}
    </g>
  );
}

function BrainCoral({ x, w, bleached = false }: { x: number; w: number; bleached?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${GROUND + 1}a${w / 2} ${w / 2.6} 0 0 1 ${w} 0z`} fill={bleached ? CARD : FAINT} fillOpacity={bleached ? 0.9 : 0.45} stroke={SOFT} strokeWidth={1.2} />
      <path
        d={`M${x + w * 0.2} ${GROUND - 2}q${w * 0.1} -${w * 0.2} ${w * 0.2} 0t${w * 0.2} 0 ${w * 0.2} 0`}
        stroke={SOFT}
        strokeOpacity={0.6}
        strokeWidth={1.1}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Seaweed({ x, h, className, i = 0, wilted = false }: { x: number; h: number; className?: string; i?: number; wilted?: boolean }) {
  const d = wilted
    ? `M${x} ${GROUND + 1}q2-${h * 0.12} ${h * 0.14}-${h * 0.1}t${h * 0.16} ${h * 0.06}`
    : `M${x} ${GROUND + 1}q-5-${h * 0.25} 0-${h * 0.5}t0-${h * 0.5}`;
  return (
    <g className={className} style={delay(i)}>
      <path d={d} stroke={SOFT} strokeWidth={wilted ? 3.4 : 4.6} strokeOpacity={0.5} fill="none" strokeLinecap="round" />
      <path d={d} stroke={wilted ? FAINT : LINE} strokeWidth={wilted ? 1.8 : 2.8} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Bubble({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={CARD} fillOpacity={0.35} stroke={SOFT} strokeWidth={1.1} />
      <path d={`M${x - r * 0.5} ${y - r * 0.1}a${r * 0.5} ${r * 0.5} 0 0 1 ${r * 0.4}-${r * 0.4}`} stroke={SOFT} strokeWidth={0.9} fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Pez de fondo, a linea: ambiente, no carta. */
function SmallFish({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-6 0c2-3 5-4 8-4s5 2 6 4c-1 2-3 4-6 4s-6-1-8-4zM8 0l4-3v6z"
      fill={FAINT}
      fillOpacity={0.45}
      stroke={SOFT}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

export function ArrecifeWin() {
  return (
    <Scene>
      <Water />
      {/* Rayos de sol desde la superficie: la luz calida de la victoria. */}
      <path className="story-sway" d="M70 22 42 126h30l18-104z" fill={WARM} fillOpacity={0.14} />
      <path d="M150 22 136 126h28l6-104z" fill={WARM} fillOpacity={0.1} />
      <path d="M240 22l10 104h28l-18-104z" fill={WARM} fillOpacity={0.13} />
      <Sparkle x={206} y={12} r={5} i={2} />

      <SmallFish x={44} y={54} s={0.9} />
      <SmallFish x={58} y={62} s={0.7} />
      <SmallFish x={286} y={46} s={0.8} />

      <Sand />
      <Seaweed className="story-sway" i={0} x={30} h={62} />
      <Coral x={52} s={1.1} />
      <BrainCoral x={4} w={26} />
      <Seaweed className="story-sway" i={2} x={296} h={70} />
      <Coral x={272} s={1.25} />
      <BrainCoral x={226} w={30} />

      <Whale x={160} y={52} s={1.05} mood="joy" />
      <g className="story-float" style={delay(1)}>
        <Bubble x={143} y={16} r={2.6} />
        <Bubble x={150} y={26} r={2} />
        <Bubble x={122} y={70} r={2.4} />
        <Bubble x={210} y={60} r={3} />
      </g>
      <Puffer className="story-bob" i={0} x={100} y={86} s={1.05} mood="joy" />
      <Turtle x={226} y={90} s={1.15} rot={-8} mood="joy" />
      <Crab x={162} y={114} s={1.05} mood="joy" />
    </Scene>
  );
}

/** Red de pesca: cuerdas cruzadas sobre un ovalo, sin recorte. */
function Net({ x, y, rx, ry }: { x: number; y: number; rx: number; ry: number }) {
  const R = 10;
  const chords = [-8, -4, 0, 4, 8].map((d) => {
    const h = Math.sqrt(R * R - d * d);
    return `M${d} ${-h.toFixed(2)}V${h.toFixed(2)}`;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${rx / R} ${ry / R})`} fill="none" stroke={SOFT} strokeLinecap="round">
      <g transform="rotate(40)" strokeWidth={0.16}>
        <path d={chords.join('')} />
      </g>
      <g transform="rotate(-40)" strokeWidth={0.16}>
        <path d={chords.join('')} />
      </g>
      <circle r={R} strokeWidth={0.2} strokeDasharray="1.2 0.8" />
    </g>
  );
}

export function ArrecifeLose() {
  const yellow = organ('yellow');
  return (
    <Scene>
      <Water dim />

      {/* El barco del rival, en neutro: de el sale el vertido y el sedal. */}
      <g stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round">
        <path d="M92 8h14v-6h10v6h6l-3 6H92z" fill={SOFT} fillOpacity={0.6} />
        <path d="M76 14h60l-7 10H84z" fill={SOFT} />
      </g>
      <path d="M100 20C96 50 90 80 88 96" stroke={FAINT} strokeWidth={1} fill="none" />
      <path
        d="M70 22h150q10 0 12 4t-10 6q-14 2-30 1-8 6-12 1-20 3-40 0-6 5-10 0-30 2-50-4-12-2-10-8z"
        fill={EDGE}
        fillOpacity={0.55}
        stroke={SOFT}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path d="M104 27q20 3 44 0M170 29q16 2 34-1" stroke={SOFT} strokeOpacity={0.6} strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <path className="story-drop" style={delay(2)} d="M176 36q-2 4 0 5t0-5z" fill={EDGE} fillOpacity={0.55} stroke={SOFT} strokeWidth={0.9} />

      <Sand bleached />
      <Seaweed x={30} h={52} wilted />
      <Coral x={54} s={1.1} bleached broken />
      <BrainCoral x={4} w={26} bleached />
      <Seaweed x={294} h={56} wilted />
      <Coral x={272} s={1.25} bleached broken />
      <BrainCoral x={226} w={30} bleached />
      <path d="M74 126l6-3M312 127l-7-2" stroke={SOFT} strokeWidth={3} strokeLinecap="round" />

      {/* Lata oxidada en la arena. */}
      <g transform="rotate(-70 212 121)">
        <rect x={205} y={114} width={14} height={9} rx={1.5} fill={FAINT} fillOpacity={0.6} stroke={SOFT} strokeWidth={1.2} />
        <path d="M205 117h14M205 120h14" stroke={SOFT} strokeWidth={1} strokeOpacity={0.7} />
      </g>

      {/* El anzuelo, rojo como el cangrejo al que amenaza. */}
      <path d="M88 92v8a5 5 0 0 1-10 0v-4l3 3" stroke={organ('red')} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={88} cy={92} r={1.8} fill="none" stroke={organ('red')} strokeWidth={1.2} />

      <Whale className="story-sink" i={0} x={160} y={104} s={1.05} rot={6} mood="sad" />
      {/* Manchas de crudo en el lomo de la ballena. */}
      <g fill={EDGE} fillOpacity={0.5}>
        <ellipse cx={150} cy={89} rx={5} ry={2.4} transform="rotate(4 150 89)" />
        <ellipse cx={170} cy={91} rx={3.4} ry={1.8} transform="rotate(8 170 91)" />
        <path d="M147 90q-1 4 1 5 2-1 1-5z" />
      </g>
      <Turtle x={258} y={70} s={1.1} rot={14} mood="sad" />
      <Net x={256} y={68} rx={27} ry={20} />
      <path d="M270 50C280 40 286 30 290 22" stroke={SOFT} strokeWidth={1.1} fill="none" strokeDasharray="3 2" />
      <circle cx={290} cy={22} r={3} fill={FAINT} stroke={SOFT} strokeWidth={1.1} />

      <Crab flipped x={82} y={118} s={1} rot={-6} mood="dizzy" />
      <Dizzy x={82} y={108} i={0} />

      <Puffer flat x={30} y={118} s={1.05} mood="sad" />
      {/* La bolsa de plastico, amarilla como el pez globo, a la deriva. */}
      <g className="story-float" style={delay(1)}>
        <path
          d="M34 76q-2-8 3-8M46 76q2-8-3-8M31 76h18q2 10-3 18-6 3-12 0-5-8-3-18z"
          fill={yellow}
          fillOpacity={0.18}
          stroke={yellow}
          strokeWidth={1.3}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>

      <Bubble x={236} y={96} r={2} />
    </Scene>
  );
}

export const scenes = { win: ArrecifeWin, lose: ArrecifeLose };

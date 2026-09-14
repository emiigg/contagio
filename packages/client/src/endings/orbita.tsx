import type { ReactNode } from 'react';

import {
  CARD,
  EDGE,
  FAINT,
  Figure,
  INK,
  LINE,
  PAPER,
  Puff,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  delay,
  organ,
  star,
  type Joints,
  type Pose,
} from './kit';

/*
 * Orbita. Una estacion espacial sobre la curva de la Tierra. Los cuatro
 * modulos son los personajes, cada uno del color de su carta, con una carita
 * de leds; el nucleo, la viga y el astronauta son neutros. La plaga aqui son
 * averias y un meteorito, que no tiene color de modulo porque no ataca a uno
 * en concreto.
 */

type Mood = 'win' | 'lose';
const AXIS = 68;

/** Estrellas del fondo: x, y, radio. Pocas y lejos de los modulos. */
const STARS: [number, number, number][] = [
  [8, 14, 1],
  [70, 10, 1.2],
  [96, 36, 1],
  [128, 14, 1],
  [150, 30, 1.2],
  [238, 12, 1],
  [262, 40, 1],
  [312, 60, 1.1],
  [6, 112, 1],
  [70, 108, 1.1],
  [250, 104, 1],
  [312, 100, 1],
];

function Sky() {
  return (
    <g>
      {STARS.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={SOFT} fillOpacity={0.7} />
      ))}
      <path d={star(116, 26, 3)} fill={SOFT} fillOpacity={0.6} />
      <path d={star(300, 84, 2.6)} fill={SOFT} fillOpacity={0.6} />
    </g>
  );
}

/** La curva de la Tierra: un circulo enorme del que solo asoma el casquete. */
function Earth({ dim = false }: { dim?: boolean }) {
  return (
    <g>
      {!dim && <circle cx={160} cy={480} r={362} fill="none" stroke={WARM} strokeOpacity={0.35} strokeWidth={4} />}
      <circle cx={160} cy={480} r={356} fill={LINE} fillOpacity={dim ? 0.4 : 0.6} stroke={SOFT} strokeWidth={1.5} />
      <g fill={FAINT} fillOpacity={dim ? 0.3 : 0.45}>
        <path d="M96 138q8-8 22-6t20 6q4 6-6 8t-18 4q-12 2-18-4t0-8z" />
        <path d="M176 132q10-6 24-2t12 8q-4 6-16 5t-18-4q-6-3-2-7z" />
        <path d="M236 150q8-5 18-2t4 6q-8 4-16 2t-6-6z" />
        <path d="M40 154q8-4 16-2t2 5q-8 2-18-3z" />
      </g>
    </g>
  );
}

/* --- caras ---------------------------------------------------------------- */

function Face({ x, y, w = 16, h = 10, color, mood }: { x: number; y: number; w?: number; h?: number; color: string; mood: Mood }) {
  const ex = w * 0.24;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={2.5} fill={PAPER} stroke={EDGE} strokeWidth={1.2} />
      {mood === 'win' ? (
        <>
          <path d={`M${x - ex - 1.9} ${y - 0.4}q1.9-2.8 3.8 0M${x + ex - 1.9} ${y - 0.4}q1.9-2.8 3.8 0`} stroke={color} strokeWidth={2} />
          <path d={`M${x - 2.6} ${y + 1.6}q2.6 2.6 5.2 0`} stroke={INK} strokeWidth={1.2} />
        </>
      ) : (
        <>
          <path d={`M${x - ex - 1.5} ${y - 2.6}l3 3m0-3l-3 3M${x + ex - 1.5} ${y - 2.6}l3 3m0-3l-3 3`} stroke={INK} strokeWidth={1.2} />
          <path d={`M${x - 2.6} ${y + 3.4}q2.6-2.4 5.2 0`} stroke={INK} strokeWidth={1.2} />
        </>
      )}
    </g>
  );
}

/* --- piezas de la estacion, dibujadas alrededor de (0, 0) ------------------ */

/** Viga con su celosia, de x0 a x1 sobre el eje. */
function Truss({ x0, x1 }: { x0: number; x1: number }) {
  const zig = [];
  for (let x = x0; x < x1 - 4; x += 8) zig.push(`M${x} ${AXIS - 3}L${x + 4} ${AXIS + 3}L${x + 8} ${AXIS - 3}`);
  return (
    <g>
      <rect x={x0} y={AXIS - 3} width={x1 - x0} height={6} fill={LINE} stroke={SOFT} strokeWidth={1.2} />
      <path d={zig.join('')} fill="none" stroke={SOFT} strokeWidth={0.9} />
    </g>
  );
}

function SolarPanel({ mood }: { mood: Mood }) {
  const c = organ('yellow');
  const win = mood === 'win';
  // Al perder le falta la esquina de abajo: el meteorito se la llevo.
  const outline = win ? 'M-32 -34H-6V34H-32Z' : 'M-32 -34H-6V34H-18l-4-6-5 3-5-7Z';
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-6 0H4" stroke={EDGE} strokeWidth={3} />
      <path d={outline} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <path d="M-19 -34V34M-32 -22.7H-6M-32 -11.3H-6M-32 11.3H-6M-32 22.7H-6" fill="none" stroke={PAPER} strokeOpacity={0.55} strokeWidth={1} />
      {!win && <path d="M-30 -30l6 8-3 5M-10 16l-4 6" fill="none" stroke={EDGE} strokeWidth={1.1} />}
      <Face x={-19} y={0} w={20} h={11} color={c} mood={mood} />
    </g>
  );
}

function Reactor({ mood }: { mood: Mood }) {
  const c = organ('red');
  const win = mood === 'win';
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={0} cy={0} rx={24} ry={8} transform="rotate(-28)" stroke={EDGE} strokeWidth={1.5} />
      {win ? (
        <ellipse cx={0} cy={0} rx={24} ry={8} transform="rotate(28)" stroke={EDGE} strokeWidth={1.5} />
      ) : (
        <path d="M-21 -4a24 8 0 0 1 20 -6" transform="rotate(28)" stroke={EDGE} strokeWidth={1.5} />
      )}
      <circle cx={0} cy={0} r={15} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <path d="M-9 -9a12 12 0 0 1 8-4" stroke={PAPER} strokeOpacity={0.6} strokeWidth={1.6} />
      {!win && <path d="M7 -13l-2 5 4 2-3 4" stroke={EDGE} strokeWidth={1.2} />}
      <Face x={0} y={1.5} w={17} h={10} color={c} mood={mood} />
    </g>
  );
}

function LifeSupport({ mood }: { mood: Mood }) {
  const c = organ('blue');
  const win = mood === 'win';
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <rect x={-3.5} y={-26} width={7} height={7} fill={CARD} stroke={EDGE} strokeWidth={1.2} />
      {/* La llave de paso: al perder se ha soltado y flota aparte. */}
      {win && <path d="M0 -26v-3M-7 -29h14" fill="none" stroke={EDGE} strokeWidth={2} />}
      <rect x={-13} y={-20} width={26} height={42} rx={12} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <path d="M-13 10H13" stroke={EDGE} strokeWidth={1.2} />
      <path d="M-8 -12v6" stroke={PAPER} strokeOpacity={0.6} strokeWidth={1.6} />
      {!win && <path d="M13 -8l-4 3 3 3-3 3" fill="none" stroke={EDGE} strokeWidth={1.2} />}
      <Face x={0} y={-1} w={18} h={10} color={c} mood={mood} />
    </g>
  );
}

function Greenhouse({ mood }: { mood: Mood }) {
  const c = organ('green');
  const win = mood === 'win';
  // La planta de dentro: erguida al ganar, mustia al perder.
  const plant = win
    ? 'M20 -2V-14M20 -9c-4.5 0-7-2.4-7-6 4.5 0 7 2.2 7 6zM20 -12c0-4 2.6-6.4 7-6.4 0 3.8-2.8 6.4-7 6.4z'
    : 'M20 -2V-9q0-3-3-4M20 -6c-4 1-7.5 0-8.5-3 4-1.2 7 0 8.5 3zM20 -7c2.4-2 5.5-2 7.5 .6-2.6 2-5.6 1.8-7.5-.6z';
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-4 5H2" stroke={EDGE} strokeWidth={3} />
      <path d={win ? 'M2 -2a18 18 0 0 1 36 0Z' : 'M2 -2a18 18 0 0 1 20-17.9l-2 7 5 4-3 7Z'} fill={c} fillOpacity={0.3} stroke={EDGE} strokeWidth={1.4} />
      {!win && <path d="M22 -19.9A18 18 0 0 1 38 -2H25" fill="none" stroke={EDGE} strokeWidth={1.4} strokeDasharray="2 3" />}
      <path d="M11 -2a12 18 0 0 1 9-17.8" fill="none" stroke={PAPER} strokeOpacity={0.6} strokeWidth={1} />
      <path d={plant} fill={c} stroke={EDGE} strokeWidth={1.1} />
      <rect x={0} y={-2} width={40} height={13} rx={2.5} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <Face x={20} y={4.5} w={20} h={9} color={c} mood={mood} />
    </g>
  );
}

/** Nucleo neutro de la estacion, con las ventanas encendidas si todo va bien. */
function Hub({ lit }: { lit: boolean }) {
  return (
    <g strokeLinejoin="round">
      <rect x={-6} y={-17} width={12} height={6} rx={1} fill={CARD} stroke={EDGE} strokeWidth={1.2} />
      <rect x={-16} y={-11} width={32} height={22} rx={6} fill={CARD} stroke={EDGE} strokeWidth={1.4} />
      {[-8, 0, 8].map((x) => (
        <circle key={x} cx={x} cy={0} r={2.6} fill={lit ? WARM : FAINT} fillOpacity={lit ? 0.85 : 0.4} stroke={EDGE} strokeWidth={0.8} />
      ))}
    </g>
  );
}

function At({ x, y, rot = 0, children }: { x: number; y: number; rot?: number; children: ReactNode }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>{children}</g>;
}

/* --- astronauta ---------------------------------------------------------- */

function Helmet({ j, lit }: { j: Joints; lit: boolean }) {
  const { head: h } = j;
  return (
    <>
      <circle cx={h.x} cy={h.y} r={8.4} fill={CARD} fillOpacity={0.35} stroke={EDGE} strokeWidth={1.3} />
      <path d={`M${h.x - 4.5} ${h.y - 1.5}a5 4 0 0 1 9 0v1.5a4.5 3 0 0 1-9 0z`} fill={lit ? WARM : FAINT} fillOpacity={lit ? 0.85 : 0.6} stroke={EDGE} strokeWidth={0.9} />
    </>
  );
}

function Backpack({ j }: { j: Joints }) {
  const a = { x: j.sL.x - j.side.x * 2.5, y: j.sL.y - j.side.y * 2.5 };
  const b = { x: j.hL.x - j.side.x * 2.5, y: j.hL.y - j.side.y * 2.5 };
  const d = `M${a.x} ${a.y}L${b.x} ${b.y}`;
  return (
    <>
      <path d={d} stroke={EDGE} strokeWidth={10} strokeLinecap="round" />
      <path d={d} stroke={CARD} strokeWidth={7.6} strokeLinecap="round" />
    </>
  );
}

const WAVE: Pose = { head: 10, armL: [-50, -20], armR: [150, 175], legL: [-18, -4], legR: [22, 34] };
const TUMBLE: Pose = { head: -15, armL: [-120, -150], armR: [110, 80], legL: [-30, 5], legR: [35, 60] };
const SUIT = { head: 7, shoulders: 14, hips: 11 };

/* --- escenas -------------------------------------------------------------- */

export function OrbitaWin() {
  return (
    <Scene>
      <Sky />
      <g className="story-glow">
        <circle cx={292} cy={24} r={16} fill={WARM} fillOpacity={0.15} />
      </g>
      <circle cx={292} cy={24} r={9} fill={WARM} fillOpacity={0.85} />
      <Earth />

      <Truss x0={56} x1={262} />
      <At x={52} y={AXIS}>
        <SolarPanel mood="win" />
      </At>
      <At x={104} y={AXIS}>
        <Reactor mood="win" />
      </At>
      <At x={160} y={AXIS}>
        <Hub lit />
      </At>
      <At x={214} y={AXIS}>
        <LifeSupport mood="win" />
      </At>
      <At x={262} y={AXIS}>
        <Greenhouse mood="win" />
      </At>

      {/* El cable de seguridad sale del nucleo y llega a la cintura. */}
      <path d="M160 51C158 40 150 42 141 38" fill="none" stroke={SOFT} strokeWidth={1.4} strokeLinecap="round" />
      <Figure
        className="story-float"
        x={140}
        y={38}
        s={0.74}
        rot={14}
        pose={WAVE}
        build={SUIT}
        color={SOFT}
        behind={(j) => <Backpack j={j} />}
        front={(j) => <Helmet j={j} lit />}
      />

      <Sparkle x={72} y={20} r={5} i={0} />
      <Sparkle x={246} y={30} r={4} i={2} />
      <path d={star(140, 104, 3.5)} fill={WARM} />
      <path d={star(30, 118, 3)} fill={WARM} fillOpacity={0.8} />
    </Scene>
  );
}

/** Escombro que flota: un trozo de chapa neutro. */
function Shard({ x, y, d, i }: { x: number; y: number; d: string; i: number }) {
  return (
    <g className="story-float" style={delay(i)}>
      <path transform={`translate(${x} ${y})`} d={d} fill={LINE} stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round" />
    </g>
  );
}

export function OrbitaLose() {
  return (
    <Scene>
      <Sky />
      <Earth dim />

      {/* La estacion del rival sigue entera, pequena y lejos. */}
      <g fill={SOFT} fillOpacity={0.55} stroke={SOFT} strokeWidth={1} strokeLinejoin="round">
        <path d="M118 20h26" fill="none" />
        <rect x={112} y={15} width={6} height={10} />
        <rect x={144} y={15} width={6} height={10} />
        <rect x={126} y={17} width={10} height={6} rx={2} />
      </g>
      <circle cx={131} cy={20} r={1.2} fill={WARM} />

      {/* Mitad izquierda, a la deriva hacia abajo. */}
      <g transform="rotate(-10 110 68) translate(-6 10)">
        <Truss x0={56} x1={146} />
        <path d="M150 57H158l-3 4 4 4-3 4 3 4-4 4H150a6 6 0 0 1-6-6V63a6 6 0 0 1 6-6z" fill={CARD} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
        <circle cx={151} cy={68} r={2.6} fill={FAINT} fillOpacity={0.4} stroke={EDGE} strokeWidth={0.8} />
        <Sparkle x={162} y={62} r={4.5} i={1} />
        <At x={52} y={AXIS}>
          <SolarPanel mood="lose" />
        </At>
        <At x={104} y={AXIS}>
          <Reactor mood="lose" />
        </At>
      </g>
      <Puff x={108} y={60} r={6} i={0} />

      {/* Mitad derecha, girando hacia arriba. */}
      <g transform="rotate(12 200 68) translate(6 -4)">
        <Truss x0={174} x1={262} />
        <path d="M170 57H162l3 4-4 4 3 4-3 4 4 4H170a6 6 0 0 0 6-6V63a6 6 0 0 0-6-6z" fill={CARD} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
        <circle cx={169} cy={68} r={2.6} fill={FAINT} fillOpacity={0.4} stroke={EDGE} strokeWidth={0.8} />
        <path d={star(158, 76, 3)} fill={WARM} />
        <At x={214} y={AXIS}>
          <LifeSupport mood="lose" />
        </At>
        <At x={262} y={AXIS}>
          <Greenhouse mood="lose" />
        </At>
      </g>

      <Shard x={126} y={104} d="M0 0l7-2 3 5-6 3z" i={0} />
      <Shard x={124} y={36} d="M0 0l5 1-1 5-5-2z" i={2} />
      {/* La llave de paso del soporte vital, suelta. */}
      <path transform="rotate(-30 190 40)" d="M184 40h12M190 40v4" fill="none" stroke={EDGE} strokeWidth={2} strokeLinecap="round" />

      {/* El meteorito ya ha pasado: su estela sale del hueco de la estacion. */}
      <path d="M156 60L200 104M164 64L206 100M150 70L190 108" fill="none" stroke={SOFT} strokeOpacity={0.6} strokeWidth={1.2} strokeDasharray="5 4" strokeLinecap="round" />
      <g strokeLinejoin="round">
        <path d="M203 104c3-6 11-8 16-4 5 3 5 11 0 14-5 4-13 3-16-2-2-3-2-6 0-8z" fill={FAINT} stroke={EDGE} strokeWidth={1.4} />
        <circle cx={209} cy={107} r={2.4} fill={LINE} stroke={EDGE} strokeWidth={0.8} />
        <circle cx={215} cy={103} r={1.6} fill={LINE} stroke={EDGE} strokeWidth={0.8} />
      </g>

      {/* El astronauta se aleja con el cable cortado. */}
      <path d="M172 54q-2-8 4-12" fill="none" stroke={SOFT} strokeWidth={1.4} strokeLinecap="round" />
      <Figure
        className="story-float"
        i={1}
        x={258}
        y={36}
        s={0.62}
        rot={40}
        pose={TUMBLE}
        build={SUIT}
        color={SOFT}
        behind={(j) => (
          <>
            <Backpack j={j} />
            <path d={`M${j.hip.x} ${j.hip.y}q-6 10-16 9`} fill="none" stroke={SOFT} strokeWidth={2} strokeLinecap="round" />
          </>
        )}
        front={(j) => <Helmet j={j} lit={false} />}
      />
    </Scene>
  );
}

export const scenes = { win: OrbitaWin, lose: OrbitaLose };

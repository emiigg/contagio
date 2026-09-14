import type { ReactNode } from 'react';

import {
  CARD,
  DANGER,
  EDGE,
  FAINT,
  Figure,
  INK,
  LINE,
  PAPER,
  POSES,
  Puff,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  delay,
  organ,
  star,
  type Joints,
} from './kit';

/*
 * Cortafuegos. La mesa es una sala de servidores: los cuatro componentes son
 * los personajes, cada uno del color de su carta, con una carita de leds que
 * se encienden en su propio color. Al perder, cada uno lleva encima un bicho
 * de malware de su mismo color, que es el que le ha tocado en la mesa.
 */

const GROUND = 126;
type Mood = 'win' | 'lose';

/* --- piezas de la sala ------------------------------------------------------ */

/** Armarios del fondo: x, ancho, alto. El hueco del centro es para el escudo. */
const RACKS: [number, number, number][] = [
  [66, 30, 84],
  [98, 30, 92],
  [226, 30, 92],
  [258, 26, 78],
  [286, 32, 96],
];

function Rack({ x, w, h, lit, fade = false }: { x: number; w: number; h: number; lit: (k: number) => boolean; fade?: boolean }) {
  const top = GROUND - h;
  const leds = [];
  let k = 0;
  for (let y = top + 7; y < GROUND - 8; y += 7) {
    k++;
    leds.push(<path key={`u${k}`} d={`M${x + 3} ${y + 3.5}H${x + w - 3}`} stroke={PAPER} strokeOpacity={0.45} strokeWidth={0.8} />);
    for (let lx = x + 5; lx < x + w - 9; lx += 5) {
      k++;
      leds.push(<rect key={k} x={lx} y={y - 1} width={2.4} height={2} fill={lit(k) ? WARM : PAPER} fillOpacity={lit(k) ? 0.8 : 0.45} />);
    }
  }
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={1.5} fill={fade ? FAINT : LINE} fillOpacity={fade ? 0.3 : 0.7} />
      {leds}
    </g>
  );
}

function Floor() {
  return (
    <g>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d="M0 143H320M40 126v34M104 126v34M168 126v34M232 126v34M296 126v34" stroke={FAINT} strokeOpacity={0.5} strokeWidth={1} />
    </g>
  );
}

/** Mesa de la persona de sistemas con su monitor; lo que se ve en pantalla lo decide la escena. */
function Desk({ screen }: { screen: ReactNode }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 104V126M56 104V126" stroke={SOFT} strokeWidth={2} />
      <rect x={4} y={100} width={56} height={4} rx={1} fill={LINE} stroke={SOFT} strokeWidth={1.2} />
      <path d="M24 92v8M17 100h14" stroke={EDGE} strokeWidth={1.6} />
      <rect x={6} y={60} width={36} height={32} rx={2.5} fill={CARD} stroke={EDGE} strokeWidth={1.4} />
      {screen}
      <rect x={34} y={96.8} width={22} height={3.2} rx={1} fill={CARD} stroke={EDGE} strokeWidth={1.1} />
    </g>
  );
}

/* --- caras y brazos de los componentes -------------------------------------- */

function Face({ x, y, w = 16, h = 11, color, mood }: { x: number; y: number; w?: number; h?: number; color: string; mood: Mood }) {
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
          <path
            d={`M${x - ex - 1.5} ${y - 2.6}l3 3m0-3l-3 3M${x + ex - 1.5} ${y - 2.6}l3 3m0-3l-3 3`}
            stroke={INK}
            strokeWidth={1.2}
          />
          <path d={`M${x - 2.6} ${y + 3.4}q2.6-2.4 5.2 0`} stroke={INK} strokeWidth={1.2} />
        </>
      )}
    </g>
  );
}

/** Brazo de palo con contorno, del color del componente. */
function Arm({ x, y, dx, dy, color }: { x: number; y: number; dx: number; dy: number; color: string }) {
  const d = `M${x} ${y}q${dx * 0.2} ${dy * 0.7} ${dx} ${dy}`;
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={EDGE} strokeWidth={3.8} />
      <path d={d} stroke={color} strokeWidth={1.8} />
      <circle cx={x + dx} cy={y + dy} r={2.3} fill={color} stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

type Vec = [number, number];

/**
 * Los dos brazos a la vez: arriba al ganar, colgando al perder. Un componente
 * tumbado pasa `limp` con sus propios vectores, en coordenadas del dibujo, para
 * que ningun brazo se hunda en el suelo.
 */
function Arms({ half, y, color, mood, limp }: { half: number; y: number; color: string; mood: Mood; limp?: [Vec, Vec] }) {
  const [dx, dy] = mood === 'win' ? [6, -11] : [2.5, 9];
  const [l, r] = limp ?? [
    [-dx, dy],
    [dx, dy],
  ];
  return (
    <>
      <Arm x={-half} y={y} dx={l[0]} dy={l[1]} color={color} />
      <Arm x={half} y={y} dx={r[0]} dy={r[1]} color={color} />
    </>
  );
}

/* --- los cuatro componentes: dibujados con la base en (0, 0) -------------- */

function Chip({ mood }: { mood: Mood }) {
  const c = organ('red');
  const pins = [-8, 0, 8];
  return (
    <g>
      <g stroke={EDGE} strokeWidth={2} strokeLinecap="round">
        {pins.map((p) => (
          <path key={p} d={`M${p} -34v-5M${p} -6v6`} />
        ))}
        <path d="M-14 -28h-5M-14 -12h-5M14 -28h5M14 -12h5" />
      </g>
      <Arms half={17} y={-20} color={c} mood={mood} />
      <rect x={-14} y={-34} width={28} height={28} rx={3} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <circle cx={-10} cy={-30} r={1.3} fill={PAPER} fillOpacity={0.8} />
      <Face x={0} y={-20} w={17} h={13} color={c} mood={mood} />
    </g>
  );
}

function Database({ mood, limp }: { mood: Mood; limp?: [Vec, Vec] }) {
  const c = organ('blue');
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-6 -5v5M6 -5v5" stroke={EDGE} strokeWidth={3} />
      <Arms half={14} y={-24} color={c} mood={mood} limp={limp} />
      <path d="M-14 -40V-7a14 4.5 0 0 0 28 0V-40" fill={c} stroke={EDGE} strokeWidth={1.5} />
      <ellipse cx={0} cy={-40} rx={14} ry={4.5} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <ellipse cx={0} cy={-40} rx={9} ry={2.4} fill={PAPER} fillOpacity={0.3} />
      <path d="M-14 -31a14 4.5 0 0 0 28 0M-14 -12a14 4.5 0 0 0 28 0" fill="none" stroke={EDGE} strokeWidth={1.2} />
      <Face x={0} y={-20.5} w={17} h={10} color={c} mood={mood} />
    </g>
  );
}

function Router({ mood }: { mood: Mood }) {
  const c = organ('green');
  const win = mood === 'win';
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-11 -4v4M11 -4v4" stroke={EDGE} strokeWidth={3} />
      {/* Al perder una antena queda doblada: ya no hay senal. */}
      <path d={win ? 'M-12 -22l-3 -17' : 'M-12 -22l-2 -9 -8 -4'} fill="none" stroke={EDGE} strokeWidth={2.2} />
      <path d="M12 -22l3 -17" fill="none" stroke={EDGE} strokeWidth={2.2} />
      <circle cx={win ? -15 : -22} cy={win ? -39 : -35} r={2.2} fill={c} stroke={EDGE} strokeWidth={1} />
      <circle cx={15} cy={-39} r={2.2} fill={c} stroke={EDGE} strokeWidth={1} />
      <Arms half={19} y={-13} color={c} mood={mood} />
      <rect x={-19} y={-23} width={38} height={19} rx={3.5} fill={c} stroke={EDGE} strokeWidth={1.5} />
      <Face x={0} y={-13.5} w={20} h={11} color={c} mood={mood} />
    </g>
  );
}

function Plug({ mood, limp }: { mood: Mood; limp?: [Vec, Vec] }) {
  const c = organ('yellow');
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-5 -36v-8M5 -36v-8" stroke={EDGE} strokeWidth={3.6} />
      <path d="M-5 -37v-6M5 -37v-6" stroke={CARD} strokeWidth={1.4} />
      <Arms half={13} y={-27} color={c} mood={mood} limp={limp} />
      <path d="M-13 -36H13V-26A13 13 0 0 1 -13 -26Z" fill={c} stroke={EDGE} strokeWidth={1.5} />
      <Face x={0} y={-29} w={18} h={10} color={c} mood={mood} />
      <path transform="translate(0 -18.5)" d="M1.2-3.6-2 .5h2.2L-1.2 3.8 2.2-.7H0l1.2-2.9z" fill={PAPER} stroke={EDGE} strokeWidth={0.8} />
    </g>
  );
}

/** Bicho de malware. Va del color del componente que ataca. */
function Bug({ x, y, rot = 0, color }: { x: number; y: number; rot?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M-4 -2l-5 -3M-4.6 1.5h-6M-4 5l-4.5 4M4 -2l5 -3M4.6 1.5h6M4 5l4.5 4M-1.6 -8.6l-2.4 -3.4M1.6 -8.6l2.4 -3.4"
        stroke={EDGE}
        strokeWidth={1.4}
        fill="none"
      />
      <ellipse cx={0} cy={2} rx={5.2} ry={6.6} fill={color} stroke={EDGE} strokeWidth={1.4} />
      <path d="M0 -3.6v11.6" stroke={EDGE} strokeWidth={1} />
      <circle cx={0} cy={-6.4} r={3.4} fill={EDGE} />
      <path d="M-2.2 -7.2l1.6 .8M2.2 -7.2l-1.6 .8" stroke={color} strokeWidth={1.2} />
    </g>
  );
}

/** Coloca un componente: el giro va sobre su base, y la animacion en un grupo aparte. */
function Place({ x, y = GROUND, rot = 0, className, i = 0, children }: { x: number; y?: number; rot?: number; className?: string; i?: number; children: ReactNode }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>{children}</g>
    </g>
  );
}

/* --- la persona de sistemas ------------------------------------------------ */

function Badge({ j }: { j: Joints }) {
  const c = { x: (j.shoulder.x + j.hip.x) / 2, y: (j.shoulder.y + j.hip.y) / 2 };
  return (
    <>
      <path d={`M${j.sL.x + 2} ${j.sL.y + 1}L${c.x} ${c.y - 1}L${j.sR.x - 2} ${j.sR.y + 1}`} stroke={PAPER} strokeWidth={0.9} fill="none" />
      <rect x={c.x - 2} y={c.y - 1} width={4} height={5} rx={0.8} fill={PAPER} stroke={EDGE} strokeWidth={0.7} />
    </>
  );
}

function Hair({ j }: { j: Joints }) {
  const { head: h, headR: r } = j;
  return <path d={`M${h.x - r} ${h.y - 0.5}a${r} ${r} 0 0 1 ${r * 2} 0q-3-2.5-6-1.6q-2 .6-${r * 2 - 6} 1.6z`} fill={EDGE} fillOpacity={0.55} />;
}

/* --- escenas ---------------------------------------------------------------- */

export function CortafuegosWin() {
  return (
    <Scene>
      <path d="M0 7H320" stroke={LINE} strokeWidth={3} />
      <path d="M81 8v34M113 8v26M241 8v26M302 8v22" stroke={SOFT} strokeOpacity={0.5} strokeWidth={1.2} />
      {RACKS.map(([x, w, h]) => (
        <Rack key={x} x={x} w={w} h={h} lit={(k) => (k * 5 + x) % 4 === 0} />
      ))}

      {/* El cortafuegos: un escudo que brilla en el hueco entre armarios. */}
      <g className="story-glow">
        <circle cx={178} cy={40} r={30} fill={WARM} fillOpacity={0.12} />
        <circle cx={178} cy={40} r={36} fill="none" stroke={WARM} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="2 5" />
      </g>
      <path d="M178 14l20 7v14c0 12.6-8.4 21.7-20 26.6-11.6-4.9-20-14-20-26.6V21z" fill={PAPER} stroke={WARM} strokeWidth={2} strokeLinejoin="round" />
      <path d="M178 14l20 7v14c0 12.6-8.4 21.7-20 26.6-11.6-4.9-20-14-20-26.6V21z" fill={WARM} fillOpacity={0.2} />
      <path d="M168.5 38l6.5 6.5 12.5-13" fill="none" stroke={WARM} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

      <Floor />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />

      <Desk
        screen={
          <g strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d="M10 69H38M10 76H38M10 83H38" stroke={LINE} strokeWidth={0.8} />
            <path d="M10 87L16 82L21 84L27 75L31 77L37 66" stroke={WARM} strokeWidth={2} />
            <path d="M33 65.5L37.5 65.5L37.5 70" stroke={WARM} strokeWidth={2} />
          </g>
        }
      />

      <Figure
        x={76}
        y={102}
        pose={{ ...POSES.fistR, head: 6 }}
        color={SOFT}
        front={(j) => (
          <>
            <Hair j={j} />
            <Badge j={j} />
            <g strokeLinejoin="round" strokeLinecap="round">
              <path d={`M${j.handR.x + 3} ${j.handR.y - 2.5}q3 0 3 2.5 0 2.5-3 2.5`} fill="none" stroke={EDGE} strokeWidth={1.2} />
              <rect x={j.handR.x - 3.2} y={j.handR.y - 4.5} width={6.4} height={7.5} rx={1} fill={CARD} stroke={EDGE} strokeWidth={1.2} />
              <path d={`M${j.handR.x - 1.5} ${j.handR.y - 7}q-1.5-2 0-4M${j.handR.x + 1.5} ${j.handR.y - 7.5}q-1.5-2 0-4`} fill="none" stroke={SOFT} strokeWidth={1} />
            </g>
          </>
        )}
      />

      <Place x={114} className="story-bob" i={0}>
        <Chip mood="win" />
      </Place>
      <Place x={160} className="story-bob" i={1}>
        <Database mood="win" />
      </Place>
      <Place x={208} className="story-bob" i={2}>
        <Router mood="win" />
        <path d="M-5 -28a7 7 0 0 1 10 0M-9 -32a13 13 0 0 1 18 0" fill="none" stroke={organ('green')} strokeWidth={2} strokeLinecap="round" />
      </Place>
      <Place x={256} className="story-bob" i={3}>
        <Plug mood="win" />
        <path d="M0 -13V-5q0 5 6 5H20" fill="none" stroke={EDGE} strokeWidth={2.2} strokeLinecap="round" />
      </Place>

      <Sparkle x={140} y={22} r={5} i={1} />
      <path d={star(222, 18, 4)} fill={WARM} />
      <path d={star(54, 50, 3.5)} fill={WARM} />
      <path d={star(290, 12, 3)} fill={WARM} fillOpacity={0.7} />
    </Scene>
  );
}

/** Cable suelto con su clavija, colgando de la bandeja del techo. */
function LooseCable({ x, len, bend, className, i = 0 }: { x: number; len: number; bend: number; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${x} 8q${bend} ${len * 0.6} ${bend * 0.4} ${len}`} fill="none" stroke={SOFT} strokeWidth={1.6} />
      <rect x={x + bend * 0.4 - 2} y={8 + len} width={4} height={5} rx={1} fill={LINE} stroke={SOFT} strokeWidth={1.1} />
    </g>
  );
}

export function CortafuegosLose() {
  return (
    <Scene>
      {/* La bandeja del techo se ha soltado por la derecha. */}
      <path d="M0 7H200l40 5" stroke={LINE} strokeWidth={3} fill="none" />
      {RACKS.map(([x, w, h]) => (
        <Rack key={x} x={x} w={w} h={h} lit={() => false} fade />
      ))}
      <rect className="story-flicker" x={271} y={GROUND - 57} width={2.4} height={2} fill={WARM} />
      <LooseCable x={122} len={30} bend={-6} />
      <LooseCable x={196} len={40} bend={8} className="story-sway" i={1} />
      <path d={star(200, 57, 3.5)} fill={WARM} />
      <path d={star(206, 63, 2.4)} fill={WARM} />
      <LooseCable x={300} len={22} bend={-5} />

      <Floor />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />

      <Desk
        screen={
          <g>
            <rect x={8.5} y={62.5} width={31} height={27} fill={FAINT} fillOpacity={0.25} />
            <path d="M16 68l16 16M32 68l-16 16" stroke={DANGER} strokeWidth={3.2} strokeLinecap="round" />
          </g>
        }
      />
      {/* La taza, volcada sobre la mesa. */}
      <g strokeLinejoin="round">
        <path d="M4 100h12" stroke={SOFT} strokeWidth={1.6} strokeLinecap="round" />
        <rect x={8} y={93} width={7.5} height={6.4} rx={1} transform="rotate(-80 12 96)" fill={CARD} stroke={EDGE} strokeWidth={1.2} />
      </g>

      {/* Taburete y la persona de sistemas, rendida sobre el teclado. */}
      <path d="M70 113h18M79 113v13M72 126h14" stroke={SOFT} strokeWidth={2} strokeLinecap="round" />
      <Figure
        x={77}
        y={109}
        pose={{ lean: -54, head: -28, armL: [-85, -100], armR: [-72, -92], legL: [-76, 2], legR: [-64, 6] }}
        color={SOFT}
        front={(j) => <Hair j={j} />}
      />

      <Place x={106} rot={-14} className="story-drop" i={0}>
        <Chip mood="lose" />
        <Bug x={4} y={-40} rot={-10} color={organ('red')} />
      </Place>
      {/* Tumbados con rot 90: la x del dibujo apunta al suelo y la y, a la izquierda. */}
      <Place x={132} y={GROUND - 14} rot={90} className="story-drop" i={1}>
        <Database
          mood="lose"
          limp={[
            [-6, -5],
            [-1.5, -6],
          ]}
        />
        <Bug x={-15} y={-37} rot={-80} color={organ('blue')} />
      </Place>
      <Place x={210} rot={6} className="story-drop" i={2}>
        <Router mood="lose" />
        <Bug x={2} y={-28} rot={8} color={organ('green')} />
      </Place>
      {/* La fuente, tumbada al otro lado (rot -90) y con el cable cortado a ras. */}
      <Place x={288} y={GROUND - 13} rot={-90} className="story-drop" i={3}>
        <path d="M0 -13V-3M0 -3l-2.5 3M0 -3l2.5 3" fill="none" stroke={EDGE} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <Plug
          mood="lose"
          limp={[
            [1.5, -5],
            [7, 4],
          ]}
        />
        <Bug x={15} y={-21} rot={80} color={organ('yellow')} />
      </Place>
      <Sparkle x={291} y={108} r={4} i={3} />

      <Puff x={108} y={70} r={6} i={0} />
      <Puff x={176} y={90} r={5} i={2} />
    </Scene>
  );
}

export const scenes = { win: CortafuegosWin, lose: CortafuegosLose };

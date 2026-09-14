import {
  CARD,
  Cloud,
  EDGE,
  FAINT,
  Figure,
  LINE,
  PAPER,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  delay,
  organ,
  type Joints,
} from './kit';

/*
 * Piratas. Los cuatro botines son el loro rojo, el barco azul, el mapa verde
 * y el catalejo amarillo; la capitana va en neutro, con su tricornio, y el
 * mar, la isla y el cielo en tonos de tinta para que manden las cartas.
 */

const EDGED = { stroke: EDGE, strokeWidth: 1.4, strokeLinejoin: 'round' as const };

/** Mar desde la cresta `y` hasta abajo: olas de `len` de largo y `amp` de alto. */
function sea(y: number, amp: number, len: number, shift = 0) {
  let d = `M${-len + shift} ${y}q${len / 4} ${-amp} ${len / 2} 0`;
  for (let x = -len / 2 + shift; x < 330; x += len / 2) d += `t${len / 2} 0`;
  return `${d}V160H${-len + shift}Z`;
}

function Water({ y, amp, len, shift = 0, opacity }: { y: number; amp: number; len: number; shift?: number; opacity: number }) {
  const d = sea(y, amp, len, shift);
  // Fondo opaco: el casco hundido y las piernas de la capitana no se transparentan.
  return (
    <g>
      <path d={d} fill={PAPER} />
      <path d={d} fill={FAINT} fillOpacity={opacity} stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round" />
    </g>
  );
}

/* --- los cuatro botines ---------------------------------------------------- */

/** Loro de perfil mirando a la derecha; `plucked` le deja la cola rota y las alas encogidas. */
function Parrot({ x, y, s = 1, flip = false, plucked = false, className }: { x: number; y: number; s?: number; flip?: boolean; plucked?: boolean; className?: string }) {
  const red = organ('red');
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
        {/* ala del fondo */}
        <path d={plucked ? 'M-2-2q-8-8-4-15q5 5 8 13z' : 'M-3-2q-10-12-2-22q7 9 7 20z'} fill={red} fillOpacity={0.6} {...EDGED} />
        {plucked ? (
          <path d="M-8 1l-8 3 1 3 7-2z" fill={red} {...EDGED} />
        ) : (
          <path d="M-7 0L-26 7l1 3.5L-7 5z" fill={red} {...EDGED} />
        )}
        <ellipse cx={0} cy={0} rx={10} ry={5.5} transform="rotate(-18)" fill={red} {...EDGED} />
        <circle cx={9} cy={-5.5} r={5} fill={red} {...EDGED} />
        <path d="M13 -8.5q5.5 0 5 6q-2.5-2-5-1.5z" fill={FAINT} {...EDGED} />
        <circle cx={10} cy={-6.5} r={1.5} fill={EDGE} />
        {/* ala de delante, con dos plumas marcadas */}
        <path d={plucked ? 'M1-3q-2-10 5-13q2 7-1 14z' : 'M0-3q-4-16 8-22q2 12-4 22z'} fill={red} {...EDGED} />
        {!plucked && <path d="M2-8l4-6M3-4l3-5" stroke={EDGE} strokeWidth={1} strokeOpacity={0.6} strokeLinecap="round" />}
        {plucked && <path d="M-2 4l-1 3M2 4.5l.5 3" stroke={EDGE} strokeWidth={1.2} strokeLinecap="round" />}
      </g>
    </g>
  );
}

/** Pluma suelta del loro. */
function Feather({ x, y, rot, className, i = 0 }: { x: number; y: number; rot: number; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <path transform={`translate(${x} ${y}) rotate(${rot})`} d="M0-5q3 3 0 10q-3-7 0-10zM0 5v2" fill={organ('red')} {...EDGED} strokeWidth={1.1} />
    </g>
  );
}

/** Mapa desplegado en vertical, colgado de su rodillo de arriba. */
function HangingMap({ x, y }: { x: number; y: number }) {
  const green = organ('green');
  return (
    <g>
      <rect x={x + 2} y={y + 2} width={24} height={20} fill={PAPER} />
      <path d={`M${x + 2} ${y + 2}h24v14l-6 6h-18z`} fill={green} fillOpacity={0.55} {...EDGED} />
      <path d={`M${x + 26} ${y + 16}l-6 6q-1-5 6-6z`} fill={green} {...EDGED} />
      <path d={`M${x + 7} ${y + 18}c3-1 3-6 7-6s4-3 6-6`} stroke={EDGE} strokeWidth={1.3} fill="none" strokeDasharray="1.6 2.4" strokeLinecap="round" />
      <path d={`M${x + 19} ${y + 5}l4.5 4.5M${x + 23.5} ${y + 5}l-4.5 4.5`} stroke={EDGE} strokeWidth={2} strokeLinecap="round" />
      <rect x={x} y={y} width={28} height={3.6} rx={1.8} fill={green} {...EDGED} />
      <rect x={x} y={y + 20.5} width={28} height={3.6} rx={1.8} fill={green} {...EDGED} />
    </g>
  );
}

/** Catalejo de tres tramos a lo largo de +x, con el ocular en el origen. */
function Spyglass() {
  const yellow = organ('yellow');
  return (
    <g>
      <rect x={0} y={-1.8} width={7} height={3.6} rx={0.8} fill={yellow} {...EDGED} />
      <rect x={6.5} y={-2.5} width={8} height={5} rx={0.8} fill={yellow} {...EDGED} />
      <rect x={14} y={-3.4} width={11} height={6.8} rx={1} fill={yellow} {...EDGED} />
      <path d="M17.5-3.4v6.8" stroke={EDGE} strokeWidth={1.1} />
    </g>
  );
}

/** Tricornio con el ala a la altura `b`: tres picos, dos a los lados y uno al frente. */
const tricorn = (cx: number, b: number) =>
  `M${cx - 11} ${b}Q${cx - 10} ${b - 8} ${cx - 5} ${b - 6}Q${cx} ${b - 12} ${cx + 5} ${b - 6}Q${cx + 10} ${b - 8} ${cx + 11} ${b}Q${cx} ${b - 3.5} ${cx - 11} ${b}Z`;

function Tricorn({ j }: { j: Joints }) {
  return <path d={tricorn(j.head.x, j.head.y - j.headR + 3)} fill={SOFT} stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round" />;
}

/* --- el barco -------------------------------------------------------------- */

const HULL = 'M70 83H93V94H196L206 88L199 104Q192 116 176 118H92Q78 116 72 104Z';

function Hull() {
  const blue = organ('blue');
  return (
    <g>
      <path d={HULL} fill={blue} {...EDGED} />
      <path d="M73 99H200M93 94V99" stroke={EDGE} strokeWidth={1} strokeOpacity={0.55} fill="none" />
      <g fill={PAPER} stroke={EDGE} strokeWidth={1.1}>
        {[108, 124, 140, 156, 172].map((x) => (
          <circle key={x} cx={x} cy={106} r={2.4} />
        ))}
        <rect x={76} y={87} width={4} height={4} rx={0.6} />
        <rect x={84} y={87} width={4} height={4} rx={0.6} />
      </g>
    </g>
  );
}

function Mast({ x, top, bottom = 94 }: { x: number; top: number; bottom?: number }) {
  return <rect x={x - 1.6} y={top} width={3.2} height={bottom - top} fill={SOFT} stroke={EDGE} strokeWidth={1} />;
}

/** Vela cuadrada hinchada hacia la derecha, con su verga. */
function Sail({ x0, x1, y0, y1 }: { x0: number; x1: number; y0: number; y1: number }) {
  const bulge = (x1 - x0) * 0.2;
  const my = (y0 + y1) / 2;
  return (
    <g>
      <path d={`M${x0} ${y0}H${x1}Q${x1 + bulge} ${my} ${x1} ${y1}H${x0}Q${x0 + bulge} ${my} ${x0} ${y0}Z`} fill={CARD} {...EDGED} />
      <path d={`M${x0 + bulge * 0.4} ${my}H${x1 + bulge * 0.7}`} stroke={FAINT} strokeWidth={1} />
      <path d={`M${x0 - 3} ${y0}H${x1 + 3}`} stroke={EDGE} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}

/* --- escenas --------------------------------------------------------------- */

export function PiratasWin() {
  return (
    <Scene>
      <circle cx={262} cy={32} r={13} fill={WARM} fillOpacity={0.3} stroke={WARM} strokeWidth={1.4} />
      <circle className="story-glow" cx={262} cy={32} r={19} fill="none" stroke={WARM} strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="2 5" />
      <Cloud x={176} y={6} s={0.8} opacity={0.25} />
      <Cloud x={14} y={70} s={1} opacity={0.25} />
      <path d="M300 60q3-3 6 0q3-3 6 0M212 18q2.5-2.5 5 0q2.5-2.5 5 0" stroke={SOFT} strokeWidth={1.2} fill="none" strokeLinecap="round" />

      {/* isla del tesoro */}
      <Water y={110} amp={2} len={24} opacity={0.18} />
      <path d="M228 116q14-12 40-14q30-2 56 6v10z" fill={LINE} stroke={SOFT} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M294 104q2-20-8-38" stroke={EDGE} strokeWidth={4.4} fill="none" strokeLinecap="round" />
      <path d="M294 104q2-20-8-38" stroke={SOFT} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path
        d="M286 66q-12-8-22 0q12 0 22 0zM286 66q10-10 22-4q-12 2-22 4zM286 66q-10 0-16 9q10-3 16-9zM286 66q10-1 15 9q-9-3-15-9zM286 66q-2-10 6-14q0 8-6 14z"
        fill={FAINT}
        fillOpacity={0.7}
        {...EDGED}
      />
      <circle className="story-glow" cx={262} cy={98} r={13} fill={WARM} fillOpacity={0.25} />
      <path d="M254 96q8-7 16 0z" fill={WARM} {...EDGED} />
      <rect x={253} y={96} width={18} height={10} rx={1} fill={LINE} {...EDGED} />
      <path d="M262 96v10" stroke={EDGE} strokeWidth={1} />
      <Sparkle x={272} y={88} r={3.5} i={1} />

      <g className="story-bob">
        <path d="M74 83L126 18M204 89L166 31" stroke={FAINT} strokeWidth={1} />
        <path d="M168 33L230 80L194 90Z" fill={CARD} {...EDGED} />
        <path d="M200 90L232 79" stroke={EDGE} strokeWidth={2.4} strokeLinecap="round" />
        <Mast x={126} top={14} />
        <Mast x={166} top={28} />
        <path className="story-flutter" d="M127.6 15h15l-4 3.5 4 3.5h-15z" fill={WARM} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
        <Sail x0={106} x1={146} y0={24} y1={44} />
        <Sail x0={102} x1={150} y0={50} y1={76} />
        <Sail x0={150} x1={182} y0={36} y1={52} />
        <Sail x0={148} x1={184} y0={57} y1={80} />
        <Hull />
        <HangingMap x={67} y={84} />
        <Figure
          x={196}
          y={77}
          s={0.7}
          pose={{ head: 6, armL: [-38, 55], armR: [120, 225], legL: [-12, -6], legR: [12, 6] }}
          color={FAINT}
          front={(j) => (
            <>
              <Tricorn j={j} />
              <g transform={`translate(${j.head.x + 3} ${j.head.y - 0.5}) rotate(-8)`}>
                <Spyglass />
              </g>
            </>
          )}
        />
      </g>

      <Water y={113} amp={3} len={26} shift={6} opacity={0.4} />
      <path d="M40 132q5-3 10 0M120 140q5-3 10 0M226 134q5-3 10 0M280 146q5-3 10 0" stroke={SOFT} strokeWidth={1.2} fill="none" strokeLinecap="round" />

      <Parrot x={58} y={40} s={1.05} className="story-float" />
    </Scene>
  );
}

export function PiratasLose() {
  return (
    <Scene>
      <Cloud x={8} y={12} s={1.6} color={SOFT} opacity={0.3} />
      <Cloud x={110} y={6} s={1.8} color={SOFT} opacity={0.3} />
      <Cloud x={220} y={14} s={1.5} color={SOFT} opacity={0.3} />
      <path
        d={Array.from({ length: 22 }, (_, k) => `M${8 + k * 14.5} ${34 + (k % 3) * 14}l-4 8`).join('')}
        stroke={FAINT}
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      <path className="story-flicker" d="M246 30l-10 17h7l-9 17 17-22h-7l7-12z" fill={WARM} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />

      {/* el rival se aleja por el horizonte */}
      <g stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round">
        <path d="M266 92h36l-4 6h-28z" fill={SOFT} />
        <path d="M284 92V70" stroke={SOFT} strokeWidth={1.6} />
        <path d="M285 72h10q2 4 0 8h-10zM285 82h12q2 4 0 8h-12z" fill={SOFT} fillOpacity={0.5} />
        <path d="M284 70.5l-7 2 7 2z" fill={SOFT} />
      </g>
      <Water y={96} amp={2} len={20} opacity={0.2} />

      {/* el barco se va a pique de popa, con el palo mayor partido */}
      <g transform="rotate(-22 140 112)">
        <Mast x={166} top={30} />
        <path d="M150 38H182L180 44L176 41L172 50L166 44L160 52L156 45L152 49Z" fill={CARD} {...EDGED} />
        <path d="M148 58H184L186 66L181 64L178 76L172 69L167 80L161 70L156 78L150 67Z" fill={CARD} {...EDGED} />
        <circle cx={160} cy={62} r={2.4} fill={PAPER} stroke={EDGE} strokeWidth={1} />
        <path d="M124.4 94V62l2.4-4 .8 5 .8-3V94z" fill={SOFT} stroke={EDGE} strokeWidth={1} strokeLinejoin="round" />
        <Hull />
      </g>
      {/* lo que queda del palo mayor, con la vela hecha jirones */}
      <path d="M70 114l36-46" stroke={EDGE} strokeWidth={4.4} strokeLinecap="round" />
      <path d="M70 114l36-46" stroke={SOFT} strokeWidth={2.2} strokeLinecap="round" />
      <path d="M94 82l12 12-4 2 1 5-6-2-2 6-5-5-3 4-2-8z" fill={CARD} {...EDGED} />

      <Water y={113} amp={4} len={30} opacity={0.4} />

      <g className="story-float" style={delay(1)}>
        <path d="M178 122l12-3 1.5 4-2 3 2 4-12 2z" fill={organ('green')} fillOpacity={0.55} {...EDGED} />
        <path d="M181 127l3-2" stroke={EDGE} strokeWidth={1.2} strokeDasharray="1.5 2" strokeLinecap="round" />
      </g>
      <g className="story-float" style={delay(3)}>
        <path d="M198 121l2.5 4-2 3 2 4 12-2-1-12z" fill={organ('green')} fillOpacity={0.55} {...EDGED} />
        <path d="M204 123l4 4M208 123l-4 4" stroke={EDGE} strokeWidth={1.8} strokeLinecap="round" />
      </g>
      <g className="story-float" style={delay(2)}>
        <g transform="translate(232 128) rotate(-14)">
          <Spyglass />
        </g>
      </g>
      {/* el tricornio de la capitana, a la deriva */}
      <path transform="translate(98 131) rotate(10)" d={tricorn(0, 0)} fill={SOFT} stroke={EDGE} strokeWidth={1.6} strokeLinejoin="round" />

      {/* la capitana, agarrada a un barril */}
      <g className="story-bob">
        <Figure x={50} y={134} s={0.8} pose={{ head: -8, armL: [-95, -40], armR: [95, 40], legL: [-8, -4], legR: [8, 4] }} color={FAINT} />
        <path d="M28 120H72Q78 130 72 140H28Q22 130 28 120Z" fill={CARD} {...EDGED} />
        <path d="M36 120.5q-2 9.5 0 19M64 120.5q2 9.5 0 19" stroke={SOFT} strokeWidth={1.6} fill="none" />
        <path d="M28 127H72" stroke={FAINT} strokeWidth={1} />
        <circle cx={32} cy={123} r={3} fill={FAINT} {...EDGED} />
        <circle cx={68} cy={123} r={3} fill={FAINT} {...EDGED} />
      </g>

      <Water y={138} amp={4} len={34} shift={10} opacity={0.45} />

      <Parrot x={34} y={40} s={0.9} flip plucked className="story-float" />
      <Feather x={60} y={58} rot={30} />
      <Feather x={50} y={70} rot={-40} />
    </Scene>
  );
}

export const scenes = { win: PiratasWin, lose: PiratasLose };

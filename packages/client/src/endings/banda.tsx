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
  Puff,
  SOFT,
  Scene,
  WARM,
  add,
  delay,
  dir,
  joints,
  organ,
  pt,
  star,
  type Joints,
  type Pose,
  type Pt,
} from './kit';

/*
 * Banda. Cada musico va del color de su carta y toca el instrumento de ese
 * mismo color: guitarra roja, bateria azul, teclado verde y trompeta
 * amarilla. Los instrumentos se dibujan grandes y con detalles claros
 * (teclas, parche, pistones) para que se reconozca la carta aunque el
 * musico y su instrumento compartan color.
 */

const GROUND = 114;
/** Borde delantero del escenario: por debajo empieza el foso del publico. */
const APRON = 122;

/* --- geometria ------------------------------------------------------------ */

const deg = (r: number) => (r * 180) / Math.PI;

/** Giro de un punto como lo haria `rotate()` de SVG. */
function rotp(p: Pt, a: number): Pt {
  const c = Math.cos((a * Math.PI) / 180);
  const s = Math.sin((a * Math.PI) / 180);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

/**
 * Angulos de un brazo para que la mano llegue a `t`. Los instrumentos se
 * sostienen con las dos manos en sitios concretos, y a ojo no se acierta.
 */
function reach(s: Pt, t: Pt, bend: 1 | -1): [number, number] {
  const a = 10;
  const b = 9;
  const d = Math.min(Math.max(Math.hypot(t.x - s.x, t.y - s.y), a - b + 0.2), a + b - 0.2);
  const base = deg(Math.atan2(t.x - s.x, t.y - s.y));
  const u = base + bend * deg(Math.acos((a * a + d * d - b * b) / (2 * a * d)));
  const e = add(s, dir(u), a);
  return [u, deg(Math.atan2(t.x - e.x, t.y - e.y))];
}

/** Postura con los brazos resueltos hacia dos objetivos del marco de la figura. */
function holding(pose: Omit<Pose, 'armL' | 'armR'>, hL: Pt, hR: Pt, bendL: 1 | -1, bendR: 1 | -1): Pose {
  const j = joints({ ...pose, armL: [0, 0], armR: [0, 0] });
  return { ...pose, armL: reach(j.sL, hL, bendL), armR: reach(j.sR, hR, bendR) };
}

/** Mano por encima del instrumento: la silueta la pinta debajo de el. */
function Hand({ p }: { p: Pt }) {
  return <circle cx={p.x} cy={p.y} r={3} fill="currentColor" stroke={EDGE} strokeWidth={1.2} />;
}

/* --- escenario ------------------------------------------------------------ */

const LAMPS = [62, 126, 194, 258];

function Stage({ lit }: { lit: boolean }) {
  const scallops = Array.from({ length: 10 }, (_, k) => {
    const x = 320 - k * 32;
    return `Q${x - 16} 19 ${x - 32} 11`;
  }).join('');
  return (
    <g>
      <path d={`M0 0H320V11${scallops}Z`} fill={FAINT} fillOpacity={0.4} stroke={SOFT} strokeOpacity={0.4} strokeWidth={1} />
      <path d="M0 0H26Q16 58 24 114H0Z" fill={FAINT} fillOpacity={0.3} />
      <path d="M320 0H294Q304 58 296 114H320Z" fill={FAINT} fillOpacity={0.3} />
      <path d="M8 14V114M16 14V114M312 14V114M304 14V114" stroke={SOFT} strokeOpacity={0.22} strokeWidth={1.4} />

      {/* Celosia de focos. */}
      <path d="M34 20H286M34 26H286" stroke={FAINT} strokeWidth={1.3} />
      <path
        d={Array.from({ length: 20 }, (_, k) => `M${34 + k * 12.6} 26l6.3-6`).join('')}
        stroke={FAINT}
        strokeWidth={1}
        strokeOpacity={0.8}
      />
      {LAMPS.map((x) => (
        <g key={x}>
          <path d={`M${x - 4.5} 25h9l-1.5 7h-6z`} fill={lit ? SOFT : FAINT} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
        </g>
      ))}

      <rect x={0} y={GROUND} width={320} height={APRON - GROUND} fill={LINE} fillOpacity={0.75} />
      <rect x={0} y={APRON} width={320} height={9} fill={FAINT} fillOpacity={0.3} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />
      <path d={`M0 ${APRON}H320M0 ${APRON + 9}H320`} stroke={SOFT} strokeWidth={1} strokeOpacity={0.7} />
      <path
        d={Array.from({ length: 11 }, (_, k) => `M${14 + k * 30} ${APRON}v9`).join('')}
        stroke={SOFT}
        strokeOpacity={0.35}
        strokeWidth={1}
      />
    </g>
  );
}

function Speaker({ x, y, tipped = false }: { x: number; y: number; tipped?: boolean }) {
  const box = (bx: number, by: number, k: number) => (
    <g key={k}>
      <rect x={bx} y={by} width={20} height={15} rx={1.5} fill={LINE} stroke={SOFT} strokeWidth={1.2} />
      <circle cx={bx + 10} cy={by + 7.5} r={5} fill={FAINT} fillOpacity={0.4} stroke={SOFT} strokeWidth={1.1} />
      <circle cx={bx + 10} cy={by + 7.5} r={1.6} fill={SOFT} />
    </g>
  );
  return (
    <g>
      {box(x, y + 15, 0)}
      {tipped ? <g transform={`rotate(-24 ${x + 20} ${y + 15})`}>{box(x, y, 1)}</g> : box(x, y, 1)}
    </g>
  );
}

/** Haz de luz de un foco a un punto del suelo. */
function Beam({ from, to, spread = 20, opacity = 0.14, className, i = 0 }: { from: number; to: number; spread?: number; opacity?: number; className?: string; i?: number }) {
  return (
    <path
      className={className}
      style={delay(i)}
      d={`M${from - 3} 32L${from + 3} 32L${to + spread} ${GROUND + 4}L${to - spread} ${GROUND + 4}Z`}
      fill={WARM}
      fillOpacity={opacity}
    />
  );
}

/* --- notas ------------------------------------------------------------------ */

function Note({ x, y, s = 1, rot = 0, color, className, i = 0 }: { x: number; y: number; s?: number; rot?: number; color: string; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill={color} stroke={color} strokeLinecap="round">
        <ellipse cx={0} cy={0} rx={3.6} ry={2.7} transform="rotate(-20)" stroke="none" />
        <path d="M3.2-1V-14q1 4 6 6" fill="none" strokeWidth={1.7} />
      </g>
    </g>
  );
}

/** Dos corcheas unidas por la barra. */
function Beamed({ x, y, s = 1, color, className, i = 0 }: { x: number; y: number; s?: number; color: string; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke={color} strokeLinecap="round">
        <ellipse cx={0} cy={0} rx={3.6} ry={2.7} transform="rotate(-20)" stroke="none" />
        <ellipse cx={12} cy={-3} rx={3.6} ry={2.7} transform="rotate(-20 12 -3)" stroke="none" />
        <path d="M3.2-1V-14L15.2-17V-4" fill="none" strokeWidth={1.7} strokeLinejoin="round" />
        <path d="M3.2-11.5 15.2-14.5" fill="none" strokeWidth={2.4} />
      </g>
    </g>
  );
}

/** Nota rota: el palo quebrado en rayo, como el ruido de la mesa. */
function BrokenNote({ x, y, rot = 0, className, i = 0 }: { x: number; y: number; rot?: number; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`} fill={SOFT} stroke={SOFT} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={0} cy={0} rx={3.6} ry={2.7} transform="rotate(-20)" stroke="none" />
        <path d="M3.2-1V-5l-3-2.5 4.5-2.5-3-2.5 1-3.5" fill="none" strokeWidth={1.5} />
      </g>
    </g>
  );
}

/* --- instrumentos ----------------------------------------------------------- */

const GUITAR_BODY =
  'M9-3.6C7-8.5 1-8-1-5.6-3.5-3.5-6-10.5-12-10-20.5-9.5-20.5 9.5-12 10-6 10.5-3.5 3.5-1 5.6 1 8 7 8.5 9 3.6Z';

/** Guitarra con el origen donde se rasguea y el mastil hacia +x. */
function Guitar({ at, angle, broken = false }: { at: Pt; angle: number; broken?: boolean }) {
  return (
    <g transform={`translate(${pt(at)}) rotate(${angle})`} strokeLinejoin="round">
      <rect x={8} y={-1.8} width={26} height={3.6} fill={CARD} stroke={EDGE} strokeWidth={1.1} />
      <path d="M13 -1.8v3.6M18 -1.8v3.6M23 -1.8v3.6M28 -1.8v3.6" stroke={SOFT} strokeWidth={0.8} />
      <path d="M33.5-2.2 41-3.4v6.8l-7.5-1.2z" fill="currentColor" stroke={EDGE} strokeWidth={1.1} />
      <path d={GUITAR_BODY} fill="currentColor" stroke={EDGE} strokeWidth={1.4} />
      <path d="M-2 4.5C-4 7-8 7.5-9 5.5L-7 1.5Z" fill={CARD} fillOpacity={0.9} />
      <rect x={-10} y={-4.5} width={2.6} height={9} rx={0.6} fill={CARD} stroke={EDGE} strokeWidth={0.8} />
      <rect x={-5.2} y={-4.5} width={2.6} height={9} rx={0.6} fill={CARD} stroke={EDGE} strokeWidth={0.8} />
      <rect x={-15.5} y={-3.8} width={2.2} height={7.6} rx={0.5} fill={EDGE} />
      {broken ? (
        /* Cuerdas partidas: salen del clavijero y se enroscan sueltas. */
        <g fill="none" stroke={SOFT} strokeWidth={0.9} strokeLinecap="round">
          <path d="M40-1c4-3 1-8 5-10s5 3 2 5" />
          <path d="M40 1c6 1 5 7 9 6s1-5-1-3" />
          <path d="M-14-1H4M-14 1H-2" />
          <path d="M4-1c3-1 4-5 7-4s0 4-2 3" />
        </g>
      ) : (
        <path d="M-14-0.8H40M-14 0.8H40" stroke={SOFT} strokeWidth={0.7} />
      )}
    </g>
  );
}

/** Bombo visto de frente. `holed` rompe el parche. */
function BassDrum({ x, y, r, holed = false }: { x: number; y: number; r: number; holed?: boolean }) {
  const lugs = Array.from({ length: 8 }, (_, k) => {
    const p = dir(k * 45 + 22.5);
    return <circle key={k} cx={x + p.x * (r - 1.6)} cy={y + p.y * (r - 1.6)} r={1.1} fill={PAPER} />;
  });
  return (
    <g>
      <path d={`M${x - r * 0.7} ${y + r * 0.6}l-4 ${GROUND - y - r * 0.6}M${x + r * 0.7} ${y + r * 0.6}l4 ${GROUND - y - r * 0.6}`} stroke={SOFT} strokeWidth={1.6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={r} fill="currentColor" stroke={EDGE} strokeWidth={1.4} />
      {lugs}
      <circle cx={x} cy={y} r={r - 3.6} fill={CARD} stroke={EDGE} strokeWidth={1.1} />
      <circle cx={x} cy={y} r={(r - 3.6) * 0.55} fill="currentColor" fillOpacity={0.3} stroke="currentColor" strokeWidth={1.6} />
      {holed && (
        <g strokeLinejoin="round">
          <path
            d={`M${x - 6} ${y - 3}l3 -3 1 3 4-4 1 4 4-1-2 4 3 3-4 1 1 4-4-2-2 4-2-4-4 2 1-4-4-2 4-2z`}
            fill={EDGE}
            fillOpacity={0.85}
            stroke={EDGE}
            strokeWidth={1}
          />
          <path d={`M${x + 2} ${y + 7}l2 4-3 1z`} fill={CARD} stroke={EDGE} strokeWidth={0.9} />
        </g>
      )}
    </g>
  );
}

/** Tambor de lado: casco del color de la carta y parche claro arriba. */
function Tom({ x, y, w, h, rot = 0 }: { x: number; y: number; w: number; h: number; rot?: number }) {
  const zig = Array.from({ length: 5 }, (_, k) => `${k === 0 ? 'M' : 'L'}${x - w / 2 + 1.5 + ((w - 3) * k) / 4} ${y + (k % 2 ? h - 2 : 2.5)}`).join('');
  return (
    <g transform={`rotate(${rot} ${x} ${y + h / 2})`} strokeLinejoin="round">
      <path d={`M${x - w / 2} ${y}V${y + h}A${w / 2} 2.2 0 0 0 ${x + w / 2} ${y + h}V${y}`} fill="currentColor" stroke={EDGE} strokeWidth={1.3} />
      <path d={zig} fill="none" stroke={PAPER} strokeWidth={1.1} strokeOpacity={0.9} />
      <ellipse cx={x} cy={y} rx={w / 2} ry={2.2} fill={CARD} stroke={EDGE} strokeWidth={1.2} />
    </g>
  );
}

function Cymbal({ x, y, rx = 8, tilt = 0, stand }: { x: number; y: number; rx?: number; tilt?: number; stand?: Pt }) {
  return (
    <g>
      {stand && <path d={`M${x} ${y}L${pt(stand)}`} stroke={SOFT} strokeWidth={1.5} strokeLinecap="round" />}
      <ellipse cx={x} cy={y} rx={rx} ry={1.9} transform={`rotate(${tilt} ${x} ${y})`} fill={FAINT} stroke={EDGE} strokeWidth={1.1} />
    </g>
  );
}

/** Teclas negras de dos en dos y de tres en tres, como en la carta. */
const BLACK_AFTER = new Set([1, 2, 4, 5, 6, 8, 9]);

/** Teclado inclinado hacia quien mira; se dibuja en su marco, con (0,0) arriba a la izquierda. */
function Keyboard({ w = 50, missing = [] as number[] }: { w?: number; missing?: number[] }) {
  const n = 11;
  const kw = (w - 6) / n;
  const kx = (k: number) => 3 + k * kw;
  return (
    <g strokeLinejoin="round">
      <rect x={0} y={0} width={w} height={16} rx={2} fill="currentColor" stroke={EDGE} strokeWidth={1.4} />
      <circle cx={6} cy={2.6} r={1.2} fill={CARD} />
      <circle cx={10} cy={2.6} r={1.2} fill={CARD} />
      <rect x={w - 16} y={1.6} width={10} height={2} rx={1} fill={CARD} />
      <rect x={3} y={5} width={w - 6} height={9} fill={PAPER} stroke={EDGE} strokeWidth={1} />
      {missing.map((k) => (
        <rect key={`m${k}`} x={kx(k)} y={5} width={kw} height={9} fill="currentColor" fillOpacity={0.6} />
      ))}
      <path d={Array.from({ length: n - 1 }, (_, k) => `M${kx(k + 1)} 5v9`).join('')} stroke={EDGE} strokeWidth={0.7} />
      {Array.from({ length: n - 1 }, (_, k) => k + 1)
        .filter((k) => BLACK_AFTER.has(k))
        .map((k) => (
          <rect key={k} x={kx(k) - kw * 0.3} y={5} width={kw * 0.6} height={5.4} fill={SOFT} stroke={EDGE} strokeWidth={0.6} />
        ))}
    </g>
  );
}

/** Trompeta con la boquilla en el origen y la campana hacia +x. */
function Trumpet({ dented = false }: { dented?: boolean }) {
  const bell = dented
    ? 'M21-1.5C24-2 26.5-3 28.5-5.8L30-3 29.2 0.4 31.6 3.2 30.4 6.6C27.5 3.5 24.5 2 21 1.5Z'
    : 'M21-1.5C25-2 28.5-4 31.5-8V8C28.5 4 25 2 21 1.5Z';
  const loop = dented ? 'M7 1.3v3.4a3 3 0 0 0 3 3h5l3-1.4 1.4 1a3 3 0 0 0 2.6-3V1.3' : 'M7 1.3v3.4a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V1.3';
  return (
    <g strokeLinejoin="round">
      <path d={loop} fill="none" stroke={EDGE} strokeWidth={4.4} strokeLinecap="round" />
      <path d={loop} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      <rect x={-1} y={-1.8} width={4} height={3.6} rx={1} fill={CARD} stroke={EDGE} strokeWidth={1} />
      <rect x={3} y={-1.4} width={19} height={2.8} fill="currentColor" stroke={EDGE} strokeWidth={1} />
      {[9.5, 13, 16.5].map((vx, k) => (
        <g key={vx} transform={dented && k === 1 ? `rotate(-14 ${vx + 1.2} -1.4)` : undefined}>
          <rect x={vx} y={-7} width={2.4} height={5.6} fill="currentColor" stroke={EDGE} strokeWidth={0.9} />
          <rect x={vx - 0.6} y={-8.8} width={3.6} height={1.8} rx={0.6} fill={CARD} stroke={EDGE} strokeWidth={0.8} />
        </g>
      ))}
      <path d={bell} fill="currentColor" stroke={EDGE} strokeWidth={1.3} />
      {dented ? (
        <path d="M24.5-1.6 26 .2 24.5 1.6" fill="none" stroke={EDGE} strokeWidth={0.9} strokeLinecap="round" />
      ) : (
        <ellipse cx={31.5} cy={0} rx={1.8} ry={8} fill={CARD} stroke={EDGE} strokeWidth={1.1} />
      )}
    </g>
  );
}

/* --- publico ---------------------------------------------------------------- */

interface Fan {
  x: number;
  y: number;
  arms: 0 | 1 | 2;
}

const CHEER_FANS: Fan[] = Array.from({ length: 17 }, (_, k) => ({
  x: 6 + k * 19 + ((k * 7) % 5),
  y: 150 + ((k * 5) % 3) * 3,
  arms: k % 3 === 1 ? 1 : 2,
}));

function FanShape({ f, hands = true }: { f: Fan; hands?: boolean }) {
  const { x, y, arms } = f;
  return (
    <g>
      <ellipse cx={x} cy={y + 13} rx={11} ry={8} />
      <circle cx={x} cy={y} r={6.5} />
      {hands && arms > 0 && (
        <g fill="none" strokeWidth={3.4} strokeLinecap="round">
          <path d={`M${x + 7} ${y + 8}L${x + 12} ${y - 14}`} />
          {arms === 2 && <path d={`M${x - 7} ${y + 8}L${x - 12} ${y - 14}`} />}
        </g>
      )}
      {hands && arms > 0 && <circle cx={x + 12} cy={y - 15} r={2.6} />}
      {hands && arms === 2 && <circle cx={x - 12} cy={y - 15} r={2.6} />}
    </g>
  );
}

/* --- victoria --------------------------------------------------------------- */

const GTR = { x: 72, y: GROUND - 24 };
const GTR_AT: Pt = { x: -3, y: -6 };
const GTR_ANGLE = -30;
const GTR_POSE = holding({ head: 8, legL: [-20, -10], legR: [20, 10] }, GTR_AT, add(GTR_AT, rotp({ x: 24, y: 0 }, GTR_ANGLE), 1), 1, -1);

const DRUM = { x: 130, y: 92 };
const DRUM_POSE: Pose = { head: -6, armL: [-150, -168], armR: [42, 82], legL: [-6, -3], legR: [6, 3] };

const KEYS = { x: 194, y: GROUND - 24 };
const KEYS_BOX = { x: 169, y: 78, w: 50 };
const KEYS_POSE = holding({ head: -6, legL: [-8, -4], legR: [8, 4] }, { x: KEYS_BOX.x + 12 - KEYS.x, y: KEYS_BOX.y + 7 - KEYS.y }, { x: 0, y: 0 }, -1, 1);
// La mano derecha no va al teclado: se levanta.
const KEYS_POSE_UP: Pose = { ...KEYS_POSE, armR: [150, 165] };

const TPT = { x: 252, y: GROUND - 24 };
const TPT_ANGLE = -32;
const TPT_BASE: Omit<Pose, 'armL' | 'armR'> = { lean: -10, head: 28, legL: [-12, -6], legR: [16, 8] };
const TPT_MOUTH = add(joints({ ...TPT_BASE, armL: [0, 0], armR: [0, 0] }).head, { x: 1, y: 0.4 }, 5.5);
const tptAt = (p: Pt) => add(TPT_MOUTH, rotp(p, TPT_ANGLE), 1);
const TPT_POSE = holding(TPT_BASE, tptAt({ x: 14, y: 8 }), tptAt({ x: 13, y: -3 }), -1, 1);

function Sticks({ j }: { j: Joints }) {
  const stick = (e: Pt, h: Pt) => {
    const len = Math.hypot(h.x - e.x, h.y - e.y);
    const tip = add(h, { x: (h.x - e.x) / len, y: (h.y - e.y) / len }, 12);
    const tail = add(h, { x: (h.x - e.x) / len, y: (h.y - e.y) / len }, -2);
    return (
      <>
        <path d={`M${pt(tail)}L${pt(tip)}`} stroke={EDGE} strokeWidth={3.4} strokeLinecap="round" />
        <path d={`M${pt(tail)}L${pt(tip)}`} stroke={CARD} strokeWidth={1.8} strokeLinecap="round" />
      </>
    );
  };
  return (
    <>
      {stick(j.elbowL, j.handL)}
      {stick(j.elbowR, j.handR)}
    </>
  );
}

export function BandaWin() {
  const keysJ = joints(KEYS_POSE_UP);
  return (
    <Scene>
      <Stage lit />
      <Beam from={LAMPS[0]!} to={GTR.x} className="story-sway" i={0} />
      <Beam from={LAMPS[1]!} to={DRUM.x} opacity={0.1} />
      <Beam from={LAMPS[2]!} to={KEYS.x} opacity={0.1} />
      <Beam from={LAMPS[3]!} to={TPT.x} className="story-sway" i={3} />
      {LAMPS.map((x) => (
        <circle key={x} cx={x} cy={32} r={3.2} fill={WARM} />
      ))}

      <Speaker x={30} y={GROUND - 30} />
      <Speaker x={272} y={GROUND - 30} />

      {/* Charcos de luz sobre las tablas. */}
      {[GTR.x, DRUM.x, KEYS.x, TPT.x].map((x) => (
        <ellipse key={x} cx={x} cy={GROUND + 3} rx={24} ry={3.5} fill={WARM} fillOpacity={0.22} />
      ))}

      {/* Bateria: el musico va sentado detras y la bateria lo tapa de cintura abajo. */}
      <g style={{ color: organ('blue') }}>
        <Cymbal x={106} y={80} rx={8} stand={{ x: 106, y: GROUND }} />
        <Cymbal x={106} y={83} rx={8} />
        <Cymbal x={158} y={64} rx={9} tilt={-14} stand={{ x: 156, y: GROUND }} />
      </g>
      <Figure x={DRUM.x} y={DRUM.y} pose={DRUM_POSE} build={{ leg: 10 }} color={organ('blue')} front={(j) => <Sticks j={j} />} />
      <g style={{ color: organ('blue') }}>
        <Tom x={121} y={80} w={12} h={8} rot={-8} />
        <Tom x={140} y={80} w={12} h={8} rot={8} />
        <path d="M150 94V114M146 114h8" stroke={SOFT} strokeWidth={1.5} strokeLinecap="round" />
        <Tom x={150} y={89} w={14} h={6} />
        <BassDrum x={DRUM.x} y={GROUND - 14} r={14} />
      </g>

      <Figure
        x={GTR.x}
        y={GTR.y}
        pose={GTR_POSE}
        build={{ leg: 12 }}
        color={organ('red')}
        front={(j) => (
          <>
            <Guitar at={GTR_AT} angle={GTR_ANGLE} />
            <Hand p={j.handL} />
            <Hand p={j.handR} />
          </>
        )}
      />

      <Figure x={KEYS.x} y={KEYS.y} pose={KEYS_POSE_UP} color={organ('green')} />
      <g style={{ color: organ('green') }}>
        <path
          d={`M${KEYS_BOX.x + 8} ${KEYS_BOX.y + 16}L${KEYS_BOX.x + 42} ${GROUND}M${KEYS_BOX.x + 42} ${KEYS_BOX.y + 16}L${KEYS_BOX.x + 8} ${GROUND}`}
          stroke={SOFT}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <g transform={`translate(${KEYS_BOX.x} ${KEYS_BOX.y})`}>
          <Keyboard w={KEYS_BOX.w} />
        </g>
        <Hand p={add(keysJ.handL, KEYS, 1)} />
      </g>

      <Figure
        x={TPT.x}
        y={TPT.y}
        pose={TPT_POSE}
        color={organ('yellow')}
        front={(j) => (
          <>
            <g transform={`translate(${pt(TPT_MOUTH)}) rotate(${TPT_ANGLE})`}>
              <Trumpet />
            </g>
            <Hand p={j.handL} />
            <Hand p={j.handR} />
          </>
        )}
      />

      {/* Notas que salen de la banda: calidas, como los focos. */}
      <Beamed x={96} y={52} color={WARM} className="story-float" i={0} />
      <Note x={172} y={44} rot={10} color={WARM} className="story-float" i={2} />
      <Note x={292} y={40} s={1.1} rot={-8} color={WARM} />
      <Note x={38} y={58} s={0.9} rot={-12} color={WARM} />
      <Beamed x={214} y={56} s={0.85} color={WARM} />
      <path d={`${star(140, 44, 3.5)}${star(236, 30, 3)}${star(60, 40, 2.6)}`} fill={WARM} />

      <g fill={SOFT} stroke={SOFT} opacity={0.55}>
        <g className="story-bob" style={delay(0)}>
          {CHEER_FANS.filter((_, k) => k % 2 === 0).map((f) => (
            <FanShape key={f.x} f={f} />
          ))}
        </g>
        <g className="story-bob" style={delay(3)}>
          {CHEER_FANS.filter((_, k) => k % 2 === 1).map((f) => (
            <FanShape key={f.x} f={f} />
          ))}
        </g>
      </g>
    </Scene>
  );
}

/* --- derrota ---------------------------------------------------------------- */

/** Publico que se va: pocos, de espaldas, camino de la salida de la derecha. */
const LEAVING: Fan[] = [
  { x: 188, y: 152, arms: 0 },
  { x: 216, y: 150, arms: 0 },
  { x: 246, y: 153, arms: 0 },
  { x: 276, y: 150, arms: 0 },
  { x: 304, y: 152, arms: 0 },
];

function Tomato({ x, y, splat = false }: { x: number; y: number; splat?: boolean }) {
  if (splat) {
    return (
      <path
        d={`M${x - 7} ${y}q2-3 5-1.5 1-3 4-1 3-2 4 1 3 0 3 2.5-4 1.8-8 1.5-8 0-4-.3-3-2.3z`}
        fill={DANGER}
        fillOpacity={0.6}
      />
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={3.6} fill={DANGER} fillOpacity={0.75} stroke={EDGE} strokeWidth={1} />
      <path d={`M${x - 1.6} ${y - 3.4}l1.6 1 1.6-1`} stroke={SOFT} strokeWidth={1} fill="none" strokeLinecap="round" />
    </g>
  );
}

const DRUM_DOWN = { x: 146, y: 96 };
/** El bateria se ha dormido sobre el bombo: cabeza caida y brazos colgando. */
const DRUM_DOWN_POSE: Pose = { lean: 10, head: 58, armL: [8, 2], armR: [28, 12], legL: [-50, -5], legR: [50, 5] };
const DRUM_DOWN_HEAD = add(joints(DRUM_DOWN_POSE).head, DRUM_DOWN, 1);

export function BandaLose() {
  return (
    <Scene>
      <Stage lit={false} />
      {/* Un solo foco sigue vivo, y a duras penas. */}
      <g className="story-flicker">
        <Beam from={LAMPS[1]!} to={DRUM_DOWN.x} spread={24} opacity={0.12} />
        <circle cx={LAMPS[1]} cy={32} r={3.2} fill={WARM} />
      </g>
      <ellipse cx={DRUM_DOWN.x} cy={GROUND + 3} rx={26} ry={3.5} fill={WARM} fillOpacity={0.12} />

      <Speaker x={24} y={GROUND - 30} />
      <Puff x={36} y={80} r={5} i={0} />
      <Puff x={32} y={74} r={4} i={2} />
      <Speaker x={286} y={GROUND - 30} />

      {/* La guitarra, apoyada contra el altavoz y con las cuerdas saltadas. */}
      <g style={{ color: organ('red') }}>
        <Guitar at={{ x: 51.7, y: 93 }} angle={-125} broken />
      </g>
      <Figure x={98} y={GROUND - 3} pose={POSES.slumped} color={organ('red')} />

      {/* Bateria: bombo reventado, un tom por el suelo y el platillo caido delante. */}
      <Figure x={DRUM_DOWN.x} y={DRUM_DOWN.y} pose={DRUM_DOWN_POSE} color={organ('blue')} />
      <g style={{ color: organ('blue') }}>
        <Tom x={152} y={83} w={12} h={8} rot={14} />
        <BassDrum x={DRUM_DOWN.x} y={GROUND - 14} r={14} holed />
        <Tom x={126} y={GROUND - 10} w={12} h={8} rot={-90} />
      </g>
      <Cymbal x={128} y={GROUND + 5} rx={8} tilt={-4} />
      <Dizzy x={DRUM_DOWN_HEAD.x} y={DRUM_DOWN_HEAD.y - 11} i={0} />
      <g stroke={EDGE} strokeWidth={3.4} strokeLinecap="round">
        <path d="M158 118l7-2M168 116.5l5 1.4" />
      </g>
      <g stroke={CARD} strokeWidth={1.8} strokeLinecap="round">
        <path d="M158 118l7-2M168 116.5l5 1.4" />
      </g>

      {/* El teclado se ha caido encima de quien lo tocaba. */}
      <path d="M170 113l40-6M172 107l38 6" stroke={SOFT} strokeWidth={2} strokeLinecap="round" />
      <Figure x={200} y={GROUND - 6} rot={90} s={0.9} pose={POSES.flat} color={organ('green')} />
      <g style={{ color: organ('green') }}>
        <g transform={`translate(192 ${GROUND - 11}) rotate(-9) translate(-22 -8)`}>
          <Keyboard w={44} missing={[3, 7]} />
        </g>
        <rect x={176} y={GROUND + 2} width={3.4} height={7} rx={0.6} transform={`rotate(-50 177 ${GROUND + 5})`} fill={PAPER} stroke={EDGE} strokeWidth={0.9} />
        <rect x={214} y={GROUND + 3} width={3.4} height={7} rx={0.6} transform={`rotate(70 215 ${GROUND + 6})`} fill={PAPER} stroke={EDGE} strokeWidth={0.9} />
      </g>

      {/* La trompetista, de rodillas ante su trompeta abollada. */}
      <Figure x={266} y={GROUND - 15} pose={POSES.kneel} color={organ('yellow')} />
      <g style={{ color: organ('yellow') }} transform={`translate(236 ${GROUND + 1}) rotate(-6)`}>
        <Trumpet dented />
      </g>

      <BrokenNote x={214} y={70} rot={-24} className="story-drop" i={2} />
      <BrokenNote x={74} y={52} rot={30} />
      <BrokenNote x={300} y={58} rot={-150} />

      <Tomato x={112} y={GROUND + 4} splat />
      <Tomato x={228} y={GROUND + 5} splat />
      <Tomato x={66} y={GROUND + 6} />
      <g className="story-drop" style={delay(4)}>
        <Tomato x={236} y={84} />
      </g>

      <g fill={SOFT} stroke={SOFT} opacity={0.5}>
        {LEAVING.map((f) => (
          <FanShape key={f.x} f={f} hands={false} />
        ))}
      </g>
    </Scene>
  );
}

export const scenes = { win: BandaWin, lose: BandaLose };

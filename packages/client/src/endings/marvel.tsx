import type { ReactNode } from 'react';

import {
  CARD,
  EDGE,
  FAINT,
  Figure,
  GLOW,
  LINE,
  PAPER,
  POSES,
  Puff,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  add,
  delay,
  dir,
  joints,
  mid,
  organ,
  pt,
  type Build,
  type Joints,
  type Pose,
  type Pt,
} from './kit';

/*
 * Heroes Marvel. Siluetas propias: la armadura con el reactor y el brillo de
 * la mano, el escudo de anillos con su estrella (dibujada aqui, pedida por el
 * autor), la mole de Hulk y el martillo con capa. Nada de la A de los
 * Vengadores.
 * Iron Man rojo, Capitan America azul, Hulk verde y Thor amarillo.
 */

const GROUND = 126;

const HULK: Build = { torso: 22, shoulders: 21, hips: 14, head: 6.2, arm: 11.5, limb: 8 };
const THOR: Build = { shoulders: 14.5 };

/* Posturas con casco: el casco gira con la cabeza, asi que se nombran una vez. */
const IRON_WIN: Pose = { armL: [-14, -6], armR: [128, 150], legL: [-4, -2], legR: [4, 2], head: 6 };
const IRON_LOSE: Pose = { lean: -4, head: -28, armL: [-10, -4], armR: [12, 6], legL: [-6, -2], legR: [6, 2] };
const THOR_WIN: Pose = { ...POSES.fistR, head: 6 };
const THOR_LOSE: Pose = { lean: 18, head: 25, armL: [-10, -4], armR: [55, 25], legL: [-10, -4], legR: [12, 6] };
const HULK_LOSE: Pose = { lean: 5, head: 28, armL: [-14, -6], armR: [16, 6], legL: [-16, -8], legR: [16, 8] };

/* --- adornos de cada heroe ------------------------------------------------- */

/** Giro de la cabeza en grados SVG, para que casco y adornos sigan su postura. */
const headTurn = (pose: Pose) => (pose.lean ?? 0) + (pose.head ?? 0);

/**
 * Casco de Iron Man, de frente: carcasa roja con los lados rectos y la
 * mandibula que se estrecha, y encima la mascara dorada como pieza propia,
 * con el pico rojo que baja hasta la frente. Solo se encienden las dos
 * ranuras de los ojos. Sin boca ni rasgos: es un casco, no una cara.
 */
function IronHelmet({ j, turn, lit }: { j: Joints; turn: number; lit: boolean }) {
  return (
    <g transform={`translate(${pt(j.head)}) rotate(${turn})`} strokeLinejoin="round">
      <path d="M-6.5-.8Q-6.5-7.6 0-7.6Q6.5-7.6 6.5-.8L6.1 3.4 3.4 6.9Q0 8-3.4 6.9L-6.1 3.4Z" fill="currentColor" stroke={EDGE} strokeWidth={1.3} />
      <path
        d="M-4.9-4.4H-1.3L0-2.4 1.3-4.4H4.9L4.7 1.6 3.1 5.3Q0 6.3-3.1 5.3L-4.7 1.6Z"
        fill={WARM}
        fillOpacity={lit ? 1 : 0.6}
        stroke={EDGE}
        strokeWidth={1}
      />
      <path d="M-4.1-1.1-1.2-.5-1.4.5-3.9.2ZM4.1-1.1 1.2-.5 1.4.5 3.9.2Z" fill={lit ? GLOW : EDGE} stroke={EDGE} strokeWidth={0.6} />
    </g>
  );
}

function Armor({ j, turn, lit = true }: { j: Joints; turn: number; lit?: boolean }) {
  const chest = add(j.shoulder, j.up, -5);
  const belt = add(j.hip, j.up, 3);
  return (
    <g>
      <IronHelmet j={j} turn={turn} lit={lit} />
      {lit && <path d={`M${pt(add(belt, j.side, -5))}L${pt(add(belt, j.side, 5))}`} stroke={EDGE} strokeWidth={0.9} />}
      {/* El reactor encendido brilla y late; apagado es un disco gris. */}
      {lit && <circle className="story-glow" cx={chest.x} cy={chest.y} r={5.4} fill={GLOW} fillOpacity={0.5} />}
      <circle cx={chest.x} cy={chest.y} r={2.9} fill={lit ? GLOW : SOFT} stroke={EDGE} strokeWidth={0.8} />
      {lit && <circle cx={chest.x} cy={chest.y} r={1.4} fill="none" stroke={WARM} strokeWidth={0.8} />}
    </g>
  );
}

/** El chorro de la palma y de las botas. */
function Repulsor({ at, r = 6 }: { at: Pt; r?: number }) {
  return (
    <g>
      <circle className="story-glow" style={delay(2)} cx={at.x} cy={at.y} r={r} fill={WARM} fillOpacity={0.35} />
      <circle cx={at.x} cy={at.y} r={2} fill={GLOW} stroke={EDGE} strokeWidth={0.7} />
    </g>
  );
}

function Thrusters({ j }: { j: Joints }) {
  return (
    <g fill={WARM} fillOpacity={0.85} stroke={EDGE} strokeWidth={0.8} strokeLinejoin="round">
      {[j.footL, j.footR].map((f, k) => (
        <path key={k} d={`M${f.x - 2.2} ${f.y + 2.4}q2.2 7 2.2 8q0-1 2.2-8z`} />
      ))}
    </g>
  );
}

/** Estrella de cinco puntas con la punta hacia `up` (arriba de la pantalla por defecto). */
function star5(c: Pt, R: number, up: Pt = { x: 0, y: -1 }) {
  const points = Array.from({ length: 10 }, (_, k) => {
    const a = (k * 36 * Math.PI) / 180;
    const v = { x: up.x * Math.cos(a) - up.y * Math.sin(a), y: up.x * Math.sin(a) + up.y * Math.cos(a) };
    return pt(add(c, v, k % 2 ? R * 0.42 : R));
  });
  return `M${points.join('L')}Z`;
}

/** Escudo de frente: anillos concentricos y la estrella en el centro. */
function Shield({ at, r = 8.5 }: { at: Pt; r?: number }) {
  return (
    <g stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round">
      <circle cx={at.x} cy={at.y} r={r} fill={organ('blue')} />
      <circle cx={at.x} cy={at.y} r={r * 0.7} fill={GLOW} />
      <circle cx={at.x} cy={at.y} r={r * 0.48} fill={organ('blue')} />
      <path d={star5(at, r * 0.42)} fill={GLOW} strokeWidth={0.7} />
    </g>
  );
}

/** La estrella del pecho, que sigue la inclinacion del tronco. */
function ChestStar({ j }: { j: Joints }) {
  return <path d={star5(add(j.shoulder, j.up, -4.6), 3, j.up)} fill={GLOW} stroke={EDGE} strokeWidth={0.6} strokeLinejoin="round" />;
}

/** Franjas del uniforme sobre la tripa. */
function Stripes({ j, at = [4, 7.5, 11] }: { j: Joints; at?: number[] }) {
  return (
    <path
      d={at
        .map((k) => {
          const c = add(j.hip, j.up, k);
          return `M${pt(add(c, j.side, -4))}L${pt(add(c, j.side, 4))}`;
        })
        .join('')}
      stroke={GLOW}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  );
}

/**
 * Pelo de Hulk: una mata que cubre toda la coronilla con las puntas encima y
 * el flequillo sobre la frente. Con los huecos entre puntas por debajo de la
 * coronilla asomaba la cabeza verde entre el pelo.
 */
function HulkHair({ j, turn = 0 }: { j: Joints; turn?: number }) {
  return (
    <path
      transform={`translate(${pt(j.head)}) rotate(${turn})`}
      d="M-6.8.5Q-7.4-4-5.6-6.4L-6.2-9.4-3.8-8.2-2.8-11.6-1-9 .4-12.2 1.6-9 3.4-11.4 4.2-8 6.4-9 5.8-6.2Q7.4-4 6.8.5Q5-3.6 0-4Q-5-3.6-6.8.5Z"
      fill={EDGE}
      stroke={EDGE}
      strokeWidth={0.8}
      strokeLinejoin="round"
    />
  );
}

/**
 * Pantalon rasgado a media pierna. Cada pernera sigue su muslo con el ancho
 * de la pierna mas un margen para tapar tambien su contorno: con un trazado
 * fijo alrededor de la cadera, el verde del muslo asomaba por fuera.
 */
function Shorts({ j, limb = 8 }: { j: Joints; limb?: number }) {
  const w = limb / 2 + 2.2;
  const leg = (h: Pt, knee: Pt, outward: 1 | -1) => {
    const len = Math.hypot(knee.x - h.x, knee.y - h.y);
    const d = { x: (knee.x - h.x) / len, y: (knee.y - h.y) / len };
    const out = { x: -d.y * outward, y: d.x * outward };
    const m = lerp(h, knee, 0.62);
    const bottomOut = add(m, out, w);
    const bottomIn = add(m, out, -w);
    const teeth = [0.25, 0.5, 0.75].map((t, k) => add(lerp(bottomOut, bottomIn, t), d, k % 2 ? -2.2 : 1.6));
    return { top: add(add(h, out, w), j.up, 3), bottomOut, bottomIn, teeth };
  };
  const L = leg(j.hL, j.kneeL, 1);
  const R = leg(j.hR, j.kneeR, -1);
  const d = [
    `M${pt(L.top)}L${pt(L.bottomOut)}`,
    ...L.teeth.map((p) => `L${pt(p)}`),
    `L${pt(L.bottomIn)}L${pt(add(j.hip, j.up, -2))}L${pt(R.bottomIn)}`,
    ...[...R.teeth].reverse().map((p) => `L${pt(p)}`),
    `L${pt(R.bottomOut)}L${pt(R.top)}Z`,
  ].join('');
  return <path d={d} fill={SOFT} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />;
}

/** Ala plegada del yelmo, hacia la izquierda: borde de ataque y tres plumas. */
const WING = 'M0 0C-1.6-3.4-3.6-8.4-6.4-12.6Q-8.8-10.6-8-7.4L-6-7.6Q-7.6-4.8-6.6-2.6L-4.6-3Q-5-.4-2.6 1.2Z';
const WING_FEATHERS = 'M-6-7.6-2.4-2.8M-4.6-3-1.4-.4';

/**
 * Alas del yelmo de Thor. Van detras del cuerpo: asi el brazo del martillo
 * pasa por delante del ala en vez de enredarse con ella. SOFT y no CARD,
 * porque CARD se pierde sobre el fondo oscuro.
 */
function HelmWings({ j, turn }: { j: Joints; turn: number }) {
  const r = j.headR;
  const wing = (flip: 1 | -1) => (
    <g transform={`translate(${-flip * (r - 1)} -3) scale(${flip * 1.3} 1.3) rotate(-20)`}>
      <path d={WING} fill={SOFT} fillOpacity={0.6} stroke={EDGE} strokeWidth={0.9} />
      <path d={WING_FEATHERS} stroke={EDGE} strokeWidth={0.75} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${pt(j.head)}) rotate(${turn})`} strokeLinejoin="round">
      {wing(1)}
      {wing(-1)}
    </g>
  );
}

/**
 * Casquete del color de la silueta, algo mas ancho que la cabeza, con banda
 * metalica en el borde. La banda va a la altura de la frente: en el ecuador
 * de la cabeza se leia como una venda sobre los ojos.
 */
function Helm({ j, turn }: { j: Joints; turn: number }) {
  const r = j.headR;
  // Mas ancho que la cabeza y con cresta: del mismo color que ella, solo el
  // contorno que sobresale y la cresta lo separan como pieza propia.
  const R = r + 1.6;
  // Cuerda del casquete a la altura del borde, sobre el centro de la cabeza.
  const rim = -2.2;
  const half = Math.sqrt(R * R - rim * rim);
  return (
    <g transform={`translate(${pt(j.head)}) rotate(${turn})`} strokeLinejoin="round">
      <path d={`M${-half} ${rim}A${R} ${R} 0 0 1 ${half} ${rim}Z`} fill="currentColor" stroke={EDGE} strokeWidth={1.2} />
      <path d={`M0 ${rim - 1.2}V${-R + 0.6}`} stroke={EDGE} strokeWidth={1} strokeLinecap="round" />
      <rect x={-half - 0.3} y={rim - 1.2} width={2 * half + 0.6} height={2.4} rx={1.2} fill={SOFT} stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

/** Los cuatro discos del peto, en dos columnas. */
function Discs({ j }: { j: Joints }) {
  const at = [
    [-3, 4],
    [3, 4],
    [-3, 8.5],
    [3, 8.5],
  ].map(([u, v]) => add(add(j.shoulder, j.side, u!), j.up, -v!));
  return (
    <g fill={GLOW} stroke={EDGE} strokeWidth={0.6}>
      {at.map((p, k) => (
        <circle key={k} cx={p.x} cy={p.y} r={1.5} />
      ))}
    </g>
  );
}

const n1 = (v: number) => Math.round(v * 10) / 10;

/**
 * Capa larga de Thor, abierta hacia el lado contrario al martillo. Pegada al
 * cuerpo, como una capa corta, quedaba tapada por la silueta y no se veia.
 */
function ThorCape({ j, len = 24, still = false }: { j: Joints; len?: number; still?: boolean }) {
  const { sL, sR, hip } = j;
  const low = hip.y + len;
  const d = [
    `M${pt(sL)}L${pt(sR)}`,
    `Q${n1(sR.x + 4)} ${n1(hip.y)} ${n1(sR.x + 6)} ${n1(low - 1)}`,
    `Q${n1(sR.x - 2)} ${n1(low + 3)} ${n1(hip.x - 1)} ${n1(low)}`,
    `Q${n1(sL.x - 6)} ${n1(low + 3)} ${n1(sL.x - 15)} ${n1(low - 3)}`,
    `Q${n1(sL.x - 9)} ${n1(hip.y - 4)} ${pt(sL)}Z`,
  ].join('');
  return (
    <path
      className={still ? undefined : 'story-flutter'}
      d={d}
      fill="currentColor"
      fillOpacity={0.55}
      stroke={EDGE}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  );
}

/** Martillo: `base` es el pomo, `a` el angulo del mango (0 abajo, 180 arriba). */
function Hammer({ base, a, len = 11 }: { base: Pt; a: number; len?: number }) {
  const top = add(base, dir(a), len);
  const across = dir(a + 90);
  const c = add(top, dir(a), 3.5);
  const corner = (u: number, v: number) => add(add(c, across, u), dir(a), v);
  return (
    <g stroke={EDGE} strokeLinejoin="round">
      <path d={`M${pt(base)}L${pt(top)}`} stroke={EDGE} strokeWidth={3.6} strokeLinecap="round" />
      <path d={`M${pt(base)}L${pt(top)}`} stroke={SOFT} strokeWidth={1.8} strokeLinecap="round" />
      <path d={`M${pt(corner(-7, -4))}L${pt(corner(7, -4))}L${pt(corner(7, 4))}L${pt(corner(-7, 4))}Z`} fill={GLOW} strokeWidth={1.4} />
      <path d={`M${pt(corner(-3.5, -4))}L${pt(corner(-3.5, 4))}M${pt(corner(3.5, -4))}L${pt(corner(3.5, 4))}`} strokeWidth={1} />
    </g>
  );
}

/* --- figura que se deshace en polvo ---------------------------------------- */

const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/**
 * Cuadraditos a lo largo de un tramo, con un temblor fijo. `fade` es la parte
 * que ya se ha ido al principio y al final del tramo: hacia los pies quedan
 * menos y mas sueltos, porque el chasquido deshace de abajo arriba.
 */
function grains(points: Pt[], size: number, seed: number, fade: [number, number]) {
  const out: { p: Pt; s: number }[] = [];
  const total = points.slice(1).reduce((sum, b, n) => sum + Math.hypot(b.x - points[n]!.x, b.y - points[n]!.y), 0);
  let k = seed;
  let done = 0;
  for (let n = 0; n + 1 < points.length; n++) {
    const a = points[n]!;
    const b = points[n + 1]!;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    for (let t = 0; t <= len; t += 3) {
      k++;
      const u = (done + t) / total;
      if (((k * 61) % 100) / 100 < fade[0] + (fade[1] - fade[0]) * u) continue;
      const amp = 1.6 + 3 * u;
      const jx = ((k * 37) % 7) / 7 - 0.5;
      const jy = ((k * 53) % 5) / 5 - 0.5;
      out.push({ p: { x: a.x + ((b.x - a.x) * t) / len + jx * amp, y: a.y + ((b.y - a.y) * t) / len + jy * amp }, s: size * (0.55 + ((k * 29) % 3) * 0.15) });
    }
    done += len;
  }
  return out;
}

interface HeroProps {
  x: number;
  y: number;
  s?: number;
  pose: Pose;
  build?: Build;
  color: string;
  /** Fraccion del tronco que sigue entera, medida desde los hombros. */
  keep?: number;
  /** Un brazo que tambien se ha ido. */
  arm?: 'armL' | 'armR';
  behind?: (j: Joints) => ReactNode;
  front?: (j: Joints) => ReactNode;
  i?: number;
}

/**
 * Como la Figure del kit, pero el chasquido ya se ha llevado piernas y
 * cadera: en su sitio queda la estela de cuadraditos y otros se van con el
 * viento. La cabeza siempre queda entera, para que se lea polvo y no herida.
 */
function DustHero({ x, y, s = 1, pose, build, color, keep = 0.55, arm, behind, front, i = 0 }: HeroProps) {
  const j = joints(pose, build);
  const limb = build?.limb ?? 5.2;
  const cL = lerp(j.sL, j.hL, keep);
  const cR = lerp(j.sR, j.hR, keep);
  // Borde mordido donde el tronco empieza a deshacerse.
  const bite = [0.2, 0.4, 0.6, 0.8].map((t, n) => add(lerp(cR, cL, t), j.up, n % 2 ? 1.8 : -1.8));
  const torso = `M${pt(j.sL)}L${pt(j.sR)}L${pt(cR)}${bite.map((p) => `L${pt(p)}`).join('')}L${pt(cL)}Z`;
  const body = (paint: string, grow: number) => (
    <g stroke={paint} fill={paint} strokeLinecap="round" strokeLinejoin="round">
      <path d={torso} strokeWidth={3.4 + grow} />
      {arm !== 'armL' && <path d={`M${pt(j.sL)}L${pt(j.elbowL)}L${pt(j.handL)}`} fill="none" strokeWidth={limb + grow} />}
      {arm !== 'armR' && <path d={`M${pt(j.sR)}L${pt(j.elbowR)}L${pt(j.handR)}`} fill="none" strokeWidth={limb + grow} />}
      <path d={`M${pt(j.shoulder)}L${pt(j.neck)}`} strokeWidth={3.4 + grow} />
      <circle cx={j.head.x} cy={j.head.y} r={j.headR + grow / 2} stroke="none" />
    </g>
  );
  const seed = i * 17;
  const size = limb * 0.75;
  const left = [
    ...grains([cL, j.hL], size, seed, [0.1, 0.3]),
    ...grains([mid(cL, cR), j.hip], size, seed + 5, [0.1, 0.3]),
    ...grains([cR, j.hR], size, seed + 9, [0.1, 0.3]),
    ...grains([j.hL, j.kneeL, j.footL], size, seed + 13, [0.3, 0.8]),
    ...grains([j.hR, j.kneeR, j.footR], size, seed + 21, [0.3, 0.8]),
    ...(arm ? grains(arm === 'armL' ? [j.sL, j.elbowL, j.handL] : [j.sR, j.elbowR, j.handR], size, seed + 29, [0.2, 0.6]) : []),
  ];
  // El polvo que se va sale de las rodillas y tira hacia arriba a la derecha.
  const from = mid(j.kneeL, j.kneeR);
  const drift = [0, 1, 2, 3, 4, 5].map((n) => ({ x: from.x + 5 + n * 3.4, y: from.y - 4 - n * 3 + (n % 2) * 2 }));
  const square = (p: Pt, sz: number, key: number) => (
    <rect key={key} x={p.x - sz / 2} y={p.y - sz / 2} width={sz} height={sz} fill={color} stroke={EDGE} strokeWidth={0.6} transform={`rotate(${(key * 23) % 45} ${pt(p)})`} />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ color }}>
      {behind?.(j)}
      {body(EDGE, 2.2)}
      {body(color, 0)}
      {front?.(j)}
      {left.map((g, n) => square(g.p, g.s, n))}
      <g className="story-smoke" style={delay(i)}>
        {drift.map((p, n) => square(p, 3.2 - n * 0.3, n + 50))}
      </g>
    </g>
  );
}

/* --- paisaje ---------------------------------------------------------------- */

/** Ruinas del horizonte: x, ancho, alto. */
const RUINS: [number, number, number][] = [
  [0, 22, 34],
  [26, 14, 22],
  [236, 18, 30],
  [262, 26, 44],
  [294, 26, 26],
];

function Ruins({ fill, opacity }: { fill: string; opacity: number }) {
  return (
    <g fill={fill} fillOpacity={opacity}>
      {RUINS.map(([x, w, h]) => (
        <path key={x} d={`M${x} ${GROUND}V${GROUND - h + 6}l${w * 0.3} -6 ${w * 0.25} 8 ${w * 0.2} -5 ${w * 0.25} 6V${GROUND}Z`} />
      ))}
    </g>
  );
}

function Ground({ cracked = false }: { cracked?: boolean }) {
  return (
    <>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={cracked ? `M0 ${GROUND}H150l5 4 5-3 5 3H320` : `M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} fill="none" />
      <g fill={LINE} stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round">
        <path d="M14 126l4-7 9 1 3 6z" />
        <path d="M300 126l3-9 9 2 3 7z" />
      </g>
      <path d="M40 140q10-4 22 0M200 148q12-4 26 0" stroke={SOFT} strokeWidth={1.1} fill="none" strokeLinecap="round" />
    </>
  );
}

/* --- escenas ----------------------------------------------------------------- */

export function MarvelWin() {
  return (
    <Scene>
      {/* Amanecer detras del grupo. */}
      <g className="story-sway" style={delay(1)}>
        {[-60, -35, -12, 12, 35, 60].map((a) => (
          <path key={a} d={`M160 126 ${pt(add({ x: 160, y: 126 }, dir(180 + a - 5), 170))} ${pt(add({ x: 160, y: 126 }, dir(180 + a + 5), 170))}z`} fill={WARM} fillOpacity={0.09} />
        ))}
      </g>
      {/* Solo la mitad de arriba: el sol asoma por el horizonte. */}
      <path d="M120 126a40 40 0 0 1 80 0z" fill={WARM} fillOpacity={0.14} />
      <path d="M130 126a30 30 0 0 1 60 0z" fill={CARD} stroke={WARM} strokeOpacity={0.6} strokeWidth={1.4} />
      <Ruins fill={LINE} opacity={0.8} />
      <Ground />

      <Figure
        i={0}
        x={70}
        y={96}
        pose={IRON_WIN}
        color={organ('red')}
        behind={(j) => <Thrusters j={j} />}
        front={(j) => (
          <>
            <Armor j={j} turn={headTurn(IRON_WIN)} />
            <Repulsor at={add(j.handR, dir(150), 2)} />
          </>
        )}
      />
      <ellipse cx={70} cy={129} rx={8} ry={1.8} fill={SOFT} fillOpacity={0.35} />

      <Figure
        i={1}
        x={120}
        y={102}
        pose={{ ...POSES.hipsHands, armL: [-150, -165], head: -4 }}
        build={{ shoulders: 14 }}
        color={organ('blue')}
        front={(j) => (
          <>
            <Stripes j={j} />
            <ChestStar j={j} />
            <Shield at={add(j.handL, dir(-165), 3)} />
          </>
        )}
      />

      <Figure
        i={2}
        x={180}
        y={100.5}
        s={1.1}
        pose={{ armL: [-110, -172], armR: [110, 172], legL: [-18, -8], legR: [18, 8] }}
        build={HULK}
        color={organ('green')}
        front={(j) => (
          <>
            <Shorts j={j} />
            <HulkHair j={j} />
          </>
        )}
      />

      <Figure
        i={3}
        x={246}
        y={102}
        pose={THOR_WIN}
        build={THOR}
        color={organ('yellow')}
        behind={(j) => (
          <>
            <ThorCape j={j} />
            <HelmWings j={j} turn={headTurn(THOR_WIN)} />
          </>
        )}
        front={(j) => (
          <>
            <Discs j={j} />
            <Helm j={j} turn={headTurn(THOR_WIN)} />
            <Hammer base={add(j.handR, dir(-8), 2.5)} a={172} />
          </>
        )}
      />
      {/* Rayos del martillo alzado. */}
      <path
        className="story-flicker"
        d="M262 42l6-12-5 1 7-16M254 42l-8-10 5-1-9-12M270 50l14-6-3 4 12-3"
        stroke={WARM}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <Sparkle x={36} y={30} r={5} i={0} />
      <Sparkle x={112} y={20} r={4} i={2} />
    </Scene>
  );
}

export function MarvelLose() {
  return (
    <Scene>
      {/* El rival: una mole en SOFT que llena el fondo, sin rasgos ni guante. */}
      {/* Un solo trazado: con opacidad, las piezas solapadas se verian por separado. */}
      <path d="M149 22q17-12 34 0v18q-5 12-17 13-12-1-17-13zM157 46h18v10h-18zM90 126V88q2-30 38-34h76q36 4 38 34v38z" fill={SOFT} fillOpacity={0.28} />
      <path d="M128 126V96M204 126V96" stroke={PAPER} strokeOpacity={0.45} strokeWidth={1.6} strokeLinecap="round" />
      <Ruins fill={FAINT} opacity={0.3} />
      <Puff x={40} y={70} r={6} i={1} />
      <Ground cracked />

      {/* El escudo tirado, de canto sobre el suelo, y el martillo caido. */}
      <g transform="translate(86 126) scale(1 0.34) translate(-86 -126)">
        <Shield at={{ x: 86, y: 118 }} r={9} />
      </g>
      <Hammer base={{ x: 298, y: 121 }} a={-94} len={10} />

      <DustHero
        i={0}
        x={52}
        y={102}
        pose={IRON_LOSE}
        color={organ('red')}
        front={(j) => <Armor j={j} turn={headTurn(IRON_LOSE)} lit={false} />}
      />
      <DustHero
        i={1}
        x={124}
        y={111}
        pose={POSES.kneel}
        build={{ shoulders: 14 }}
        color={organ('blue')}
        front={(j) => (
          <>
            <Stripes j={j} at={[11, 14.5]} />
            <ChestStar j={j} />
          </>
        )}
      />
      <DustHero
        i={2}
        x={186}
        y={100.5}
        s={1.1}
        pose={HULK_LOSE}
        build={HULK}
        color={organ('green')}
        front={(j) => <HulkHair j={j} turn={headTurn(HULK_LOSE)} />}
      />
      <DustHero
        i={3}
        x={250}
        y={102}
        pose={THOR_LOSE}
        build={THOR}
        color={organ('yellow')}
        behind={(j) => (
          <>
            <ThorCape j={j} len={12} still />
            <HelmWings j={j} turn={headTurn(THOR_LOSE)} />
          </>
        )}
        front={(j) => (
          <>
            <Discs j={j} />
            <Helm j={j} turn={headTurn(THOR_LOSE)} />
          </>
        )}
      />
    </Scene>
  );
}

export const scenes = { win: MarvelWin, lose: MarvelLose };

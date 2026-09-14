import type { CSSProperties, ReactNode } from 'react';

/**
 * Piezas comunes de las escenas del telon: un escenario de 320 x 160, una
 * figura articulada y los efectos que se repiten (destellos, humo, mareo).
 * Todo toma el color de los tokens del tema. Los colores de organo solo
 * visten a lo que en la mesa es una carta de ese color: el color sigue
 * siendo informacion.
 */

export const W = 320;
export const H = 160;

export type OrganTone = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export const organ = (t: OrganTone) => `var(--organ-${t})`;

export const INK = 'var(--ink)';
export const SOFT = 'var(--ink-soft)';
export const FAINT = 'var(--ink-faint)';
export const LINE = 'var(--line)';
export const PAPER = 'var(--paper)';
export const CARD = 'var(--card)';
export const WARM = 'var(--brand-warm)';
export const DANGER = 'var(--danger)';
/** Contorno de figuras y objetos: tinta en claro, casi negro en oscuro. */
export const EDGE = 'var(--story-edge)';
/**
 * Lo que brilla o es blanco en cualquier tema: ojos encendidos, reactores,
 * estrellas. PAPER y CARD se oscurecen en tema oscuro y lo apagarian.
 */
export const GLOW = 'var(--story-glow)';

export interface Pt {
  x: number;
  y: number;
}

const rad = (d: number) => (d * Math.PI) / 180;
/** Direccion unitaria: 0 apunta abajo, 90 a la derecha, 180 arriba, -90 a la izquierda. */
export const dir = (deg: number): Pt => ({ x: Math.sin(rad(deg)), y: Math.cos(rad(deg)) });
export const add = (p: Pt, d: Pt, k: number): Pt => ({ x: p.x + d.x * k, y: p.y + d.y * k });
export const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const r1 = (n: number) => Math.round(n * 10) / 10;
/** Un punto como texto para `d`. */
export const pt = (p: Pt) => `${r1(p.x)} ${r1(p.y)}`;

/** Estrella de cuatro puntas, para destellos y mareos. */
export const star = (x: number, y: number, r: number) =>
  `M${r1(x)} ${r1(y - r)}Q${r1(x)} ${r1(y)} ${r1(x + r)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y + r)}Q${r1(x)} ${r1(y)} ${r1(x - r)} ${r1(y)}Q${r1(x)} ${r1(y)} ${r1(x)} ${r1(y - r)}Z`;

/** Retraso escalonado de una animacion: cada pieza pasa su indice. */
export const delay = (i: number) => ({ '--i': i }) as CSSProperties;

export function Scene({ children }: { children: ReactNode }) {
  return (
    <svg className="story" viewBox="0 0 320 160" aria-hidden>
      {children}
    </svg>
  );
}

/* --- figura articulada ---------------------------------------------------- */

/**
 * Postura en angulos absolutos (0 abajo, 90 derecha, 180 arriba). Cada
 * miembro son dos tramos: hombro->codo y codo->mano, cadera->rodilla y
 * rodilla->pie. "L" y "R" son la izquierda y la derecha de la pantalla.
 */
export interface Pose {
  /** Inclinacion del tronco: positivo hacia la derecha. */
  lean?: number;
  /** Giro de la cabeza respecto al tronco: positivo hacia la derecha. */
  head?: number;
  armL: [number, number];
  armR: [number, number];
  legL: [number, number];
  legR: [number, number];
}

/** Medidas del cuerpo, en unidades antes de escalar. */
export interface Build {
  torso?: number;
  shoulders?: number;
  hips?: number;
  head?: number;
  arm?: number;
  leg?: number;
  limb?: number;
}

export interface Joints {
  hip: Pt;
  shoulder: Pt;
  neck: Pt;
  head: Pt;
  headR: number;
  /** Hacia arriba del tronco y hacia su derecha: para colocar adornos. */
  up: Pt;
  side: Pt;
  sL: Pt;
  sR: Pt;
  hL: Pt;
  hR: Pt;
  elbowL: Pt;
  handL: Pt;
  elbowR: Pt;
  handR: Pt;
  kneeL: Pt;
  footL: Pt;
  kneeR: Pt;
  footR: Pt;
}

export function joints(pose: Pose, b: Build = {}): Joints {
  const torso = b.torso ?? 20;
  const sw = b.shoulders ?? 13;
  const hw = b.hips ?? 10;
  const headR = b.head ?? 6;
  const arm = b.arm ?? 10;
  const leg = b.leg ?? 12;
  const lean = pose.lean ?? 0;
  const up = dir(180 - lean);
  const side = { x: -up.y, y: up.x };
  const hip = { x: 0, y: 0 };
  const shoulder = add(hip, up, torso);
  const neck = add(shoulder, up, 2.5);
  const head = add(neck, dir(180 - lean - (pose.head ?? 0)), headR + 0.5);
  const sL = add(shoulder, side, -sw / 2);
  const sR = add(shoulder, side, sw / 2);
  const hL = add(hip, side, -hw / 2 + 1.5);
  const hR = add(hip, side, hw / 2 - 1.5);
  const elbowL = add(sL, dir(pose.armL[0]), arm);
  const handL = add(elbowL, dir(pose.armL[1]), arm - 1);
  const elbowR = add(sR, dir(pose.armR[0]), arm);
  const handR = add(elbowR, dir(pose.armR[1]), arm - 1);
  const kneeL = add(hL, dir(pose.legL[0]), leg);
  const footL = add(kneeL, dir(pose.legL[1]), leg);
  const kneeR = add(hR, dir(pose.legR[0]), leg);
  const footR = add(kneeR, dir(pose.legR[1]), leg);
  return { hip, shoulder, neck, head, headR, up, side, sL, sR, hL, hR, elbowL, handL, elbowR, handR, kneeL, footL, kneeR, footR };
}

/** Posturas de uso comun, para no recalcular angulos en cada paquete. */
export const POSES = {
  stand: { armL: [-8, -4], armR: [8, 4], legL: [-8, -4], legR: [8, 4] },
  hipsHands: { armL: [-38, 55], armR: [38, -55], legL: [-15, -8], legR: [15, 8] },
  crossed: { armL: [-12, 88], armR: [12, -88], legL: [-14, -7], legR: [14, 7] },
  cheer: { armL: [-150, -165], armR: [150, 165], legL: [-10, -4], legR: [10, 4] },
  fistL: { armL: [-160, -172], armR: [40, -55], legL: [-9, -4], legR: [9, 4] },
  fistR: { armL: [-40, 55], armR: [160, 172], legL: [-9, -4], legR: [9, 4] },
  /** Sentado en el suelo mirando a la izquierda, con la espalda caida. */
  slumped: { lean: 18, head: 40, armL: [8, 2], armR: [25, 15], legL: [-78, -98], legR: [-66, -96] },
  /** Tumbado: combinar con rot 90 (cabeza a la derecha) o -90 (a la izquierda). */
  flat: { armL: [-20, -8], armR: [25, 12], legL: [-5, -2], legR: [7, 3] },
  /** De bruces con los brazos por delante: combinar con rot 90 o -90. */
  prone: { head: -8, armL: [172, 178], armR: [186, 182], legL: [-3, -2], legR: [4, 2] },
  /** Rodilla en tierra y cabeza gacha, mirando a la izquierda. Cadera a 15 del suelo. */
  kneel: { lean: 20, head: 30, armL: [-25, -10], armR: [35, 14], legL: [-88, 2], legR: [8, 95] },
} satisfies Record<string, Pose>;

export interface FigureProps {
  /** Posicion de la cadera en la escena. */
  x: number;
  y: number;
  s?: number;
  /** Giro de toda la figura alrededor de la cadera: 90 la tumba con la cabeza a la derecha. */
  rot?: number;
  pose: Pose;
  build?: Build;
  /** Color de la silueta: `organ('red')` si es una carta, un token neutro si no. */
  color: string;
  /** Adornos detras del cuerpo (capa, alas) y delante (emblema, mascara). */
  behind?: (j: Joints) => ReactNode;
  front?: (j: Joints) => ReactNode;
  /** Clase de animacion para toda la figura (story-bob, story-drop...). */
  className?: string;
  i?: number;
}

/**
 * Silueta con contorno: se pinta el cuerpo dos veces, primero en EDGE y un
 * poco mas grueso, despues en su color. Asi se separa del fondo y de las
 * demas figuras sin dibujar cada linea de contorno a mano.
 */
export function Figure({ x, y, s = 1, rot = 0, pose, build, color, behind, front, className, i = 0 }: FigureProps) {
  const j = joints(pose, build);
  const limb = build?.limb ?? 5.2;
  const body = (paint: string, grow: number) => (
    <g stroke={paint} fill={paint} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${pt(j.hL)}L${pt(j.kneeL)}L${pt(j.footL)}`} fill="none" strokeWidth={limb + 0.8 + grow} />
      <path d={`M${pt(j.hR)}L${pt(j.kneeR)}L${pt(j.footR)}`} fill="none" strokeWidth={limb + 0.8 + grow} />
      <path d={`M${pt(j.sL)}L${pt(j.sR)}L${pt(j.hR)}L${pt(j.hL)}Z`} strokeWidth={3.4 + grow} />
      <path d={`M${pt(j.sL)}L${pt(j.elbowL)}L${pt(j.handL)}`} fill="none" strokeWidth={limb + grow} />
      <path d={`M${pt(j.sR)}L${pt(j.elbowR)}L${pt(j.handR)}`} fill="none" strokeWidth={limb + grow} />
      <path d={`M${pt(j.shoulder)}L${pt(j.neck)}`} strokeWidth={3.4 + grow} />
      <circle cx={j.head.x} cy={j.head.y} r={j.headR + grow / 2} stroke="none" />
    </g>
  );
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} style={{ color }}>
        {behind?.(j)}
        {body(EDGE, 2.2)}
        {body(color, 0)}
        {front?.(j)}
      </g>
    </g>
  );
}

/* --- efectos --------------------------------------------------------------- */

export function Sparkle({ x, y, r = 4, i = 0, color = WARM }: { x: number; y: number; r?: number; i?: number; color?: string }) {
  return <path className="story-twinkle" style={delay(i)} d={star(x, y, r)} fill={color} />;
}

/** Bocanada de humo que sube y se deshace. */
export function Puff({ x, y, r = 6, i = 0, color = FAINT }: { x: number; y: number; r?: number; i?: number; color?: string }) {
  return (
    <g className="story-smoke" style={delay(i)}>
      <circle cx={x} cy={y} r={r} fill={color} fillOpacity={0.4} />
      <circle cx={x + r * 0.8} cy={y - r * 0.5} r={r * 0.75} fill={color} fillOpacity={0.34} />
      <circle cx={x - r * 0.7} cy={y - r * 0.4} r={r * 0.6} fill={color} fillOpacity={0.3} />
    </g>
  );
}

/** Nube quieta: tres o cuatro circulos solapados. */
export function Cloud({ x, y, s = 1, color = FAINT, opacity = 0.3 }: { x: number; y: number; s?: number; color?: string; opacity?: number }) {
  return (
    <g fill={color} fillOpacity={opacity} transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={9} />
      <circle cx={11} cy={-4} r={11} />
      <circle cx={24} cy={1} r={8} />
      <rect x={-2} y={0} width={30} height={8} rx={4} />
    </g>
  );
}

/** Estrellitas que giran sobre una cabeza aturdida. */
export function Dizzy({ x, y, i = 0, color = WARM }: { x: number; y: number; i?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1 0.45)`}>
      <g className="story-orbit" style={delay(i)}>
        {[0, 120, 240].map((a) => {
          const p = dir(a);
          return <path key={a} d={star(p.x * 7, p.y * 7, 2.6)} fill={color} />;
        })}
      </g>
    </g>
  );
}

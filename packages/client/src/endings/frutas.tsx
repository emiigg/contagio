import type { ReactNode } from 'react';

import { CARD, Dizzy, EDGE, FAINT, LINE, PAPER, Puff, SOFT, Scene, Sparkle, WARM, delay, organ } from './kit';

/*
 * Frutero. Las cuatro cartas son frutas con cara: Fresa roja, Arandano azul,
 * Kiwi verde y Platano amarillo. Cada plaga va del color de la fruta que
 * ataca: gusano rojo, moho azul, pulgon verde y mosca amarilla. La Manzana
 * podrida del rival es el unico personaje neutro.
 */

const GROUND = 126;

type Mood = 'joy' | 'sad' | 'dizzy' | 'smug';

function Face({ x = 0, y = 0, s = 1, mood }: { x?: number; y?: number; s?: number; mood: Mood }) {
  const eyes = {
    joy: <path d="M-3.8 0q1.3-2 2.6 0M1.2 0q1.3-2 2.6 0" />,
    sad: (
      <>
        <circle cx={-2.5} cy={0} r={1.1} fill={EDGE} stroke="none" />
        <circle cx={2.5} cy={0} r={1.1} fill={EDGE} stroke="none" />
        <path d="M-4-2.4l2.6-.8M4-2.4l-2.6-.8" />
      </>
    ),
    dizzy: <path d="M-3.6-1.2l2.2 2.2m0-2.2-2.2 2.2M1.4-1.2l2.2 2.2m0-2.2-2.2 2.2" />,
    smug: (
      <>
        <path d="M-4.2-.6h3M1.2-.6h3" />
        <circle cx={-2.5} cy={0.5} r={0.9} fill={EDGE} stroke="none" />
        <circle cx={2.9} cy={0.5} r={0.9} fill={EDGE} stroke="none" />
      </>
    ),
  }[mood];
  const mouth = {
    joy: <path d="M-2.4 2.2q2.4 3.6 4.8 0z" fill={EDGE} />,
    sad: <path d="M-2 4q2-1.8 4 0" />,
    dizzy: <path d="M-2.6 3.4q1.3-1.2 2.6 0t2.6 0" />,
    smug: <path d="M-2 3q2.6 1.4 4.6-1.2" />,
  }[mood];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={EDGE} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {eyes}
      {mouth}
    </g>
  );
}

/** Bracitos de palo: arriba para celebrar, colgando para la derrota. */
function Arms({ w, y, up }: { w: number; y: number; up: boolean }) {
  const d = up ? `M${-w} ${y}l-5-4-1-6M${w} ${y}l5-4 1-6` : `M${-w} ${y}l-4 4 0 5M${w} ${y}l4 4 0 5`;
  const hy = up ? y - 10 : y + 9;
  const hx = up ? w + 6 : w + 4;
  return (
    <g>
      <path d={d} stroke={EDGE} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={-hx} cy={hy} r={1.6} fill={EDGE} />
      <circle cx={hx} cy={hy} r={1.6} fill={EDGE} />
    </g>
  );
}

interface FruitProps {
  x: number;
  y: number;
  s?: number;
  rot?: number;
  /** Aplastada en vertical: 1 es la fruta entera, menos es pocha. */
  squash?: number;
  mood: Mood;
  arms?: 'up' | 'down';
  className?: string;
  i?: number;
  /** Lo que va pegado a la fruta (plaga, manchas), en sus coordenadas. */
  extra?: ReactNode;
}

function Place({ x, y, s = 1, rot = 0, squash = 1, className, i = 0, children }: FruitProps & { children: ReactNode }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * squash})`}>{children}</g>
    </g>
  );
}

function Strawberry(p: FruitProps) {
  const seeds: [number, number][] = [
    [-9, -4],
    [9, -4],
    [-9.5, 3.5],
    [9.5, 3.5],
    [-5, 9],
    [5, 9],
    [0, 11.5],
    [-4.5, -8],
    [4.5, -8],
  ];
  return (
    <Place {...p}>
      {p.arms && <Arms w={12} y={-1} up={p.arms === 'up'} />}
      <path
        d="M0 14.5C-8.5 10-13.5 2-13.5-5c0-4.4 3.4-7 7.4-7 2.6 0 4.4.8 6.1.8s3.5-.8 6.1-.8c4 0 7.4 2.6 7.4 7 0 7-5 15-13.5 19.5z"
        fill={organ('red')}
        stroke={EDGE}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      {seeds.map(([sx, sy]) => (
        <ellipse key={`${sx}${sy}`} cx={sx} cy={sy} rx={0.9} ry={1.3} fill={PAPER} fillOpacity={0.85} />
      ))}
      {/* El caliz es el mismo rojo oscurecido: otro color diria otra carta. */}
      <path d="M-11-10l5-5.5 2 3.4L0-17.5l4 5.4 2-3.4 5 5.5Q0-7.5-11-10z" fill={organ('red')} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M-11-10l5-5.5 2 3.4L0-17.5l4 5.4 2-3.4 5 5.5Q0-7.5-11-10z" fill={EDGE} fillOpacity={0.35} />
      <path d="M0-16v-4" stroke={EDGE} strokeWidth={1.8} strokeLinecap="round" />
      <Face y={1} mood={p.mood} />
      {p.extra}
    </Place>
  );
}

const CROWN = 'M0-4l1.2 2.9 3.1.2-2.4 2 .8 3L0 2.5-2.7 4.1l.8-3-2.4-2 3.1-.2z';

function Blueberry(p: FruitProps) {
  return (
    <Place {...p}>
      {p.arms && <Arms w={12} y={2} up={p.arms === 'up'} />}
      <circle r={12.5} fill={organ('blue')} stroke={EDGE} strokeWidth={1.4} />
      <path d="M-8.5-4.5a9.5 9.5 0 0 1 5-5" stroke={PAPER} strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path transform="translate(1 -8.5) scale(0.9)" d={CROWN} fill={EDGE} fillOpacity={0.35} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
      <Face y={2.5} mood={p.mood} />
      {p.extra}
    </Place>
  );
}

function Kiwi(p: FruitProps) {
  const seeds = Array.from({ length: 12 }, (_, k) => (k * 360) / 12 + 15);
  const fuzz = Array.from({ length: 18 }, (_, k) => (k * 360) / 18);
  return (
    <Place {...p}>
      {p.arms && <Arms w={14.5} y={2} up={p.arms === 'up'} />}
      <g stroke={EDGE} strokeWidth={1.2} strokeLinecap="round">
        {fuzz.map((a) => {
          const c = Math.cos((a * Math.PI) / 180);
          const s = Math.sin((a * Math.PI) / 180);
          return <path key={a} d={`M${(c * 14.6).toFixed(1)} ${(s * 13.6).toFixed(1)}l${(c * 1.8).toFixed(1)} ${(s * 1.8).toFixed(1)}`} />;
        })}
      </g>
      <ellipse rx={14.5} ry={13.5} fill={organ('green')} stroke={EDGE} strokeWidth={1.4} />
      <ellipse rx={11.8} ry={10.9} fill={PAPER} fillOpacity={0.22} />
      {seeds.map((a) => (
        <ellipse
          key={a}
          transform={`rotate(${a}) translate(8.8 0)`}
          rx={1.5}
          ry={0.8}
          fill={EDGE}
        />
      ))}
      <ellipse rx={6.6} ry={5.8} fill="none" stroke={EDGE} strokeOpacity={0.45} strokeWidth={1.1} />
      <Face y={-0.6} s={0.78} mood={p.mood} />
      {p.extra}
    </Place>
  );
}

function Banana(p: FruitProps) {
  return (
    <Place {...p}>
      {p.arms && <Arms w={13} y={1} up={p.arms === 'up'} />}
      <path
        d="M-17-6C-13 11 13 13 18-9L13-11C8-1-5 1-17-6z"
        fill={organ('yellow')}
        stroke={EDGE}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d="M15.5-10l1.8-5.5h2.6" stroke={EDGE} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={-16.6} cy={-5.4} r={1.4} fill={EDGE} />
      <Face x={-0.5} y={3.2} s={0.8} mood={p.mood} />
      {p.extra}
    </Place>
  );
}

/** La Manzana podrida del rival: neutra, con sus manchas y su sonrisa. */
function RottenApple({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0-7c0-3 1.5-5 3.5-6" stroke={EDGE} strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <path d="M2.5-11.5c2.5-3 6.5-3 8.5-1.5-2.5 3-6 3-8.5 1.5z" fill={FAINT} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
      <path
        d="M0-7c-2-1.6-10-2.4-10 6 0 6 4.2 12 7 12 1.2 0 2-.8 3-.8s1.8.8 3 .8c2.8 0 7-6 7-12 0-8.4-8-7.6-10-6z"
        fill={SOFT}
        stroke={EDGE}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <circle cx={-6.5} cy={5} r={2} fill={EDGE} fillOpacity={0.35} />
      <circle cx={6.2} cy={-2} r={1.5} fill={EDGE} fillOpacity={0.35} />
      <circle cx={4.5} cy={7.5} r={1.2} fill={EDGE} fillOpacity={0.35} />
      {/* Brazos cruzados sobre la tripa: ya no tiene prisa. */}
      <path d="M-9.5 3.5q5 3 9 1M9.5 3.5q-5 3-9 1" stroke={EDGE} strokeWidth={1.5} strokeLinecap="round" fill="none" />
      <Face y={-0.8} s={0.9} mood="smug" />
    </g>
  );
}

function Worm({ x, y, s = 1, rot = 0, className, i = 0 }: { x: number; y: number; s?: number; rot?: number; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke={EDGE} strokeWidth={1.2}>
        <circle cx={0} cy={0} r={2.8} fill={organ('red')} />
        <circle cx={3.6} cy={-2.8} r={3.1} fill={organ('red')} />
        <circle cx={7.6} cy={-4.6} r={3.3} fill={organ('red')} />
        <circle cx={11.6} cy={-4} r={3.8} fill={organ('red')} />
        <circle cx={12.6} cy={-5} r={1.2} fill={PAPER} strokeWidth={0.8} />
        <path d="M11-7.6l-1-3M13.6-7.4l1.4-2.6" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Aphid({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={EDGE} strokeLinecap="round">
      <path d="M-2-1.5l-1.5-2.4M0-2l0-2.8M2-1.5l1.5-2.4M-2 1.5l-1.5 2.4M2 1.5l1.5 2.4M3.4-.6l2.8-2" strokeWidth={0.9} fill="none" />
      <ellipse rx={3.4} ry={2.4} fill={organ('green')} strokeWidth={1} />
    </g>
  );
}

function Fly({ x, y, color = organ('yellow') }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={EDGE} strokeWidth={0.9}>
      <ellipse cx={-1.6} cy={-2.6} rx={2.2} ry={1.4} transform="rotate(-30 -1.6 -2.6)" fill={PAPER} fillOpacity={0.8} />
      <ellipse cx={1.6} cy={-2.6} rx={2.2} ry={1.4} transform="rotate(30 1.6 -2.6)" fill={PAPER} fillOpacity={0.8} />
      <ellipse rx={2.6} ry={1.9} fill={color} />
    </g>
  );
}

/* --- el puesto ------------------------------------------------------------ */

const STRIPES = Array.from({ length: 10 }, (_, k) => 10 + k * 30);

function Awning({ torn = false }: { torn?: boolean }) {
  return (
    <g stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round">
      <rect x={6} y={6} width={308} height={5} rx={1.5} fill={LINE} />
      {STRIPES.map((x, k) => {
        const lit = k % 2 === 0;
        const fill = torn ? (lit ? FAINT : CARD) : lit ? WARM : CARD;
        const op = torn ? (lit ? 0.35 : 0.6) : lit ? 0.45 : 0.9;
        // Dos franjas descolgadas: el toldo se ha rasgado.
        if (torn && (k === 3 || k === 7)) {
          return (
            <path
              key={x}
              transform={`rotate(${k === 3 ? 14 : -10} ${k === 3 ? x : x + 30} 11)`}
              d={`M${x} 11h30v14l-8 5-6-6-7 7-9-4z`}
              fill={fill}
              fillOpacity={op}
            />
          );
        }
        return <path key={x} d={`M${x} 11h30v17a15 6 0 0 1-30 0z`} fill={fill} fillOpacity={op} />;
      })}
    </g>
  );
}

function Counter() {
  return (
    <g>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d="M0 144H320M40 126v34M120 126v34M200 126v34M280 126v34" stroke={SOFT} strokeOpacity={0.35} strokeWidth={1.2} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />
    </g>
  );
}

/** Cajas del fondo con fruta de atrezo, a linea y sin color de carta. */
function Crate({ x, w, empty = false }: { x: number; w: number; empty?: boolean }) {
  const n = Math.floor(w / 9);
  return (
    <g stroke={SOFT} strokeWidth={1.2} strokeOpacity={0.8}>
      {!empty &&
        Array.from({ length: n }, (_, k) => (
          <circle key={k} cx={x + 5 + k * ((w - 10) / (n - 1))} cy={GROUND - 20} r={4.4} fill={FAINT} fillOpacity={0.35} />
        ))}
      <rect x={x} y={GROUND - 18} width={w} height={18} rx={1} fill={LINE} fillOpacity={0.8} />
      <path d={`M${x} ${GROUND - 9}h${w}`} />
    </g>
  );
}

function Bowl() {
  return (
    <g stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round">
      <path d="M124 106Q126 124 160 124Q194 124 196 106z" fill={LINE} />
      <path d="M131 112q29 6 58 0" stroke={WARM} strokeWidth={2} strokeLinecap="round" fill="none" strokeOpacity={0.8} />
      <path d="M152 124h16l3 2h-22z" fill={LINE} />
    </g>
  );
}

export function FrutasWin() {
  return (
    <Scene>
      {/* Luz de la tarde entrando por debajo del toldo. */}
      <path d="M60 30 20 160h80zM260 30l40 130h-80z" fill={WARM} fillOpacity={0.08} />
      <Crate x={30} w={46} />
      <Crate x={244} w={46} />
      <path d="M18 11V126M302 11V126" stroke={SOFT} strokeWidth={4} strokeLinecap="round" />
      <Counter />

      <path d="M160 34v10" stroke={SOFT} strokeWidth={1.2} />
      <circle className="story-glow" cx={160} cy={52} r={12} fill={WARM} fillOpacity={0.28} />
      <path d="M152 50a8 6 0 0 1 16 0z" fill={SOFT} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={160} cy={52} r={2.6} fill={WARM} />
      <Awning />

      <ellipse cx={98} cy={GROUND + 1} rx={13} ry={2.4} fill={FAINT} fillOpacity={0.45} />
      <ellipse cx={226} cy={GROUND + 1} rx={16} ry={2.4} fill={FAINT} fillOpacity={0.45} />

      <path d="M124 106a36 5 0 0 1 72 0" fill={LINE} stroke={EDGE} strokeWidth={1.4} />
      <Kiwi x={144} y={93} s={1.15} mood="joy" arms="up" />
      <Blueberry x={178} y={95} s={1.1} mood="joy" arms="up" />
      <Bowl />

      <Strawberry className="story-bob" i={0} x={98} y={94} s={1.4} rot={-6} mood="joy" arms="up" />
      <Banana className="story-bob" i={2} x={226} y={100} s={1.5} rot={-8} mood="joy" arms="up" />

      <g className="story-float" style={delay(1)} fill={WARM} fillOpacity={0.75}>
        <path d="M122 60q4-5 9-2-4 5-9 2zM206 66q4-5 9-2-4 5-9 2z" />
      </g>
      <Sparkle x={62} y={62} r={4.5} i={0} />
      <Sparkle x={266} y={58} r={5} i={2} />
    </Scene>
  );
}

export function FrutasLose() {
  return (
    <Scene>
      <Crate x={30} w={46} empty />
      <g transform="rotate(-4 262 126)">
        <Crate x={244} w={46} empty />
      </g>
      <path d="M18 11V126" stroke={SOFT} strokeWidth={4} strokeLinecap="round" />
      <path d="M302 20 296 126" stroke={SOFT} strokeWidth={4} strokeLinecap="round" />
      <Counter />

      {/* La bombilla cuelga de un solo cable y parpadea. */}
      <path d="M160 34q-3 8-8 12" stroke={SOFT} strokeWidth={1.2} fill="none" />
      <path transform="rotate(38 152 47)" d="M144 52a8 6 0 0 1 16 0z" fill={FAINT} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
      <circle className="story-flicker" cx={150} cy={52} r={2.4} fill={WARM} fillOpacity={0.7} />
      <Awning torn />

      {/* Frutero boca abajo: ahora es el pedestal del rival. */}
      <g stroke={EDGE} strokeWidth={1.4} strokeLinejoin="round">
        <path d="M126 126Q128 104 160 104Q192 104 194 126z" fill={LINE} />
        <path d="M133 118q27-6 54 0" stroke={FAINT} strokeWidth={2} strokeLinecap="round" fill="none" />
        <path d="M150 104l2-3h16l2 3z" fill={LINE} />
      </g>
      <RottenApple x={160} y={89} s={1.55} />
      <g stroke={FAINT} strokeWidth={1.2} fill="none" strokeLinecap="round">
        <path d="M146 64q-2-4 1-7t0-7M176 62q2-4-1-7t0-7" />
      </g>
      <Fly x={138} y={74} color={FAINT} />
      <Fly x={184} y={82} color={FAINT} />

      <Blueberry
        i={0}
        x={46}
        y={115}
        s={1.1}
        squash={0.86}
        rot={-8}
        mood="sad"
        arms="down"
        extra={
          <g stroke={organ('blue')} strokeWidth={1.2}>
            <path d="M-12 -3a4 4 0 0 1 3-6 4 4 0 0 1 5-2 3.5 3.5 0 0 1 3 4 3 3 0 0 1-4 3 4 4 0 0 1-7 1z" fill={CARD} fillOpacity={0.9} strokeDasharray="1.6 1.2" />
            <path d="M5 8a3.5 3.5 0 0 1 5-3 3 3 0 0 1 3 4 3 3 0 0 1-4 2 3 3 0 0 1-4-3z" fill={CARD} fillOpacity={0.9} strokeDasharray="1.6 1.2" />
          </g>
        }
      />
      <Puff x={50} y={90} r={5} i={1} color={organ('blue')} />

      <Strawberry
        className="story-sink"
        i={1}
        x={98}
        y={116}
        s={1.35}
        rot={-78}
        squash={0.85}
        mood="dizzy"
        extra={
          <>
            <circle cx={7} cy={-3} r={2.2} fill={EDGE} fillOpacity={0.4} />
            <circle cx={-6} cy={6} r={2.6} fill={EDGE} fillOpacity={0.35} />
          </>
        }
      />
      <circle cx={100} cy={100} r={2.2} fill={EDGE} />
      <Worm className="story-sway" i={2} x={100} y={100} s={1.1} rot={-20} />
      <Dizzy x={80} y={101} i={0} />

      <Kiwi
        i={2}
        x={230}
        y={110}
        s={1.1}
        rot={12}
        squash={0.9}
        mood="sad"
        arms="down"
        extra={
          <>
            <Aphid x={-8} y={-10} rot={-30} />
            <Aphid x={9} y={-8} rot={35} />
            <Aphid x={12} y={6} rot={80} />
          </>
        }
      />
      <Aphid x={206} y={123} rot={-8} />

      <Banana
        i={3}
        x={282}
        y={120}
        s={1.4}
        rot={6}
        squash={0.85}
        mood="dizzy"
        extra={
          <g fill={EDGE} fillOpacity={0.4}>
            <circle cx={-10} cy={-0.5} r={1.6} />
            <circle cx={9} cy={0.5} r={1.8} />
            <circle cx={4} cy={6.5} r={1.3} />
            <circle cx={-6} cy={6} r={1.2} />
          </g>
        }
      />
      <g className="story-orbit" style={delay(1)}>
        <Fly x={272} y={96} />
        <Fly x={292} y={90} />
      </g>
    </Scene>
  );
}

export const scenes = { win: FrutasWin, lose: FrutasLose };

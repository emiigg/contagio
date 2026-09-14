import {
  Cloud,
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
  Sparkle,
  WARM,
  CARD,
  delay,
  mid,
  organ,
  pt,
  type Joints,
} from './kit';

/*
 * Heroes DC. Siluetas propias: capa, orejas del traje, rayo en el pecho y el
 * brillo del anillo bastan para reconocerlos. Nada de la S ni del murcielago
 * del pecho. Cada heroe va del color de su carta: Flash rojo, Superman azul,
 * Linterna Verde verde y Batman amarillo.
 */

const GROUND = 126;

/** Edificios del fondo: x, ancho, alto. El centro queda libre para la luna. */
const SKYLINE: [number, number, number][] = [
  [4, 26, 58],
  [32, 18, 40],
  [52, 30, 72],
  [86, 22, 50],
  [196, 24, 56],
  [222, 34, 80],
  [258, 20, 46],
  [280, 38, 64],
];

function Windows({ x, w, h, lit }: { x: number; w: number; h: number; lit: (k: number) => boolean }) {
  const out = [];
  let k = 0;
  for (let wy = GROUND - h + 6; wy < GROUND - 6; wy += 8) {
    for (let wx = x + 4; wx < x + w - 4; wx += 6) {
      k++;
      out.push(<rect key={k} x={wx} y={wy} width={2.4} height={3.4} fill={lit(k) ? WARM : PAPER} fillOpacity={lit(k) ? 0.75 : 0.5} />);
    }
  }
  return <>{out}</>;
}

function Cape({ j, wind = 1, spread = 1 }: { j: Joints; wind?: number; spread?: number }) {
  const { sL, sR, hip, hL } = j;
  const low = hip.y + 22;
  return (
    <path
      className="story-flutter"
      d={`M${pt(sL)}L${pt(sR)}Q${sR.x + 10 * wind} ${hip.y} ${sR.x + 22 * wind * spread} ${low}L${hL.x + 3 * wind} ${low + 2}Q${sL.x - 2} ${hip.y + 4} ${pt(sL)}Z`}
      fill="currentColor"
      fillOpacity={0.55}
      stroke={EDGE}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  );
}

/** Capa de Batman abierta como alas, con el borde festoneado. */
function BatCape({ j }: { j: Joints }) {
  const { sL, sR, handL, handR, hip } = j;
  const low = Math.round(hip.y + 22);
  const left = Math.round(handL.x - 7);
  const right = Math.round(handR.x + 7);
  const step = (right - left) / 4;
  let edge = '';
  for (let k = 4; k > 0; k--) {
    edge += `Q${left + step * (k - 0.5)} ${low - 5} ${left + step * (k - 1)} ${low}`;
  }
  return (
    <path
      d={`M${pt(sL)}L${pt(sR)}L${right} ${Math.round(handR.y + 2)}L${right} ${low}${edge}L${left} ${Math.round(handL.y + 2)}Z`}
      fill="currentColor"
      fillOpacity={0.55}
      stroke={EDGE}
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  );
}

/** Hacia donde mira la cabeza, para que casco y capucha giren con ella. */
function headTilt(j: Joints) {
  return Math.round((Math.atan2(j.head.x - j.neck.x, j.neck.y - j.head.y) * 180) / Math.PI);
}

/**
 * Capucha de Batman: cabeza y orejas en una sola pieza, como la silueta de
 * siempre. Con las orejas sueltas encima de la cabeza se leian como cuernos.
 */
function Cowl({ j }: { j: Joints }) {
  return (
    <path
      transform={`translate(${pt(j.head)}) rotate(${headTilt(j)})`}
      d="M-6.6 1.5L-6.6-1.5Q-6.6-4.4-5.5-5.4L-4.9-11.8-3.1-6.5Q0-7.3 3.1-6.5L4.9-11.8 5.5-5.4Q6.6-4.4 6.6-1.5L6.6 1.5Q6.6 7.2 0 7.2Q-6.6 7.2-6.6 1.5Z"
      fill="currentColor"
      stroke={EDGE}
      strokeWidth={1.3}
      strokeLinejoin="miter"
    />
  );
}

function Bolt({ j }: { j: Joints }) {
  const c = mid(j.shoulder, j.hip);
  return (
    <path
      transform={`translate(${pt(c)})`}
      d="M1.4-4.6-2.4.6h2.6L-1.4 5 3.2-.9H.6l1.6-3.7z"
      fill={WARM}
      stroke={EDGE}
      strokeWidth={0.6}
      strokeLinejoin="round"
    />
  );
}

/**
 * Casco de Flash: la cabeza entera es el casco y a cada lado sale un ala en
 * forma de rayo, hacia atras. En trazos sueltos hacia arriba parecian cuernos.
 */
function FlashHelmet({ j }: { j: Joints }) {
  const r = j.headR;
  const wing = `M${r - 0.8}-2.6L${r + 4.6}-6.4L${r + 2.8}-2.9L${r + 6.4}-3.8L${r - 0.6} 1.6Z`;
  return (
    <g transform={`translate(${pt(j.head)}) rotate(${headTilt(j)})`} fill={WARM} stroke={EDGE} strokeWidth={1} strokeLinejoin="round">
      <path d={wing} />
      <path d={wing} transform="scale(-1 1)" />
    </g>
  );
}

function Ring({ j, lit = true }: { j: Joints; lit?: boolean }) {
  return (
    <g>
      <circle className={lit ? 'story-glow' : undefined} cx={j.handR.x} cy={j.handR.y} r={lit ? 7.5 : 4} fill="currentColor" fillOpacity={lit ? 0.3 : 0.15} />
      <circle cx={j.handR.x} cy={j.handR.y} r={1.8} fill={PAPER} stroke={EDGE} strokeWidth={0.6} />
    </g>
  );
}

export function HeroesWin() {
  return (
    <Scene>
      <path className="story-sway" d="M30 160 88 14l22 5z" fill={WARM} fillOpacity={0.12} />
      <path className="story-sway" style={delay(3)} d="M292 160 244 20l-20 4z" fill={WARM} fillOpacity={0.1} />
      <circle cx={160} cy={54} r={34} fill={CARD} stroke={LINE} strokeWidth={1.5} />
      <circle className="story-glow" cx={160} cy={54} r={42} fill="none" stroke={WARM} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="2 5" />

      {SKYLINE.map(([x, w, h]) => (
        <g key={x}>
          <rect x={x} y={GROUND - h} width={w} height={h} fill={LINE} fillOpacity={0.7} />
          <Windows x={x} w={w} h={h} lit={(k) => (k * 7 + x) % 3 === 0} />
        </g>
      ))}

      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />
      <path d="M20 126v-12h10v12M25 114v-6" stroke={SOFT} strokeWidth={1.4} fill="none" strokeLinecap="round" />

      <Figure
        className="story-bob"
        i={0}
        x={86}
        y={102}
        pose={{ ...POSES.fistL, lean: -3, head: -4 }}
        color={organ('red')}
        front={(j) => (
          <>
            <Bolt j={j} />
            <FlashHelmet j={j} />
          </>
        )}
      />
      <Figure
        className="story-bob"
        i={1}
        x={134}
        y={102}
        pose={POSES.hipsHands}
        build={{ shoulders: 14.5 }}
        color={organ('blue')}
        behind={(j) => <Cape j={j} spread={1.3} />}
      />
      <Figure
        className="story-bob"
        i={2}
        x={182}
        y={102}
        pose={{ ...POSES.stand, armR: [150, 165], head: 6 }}
        color={organ('green')}
        front={(j) => <Ring j={j} />}
      />
      <Figure
        className="story-bob"
        i={3}
        x={232}
        y={102}
        pose={{ armL: [-24, -14], armR: [24, 14], legL: [-15, -8], legR: [15, 8] }}
        build={{ shoulders: 14 }}
        color={organ('yellow')}
        behind={(j) => <BatCape j={j} />}
        front={(j) => <Cowl j={j} />}
      />

      <Sparkle x={60} y={40} r={5} i={0} />
      <Sparkle x={262} y={30} r={6} i={2} />
      <Sparkle x={118} y={20} r={3.5} i={4} />
      <Sparkle x={206} y={16} r={4} i={1} />
      <Sparkle x={300} y={84} r={3.5} i={3} />
    </Scene>
  );
}

/** Edificios rotos: la parte de arriba mordida. */
const BROKEN = new Set([52, 280]);

export function HeroesLose() {
  return (
    <Scene>
      <circle cx={160} cy={46} r={30} fill={CARD} stroke={LINE} strokeWidth={1.5} opacity={0.6} />
      <Cloud x={120} y={40} s={1.6} opacity={0.35} />
      <Cloud x={20} y={22} s={1.2} />
      <Cloud x={236} y={16} s={1.3} />

      {SKYLINE.map(([x, w, h]) =>
        BROKEN.has(x) ? (
          <path
            key={x}
            d={`M${x} ${GROUND}V${GROUND - h + 14}l${w * 0.25} -10 ${w * 0.2} 12 ${w * 0.3} -16 ${w * 0.25} 18V${GROUND}Z`}
            fill={FAINT}
            fillOpacity={0.32}
          />
        ) : (
          <g key={x}>
            <rect x={x} y={GROUND - h} width={w} height={h} fill={FAINT} fillOpacity={0.28} />
            <Windows x={x} w={w} h={h} lit={() => false} />
          </g>
        ),
      )}
      <rect className="story-flicker" x={202} y={GROUND - 40} width={2.4} height={3.4} fill={WARM} />

      <Puff x={66} y={52} r={7} i={0} />
      <Puff x={298} y={62} r={6} i={2} />
      <Puff x={70} y={40} r={5} i={3} />

      {/* El rival se queda con la azotea de enfrente. */}
      <Figure
        x={239}
        y={31.5}
        s={0.62}
        pose={POSES.hipsHands}
        color={SOFT}
        behind={(j) => <Cape j={j} spread={1.2} />}
        front={(j) => (
          <path d={`M${j.head.x - 3} ${j.head.y + 1}q3 3 6 0`} stroke={PAPER} strokeWidth={1.2} fill="none" strokeLinecap="round" />
        )}
      />

      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H138l6 5 5-3 6 4H320`} stroke={SOFT} strokeWidth={1.5} fill="none" />
      <path d="M148 128l5 9-4 6 6 9-2 8" stroke={SOFT} strokeWidth={1.3} fill="none" strokeLinecap="round" />

      <g fill={LINE} stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round">
        <path d="M266 126l4-16 12-4 8 8 2 12z" />
        <path d="M284 126l4-9 10-2 6 11z" />
        <path d="M100 126l3-6 8 1 2 5z" />
      </g>
      <rect className="story-drop" style={delay(1)} x={292} y={96} width={5} height={4} fill={LINE} stroke={SOFT} strokeWidth={1} />
      <rect className="story-drop" style={delay(4)} x={178} y={100} width={4} height={3} fill={LINE} stroke={SOFT} strokeWidth={1} />

      <Figure className="story-drop" i={0} x={64} y={119} rot={-90} pose={POSES.flat}
        color={organ('red')}
        front={(j) => (
          <>
            <Bolt j={j} />
            <FlashHelmet j={j} />
          </>
        )}
      />
      <Figure
        className="story-drop"
        i={1}
        x={122}
        y={118}
        rot={90}
        pose={POSES.prone}
        build={{ shoulders: 14.5 }}
        color={organ('blue')}
        behind={(j) => <Cape j={j} wind={-0.8} spread={1.1} />}
      />
      <Figure className="story-drop" i={2} x={206} y={111} pose={POSES.kneel} color={organ('green')} front={(j) => <Ring j={j} lit={false} />} />
      <Figure
        className="story-drop"
        i={3}
        x={258}
        y={123}
        pose={POSES.slumped}
        build={{ shoulders: 14 }}
        color={organ('yellow')}
        behind={(j) => (
          <path
            d={`M${pt(j.sL)}L${pt(j.sR)}q10 8 15 ${Math.round(3 - j.sR.y)}l-20 1z`}
            fill="currentColor"
            fillOpacity={0.55}
            stroke={EDGE}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        )}
        front={(j) => <Cowl j={j} />}
      />

      <Dizzy x={34} y={108} i={0} />
      <Dizzy x={268} y={84} i={2} />
    </Scene>
  );
}

export const scenes = { win: HeroesWin, lose: HeroesLose };

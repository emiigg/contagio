import type { ReactNode } from 'react';

import {
  Cloud,
  Dizzy,
  EDGE,
  FAINT,
  LINE,
  PAPER,
  Puff,
  SOFT,
  Scene,
  Sparkle,
  WARM,
  CARD,
  DANGER,
  organ,
} from './kit';

/*
 * Jurasico. Los dinosaurios se dibujan a mano, de perfil y mirando a la
 * derecha: Tiranosaurio rojo, Pterodactilo azul, Diplodocus verde y
 * Triceratops amarillo. Cada uno tiene su postura en pie y tumbado; la silueta
 * basta para reconocerlo, asi que los ojos son un punto o una X.
 */

const GROUND = 126;

interface DinoProps {
  x: number;
  y: number;
  s?: number;
  /** Mirar a la izquierda. */
  flip?: boolean;
  color: string;
  className?: string;
}

const skin = (color: string) => ({ fill: color, stroke: EDGE, strokeWidth: 1.4, strokeLinejoin: 'round' as const });

/** Patas y brazos: trazo grueso con su contorno, como las figuras del kit. */
function Limbs({ d, color, w = 6 }: { d: string; color: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={EDGE} strokeWidth={w + 2.6} />
      <path d={d} stroke={color} strokeWidth={w} />
    </g>
  );
}

function Eye({ x, y, out = false }: { x: number; y: number; out?: boolean }) {
  if (out) {
    return <path d={`M${x - 1.8} ${y - 1.8}l3.6 3.6m0-3.6-3.6 3.6`} stroke={EDGE} strokeWidth={1.3} strokeLinecap="round" />;
  }
  return (
    <>
      <circle cx={x} cy={y} r={2.1} fill={PAPER} stroke={EDGE} strokeWidth={0.9} />
      <circle cx={x + 0.5} cy={y} r={1} fill={EDGE} />
    </>
  );
}

function Place({ x, y, s = 1, flip = false, className, children }: Omit<DinoProps, 'color'> & { children: ReactNode }) {
  return (
    <g className={className}>
      <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>{children}</g>
    </g>
  );
}

/* --- los cuatro, en pie ----------------------------------------------------- */

/** Rugiendo, con la cabeza alta y la boca abierta. */
function TRex({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <Limbs d="M5-24 9-12 7 0H13" color={color} />
      <path
        {...skin(color)}
        d="M-36-20Q-20-30-8-36Q4-42 12-44L16-52Q20-60 30-60L41-58 41-53 29-50 39-44 38-40 25-40Q18-36 16-30Q14-22 6-20Q-8-18-14-22Q-24-22-36-20Z"
      />
      <Limbs d="M-4-24-8-12-3 0H4" color={color} />
      <ellipse {...skin(color)} cx={-2} cy={-27} rx={9} ry={7} />
      <Limbs d="M17-33l5 3 2-1" color={color} w={2.6} />
      <Eye x={29} y={-54.5} />
      <path d="M25-57.6l6-1" stroke={EDGE} strokeWidth={1.2} strokeLinecap="round" />
    </Place>
  );
}

/** Visto de frente con las alas abiertas, como en su carta. */
function Ptero({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <path {...skin(color)} d="M-3-2-12-10-30-7Q-22-3-18 4-11 1-3 5ZM3-2 12-10 30-7Q22-3 18 4 11 1 3 5Z" />
      <path d="M-12-10-10 2M12-10 10 2" stroke={EDGE} strokeWidth={1} />
      <Limbs d="M-2 8l-2 5M2 8l2 5" color={color} w={1.8} />
      <ellipse {...skin(color)} cx={0} cy={2} rx={4.2} ry={7.4} />
      <path {...skin(color)} d="M-3-5-13-15-1-10.4 15-8 2-3.6Z" />
      <Eye x={1} y={-7.8} />
    </Place>
  );
}

/** El cuello bien alto: es lo que lo distingue de lejos. */
function Diplo({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <Limbs d="M-14-18V0M18-20V0" color={color} w={7} />
      <path
        {...skin(color)}
        d="M-72-16Q-50-22-30-30Q-8-44 14-38Q24-40 28-50Q32-74 38-86Q41-92 48-91L57-87Q58-83 52-82L46-81Q40-70 38-52Q36-34 26-22Q8-14-20-16Q-40-16-52-16Q-62-15-72-16Z"
      />
      <Limbs d="M-24-18V0M8-20V0" color={color} w={7} />
      <Eye x={48} y={-87.4} />
    </Place>
  );
}

function Trike({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <Limbs d="M-12-12V0M10-12V0" color={color} w={7} />
      <path {...skin(color)} d="M-34-16Q-26-20-20-26Q-6-38 14-32L22-22Q20-12 12-10H-18Q-26-12-34-16Z" />
      <Limbs d="M-19-12V0M3-12V0" color={color} w={7} />
      <ellipse {...skin(color)} cx={18} cy={-32} rx={9} ry={13} transform="rotate(-25 18 -32)" />
      <path d="M12-40q5-5 11-2" stroke={EDGE} strokeWidth={1} fill="none" strokeLinecap="round" />
      <path {...skin(color)} d="M17-30Q26-35 34-30L43-21Q39-17 33-17L22-15Q15-20 17-30Z" />
      <path {...skin(CARD)} strokeWidth={1.2} d="M26-31Q35-40 46-44Q38-35 31-28ZM35-25 39-31 38-23Z" />
      <Eye x={29} y={-26} />
    </Place>
  );
}

/* --- los cuatro, tumbados ----------------------------------------------------- */

function TRexDown({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <path
        {...skin(color)}
        d="M-40-3Q-24-10-8-16Q6-20 16-16Q22-13 26-12Q30-17 40-15L48-10 48-7 36-6 46-3 46 0H28Q14 0-10 0Q-26 0-40-3Z"
      />
      <Limbs d="M-8-7-15-3.4" color={color} w={4.6} />
      <Limbs d="M-15-3.4-23-4.6M-15-3.4-22-1.2" color={color} w={2} />
      <ellipse {...skin(color)} cx={-4} cy={-9} rx={9} ry={6} />
      <Limbs d="M18-9l4 4" color={color} w={2.6} />
      <Eye x={38} y={-11.4} out />
    </Place>
  );
}

/**
 * Boca arriba: las dos alas abiertas y planas sobre el suelo, las patas al
 * aire y la cabeza caida de lado por delante. Solo la punta de un ala se
 * levanta, doblada por la muneca, para que se note el golpe.
 */
function PteroDown({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <path {...skin(color)} d="M-4-5-17-7.5-42-2Q-28-.6-20 0Q-11-1-4 0Z" />
      <path d="M-17-7.5-15-.6" stroke={EDGE} strokeWidth={1} />
      <path {...skin(color)} d="M4-5 19-9 31-21Q28-11 23-4Q13-1 4 0Z" />
      <path d="M19-9 22-3" stroke={EDGE} strokeWidth={1} />
      <Limbs d="M-2.4-8-4-14.6l-2.4-.6M2.4-8 4.6-14.4l2.4-.4" color={color} w={1.8} />
      <ellipse {...skin(color)} cx={0} cy={-4.6} rx={7} ry={4.6} />
      <path {...skin(color)} d="M0 1.5Q5 .5 8 2.5L16-.6 9.4 5Q7.4 8 2 8L-18 6.6-1 4Z" />
      <Eye x={4} y={4.6} out />
    </Place>
  );
}

function DiploDown({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <path
        {...skin(color)}
        d="M-72-2Q-50-6-30-16Q-8-30 14-24Q28-20 36-12Q44-5 58-6Q64-9 70-7L78-3Q78 0 74 0H60Q44 0 36 0H-20Q-50 0-72-2Z"
      />
      <Limbs d="M-20-6-28-2H-34M10-6 15-2H21" color={color} w={5.4} />
      <Eye x={68} y={-4} out />
    </Place>
  );
}

function TrikeDown({ color, ...at }: DinoProps) {
  return (
    <Place {...at}>
      <path {...skin(color)} d="M-34-3Q-26-8-20-14Q-6-26 14-20L20-12Q18-2 12 0H-20Q-28 0-34-3Z" />
      <Limbs d="M-12-6-20-2H-26M6-6 11-2H16" color={color} w={5.4} />
      <ellipse {...skin(color)} cx={16} cy={-15} rx={8} ry={12} transform="rotate(-15 16 -15)" />
      <path {...skin(color)} d="M18-14Q26-18 33-13L42-3Q38 0 32 0H22Q15-5 18-14Z" />
      <path {...skin(CARD)} strokeWidth={1.2} d="M26-13Q36-18 47-17Q38-11 30-9ZM36-7 40-11 39-4Z" />
      <Eye x={28} y={-9} out />
    </Place>
  );
}

/* --- el valle ----------------------------------------------------------------- */

/** Helecho: una fronda en zigzag con su nervio, en tono neutro. */
function Fern({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path
        d="M0 0-8-10-4-12-12-20-6-21-11-30-4-30-6-38 0-44 6-38 4-30 11-30 6-21 12-20 4-12 8-10Z"
        fill={SOFT}
        fillOpacity={0.35}
        stroke={SOFT}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <path d="M0 2V-40" stroke={SOFT} strokeWidth={1.3} strokeLinecap="round" />
    </g>
  );
}

const HILL = 'M0 126Q24 106 70 106Q160 102 250 106Q296 108 320 120V126Z';
const VOLCANO = 'M-8 126 26 72H44L80 126Z';

function Ground({ cracked = false }: { cracked?: boolean }) {
  return (
    <>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />
      {cracked && (
        <>
          <path d="M214 126l-4 7 5 5-3 8 4 6-2 8" fill="none" stroke={WARM} strokeOpacity={0.6} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M214 126l-4 7 5 5-3 8 4 6-2 8" fill="none" stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round" />
        </>
      )}
    </>
  );
}

export function JurasicoWin() {
  return (
    <Scene>
      {/* Atardecer: el sol se pone detras de la colina. */}
      {/* Medio disco: la colina y el suelo son translucidos y un sol entero se veria a traves. */}
      <path className="story-glow" d="M108 104A56 56 0 0 1 220 104" fill="none" stroke={WARM} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="2 5" />
      <path d="M118 104A46 46 0 0 1 210 104Z" fill={WARM} fillOpacity={0.2} />
      <path d="M130 104A34 34 0 0 1 198 104Z" fill={WARM} fillOpacity={0.35} />
      <g fill={WARM} fillOpacity={0.22}>
        <rect x={214} y={44} width={70} height={4} rx={2} />
        <rect x={236} y={54} width={52} height={3.4} rx={1.7} />
        <rect x={30} y={36} width={56} height={3.4} rx={1.7} />
      </g>

      <path d={VOLCANO} fill={LINE} fillOpacity={0.8} />
      <path d="M26 72Q35 76 44 72" stroke={SOFT} strokeWidth={1.3} fill="none" />
      <Cloud x={28} y={58} s={0.5} opacity={0.35} />
      <path d="M0 126V112Q30 104 62 108T140 106 230 104 320 102V126Z" fill={LINE} fillOpacity={0.45} />
      <path d={HILL} fill={LINE} fillOpacity={0.75} stroke={SOFT} strokeWidth={1.4} />

      {/* El pterodactilo da vueltas sobre la manada. */}
      <path d="M100 42A44 13 0 1 1 186 22" fill="none" stroke={SOFT} strokeOpacity={0.6} strokeWidth={1.2} strokeDasharray="2 4" strokeLinecap="round" />
      <Ptero className="story-float" x={144} y={30} s={1.1} color={organ('blue')} />

      <TRex x={84} y={107} color={organ('red')} />
      <path className="story-glow" d="M130 48q6 6 2 14M137 43q8 9 2 21" stroke={SOFT} strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <Diplo x={198} y={105} s={0.9} color={organ('green')} />
      <Trike x={286} y={106} s={0.95} flip color={organ('yellow')} />

      <Ground />
      <Fern x={14} y={132} s={0.8} rot={-14} />
      <Fern x={26} y={134} s={0.6} rot={12} />
      <Fern x={304} y={134} s={0.75} rot={10} />
      <Fern x={160} y={140} s={0.45} rot={-6} />

      <Sparkle x={112} y={14} r={4} i={0} />
      <Sparkle x={300} y={44} r={3.5} i={2} />
    </Scene>
  );
}

export function JurasicoLose() {
  return (
    <Scene>
      <path d="M130 104A34 34 0 0 1 198 104Z" fill={FAINT} fillOpacity={0.18} />

      {/* El meteorito cruza el cielo: estela de luz y roca con contorno. */}
      <path d="M104 30 322-8V14L118 50Z" fill={WARM} fillOpacity={0.14} />
      <path d="M108 34 318 0 V8L116 46Z" fill={WARM} fillOpacity={0.28} />
      <circle className="story-glow" cx={112} cy={40} r={14} fill={WARM} fillOpacity={0.35} />
      <path {...skin(SOFT)} d="M103 38l4-8 7-3 8 3 3 7-2 8-7 4-8-1z" />
      <circle cx={110} cy={41} r={2} fill="none" stroke={EDGE} strokeWidth={1.1} />
      <circle cx={117} cy={34} r={1.4} fill="none" stroke={EDGE} strokeWidth={1.1} />

      <Cloud x={176} y={20} s={1.4} opacity={0.3} />
      <Cloud x={250} y={40} s={1.1} opacity={0.3} />

      {/* El volcan, despierto: lava y humo. */}
      <path d={VOLCANO} fill={LINE} fillOpacity={0.8} />
      <path d="M27 72Q30 86 26 94M36 73Q40 84 36 100M43 72Q48 80 52 90" stroke={WARM} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <path d="M26 72Q35 58 44 72Z" fill={WARM} fillOpacity={0.8} />
      <path d="M31 70Q35 64 39 70Z" fill={DANGER} fillOpacity={0.7} />
      <Cloud x={6} y={40} s={1.3} color={SOFT} opacity={0.35} />
      <Puff x={36} y={52} r={7} i={0} />
      <Puff x={52} y={40} r={5} i={2} />
      <g fill={FAINT}>
        {(
          [
            [80, 20],
            [150, 66],
            [198, 58],
            [236, 18],
            [284, 70],
            [70, 64],
            [300, 30],
          ] as const
        ).map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={1.3} />
        ))}
      </g>

      <path d="M0 126V112Q30 104 62 108T140 106 230 104 320 102V126Z" fill={LINE} fillOpacity={0.45} />
      {/* Otra manada sigue en pie a lo lejos: la del rival. */}
      <Diplo x={296} y={104} s={0.3} color={SOFT} />
      <path d={HILL} fill={LINE} fillOpacity={0.75} stroke={SOFT} strokeWidth={1.4} />

      <TRexDown x={84} y={106} color={organ('red')} />
      <DiploDown x={206} y={105} s={0.85} color={organ('green')} />

      <Ground cracked />
      <PteroDown x={150} y={146} s={1.25} color={organ('blue')} />
      <TrikeDown x={262} y={150} s={0.9} flip color={organ('yellow')} />
      <Fern x={14} y={140} s={0.6} rot={-60} />

      <Dizzy x={120} y={82} i={0} />
      <Dizzy x={240} y={128} i={2} />
    </Scene>
  );
}

export const scenes = { win: JurasicoWin, lose: JurasicoLose };

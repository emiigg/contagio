import {
  CARD,
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
  delay,
  organ,
  star,
  type Joints,
  type OrganTone,
} from './kit';

/*
 * Grimorio. Los cuatro elementos son orbes del color de su carta: Fuego rojo,
 * Agua azul, Bosque verde y Rayo amarillo, cada uno con su simbolo dentro. La
 * hechicera es neutra: no es una carta, es quien las junta.
 */

const GROUND = 126;

type Element = 'fire' | 'water' | 'forest' | 'bolt';
const TONE: Record<Element, OrganTone> = { fire: 'red', water: 'blue', forest: 'green', bolt: 'yellow' };

/** Simbolo de cada elemento, centrado en el origen y de unas 18 unidades. */
function ElementMark({ kind }: { kind: Element }) {
  const paint = { fill: 'currentColor', stroke: EDGE, strokeWidth: 1.2, strokeLinejoin: 'round' as const };
  switch (kind) {
    case 'fire':
      return (
        <>
          <path {...paint} d="M0 9C-6 9-8 4-7 0-6-4-2-5-3-10 1-7 3-4 2-1 3-3 4-4 4-6 7-3 8 1 7 4 6 7 3 9 0 9Z" />
          <path d="M0 8C-2.6 8-3.2 5.6-2.4 4-1.6 2.6-.4 2 0 0 1.4 2 2.6 3.4 2.4 5 2.2 6.8 1.4 8 0 8Z" fill={PAPER} fillOpacity={0.7} />
        </>
      );
    case 'water':
      return (
        <>
          <path {...paint} d="M0-10C5-4 7.5 0 7.5 3.5A7.5 7.5 0 0 1-7.5 3.5C-7.5 0-5-4 0-10Z" />
          <path d="M-4.4 3.6C-2.8 2.4-1.4 2.4 0 3.6S2.8 4.8 4.4 3.6" stroke={PAPER} strokeWidth={1.3} fill="none" strokeLinecap="round" />
        </>
      );
    case 'forest':
      return (
        <>
          <path d="M0 9V-1M0 3.4-3 .6M0 1 2.6-1.4" stroke={EDGE} strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <path
            {...paint}
            d="M0-10A5 5 0 0 1 5-5.6 4.4 4.4 0 0 1 6 2.4 3.6 3.6 0 0 1 2.4 4H-2.4A3.6 3.6 0 0 1-6 2.4 4.4 4.4 0 0 1-5-5.6 5 5 0 0 1 0-10Z"
          />
          <path d="M0 9V4" stroke={EDGE} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M-5 9.4H5" stroke={EDGE} strokeWidth={1.4} strokeLinecap="round" />
        </>
      );
    case 'bolt':
      return <path {...paint} d="M2.4-10-5.6 1.4H-.4L-2.6 10 5.8-2H.6L2.4-10Z" />;
  }
}

/** Orbe de cristal con su elemento. Apagado: vidrio sin brillo, grieta y una esquirla al lado. */
function Orb({
  x,
  y,
  kind,
  broken = false,
  shard = 1,
  i,
  className,
}: {
  x: number;
  y: number;
  kind: Element;
  broken?: boolean;
  /** Lado de la esquirla: 1 a la derecha, -1 a la izquierda. */
  shard?: number;
  i?: number;
  className?: string;
}) {
  const r = 12;
  return (
    <g className={className} style={i === undefined ? undefined : delay(i)}>
      <g transform={`translate(${x} ${y})`} style={{ color: organ(TONE[kind]) }}>
        {!broken && <circle r={r + 5} fill="currentColor" fillOpacity={0.18} />}
        <circle r={r} fill="currentColor" fillOpacity={broken ? 0.12 : 0.3} stroke={EDGE} strokeWidth={1.4} />
        <ElementMark kind={kind} />
        {broken ? (
          <>
            <path d="M-4-11.4-1-5-5-1 1 3-2 7 1 11.6" stroke={EDGE} strokeWidth={1.3} fill="none" strokeLinejoin="round" />
            <path transform={`scale(${shard} 1)`} d="M14 11 19 7 21 12Z" fill="currentColor" fillOpacity={0.3} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
          </>
        ) : (
          <path d="M-8.4-3.4A8.6 8.6 0 0 1-3.4-8.4" stroke={PAPER} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
}

/** Calavera de la maldicion, del color del elemento al que ha caido encima. */
function Curse({ x, y, tone }: { x: number; y: number; tone: OrganTone }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0-7C-5-7-7.4-3.6-7.4 0-7.4 2.6-6 4.2-4.4 5V8H4.4V5C6 4.2 7.4 2.6 7.4 0 7.4-3.6 5-7 0-7Z"
        fill={organ(tone)}
        stroke={EDGE}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
      <circle cx={-2.8} cy={0} r={1.9} fill={EDGE} />
      <circle cx={2.8} cy={0} r={1.9} fill={EDGE} />
      <path d="M-1.4 8V5.6M1.4 8V5.6" stroke={EDGE} strokeWidth={1} />
      <path d="M0 10Q-3 12 0 14T0 18" stroke={organ(tone)} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Rune({ x, y }: { x: number; y: number }) {
  return (
    <path
      transform={`translate(${x} ${y})`}
      d="M0-5V5M-3-1.4 3-3.6M-3 2.6 3 .4"
      stroke={WARM}
      strokeWidth={1.4}
      strokeLinecap="round"
      fill="none"
      opacity={0.85}
    />
  );
}

/** Tunica hasta los pies y sombrero de punta: bastan para leer "hechicera". */
function Robe({ j, flare = 8, length = 22, fill = 'currentColor' }: { j: Joints; flare?: number; length?: number; fill?: string }) {
  const hem = j.hip.y + length;
  return (
    <>
      <path
        d={`M${j.sL.x} ${j.sL.y}L${j.sR.x} ${j.sR.y}L${j.hR.x + flare} ${hem}Q${j.hip.x} ${hem + 2} ${j.hL.x - flare} ${hem}Z`}
        fill={fill}
        stroke={EDGE}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d={`M${j.hL.x - 3} ${j.hip.y - 2}H${j.hR.x + 3}`} stroke={PAPER} strokeWidth={1.4} strokeLinecap="round" />
      <path d={star(j.hip.x + 3, j.hip.y + Math.min(11, length - 4), 3)} fill={WARM} />
    </>
  );
}

function Hat({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M-7 0Q-2-9 6-17Q3-8 7 0Z" fill="currentColor" stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <ellipse cx={0} cy={0.4} rx={11} ry={2.6} fill="currentColor" stroke={EDGE} strokeWidth={1.3} />
      <path d={star(0.6, -6, 2.4)} fill={WARM} />
    </g>
  );
}

/** Libro abierto visto de frente, con el lomo en el origen. */
function Book({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0 0Q-7-4-15-2V5Q-7 3 0 7Q7 3 15 5V-2Q7-4 0 0Z" fill={SOFT} stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M0 0Q-7-5-14-3.4V3.6Q-7 2 0 5.6Q7 2 14 3.6V-3.4Q7-5 0 0Z" fill={CARD} stroke={EDGE} strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M0 0V5.6M-11-1.4Q-7-2.4-3.4-.6M-11 1.6Q-7 .6-3.4 2.4M3.4-.6Q7-2.4 11-1.4M3.4 2.4Q7 .6 11 1.6" stroke={FAINT} strokeWidth={0.9} fill="none" />
    </g>
  );
}

function Sky({ lit }: { lit: boolean }) {
  return (
    <>
      <path d="M48 14A16 16 0 1 0 64 40 13 13 0 0 1 48 14Z" fill={CARD} stroke={LINE} strokeWidth={1.5} opacity={lit ? 1 : 0.5} />
      {(
        [
          [22, 20, 2.6],
          [86, 12, 2.2],
          [256, 14, 2.6],
          [300, 34, 2.2],
          [276, 76, 2],
          [30, 74, 2],
        ] as const
      ).map(([x, y, r]) => (
        <path key={x} d={star(x, y, r)} fill={lit ? WARM : FAINT} opacity={lit ? 0.8 : 0.5} />
      ))}
      <path d="M0 126V112Q30 98 62 106T128 104 210 102 268 98 320 104V126Z" fill={LINE} fillOpacity={0.55} />
      <path d="M0 126V118Q50 108 100 116T220 112 320 116V126Z" fill={LINE} fillOpacity={0.5} />
    </>
  );
}

function Ground({ cracked = false }: { cracked?: boolean }) {
  return (
    <>
      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={cracked ? `M0 ${GROUND}H152l4 4 4-3 4 3 4-4H320` : `M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} fill="none" />
      {cracked && <path d="M160 127l3 8-4 6 5 8-2 11" stroke={SOFT} strokeWidth={1.3} fill="none" strokeLinecap="round" />}
    </>
  );
}

/** Hiladas de piedra de la torre: lineas horizontales con juntas al tresbolillo. */
function Stones({ top }: { top: number }) {
  const rows = [];
  for (let y = top + 8, k = 0; y < GROUND - 2; y += 8, k++) {
    const off = k % 2 ? 6 : 0;
    // El muro se abre 6 unidades de la almena al suelo: la hilada no puede salirse de el.
    const edge = 141 - ((y - 80) * 6) / 46;
    rows.push(<path key={y} d={`M${edge} ${y}H${320 - edge}M${148 + off} ${y}v8M${166 + off} ${y}v8`} stroke={LINE} strokeWidth={1.1} />);
  }
  return <>{rows}</>;
}

export function GrimorioWin() {
  return (
    <Scene>
      <Sky lit />
      <path d="M160 70 118 4H202Z" fill={WARM} fillOpacity={0.1} />

      {/* Torre */}
      <path d="M134 126 140 80H180L186 126Z" fill={CARD} stroke={SOFT} strokeWidth={1.4} strokeLinejoin="round" />
      <Stones top={80} />
      <path d="M152 126V116A8 8 0 0 1 168 116V126Z" fill={CARD} />
      <path d="M152 126V116A8 8 0 0 1 168 116V126Z" fill={FAINT} fillOpacity={0.5} stroke={SOFT} strokeWidth={1.2} />

      <ellipse cx={160} cy={46} rx={72} ry={30} fill="none" stroke={WARM} strokeOpacity={0.45} strokeWidth={1.2} strokeDasharray="2 5" />

      <Figure
        x={160}
        y={58}
        s={0.9}
        pose={{ ...POSES.cheer, armL: [-140, -160], armR: [140, 160] }}
        color={SOFT}
        front={(j) => (
          <>
            <Robe j={j} />
            <g transform={`translate(${j.head.x} ${j.head.y - j.headR + 2})`}>
              <Hat x={0} y={0} />
            </g>
          </>
        )}
      />

      {/* Almena delante de los pies: la hechicera esta en lo alto, no flotando. */}
      <path d="M130 80V66H140V72H180V66H190V80Z" fill={CARD} stroke={SOFT} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M130 80H190" stroke={SOFT} strokeWidth={1.4} />

      {/* El grimorio flota delante de la torre: encima de la almena tapaba a la hechicera. */}
      <ellipse className="story-glow" cx={160} cy={96} rx={22} ry={11} fill={WARM} fillOpacity={0.4} />
      <Book x={160} y={96} />
      <path d="M146 88l-4-5M160 85v-6M174 88l4-5" stroke={WARM} strokeWidth={1.4} strokeLinecap="round" />

      <Orb className="story-float" i={0} x={118} y={22} kind="fire" />
      <Orb className="story-float" i={1} x={202} y={22} kind="water" />
      <Orb className="story-float" i={2} x={90} y={58} kind="forest" />
      <Orb className="story-float" i={3} x={230} y={58} kind="bolt" />

      <Rune x={58} y={92} />
      <Rune x={266} y={96} />
      <Rune x={298} y={62} />
      <Sparkle x={184} y={36} r={4} i={1} />

      <Ground />
    </Scene>
  );
}

export function GrimorioLose() {
  return (
    <Scene>
      <Sky lit={false} />

      {/* Torre desmochada: la almena y media corona se han venido abajo. */}
      <path d="M134 126 140 80H150L155 86 160 79 166 88 172 82 176 90 180 86 186 126Z" fill={CARD} stroke={SOFT} strokeWidth={1.4} strokeLinejoin="round" />
      <Stones top={88} />
      <path d="M155 104V96A5 5 0 0 1 165 96V104Z" fill={FAINT} fillOpacity={0.6} stroke={SOFT} strokeWidth={1.2} />
      <path d="M152 126V116A8 8 0 0 1 168 116V126Z" fill={CARD} />
      <path d="M152 126V116A8 8 0 0 1 168 116V126Z" fill={FAINT} fillOpacity={0.5} stroke={SOFT} strokeWidth={1.2} />
      <path d="M166 88 162 96 168 102 163 110 167 116" stroke={EDGE} strokeWidth={1.3} fill="none" strokeLinejoin="round" />

      <g fill={CARD} stroke={SOFT} strokeWidth={1.3} strokeLinejoin="round">
        <path d="M190 126V118H200V126Z" />
        <path className="story-drop" style={delay(2)} d="M201 126 203 119 211 121 209 126Z" />
        <path d="M112 126V121H120V126Z" />
      </g>

      {/* La nube de la maldicion del rival: neutra, con ojos. */}
      <g className="story-float">
        <Cloud x={122} y={26} s={2.4} color={SOFT} opacity={0.5} />
        <path d="M140 40q2 10-2 16M162 42q-2 10 3 18M182 40q3 8-1 14" stroke={SOFT} strokeOpacity={0.55} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d="M137 18l12 4q-2 5-7 4t-5-8ZM171 18l-12 4q2 5 7 4t5-8Z" fill={PAPER} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
        <circle cx={144} cy={23} r={1.8} fill={EDGE} />
        <circle cx={164} cy={23} r={1.8} fill={EDGE} />
        <path d="M145 34q9-5 18 0" stroke={EDGE} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      </g>

      {/*
        La hechicera, boca arriba al pie de su torre: la cabeza a la izquierda, un
        brazo estirado por el suelo hacia el grimorio y una rodilla en alto. La
        tunica corta y mas clara que el cuerpo deja ver que hay piernas debajo.
      */}
      <Figure
        className="story-drop"
        i={0}
        x={158}
        y={116}
        s={0.9}
        rot={-90}
        pose={{ head: -6, armL: [174, 178], armR: [12, 4], legL: [-4, -2], legR: [40, -20] }}
        build={{ head: 6.5 }}
        color={SOFT}
        front={(j) => (
          <>
            <Robe j={j} flare={5} length={13} fill={FAINT} />
            {/* Ojos en X mirando al cielo, que con rot -90 es el lado derecho de la figura. */}
            <path
              d={[-1.8, 1.8]
                .map((dy) => {
                  const cx = j.head.x + 2.6;
                  const cy = j.head.y + dy;
                  return `M${cx - 1.3} ${cy - 1.3}l2.6 2.6m0-2.6-2.6 2.6`;
                })
                .join('')}
              stroke={EDGE}
              strokeWidth={1.1}
              strokeLinecap="round"
            />
          </>
        )}
      />
      <Dizzy x={132} y={103} i={1} />
      <g className="story-drop" style={delay(1)} color={SOFT}>
        <Hat x={200} y={121} rot={14} />
      </g>

      <Book x={105} y={119} rot={-10} />
      <Puff x={103} y={106} r={5} i={0} />
      <Puff x={109} y={98} r={4} i={2} />

      <Orb x={30} y={114} kind="fire" broken />
      <Orb x={70} y={114} kind="water" broken shard={-1} />
      <Orb x={250} y={114} kind="forest" broken />
      <Orb x={292} y={114} kind="bolt" broken />
      <Curse x={30} y={90} tone="red" />
      <Curse x={70} y={90} tone="blue" />
      <Curse x={250} y={90} tone="green" />
      <Curse x={292} y={90} tone="yellow" />

      <Ground cracked />
    </Scene>
  );
}

export const scenes = { win: GrimorioWin, lose: GrimorioLose };

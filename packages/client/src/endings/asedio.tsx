import {
  CARD,
  Cloud,
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
  Sparkle,
  WARM,
  add,
  delay,
  dir,
  organ,
  pt,
  type Joints,
  type Pt,
} from './kit';

/*
 * Asedio. El castillo es el escenario y sus cuatro baluartes son los
 * personajes: la armeria roja, el pozo azul, el huerto verde y el tesoro
 * amarillo, delante de la muralla. La muralla y quien la defiende van en
 * neutro para que el color siga siendo de las cartas.
 */

const GROUND = 126;
const r1 = (n: number) => Math.round(n * 10) / 10;
/** Metal de las armas: oscuro en claro y claro en oscuro, siempre visible. */
const METAL = SOFT;

/** Bloque de muralla con almenas: de x0 a x1, con el adarve en `top`. */
function crenels(x0: number, x1: number, top: number, h = 5, gap = 4, w = 5) {
  const n = Math.max(1, Math.round((x1 - x0 + gap) / (w + gap)));
  const mw = (x1 - x0 - (n - 1) * gap) / n;
  let d = `M${x0} ${GROUND}V${top - h}`;
  let x = x0;
  for (let k = 0; k < n; k++) {
    x += mw;
    d += `H${r1(x)}`;
    if (k < n - 1) {
      d += `V${top}H${r1(x + gap)}V${top - h}`;
      x += gap;
    }
  }
  return `${d}V${GROUND}Z`;
}

/** Piedra con fondo opaco: lo que queda detras (el caballero) no se transparenta. */
function Masonry({ d, dim = false }: { d: string; dim?: boolean }) {
  return (
    <g strokeLinejoin="round">
      <path d={d} fill={PAPER} />
      <path d={d} fill={dim ? FAINT : LINE} fillOpacity={dim ? 0.3 : 0.8} stroke={FAINT} strokeWidth={1.2} />
    </g>
  );
}

/** Juntas sueltas de sillares: sin ellas la muralla parece un carton. */
function Ashlar({ marks }: { marks: [number, number][] }) {
  return <path d={marks.map(([x, y]) => `M${x} ${y}h6`).join('')} stroke={FAINT} strokeWidth={1} strokeLinecap="round" />;
}

function Helm({ j, plume }: { j: Joints; plume: boolean }) {
  const { head: c, headR: r } = j;
  return (
    <>
      {plume && (
        <path d={`M${c.x - 1} ${c.y - r}q3 -7 9 -6q-3 1 -4 5`} fill={WARM} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
      )}
      <path d={`M${c.x - r + 1.5} ${c.y - 0.5}H${c.x + r - 1.5}`} stroke={PAPER} strokeWidth={1.6} strokeLinecap="round" />
      <path d={`M${c.x} ${c.y + 1.5}v3.5`} stroke={PAPER} strokeWidth={1.2} strokeLinecap="round" />
    </>
  );
}

/** Espada que sale de la mano en la direccion `deg`; `len` corto la deja partida. */
function Sword({ at, deg, len = 16 }: { at: Pt; deg: number; len?: number }) {
  const d = dir(deg);
  const base = add(at, d, 2);
  const tip = add(at, d, len);
  const side = { x: -d.y, y: d.x };
  const blade = `M${pt(base)}L${pt(tip)}`;
  return (
    <g strokeLinecap="round">
      <path d={blade} stroke={EDGE} strokeWidth={3.6} />
      <path d={blade} stroke={METAL} strokeWidth={1.8} />
      <path d={`M${pt(add(base, side, -4))}L${pt(add(base, side, 4))}`} stroke={EDGE} strokeWidth={2.2} />
    </g>
  );
}

/** Llama con el pie en (x, y). */
function Flame({ x, y, s = 1, className, i = 0 }: { x: number; y: number; s?: number; className?: string; i?: number }) {
  return (
    <g className={className} style={delay(i)}>
      <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
        <path d="M-6 0C-9-6-4-10-3-17C0-12 2-11 2-7C3-10 4-11 4-14C8-8 9-3 6 0Z" fill={WARM} fillOpacity={0.85} stroke={EDGE} strokeWidth={1.2} />
        <path d="M-2.5 0C-3.5-3-1-5 0-8C1.5-5 3-3 2 0Z" fill={DANGER} fillOpacity={0.55} />
      </g>
    </g>
  );
}

function Stone({ x, y, r = 4.5 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={LINE} stroke={SOFT} strokeWidth={1.2} />;
}

const EDGED = { stroke: EDGE, strokeWidth: 1.4, strokeLinejoin: 'round' as const };

/* --- los cuatro baluartes en pie ------------------------------------------ */

function Armory() {
  const red = organ('red');
  return (
    <g>
      <rect x={16} y={90} width={4} height={36} fill={red} {...EDGED} />
      <rect x={56} y={90} width={4} height={36} fill={red} {...EDGED} />
      {/* lanza, espada y hacha apoyadas en el soporte */}
      <path d="M27 124V86" stroke={EDGE} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M27 124V86" stroke={FAINT} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M27 75l-4 11h8z" fill={METAL} {...EDGED} />
      <path d="M38 124v-10M33 112h10" stroke={EDGE} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M36.5 111V83l1.5-4 1.5 4v28z" fill={METAL} {...EDGED} />
      <path d="M49 124V84" stroke={EDGE} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M49 124V84" stroke={FAINT} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M49 84q9-3 10 6q-1 9-10 6z" fill={METAL} {...EDGED} />
      <rect x={14} y={95} width={48} height={4} rx={1} fill={red} {...EDGED} />
      <rect x={14} y={112} width={48} height={4} rx={1} fill={red} {...EDGED} />
      {/* escudo apoyado en el poste */}
      <path d="M60 103h15v9c0 6-3.5 10-7.5 13c-4-3-7.5-7-7.5-13z" fill={red} {...EDGED} />
      <path d="M67.5 104v19M61 110h13" stroke={CARD} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Well() {
  const blue = organ('blue');
  return (
    <g>
      <rect x={91} y={84} width={3.5} height={25} fill={blue} {...EDGED} />
      <rect x={119.5} y={84} width={3.5} height={25} fill={blue} {...EDGED} />
      <path d="M84 88l23-16 23 16z" fill={blue} fillOpacity={0.6} {...EDGED} />
      <path d="M93 92h28M123 92h4v5" stroke={EDGE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M107 92v7" stroke={EDGE} strokeWidth={1} />
      <path d="M102 99h10l-1.3 8h-7.4z" fill={blue} {...EDGED} />
      <path d="M88 126v-16h38v16z" fill={blue} {...EDGED} />
      <rect x={86} y={107} width={42} height={4.5} rx={1.5} fill={blue} {...EDGED} />
      <path d="M88 118.5h38M97 111.5v7M114 111.5v7M105 118.5v7.5M121 118.5v7.5M93 118.5v7.5" stroke={EDGE} strokeWidth={1} strokeOpacity={0.55} />
    </g>
  );
}

/** Mata con dos hojas; `wilt` las deja caidas. */
function Sprout({ x, h, wilt = false }: { x: number; h: number; wilt?: boolean }) {
  const top = 117 - h;
  if (wilt) {
    // Tallo doblado y hojas colgando: se lee mustia aunque siga verde.
    const bend = { x: x - 7, y: top + 3 };
    return (
      <g>
        <path d={`M${x} 117V${top + 7}Q${x} ${top} ${bend.x} ${bend.y}`} stroke={EDGE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
        <path
          d={`M${bend.x} ${bend.y}c-3 2-4 6-2.5 11c3-2 4-6 2.5-11zM${x} ${top + 9}c3 1 5 5 5 10c-3-2-5-6-5-10z`}
          fill={organ('green')}
          fillOpacity={0.6}
          {...EDGED}
        />
      </g>
    );
  }
  return (
    <g>
      <path d={`M${x} 117V${top}`} stroke={EDGE} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path
        d={`M${x} ${top + h * 0.45}c-2-6-6-9-12-9c1 6 6 9 12 9zM${x} ${top + h * 0.2}c1-7 5-10 11-11c0 7-5 11-11 11z`}
        fill={organ('green')}
        {...EDGED}
      />
    </g>
  );
}

function Cabbage({ x, flat = false }: { x: number; flat?: boolean }) {
  const green = organ('green');
  return flat ? (
    <path d={`M${x - 7} 117q1-4 7-4q6 0 7 4z`} fill={green} fillOpacity={0.6} {...EDGED} />
  ) : (
    <g>
      <circle cx={x} cy={111} r={6.5} fill={green} {...EDGED} />
      <path d={`M${x} 105v6M${x - 4} 108q4 3 8 0`} stroke={EDGE} strokeWidth={1} fill="none" strokeOpacity={0.6} />
    </g>
  );
}

function Garden() {
  return (
    <g>
      <Sprout x={197} h={26} />
      <Sprout x={228} h={30} />
      <Sprout x={212} h={20} />
      <Cabbage x={204} />
      <Cabbage x={222} />
      <path d="M188 117h54v9h-54z" fill={organ('green')} fillOpacity={0.45} {...EDGED} />
      <path d="M188 121.5h54" stroke={EDGE} strokeWidth={1} strokeOpacity={0.5} />
    </g>
  );
}

function Treasure() {
  const yellow = organ('yellow');
  return (
    <g>
      <circle className="story-glow" cx={274} cy={102} r={24} fill={WARM} fillOpacity={0.22} />
      {/* tapa abierta hacia atras: se ve su cara interior */}
      <path d="M256 106l5-18q15-6 32 0l-1 18z" fill={yellow} fillOpacity={0.55} {...EDGED} />
      <path d="M264 90.5v15M285 88.5v17" stroke={EDGE} strokeWidth={1} strokeOpacity={0.5} />
      <path d="M257 107q6-9 13-7q5-6 10-1q7-3 12 8z" fill={WARM} {...EDGED} />
      <g fill={WARM} stroke={EDGE} strokeWidth={1}>
        <circle cx={266} cy={101} r={2.6} />
        <circle cx={278} cy={98} r={2.6} />
        <circle cx={287} cy={102} r={2.4} />
        <ellipse cx={299} cy={124.5} rx={3.2} ry={1.6} />
      </g>
      <rect x={254} y={106} width={40} height={20} rx={1.5} fill={yellow} {...EDGED} />
      <path d="M263 106v20M285 106v20" stroke={EDGE} strokeWidth={1.2} />
      <rect x={271} y={110} width={6} height={7} rx={1} fill={CARD} {...EDGED} />
    </g>
  );
}

/* --- los mismos, rotos ----------------------------------------------------- */

function ArmoryRuin() {
  const red = organ('red');
  return (
    <g>
      {/* un poste en pie y torcido, el otro y el travesano por el suelo */}
      <path d="M52 126l6-30 4 1-5.5 29z" fill={red} {...EDGED} />
      <path d="M14 118h40l-1 4H13z" fill={red} {...EDGED} transform="rotate(-6 34 120)" />
      <path d="M10 124l2-4h36l1 4z" fill={red} {...EDGED} />
      {/* lanza partida y hacha tirada */}
      <path d="M22 116l14-9M40 105l8-5" stroke={EDGE} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M22 116l14-9M40 105l8-5" stroke={FAINT} strokeWidth={1.6} strokeLinecap="round" />
      <path d="M48 100l9-7-3 9z" fill={METAL} {...EDGED} />
      {/* escudo en tierra, con la raja */}
      <path d="M26 125a9 5 0 0 1 22 0z" fill={red} {...EDGED} />
      <path d="M36 120.5l1.5 2-1.5 2.5" stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

function WellRuin() {
  const blue = organ('blue');
  return (
    <g>
      {/* brocal desmochado y tejadillo caido de lado */}
      <path d="M70 126l8-15 10 15z" fill={blue} fillOpacity={0.6} {...EDGED} />
      <path d="M88 126v-14l5-3 6 5 5-6 7 7 4-4 5 3 6-2v14z" fill={blue} {...EDGED} />
      <path d="M88 119h38M100 119v7M116 119v7" stroke={EDGE} strokeWidth={1} strokeOpacity={0.55} />
      <path d="M92 110l2-18 3.5.5-2 17.5z" fill={blue} {...EDGED} />
      <path d="M120 109l3-8" stroke={EDGE} strokeWidth={4.8} strokeLinecap="round" />
      <path d="M120 109l3-8" stroke={blue} strokeWidth={2.2} strokeLinecap="round" />
      <g fill={LINE} stroke={SOFT} strokeWidth={1}>
        <rect x={98} y={121} width={5} height={3.5} transform="rotate(15 100 122)" />
      </g>
    </g>
  );
}

function GardenRuin() {
  return (
    <g>
      <Sprout x={196} h={20} wilt />
      <Sprout x={214} h={16} wilt />
      <Sprout x={232} h={22} wilt />
      <Cabbage x={205} flat />
      <Cabbage x={224} flat />
      {/* bancal partido: una tabla levantada */}
      <path d="M188 117h24l-3 9h-21z" fill={organ('green')} fillOpacity={0.45} {...EDGED} />
      <path d="M216 119l26-4v11h-27z" fill={organ('green')} fillOpacity={0.45} {...EDGED} />
      <path d="M212 126l2-7 2 1" stroke={EDGE} strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

function TreasureRuin() {
  const yellow = organ('yellow');
  return (
    <g>
      {/* cofre volcado: la boca mira a la izquierda, vacia */}
      <g transform="rotate(-90 280 116)">
        <rect x={270} y={98} width={20} height={32} rx={1.5} fill={yellow} {...EDGED} />
        <path d="M270 105h20M270 123h20" stroke={EDGE} strokeWidth={1.2} />
      </g>
      <path d="M264 106h4v20h-4z" fill={SOFT} fillOpacity={0.5} {...EDGED} />
      {/* tapa arrancada en el suelo */}
      <path d="M244 125q2-7 8-8l12 2q-1 5-3 7z" fill={yellow} fillOpacity={0.55} {...EDGED} />
      <rect x={290} y={113} width={6} height={7} rx={1} fill={CARD} {...EDGED} />
      <ellipse cx={304} cy={124.8} rx={3.2} ry={1.5} fill={WARM} stroke={EDGE} strokeWidth={1} />
    </g>
  );
}

/* --- escenas --------------------------------------------------------------- */

const TOWERS = [
  [40, 70],
  [250, 280],
] as const;

export function AsedioWin() {
  return (
    <Scene>
      <circle cx={108} cy={32} r={12} fill={WARM} fillOpacity={0.3} stroke={WARM} strokeWidth={1.4} />
      <circle cx={108} cy={32} r={18} fill="none" stroke={WARM} strokeOpacity={0.5} strokeWidth={1.2} strokeDasharray="2 5" />
      <Cloud x={196} y={26} s={1.1} opacity={0.3} />
      <Cloud x={12} y={20} s={0.9} opacity={0.25} />

      <Masonry d={crenels(66, 254, 82)} />
      {TOWERS.map(([x0, x1], k) => (
        <g key={x0}>
          <path d={`M${(x0 + x1) / 2} 43V16`} stroke={SOFT} strokeWidth={1.6} strokeLinecap="round" />
          <path className="story-flutter" style={delay(k * 3)} d={`M${(x0 + x1) / 2} 17h17l-4 5 4 5h-17z`} fill={WARM} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />
          <Masonry d={crenels(x0, x1, 48)} />
          <path d={`M${(x0 + x1) / 2} 58v9`} stroke={SOFT} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      ))}

      <Figure
        className="story-bob"
        x={160}
        y={48}
        s={0.75}
        pose={{ ...POSES.fistR, head: 4 }}
        color={FAINT}
        front={(j) => (
          <>
            <Helm j={j} plume />
            <Sword at={j.handR} deg={172} len={15} />
          </>
        )}
      />
      <Masonry d={crenels(138, 182, 66)} />
      <path d="M148 126v-20a12 12 0 0 1 24 0v20z" fill={WARM} fillOpacity={0.3} stroke={FAINT} strokeWidth={1.2} />
      <path d="M152 97.5v4M156 95v4M160 94v4M164 95v4M168 97.5v4" stroke={SOFT} strokeWidth={1.4} strokeLinecap="round" />
      <Ashlar marks={[[76, 92], [92, 100], [128, 90], [186, 94], [206, 88], [236, 98], [44, 80], [258, 84], [262, 104], [48, 102], [142, 80]]} />

      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />

      <Armory />
      <Well />
      <Garden />
      <Treasure />

      <Sparkle x={264} y={86} r={4} i={0} />
      <Sparkle x={296} y={94} r={3.2} i={2} />
    </Scene>
  );
}

export function AsedioLose() {
  return (
    <Scene>
      <Cloud x={100} y={24} s={1.5} opacity={0.4} />
      <Cloud x={10} y={14} s={1.2} opacity={0.35} />
      <Cloud x={220} y={12} s={1.3} opacity={0.35} />

      {/* murallas mordidas: la brecha abre el lienzo de la izquierda */}
      <Masonry dim d="M66 126V80l4-3 3 3h5v-3h4v6l6 4 4 10 6 14 6-4 5 5 5-8 6 4 4-18 4-7V77h5v3h4V77h5v3h5V77H206v5l5 3h5v-3h5v3h9v-3h6v5h14V126z" />
      <Masonry dim d="M40 126V88l5-5 4 6 6-10 5 7 5-4 5 6v38z" />
      <Masonry dim d="M250 126V58l4-6 4 4h5v-7h5l3 5 5-3 4 5v70z" />
      <Masonry dim d="M138 126V70l5-4h6l3 4h6l4-6 5 3 4-5 6 5 5-3v62z" />
      <path d="M148 126v-20a12 12 0 0 1 24 0v20z" fill={SOFT} fillOpacity={0.4} stroke={FAINT} strokeWidth={1.2} />
      <path d="M152 98v10M164 94v6M168 97v14" stroke={SOFT} strokeWidth={1.4} strokeLinecap="round" />

      {/* cascotes al pie de la brecha y de la torre caida */}
      <g fill={LINE} stroke={SOFT} strokeWidth={1.2} strokeLinejoin="round">
        <path d="M96 126l4-9 9-3 8 4 7-2 6 10z" />
        <path d="M30 126l4-7 8 1 3 6z" />
        <path d="M240 126l3-5 7 1 1 4z" />
      </g>
      <Stone x={246} y={122} r={3.8} />
      {/* la piedra que llega, con su estela */}
      <circle cx={46} cy={38} r={4} fill={LINE} stroke={SOFT} strokeWidth={1.2} />
      <path d="M38 33c-6-4-12-5-18-4M36 38c-6-2-10-2-15 0" stroke={FAINT} strokeWidth={1.2} fill="none" strokeLinecap="round" strokeDasharray="3 3" />

      <Flame x={157} y={70} s={1.1} className="story-flicker" />
      <Flame x={52} y={84} s={0.9} />
      <Flame x={226} y={80} s={0.8} />
      <Puff x={158} y={44} r={7} i={0} />
      <Puff x={54} y={62} r={6} i={2} />

      {/* estandarte del rival en lo que queda de la torre */}
      <path d="M268 50V22" stroke={SOFT} strokeWidth={1.6} strokeLinecap="round" />
      <path className="story-flutter" style={delay(1)} d="M268 23h18v11l-4.5-3.5-4.5 3.5-4.5-3.5-4.5 3.5z" fill={SOFT} stroke={EDGE} strokeWidth={1.2} strokeLinejoin="round" />

      <rect x={0} y={GROUND} width={320} height={34} fill={LINE} fillOpacity={0.5} />
      <path d={`M0 ${GROUND}H320`} stroke={SOFT} strokeWidth={1.5} />

      <ArmoryRuin />
      <WellRuin />
      <GardenRuin />
      <TreasureRuin />

      <Figure
        className="story-drop"
        x={150}
        y={118.5}
        s={0.75}
        rot={90}
        pose={{ ...POSES.flat, armR: [6, 2], legR: [4, 2] }}
        color={FAINT}
        front={(j) => <Helm j={j} plume={false} />}
      />
      {/* la espada, partida junto a su dueno */}
      <path d="M181 124.5h6l1-1.5" stroke={EDGE} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M181 124.5h6l1-1.5" stroke={METAL} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M180 120.5v5.5" stroke={EDGE} strokeWidth={2.2} strokeLinecap="round" />
      <Dizzy x={174} y={104} i={0} />
    </Scene>
  );
}

export const scenes = { win: AsedioWin, lose: AsedioLose };

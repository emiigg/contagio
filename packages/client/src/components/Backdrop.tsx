import { usePack } from '../packs';

/**
 * Fondo decorativo: el mundo del paquete en uso dibujado a linea, muy tenue y
 * repartido por los margenes. Es solo ambiente, asi que no recibe raton ni
 * lector de pantalla; el color de la mesa sigue reservado a la informacion.
 */

interface Spot {
  id: string;
  /** Posicion en porcentaje del viewport. */
  x: number;
  y: number;
  size: string;
  rot: number;
  tone?: string;
  /** En pantallas estrechas sobran casi todos: el contenido ya llena. */
  keepNarrow?: boolean;
}

/**
 * Huecos fijos, iguales para todos los paquetes: cada uno pone su motivo en el
 * mismo sitio, asi que cambiar de paquete nunca descoloca la pagina.
 */
const SPOTS: Spot[] = [
  { id: 'm0', x: 6, y: 14, size: '7rem', rot: -12, tone: 'var(--organ-red)', keepNarrow: true },
  { id: 'm1', x: 93, y: 20, size: '9rem', rot: 10 },
  { id: 'm2', x: 88, y: 74, size: '8rem', rot: -24, tone: 'var(--organ-yellow)' },
  { id: 'm3', x: 12, y: 78, size: '8.5rem', rot: 6, tone: 'var(--organ-blue)' },
  { id: 'm4', x: 78, y: 8, size: '5.5rem', rot: -8, tone: 'var(--organ-green)' },
  { id: 'm5', x: 22, y: 44, size: '7.5rem', rot: 38 },
  { id: 'm6', x: 68, y: 92, size: '4.5rem', rot: 0, tone: 'var(--organ-blue)' },
  { id: 'm7', x: 34, y: 6, size: '4.5rem', rot: 24 },
  { id: 'm8', x: 4, y: 52, size: '6rem', rot: -6 },
  { id: 'm9', x: 55, y: 96, size: '4rem', rot: 18, keepNarrow: true },
];

const BAND: Spot = { id: 'band', x: 50, y: 3, size: '18rem', rot: 0, tone: 'var(--organ-red)' };

export function Backdrop() {
  const { art } = usePack();
  const { items, band } = art.backdrop;
  const motifs = [
    ...SPOTS.map((spot, index) => ({ ...spot, Glyph: items[index % items.length]! })),
    { ...BAND, Glyph: band },
  ];

  return (
    <div className="backdrop" aria-hidden>
      {motifs.map(({ id, Glyph, x, y, size, rot, tone, keepNarrow }) => (
        <span
          key={id}
          className={`backdrop__item ${keepNarrow ? '' : 'backdrop__item--wide'}`}
          style={
            {
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--size': size,
              '--rot': `${rot}deg`,
              ...(tone ? { color: tone } : null),
            } as React.CSSProperties
          }
        >
          <Glyph className="backdrop__glyph" />
        </span>
      ))}
    </div>
  );
}

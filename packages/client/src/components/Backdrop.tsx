/**
 * Fondo decorativo: instrumental de hospital dibujado a linea, muy tenue y
 * repartido por los margenes. Es solo ambiente, asi que no recibe raton ni
 * lector de pantalla; el color de la mesa sigue reservado a la informacion.
 */

interface GlyphProps {
  className?: string;
}

const STROKE = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function CrossGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...STROKE} d="M12.5 3.5h7v9h9v7h-9v9h-7v-9h-9v-7h9z" />
    </svg>
  );
}

function CapsuleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...STROKE} x="3.5" y="11" width="25" height="10" rx="5" />
      <path {...STROKE} d="M16 11v10" />
      <path {...STROKE} d="M7.5 14.5h3" />
    </svg>
  );
}

function SyringeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...STROKE} d="M6 26l4.5-4.5" />
      <path {...STROKE} d="M9.5 22.5l-2-2 11-11 2 2z" />
      <path {...STROKE} d="M18 13.5l-2.5-2.5" />
      <path {...STROKE} d="M20.5 11l3.5-3.5-2.5-2.5" />
      <path {...STROKE} d="M22.5 9.5l3 3" />
      <path {...STROKE} d="M24 4l4 4" />
    </svg>
  );
}

function StethoscopeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...STROKE} d="M8 4v6a5.5 5.5 0 0 0 11 0V4" />
      <path {...STROKE} d="M6 4h4M17 4h4" />
      <path {...STROKE} d="M13.5 15.5v4a6.5 6.5 0 0 0 13 0v-2" />
      <circle {...STROKE} cx="26.5" cy="13.5" r="3" />
    </svg>
  );
}

function FlaskGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...STROKE} d="M13 4h6v9.5l6.5 11a2.5 2.5 0 0 1-2.2 3.8H8.7a2.5 2.5 0 0 1-2.2-3.8L13 13.5z" />
      <path {...STROKE} d="M9.8 20h12.4" />
    </svg>
  );
}

function BandageGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...STROKE} x="2.5" y="10.5" width="27" height="11" rx="5.5" />
      <path {...STROKE} d="M11.5 10.5v11M20.5 10.5v11" />
      <path {...STROKE} d="M14.5 14.5h.01M17.5 14.5h.01M14.5 17.5h.01M17.5 17.5h.01" />
    </svg>
  );
}

function DropGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...STROKE} d="M16 3.5c5 6.4 8 10.6 8 14a8 8 0 0 1-16 0c0-3.4 3-7.6 8-14z" />
    </svg>
  );
}

function PillGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...STROKE} cx="16" cy="16" r="11" />
      <path {...STROKE} d="M8 12h16" />
    </svg>
  );
}

function ClipboardGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...STROKE} x="6" y="5" width="20" height="23" rx="2.5" />
      <path {...STROKE} d="M12 5V3.5h8V5" />
      <path {...STROKE} d="M10.5 13h11M10.5 17.5h11M10.5 22h6" />
    </svg>
  );
}

function TraceGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...STROKE} d="M1 12h12l3-7 4 14 3-9 2 2h10l3-6 3 12 3-8 2 2h17" />
    </svg>
  );
}

interface Motif {
  id: string;
  Glyph: (props: GlyphProps) => JSX.Element;
  /** Posicion en porcentaje del viewport. */
  x: number;
  y: number;
  size: string;
  rot: number;
  tone?: string;
  /** En pantallas estrechas sobran casi todos: el contenido ya llena. */
  keepNarrow?: boolean;
}

const MOTIFS: Motif[] = [
  { id: 'cross-1', Glyph: CrossGlyph, x: 6, y: 14, size: '7rem', rot: -12, tone: 'var(--organ-red)', keepNarrow: true },
  { id: 'stetho', Glyph: StethoscopeGlyph, x: 93, y: 20, size: '9rem', rot: 10 },
  { id: 'capsule', Glyph: CapsuleGlyph, x: 88, y: 74, size: '8rem', rot: -24, tone: 'var(--organ-yellow)' },
  { id: 'syringe', Glyph: SyringeGlyph, x: 12, y: 78, size: '8.5rem', rot: 6, tone: 'var(--organ-blue)' },
  { id: 'flask', Glyph: FlaskGlyph, x: 78, y: 8, size: '5.5rem', rot: -8, tone: 'var(--organ-green)' },
  { id: 'bandage', Glyph: BandageGlyph, x: 22, y: 44, size: '7.5rem', rot: 38 },
  { id: 'drop', Glyph: DropGlyph, x: 68, y: 92, size: '4.5rem', rot: 0, tone: 'var(--organ-blue)' },
  { id: 'pill', Glyph: PillGlyph, x: 34, y: 6, size: '4.5rem', rot: 24 },
  { id: 'clipboard', Glyph: ClipboardGlyph, x: 4, y: 52, size: '6rem', rot: -6 },
  { id: 'cross-2', Glyph: CrossGlyph, x: 55, y: 96, size: '4rem', rot: 18, keepNarrow: true },
  { id: 'trace', Glyph: TraceGlyph, x: 50, y: 3, size: '18rem', rot: 0, tone: 'var(--organ-red)' },
];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden>
      {MOTIFS.map(({ id, Glyph, x, y, size, rot, tone, keepNarrow }) => (
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

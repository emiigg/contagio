import type { Card, Color, TreatmentKind } from '@contagio/engine';

/**
 * Ilustraciones propias, dibujadas como diagramas anatomicos de linea: trazo
 * uniforme, relleno tenue del color del organo. Todas heredan `currentColor`.
 */

interface GlyphProps {
  className?: string;
  title?: string;
}

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function HeartGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M24 40c-9-6.4-15-12.2-15-19.6C9 15 12.8 11 17.6 11c2.9 0 5.2 1.5 6.4 3.6 1.2-2.1 3.5-3.6 6.4-3.6C35.2 11 39 15 39 20.4c0 3.6-1.4 6.7-3.9 9.7"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M28 8v5.2M28 8h5" />
      <path d="M14 24h5l2.4-4.2L25 29l2.6-5h6" />
    </svg>
  );
}

export function BrainGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M20 10c-4 0-6.6 2.3-6.9 5.3C10.4 16 9 18.2 9 20.7c0 2 1 3.7 2.6 4.7-.5.9-.8 1.9-.8 3 0 3.4 2.7 6 6.2 6 .6 2.3 2.7 3.9 5.3 3.9 1.5 0 2.8-.5 3.7-1.4"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M26 10c4 0 6.6 2.3 6.9 5.3C35.6 16 37 18.2 37 20.7c0 2-1 3.7-2.6 4.7.5.9.8 1.9.8 3 0 3.4-2.7 6-6.2 6-.6 2.3-2.7 3.9-5.3 3.9"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M24 12v25M18 18c2 0 3 1.2 3 3M30 24c-2 0-3 1.2-3 3M17 28h4" />
    </svg>
  );
}

export function LungGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path d="M24 8v14" />
      <path d="M18 22c0-3.3 3-3.3 6-3.3s6 0 6 3.3" />
      <path
        d="M18 22c0 6-2 8-4.6 12.4C11.8 37 9 36.4 9 33.6V26c0-3.2 1.7-6.2 4.4-7.6C15.6 17.3 18 18.6 18 21.2z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M30 22c0 6 2 8 4.6 12.4C36.2 37 39 36.4 39 33.6V26c0-3.2-1.7-6.2-4.4-7.6C32.4 17.3 30 18.6 30 21.2z"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  );
}

export function LiverGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M8 18.5C13 14 22 13 30 14.4c5 .9 10 2.6 10 6.6 0 6-4.6 12-11.4 14.6-4.4 1.7-9.2 1-12.6-1.9C11 30.4 8 24.6 8 18.5z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M8.6 21.4c6-3 14.6-3.6 22.6-1.4M27 15.2c-1.2 5-1.6 12.6-.6 19.6" />
      <path d="M33 22.6c1.6 1 2.2 3 1.4 4.8" />
    </svg>
  );
}

export function ChimeraGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 24 24 8A16 16 0 0 1 40 24z" fill="var(--organ-red)" fillOpacity="0.5" stroke="currentColor" />
        <path d="M24 24 40 24A16 16 0 0 1 24 40z" fill="var(--organ-blue)" fillOpacity="0.5" stroke="currentColor" />
        <path d="M24 24 24 40A16 16 0 0 1 8 24z" fill="var(--organ-green)" fillOpacity="0.5" stroke="currentColor" />
        <path d="M24 24 8 24A16 16 0 0 1 24 8z" fill="var(--organ-yellow)" fillOpacity="0.5" stroke="currentColor" />
        <circle cx="24" cy="24" r="4.5" fill="var(--paper)" stroke="currentColor" />
      </g>
    </svg>
  );
}

export function VirusGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="24" cy="24" r="9.5" fill="currentColor" fillOpacity="0.16" />
      <circle cx="21" cy="21.5" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="26.5" cy="26" r="2.1" fill="currentColor" stroke="none" />
      <g>
        <path d="M24 14.5V8M24 33.5V40M14.5 24H8M33.5 24H40M17.3 17.3l-4.6-4.6M30.7 30.7l4.6 4.6M30.7 17.3l4.6-4.6M17.3 30.7l-4.6 4.6" />
        <path d="M21 8h6M21 40h6M8 21v6M40 21v6" />
      </g>
    </svg>
  );
}

export function MedicineGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 8h12M20 8v5.4L15.2 33.6A5 5 0 0 0 20 40h8a5 5 0 0 0 4.8-6.4L28 13.4V8" />
      <path d="M16.6 26h14.8" />
      <path d="M17.4 30.5h13.2A5 5 0 0 1 28 40h-8a5 5 0 0 1-2.6-9.5z" fill="currentColor" fillOpacity="0.22" />
      <path d="M24 33v5M21.5 35.5h5" />
    </svg>
  );
}

function SwapGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 18h20l-5-5M38 30H18l5 5" />
      <circle cx="34" cy="18" r="4" fill="currentColor" fillOpacity="0.2" />
      <circle cx="14" cy="30" r="4" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function StealGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path d="M14 12l6 9M34 12l-6 9" />
      <path d="M20 21c-2.4 1.6-3.6 4.2-3.6 7.2 0 4.6 3.4 8.4 7.6 8.4s7.6-3.8 7.6-8.4c0-3-1.2-5.6-3.6-7.2z" fill="currentColor" fillOpacity="0.18" />
      <path d="M24 26v6M21 29h6" />
    </svg>
  );
}

function SpreadGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="15" cy="24" r="5" fill="currentColor" fillOpacity="0.2" />
      <path d="M24 16c3 2.6 4.6 5.2 4.6 8s-1.6 5.4-4.6 8M31 12c4.4 3.6 6.6 7.6 6.6 12s-2.2 8.4-6.6 12" />
    </svg>
  );
}

function QuarantineGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <path d="M17 20V13a2.5 2.5 0 0 1 5 0v6M22 19v-8.5a2.5 2.5 0 0 1 5 0V19M27 19v-6a2.5 2.5 0 0 1 5 0v11" fill="currentColor" fillOpacity="0.14" />
      <path d="M17 20v6l-3.4-3.4a2.6 2.6 0 0 0-3.6 3.6l7.4 8.6c1.6 1.9 4 3.2 6.6 3.2h3a5 5 0 0 0 5-5V24" fill="currentColor" fillOpacity="0.14" />
    </svg>
  );
}

function MalpracticeGlyph({ className }: GlyphProps) {
  return (
    <svg {...base} className={className}>
      <rect x="8" y="12" width="14" height="18" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="26" y="18" width="14" height="18" rx="2" fill="currentColor" fillOpacity="0.16" />
      <path d="M22 16h8M26 34h-8M28 13l3 3-3 3M20 31l-3 3 3 3" />
    </svg>
  );
}

const TREATMENT_GLYPHS: Record<TreatmentKind, (props: GlyphProps) => JSX.Element> = {
  swap: SwapGlyph,
  steal: StealGlyph,
  spread: SpreadGlyph,
  quarantine: QuarantineGlyph,
  malpractice: MalpracticeGlyph,
};

const ORGAN_GLYPHS: Record<Color, (props: GlyphProps) => JSX.Element> = {
  red: HeartGlyph,
  blue: BrainGlyph,
  green: LungGlyph,
  yellow: LiverGlyph,
  wild: ChimeraGlyph,
};

/** Silueta tenue de un organo: marca el hueco que aun no has llenado. */
export function OrganSilhouette({ color, className }: { color: Color; className?: string }) {
  return ORGAN_GLYPHS[color]({ className });
}

/**
 * Marca de Contagio: la misma muestra que aparece en la pestana del navegador.
 * Vive aqui para que icono e interfaz no se separen nunca.
 */
export function Mark({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <circle cx="16" cy="16" r="9" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5L26 26M26 6l-3.5 3.5M9.5 22.5L6 26" />
      </g>
    </svg>
  );
}

/** Devuelve la ilustracion que corresponde a una carta. */
export function CardGlyph({ card, className }: { card: Card; className?: string }) {
  switch (card.kind) {
    case 'organ':
      return ORGAN_GLYPHS[card.color!]({ className });
    case 'virus':
      return <VirusGlyph className={className} />;
    case 'medicine':
      return <MedicineGlyph className={className} />;
    case 'treatment':
      return TREATMENT_GLYPHS[card.treatment!]({ className });
  }
}

/** Trazo de electrocardiograma: un pulso lo recorre cuando es tu turno. */
export function Pulse({ active }: { active: boolean }) {
  const trace = 'M0 12h22l4-7 5 14 4-9 3 2h12l4-6 4 12 4-8 3 2h20l4-5 4 10 3-6h21';
  return (
    <svg className={`pulse ${active ? 'is-live' : ''}`} viewBox="0 0 120 24" fill="none" aria-hidden>
      <path className="pulse__base" d={trace} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      {active && (
        <path className="pulse__spark" d={trace} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Sol: el tema claro. */
export function SunGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.6" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
      </g>
    </svg>
  );
}

/** Luna: el tema oscuro. */
export function MoonGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M20 14.4A8.6 8.6 0 0 1 9.6 4a8.6 8.6 0 1 0 10.4 10.4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Circulo mitad y mitad: el tema lo decide el sistema. */
export function AutoGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.6a8.4 8.4 0 0 1 0 16.8z" fill="currentColor" />
    </svg>
  );
}

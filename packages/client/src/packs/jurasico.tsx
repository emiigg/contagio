import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Jurasico: dinosaurios, los peligros de su era y donde se refugiaban. */

/** Huella de tres dedos apuntando hacia arriba, centrada en el origen. */
function Footprint({ x, y, angle, scale = 1 }: { x: number; y: number; angle: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`} strokeWidth={2 / scale}>
      <ellipse cy="3" rx="2.6" ry="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M0 2l-4.5-6M0 2v-8M0 2l4.5-6" />
    </g>
  );
}

function TRexGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M9 40C7 31 8 21 13.5 15.5 17 12 21 10.5 26 10.5h10c3.6 0 6 2.4 6 6V20H27l-6 4.5 15 1.5c0 3.6-2.6 6-6 6h-8c-2.6 0-4 2.4-4 8z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M29 20l1.5 2.6L32 20l1.5 2.6L35 20l1.5 2.6L38 20" />
      <path d="M27 13.5l5-.8" />
      <circle cx="30" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <path d="M13 32l4-1.5" />
    </svg>
  );
}

function PterodactylGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M22 21l-9-6-8 5c6 1 11 4.4 17 8z" fill="currentColor" fillOpacity="0.16" />
      <path d="M26 21l9-6 8 5c-6 1-11 4.4-17 8z" fill="currentColor" fillOpacity="0.16" />
      <ellipse cx="24" cy="25" rx="3" ry="7" fill="currentColor" fillOpacity="0.16" />
      <path d="M22 17.5L14 10l10 4.5 13-3.5-11 7.5z" fill="currentColor" fillOpacity="0.16" />
      <path d="M22.5 32l-1.5 5M25.5 32l1.5 5" />
    </svg>
  );
}

function DiplodocusGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M5 32c7-1 10-8 17-10 5-1.5 8-1 10-1 1-5 2-10 5-12 2-1 4.5-.5 5 1.5l-3 1.5c-2 3-2.5 8-3 13-.5 4-4 6-8 6h-8c-5 0-9 1.5-15 1z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M18 31v8M23 31v8M29 31v8M33 29.5v9.5" />
      <circle cx="39" cy="10.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * De cuerpo entero y de perfil, como el diplodocus: solo la cabeza, con la
 * gola de frente, se leia como una bola con pinchos. Lo que lo delata es la
 * silueta -gola detras de la cabeza, dos cuernos largos hacia delante, pico y
 * cuatro patas cortas-, y esa se sigue viendo a 32 px.
 */
function TriceratopsGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M3 29c4-.5 7-3 10-5.5 4-3 9-4.5 14-4.5 4 0 6.5 2 7.5 5l.5 6c-1 3-4 4.5-7.5 4.5H15c-5 0-8.5-2-12-5.5z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M30 25c-3-5-2-12 3-15 3-1.8 6.5-.5 7.5 2.5L36 21z" fill="currentColor" fillOpacity="0.1" />
      <path d="M31 24l7-3.5 7.5 7-3.5 2.5-3.5-1c-2 2-5 2.3-7 1z" fill="currentColor" fillOpacity="0.24" />
      <path d="M34.5 21.5L42 13M37.5 21l7-6M43 26.5l1.2-3" />
      <path d="M11 32v7M16 34v5M25 34v5M30 33v6" />
      <circle cx="36.5" cy="24.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MysteryEggGlyph({ className }: GlyphProps) {
  const crack = 'L32 22L28 26.5L24 22.5L20 26.5L16 23';
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.7 15A13 18 0 0 1 34.3 15Q24 18.5 13.7 15z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path
          d={`M13.7 15Q24 18.5 34.3 15A13 18 0 0 1 36.9 24${crack}L11.1 24A13 18 0 0 1 13.7 15z`}
          fill="var(--organ-blue)"
          fillOpacity="0.5"
        />
        <path
          d="M11.1 24L16 23L20 26.5L24 22.5L28 26.5L32 22L36.9 24A13 18 0 0 1 37 26A13 14 0 0 1 35.3 33Q24 36.5 12.7 33A13 14 0 0 1 11 26A13 18 0 0 1 11.1 24z"
          fill="var(--organ-green)"
          fillOpacity="0.5"
        />
        <path d="M12.7 33Q24 36.5 35.3 33A13 14 0 0 1 24 40A13 14 0 0 1 12.7 33z" fill="var(--organ-yellow)" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

function MeteorGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M26 20l14-12M30 26l10-8M20 16l8-8" />
      <path d="M11 27l5-7 8-1 5 6-1 8-7 5-8-3z" fill="currentColor" fillOpacity="0.2" />
      <circle cx="19" cy="29" r="2.2" />
    </svg>
  );
}

function FernGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M24 7l9 13 3 11-12 7-12-7 3-11z" fill="currentColor" fillOpacity="0.16" stroke="none" />
      <path d="M24 42V7" />
      <path d="M24 34l-11-5M24 34l11-5M24 26l-9-5M24 26l9-5M24 18l-6-4M24 18l6-4" />
    </svg>
  );
}

function HerdCrossingGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <Footprint x={11} y={37} angle={45} />
      <Footprint x={37} y={37} angle={-45} />
      <path d="M17 31l17-17M31 31L14 14" strokeDasharray="3 3.5" />
      <path d="M29 10h7v7M19 10h-7v7" />
    </svg>
  );
}

function TerritoryGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="31" cy="36" rx="10" ry="4.5" strokeDasharray="3 3" />
      <path d="M32 36V8" />
      <path d="M32 9l9 4-9 4z" fill="currentColor" fillOpacity="0.2" />
      <Footprint x={18} y={30} angle={20} scale={1.3} />
    </svg>
  );
}

function EruptionGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M6 41l12-19h12l12 19z" fill="currentColor" fillOpacity="0.16" />
      <path d="M21 19c-3-6-9-8-13-4M27 19c3-6 9-8 13-4" />
      <circle cx="8" cy="19" r="2" fill="currentColor" stroke="none" />
      <circle cx="40" cy="19" r="2" fill="currentColor" stroke="none" />
      <path d="M24 17v-7M21 25l-3 5" />
    </svg>
  );
}

function RoarGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M12 19Q24 11 36 19C34 31 29 35 24 35S14 31 12 19z" fill="currentColor" fillOpacity="0.2" />
      <path d="M14 18.5l2 4 2-6 3 5 3-6.5 3 6.5 3-5 2 6 2-4M17 31l2-4 2.5 5.5L24 28l2.5 4.5L29 27l2 4" />
      <path d="M8.5 19c-1.5 3-1.5 6 0 9M40 19c1.5 3 1.5 6 0 9M5 16c-2.5 5-2.5 10 0 15M43 16c2.5 5 2.5 10 0 15" />
    </svg>
  );
}

function ContinentalDriftGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 13l6-5 7 2 2 6-4 5-7 1-4-4z" fill="currentColor" fillOpacity="0.16" />
      <path d="M26 30l5-5 7 1 3 6-3 6-7 1-4-4z" fill="currentColor" fillOpacity="0.16" />
      <path d="M27 10c7 0 12 4 12 10" />
      <path d="M35 17l4 4 4-4" />
      <path d="M21 38c-7 0-12-4-12-10" />
      <path d="M5 31l4-4 4 4" />
    </svg>
  );
}

/* Fondo: lo que queda de un valle del Jurasico. */

function FernLeafGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M10 29c2-8 6-16 14-24" />
      <path {...LINE} d="M12.5 21l-5-1.5M12.5 21l2 5M15.5 15l-4.5-2M15.5 15l3 4.5M19 10.5l-3.5-2.5M19 10.5l3.5 3.5" />
    </svg>
  );
}

function FootprintGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 26c-3.4 0-4.6-2.4-3.8-4.6L7 13l6.6 4.6L16 6l2.4 11.6L25 13l-5.2 8.4c.8 2.2-.4 4.6-3.8 4.6z" />
    </svg>
  );
}

function BoneGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-40 16 16)">
        <path {...LINE} d="M9 14A3 3 0 1 0 7 16 3 3 0 1 0 9 18H23A3 3 0 1 0 25 16 3 3 0 1 0 23 14Z" />
      </g>
    </svg>
  );
}

function AmberGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 4c4 6 8 10.5 8 15a8 8 0 0 1-16 0c0-4.5 4-9 8-15z" />
      <path {...LINE} d="M16 18v6M16 20c-2-2.5-4.5-2-4 0s2.5 1 4 0c1.5 1 3.5 2 4 0s-2-2.5-4 0" />
    </svg>
  );
}

function CycadGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M14 29l1-15h2l1 15z" />
      <path {...LINE} d="M16 13c-3-4-7-5-11-3M16 13c3-4 7-5 11-3M16 13c-2-3-2-7 0-10M16 13c-4-1-8 1-10 5M16 13c4-1 8 1 10 5" />
      <path {...LINE} d="M14.5 19h3M14.3 24h3.4" />
    </svg>
  );
}

function VolcanoGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M3 28l9-14h8l9 14z" />
      <path {...LINE} d="M12 14l2 3 2-2 2 2 2-3" />
      <path {...LINE} d="M15 10c-2-1.5-1-4 1-4s3-3 5-1.5" />
    </svg>
  );
}

function NestGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="11.5" cy="15" rx="3.5" ry="4.5" />
      <ellipse {...LINE} cx="20.5" cy="15" rx="3.5" ry="4.5" />
      <ellipse {...LINE} cx="16" cy="12.5" rx="3.5" ry="4.5" />
      <path {...LINE} d="M4 18c1 6 6 9 12 9s11-3 12-9z" />
      <path {...LINE} d="M7.5 22.5h17" />
    </svg>
  );
}

function AmmoniteGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 16a1.5 1.5 0 0 1 3 0 3 3 0 0 1-6 0 4.5 4.5 0 0 1 9 0 6 6 0 0 1-12 0 7.5 7.5 0 0 1 15 0 9 9 0 0 1-18 0" />
      <path {...LINE} d="M7 16H4M8.5 11l-2.4-2M13 8l-1-3M18.5 8l1-3M23.5 11l2.4-2" />
    </svg>
  );
}

function RocksGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 27l2-7 6-3 5 3 1 7z" />
      <path {...LINE} d="M17 20l3-7 6-1 3 6-1 9h-10" />
      <path {...LINE} d="M3 27h26M21 17l3 2" />
    </svg>
  );
}

function PterosaurGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M14 16l-6-4-6 3.5c4 .6 8 3 12 5.5zM18 16l6-4 6 3.5c-4 .6-8 3-12 5.5z" />
      <path {...LINE} d="M14 16c0-2 4-2 4 0v6c0 2-4 2-4 0z" />
      <path {...LINE} d="M15 14l-5-5 6 2.5 8-2-7 5" />
    </svg>
  );
}

function RidgeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M2 21l8-8 4 3 5-6 5 7 5-3 4-6h4l5 8 4-3 6 5 4-3 6 6" />
      <path {...LINE} d="M36 6c-1.5-1.2-.6-3 1-3s2.2-1.6 3.4-.6" />
    </svg>
  );
}

export const jurasicoArt: PackArt = {
  organs: {
    red: TRexGlyph,
    blue: PterodactylGlyph,
    green: DiplodocusGlyph,
    yellow: TriceratopsGlyph,
    wild: MysteryEggGlyph,
  },
  virus: MeteorGlyph,
  medicine: FernGlyph,
  treatments: {
    swap: HerdCrossingGlyph,
    steal: TerritoryGlyph,
    spread: EruptionGlyph,
    quarantine: RoarGlyph,
    malpractice: ContinentalDriftGlyph,
  },
  backdrop: {
    items: [
      FernLeafGlyph,
      FootprintGlyph,
      BoneGlyph,
      AmberGlyph,
      CycadGlyph,
      VolcanoGlyph,
      NestGlyph,
      AmmoniteGlyph,
      RocksGlyph,
      PterosaurGlyph,
    ],
    band: RidgeGlyph,
  },
};

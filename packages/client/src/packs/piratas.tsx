import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Piratas: el botin de a bordo, los desastres del mar y lo que salva la travesia. */

function ParrotGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M27 8c-6 0-10 4-10 10 0 7 3 12 8 15l8 9V32c2-3 3-7 3-12 0-7-4-12-9-12z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path
        d="M18 13c-4.5 0-7 3-6.5 7 .2 1.6 1 2.8 2.3 3.6-.2-2.4 1.2-4 3.9-4.1"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="24" cy="15" r="1.6" fill="currentColor" stroke="none" />
      <path d="M24 21c5 1.5 8 5.5 8 11" />
      <path d="M11 35h13" />
    </svg>
  );
}

function ShipGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M6 30h36l-5 9H11z" fill="currentColor" fillOpacity="0.18" />
      <path d="M24 30V6" />
      <path d="M13 10h22c1.5 5 1.5 10 0 15H13c-1.5-5-1.5-10 0-15z" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 6l7 2.5-7 2.5" />
      <path d="M9 43c2.5-1.5 5-1.5 7.5 0s5 1.5 7.5 0 5-1.5 7.5 0 5 1.5 7.5 0" />
    </svg>
  );
}

function MapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M7 12l11-4 12 4 11-4v28l-11 4-12-4-11 4z" fill="currentColor" fillOpacity="0.14" />
      <path d="M18 8v28M30 12v28" />
      <path d="M12 32c3-1 4-6 8.5-6s5.5 3 8.5-2 2-6 4-6" strokeDasharray="1.5 3.5" />
      <path d="M31 14.5l5 5M36 14.5l-5 5" strokeWidth={2.5} />
    </svg>
  );
}

function SpyglassGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(-35 24 24)">
        <rect x="26" y="17.5" width="15" height="13" rx="1.5" fill="currentColor" fillOpacity="0.2" />
        <rect x="15" y="19.5" width="11" height="9" rx="1" fill="currentColor" fillOpacity="0.12" />
        <rect x="7" y="21" width="8" height="6" rx="1" />
        <path d="M30.5 17.5v13" />
        <path d="M44 20v8" />
      </g>
    </svg>
  );
}

function TreasureIslandGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.5">
        <circle cx="37" cy="12" r="4.5" fill="var(--organ-red)" />
        <path d="M10 34c2-5 7-7.5 13-7.5s11 2.5 13 7.5z" fill="var(--organ-yellow)" />
        <path d="M22 27c0-5.5-.8-10-3-14" />
        <path
          d="M19 13c-3-5.5-8-7.5-12.5-4.5 2.5 3.5 6.5 5 12.5 4.5zM19 13c3-5.5 8-7.5 12.5-4.5-2.5 3.5-6.5 5-12.5 4.5zM19 13c-5-.5-9.5 2-10.5 7.5 3.5-1 7.5-3.5 10.5-7.5zM19 13c5-.5 9.5 2 10.5 7.5-3.5-1-7.5-3.5-10.5-7.5z"
          fill="var(--organ-green)"
        />
        <path
          d="M6 35c3-2 6-2 9 0s6 2 9 0 6-2 9 0 6 2 9 0v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"
          fill="var(--organ-blue)"
        />
      </g>
    </svg>
  );
}

function KrakenGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M11 41C11 28 15 17 24 11c6-4 14-2.5 14.5 4 .4 4.5-4 6.5-7 4.5-2-1.4-1.2-4.5 1-4.2.6-2-1.5-3-4-2.3C22 14.5 20 23 20 30c0 4 .5 8 1.5 11z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="23.5" cy="34" r="1.5" />
      <circle cx="24" cy="26.5" r="1.5" />
      <circle cx="27" cy="19.5" r="1.3" />
      <path d="M24 41c3-2 6-2 9 0s6 2 9 0" />
    </svg>
  );
}

function AnchorGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="9.5" r="3.5" />
      <path d="M24 13v26M16 18h16" />
      <path
        d="M9 28c0 7.5 6.5 12.5 15 12.5S39 35.5 39 28l-3.5 2.5C34.5 35 30 37 24 37s-10.5-2-11.5-6.5z"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}

/** Saco atado con el centro en `cx`: dos iguales se leen como un canje. */
function sack(cx: number, y: number): string {
  return `M${cx - 3} ${y}c-6 4-7.5 16-3 16h12c4.5 0 3-12-3-16z`;
}

function PortTradeGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d={sack(14, 19)} fill="currentColor" fillOpacity="0.16" />
      <path d={sack(34, 19)} fill="currentColor" fillOpacity="0.16" />
      <path d="M11 19l-2-4h10l-2 4M31 19l-2-4h10l-2 4" />
      <path d="M14 11c4-4.5 16-4.5 20 0M34 11l-.3-4.3M34 11l-4.3-.3" />
      <path d="M34 39c-4 3-16 3-20 0M14 39l.3 4M14 39l4.3.3" />
    </svg>
  );
}

function GrappleGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(-35 28 26)">
        <path d="M28 15v16" />
        <circle cx="28" cy="12" r="3" />
        <path
          d="M28 32c-6.5 1-10.5-2.5-11.5-9.5l3 3c1 3.2 4 4.4 8.5 3.5zM28 32c6.5 1 10.5-2.5 11.5-9.5l-3 3c-1 3.2-4 4.4-8.5 3.5z"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <path d="M26 31l2 8 2-8" fill="currentColor" fillOpacity="0.2" />
      </g>
      <path d="M19 12.5C15 13 13 18 10 21s-3 8-2 12" />
    </svg>
  );
}

function CannonGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(-25 20 28)">
        <rect x="6" y="23" width="22" height="9" rx="4" fill="currentColor" fillOpacity="0.2" />
        <path d="M25 22v11" />
      </g>
      <circle cx="15" cy="34" r="5" fill="currentColor" fillOpacity="0.12" />
      <path d="M8 41h24" />
      <circle cx="35" cy="11" r="2.8" fill="currentColor" fillOpacity="0.3" />
      <circle cx="40.5" cy="21" r="2.4" fill="currentColor" fillOpacity="0.3" />
      <circle cx="28" cy="6.5" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

function StormGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M14 19a5.5 5.5 0 0 1-.6-11A8.5 8.5 0 0 1 29.5 7.5 5.8 5.8 0 0 1 34 19z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M17 19l-3 6h5l-3 6" />
      <g transform="rotate(-20 30 34)">
        <path d="M20 33h20l-3 5H23z" fill="currentColor" fillOpacity="0.16" />
        <path d="M30 33v-9l6 7h-6" />
      </g>
      <path d="M6 42c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6 3 9 0" />
    </svg>
  );
}

function FlagSwapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 6v18M28 24v18" />
      <path d="M8 7c4-2 8 2 12 0v9c-4 2-8-2-12 0z" fill="currentColor" fillOpacity="0.14" />
      <path d="M28 25c4-2 8 2 12 0v9c-4 2-8-2-12 0z" fill="currentColor" fillOpacity="0.35" />
      <path d="M27 9c6-1 10 3 11 9M38 18l-3.5-2.5M38 18l2-3.8" />
      <path d="M21 39c-6 1-10-3-11-9M10 30l3.5 2.5M10 30l-2 3.8" />
    </svg>
  );
}

/* Fondo: la cubierta y la costa, dibujadas a linea. */

function WheelGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="16" r="8.5" />
      <circle {...LINE} cx="16" cy="16" r="2.5" />
      <path
        {...LINE}
        d="M16 4v9.5M16 18.5V28M4 16h9.5M18.5 16H28M7.5 7.5l6.7 6.7M17.8 17.8l6.7 6.7M24.5 7.5l-6.7 6.7M14.2 17.8l-6.7 6.7"
      />
    </svg>
  );
}

function CaskGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="8" cy="16" rx="3.5" ry="7" />
      <path {...LINE} d="M8 9h15c2.5 0 4 3 4 7s-1.5 7-4 7H8" />
      <path {...LINE} d="M14 9c1.2 2 1.8 4.5 1.8 7s-.6 5-1.8 7M21 9c1.2 2 1.8 4.5 1.8 7s-.6 5-1.8 7" />
    </svg>
  );
}

function CutlassGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M11 21C18 17 24 11 28 3c-1 8-6 15-14 21" />
      <path {...LINE} d="M9 18c-1.5 3 .5 7 5 8" />
      <path {...LINE} d="M11 23l-5 5" />
      <circle {...LINE} cx="5" cy="29" r="1.2" />
    </svg>
  );
}

function TricornGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M9 17c0-5 3-8 7-8s7 3 7 8" />
      <path {...LINE} d="M3 14c3 5 7 7 13 7s10-2 13-7c-2 7-7 10-13 10S5 21 3 14z" />
      <path {...LINE} d="M16 21v3.5" />
    </svg>
  );
}

function CoinsGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="11" cy="15" rx="6" ry="2.2" />
      <path {...LINE} d="M5 15v10c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2V15" />
      <path {...LINE} d="M5 18.5c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2M5 22c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2" />
      <circle {...LINE} cx="24" cy="21" r="5" />
      <circle {...LINE} cx="24" cy="21" r="2.2" />
    </svg>
  );
}

function MessageBottleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-35 16 16)">
        <path
          {...LINE}
          d="M5 11.5h12c2 0 3 1.5 4.5 3H25v3h-3.5c-1.5 1.5-2.5 3-4.5 3H5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 5 11.5z"
        />
        <path {...LINE} d="M25 14.5h2.5v3H25" />
        <path {...LINE} d="M7 14h8v4H7z" />
      </g>
    </svg>
  );
}

function PalmGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M14 28c0-6 1-12 4-16" />
      <path {...LINE} d="M18 12c-3-3-8-3-11 0M18 12c3-4 8-4 11-1M18 12c-4 1-7 4-7 8M18 12c4 0 7 3 8 7" />
      <path {...LINE} d="M7 28h14" />
    </svg>
  );
}

function CompassRoseGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="16" r="8" />
      <path {...LINE} d="M16 3l2.5 10.5L29 16l-10.5 2.5L16 29l-2.5-10.5L3 16l10.5-2.5z" />
    </svg>
  );
}

function RopeCoilGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M14.5 16a1.5 1.5 0 0 1 3 0 3 3 0 0 1-6 0 4.5 4.5 0 0 1 9 0 6 6 0 0 1-12 0 7.5 7.5 0 0 1 15 0c0 5 2 8.5 5 11"
      />
    </svg>
  );
}

function GullGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M3 15c3.5-4 7.5-4 11 1 3.5-5 8-5 12-1" />
      <path {...LINE} d="M17 24c1.5-2 3.5-2 5 .5 1.5-2.5 3.5-2.5 5-.5" />
    </svg>
  );
}

function RopeWaveGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M0 4h64M0 8h64" />
      <path
        {...LINE}
        d="M2 8l3-4M7 8l3-4M12 8l3-4M17 8l3-4M22 8l3-4M27 8l3-4M32 8l3-4M37 8l3-4M42 8l3-4M47 8l3-4M52 8l3-4M57 8l3-4"
      />
      <path {...LINE} d="M0 17c3.5 0 4.5-4 8-4s4.5 4 8 4 4.5-4 8-4 4.5 4 8 4 4.5-4 8-4 4.5 4 8 4 4.5-4 8-4 4.5 4 8 4" />
      <path {...LINE} d="M4 22c2.5 0 3-2 5-2s2.5 2 5 2M36 22c2.5 0 3-2 5-2s2.5 2 5 2" />
    </svg>
  );
}

export const piratasArt: PackArt = {
  organs: { red: ParrotGlyph, blue: ShipGlyph, green: MapGlyph, yellow: SpyglassGlyph, wild: TreasureIslandGlyph },
  virus: KrakenGlyph,
  medicine: AnchorGlyph,
  treatments: {
    swap: PortTradeGlyph,
    steal: GrappleGlyph,
    spread: CannonGlyph,
    quarantine: StormGlyph,
    malpractice: FlagSwapGlyph,
  },
  backdrop: {
    items: [
      WheelGlyph,
      CaskGlyph,
      CutlassGlyph,
      TricornGlyph,
      CoinsGlyph,
      MessageBottleGlyph,
      PalmGlyph,
      CompassRoseGlyph,
      RopeCoilGlyph,
      GullGlyph,
    ],
    band: RopeWaveGlyph,
  },
};

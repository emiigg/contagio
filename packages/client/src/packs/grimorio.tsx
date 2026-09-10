import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Grimorio: magia elemental, maldiciones y runas. Mismo trazo que Contagio. */

function FireGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 40c-6.4 0-11-4.6-11-10.8 0-4.4 2-7.8 4-10.6.4 2.8 1.6 4.8 3.4 5.8C19.8 17.8 21 11.6 24 6c1.6 6 5.4 8.4 7.4 12 .8-1.4 1.2-3 1.2-5C35 16 35 20 35 24.4 35 33.6 30.6 40 24 40z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M24 26.5c3 2.8 4.6 5 4.6 7.4a4.6 4.6 0 0 1-9.2 0c0-2.4 1.6-4.6 4.6-7.4z" />
    </svg>
  );
}

function WaterGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 6c7.6 9.4 12 15.8 12 21.6a12 12 0 0 1-24 0C12 21.8 16.4 15.4 24 6z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M16 29c2.6-2.2 5-2.2 8 0s5.4 2.2 8 0" />
      <path d="M19 34.6c1.6-1 3.2-1 5 0" />
    </svg>
  );
}

function ForestGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 6a8.4 8.4 0 0 1 8.2 6.6 7.6 7.6 0 0 1 2.4 13.6A6.8 6.8 0 0 1 28 32H20a6.8 6.8 0 0 1-6.6-5.8 7.6 7.6 0 0 1 2.4-13.6A8.4 8.4 0 0 1 24 6z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M24 42V20M24 27l-4.6-4.2M24 23.4l4.2-3.8" />
      <path d="M18 42h12" />
    </svg>
  );
}

function BoltGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M28.6 6 13 27h9.4L19 42l16-21.4h-9.6L28.6 6z" fill="currentColor" fillOpacity="0.16" />
    </svg>
  );
}

function EtherGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 24V6l5 13 13 5z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M24 24h18l-13 5-5 13z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 24v18l-5-13-13-5z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M24 24H6l13-5 5-13z" fill="var(--organ-yellow)" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

function CurseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 7C15 7 9 13 9 21c0 5 2.4 8.4 5.6 10.2V38a2 2 0 0 0 2 2h14.8a2 2 0 0 0 2-2v-6.8C36.6 29.4 39 26 39 21c0-8-6-14-15-14z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <circle cx="18.5" cy="22" r="3.6" fill="currentColor" />
      <circle cx="29.5" cy="22" r="3.6" fill="currentColor" />
      <path d="M21 40v-4.4M27 40v-4.4" />
    </svg>
  );
}

function RuneGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M14 11c5-4.6 16-5 21-.8 4 3.4 4.6 13.6 2.6 19.8C35.6 36 30 40 23.6 40S12.4 36.6 10.8 30.6C9 24 10 15 14 11z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M24 13v22M17.4 21.4l13.2-5M17.4 30.4l13.2-5" />
    </svg>
  );
}

function TransmutationGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="24" r="15" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 6v3M24 39v3M6 24h3M39 24h3" />
      <path d="M16 20.4c2-3.6 4.8-5.4 8-5.4s6 1.8 8 5.4M32 20.4l.6-4.4M32 20.4l-4.2-1.2" />
      <path d="M32 27.6c-2 3.6-4.8 5.4-8 5.4s-6-1.8-8-5.4M16 27.6l-.6 4.4M16 27.6l4.2 1.2" />
    </svg>
  );
}

function SummonGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="22" cy="34" rx="15" ry="6" fill="currentColor" fillOpacity="0.14" />
      <path d="M16 34h12" />
      <rect x="30" y="7" width="10" height="10" rx="2" transform="rotate(12 35 12)" fill="currentColor" fillOpacity="0.2" />
      <path d="M30 17c-5 1.6-8 5.4-8 11M22 28l-3-3.4M22 28l3-3.4" />
    </svg>
  );
}

function HexGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="12" cy="24" r="5" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 19c3-1 3.4-4.6 6.4-5.6s4.2-4.6 8-4.4a2.6 2.6 0 0 1 .4 5.2c-1.6.2-2.4-1.6-1-2.6" />
      <path d="M20 24c2.6-2 4.6 2 7.2 0s4.6-2 6.8-.6a2.6 2.6 0 0 1-1.2 4.8c-1.6 0-2-1.8-.6-2.4" />
      <path d="M19 29c3 1 3.4 4.6 6.4 5.6s4.2 4.6 8 4.4a2.6 2.6 0 0 0 .4-5.2c-1.6-.2-2.4 1.6-1 2.6" />
    </svg>
  );
}

function SilenceGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M13 33c2.4-2.6 3.6-5.6 3.6-10v-2.4a7.4 7.4 0 0 1 14.8 0V23c0 4.4 1.2 7.4 3.6 10z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M24 10v3.2M20.6 36.6a3.4 3.4 0 0 0 6.8 0" />
      <path d="M9 9l30 30" />
    </svg>
  );
}

function MirrorGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="19" cy="18.5" rx="11" ry="12.5" fill="currentColor" fillOpacity="0.14" />
      <ellipse cx="19" cy="18.5" rx="6.4" ry="7.8" />
      <path d="M16.6 31h4.8l-.6 9.4a1.8 1.8 0 0 1-3.6 0z" fill="currentColor" fillOpacity="0.2" />
      <path d="M31 26h10l-3.4-3.4M41 34H31l3.4 3.4" />
    </svg>
  );
}

function MoonGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M20 4.5A12 12 0 1 0 27.5 22 9.5 9.5 0 0 1 20 4.5z" />
      <path {...LINE} d="M25 6v4M23 8h4" />
    </svg>
  );
}

function CandleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3.5c2.4 2.6 3.4 4.4 3.4 6a3.4 3.4 0 0 1-6.8 0c0-1.6 1-3.4 3.4-6z" />
      <path {...LINE} d="M11 15h10v11H11z" />
      <path {...LINE} d="M16 13v2M14.5 15v3.5" />
      <path {...LINE} d="M6 28.5h20" />
    </svg>
  );
}

function OrbGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="14" r="10" />
      <path {...LINE} d="M10.5 11a6 6 0 0 1 4-3.6" />
      <path {...LINE} d="M9 26l2-4.4M23 26l-2-4.4M7 28.5h18" />
    </svg>
  );
}

function PotionGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M13 3.5h6M13.5 3.5v7.6a9 9 0 1 0 5 0V3.5" />
      <path {...LINE} d="M8 20c2.6-1.6 5.4-1.6 8 0s5.4 1.6 8 0" />
      <path {...LINE} d="M15 24.5h.01M18.5 23h.01" />
    </svg>
  );
}

function SparkleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3c1 7 3 9 10 10-7 1-9 3-10 10-1-7-3-9-10-10 7-1 9-3 10-10z" />
      <path {...LINE} d="M25 22v6M22 25h6" />
    </svg>
  );
}

function QuillGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M27 4C17 5 10 12 9.5 22.5 20 22 27 15 27 4z" />
      <path {...LINE} d="M21 10.5 5 28.5" />
      <path {...LINE} d="M14 17.5h5M11.5 20.5h4" />
    </svg>
  );
}

function CauldronGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M5 14h22M6.5 14c-1 6.6 3 11.5 9.5 11.5S26.5 20.6 25.5 14" />
      <path {...LINE} d="M10 25l-1.5 3.5M22 25l1.5 3.5" />
      <circle {...LINE} cx="13" cy="9" r="2" />
      <circle {...LINE} cx="19" cy="5.5" r="1.5" />
    </svg>
  );
}

function MushroomGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 17C4 10 9.4 5 16 5s12 5 12 12z" />
      <path {...LINE} d="M12.5 17c-.4 4-1 7.4-2 11h11c-1-3.6-1.6-7-2-11" />
      <path {...LINE} d="M11 11h.01M20 9.5h.01M22.5 13.5h.01" />
    </svg>
  );
}

function BookGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 8.5C12.4 6 8 5.6 3.5 6.5v18c4.5-.9 8.9-.5 12.5 2 3.6-2.5 8-2.9 12.5-2V6.5C24 5.6 19.6 6 16 8.5z" />
      <path {...LINE} d="M16 8.5v18" />
      <path {...LINE} d="M7 12c2-.4 3.8-.2 5.5.5M7 16.5c2-.4 3.8-.2 5.5.5M19.5 12.5l4-1.5-1 4" />
    </svg>
  );
}

function VineGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 12c5-7 10-7 15.5 0S27 19 32 12s10.5-7 15.5 0S58 19 63 12" />
      <path {...LINE} d="M8.8 6.8c-.6-2.6.6-4.4 3-5-.2 2.6-1.2 4.2-3 5zM39.8 6.8c-.6-2.6.6-4.4 3-5-.2 2.6-1.2 4.2-3 5z" />
      <path {...LINE} d="M24.2 17.2c.6 2.6-.6 4.4-3 5 .2-2.6 1.2-4.2 3-5zM55.2 17.2c.6 2.6-.6 4.4-3 5 .2-2.6 1.2-4.2 3-5z" />
      <path {...LINE} d="M16.5 5v4M14.5 7h4M47.5 15v4M45.5 17h4" />
    </svg>
  );
}

export const grimorioArt: PackArt = {
  organs: { red: FireGlyph, blue: WaterGlyph, green: ForestGlyph, yellow: BoltGlyph, wild: EtherGlyph },
  virus: CurseGlyph,
  medicine: RuneGlyph,
  treatments: {
    swap: TransmutationGlyph,
    steal: SummonGlyph,
    spread: HexGlyph,
    quarantine: SilenceGlyph,
    malpractice: MirrorGlyph,
  },
  backdrop: {
    items: [
      MoonGlyph,
      CandleGlyph,
      OrbGlyph,
      PotionGlyph,
      SparkleGlyph,
      QuillGlyph,
      CauldronGlyph,
      MushroomGlyph,
      BookGlyph,
      MoonGlyph,
    ],
    band: VineGlyph,
  },
};

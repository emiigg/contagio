import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Heroes DC: evocaciones propias de cada emblema, nunca los logotipos oficiales. */

function FlashGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M29 6 16 25h9l-4 17 15-21h-9l4-15z" fill="currentColor" fillOpacity="0.2" />
      <path d="M7 17h7M9 24h5M7 31h8" />
    </svg>
  );
}

function CapeGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M15 8h12c3 9 8.4 17 15 22-3 1.6-5.6.4-7.6 2.4-2.4-.8-5 .2-6.2 2.6-2.4-1-5.2 0-7 2.4-2.6-1.4-5.4-.8-7.2 1C12 29 11.6 18 15 8z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M16 13h10l3 4-8 9-8-9z" fill="currentColor" fillOpacity="0.2" />
      <path d="M29 26c2 1.6 4 2.6 6.4 3" />
    </svg>
  );
}

function LanternGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M19 12a5 5 0 0 1 10 0" />
      <path d="M15 16l2-4h14l2 4z" />
      <rect x="17" y="16" width="14" height="16" rx="1.5" fill="currentColor" fillOpacity="0.16" />
      <path d="M14 38l3-6h14l3 6z" />
      <circle cx="24" cy="24" r="3.5" />
    </svg>
  );
}

function BatGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 19.5l-2-4-1 5C17 18 12 14 6 9q4 4 2 9 3-1 5 3 4 0 6 5 2 1 5 6 3-5 5-6 2-5 6-5 2-4 5-3-2-5 2-9c-6 5-11 9-15 11.5l-1-5z"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}

function TiaraGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 24l9-5v11l-8 2z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M15 19l9-10v27l-9-6z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 9l9 10v11l-9 6z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M33 19l9 5-1 8-8-2z" fill="var(--organ-yellow)" fillOpacity="0.5" />
        <path
          d="M24 16.5l1.9 4.1 4.4.4-3.3 3 1 4.4-4-2.3-4 2.3 1-4.4-3.3-3 4.4-.4z"
          fill="var(--paper)"
        />
      </g>
    </svg>
  );
}

function MaskGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M6 18c5-3.4 11-4 18-1 7-3 13-2.4 18 1 0 9-3.6 14.6-9 14.6-4 0-6.6-2.6-9-5.6-2.4 3-5 5.6-9 5.6-5.4 0-9-5.6-9-14.6z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M11 21.5l9 3c-1.6 3-6.4 3.4-9-3zM37 21.5l-9 3c1.6 3 6.4 3.4 9-3z" fill="currentColor" />
    </svg>
  );
}

function CrestGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 6l14 5v11c0 9.4-5.6 16.4-14 20-8.4-3.6-14-10.6-14-20V11z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M17 23l7-6 7 6M17 31l7-6 7 6" />
    </svg>
  );
}

function PortalGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="11" cy="24" rx="4.5" ry="11" fill="currentColor" fillOpacity="0.16" />
      <ellipse cx="37" cy="24" rx="4.5" ry="11" fill="currentColor" fillOpacity="0.16" />
      <path d="M17 19h13l-3.5-3.5M31 29H18l3.5 3.5" />
    </svg>
  );
}

function RecruitGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="32" cy="13" r="4.5" />
      <path d="M25 39l2.6-17h8.8L39 39z" fill="currentColor" fillOpacity="0.18" />
      <path d="M22 16c-8 0-12 6-11 16M7.5 28.5 11 32l3.5-3.5" />
    </svg>
  );
}

function BreakoutGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="6" y="9" width="22" height="30" rx="1.5" fill="currentColor" fillOpacity="0.14" />
      <path d="M11 9v30M23 9v30" />
      <path d="M17 9v8c0 3-3 4.5-3 7.5V39M17 9" />
      <path d="M31 24h11M31 20l9-7M31 28l9 7" />
    </svg>
  );
}

function PhantomGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M15 7l24 4-4 25-24-4z" fill="currentColor" fillOpacity="0.16" />
      <path d="M17.5 13.5l-2 12M22 13l-1 6" />
      <path d="M14 41h18" />
    </svg>
  );
}

function MultiverseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="19" cy="21" r="9" fill="currentColor" fillOpacity="0.14" />
      <circle cx="29" cy="27" r="9" fill="currentColor" fillOpacity="0.14" />
      <path d="M29 7c5 1 9 5 10.5 10M36.5 15.5l3 1.5 1.5-3" />
      <path d="M19 41c-5-1-9-5-10.5-10M11.5 32.5l-3-1.5-1.5 3" />
    </svg>
  );
}

/* Fondo: la ciudad de noche. */

function TowerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M9 29V8h14v21M6 29h20M16 8V3" />
      <path {...LINE} d="M12.5 12h1M18.5 12h1M12.5 16.5h1M18.5 16.5h1M12.5 21h1M18.5 21h1M15 29v-4h2v4" />
    </svg>
  );
}

function SearchlightGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M7 19l5-3 4 7-5 3z" />
      <path {...LINE} d="M12 26l-2 3M14 24l3 5M8 29h11" />
      <path {...LINE} d="M12 16L20 3M16 23L29 11" />
      <path {...LINE} d="M22 5.5l1 1M25.5 8.5l1 1" />
    </svg>
  );
}

function StarGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 4l3.5 7.6 8.3.9-6.2 5.6 1.8 8.2L16 22.1l-7.4 4.2 1.8-8.2-6.2-5.6 8.3-.9z" />
    </svg>
  );
}

function BurstGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M16 3l2.6 7.4 7-4-2.4 7.4 7.3 2.2-7.3 2.6 3.4 7-7.4-2.8L16 29l-2.8-6.2-7.4 2.8 3.4-7L1.9 16l7.3-2.2-2.4-7.4 7 4z"
      />
    </svg>
  );
}

function FlyingCapeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 6h8c3 6 8 10 15 12-2.4 1.8-4.6 1.4-6.4 2.6.4 2-.8 3.6-2.8 4-1-1.6-3-2-4.8-1.2-.2 2-1.6 3.2-3.6 3.2C7 22 5 14 6 6z" />
      <path {...LINE} d="M9.5 10c.6 5 2.4 9 5 12M14 10c2 4.4 4.6 7.2 7.6 9" />
      <path {...LINE} d="M4.5 6h11" />
    </svg>
  );
}

function WaterTowerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3L7 9h18z" />
      <path {...LINE} d="M8 9v10h16V9M8 14h16" />
      <path {...LINE} d="M10 19l-2 10M22 19l2 10M16 19v10M9 25h14" />
    </svg>
  );
}

function HookGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3c-3 1.4-3 3.4 0 4.6S19 10 16 11" />
      <path {...LINE} d="M16 11v13" />
      <path {...LINE} d="M16 24c-5 0-8.4-3.6-8.4-9l3.4 2.6M16 24c5 0 8.4-3.6 8.4-9L21 17.6M16 24v5" />
    </svg>
  );
}

function StreetlampGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M11 29V9c0-3 2-5 5-5h4c2 0 3 1 3 3" />
      <path {...LINE} d="M19 7h8l-1.5 4h-5z" />
      <path {...LINE} d="M8 29h6M21.5 14l-1 2M25.5 14l1 2" />
    </svg>
  );
}

function BalloonGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 5c7.2 0 12 3.8 12 8.6s-4.8 8.6-12 8.6c-1.2 0-2.4-.1-3.5-.4L7 27l1.4-6.6C5.6 18.8 4 16.4 4 13.6 4 8.8 8.8 5 16 5z" />
    </svg>
  );
}

function MoonGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M20 4a12 12 0 1 0 8 19.6A10 10 0 0 1 20 4z" />
      <path {...LINE} d="M6 7v3M4.5 8.5h3" />
    </svg>
  );
}

function SkylineGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path
        {...LINE}
        d="M1 22h4v-7h5v-4h4v11h3V5h2V2v3h2v17h3v-9l4-4 4 4v9h2V8h6v14h3v-6h4v-5h3v11h2v-7h4v7h3"
      />
    </svg>
  );
}

export const heroesArt: PackArt = {
  organs: { red: FlashGlyph, blue: CapeGlyph, green: LanternGlyph, yellow: BatGlyph, wild: TiaraGlyph },
  virus: MaskGlyph,
  medicine: CrestGlyph,
  treatments: {
    swap: PortalGlyph,
    steal: RecruitGlyph,
    spread: BreakoutGlyph,
    quarantine: PhantomGlyph,
    malpractice: MultiverseGlyph,
  },
  backdrop: {
    items: [
      TowerGlyph,
      SearchlightGlyph,
      StarGlyph,
      BurstGlyph,
      FlyingCapeGlyph,
      WaterTowerGlyph,
      HookGlyph,
      StreetlampGlyph,
      BalloonGlyph,
      MoonGlyph,
    ],
    band: SkylineGlyph,
  },
};

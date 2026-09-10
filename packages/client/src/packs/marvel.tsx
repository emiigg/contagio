import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Heroes Marvel: siluetas propias de cada heroe, sin logotipos ni letras. */

function HelmetGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 6c8.6 0 14 5 14 13v7l-4 10-6 6h-8l-6-6-4-10v-7c0-8 5.4-13 14-13z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M14.5 21.5l7.5 1.5-1 3h-5.5zM33.5 21.5l-7.5 1.5 1 3h5.5z" fill="currentColor" />
      <path d="M17 33.5h14M24 6v9" />
    </svg>
  );
}

function ShieldGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="24" r="17" fill="currentColor" fillOpacity="0.14" />
      <circle cx="24" cy="24" r="11.5" />
      <path
        d="M24 16l1.9 5.4 5.7.1-4.6 3.5 1.7 5.5L24 27.2l-4.7 3.3 1.7-5.5-4.6-3.5 5.7-.1z"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  );
}

function FistGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M9 21c0-4 2-6 4.5-6 1.6 0 2.8.8 3.5 2 .6-2.6 2.4-4 4.8-4s4 1.4 4.6 3.6c.8-2 2.4-3.1 4.6-3.1 2.6 0 4.2 1.8 4.6 4 .7-1 1.8-1.6 3-1.6 2.4 0 3.4 2 3.4 5V30c0 7-4.4 12-12 12h-9C13.4 42 9 37 9 30z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M17 17.5v6M26.4 16.6v6.4M35.6 18.4v5.6" />
      <path d="M9.5 27.5H26a3 3 0 0 1 0 6h-9" />
    </svg>
  );
}

function HammerGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="translate(2 1.5) rotate(-30 24 24)">
        <rect x="13" y="9" width="22" height="11" rx="2" fill="currentColor" fillOpacity="0.2" />
        <path d="M17.5 9v11M30.5 9v11" />
        <path d="M22 20h4v16h-4zM22 25.5h4M22 30.5h4" />
        <circle cx="24" cy="38.3" r="2.2" />
      </g>
    </svg>
  );
}

function WebGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 24V7q4.9 5.1 12 5-.1 7.1 5 12z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M24 24h17q-5.1 4.9-5 12-7.1-.1-12 5z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 24v17q-4.9-5.1-12-5 .1-7.1-5-12z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M24 24H7q5.1-4.9 5-12 7.1.1 12-5z" fill="var(--organ-yellow)" fillOpacity="0.5" />
        <path d="M12 12l24 24M36 12L12 36" />
        <path d="M24 14q2.9 3 7.1 2.9-.1 4.2 2.9 7.1-3 2.9-2.9 7.1-4.2-.1-7.1 2.9-2.9-3-7.1-2.9.1-4.2-2.9-7.1 3-2.9 2.9-7.1 4.2.1 7.1-2.9z" />
      </g>
    </svg>
  );
}

function HornsGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M14 25C8 23 5 17 7 8c2 6 5 9.4 9 10.6M34 25c6-2 9-8 7-17-2 6-5 9.4-9 10.6"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M14 27c0-7.4 4-12 10-12s10 4.6 10 12v8l-4 6H18l-4-6z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M19 26h10v6l-2.5 4h-5L19 32z" />
    </svg>
  );
}

function CoreGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="24" r="9" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      <path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M36.7 11.3l-4.2 4.2M15.5 32.5l-4.2 4.2" />
    </svg>
  );
}

function QuantumGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="24" r="10" fill="currentColor" fillOpacity="0.14" />
      <path d="M24 24a2 2 0 0 1 4 0 4 4 0 0 1-8 0 6 6 0 0 1 12 0 8 8 0 0 1-16 0" />
      <path d="M9 14C15 5 33 5 39 14M39 14l-.6-5.4M39 14l-5.4.6" />
      <path d="M39 34C33 43 15 43 9 34M9 34l.6 5.4M9 34l5.4-.6" />
    </svg>
  );
}

function InitiativeGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M31 12l10 5.8v11.4L31 35l-10-5.8V17.8z" fill="currentColor" fillOpacity="0.18" />
      <circle cx="31" cy="20.5" r="3" />
      <path d="M25.5 29.5c3-4.6 8-4.6 11 0" />
      <path d="M17 24H6M11 19l-5 5 5 5" />
    </svg>
  );
}

function RaftGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="20" cy="36" rx="13" ry="5" fill="currentColor" fillOpacity="0.16" />
      <g transform="rotate(35 36 17)">
        <ellipse cx="36" cy="17" rx="4.5" ry="10" fill="currentColor" fillOpacity="0.2" />
        <path d="M36 11v12" />
      </g>
      <path d="M14 33L9 20M9 20l-1.8 5.2M9 20l4.6 3" />
      <path d="M22 32V13M22 13l-3.5 3.5M22 13l3.5 3.5" />
    </svg>
  );
}

function SnapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M9 42V29c0-3 1.4-5 4-5.6V12a2.5 2.5 0 0 1 5 0v10.4l1.4-.2V15a2.5 2.5 0 0 1 5 0v7.6c3.6.4 5.6 2.6 5.6 6V33c0 5-3.6 9-8.6 9z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M13 29c3-2 7-2.4 10.4-1.4" />
      <path d="M28 10c2 1.4 2.8 3.4 2.4 5.6M31.5 7c3 2.2 4 5.2 3.4 8.6" />
      <path
        d="M35 21a1.4 1.4 0 1 0 0 .1zM40 18a1.2 1.2 0 1 0 0 .1zM38.5 25.5a1 1 0 1 0 0 .1zM42 23a.8.8 0 1 0 0 .1z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function IncursionGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="14.5" cy="28" r="8.5" fill="currentColor" fillOpacity="0.16" />
      <circle cx="33.5" cy="20" r="8.5" fill="currentColor" fillOpacity="0.16" />
      <path d="M6 28h17M33.5 11.5c-3 3-3 13.5 0 17" />
      <path d="M24 13v4M20 16l2 2M28 30l-2-2M24 35v-4" />
    </svg>
  );
}

/* Fondo: la ciudad de los heroes. */

function HighTowerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M11 29V11l3-3h4l3 3v18M8 29h16M16 8V3" />
      <path {...LINE} d="M11 15h10M13 19v6M16 19v6M19 19v6" />
    </svg>
  );
}

function HelicopterGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M5 9h22M16 9v4" />
      <path {...LINE} d="M9 18c0-3 2.4-5 5.4-5H18c2.6 0 4 1.6 4 4v2c0 1.6-1.2 2.6-2.8 2.6H11c-1.2 0-2-1-2-2z" />
      <path {...LINE} d="M22 17h7l1-2M11 25h10M13 21.6v3.4M18 21.6v3.4" />
    </svg>
  );
}

function BoltGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M18 3L9 17h6l-3 12 11-15h-6z" />
      <path {...LINE} d="M24 6l2-2M26 10h3" />
    </svg>
  );
}

function WebCornerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M3 3h26M3 3v26M3 3l24 11M3 3l11 24M3 3l23 23" />
      <path {...LINE} d="M13 3q-2 2.5-.9 4.2-2.1.8-2 2.9-2.1-.1-2.9 2-1.7-1.1-4.2.9" />
      <path {...LINE} d="M23 3q-4 4-1.8 8.3-4.2 1.7-4.1 5.8-4.1-.1-5.8 4.1Q7 19 3 23" />
    </svg>
  );
}

function GauntletGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M10 29v-8l-2-5a1.6 1.6 0 0 1 3-1l1.6 3V7a1.6 1.6 0 0 1 3.2 0v8V5a1.6 1.6 0 0 1 3.2 0v10V7a1.6 1.6 0 0 1 3.2 0v14l-1 8z" />
      <path {...LINE} d="M12.6 21.5h9.4M15 25h4" />
    </svg>
  );
}

function PowGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 7l6 4 3-7 3 6 7-4-2 7 7 2-6 4 4 6-7-1-1 7-4-5-5 4v-6l-7-1 5-4-4-5z" />
    </svg>
  );
}

function SparkGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 4q1.6 10.4 12 12-10.4 1.6-12 12-1.6-10.4-12-12Q14.4 14.4 16 4z" />
      <path {...LINE} d="M26 5v4M24 7h4" />
    </svg>
  );
}

function SkyscraperGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 29V13h7V5h8v8h5v16M4 29h24" />
      <path {...LINE} d="M16 9h2M16 13h2M9 17h1M9 21h1M16 17h2M16 21h2M22 17h1M22 21h1M9 25h1M22 25h1" />
    </svg>
  );
}

function RingPortalGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="16" cy="15" rx="8" ry="11" />
      <ellipse {...LINE} cx="16" cy="15" rx="4.5" ry="7" />
      <path {...LINE} d="M26 7l2-2M27.5 13H30M5 22l-2 2M4.5 15H2M9 29h14" />
    </svg>
  );
}

function CrescentGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M12 4a12 12 0 1 0 16 16A10 10 0 0 1 12 4z" />
      <circle {...LINE} cx="11" cy="21" r="1.5" />
      <path {...LINE} d="M26 5v3M24.5 6.5h3" />
    </svg>
  );
}

function HeroSkylineGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path
        {...LINE}
        d="M1 22h3v-6h5v-5h4v11h3v-8h4v8h2V8l3-3h2V1v4h2l3 3v14h3V12h5v10h2v-7l3-3 3 3v7h3v-9h4v9h4v-5h3v5h1"
      />
    </svg>
  );
}

export const marvelArt: PackArt = {
  organs: { red: HelmetGlyph, blue: ShieldGlyph, green: FistGlyph, yellow: HammerGlyph, wild: WebGlyph },
  virus: HornsGlyph,
  medicine: CoreGlyph,
  treatments: {
    swap: QuantumGlyph,
    steal: InitiativeGlyph,
    spread: RaftGlyph,
    quarantine: SnapGlyph,
    malpractice: IncursionGlyph,
  },
  backdrop: {
    items: [
      HighTowerGlyph,
      HelicopterGlyph,
      BoltGlyph,
      WebCornerGlyph,
      GauntletGlyph,
      PowGlyph,
      SparkGlyph,
      SkyscraperGlyph,
      RingPortalGlyph,
      CrescentGlyph,
    ],
    band: HeroSkylineGlyph,
  },
};

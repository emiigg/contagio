import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Asedio: un castillo sitiado. Los organos son las piezas del baluarte. */

function ArmoryGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M9 9l22.4 19.6-2.8 2.8z" fill="currentColor" fillOpacity="0.16" />
      <path d="M39 9L16.6 28.6l2.8 2.8z" fill="currentColor" fillOpacity="0.16" />
      <path d="M26 34l8-8M14 26l8 8" />
      <path d="M30 30l6 6M18 30l-6 6" />
      <circle cx="37.5" cy="37.5" r="1.8" />
      <circle cx="10.5" cy="37.5" r="1.8" />
    </svg>
  );
}

function WellGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 16l16-9 16 9z" fill="currentColor" fillOpacity="0.2" />
      <path d="M13 16v11M35 16v11M24 16v5" />
      <path d="M20.5 21h7l-1 5h-5z" />
      <rect x="10" y="27" width="28" height="13" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <path d="M10 33.5h28" />
    </svg>
  );
}

function GardenGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 33h32l-3 7H11z" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 33V17" />
      <path d="M24 25c-1.5-6-6-8.5-13-8 .5 6 5.5 9 13 8z" fill="currentColor" fillOpacity="0.2" />
      <path d="M24 19c1-6.5 6-10 13-10-.5 7-5.5 10.5-13 10z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function TreasureGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 22v-3a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v3z" fill="currentColor" fillOpacity="0.2" />
      <rect x="8" y="22" width="32" height="16" rx="1.5" fill="currentColor" fillOpacity="0.12" />
      <path d="M15 11.5V38M33 11.5V38" />
      <rect x="21" y="19" width="6" height="7" rx="1" />
    </svg>
  );
}

function KeepGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.5">
        <path d="M12 26V8h5v4h4.5V8H24v18z" fill="var(--organ-yellow)" />
        <path d="M24 26V8h2.5v4H31V8h5v18z" fill="var(--organ-red)" />
        <path d="M24 26h12v14H24z" fill="var(--organ-blue)" />
        <path d="M12 26h12v14H12z" fill="var(--organ-green)" />
        <path d="M19.5 40v-5a4.5 4.5 0 0 1 9 0v5z" fill="var(--paper)" fillOpacity="1" />
      </g>
    </svg>
  );
}

function TorchGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 6c5.5 5 8.5 9.5 8.5 13.5a8.5 8.5 0 0 1-17 0c0-3 1.6-6 4.5-8.5.3 3 1.4 4.6 3.4 5.6-1-4.4-.5-7.6.6-10.6z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M18 28h12l-2 4h-8z" />
      <path d="M22 32l1 9h2l1-9" />
    </svg>
  );
}

function ShieldGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 7c5 2.4 10 3.5 15 3.5v11C39 30.5 32.5 36.5 24 41 15.5 36.5 9 30.5 9 21.5v-11c5 0 10-1.1 15-3.5z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M15 27l9-7 9 7" />
    </svg>
  );
}

function TreatyGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M17 13h14v22H17z" fill="currentColor" fillOpacity="0.14" />
      <path d="M15 10h18a1.5 1.5 0 0 1 0 3H15a1.5 1.5 0 0 1 0-3zM15 35h18a1.5 1.5 0 0 1 0 3H15a1.5 1.5 0 0 1 0-3z" />
      <path d="M20.5 18h7M20.5 22.5h5" />
      <circle cx="27" cy="29" r="3.5" fill="currentColor" fillOpacity="0.3" />
      <path d="M8.5 12v24M5 32.5l3.5 3.5 3.5-3.5M39.5 36V12M36 15.5l3.5-3.5 3 3.5" />
    </svg>
  );
}

function ConquestGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M13 40V23h4.5v3.5h4.5V23h4v3.5h4.5V23H35v17z" fill="currentColor" fillOpacity="0.14" />
      <path d="M24 23V7" />
      <path d="M24 8c4-1.6 8 1.6 12 0v8c-4 1.6-8-1.6-12 0z" fill="currentColor" fillOpacity="0.3" />
      <path d="M20.5 40v-4a3.5 3.5 0 0 1 7 0v4" />
    </svg>
  );
}

function CatapultGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M7 30h26v4H7z" fill="currentColor" fillOpacity="0.16" />
      <circle cx="12" cy="36.5" r="3" />
      <circle cx="28" cy="36.5" r="3" />
      <path d="M16 30l5-10 5 10M30 30L12.5 12" />
      <path d="M9 15.5a4 4 0 0 0 7-7" />
      <circle cx="30" cy="10" r="3.2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="39" cy="17" r="2.6" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

function SiegeRingGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M24 6v4M24 42v-4M6 24h4M42 24h-4" />
      <path
        d="M24 16l-3.5-6h7zM24 32l-3.5 6h7zM16 24l-6-3.5v7zM32 24l6-3.5v7z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <circle cx="24" cy="24" r="4.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="11" />
    </svg>
  );
}

function CoupGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M7 22l1-12 4.5 5L15 8l2.5 7 4.5-5 1 12z" fill="currentColor" fillOpacity="0.2" />
      <path d="M25 40l1-12 4.5 5 2.5-7 2.5 7 4.5-5 1 12z" fill="currentColor" fillOpacity="0.2" />
      <path d="M27 15h11l-3-3M21 33H10l3 3" />
    </svg>
  );
}

function BannerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M8 29V3" />
      <path {...LINE} d="M8 5h17l-4.5 5 4.5 5H8" />
      <path {...LINE} d="M6 29h4" />
    </svg>
  );
}

function ArrowGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 26L22 10" />
      <path {...LINE} d="M27 5l-9 3 6 6z" />
      <path {...LINE} d="M9 23H4.5M9 23v4.5M12 20H7.5M12 20v4.5" />
    </svg>
  );
}

function HorseshoeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M8.5 27.5C6 22 5 18 5 14.5a11 11 0 0 1 22 0c0 3.5-1 7.5-3.5 13h-4c2-5.5 3-9.5 3-13a6.5 6.5 0 0 0-13 0c0 3.5 1 7.5 3 13z"
      />
      <path {...LINE} d="M7.4 17.5h.01M9.2 10h.01M22.8 10h.01M24.6 17.5h.01" />
    </svg>
  );
}

function KeyGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="8" cy="16" r="5" />
      <path {...LINE} d="M13 16h16" />
      <path {...LINE} d="M29 16v5M25 16v4M21 16v3" />
    </svg>
  );
}

function GobletGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M9 4h14c0 7-3 11.5-7 11.5S9 11 9 4z" />
      <path {...LINE} d="M16 15.5V25" />
      <path {...LINE} d="M10.5 28c0-2 2.2-3 5.5-3s5.5 1 5.5 3z" />
    </svg>
  );
}

function BowGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M10 3.5c9 5 9 20 0 25" />
      <path {...LINE} d="M10 3.5L5 16l5 12.5" />
      <path {...LINE} d="M5 16h22" />
      <path {...LINE} d="M27 16l-3.5-3M27 16l-3.5 3" />
    </svg>
  );
}

function PortcullisGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M5 29V14a11 11 0 0 1 22 0v15" />
      <path {...LINE} d="M10 5v24M16 3v26M22 5v24" />
      <path {...LINE} d="M5 13h22M5 21h22" />
    </svg>
  );
}

function CandleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3.5c2 2.5 3 4 3 5.5a3 3 0 0 1-6 0c0-1.5 1-3 3-5.5z" />
      <path {...LINE} d="M16 12v2" />
      <path {...LINE} d="M12 14h8v14h-8z" />
      <path {...LINE} d="M7 28h18" />
    </svg>
  );
}

function BarrelGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M9.5 4h13c2 4 3 8 3 12s-1 8-3 12h-13c-2-4-3-8-3-12s1-8 3-12z" />
      <path {...LINE} d="M7.3 10h17.4M7.3 22h17.4" />
      <path {...LINE} d="M16 4v24" />
    </svg>
  );
}

function HelmGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M7 26V13c0-4.5 4-8 9-8s9 3.5 9 8v13l-9 3z" />
      <path {...LINE} d="M16 5v24M9 14h5M18 14h5" />
      <path {...LINE} d="M19.5 20h.01M19.5 23.5h.01M12.5 20h.01M12.5 23.5h.01" />
      <path {...LINE} d="M16 5c2-2.5 6-3 9-1.5" />
    </svg>
  );
}

function BattlementGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 18h3V9h7v9h5V9h7v9h5V9h7v9h5V9h7v9h5V9h7v9h3" />
      <path {...LINE} d="M1 22h62" />
      <path {...LINE} d="M7.5 12v3M31.5 12v3M55.5 12v3" />
    </svg>
  );
}

export const asedioArt: PackArt = {
  organs: { red: ArmoryGlyph, blue: WellGlyph, green: GardenGlyph, yellow: TreasureGlyph, wild: KeepGlyph },
  virus: TorchGlyph,
  medicine: ShieldGlyph,
  treatments: {
    swap: TreatyGlyph,
    steal: ConquestGlyph,
    spread: CatapultGlyph,
    quarantine: SiegeRingGlyph,
    malpractice: CoupGlyph,
  },
  backdrop: {
    items: [
      BannerGlyph,
      ArrowGlyph,
      HorseshoeGlyph,
      KeyGlyph,
      HelmGlyph,
      BowGlyph,
      PortcullisGlyph,
      GobletGlyph,
      CandleGlyph,
      BarrelGlyph,
    ],
    band: BattlementGlyph,
  },
};

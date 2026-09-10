import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Cortafuegos: la mesa es una sala de servidores, el contagio es malware. */

function ChipGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="13" y="13" width="22" height="22" rx="2.5" fill="currentColor" fillOpacity="0.16" />
      <rect x="19.5" y="19.5" width="9" height="9" rx="1" />
      <path d="M19.5 13V7M28.5 13V7M19.5 35v6M28.5 35v6M13 19.5H7M13 28.5H7M35 19.5h6M35 28.5h6" />
    </svg>
  );
}

function DatabaseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M11 12.5v23c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5v-23"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <ellipse cx="24" cy="12.5" rx="13" ry="4.5" />
      <path d="M11 20.5c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5M11 28c0 2.5 5.8 4.5 13 4.5s13-2 13-4.5" />
    </svg>
  );
}

function RouterGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="7" y="25" width="34" height="13" rx="3" fill="currentColor" fillOpacity="0.16" />
      <path d="M13 25l-2.5-15M35 25l2.5-15" />
      <path d="M13 31.5h2M19 31.5h2M25 31.5h2" />
      <path d="M20 18.5a5.6 5.6 0 0 1 8 0M17 15a10 10 0 0 1 14 0" />
    </svg>
  );
}

function PowerSupplyGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M19 7v8M29 7v8" />
      <path d="M12.5 15h23v7a11.5 11.5 0 0 1-23 0z" fill="currentColor" fillOpacity="0.16" />
      <path d="M25.5 18l-4.5 6.5h6l-4.5 6.5" />
      <path d="M24 33.5V41" />
    </svg>
  );
}

/* Nube partida en cuatro: los arcos son los de tres circulos cortados por x=24 e y=29. */
function HybridCloudGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.5">
        <path d="M24 29V9.5A10.5 10.5 0 0 0 13.81 22.53A7.5 7.5 0 0 0 7.07 29z" fill="var(--organ-yellow)" />
        <path d="M24 29V9.5A10.5 10.5 0 0 1 34.19 22.53A7.5 7.5 0 0 1 40.93 29z" fill="var(--organ-red)" />
        <path d="M24 29H40.93A7.5 7.5 0 0 1 33.5 37.5H24z" fill="var(--organ-blue)" />
        <path d="M24 29H7.07A7.5 7.5 0 0 0 14.5 37.5H24z" fill="var(--organ-green)" />
      </g>
    </svg>
  );
}

function BugGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="24" cy="28.5" rx="8.5" ry="10" fill="currentColor" fillOpacity="0.18" />
      <circle cx="24" cy="14.5" r="4.5" />
      <path d="M22 10.5l-3-3.5M26 10.5l3-3.5" />
      <path d="M24 20v17" />
      <path d="M16 23.5l-6-3M15.5 29H8.5M16.5 34l-5 4.5M32 23.5l6-3M32.5 29h7M31.5 34l5 4.5" />
    </svg>
  );
}

function ShieldGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 7l14 5v10c0 9-6 15.5-14 19-8-3.5-14-10-14-19V12z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M17.5 24l4.5 4.5 8.5-9" />
    </svg>
  );
}

function MigrationGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="6" y="12" width="12" height="24" rx="2" fill="currentColor" fillOpacity="0.16" />
      <rect x="30" y="12" width="12" height="24" rx="2" fill="currentColor" fillOpacity="0.16" />
      <path d="M10 18h4M10 23h4M34 18h4M34 23h4" />
      <path d="M21 19h6M24.5 16.5L27 19l-2.5 2.5M27 29h-6M23.5 26.5L21 29l2.5 2.5" />
    </svg>
  );
}

function HijackGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="7" y="7" width="16" height="16" rx="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 19l2.5 20 5-6 5.5 7.5 3.5-2.5-5.5-7.5 7.5-1.5z" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}

function ChainMailGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="6" y="15" width="22" height="17" rx="2" fill="currentColor" fillOpacity="0.16" />
      <path d="M6.5 16.5l10.5 8 10.5-8" />
      <path d="M28 23.5h3l8-8M31 23.5l8 8" />
      <path d="M34 15.5h5v5M34 31.5h5v-5" />
    </svg>
  );
}

function BlackoutGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M15.6 16a13 13 0 1 0 16.8 0" fill="currentColor" fillOpacity="0.12" />
      <path d="M24 8v16" />
    </svg>
  );
}

function DiskCloneGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="15" cy="15.5" r="8.5" fill="currentColor" fillOpacity="0.16" />
      <circle cx="33" cy="32.5" r="8.5" fill="currentColor" fillOpacity="0.16" />
      <circle cx="15" cy="15.5" r="2" />
      <circle cx="33" cy="32.5" r="2" />
      <path d="M27 11h2a5 5 0 0 1 5 5v4M31 17.5l3 3 3-3M21 37h-2a5 5 0 0 1-5-5v-4M17 30.5l-3-3-3 3" />
    </svg>
  );
}

function CircuitGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M3 9h7l4 4v10" />
      <circle {...LINE} cx="14" cy="25.5" r="2.5" />
      <path {...LINE} d="M29 13h-6l-4-4V7.5" />
      <circle {...LINE} cx="19" cy="5" r="2.5" />
      <path {...LINE} d="M29 21h-7v4" />
      <circle {...LINE} cx="22" cy="27.5" r="2.5" />
    </svg>
  );
}

function CursorGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M9 4v20l5.5-5 4 9 4-1.8-4-8.8H26z" />
    </svg>
  );
}

function PlugGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M13 11V4M19 11V4" />
      <rect {...LINE} x="9.5" y="11" width="13" height="10" rx="2.5" />
      <path {...LINE} d="M16 21v3a4 4 0 0 0 4 4h8" />
    </svg>
  );
}

function WifiGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M3.3 13.3a18 18 0 0 1 25.4 0" />
      <path {...LINE} d="M7.5 17.5a12 12 0 0 1 17 0" />
      <path {...LINE} d="M11.8 21.8a6 6 0 0 1 8.4 0" />
      <circle {...LINE} cx="16" cy="26" r="1.2" />
    </svg>
  );
}

function KeycapGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="5" y="6" width="22" height="20" rx="3" />
      <rect {...LINE} x="9" y="9" width="14" height="12" rx="2" />
      <path {...LINE} d="M14 17.5h4" />
    </svg>
  );
}

function GearGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M13.6 6.8L13.5 3.7L18.5 3.7L18.4 6.8L20.8 7.8L22.9 5.6L26.4 9.1L24.2 11.2L25.2 13.6L28.3 13.5L28.3 18.5L25.2 18.4L24.2 20.8L26.4 22.9L22.9 26.4L20.8 24.2L18.4 25.2L18.5 28.3L13.5 28.3L13.6 25.2L11.2 24.2L9.1 26.4L5.6 22.9L7.8 20.8L6.8 18.4L3.7 18.5L3.7 13.5L6.8 13.6L7.8 11.2L5.6 9.1L9.1 5.6L11.2 7.8z"
      />
      <circle {...LINE} cx="16" cy="16" r="4" />
    </svg>
  );
}

function TerminalGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="3.5" y="6" width="25" height="20" rx="2.5" />
      <path {...LINE} d="M3.5 11h25" />
      <path {...LINE} d="M8 15.5l3.5 3-3.5 3" />
      <path {...LINE} d="M14 21.5h5" />
    </svg>
  );
}

function FloppyGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 5h16l5 5v17H6z" />
      <path {...LINE} d="M11 5v6h9V5" />
      <path {...LINE} d="M10 27v-8h12v8" />
    </svg>
  );
}

function MouseGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="9" y="4" width="14" height="24" rx="7" />
      <path {...LINE} d="M16 4v7M9 11h14" />
    </svg>
  );
}

function PadlockGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="7" y="14" width="18" height="14" rx="2.5" />
      <path {...LINE} d="M11 14v-4a5 5 0 0 1 10 0v4" />
      <path {...LINE} d="M16 19.5v3" />
    </svg>
  );
}

function TraceBandGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 12h9l5-6h9l4 6h8l5 6h9l4-6h9" />
      <path {...LINE} d="M19 6v8M32 12V7.5M45 18v-8" />
      <circle {...LINE} cx="19" cy="16" r="2" />
      <circle {...LINE} cx="32" cy="5.5" r="2" />
      <circle {...LINE} cx="45" cy="8" r="2" />
    </svg>
  );
}

export const cortafuegosArt: PackArt = {
  organs: {
    red: ChipGlyph,
    blue: DatabaseGlyph,
    green: RouterGlyph,
    yellow: PowerSupplyGlyph,
    wild: HybridCloudGlyph,
  },
  virus: BugGlyph,
  medicine: ShieldGlyph,
  treatments: {
    swap: MigrationGlyph,
    steal: HijackGlyph,
    spread: ChainMailGlyph,
    quarantine: BlackoutGlyph,
    malpractice: DiskCloneGlyph,
  },
  backdrop: {
    items: [
      CircuitGlyph,
      CursorGlyph,
      PlugGlyph,
      WifiGlyph,
      KeycapGlyph,
      GearGlyph,
      TerminalGlyph,
      FloppyGlyph,
      MouseGlyph,
      PadlockGlyph,
    ],
    band: TraceBandGlyph,
  },
};

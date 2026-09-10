import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Arrecife: criaturas del coral, lo que las amenaza y lo que las salva. */

function CrabGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="24" cy="29" rx="11" ry="7" fill="currentColor" fillOpacity="0.16" />
      <path d="M13.5 28l-6 2M14 32.5l-5 4.5M34.5 28l6 2M34 32.5l5 4.5" />
      <path d="M17 23.5l-4-6M31 23.5l4-6" />
      <path d="M13 17.5c-4 -1-6-4.5-5-9.5l3.2 3.2 2-4.2c2.6 3.4 2.6 7.6-.2 10.5z" fill="currentColor" fillOpacity="0.16" />
      <path d="M35 17.5c4-1 6-4.5 5-9.5l-3.2 3.2-2-4.2c-2.6 3.4-2.6 7.6.2 10.5z" fill="currentColor" fillOpacity="0.16" />
      <path d="M21 22v-3.5M27 22v-3.5" />
    </svg>
  );
}

function WhaleGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M7 26c0-5.4 5-9.6 13-9.6 7.4 0 11.6 3.6 14.6 7.6 1.6-2.8 3.8-4.8 6.8-5.8-.4 3.8-1.6 6.6-3.8 8.6 1.6 2.2 2.8 4.4 3.4 7-3-.4-5.6-1.8-7.4-3.8C31 34 26 36.4 19 36.4 11.6 36.4 7 32 7 26z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M8.6 30.4c5 2.4 12 3 18 .8" />
      <circle cx="13.5" cy="24.5" r="1.3" fill="currentColor" stroke="none" />
      <path d="M18 14V10.5M18 10.5c-.4-1.8-1.8-3-3.6-3.4M18 10.5c.4-1.8 1.8-3 3.6-3.4" />
    </svg>
  );
}

function TurtleGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M15.6 19c-3.4-3-7-3.6-9.6-2.2 1.6 3.2 5 5 8.8 5.2M32.4 19c3.4-3 7-3.6 9.6-2.2-1.6 3.2-5 5-8.8 5.2" />
      <path d="M16.4 33.4c-2.4 1-4.4 3-5 5.4 2.6.2 5-.8 6.8-2.8M31.6 33.4c2.4 1 4.4 3 5 5.4-2.6.2-5-.8-6.8-2.8" />
      <circle cx="24" cy="10" r="3.4" fill="currentColor" fillOpacity="0.16" />
      <ellipse cx="24" cy="26" rx="10" ry="12" fill="currentColor" fillOpacity="0.16" />
      <path d="M24 20.5l5 3.2v5.6L24 32.5l-5-3.2v-5.6z" />
    </svg>
  );
}

function PufferGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="21" cy="25" r="11" fill="currentColor" fillOpacity="0.16" />
      <path d="M32 25l7-5.5v11z" fill="currentColor" fillOpacity="0.16" />
      <path d="M21 14v-3.6M28.8 17.2l2.5-2.5M13.2 17.2l-2.5-2.5M13.2 32.8l-2.5 2.5M21 36v3.6M28.8 32.8l2.5 2.5M16.5 15l-1.2-3.4M25.5 15l1.2-3.4M16.5 35l-1.2 3.4M25.5 35l1.2 3.4" />
      <circle cx="16" cy="22.5" r="1.7" fill="currentColor" stroke="none" />
      <path d="M10.5 27h2.6" />
    </svg>
  );
}

function MimicOctopusGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 23c-1 7-4 10.5-7.4 10.5-2 0-2.6-2.4-.8-3M19.5 25c0 6-1.4 10.6-4.6 13.4M28.5 25c0 6 1.4 10.6 4.6 13.4M34 23c1 7 4 10.5 7.4 10.5 2 0 2.6-2.4.8-3" />
        <path d="M24 24H11a13 14 0 0 1 3.8-9.9z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M24 24l-9.2-9.9A13 14 0 0 1 24 10z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 24V10a13 14 0 0 1 9.2 4.1z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M24 24l9.2-9.9A13 14 0 0 1 37 24z" fill="var(--organ-yellow)" fillOpacity="0.5" />
        <path d="M11 24c0 3 2 5 5 5h16c3 0 5-2 5-5" />
        <circle cx="19" cy="21" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="29" cy="21" r="1.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function HookGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="28" cy="10" r="3.6" fill="currentColor" fillOpacity="0.2" />
      <path d="M28 13.6V30a8 8 0 0 1-16 0v-8" />
      <path d="M12 22l4.4 4.6" />
    </svg>
  );
}

function LifeRingGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 9a15 15 0 1 1 0 30 15 15 0 0 1 0-30zM24 17a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"
        fill="currentColor"
        fillOpacity="0.16"
        fillRule="evenodd"
      />
      <path d="M19 19l-5.6-5.6M29 19l5.6-5.6M19 29l-5.6 5.6M29 29l5.6 5.6" />
    </svg>
  );
}

function SymbiosisGlyph({ className }: GlyphProps) {
  const half = (
    <>
      <path
        d="M30 14c-2.4-3.2-5.4-4.8-8.4-4.8-3.4 0-6 2.2-7.6 4.8 1.6 2.6 4.2 4.8 7.6 4.8 3 0 6-1.6 8.4-4.8z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M14 14l-5-4v8z" />
      <path d="M35 19c3 3.2 3 7.8 0 11M35 26v4h4" />
    </>
  );
  return (
    <svg {...CARD} className={className}>
      {half}
      <g transform="rotate(180 24 24)">{half}</g>
    </svg>
  );
}

function MigrationGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M27 16c7 1 11 6 11 16" strokeDasharray="3.5 4" />
      <path d="M33.5 30l4.5 5 4-5" />
      <path
        d="M25 16c-3-4-6.6-6-10.2-6C11 10 8 12.6 6.2 16 8 19.4 11 22 14.8 22c3.6 0 7.2-2 10.2-6z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M19 14.4h.01" />
    </svg>
  );
}

function CurrentGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M22 24a2 2 0 0 1 4 0 4 4 0 0 1-8 0 6 6 0 0 1 12 0 8 8 0 0 1-16 0 10 10 0 0 1 20 0c0 6 2.4 10.4 6.4 12.6"
      />
      <path d="M36.2 32.2l4.2 4.4-6 1.2" />
    </svg>
  );
}

function StormGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M14 27a6 6 0 0 1 0-12h.5a8 8 0 0 1 15-1 6.5 6.5 0 0 1 4.5 13z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M24 27l-3 4.5h5l-3 4.5" />
      <path d="M6 40c3 0 4-3.6 7.2-3.6s4.2 3.6 7.2 3.6 4-3.6 7.2-3.6 4.2 3.6 7.2 3.6 4-3.6 7.2-3.6" />
    </svg>
  );
}

function TsunamiGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M6 40C10 26 16 10 30 9c8-.6 12 5 10 10-1.6 4-7 4.4-9 1-1.4-2.6.6-5.2 3-4.8M31 20c-3 6 1 15 11 20z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M13 34c3-8 7.6-15 14-18" />
      <path d="M6 40h36" />
    </svg>
  );
}

/* Fondo: lo que se ve buceando entre el coral. */

function SeaweedGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M12 30c-2.6-3.4 2.6-6.6 0-10s2.6-6.6 0-10-.4-5 1.4-7" />
      <path {...LINE} d="M20 30c2.6-3.4-2.6-6.4 0-9.6s-2.6-6 0-9" />
      <path {...LINE} d="M12 20c-3-1-5-3-6-6M20 20.4c3-.8 5-2.8 6-5.6" />
    </svg>
  );
}

function ShellGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 26L5 13.5a11 11 0 0 1 22 0z" />
      <path {...LINE} d="M16 26V5M16 26L10 6.5M16 26l6-19.5M16 26L6.5 9.5M16 26l9.5-16.5" />
      <path {...LINE} d="M12.5 26h7l-1 3h-5z" />
    </svg>
  );
}

function StarfishGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M16 3.5l3.2 8.6 9.2.4-7.2 5.7 2.4 8.8L16 22l-7.6 5 2.4-8.8-7.2-5.7 9.2-.4z"
      />
      <path {...LINE} d="M16 16.5h.01M16 9.5h.01M22.5 14h.01M9.5 14h.01" />
    </svg>
  );
}

function CoralGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 29v-8l-6-6V9M10 15l-4-3.5V7M16 21l5.5-5.5V8M21.5 15.5l4.5-4V7M16 25l-4-3v-3" />
      <path {...LINE} d="M9 29h14" />
    </svg>
  );
}

function AnchorGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="5.5" r="2.5" />
      <path {...LINE} d="M16 8v20M11 12h10" />
      <path {...LINE} d="M6 19c0 5.4 4.4 9 10 9s10-3.6 10-9" />
      <path {...LINE} d="M3.5 21.5L6 19l2.8 2M28.5 21.5L26 19l-2.8 2" />
    </svg>
  );
}

function SeahorseGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M17 4c3.4 0 5.4 2.4 5 5.6-.4 2.8-2.4 4.2-2.4 7 0 3 3 4.2 3 7.4 0 3.6-3.2 5.2-5.6 4.2-2-.8-2-3.6 0-4.2"
      />
      <path {...LINE} d="M17 4c-2 0-3.6 1.4-4.2 3L7 8.6l5.8 1.8c.4 1.6 1.6 2.8 3 3.4-2 2.2-2.6 5.4-1 8" />
      <path {...LINE} d="M22.4 15.4l3 1.2-3 2" />
      <path {...LINE} d="M17 7.5h.01" />
    </svg>
  );
}

function JellyfishGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M7 15a9 9 0 0 1 18 0q-1.5 2-3 0q-1.5 2-3 0q-1.5 2-3 0q-1.5 2-3 0q-1.5 2-3 0q-1.5 2-3 0z" />
      <path {...LINE} d="M11 17.5c-1 3 1 5 0 8s1 3.6 0 5M16 17.5c-1 3 1 5 0 8M21 17.5c1 3-1 5 0 8s-1 3.6 0 5" />
    </svg>
  );
}

function FishGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4.5 16c2-4 5.5-6 9.5-6s7 2.5 9 6c-2 3.5-5 6-9 6s-7.5-2-9.5-6z" />
      <path {...LINE} d="M23 16l5-4.5v9z" />
      <path {...LINE} d="M14 12.4c1.2 2.2 1.2 5 0 7.2M9.5 14.5h.01" />
    </svg>
  );
}

function BuoyGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M10.5 25l2.5-11h6l2.5 11z" />
      <path {...LINE} d="M12 19.5h8M14 14v-4h4v4M16 10V5.5" />
      <path {...LINE} d="M3 26q3.25-2.5 6.5 0t6.5 0 6.5 0 6.5 0" />
    </svg>
  );
}

function BubblesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="12" cy="22" r="6" />
      <circle {...LINE} cx="21.5" cy="12.5" r="4" />
      <circle {...LINE} cx="14" cy="6" r="2" />
      <circle {...LINE} cx="24.5" cy="25" r="2.5" />
      <path {...LINE} d="M8.6 20.4a3.6 3.6 0 0 1 2.4-2.2" />
    </svg>
  );
}

function SwellGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M2 12q5-7 10 0t10 0 10 0 10 0 10 0 10 0" />
      <path {...LINE} d="M9 19q3.5-3.5 7 0t7 0M41 19q3.5-3.5 7 0t7 0" />
    </svg>
  );
}

export const arrecifeArt: PackArt = {
  organs: {
    red: CrabGlyph,
    blue: WhaleGlyph,
    green: TurtleGlyph,
    yellow: PufferGlyph,
    wild: MimicOctopusGlyph,
  },
  virus: HookGlyph,
  medicine: LifeRingGlyph,
  treatments: {
    swap: SymbiosisGlyph,
    steal: MigrationGlyph,
    spread: CurrentGlyph,
    quarantine: StormGlyph,
    malpractice: TsunamiGlyph,
  },
  backdrop: {
    items: [
      SeaweedGlyph,
      ShellGlyph,
      StarfishGlyph,
      CoralGlyph,
      AnchorGlyph,
      SeahorseGlyph,
      JellyfishGlyph,
      FishGlyph,
      BuoyGlyph,
      BubblesGlyph,
    ],
    band: SwellGlyph,
  },
};

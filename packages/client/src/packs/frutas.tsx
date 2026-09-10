import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Frutero: organos de fruta, plagas de huerto y conservas de despensa. */

function StrawberryGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24 41C15.5 36.5 10.5 28.5 10.5 21.5c0-4.4 3.4-7 7.4-7 2.6 0 4.4.8 6.1.8s3.5-.8 6.1-.8c4 0 7.4 2.6 7.4 7 0 7-5 15-13.5 19.5z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M15.5 16l4-5 2 3.2L24 10l2.5 4.2 2-3.2 4 5" />
      <path d="M24 10V6" />
      <path d="M18 22h.01M24 21.5h.01M30 22h.01M20.5 28.5h.01M27.5 28.5h.01M24 34.5h.01" />
    </svg>
  );
}

function BlueberryGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="34" cy="16" r="6.5" fill="currentColor" fillOpacity="0.14" />
      <circle cx="35" cy="33" r="5.5" fill="currentColor" fillOpacity="0.14" />
      <circle cx="20" cy="28" r="11.5" fill="currentColor" fillOpacity="0.18" />
      <path d="M20 22.5l1.2 2.9 3.1.2-2.4 2 .8 3-2.7-1.6-2.7 1.6.8-3-2.4-2 3.1-.2z" />
      <path d="M34 16h.01M35 33h.01" />
    </svg>
  );
}

function KiwiGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="24" cy="24" rx="16.5" ry="14.5" fill="currentColor" fillOpacity="0.16" />
      <ellipse cx="24" cy="24" rx="13" ry="11" />
      <ellipse cx="24" cy="24" rx="3.2" ry="2.6" />
      <path d="M30 24h2.5M28.9 27.5l2 1.6M25.9 29.7l.8 2M22.1 29.7l-.8 2M19.1 27.5l-2 1.6M18 24h-2.5M19.1 20.5l-2-1.6M22.1 18.3l-.8-2M25.9 18.3l.8-2M28.9 20.5l2-1.6" />
    </svg>
  );
}

function BananaGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M7.5 23.5c3 12.5 23.5 16.5 31-8L35.8 14.4C30.5 25.5 17 27.5 7.5 23.5z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M37 15l1.6-5.6h2.6" />
      <path d="M12 28.6c8.5 4.4 19 3 24-10.4" />
    </svg>
  );
}

function FruitBowlGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 22a6.5 6.5 0 0 1 13 0" fill="currentColor" fillOpacity="0.12" />
        <path d="M24.5 22a7 7 0 0 1 14 0" fill="currentColor" fillOpacity="0.12" />
        <path d="M23 15.5c.4-4 3-6.6 6.5-7-.4 3.6-3 6.2-6.5 7z" />
        <path d="M24 22 8 22A16 16 0 0 0 12.7 33.3z" fill="var(--organ-yellow)" fillOpacity="0.5" />
        <path d="M24 22 12.7 33.3A16 16 0 0 0 24 38z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M24 22 24 38A16 16 0 0 0 35.3 33.3z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 22 35.3 33.3A16 16 0 0 0 40 22z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M18.5 41.5h11" />
      </g>
    </svg>
  );
}

function WormGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g fill="currentColor" fillOpacity="0.16">
        <circle cx="11" cy="33" r="4.5" />
        <circle cx="18.5" cy="30.5" r="5" />
        <circle cx="26.5" cy="29" r="5.5" />
        <circle cx="33" cy="22" r="6.5" />
      </g>
      <circle cx="35" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <path d="M31 15.8l-1.6-4.8M36 16l2.4-4.4" />
    </svg>
  );
}

function JarGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M16 16v3c-2.4 1-4 3.3-4 6v10a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V25c0-2.7-1.6-5-4-6v-3"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <rect x="13" y="8.5" width="22" height="7.5" rx="2" fill="currentColor" fillOpacity="0.24" />
      <rect x="17" y="25" width="14" height="8" rx="1.5" />
    </svg>
  );
}

function BarterGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 17h19l-5-5M40 31H21l5 5" />
      <path
        d="M35 14c-1-1-5.5-1.5-5.5 3.5 0 3.5 2.5 6.5 4 6.5.6 0 1-.4 1.5-.4s.9.4 1.5.4c1.5 0 4-3 4-6.5 0-5-4.5-4.5-5.5-3.5z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M35 14c0-2 .8-3.2 2.2-4" />
      <path
        d="M12.5 24.5c-1.7 0-2.6 1.4-2.6 3 0 1.2-2.9 2.4-2.9 5.2a5.5 5.5 0 0 0 11 0c0-2.8-2.9-4-2.9-5.2 0-1.6-.9-3-2.6-3z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M12.5 24.5c0-1.6.6-2.8 1.8-3.6" />
    </svg>
  );
}

function GrabGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M24.5 30.5c-1.4-1.1-7-1.7-7 4.2 0 4.2 3 7.4 4.9 7.4.8 0 1.4-.6 2.1-.6s1.3.6 2.1.6c1.9 0 4.9-3.2 4.9-7.4 0-5.9-5.6-5.3-7-4.2z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path
        d="M17 6v7.5c-1 1-1.5 2.5-1.5 4.5v6.5a2.25 2.25 0 0 0 4.5 0V20v6a2.25 2.25 0 0 0 4.5 0v-6 6a2.25 2.25 0 0 0 4.5 0v-6 4.5a2.25 2.25 0 0 0 4.5 0V18l3.4 3.4a2.4 2.4 0 0 0 3.4-3.4l-4.6-5c-.8-.9-1.7-1.5-2.7-2V6"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path d="M17 9.5h14" />
    </svg>
  );
}

function RottenAppleGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M18 19c-2-1.6-10-2.4-10 6 0 6 4.2 12 7 12 1.2 0 2-.8 3-.8s1.8.8 3 .8c2.8 0 7-6 7-12 0-8.4-8-7.6-10-6z"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <path d="M18 19c0-3 1.5-5 3.5-6" />
      <circle cx="14.5" cy="26" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="20.5" cy="31" r="1.5" fill="currentColor" stroke="none" />
      <path d="M29 20l4-4M31 27h4M29 34l4 4" />
      <circle cx="37" cy="12" r="2.8" />
      <circle cx="39" cy="27" r="2.8" />
      <circle cx="37" cy="40" r="2.8" />
    </svg>
  );
}

function FrostGlyph({ className }: GlyphProps) {
  const arm = 'M24 20V7.5M19.5 9.5 24 14l4.5-4.5';
  return (
    <svg {...CARD} className={className}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path key={deg} d={arm} transform={`rotate(${deg} 24 24)`} />
      ))}
      <path d="M24 20l3.5 2v4L24 28l-3.5-2v-4z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function Stall({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M1.5 6v12M12.5 6v12" />
      <rect x="0" y="12" width="14" height="6" rx="1" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M0 0h14v3.5a2.33 2.33 0 0 1-4.67 0 2.33 2.33 0 0 1-4.66 0 2.33 2.33 0 0 1-4.67 0z"
        fill="currentColor"
        fillOpacity="0.22"
      />
    </g>
  );
}

function StallSwapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <Stall x={7} y={8} />
      <Stall x={27} y={22} />
      <path d="M24 11h6a4 4 0 0 1 4 4v2M31 14.5l3 3 3-3M24 37h-6a4 4 0 0 1-4-4v-2M17 33.5l-3-3-3 3" />
    </svg>
  );
}

/* Fondo: mercado y huerto dibujados a linea. */

function CherriesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="9.5" cy="23" r="4.5" />
      <circle {...LINE} cx="22" cy="24.5" r="4.5" />
      <path {...LINE} d="M9.5 18.5C10.5 12 13.5 8 18 5.5M22 20c-1-7-2.5-11-4-14.5" />
      <path {...LINE} d="M18 5.5c3-2.5 7-2.5 9-.5-2.5 2.5-6 2.5-9 .5z" />
    </svg>
  );
}

function PearGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M16 8c-2.5 0-3.5 2.5-3.5 5 0 2-4.5 4-4.5 8.5a8 8 0 0 0 16 0c0-4.5-4.5-6.5-4.5-8.5 0-2.5-1-5-3.5-5z"
      />
      <path {...LINE} d="M16 8c0-2 1-3.5 2.5-4.5" />
      <path {...LINE} d="M17.5 6c2-2 5-2 6.5-.5-2 2-4.5 2-6.5.5z" />
    </svg>
  );
}

function BasketGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 14h24l-3 13.5H7z" />
      <path {...LINE} d="M8 14c0-9 16-9 16 0" />
      <path {...LINE} d="M5.2 19h21.6M6.3 23.5h19.4M12 14l.8 13.5M20 14l-.8 13.5" />
    </svg>
  );
}

function LemonSliceGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 12h24a12 12 0 0 1-24 0z" />
      <path {...LINE} d="M6.8 12a9.2 9.2 0 0 0 18.4 0" />
      <path {...LINE} d="M16 12v9M16 12l6 6.4M16 12l-6 6.4" />
    </svg>
  );
}

function WateringCanGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 13h13v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" />
      <path {...LINE} d="M8 13c0-5.5 9-5.5 9 0" />
      <path {...LINE} d="M19 21.5 26.5 12" />
      <path {...LINE} d="M24.5 10l4.5 3.5" />
      <path {...LINE} d="M6 17c-3 0-3.5 6 0 6" />
    </svg>
  );
}

function CrateGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="3.5" y="10" width="25" height="17" rx="1" />
      <path {...LINE} d="M3.5 15.5h25M3.5 21h25M8 10v17M24 10v17" />
      <path {...LINE} d="M13.5 12.8h5" />
    </svg>
  );
}

function ScaleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 2.5V6" />
      <circle {...LINE} cx="16" cy="11" r="5" />
      <path {...LINE} d="M16 11l2.2-2.6" />
      <path {...LINE} d="M16 16 6 23.5M16 16l10 7.5" />
      <path {...LINE} d="M4.5 23.5h23c-1 3.6-5.8 5.2-11.5 5.2S5.5 27.1 4.5 23.5z" />
    </svg>
  );
}

function SproutGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 24h24" />
      <path {...LINE} d="M16 24v-9" />
      <path {...LINE} d="M16 17c-1-4-5-6.5-9.5-6 0 4 4 6.5 9.5 6zM16 15c1-4 5-6.5 9.5-6 0 4-4 6.5-9.5 6z" />
      <path {...LINE} d="M8 28.5c1-1 2.6-1 3.4 0-.8 1-2.4 1-3.4 0zM19.5 28c1-1 2.6-1 3.4 0-.8 1-2.4 1-3.4 0z" />
    </svg>
  );
}

function TreeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="12" r="9" />
      <path {...LINE} d="M16 21v8M16 25l3.5-3.5M9.5 29h13" />
      <circle {...LINE} cx="12" cy="10" r="1.4" />
      <circle {...LINE} cx="19.5" cy="8.5" r="1.4" />
      <circle {...LINE} cx="19" cy="15" r="1.4" />
      <circle {...LINE} cx="12.5" cy="16" r="1.4" />
    </svg>
  );
}

function LeafGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 26C6 14 14 6 26 6c0 12-8 20-20 20z" />
      <path {...LINE} d="M3.5 28.5 21 11" />
      <path {...LINE} d="M11 21v-5.5M11 21h5.5M16 16v-5M16 16h5" />
    </svg>
  );
}

function VineGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M0 13c7-7 14-7 21 0s14 7 21 0 14-7 22 0" />
      <path {...LINE} d="M10.5 7.8Q14.8 6.5 15 2Q10.7 3.3 10.5 7.8z" />
      <path {...LINE} d="M31.5 18.2Q27.6 19.1 27 23Q30.9 22.2 31.5 18.2zM31.5 18.2Q35.4 19.1 36 23Q32.1 22.2 31.5 18.2z" />
      <path {...LINE} d="M53 7.8Q57.3 6.5 57.5 2Q53.2 3.3 53 7.8z" />
      <path {...LINE} d="M21 13c-1.5 2.5-.5 5 2 5s2.5-3 .5-3M42 13c1.5-2.5.5-5-2-5s-2.5 3-.5 3" />
    </svg>
  );
}

export const frutasArt: PackArt = {
  organs: {
    red: StrawberryGlyph,
    blue: BlueberryGlyph,
    green: KiwiGlyph,
    yellow: BananaGlyph,
    wild: FruitBowlGlyph,
  },
  virus: WormGlyph,
  medicine: JarGlyph,
  treatments: {
    swap: BarterGlyph,
    steal: GrabGlyph,
    spread: RottenAppleGlyph,
    quarantine: FrostGlyph,
    malpractice: StallSwapGlyph,
  },
  backdrop: {
    items: [
      CherriesGlyph,
      PearGlyph,
      BasketGlyph,
      LemonSliceGlyph,
      WateringCanGlyph,
      CrateGlyph,
      ScaleGlyph,
      SproutGlyph,
      TreeGlyph,
      LeafGlyph,
    ],
    band: VineGlyph,
  },
};

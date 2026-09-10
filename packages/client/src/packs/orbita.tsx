import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Orbita: una estacion espacial que se averia y se repara. */

/** Estrella de `n` puntas como trazado, para las explosiones de la reaccion en cadena. */
function burst(cx: number, cy: number, outer: number, inner: number, n: number): string {
  const points: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${points.join('L')}z`;
}

function ReactorGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(-30 24 24)" />
      <ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(30 24 24)" />
      <circle cx="24" cy="24" r="5.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function LifeSupportGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="14" y="15" width="20" height="27" rx="10" fill="currentColor" fillOpacity="0.14" />
      <path d="M20.5 15v-4h7v4M17 7h14M24 7v4" />
      <path d="M14.4 27h19.2" />
    </svg>
  );
}

function GreenhouseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M8 36a16 16 0 0 1 32 0z" fill="currentColor" fillOpacity="0.14" />
      <path d="M6 36h36" />
      <path d="M24 36v-9M24 29c-4 0-6.5-2.2-6.5-5.5 4 0 6.5 2 6.5 5.5zM24 27c0-3.6 2.4-5.8 6.5-5.8 0 3.4-2.5 5.8-6.5 5.8z" />
      <path d="M13.5 29a11 11 0 0 1 4-7" />
    </svg>
  );
}

function SolarPanelGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M11 11h26l4 20H7z" fill="currentColor" fillOpacity="0.14" />
      <path d="M20 11l-1.4 20M28 11l1.4 20M9 21h30" />
      <path d="M24 31v7M17 40h14" />
    </svg>
  );
}

function PrototypeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 24V7l15 8.5V24z" fill="var(--organ-red)" fillOpacity="0.5" />
        <path d="M24 24h15v8.5L24 41z" fill="var(--organ-blue)" fillOpacity="0.5" />
        <path d="M24 24v17L9 32.5V24z" fill="var(--organ-green)" fillOpacity="0.5" />
        <path d="M24 24H9v-8.5L24 7z" fill="var(--organ-yellow)" fillOpacity="0.5" />
        <rect x="19.5" y="19.5" width="9" height="9" rx="2" fill="var(--paper)" />
      </g>
    </svg>
  );
}

function MeteorGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M29 19.5c4.4-.6 9.6 2.4 10.4 7.6.8 5.4-2.6 11-8.4 11.9-5.6.9-10.6-2.6-11.5-7.8-.9-5.4 4.2-11.1 9.5-11.7z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="31.5" cy="27.5" r="2.5" />
      <path d="M8 8l12 12M16 7l7.5 7.5M7 16l7.5 7.5" />
    </svg>
  );
}

function WrenchGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(45 24 24)">
        <path
          d="M21 6.6V13h6V6.6a8 8 0 0 1 0 14.8V38a3 3 0 0 1-6 0V21.4a8 8 0 0 1 0-14.8z"
          fill="currentColor"
          fillOpacity="0.18"
        />
      </g>
    </svg>
  );
}

function DockingGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="6" y="20" width="14" height="16" rx="3" fill="currentColor" fillOpacity="0.16" />
      <rect x="29" y="20" width="13" height="16" rx="3" fill="currentColor" fillOpacity="0.16" />
      <path d="M20 25h5v6h-5M29 24l-3-2v12l3-2" />
      <path d="M13 12h22M17 8l-4 4 4 4M31 8l4 4-4 4" />
    </svg>
  );
}

function RobotArmGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M7 41h12M13 41l3-24h18" />
      <circle cx="16" cy="17" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M34 17v4M34 21c-5.5 1.5-7 5.5-5 10.5M34 21c5.5 1.5 7 5.5 5 10.5" />
      <circle cx="34" cy="30" r="3.2" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function ChainReactionGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d={burst(14, 24, 8, 3.6, 6)} fill="currentColor" fillOpacity="0.2" />
      <path d="M21 19l6-5M21 29l6 5" />
      <path d={burst(33, 11, 5, 2.4, 5)} />
      <path d={burst(33, 37, 5, 2.4, 5)} />
    </svg>
  );
}

function PulseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M26.5 14L19 25.5h5.5L21.5 34 29 22.5h-5.5z" fill="currentColor" fillOpacity="0.2" />
      <path d="M14 15.5a13 13 0 0 0 0 17M34 15.5a13 13 0 0 1 0 17" />
      <path d="M9 10a20 20 0 0 0 0 28M39 10a20 20 0 0 1 0 28" />
    </svg>
  );
}

function OrbitSwapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="15" cy="24" r="7" />
      <circle cx="33" cy="24" r="7" />
      <circle cx="10" cy="29" r="3" fill="currentColor" fillOpacity="0.2" />
      <circle cx="38" cy="19" r="3" fill="currentColor" fillOpacity="0.2" />
      <path d="M17 10c4-3 10-3 14 0l-1-4M31 38c-4 3-10 3-14 0l1 4" />
    </svg>
  );
}

/* Fondo: el espacio alrededor de la estacion, dibujado a linea. */

function RingedPlanetGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-20 16 16)">
        <circle {...LINE} cx="16" cy="16" r="7" />
        <path {...LINE} d="M3 16a13 4 0 0 0 26 0M3 16a13 4 0 0 1 7-3.5M29 16a13 4 0 0 0-7-3.5" />
      </g>
    </svg>
  );
}

function StarsGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M14 6c.8 7 3 9.2 10 10-7 .8-9.2 3-10 10-.8-7-3-9.2-10-10 7-.8 9.2-3 10-10z" />
      <path {...LINE} d="M26 3v6M23 6h6" />
      <path {...LINE} d="M25 26h.01M6 5h.01" />
    </svg>
  );
}

function SatelliteGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-35 16 16)">
        <rect {...LINE} x="13" y="12" width="6" height="8" rx="1" />
        <rect {...LINE} x="2.5" y="13" width="8" height="6" />
        <rect {...LINE} x="21.5" y="13" width="8" height="6" />
        <path {...LINE} d="M10.5 16H13M19 16h2.5M6.5 13v6M25.5 13v6" />
        <path {...LINE} d="M16 12V9M13 7a3 2 0 0 0 6 0" />
      </g>
    </svg>
  );
}

function RocketGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3c4 3 6 8 6 14v6H10v-6c0-6 2-11 6-14z" />
      <circle {...LINE} cx="16" cy="12.5" r="2.5" />
      <path {...LINE} d="M10 17l-4 5v4l4-3M22 17l4 5v4l-4-3" />
      <path {...LINE} d="M13.5 26c0 2 1 3.5 2.5 5 1.5-1.5 2.5-3 2.5-5" />
    </svg>
  );
}

function HelmetGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M8.5 24.5a11 11 0 1 1 15 0" />
      <rect {...LINE} x="7.5" y="24.5" width="17" height="4.5" rx="1.5" />
      <rect {...LINE} x="9" y="10" width="14" height="10" rx="5" />
      <path {...LINE} d="M12 14c.5-1.2 1.5-1.8 2.8-2" />
    </svg>
  );
}

function MoonGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="16" r="12" />
      <circle {...LINE} cx="12" cy="12" r="3" />
      <circle {...LINE} cx="20.5" cy="19" r="2.5" />
      <circle {...LINE} cx="12.5" cy="21.5" r="1.5" />
      <path {...LINE} d="M21 9h.01" />
    </svg>
  );
}

function CometGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="23" cy="9" r="4.5" />
      <path {...LINE} d="M19.8 12.2L5 27M19 7.5L4 14M24.5 13.4L18 28" />
    </svg>
  );
}

function TelescopeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g transform="rotate(-25 16 13)">
        <rect {...LINE} x="7" y="10" width="15" height="6" rx="1" />
        <rect {...LINE} x="22" y="8.5" width="5" height="9" rx="1" />
        <path {...LINE} d="M7 11.5H4v3h3" />
      </g>
      <path {...LINE} d="M15 16.5L10 29M15 16.5L20 29M15 16.5V29" />
    </svg>
  );
}

function ConstellationGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M5 23l6-9 7 3 6-10M18 17l8 8" />
      <circle {...LINE} cx="5" cy="23" r="1.5" />
      <circle {...LINE} cx="11" cy="14" r="1.5" />
      <circle {...LINE} cx="18" cy="17" r="1.5" />
      <circle {...LINE} cx="24" cy="7" r="1.5" />
      <circle {...LINE} cx="26" cy="25" r="1.5" />
    </svg>
  );
}

function OrbitBandGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 19C16 6 48 6 63 19" />
      <circle {...LINE} cx="32" cy="9.3" r="2.2" />
      <path {...LINE} d="M10 3v4M8 5h4M53 2v4M51 4h4" />
      <path {...LINE} d="M22 19h.01M42 20h.01M4 8h.01M60 9h.01" />
    </svg>
  );
}

export const orbitaArt: PackArt = {
  organs: {
    red: ReactorGlyph,
    blue: LifeSupportGlyph,
    green: GreenhouseGlyph,
    yellow: SolarPanelGlyph,
    wild: PrototypeGlyph,
  },
  virus: MeteorGlyph,
  medicine: WrenchGlyph,
  treatments: {
    swap: DockingGlyph,
    steal: RobotArmGlyph,
    spread: ChainReactionGlyph,
    quarantine: PulseGlyph,
    malpractice: OrbitSwapGlyph,
  },
  backdrop: {
    items: [
      RingedPlanetGlyph,
      StarsGlyph,
      SatelliteGlyph,
      RocketGlyph,
      HelmetGlyph,
      MoonGlyph,
      CometGlyph,
      TelescopeGlyph,
      ConstellationGlyph,
      RingedPlanetGlyph,
    ],
    band: OrbitBandGlyph,
  },
};

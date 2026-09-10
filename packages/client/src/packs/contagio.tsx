import {
  BrainGlyph,
  ChimeraGlyph,
  HeartGlyph,
  LiverGlyph,
  LungGlyph,
  MalpracticeGlyph,
  MedicineGlyph,
  QuarantineGlyph,
  SpreadGlyph,
  StealGlyph,
  SwapGlyph,
  VirusGlyph,
} from '../art';
import { LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Fondo de Contagio: instrumental de hospital dibujado a linea. */

function CrossGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M12.5 3.5h7v9h9v7h-9v9h-7v-9h-9v-7h9z" />
    </svg>
  );
}

function CapsuleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="3.5" y="11" width="25" height="10" rx="5" />
      <path {...LINE} d="M16 11v10" />
      <path {...LINE} d="M7.5 14.5h3" />
    </svg>
  );
}

function SyringeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 26l4.5-4.5" />
      <path {...LINE} d="M9.5 22.5l-2-2 11-11 2 2z" />
      <path {...LINE} d="M18 13.5l-2.5-2.5" />
      <path {...LINE} d="M20.5 11l3.5-3.5-2.5-2.5" />
      <path {...LINE} d="M22.5 9.5l3 3" />
      <path {...LINE} d="M24 4l4 4" />
    </svg>
  );
}

function StethoscopeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M8 4v6a5.5 5.5 0 0 0 11 0V4" />
      <path {...LINE} d="M6 4h4M17 4h4" />
      <path {...LINE} d="M13.5 15.5v4a6.5 6.5 0 0 0 13 0v-2" />
      <circle {...LINE} cx="26.5" cy="13.5" r="3" />
    </svg>
  );
}

function FlaskGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M13 4h6v9.5l6.5 11a2.5 2.5 0 0 1-2.2 3.8H8.7a2.5 2.5 0 0 1-2.2-3.8L13 13.5z" />
      <path {...LINE} d="M9.8 20h12.4" />
    </svg>
  );
}

function BandageGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="2.5" y="10.5" width="27" height="11" rx="5.5" />
      <path {...LINE} d="M11.5 10.5v11M20.5 10.5v11" />
      <path {...LINE} d="M14.5 14.5h.01M17.5 14.5h.01M14.5 17.5h.01M17.5 17.5h.01" />
    </svg>
  );
}

function DropGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M16 3.5c5 6.4 8 10.6 8 14a8 8 0 0 1-16 0c0-3.4 3-7.6 8-14z" />
    </svg>
  );
}

function PillGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle {...LINE} cx="16" cy="16" r="11" />
      <path {...LINE} d="M8 12h16" />
    </svg>
  );
}

function ClipboardGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="6" y="5" width="20" height="23" rx="2.5" />
      <path {...LINE} d="M12 5V3.5h8V5" />
      <path {...LINE} d="M10.5 13h11M10.5 17.5h11M10.5 22h6" />
    </svg>
  );
}

function TraceGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 12h12l3-7 4 14 3-9 2 2h10l3-6 3 12 3-8 2 2h17" />
    </svg>
  );
}

export const contagioArt: PackArt = {
  organs: { red: HeartGlyph, blue: BrainGlyph, green: LungGlyph, yellow: LiverGlyph, wild: ChimeraGlyph },
  virus: VirusGlyph,
  medicine: MedicineGlyph,
  treatments: {
    swap: SwapGlyph,
    steal: StealGlyph,
    spread: SpreadGlyph,
    quarantine: QuarantineGlyph,
    malpractice: MalpracticeGlyph,
  },
  backdrop: {
    items: [
      CrossGlyph,
      StethoscopeGlyph,
      CapsuleGlyph,
      SyringeGlyph,
      FlaskGlyph,
      BandageGlyph,
      DropGlyph,
      PillGlyph,
      ClipboardGlyph,
      CrossGlyph,
    ],
    band: TraceGlyph,
  },
};

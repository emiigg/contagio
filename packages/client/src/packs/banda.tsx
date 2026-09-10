import { CARD, LINE } from './base';
import type { GlyphProps, PackArt } from './types';

/* Banda: la mesa es el camerino antes del concierto, el contagio es ruido. */

/* Se dibuja en vertical y se inclina: asi el cuerpo y el mastil caben en la diagonal. */
function GuitarGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(38 24 24)">
        <path
          d="M21 27C19.5 23.5 15 22 15 26.5c0 2.5 2 4 1 7C14.5 38 17.5 42 24 42s9.5-4 8-8.5c-1-3 1-4.5 1-7 0-4.5-4.5-3-6 .5z"
          fill="currentColor"
          fillOpacity="0.16"
        />
        <path d="M22.5 27V11.5h3V27" />
        <path d="M22.5 11.5l-.5-5h4l-.5 5" />
        <path d="M20.5 32.5h7M20.5 36.5h7" />
      </g>
    </svg>
  );
}

function DrumGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M10 22v14c0 2.8 6.3 5 14 5s14-2.2 14-5V22" fill="currentColor" fillOpacity="0.16" />
      <ellipse cx="24" cy="22" rx="14" ry="4.5" />
      <path d="M11 29l4.3 6.5 4.3-8 4.4 8.5 4.4-8.5 4.3 8 4.3-6.5" />
      <path d="M12 6l11 11M36 6L25 17" />
    </svg>
  );
}

/* Las teclas negras van de dos en dos, sin la del hueco central: es lo que dice "piano". */
function KeyboardGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <rect x="6" y="12" width="36" height="24" rx="2.5" fill="currentColor" fillOpacity="0.16" />
      <path d="M6 19h36" />
      <path d="M12 19v17M18 19v17M24 19v17M30 19v17M36 19v17" />
      <path
        d="M10.5 19h3v8h-3zM16.5 19h3v8h-3zM28.5 19h3v8h-3zM34.5 19h3v8h-3z"
        fill="currentColor"
      />
    </svg>
  );
}

function TrumpetGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M28 21.5c4.5-1 8.5-4.5 12-9v23c-3.5-4.5-7.5-8-12-9z" fill="currentColor" fillOpacity="0.16" />
      <path d="M6 21v6M6 24h22" />
      <path d="M13 24v4.5a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V26" />
      <path d="M15.5 24v-8M20 24v-8M24.5 24v-8M14 14h3M18.5 14h3M23 14h3" />
    </svg>
  );
}

/* Disco partido en cuatro, con el brazo del tocadiscos posado encima. */
function TurntableGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fillOpacity="0.5">
        <path d="M22 26V11A15 15 0 0 1 37 26z" fill="var(--organ-red)" />
        <path d="M22 26H37A15 15 0 0 1 22 41z" fill="var(--organ-blue)" />
        <path d="M22 26V41A15 15 0 0 1 7 26z" fill="var(--organ-green)" />
        <path d="M22 26H7A15 15 0 0 1 22 11z" fill="var(--organ-yellow)" />
        <circle cx="22" cy="26" r="4.5" />
        <circle cx="39" cy="9" r="2.5" />
        <path d="M39 11.5V22l-6 6" />
        <path d="M30 26.5l4.5 4.5" />
      </g>
    </svg>
  );
}

/* Corchea con el palo quebrado en rayo: una nota que ha salido mal. */
function NoiseGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse
        cx="18"
        cy="34"
        rx="7"
        ry="5"
        transform="rotate(-20 18 34)"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M24.5 32v-7l-5-4 8-4-5-4 2-6" />
      <path d="M24.5 7c1.5 5 11 5.5 10.5 14" />
    </svg>
  );
}

function TuningForkGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M16 7v12a8 8 0 0 0 6 7.7V39a2 2 0 0 0 4 0V26.7a8 8 0 0 0 6-7.7V7h-4v12a4 4 0 0 1-8 0V7z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <path d="M10.5 9c-2 3.5-2 8 0 11.5M37.5 9c2 3.5 2 8 0 11.5" />
    </svg>
  );
}

function JamGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <ellipse cx="11" cy="34" rx="5" ry="3.8" transform="rotate(-20 11 34)" fill="currentColor" fillOpacity="0.2" />
      <ellipse cx="33" cy="34" rx="5" ry="3.8" transform="rotate(-20 33 34)" fill="currentColor" fillOpacity="0.2" />
      <path d="M15.5 32.5V11M37.5 32.5V11" />
      <path d="M20 17h8M25.5 14.5L28 17l-2.5 2.5M28 26h-8M22.5 23.5L20 26l2.5 2.5" />
    </svg>
  );
}

function StarSigningGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path
        d="M29 6l2.8 7.1 7.7.5-5.9 4.9 1.9 7.4-6.5-4.1-6.5 4.1 1.9-7.4-5.9-4.9 7.7-.5z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <path d="M28 29.5C25 37 17.5 40.5 9 39" />
      <path d="M13 35l-4 4 4.5 3" />
    </svg>
  );
}

function EchoGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <circle cx="24" cy="24" r="5" fill="currentColor" fillOpacity="0.2" />
      <path d="M16.5 17a10 10 0 0 0 0 14M31.5 17a10 10 0 0 1 0 14" />
      <path d="M11 12a17 17 0 0 0 0 24M37 12a17 17 0 0 1 0 24" />
    </svg>
  );
}

/* Pulgar hacia arriba girado media vuelta: se dibuja en la postura facil de leer. */
function BooGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <g transform="rotate(180 24 24)">
        <rect x="7" y="21" width="7" height="19" rx="1.5" fill="currentColor" fillOpacity="0.2" />
        <path
          d="M14 23l6-10c1-2.5 2-6 5-6s3.5 3 3 6l-1.5 7H37c3 0 4.5 3 4 6l-2.5 11c-.5 2.5-2.5 3-4.5 3H14z"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <path d="M29 27.5h11.5M29 33.5h10.5" />
      </g>
    </svg>
  );
}

function StageSwapGlyph({ className }: GlyphProps) {
  return (
    <svg {...CARD} className={className}>
      <path d="M6 6h16v16H6zM26 26h16v16H26z" fill="currentColor" fillOpacity="0.16" />
      <path d="M6 7c0 6 2 10 5 12M22 7c0 6-2 10-5 12M26 27c0 6 2 10 5 12M42 27c0 6-2 10-5 12" />
      <path d="M28 10h2a5 5 0 0 1 5 5v5M32 17.5l3 3 3-3M20 38h-2a5 5 0 0 1-5-5v-5M16 30.5l-3-3-3 3" />
    </svg>
  );
}

function NotesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="9" cy="24" rx="3.5" ry="2.6" transform="rotate(-20 9 24)" />
      <ellipse {...LINE} cx="22" cy="21" rx="3.5" ry="2.6" transform="rotate(-20 22 21)" />
      <path {...LINE} d="M12.3 23V8.5L25.3 5.5V20" />
      <path {...LINE} d="M12.3 12.5l13-3" />
    </svg>
  );
}

function HeadphonesGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 19v-3a10 10 0 0 1 20 0v3" />
      <rect {...LINE} x="4" y="18" width="6" height="9" rx="2" />
      <rect {...LINE} x="22" y="18" width="6" height="9" rx="2" />
    </svg>
  );
}

function MicGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="12" y="3.5" width="8" height="14" rx="4" />
      <path {...LINE} d="M8.5 13.5a7.5 7.5 0 0 0 15 0" />
      <path {...LINE} d="M16 21v6M11 27.5h10" />
    </svg>
  );
}

function SpeakerGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="7" y="3.5" width="18" height="25" rx="2" />
      <circle {...LINE} cx="16" cy="19.5" r="5" />
      <circle {...LINE} cx="16" cy="9.5" r="2" />
    </svg>
  );
}

function MetronomeGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M12 4h8l5.5 24h-19z" />
      <path {...LINE} d="M9 21h14" />
      <path {...LINE} d="M16 21l5-13" />
      <path {...LINE} d="M17.5 12.5l2.5 1" />
    </svg>
  );
}

function MaracasGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse {...LINE} cx="10" cy="10" rx="4.5" ry="5.5" transform="rotate(-20 10 10)" />
      <ellipse {...LINE} cx="22" cy="10" rx="4.5" ry="5.5" transform="rotate(20 22 10)" />
      <path {...LINE} d="M12.5 15l5 13M19.5 15l-5 13" />
    </svg>
  );
}

function ClefGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        {...LINE}
        d="M13.5 27.5c1.5 1.5 4.5 1 4.5-1.5L16 5c0-2 2.5-2.5 3-.5.7 3-1 5.5-4.5 8.5-3.5 3-4.5 5.5-4 8 .6 3 4 4.5 7 3.5s4-4.5 2-6.5-6-1-6 2"
      />
    </svg>
  );
}

function TicketGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M4 9h24v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4z" />
      <path {...LINE} d="M21 10.5v2M21 15v2M21 19.5v2" />
      <path {...LINE} d="M8 13.5h8M8 18.5h5" />
    </svg>
  );
}

function CassetteGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect {...LINE} x="3" y="7" width="26" height="18" rx="2" />
      <circle {...LINE} cx="11" cy="14.5" r="2.5" />
      <circle {...LINE} cx="21" cy="14.5" r="2.5" />
      <path {...LINE} d="M8 25l2-4h12l2 4" />
    </svg>
  );
}

function DrumsticksGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path {...LINE} d="M6 27L23.5 6.5M26 27L8.5 6.5" />
      <circle {...LINE} cx="24.5" cy="5.3" r="1.5" />
      <circle {...LINE} cx="7.5" cy="5.3" r="1.5" />
    </svg>
  );
}

function StaffBandGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden>
      <path {...LINE} d="M1 8h62M1 12h62M1 16h62" />
      <ellipse {...LINE} cx="12" cy="16" rx="2.6" ry="2" transform="rotate(-20 12 16)" />
      <ellipse {...LINE} cx="28" cy="10" rx="2.6" ry="2" transform="rotate(-20 28 10)" />
      <ellipse {...LINE} cx="38" cy="14" rx="2.6" ry="2" transform="rotate(-20 38 14)" />
      <ellipse {...LINE} cx="52" cy="8" rx="2.6" ry="2" transform="rotate(-20 52 8)" />
      <path {...LINE} d="M14.5 15.3V5M30.5 9.3V3h10v10.3M54.5 7.3V1" />
    </svg>
  );
}

export const bandaArt: PackArt = {
  organs: {
    red: GuitarGlyph,
    blue: DrumGlyph,
    green: KeyboardGlyph,
    yellow: TrumpetGlyph,
    wild: TurntableGlyph,
  },
  virus: NoiseGlyph,
  medicine: TuningForkGlyph,
  treatments: {
    swap: JamGlyph,
    steal: StarSigningGlyph,
    spread: EchoGlyph,
    quarantine: BooGlyph,
    malpractice: StageSwapGlyph,
  },
  backdrop: {
    items: [
      NotesGlyph,
      HeadphonesGlyph,
      MicGlyph,
      SpeakerGlyph,
      MetronomeGlyph,
      MaracasGlyph,
      ClefGlyph,
      TicketGlyph,
      CassetteGlyph,
      DrumsticksGlyph,
    ],
    band: StaffBandGlyph,
  },
};

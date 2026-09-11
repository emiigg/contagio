import type { Localized, PackId } from '@contagio/engine';

/**
 * Musica de fondo, compuesta para este juego y escrita como partitura: cada
 * pieza son unos compases de acordes y melodia, con bajo, arpegio y percusion
 * en patrones que se repiten. No se descarga nada: se sintetiza en el
 * navegador, igual que los sonidos de la mesa, y por la misma razon que el
 * arte es propio no se cita ninguna melodia conocida.
 *
 * Aqui solo se dice como suena un paso. Cuando suena lo decide music.ts, y
 * tools/musica.mjs usa este mismo archivo para renderizar las piezas a WAV.
 *
 * Notacion:
 * - Melodia: un token por paso, en semitonos sobre la tonica (`7`, `-2`);
 *   `-` alarga la nota anterior y `.` es silencio. Las barras `|` solo separan
 *   pulsos para leerlo.
 * - Bajo y arpegio: un caracter por paso. `R` fundamental del acorde, `3` y `5`
 *   sus otras dos notas, `7` la cuarta si la hay, `O` la fundamental una
 *   octava arriba, `T` la tonica de la pieza.
 * - Percusion: `X` golpe fuerte, `x` suave, `.` nada.
 * Un patron puede ser una lista: el compas n usa el elemento n (en bucle).
 */

type Pattern = string | string[];
type Drum = 'kick' | 'snare' | 'hat' | 'tom' | 'timp';

interface Voice {
  wave: OscillatorType;
  /** Semitonos respecto a la tonica de la pieza. */
  shift: number;
  gain: number;
  attack: number;
  release: number;
  /** Corte del filtro paso bajo, en Hz. */
  cutoff: number;
  /** El filtro se abre en el ataque hasta cutoff * bite: el soplido de un metal. */
  bite?: number;
  /** Segundo oscilador desafinado, en cents: engorda metales y cuerdas. */
  detune?: number;
  /** Parcial agudo que se apaga enseguida (proporcion de frecuencia): marimba, campana. */
  partial?: number;
  /** Se apaga sola tras el ataque, sin sostener: cuerda pulsada, campana. */
  pluck?: boolean;
}

interface Piece {
  title: Localized;
  /**
   * Volumen propio: iguala piezas que suenan mas o menos llenas, para que
   * cambiar de paquete no obligue a tocar el volumen. Se mide con tools/musica.mjs.
   */
  level: number;
  bpm: number;
  /** Pasos por pulso: 4 semicorcheas en compas de cuatro, 3 corcheas en la jiga. */
  perBeat: number;
  /** Nota MIDI de la tonica, a la altura de la melodia. */
  root: number;
  /** Un acorde por compas, en semitonos sobre la tonica. */
  chords: number[][];
  /** Un compas por elemento. Marca la duracion del bucle. */
  lead: string[];
  bass?: Pattern;
  arp?: Pattern;
  drums?: Partial<Record<Drum, Pattern>>;
  voices: { lead: Voice; bass?: Voice; arp?: Voice; pad?: Voice };
}

// --- instrumentos ---------------------------------------------------------

const BRASS: Voice = { wave: 'sawtooth', shift: 0, gain: 0.07, attack: 0.035, release: 0.16, cutoff: 1100, bite: 2.8, detune: 8 };
const HORN: Voice = { wave: 'sawtooth', shift: 0, gain: 0.07, attack: 0.09, release: 0.45, cutoff: 700, bite: 1.8, detune: 5 };
const FIDDLE: Voice = { wave: 'sawtooth', shift: 0, gain: 0.05, attack: 0.02, release: 0.08, cutoff: 2400, detune: 6 };
const FLUTE: Voice = { wave: 'triangle', shift: 0, gain: 0.09, attack: 0.05, release: 0.14, cutoff: 3200 };
const SQUARE: Voice = { wave: 'square', shift: 0, gain: 0.035, attack: 0.005, release: 0.1, cutoff: 2200 };
const GUITAR: Voice = { wave: 'sawtooth', shift: 0, gain: 0.05, attack: 0.004, release: 0.12, cutoff: 1500, bite: 2.2, detune: 10 };
const MARIMBA: Voice = { wave: 'sine', shift: 0, gain: 0.13, attack: 0.003, release: 0.4, cutoff: 5000, partial: 4, pluck: true };
const BELL: Voice = { wave: 'sine', shift: 12, gain: 0.07, attack: 0.003, release: 1.6, cutoff: 6000, partial: 2.76, pluck: true };
const PLUCK: Voice = { wave: 'triangle', shift: 0, gain: 0.045, attack: 0.003, release: 0.3, cutoff: 3000, pluck: true };
const ZAP: Voice = { wave: 'square', shift: -12, gain: 0.022, attack: 0.003, release: 0.16, cutoff: 1400, bite: 2.5, pluck: true };
const STRINGS: Voice = { wave: 'sawtooth', shift: -12, gain: 0.016, attack: 0.45, release: 0.9, cutoff: 1300, detune: 12 };
const WARM: Voice = { wave: 'triangle', shift: -12, gain: 0.03, attack: 0.6, release: 1.2, cutoff: 1800, detune: 6 };
const DARK: Voice = { wave: 'sawtooth', shift: -12, gain: 0.014, attack: 0.9, release: 1.6, cutoff: 560, detune: 10 };
const BASS: Voice = { wave: 'sawtooth', shift: -24, gain: 0.075, attack: 0.008, release: 0.1, cutoff: 380, bite: 1.8 };
const SUB: Voice = { wave: 'triangle', shift: -24, gain: 0.12, attack: 0.01, release: 0.2, cutoff: 900 };

const bars = (count: number, main: string, last: string) => [...Array<string>(count - 1).fill(main), last];

// --- piezas ---------------------------------------------------------------

export const SCORES: Record<PackId, Piece> = {
  // La del hospital: un latido de dos golpes, campanas de monitor y un arpegio
  // tranquilo. Espera, no tension.
  contagio: {
    title: { es: 'Sala de espera', en: 'Waiting Room' },
    level: 0.86,
    bpm: 84,
    perBeat: 4,
    root: 57,
    chords: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]],
    lead: [
      '12 - - - | . . . . | 7 - - - | . . . .',
      '8 - - - | . . . . | 12 - - - | . . . .',
      '10 - - - | . . . . | 15 - - - | . . 14 .',
      '14 - - - | . . . . | 10 - - - | . . . .',
    ],
    arp: 'R.5.O.5.3.5.O.5.',
    bass: 'R-------R-------',
    drums: { kick: 'X..x............' },
    voices: { lead: BELL, arp: PLUCK, pad: WARM, bass: SUB },
  },

  // Marcha en mayor con metales, bajo al galope y timbales. La cadencia
  // I - bVI - bVII es la del cine de aventuras; la melodia es propia.
  heroes: {
    title: { es: 'Marcha heroica', en: 'Heroic March' },
    level: 1,
    bpm: 108,
    perBeat: 4,
    root: 60,
    chords: [[0, 4, 7], [-4, 0, 3], [-2, 2, 5], [0, 4, 7], [-7, -3, 0], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]],
    lead: [
      '7 . 7 9 | 11 - 12 - | - - - - | 7 . . .',
      '12 - 8 - | - - - . | 3 . 5 . | 7 - - -',
      '10 - - 5 | - . 7 . | 10 . 14 - | - - 12 -',
      '12 - - - | - - - - | 7 . 7 . | 12 . . .',
      '9 - - 12 | - - 17 - | - - 16 . | 12 - - -',
      '15 - - 12 | - - 8 - | - - 12 . | 15 - - -',
      '14 - - 10 | - - 17 - | - - 14 . | 17 - 19 -',
      '19 - - - | - - - - | 14 . 11 . | 7 . . .',
    ],
    bass: 'R.RRR.RRR.RRR.RR',
    drums: {
      timp: 'X.......X.x.....',
      snare: bars(8, '....X.......X...', '....X...x.xxXXXX'),
    },
    voices: { lead: BRASS, pad: STRINGS, bass: BASS },
  },

  // Himno en menor: mas grave que la de DC, con un ostinato de cuerda que no
  // para y un redoble de toms antes de volver a empezar.
  marvel: {
    title: { es: 'Llamada a filas', en: 'Call to Arms' },
    level: 1.08,
    bpm: 100,
    perBeat: 4,
    root: 62,
    chords: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2], [0, 3, 7], [-4, 0, 3], [-7, -4, 0], [-5, -1, 2]],
    lead: [
      '0 - - 7 | - - - - | 5 - 3 - | 7 - - -',
      '8 - - 7 | - - 5 - | 3 - - - | - - - .',
      '2 - 3 - | 5 - - 7 | - - 9 - | 10 - - -',
      '14 - - - | - - 11 - | 7 - - - | - - - .',
      '12 - - 14 | 15 - - - | 14 . 12 . | 10 - - -',
      '8 - - 12 | 15 - - - | 17 . 15 . | 12 - - -',
      '17 - - - | 15 . 14 . | 12 - - 10 | - - 8 -',
      '7 - - - | - - - - | 11 . 14 . | 19 - - -',
    ],
    arp: 'R53OR53OR53OR53O',
    bass: 'R.R.R.R.R.R.R.R.',
    drums: {
      kick: 'X.....X.X.......',
      snare: '....X.......X...',
      hat: '..x...x...x...x.',
      tom: bars(8, '................', '........X.X.XXXX'),
    },
    voices: { lead: BRASS, arp: { ...PLUCK, shift: -12, gain: 0.035 }, pad: DARK, bass: BASS },
  },

  frutas: {
    title: { es: 'Puesto del mercado', en: 'Market Stall' },
    level: 1.3,
    bpm: 124,
    perBeat: 4,
    root: 65,
    chords: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]],
    lead: [
      '0 . 4 . | 7 . 4 . | 9 . 7 . | 4 . . .',
      '5 . 9 . | 12 . 9 . | 14 . 12 . | 9 . . .',
      '7 . 11 . | 14 . 11 . | 16 . 14 . | 11 . 7 .',
      '12 . . 9 | . . 7 . | 4 . 2 . | 0 . . .',
    ],
    bass: 'R...5...R...5...',
    drums: { kick: 'X.......X.......', snare: '....x.......x...', hat: '..x...x...x...x.' },
    voices: { lead: MARIMBA, bass: SUB },
  },

  cortafuegos: {
    title: { es: 'Sala de servidores', en: 'Server Room' },
    level: 1.8,
    bpm: 118,
    perBeat: 4,
    root: 64,
    chords: [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -2, 2]],
    lead: [
      '12 . . . | . . 15 . | . . 14 . | . . . .',
      '12 . . . | . . 10 . | . . 7 . | . . . .',
      '14 . . . | . . 17 . | . . 14 . | . . 12 .',
      '10 . . . | . . . . | 7 . . . | . . . .',
    ],
    arp: 'R35OR35OR35OR35O',
    bass: 'R.R.R.R.R.R.R.R.',
    drums: { kick: 'x...x...x...x...', hat: 'x.x.x.x.x.x.x.x.' },
    voices: { lead: SQUARE, arp: ZAP, bass: BASS },
  },

  // Lidia: la cuarta subida suena a ingravidez. Casi sin ritmo.
  orbita: {
    title: { es: 'Orbita baja', en: 'Low Orbit' },
    level: 1,
    bpm: 70,
    perBeat: 4,
    root: 62,
    chords: [[0, 4, 7], [2, 6, 9], [-3, 2, 5], [5, 9, 12]],
    lead: [
      '16 - - - | - - - - | 14 - - - | - - - -',
      '18 - - - | - - - - | 14 - - - | - - - -',
      '14 - - - | - - - - | 9 - - - | - - - -',
      '12 - - - | - - - - | 11 - - - | - - - -',
    ],
    arp: 'R..5..O..3..5...',
    bass: 'R---------------',
    drums: { kick: 'x...............' },
    voices: { lead: { ...BELL, shift: 0 }, arp: PLUCK, pad: DARK, bass: SUB },
  },

  // Dorico sobre un bordon, con flauta y tambor de mano.
  asedio: {
    title: { es: 'Guardia en la muralla', en: 'Watch on the Walls' },
    level: 0.75,
    bpm: 96,
    perBeat: 4,
    root: 62,
    chords: [[0, 3, 7], [-2, 2, 5], [0, 3, 7], [-5, -2, 2]],
    lead: [
      '0 . 2 3 | 5 - 7 - | 9 - 7 5 | 7 - - -',
      '10 - 9 7 | 5 - 3 2 | 3 - 5 - | 2 - - -',
      '0 . 2 3 | 5 - 7 - | 9 - 10 12 | 14 - 12 -',
      '10 - 9 7 | 9 - 5 - | 7 - 2 3 | 0 - - -',
    ],
    bass: 'T-------T-------',
    drums: { tom: 'X..X..X.X...X...', hat: '....x.......x...' },
    voices: { lead: FLUTE, pad: WARM, bass: SUB },
  },

  // Frigio: el semitono sobre la tonica es lo que suena a secreto.
  grimorio: {
    title: { es: 'Tomo prohibido', en: 'Forbidden Tome' },
    level: 0.85,
    bpm: 76,
    perBeat: 4,
    root: 64,
    chords: [[0, 3, 7], [1, 5, 8], [0, 3, 7], [-2, 1, 5]],
    lead: [
      '7 - - 8 | 7 - - - | 3 - - 5 | 3 - 1 -',
      '1 - - - | - - - - | 5 - 3 - | 1 - - -',
      '7 - - 8 | 10 - - - | 12 - 10 8 | 7 - - -',
      '5 - 3 1 | - - - - | 0 - - - | - - - -',
    ],
    arp: 'R...5...O...5...',
    bass: 'T---------------',
    drums: { timp: 'X...............', tom: '........x.......' },
    voices: { lead: { ...FLUTE, gain: 0.06 }, arp: BELL, pad: DARK, bass: SUB },
  },

  arrecife: {
    title: { es: 'Bajo la marea', en: 'Beneath the Tide' },
    level: 0.88,
    bpm: 76,
    perBeat: 4,
    root: 67,
    chords: [[0, 4, 7, 11], [-3, 0, 4, 7], [-7, -3, 0, 4], [-5, -1, 2]],
    lead: [
      '14 - - - | - - 11 - | - - - - | - - - -',
      '12 - - - | - - 7 - | - - - - | - - - -',
      '16 - - - | - - 12 - | - - 14 - | - - - -',
      '18 - - - | - - 14 - | - - - - | - - - -',
    ],
    arp: 'R.3.5.7.O.7.5.3.',
    bass: 'R-------R-------',
    drums: { hat: '..x...x...x...x.' },
    voices: { lead: { ...BELL, shift: 0 }, arp: { ...PLUCK, release: 0.7, gain: 0.035 }, pad: WARM, bass: SUB },
  },

  jurasico: {
    title: { es: 'Valle perdido', en: 'Lost Valley' },
    level: 1.1,
    bpm: 88,
    perBeat: 4,
    root: 60,
    chords: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]],
    lead: [
      '0 - - - | 7 - - - | 12 - - - | - - - -',
      '8 - - - | 7 - - - | 3 - - - | - - - -',
      '3 - - 5 | 7 - - - | 10 - - 12 | 15 - - -',
      '14 - - - | 12 - - 10 | - - - - | - - - -',
    ],
    bass: 'R..R..R.R.......',
    drums: { tom: 'X..X..X...X.X...', kick: 'X.......X.......' },
    voices: { lead: HORN, pad: STRINGS, bass: BASS },
  },

  banda: {
    title: { es: 'Ultimo ensayo', en: 'Final Rehearsal' },
    level: 1.35,
    bpm: 120,
    perBeat: 4,
    root: 57,
    chords: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]],
    lead: [
      '12 . 12 . | 15 . 12 . | 17 - 15 . | 12 . . .',
      '17 . 17 . | 21 . 17 . | 19 - 17 . | 14 . . .',
      '19 . 19 . | 23 . 19 . | 21 - 19 . | 16 . . .',
      '17 . 14 . | 12 - - - | 10 . 9 . | 7 . . .',
    ],
    bass: 'R.R.R.R.R.R.5.O.',
    drums: { kick: 'X.....X.X.....x.', snare: '....X.......X...', hat: 'x.x.x.x.x.x.x.x.' },
    voices: { lead: GUITAR, bass: BASS },
  },

  // Jiga en 12/8: cuatro pulsos de tres corcheas, bajo de "um-pa" y violin.
  piratas: {
    title: { es: 'Taberna del puerto', en: 'Harbor Tavern' },
    level: 1.3,
    bpm: 104,
    perBeat: 3,
    root: 62,
    chords: [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]],
    lead: [
      '0 2 3 | 5 3 2 | 0 - 7 | 5 3 2',
      '-2 0 2 | 5 2 0 | -2 - 2 | 5 3 2',
      '-4 -2 0 | 3 0 -2 | -4 - 3 | 7 5 3',
      '2 3 2 | -1 2 -1 | -5 - - | . . .',
    ],
    bass: 'R..5..R..5..',
    drums: { tom: 'X..x..X..x..', hat: '.x..x..x..x.' },
    voices: { lead: FIDDLE, bass: SUB },
  },
};

// --- partitura compilada --------------------------------------------------

interface Note {
  pitch: number;
  steps: number;
}

type Row = (Note | null)[];

export interface Compiled {
  piece: Piece;
  stepsPerBar: number;
  stepSec: number;
  bars: number;
  lead: Row[];
  bass: Row[];
  arp: Row[];
  drums: [Drum, number[][]][];
}

const cells = (bar: string) => bar.split(/[\s|]+/).filter(Boolean);
const list = (p: Pattern | undefined) => (p === undefined ? [] : Array.isArray(p) ? p : [p]);

/** Una fila de notas: cada nota sabe cuantos pasos dura contando sus guiones. */
function row(tokens: string[], pitchOf: (token: string) => number | null): Row {
  return tokens.map((token, i) => {
    const pitch = pitchOf(token);
    if (pitch === null) return null;
    let steps = 1;
    while (tokens[i + steps] === '-') steps++;
    return { pitch, steps };
  });
}

function chordTone(chord: number[], symbol: string): number | null {
  const root = chord[0] ?? 0;
  switch (symbol) {
    case 'R':
      return root;
    case '3':
      return chord[1] ?? root;
    case '5':
      return chord[2] ?? root;
    case '7':
      return chord[3] ?? root + 12;
    case 'O':
      return root + 12;
    case 'T':
      return 0;
    default:
      return null;
  }
}

const compiled = new Map<PackId, Compiled>();

export function compile(id: PackId): Compiled {
  const hit = compiled.get(id);
  if (hit) return hit;
  const piece = SCORES[id];
  const stepsPerBar = piece.perBeat * 4;
  const count = piece.lead.length;
  const chordAt = (bar: number) => piece.chords[bar % piece.chords.length] ?? [0];
  const patternRows = (p: Pattern | undefined) => {
    const all = list(p);
    if (all.length === 0) return [];
    return Array.from({ length: count }, (_, bar) =>
      row(cells((all[bar % all.length] ?? '').split('').join(' ')), (t) => chordTone(chordAt(bar), t)),
    );
  };
  const result: Compiled = {
    piece,
    stepsPerBar,
    stepSec: 60 / piece.bpm / piece.perBeat,
    bars: count,
    lead: piece.lead.map((bar) => row(cells(bar), (t) => (/^-?\d+$/.test(t) ? Number(t) : null))),
    bass: patternRows(piece.bass),
    arp: patternRows(piece.arp),
    drums: (Object.entries(piece.drums ?? {}) as [Drum, Pattern][]).map(([drum, p]) => [
      drum,
      list(p).map((bar) => [...bar.replace(/[\s|]/g, '')].map((c) => (c === 'X' ? 1 : c === 'x' ? 0.55 : 0))),
    ]),
  };
  compiled.set(id, result);
  return result;
}

/** Cuanto dura una vuelta completa de la pieza, en segundos. */
export function loopSeconds(id: PackId): number {
  const c = compile(id);
  return c.bars * c.stepsPerBar * c.stepSec;
}

// --- sintesis -------------------------------------------------------------

const mtof = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

const noises = new WeakMap<BaseAudioContext, AudioBuffer>();

function noiseOf(ac: BaseAudioContext): AudioBuffer {
  let buffer = noises.get(ac);
  if (!buffer) {
    buffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noises.set(ac, buffer);
  }
  return buffer;
}

function voice(ac: BaseAudioContext, dest: AudioNode, v: Voice, midi: number, at: number, dur: number): void {
  const freq = mtof(midi + v.shift);
  const peak = v.gain;
  const hold = at + Math.max(dur, v.attack + 0.02);
  const end = v.pluck ? at + v.attack + v.release : hold + v.release;

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = v.bite ? 1.4 : 0.7;
  filter.frequency.setValueAtTime(v.cutoff, at);
  if (v.bite) {
    const open = at + Math.max(v.attack, 0.02);
    filter.frequency.exponentialRampToValueAtTime(Math.min(v.cutoff * v.bite, 16000), open);
    filter.frequency.exponentialRampToValueAtTime(v.cutoff, open + 0.3);
  }

  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(peak, at + v.attack);
  if (!v.pluck) amp.gain.setValueAtTime(peak, hold);
  amp.gain.exponentialRampToValueAtTime(0.0001, end);
  filter.connect(amp).connect(dest);

  for (const cents of v.detune ? [-v.detune, v.detune] : [0]) {
    const osc = ac.createOscillator();
    osc.type = v.wave;
    osc.frequency.setValueAtTime(freq, at);
    osc.detune.setValueAtTime(cents, at);
    osc.connect(filter);
    osc.start(at);
    osc.stop(end + 0.02);
  }

  if (v.partial) {
    const osc = ac.createOscillator();
    const tick = ac.createGain();
    osc.frequency.setValueAtTime(freq * v.partial, at);
    tick.gain.setValueAtTime(0.0001, at);
    tick.gain.exponentialRampToValueAtTime(peak * 0.35, at + 0.003);
    tick.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
    osc.connect(tick).connect(dest);
    osc.start(at);
    osc.stop(at + 0.14);
  }
}

function thump(ac: BaseAudioContext, dest: AudioNode, at: number, from: number, to: number, dur: number, gain: number, wave: OscillatorType = 'sine'): void {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + dur * 0.6);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(dest);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function rustle(ac: BaseAudioContext, dest: AudioNode, at: number, type: BiquadFilterType, freq: number, dur: number, gain: number): void {
  const src = ac.createBufferSource();
  src.buffer = noiseOf(ac);
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = 0.8;
  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.003);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(amp).connect(dest);
  src.start(at, Math.random() * 0.5);
  src.stop(at + dur + 0.02);
}

const DRUMS: Record<Drum, (ac: BaseAudioContext, dest: AudioNode, at: number, level: number) => void> = {
  kick: (ac, dest, at, level) => thump(ac, dest, at, 120, 42, 0.32, 0.32 * level),
  snare: (ac, dest, at, level) => {
    rustle(ac, dest, at, 'bandpass', 1900, 0.15, 0.1 * level);
    thump(ac, dest, at, 200, 150, 0.08, 0.06 * level, 'triangle');
  },
  hat: (ac, dest, at, level) => rustle(ac, dest, at, 'highpass', 7200, 0.045, 0.035 * level),
  tom: (ac, dest, at, level) => {
    thump(ac, dest, at, 160, 88, 0.36, 0.2 * level);
    rustle(ac, dest, at, 'lowpass', 700, 0.05, 0.03 * level);
  },
  timp: (ac, dest, at, level) => {
    thump(ac, dest, at, 100, 76, 0.95, 0.26 * level);
    thump(ac, dest, at, 150, 114, 0.6, 0.06 * level, 'triangle');
  },
};

/**
 * Salida de una pieza: su propio volumen (para fundirla con la siguiente) y un
 * compresor suave que evita que un compas cargado sature.
 */
export function trackOutput(ac: BaseAudioContext, dest: AudioNode, id: PackId): GainNode {
  const gain = ac.createGain();
  const level = ac.createGain();
  level.gain.value = SCORES[id].level;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  comp.attack.value = 0.01;
  comp.release.value = 0.25;
  gain.connect(level).connect(comp).connect(dest);
  return gain;
}

/** Programa todo lo que suena en el paso `index` (contado desde el principio) en el instante `at`. */
export function scheduleStep(ac: BaseAudioContext, dest: AudioNode, c: Compiled, index: number, at: number): void {
  const { piece, stepsPerBar, stepSec } = c;
  const bar = Math.floor(index / stepsPerBar) % c.bars;
  const step = index % stepsPerBar;
  const { voices, root } = piece;
  const chord = piece.chords[bar % piece.chords.length] ?? [0];

  if (step === 0 && voices.pad) {
    for (const n of chord.slice(0, 3)) voice(ac, dest, voices.pad, root + n, at, stepsPerBar * stepSec);
  }
  const play = (rows: Row[], v: Voice | undefined) => {
    const note = rows[bar]?.[step];
    if (note && v) voice(ac, dest, v, root + note.pitch, at, note.steps * stepSec * 0.92);
  };
  play(c.lead, voices.lead);
  play(c.bass, voices.bass);
  play(c.arp, voices.arp);
  for (const [drum, rows] of c.drums) {
    const level = rows[bar % rows.length]?.[step] ?? 0;
    if (level > 0) DRUMS[drum](ac, dest, at, level);
  }
}

import { useSyncExternalStore } from 'react';

/**
 * Sonidos de la mesa, sintetizados en el navegador con Web Audio. No hay
 * archivos que descargar ni licencias que respetar: cada sonido es tan propio
 * como el resto del arte, y pesa lo que pesa este archivo.
 */
export type SoundName =
  | 'shuffle'
  | 'deal'
  | 'turn'
  | 'organ'
  | 'virus'
  | 'medicine'
  | 'treatment'
  | 'discard'
  | 'tick'
  | 'win'
  | 'lose';

const KEY = 'contagio.sound';

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

let enabled = typeof localStorage === 'undefined' ? true : read();
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let out: GainNode | null = null;
let noise: AudioBuffer | null = null;

function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    out = ctx.createGain();
    out.gain.value = 0.5;
    out.connect(ctx.destination);
  }
  return ctx;
}

// El navegador no deja sonar nada antes del primer gesto. Se aprovecha el que
// haya -el clic en "Crear sala" o en "Entrar"- para despertar el audio, y se
// sigue escuchando porque algunos moviles lo vuelven a dormir.
function unlock(): void {
  if (!enabled) return;
  const ac = context();
  if (ac && ac.state === 'suspended') void ac.resume();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock);
}

function noiseBuffer(ac: AudioContext): AudioBuffer {
  if (noise) return noise;
  const buffer = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise = buffer;
  return buffer;
}

interface ToneOptions {
  type?: OscillatorType;
  gain?: number;
  /** Frecuencia a la que resbala el tono mientras suena. */
  glide?: number;
  attack?: number;
}

/** Un tono con ataque corto y caida exponencial: campanas, golpes, chispas. */
function tone(ac: AudioContext, at: number, freq: number, dur: number, opts: ToneOptions = {}): void {
  const { type = 'sine', gain = 0.2, glide, attack = 0.005 } = opts;
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, at);
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, at + dur);
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(amp).connect(out!);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

interface HissOptions {
  gain?: number;
  type?: BiquadFilterType;
  freq?: number;
  q?: number;
  /** Frecuencia a la que barre el filtro: convierte el ruido en un soplido. */
  sweep?: number;
}

/** Ruido filtrado: el roce del carton, el golpe de la carta, un soplido. */
function hiss(ac: AudioContext, at: number, dur: number, opts: HissOptions = {}): void {
  const { gain = 0.2, type = 'bandpass', freq = 3000, q = 1, sweep } = opts;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer(ac);
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(freq, at);
  if (sweep) filter.frequency.exponentialRampToValueAtTime(sweep, at + dur);
  filter.Q.value = q;
  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(amp).connect(out!);
  // Cada roce empieza en un punto distinto del ruido: dos cartas no suenan igual.
  src.start(at, Math.random() * 0.4);
  src.stop(at + dur + 0.02);
}

/** Una carta que cae sobre la mesa: chasquido de carton y un golpe sordo. */
function slap(ac: AudioContext, at: number, gain = 0.24): void {
  hiss(ac, at, 0.07, { gain, type: 'lowpass', freq: 1800 });
  tone(ac, at, 150, 0.09, { gain: gain * 0.8, glide: 70 });
}

/** Campana de dos parciales: la nota y un armonico inarmonico muy bajo. */
function bell(ac: AudioContext, at: number, freq: number, dur: number, gain: number): void {
  tone(ac, at, freq, dur, { gain, attack: 0.004 });
  tone(ac, at, freq * 2.76, dur * 0.45, { gain: gain * 0.18, attack: 0.002 });
}

const SOUNDS: Record<SoundName, (ac: AudioContext, t: number) => void> = {
  // Un riffle: las cartas caen unas sobre otras cada vez mas juntas, y al final
  // un golpe seco al cuadrar el mazo.
  shuffle: (ac, t) => {
    let at = t;
    for (let i = 0; i < 16; i++) {
      hiss(ac, at, 0.035, { gain: 0.08 + Math.random() * 0.05, freq: 2800 + Math.random() * 1400, q: 0.8 });
      at += 0.075 - i * 0.0028 + Math.random() * 0.01;
    }
    slap(ac, at + 0.1, 0.2);
  },
  deal: (ac, t) => hiss(ac, t, 0.05, { gain: 0.13, type: 'highpass', freq: 2600 }),
  // Tu turno: dos campanadas que suben, como un aviso de consulta.
  turn: (ac, t) => {
    bell(ac, t, 659.25, 1, 0.15);
    bell(ac, t + 0.14, 987.77, 1.1, 0.13);
  },
  organ: (ac, t) => {
    slap(ac, t);
    tone(ac, t + 0.02, 330, 0.16, { type: 'triangle', gain: 0.1, glide: 440 });
  },
  // Dos tonos casi iguales baten entre si y caen: suena a algo que no va bien.
  virus: (ac, t) => {
    slap(ac, t);
    tone(ac, t + 0.02, 196, 0.42, { type: 'triangle', gain: 0.09, glide: 150 });
    tone(ac, t + 0.02, 185, 0.42, { type: 'triangle', gain: 0.09, glide: 138 });
  },
  medicine: (ac, t) => {
    slap(ac, t, 0.16);
    [783.99, 987.77, 1318.51].forEach((f, i) => tone(ac, t + 0.03 + i * 0.06, f, 0.35, { gain: 0.07 }));
  },
  treatment: (ac, t) => {
    hiss(ac, t, 0.42, { gain: 0.13, freq: 500, sweep: 3000, q: 1.5 });
    slap(ac, t + 0.36, 0.2);
  },
  discard: (ac, t) => {
    hiss(ac, t, 0.06, { gain: 0.1, type: 'highpass', freq: 2000 });
    hiss(ac, t + 0.07, 0.06, { gain: 0.08, type: 'highpass', freq: 2200 });
  },
  tick: (ac, t) => tone(ac, t, 1600, 0.04, { gain: 0.07, attack: 0.002 }),
  win: (ac, t) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(ac, t + i * 0.11, f, i === 3 ? 0.9 : 0.45, { type: 'triangle', gain: 0.11 }),
    );
  },
  lose: (ac, t) => {
    [392, 311.13, 261.63].forEach((f, i) =>
      tone(ac, t + i * 0.18, f, i === 2 ? 0.9 : 0.55, { type: 'triangle', gain: 0.1, glide: i === 2 ? 240 : undefined }),
    );
  },
};

export function play(name: SoundName): void {
  if (!enabled) return;
  const ac = context();
  if (!ac || !out) return;
  // Con el audio aun dormido no se encola nada: sonaria todo de golpe y a
  // destiempo en cuanto alguien tocara la pantalla.
  if (ac.state !== 'running') {
    void ac.resume();
    return;
  }
  SOUNDS[name](ac, ac.currentTime + 0.01);
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off');
  } catch {
    /* modo privado: la preferencia dura lo que la pestana */
  }
  if (next) {
    unlock();
    // Un roce de carta confirma que ya suena; el clic mismo acaba de despertar el audio.
    setTimeout(() => play('deal'), 60);
  }
  for (const fn of listeners) fn();
}

export function useSound() {
  const on = useSyncExternalStore(subscribe, () => enabled, () => true);
  return { enabled: on, toggle: () => setSoundEnabled(!enabled) };
}

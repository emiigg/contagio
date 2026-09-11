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
  | 'nudge'
  | 'organ'
  | 'virus'
  | 'medicine'
  | 'treatment'
  | 'discard'
  | 'tick'
  | 'win'
  | 'lose';

/** Volumenes de 0 a 1. Silenciar no los pisa: al volver, suenan como estaban. */
export interface SoundSettings {
  muted: boolean;
  music: number;
  effects: number;
}

const KEY = 'contagio.sound';
const DEFAULTS: SoundSettings = { muted: false, music: 0.5, effects: 0.8 };

/** Techo de la musica respecto a los efectos: va de fondo, no tapa la mesa. */
const MUSIC_TRIM = 0.9;

const clamp01 = (n: unknown, fallback: number) =>
  typeof n === 'number' && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;

function read(): SoundSettings {
  try {
    const raw = localStorage.getItem(KEY);
    // Antes solo habia encendido o apagado, guardado tal cual en esta clave.
    if (raw === null || raw === 'on') return DEFAULTS;
    if (raw === 'off') return { ...DEFAULTS, muted: true };
    const saved = JSON.parse(raw) as Partial<SoundSettings>;
    return {
      muted: saved.muted === true,
      music: clamp01(saved.music, DEFAULTS.music),
      effects: clamp01(saved.effects, DEFAULTS.effects),
    };
  } catch {
    return DEFAULTS;
  }
}

let settings: SoundSettings = typeof localStorage === 'undefined' ? DEFAULTS : read();
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let out: GainNode | null = null;
let musicBus: GainNode | null = null;
let duck: GainNode | null = null;
let noise: AudioBuffer | null = null;

// Master -> altavoz. Efectos y musica entran por separado para que cada
// deslizador mueva solo lo suyo, y la musica pasa por un "duck" que la aparta
// un momento cuando hay algo que oir, como el aviso de tu turno.
function context(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.connect(ctx.destination);
    out = ctx.createGain();
    out.connect(master);
    duck = ctx.createGain();
    duck.connect(master);
    musicBus = ctx.createGain();
    musicBus.connect(duck);
    applyLevels(0);
  }
  return ctx;
}

/** Lleva los tres volumenes a lo que dicen los ajustes, con una rampa corta para que no chasquee. */
function applyLevels(ramp = 0.08): void {
  if (!ctx || !master || !out || !musicBus) return;
  const at = ctx.currentTime;
  const set = (node: GainNode, value: number) => {
    node.gain.cancelScheduledValues(at);
    if (ramp === 0) node.gain.setValueAtTime(value, at);
    else node.gain.setTargetAtTime(value, at, ramp / 3);
  };
  set(master, settings.muted ? 0 : 0.5);
  set(out, settings.effects);
  set(musicBus, settings.music * MUSIC_TRIM);
}

// El navegador no deja sonar nada antes del primer gesto. Se aprovecha el que
// haya -el clic en "Crear sala" o en "Entrar"- para despertar el audio, y se
// sigue escuchando porque algunos moviles lo vuelven a dormir.
function unlock(): void {
  if (settings.muted) return;
  const ac = context();
  if (ac && ac.state === 'suspended') void ac.resume();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock);
  // Los ajustes son del navegador, no de la pestana. Cada una los leia al
  // abrir y no volvia a mirarlos: la musica seguia sonando en la otra
  // pestana, y al tocar alli un deslizador se guardaba su copia vieja encima
  // de lo que se acababa de decidir aqui.
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    settings = read();
    applyLevels();
    for (const fn of listeners) fn();
  });
}

/** Contexto y entrada de la musica, para music.ts. Nulos si el navegador no tiene Web Audio. */
export function musicOutput(): { ac: AudioContext; bus: GainNode } | null {
  const ac = context();
  return ac && musicBus ? { ac, bus: musicBus } : null;
}

/** Aparta la musica mientras suena un aviso y la devuelve despues. */
function duckMusic(ac: AudioContext, at: number, hold: number): void {
  if (!duck) return;
  duck.gain.cancelScheduledValues(at);
  duck.gain.setTargetAtTime(0.3, at, 0.04);
  duck.gain.setTargetAtTime(1, at + hold, 0.35);
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

/** Un toque de metal: dos dientes de sierra desafinados tras un filtro que se abre y se cierra. */
function horn(ac: AudioContext, at: number, freq: number, dur: number, gain: number): void {
  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 2;
  filter.frequency.setValueAtTime(freq * 1.5, at);
  filter.frequency.exponentialRampToValueAtTime(freq * 6, at + 0.05);
  filter.frequency.exponentialRampToValueAtTime(freq * 2, at + dur);
  const amp = ac.createGain();
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.03);
  amp.gain.setValueAtTime(gain, at + dur * 0.6);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  filter.connect(amp).connect(out!);
  for (const cents of [-7, 7]) {
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, at);
    osc.detune.setValueAtTime(cents, at);
    osc.connect(filter);
    osc.start(at);
    osc.stop(at + dur + 0.02);
  }
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
  // Tu turno: una llamada de metal que sube en tres notas y remata con la
  // campana de siempre, una octava arriba. Tiene que distinguirse de todo lo
  // demas que suena en la mesa, porque es lo unico que te pide algo.
  turn: (ac, t) => {
    duckMusic(ac, t, 1.3);
    hiss(ac, t, 0.3, { gain: 0.05, freq: 900, sweep: 4200, q: 0.9 });
    horn(ac, t + 0.02, 392, 0.13, 0.13);
    horn(ac, t + 0.15, 523.25, 0.13, 0.13);
    horn(ac, t + 0.28, 659.25, 0.5, 0.15);
    bell(ac, t + 0.3, 1318.51, 1.3, 0.12);
    bell(ac, t + 0.3, 987.77, 1.1, 0.08);
  },
  // Sigue siendo tu turno: dos golpes con los nudillos en la mesa y la campana.
  nudge: (ac, t) => {
    duckMusic(ac, t, 0.9);
    for (const at of [t, t + 0.16]) {
      tone(ac, at, 210, 0.1, { gain: 0.22, glide: 120, attack: 0.002 });
      hiss(ac, at, 0.03, { gain: 0.08, type: 'lowpass', freq: 1400 });
    }
    bell(ac, t + 0.38, 987.77, 0.9, 0.12);
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
    duckMusic(ac, t, 1.4);
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
      tone(ac, t + i * 0.11, f, i === 3 ? 0.9 : 0.45, { type: 'triangle', gain: 0.11 }),
    );
  },
  lose: (ac, t) => {
    duckMusic(ac, t, 1.6);
    [392, 311.13, 261.63].forEach((f, i) =>
      tone(ac, t + i * 0.18, f, i === 2 ? 0.9 : 0.55, { type: 'triangle', gain: 0.1, glide: i === 2 ? 240 : undefined }),
    );
  },
};

export function play(name: SoundName): void {
  if (settings.muted || settings.effects === 0) return;
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

/**
 * Un zumbido corto en el movil. Va con el silencio de la mesa y no con el
 * volumen de efectos: quien baja los efectos quiere menos ruido, quien silencia
 * quiere que el telefono no haga nada.
 */
export function buzz(pattern: number[]): void {
  if (settings.muted || typeof navigator === 'undefined') return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* algunos navegadores lo exponen y lo prohiben sin gesto previo */
  }
}

export function subscribeSound(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSoundSettings(): SoundSettings {
  return settings;
}

export function setSoundSettings(patch: Partial<SoundSettings>): void {
  const wasSilent = settings.muted || settings.effects === 0;
  settings = { ...settings, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* modo privado: la preferencia dura lo que la pestana */
  }
  applyLevels();
  if (!settings.muted) {
    unlock();
    // Un roce de carta confirma que ya suena; el clic mismo acaba de despertar el audio.
    if (wasSilent && settings.effects > 0) setTimeout(() => play('deal'), 60);
  }
  for (const fn of listeners) fn();
}

export function useSound(): SoundSettings & { set: (patch: Partial<SoundSettings>) => void } {
  const current = useSyncExternalStore(subscribeSound, getSoundSettings, () => DEFAULTS);
  return { ...current, set: setSoundSettings };
}

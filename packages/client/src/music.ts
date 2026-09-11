import { useEffect, useSyncExternalStore } from 'react';

import type { PackId } from '@contagio/engine';

import { SCORES, compile, scheduleStep, trackOutput } from './score';
import type { Compiled } from './score';
import { getSoundSettings, musicOutput, subscribeSound } from './sound';

/**
 * Reproductor de la musica de fondo. Suena la pieza del paquete de la sala
 * mientras se esta en una; al cambiar de paquete, una se funde en la otra.
 *
 * Se programa con antelacion sobre el reloj del audio y no con temporizadores
 * de nota: setInterval solo despierta para rellenar lo que va a sonar en el
 * proximo cuarto de segundo, asi que un tiron del hilo principal no se oye.
 */
const LOOKAHEAD = 0.25;
const TICK_MS = 60;
const FADE = 0.9;

interface Playing {
  id: PackId;
  score: Compiled;
  gain: GainNode;
  index: number;
  next: number;
}

let wanted: PackId | null = null;
let playing: Playing | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

// Una pestana en segundo plano espacia los temporizadores hasta un segundo y
// la musica saldria a trozos: mejor callar y volver a empezar al regresar.
function audible(): boolean {
  const { muted, music } = getSoundSettings();
  const hidden = typeof document !== 'undefined' && document.hidden;
  return wanted !== null && !muted && music > 0 && !hidden;
}

function fadeOut(): void {
  if (!playing) return;
  const { gain } = playing;
  const at = gain.context.currentTime;
  gain.gain.cancelScheduledValues(at);
  gain.gain.setTargetAtTime(0, at, FADE / 4);
  // Lo ya programado sigue sonando hacia este nodo hasta apagarse del todo.
  setTimeout(() => gain.disconnect(), (FADE + LOOKAHEAD) * 1000 + 600);
  playing = null;
}

function start(id: PackId): void {
  const out = musicOutput();
  if (!out) return;
  const gain = trackOutput(out.ac, out.bus, id);
  const at = out.ac.currentTime;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(1, at + FADE * 1.5);
  playing = { id, score: compile(id), gain, index: 0, next: 0 };
}

function tick(): void {
  if (!playing) return;
  const ac = playing.gain.context;
  // Con el audio dormido (sin gesto todavia) no se acumula nada que luego
  // sonaria de golpe.
  if ((ac as AudioContext).state !== 'running') return;
  const now = ac.currentTime;
  if (playing.next < now) playing.next = now + 0.05;
  while (playing.next < now + LOOKAHEAD) {
    scheduleStep(ac, playing.gain, playing.score, playing.index, playing.next);
    playing.index++;
    playing.next += playing.score.stepSec;
  }
}

function sync(): void {
  const target = audible() ? wanted : null;
  if (playing && playing.id !== target) fadeOut();
  if (target && !playing) start(target);
  if (playing && !timer) timer = setInterval(tick, TICK_MS);
  if (!playing && timer) {
    clearInterval(timer);
    timer = null;
  }
  for (const fn of listeners) fn();
}

if (typeof document !== 'undefined') {
  subscribeSound(sync);
  document.addEventListener('visibilitychange', sync);
}

/** Pide la pieza de un paquete mientras el componente este montado; `null` la calla. */
export function useMusic(id: PackId | null): void {
  useEffect(() => {
    wanted = id;
    sync();
  }, [id]);
  useEffect(
    () => () => {
      wanted = null;
      sync();
    },
    [],
  );
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Titulo de la pieza que toca ahora, suene o este en silencio. */
export function useTrackTitle(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => (wanted ? SCORES[wanted].title : null),
    () => null,
  );
}

/**
 * Renderiza la musica de fondo a WAV, sin jugar y sin altavoces: sirve para
 * oir una pieza al componerla y para medir que ninguna sature ni suene mucho
 * mas fuerte que las demas.
 *
 *   node tools/musica.mjs [paquete...]      # sin argumentos, todas
 *
 * Usa el mismo src/score.ts que el juego, transpilado al vuelo, sobre un
 * OfflineAudioContext del Chromium del contenedor (el mismo de shots.mjs).
 * Los WAV salen al nivel de la pieza, antes de los volumenes de la mesa.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { chromium } from 'playwright';
import { transformWithEsbuild } from 'vite';

const CDP_URL = process.env.CDP_URL ?? 'http://localhost:9222';
const OUT = resolve(process.env.MUSIC_OUT ?? 'tools/musica');
const RATE = 44100;
/** Vueltas de cada pieza: dos, para oir tambien como enlaza el final con el principio. */
const LOOPS = Number(process.env.MUSIC_LOOPS ?? 2);

function wav(left, right) {
  const frames = left.length;
  const buffer = Buffer.alloc(44 + frames * 4);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + frames * 4, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(RATE, 24);
  buffer.writeUInt32LE(RATE * 4, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(frames * 4, 40);
  for (let i = 0; i < frames; i++) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), 44 + i * 4);
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), 46 + i * 4);
  }
  return buffer;
}

const db = (x) => (x > 0 ? (20 * Math.log10(x)).toFixed(1) : '-inf');

async function main() {
  const source = await readFile(resolve('packages/client/src/score.ts'), 'utf8');
  const { code } = await transformWithEsbuild(source, 'score.ts', { format: 'iife', globalName: 'Score', loader: 'ts' });

  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setContent('<!doctype html><title>musica</title>');
  await page.addScriptTag({ content: code });

  const all = await page.evaluate(() => Object.keys(globalThis.Score.SCORES));
  const wanted = process.argv.slice(2);
  const ids = wanted.length ? wanted.filter((id) => all.includes(id)) : all;
  if (wanted.length && ids.length !== wanted.length) console.warn(`paquetes validos: ${all.join(', ')}`);
  await mkdir(OUT, { recursive: true });

  console.log('pieza                     vuelta   pico    rms');
  for (const id of ids) {
    const result = await page.evaluate(
      async ({ id, rate, loops }) => {
        const { compile, loopSeconds, scheduleStep, trackOutput, SCORES } = globalThis.Score;
        const score = compile(id);
        const seconds = loopSeconds(id) * loops + 2;
        const ac = new OfflineAudioContext(2, Math.ceil(seconds * rate), rate);
        const out = trackOutput(ac, ac.destination, id);
        const steps = score.bars * score.stepsPerBar * loops;
        for (let i = 0; i < steps; i++) scheduleStep(ac, out, score, i, 0.05 + i * score.stepSec);
        const rendered = await ac.startRendering();
        const left = rendered.getChannelData(0);
        const right = rendered.getChannelData(1);
        let peak = 0;
        let sum = 0;
        for (let i = 0; i < left.length; i++) {
          peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
          sum += left[i] * left[i];
        }
        // Float32Array no cruza a Node tal cual: se manda como lista de numeros.
        return {
          title: SCORES[id].title.es,
          loop: loopSeconds(id),
          peak,
          rms: Math.sqrt(sum / left.length),
          left: Array.from(left),
          right: Array.from(right),
        };
      },
      { id, rate: RATE, loops: LOOPS },
    );
    await writeFile(resolve(OUT, `${id}.wav`), wav(result.left, result.right));
    const warn = result.peak >= 0.99 ? '  <- satura' : '';
    console.log(
      `${`${id} (${result.title})`.padEnd(38).slice(0, 38)} ${result.loop.toFixed(1).padStart(5)} s ${db(result.peak).padStart(6)} ${db(result.rms).padStart(6)} dB${warn}`,
    );
  }

  await context.close();
  await browser.close();
  console.log(`\nWAV en ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

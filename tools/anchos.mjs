/**
 * Barrido de anchuras: monta una partida llena y comprueba, ventana a ventana,
 * que nada desborda y que la mesa sigue centrada.
 *
 * Existe por un fallo concreto: sin costados ocupados la mesa se colocaba en la
 * primera columna de la rejilla y toda la partida quedaba pegada a la izquierda.
 * Se veia solo con pocos jugadores, que es justo el caso que menos se prueba.
 *
 *   node tools/anchos.mjs
 */
import { spawn } from 'node:child_process';

import { chromium } from 'playwright';

const CDP_URL = process.env.CDP_URL ?? 'http://localhost:9222';
const PORT = Number(process.env.SHOT_PORT ?? 3991);
const URL = `http://localhost:${PORT}`;
const BOTS = Number(process.env.SHOT_BOTS ?? 5);

/** Anchuras de escritorio, el tramo intermedio y dos moviles. */
const SIZES = [
  [2560, 1400],
  [1914, 927],
  [1600, 900],
  [1440, 900],
  [1280, 800],
  [1100, 800],
  [1000, 760],
  [920, 700],
  [860, 700],
  [420, 860],
  [390, 780],
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  try {
    if ((await fetch(`${URL}/health`)).ok) {
      throw new Error(`el puerto ${PORT} ya esta ocupado: cierra ese proceso o usa SHOT_PORT`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('el puerto')) throw err;
  }

  // Bots muy lentos: lo que se mide es la mesa quieta, no la partida.
  const server = spawn(process.execPath, ['packages/server/dist/index.js'], {
    env: { ...process.env, PORT: String(PORT), BOT_DELAY_MS: '600000', OPENING_DELAY_MS: '600000' },
    stdio: 'ignore',
  });
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(`${URL}/health`)).ok) break;
    } catch {
      /* arrancando */
    }
    await wait(100);
  }

  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // En espanol, que es lo que buscan los selectores de texto: el navegador del contenedor diria ingles.
  await context.addInitScript(() => localStorage.setItem('contagio.lang', 'es'));
  const page = await context.newPage();

  await page.goto(URL);
  await page.fill('.field__input', 'Emiliano');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.lobby__sheet');
  for (let i = 0; i < BOTS; i++) await page.click('button:has-text("Anadir bot")');
  await page.click('button:has-text("Empezar partida")');
  await page.waitForSelector('.deal', { timeout: 8000 });
  await page.waitForSelector('.table:not(.is-dealing)', { timeout: 20000 });

  const problems = [];
  for (const [width, height] of SIZES) {
    await page.setViewportSize({ width, height });
    await wait(400);
    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const bad = [];
      if (doc.scrollWidth > window.innerWidth + 1) bad.push(`ancho +${doc.scrollWidth - window.innerWidth}px`);
      if (doc.scrollHeight > window.innerHeight + 1) bad.push(`alto +${doc.scrollHeight - window.innerHeight}px`);
      const felt = document.querySelector('.felt');
      if (felt && felt.scrollHeight > felt.clientHeight + 1) bad.push(`.felt +${felt.scrollHeight - felt.clientHeight}px`);
      const arena = document.querySelector('.arena');
      if (arena && arena.scrollWidth > arena.clientWidth + 1) bad.push(`.arena +${arena.scrollWidth - arena.clientWidth}px`);
      const board = document.querySelector('.board')?.getBoundingClientRect();
      const off = board ? Math.round(Math.abs(board.x + board.width / 2 - window.innerWidth / 2)) : 0;
      // Dos pixeles de margen: el centrado es par o impar segun la ventana.
      if (off > 2) bad.push(`mesa descentrada ${off}px`);
      return bad;
    });
    const size = `${width}x${height}`.padEnd(10);
    console.log(`${size} ${report.length ? report.join(', ') : 'ok'}`);
    if (report.length) problems.push(`${size.trim()}: ${report.join(', ')}`);
  }

  await context.close();
  await browser.close();
  server.kill();

  if (problems.length) {
    console.log(`\n${problems.length} anchuras con problemas`);
    process.exitCode = 1;
  } else {
    console.log('\ntodas las anchuras caben y quedan centradas');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

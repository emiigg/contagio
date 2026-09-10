/**
 * Capturas de la mesa para revisar el diseño sin abrir un navegador a mano.
 * Levanta el servidor de produccion, juega una partida con bots y guarda PNGs.
 *
 *   node tools/shots.mjs [carpeta]
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

import { chromium } from 'playwright';

/**
 * El navegador corre en un contenedor: esta maquina no tiene las librerias de
 * escritorio que pide Chromium y no hay sudo para instalarlas. Con --network
 * host, el localhost del contenedor es el mismo que el del servidor de juego.
 */
const CDP_URL = process.env.CDP_URL ?? 'http://localhost:9222';

const OUT = resolve(process.argv[2] ?? 'tools/shots');
const PORT = Number(process.env.SHOT_PORT ?? 3995);
const URL = `http://localhost:${PORT}`;
const VIEWPORT = { width: 1440, height: 900 };
/** 2 para revisar detalle, 1 para las imagenes del README. */
const SCALE = Number(process.env.SHOT_SCALE ?? 2);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT, { recursive: true });
  const server = spawn(process.execPath, ['packages/server/dist/index.js'], {
    env: { ...process.env, PORT: String(PORT), BOT_DELAY_MS: '3000' },
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
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(String(err)));

  const shot = async (name) => {
    await page.screenshot({ path: resolve(OUT, `${name}.png`) });
    console.log('  ->', `${name}.png`);
  };

  await page.goto(URL);
  await page.waitForSelector('.home__title');
  await shot('01-inicio');

  await page.fill('.field__input', 'Dra. Marin');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.lobby__sheet');
  for (let i = 0; i < 3; i++) await page.click('button:has-text("Anadir bot")');
  await wait(300);
  await shot('02-sala');

  await page.click('button:has-text("Empezar partida")');
  await page.waitForSelector('.deal', { timeout: 5000 });
  await wait(700);
  await shot('03-barajando');
  await wait(1200);
  await shot('04-repartiendo');

  await page.waitForSelector('.table:not(.is-dealing)', { timeout: 15000 });
  await wait(400);
  await shot('05-mesa');

  // Mano: pasar el raton por una carta para ver la leyenda.
  const cards = page.locator('.hand__slot');
  if (await cards.count()) {
    await cards.nth(1).hover();
    await wait(400);
    await shot('06-mano-hover');
  }

  // Seleccionar una carta jugable para ver los objetivos resaltados.
  const playable = page.locator('.hand__slot .card.is-playable');
  if (await playable.count()) {
    await playable.first().click();
    await wait(400);
    await shot('07-carta-elegida');
  }

  /** Juega el turno: coloca, apunta a un organo, o descarta si no hay nada. */
  async function playTurn() {
    await page.waitForSelector('.bar__turn >> text=Tu turno', { timeout: 90000 });
    await wait(500);
    const hand = page.locator('.hand__slot .card.is-playable');
    if (await hand.count()) {
      await hand.first().click();
      await wait(250);
      const direct = page.locator('.dock__actions .btn--primary');
      if (await direct.count()) {
        await direct.first().click();
        return;
      }
      const target = page.locator('.organ.is-targetable');
      if (await target.count()) {
        await target.first().click();
        return;
      }
    }
    await page.click('button:has-text("Descartar cartas")');
    await page.locator('.hand__slot .card').first().click();
    await page.click('button:has-text("Soltar")');
  }

  // Unos turnos para que la mesa tenga organos y se vean anuncios de los bots.
  let announced = false;
  for (let turn = 0; turn < 7; turn++) {
    await playTurn();
    for (let i = 0; i < 12 && !announced; i++) {
      await wait(700);
      const visible = await page.locator('.announce:not(.announce--empty)').count();
      const mine = await page.locator('.bar__turn >> text=Tu turno').count();
      if (visible && !mine) {
        await shot('08-anuncio-bot');
        announced = true;
      }
    }
  }
  await wait(600);
  await shot('10-partida-avanzada');

  await page.setViewportSize({ width: 420, height: 860 });
  await wait(600);
  await shot('09-movil');

  console.log(errors.length ? `\nerrores de consola:\n- ${errors.join('\n- ')}` : '\nsin errores de consola');
  await context.close();
  await browser.close();
  server.kill();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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
/** 'dark' o 'light' fuerzan el tema; sin valor manda el del sistema. */
const THEME = process.env.SHOT_THEME ?? '';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await mkdir(OUT, { recursive: true });

  // Si el puerto ya responde, las capturas saldrian de OTRO servidor (por
  // ejemplo uno olvidado de una ejecucion anterior) y mentirian sobre el
  // codigo actual. Mejor parar aqui que revisar un diseno que no es el tuyo.
  try {
    if ((await fetch(`${URL}/health`)).ok) {
      throw new Error(`el puerto ${PORT} ya esta ocupado: cierra ese proceso o usa SHOT_PORT`);
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('el puerto')) throw err;
  }

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
  if (THEME) {
    // La preferencia se siembra antes de que cargue la pagina, igual que la
    // encontraria el navegador de alguien que ya eligio tema.
    await context.addInitScript((value) => localStorage.setItem('contagio.theme', value), THEME);
  }
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(String(err)));

  const shot = async (name) => {
    await page.screenshot({ path: resolve(OUT, `${name}.png`) });
    if (process.env.SHOT_DEBUG) {
      const info = await page.evaluate(() => ({
        dealing: !!document.querySelector('.table.is-dealing'),
        announce: document.querySelector('.announce__text')?.textContent ?? null,
        log: [...document.querySelectorAll('.ticker__item')].map((n) => n.textContent),
      }));
      console.log('     ', JSON.stringify(info));
    }
    console.log('  ->', `${name}.png`);
  };

  await page.goto(URL);
  await page.waitForSelector('.home__title');
  await shot('01-inicio');

  await page.fill('.field__input', 'Dra. Marin');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.lobby__sheet');
  const bots = Number(process.env.SHOT_BOTS ?? 3);
  for (let i = 0; i < bots; i++) await page.click('button:has-text("Anadir bot")');
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

  // El boton de tema: desde automatico, dos pulsaciones dejan la mesa oscura.
  if (!THEME) {
    await page.click('.themeswitch');
    await page.click('.themeswitch');
    await wait(400);
    await shot('05b-mesa-oscura');
    await page.click('.themeswitch');
    await wait(300);
  }

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

  const overflowSeen = [];
  async function checkOverflow(when) {
    const found = await page.evaluate(() => {
      const felt = document.querySelector('.felt');
      const doc = document.documentElement;
      const out = [];
      if (felt && felt.scrollHeight > felt.clientHeight + 1) out.push(`.felt +${felt.scrollHeight - felt.clientHeight}px`);
      const seats = document.querySelector('.seats');
      if (seats && seats.scrollHeight > seats.clientHeight + 1) out.push(`.seats alto +${seats.scrollHeight - seats.clientHeight}px`);
      if (seats && seats.scrollTop > 1) out.push(`.seats desplazado ${Math.round(seats.scrollTop)}px`);
      if (felt && felt.scrollTop > 1) out.push(`.felt desplazado ${Math.round(felt.scrollTop)}px`);
      if (doc.scrollHeight > window.innerHeight + 1) out.push(`pagina +${doc.scrollHeight - window.innerHeight}px`);
      if (doc.scrollWidth > window.innerWidth + 1) out.push(`ancho +${doc.scrollWidth - window.innerWidth}px`);
      return out;
    });
    if (found.length) overflowSeen.push(`${when}: ${found.join(', ')}`);
  }

  // Unos turnos para que la mesa tenga organos y se vean anuncios de los bots.
  let announced = false;
  for (let turn = 0; turn < 7; turn++) {
    await playTurn();
    await checkOverflow(`turno ${turn + 1}`);
    for (let i = 0; i < 12 && !announced; i++) {
      await wait(700);
      const visible = await page.locator('.announce:not(.announce--empty)').count();
      const mine = await page.locator('.bar__turn >> text=Tu turno').count();
      if (visible && !mine) {
        await checkOverflow('con anuncio en pantalla');
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

  // Aviso de desbordes: la mesa tiene que caber en la ventana sin scroll.
  await page.setViewportSize(VIEWPORT);
  await wait(500);
  const overflow = await page.evaluate(() => {
    const report = [];
    const felt = document.querySelector('.felt');
    if (felt && felt.scrollHeight > felt.clientHeight + 1) {
      report.push(`.felt desborda ${felt.scrollHeight - felt.clientHeight}px (scrollTop ${Math.round(felt.scrollTop)})`);
    }
    const doc = document.documentElement;
    if (doc.scrollHeight > window.innerHeight + 1) {
      report.push(`la pagina desborda ${doc.scrollHeight - window.innerHeight}px`);
    }
    if (doc.scrollWidth > window.innerWidth + 1) {
      report.push(`ancho desbordado ${doc.scrollWidth - window.innerWidth}px`);
    }
    const seats = document.querySelector('.seats');
    if (seats && seats.scrollWidth > seats.clientWidth + 1) {
      report.push(`los asientos desbordan ${seats.scrollWidth - seats.clientWidth}px`);
    }
    return report;
  });
  const allOverflow = [...overflowSeen, ...overflow.map((o) => `al final: ${o}`)];
  console.log(allOverflow.length ? `\ndesbordes:\n- ${allOverflow.join('\n- ')}` : '\nsin desbordes en ningun momento');

  console.log(errors.length ? `\nerrores de consola:\n- ${errors.join('\n- ')}` : '\nsin errores de consola');
  await context.close();
  await browser.close();
  server.kill();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

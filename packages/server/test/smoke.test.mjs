/**
 * Prueba de integracion: levanta el servidor real, juega una partida completa
 * por socket (dos clientes + un bot) y comprueba que termina con un ganador.
 */
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';

import { chooseBotAction } from '@contagio/engine';
import { io } from 'socket.io-client';

const here = dirname(fileURLToPath(import.meta.url));
const entry = resolve(here, '../dist/index.js');
const PORT = Number(process.env.TEST_PORT ?? 3987);
const URL = `http://localhost:${PORT}`;

let server;
const sockets = [];

/** Arranca un servidor propio y espera a que responda. */
async function startServer(port, env = {}) {
  const child = spawn(process.execPath, [entry], { env: { ...process.env, PORT: String(port), ...env }, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${port}/health`)).ok) return child;
    } catch {
      /* aun arrancando */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  child.kill();
  throw new Error(`el servidor no arranco en el puerto ${port}`);
}

before(async () => {
  // Tope bajo y margen corto: lo que se prueba es la politica, no los numeros.
  server = await startServer(PORT, { MAX_ROOMS: '2', EMPTY_GRACE_MS: '1000' });
});

after(() => {
  for (const socket of sockets) socket.close();
  server?.kill();
});

function connect() {
  const socket = io(URL, { transports: ['websocket'], forceNew: true });
  sockets.push(socket);
  return socket;
}

function ask(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`sin respuesta a ${event}`)), 5000);
    socket.emit(event, payload, (res) => {
      clearTimeout(timer);
      res.ok ? resolve(res.data) : reject(new Error(res.error));
    });
  });
}

test('una partida completa por socket termina con un ganador', async () => {
  const host = connect();
  const guest = connect();
  await Promise.all([new Promise((r) => host.on('connect', r)), new Promise((r) => guest.on('connect', r))]);

  const created = await ask(host, 'room:create', { name: 'Anfitriona' });
  assert.match(created.room.code, /^[A-Z0-9]{4}$/);

  const joined = await ask(guest, 'room:join', { code: created.room.code, name: 'Invitado' });
  assert.equal(joined.room.players.length, 2);

  await ask(host, 'room:addBot', {});

  const rejected = [];
  const finished = new Promise((resolveGame, rejectGame) => {
    const timer = setTimeout(() => rejectGame(new Error('la partida no termino a tiempo')), 90_000);
    let settled = false;

    // Los listeners se registran ANTES de empezar: la primera vista llega en
    // cuanto el servidor reparte, y si se pierde nadie juega el primer turno.
    const drive = (socket, label, seedBase) => {
      let n = 0;
      socket.on('game:view', (view) => {
        if (view.phase === 'finished') {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolveGame(view);
          return;
        }
        if (!view.isYourTurn || view.legalActions.length === 0) return;
        const action = pickAction(view, seedBase + n++);
        socket.emit('game:action', { action }, (res) => {
          if (!res.ok) rejected.push(`${label}: ${action.type} -> ${res.error}`);
        });
      });
    };

    drive(host, 'anfitriona', 1000);
    drive(guest, 'invitado', 5000);
  });

  await ask(host, 'room:start', {});
  const view = await finished;

  assert.deepEqual(rejected, [], 'el servidor rechazo jugadas que declaraba legales');
  assert.equal(view.phase, 'finished');
  assert.ok(view.winnerId, 'la partida debe tener ganador');
  assert.ok(view.players.some((p) => p.id === view.winnerId && p.healthyOrgans >= 4));

  host.close();
  guest.close();
});

/** Espera a que /health baje a un numero de salas, o se rinde. */
async function waitForRooms(count, timeoutMs = 8000) {
  const deadline = Date.now() + timeoutMs;
  let seen = -1;
  while (Date.now() < deadline) {
    seen = (await (await fetch(`${URL}/health`)).json()).rooms;
    if (seen === count) return;
    await new Promise((r) => setTimeout(r, 150));
  }
  assert.fail(`el servidor se quedo en ${seen} salas y se esperaban ${count}`);
}

test('el servidor no abre mas salas de las que aguanta', async () => {
  await waitForRooms(0); // la partida anterior se cierra al soltar sus sockets
  const first = connect();
  const second = connect();
  const third = connect();
  await Promise.all([first, second, third].map((s) => new Promise((r) => s.on('connect', r))));

  await ask(first, 'room:create', { name: 'Una' });
  await ask(second, 'room:create', { name: 'Otra' });
  await assert.rejects(ask(third, 'room:create', { name: 'Tarde' }), /rato/i);

  // Al soltarse la primera sala queda hueco y el rechazado ya puede entrar.
  first.close();
  await waitForRooms(1);
  const late = await ask(third, 'room:create', { name: 'Tarde' });
  assert.match(late.room.code, /^[A-Z0-9]{4}$/);

  second.close();
  third.close();
  await waitForRooms(0);
});

test('una sala en partida se cierra cuando pierde a todos sus humanos', async () => {
  const solo = connect();
  await new Promise((r) => solo.on('connect', r));
  const { room } = await ask(solo, 'room:create', { name: 'Sola' });
  await ask(solo, 'room:addBot', {});
  await ask(solo, 'room:start', {});

  const before = (await (await fetch(`${URL}/health`)).json()).rooms;
  solo.close();
  await waitForRooms(before - 1);

  // Y el codigo deja de existir para quien intente volver.
  const stranger = connect();
  await new Promise((r) => stranger.on('connect', r));
  await assert.rejects(ask(stranger, 'room:join', { code: room.code, name: 'Nadie' }), /no existe/i);
});

test('el turno de una persona se juega solo cuando se le acaba el tiempo', async () => {
  // Servidor aparte con un "minuto" de segundo y medio: el resto de pruebas
  // juegan a su ritmo y no deben notar este reloj.
  const port = PORT + 1;
  const quick = await startServer(port, { TURN_LIMIT_MS: '1500', BOT_DELAY_MS: '300', OPENING_DELAY_MS: '100' });
  const socket = io(`http://localhost:${port}`, { transports: ['websocket'], forceNew: true });
  sockets.push(socket);
  await new Promise((r) => socket.on('connect', r));

  try {
    const views = [];
    socket.on('game:view', (view) => views.push(view));
    await ask(socket, 'room:create', { name: 'Ausente' });
    await ask(socket, 'room:addBot', {});
    await ask(socket, 'room:start', {});

    // Nadie juega: el turno tiene que avanzar solo y volver a nosotros.
    await new Promise((r) => setTimeout(r, 4000));

    const mine = views.filter((v) => v.isYourTurn);
    assert.ok(mine.length > 0, 'nunca llego un turno propio');
    assert.equal(typeof mine[0].turnMsLeft, 'number', 'el turno de una persona lleva reloj');
    assert.ok(mine[0].turnMsLeft <= 1600, 'el reloj no puede pasarse del limite');

    const bots = views.filter((v) => !v.isYourTurn && v.phase === 'playing');
    assert.ok(bots.length > 0, 'el turno nunca paso al bot');
    assert.equal(bots.at(-1).turnMsLeft, null, 'los bots no llevan reloj');

    const last = views.at(-1);
    assert.ok(last.turnCount > 2, `la partida se quedo parada en el turno ${last.turnCount}`);
  } finally {
    socket.close();
    quick.kill();
  }
});

/** Reutiliza la heuristica del motor sobre la vista publica del jugador. */
function pickAction(view, seed) {
  const choice = chooseBotAction(viewToState(view), view.youId, 'normal', seed);
  if (choice) return choice.action;
  const plays = view.legalActions.filter((a) => a.type !== 'DISCARD');
  return plays[0] ?? view.legalActions[0];
}

/** Vista -> estado suficiente para la heuristica: las manos rivales no se conocen. */
function viewToState(view) {
  return {
    players: view.players.map((p) => ({
      id: p.id,
      name: p.name,
      isBot: p.isBot,
      connected: p.connected,
      hand: p.id === view.youId ? view.hand : [],
      body: p.body,
    })),
    turn: view.players.findIndex((p) => p.id === view.turnPlayerId),
    deck: [],
    discard: [],
    phase: view.phase,
    winnerId: view.winnerId,
    seed: 1,
    turnCount: view.turnCount,
    log: [],
  };
}

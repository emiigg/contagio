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

test('la partida arranca con el paquete que elige el anfitrion', async () => {
  const host = connect();
  const guest = connect();
  await Promise.all([host, guest].map((s) => new Promise((r) => s.on('connect', r))));
  const views = [];
  host.on('game:view', (view) => views.push(view));

  const { room } = await ask(host, 'room:create', { name: 'Anfitriona' });
  assert.equal(room.pack, 'contagio', 'una sala nueva empieza con el paquete de siempre');
  await ask(guest, 'room:join', { code: room.code, name: 'Invitado' });

  await assert.rejects(ask(guest, 'room:pack', { pack: 'frutas' }), /anfitrion/i);
  await assert.rejects(ask(host, 'room:pack', { pack: 'inventado' }), /no valido/i);
  const chosen = await ask(host, 'room:pack', { pack: 'frutas' });
  assert.equal(chosen.room.pack, 'frutas');

  await ask(host, 'room:start', {});
  for (let i = 0; i < 50 && views.length === 0; i++) await new Promise((r) => setTimeout(r, 100));
  assert.equal(views[0]?.pack, 'frutas', 'la vista de la partida no trae el paquete elegido');
  await assert.rejects(ask(host, 'room:pack', { pack: 'contagio' }), /empezado/i);

  host.close();
  guest.close();
});

test('el turno de una persona se juega solo cuando se le acaba el tiempo', async () => {
  // Servidor aparte con un turno de segundo y medio: el resto de pruebas
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

/** Espera a que se cumpla una condicion sobre las vistas recibidas. */
async function until(check, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, 25));
  }
  assert.fail('la condicion no se cumplio a tiempo');
}

test('cada turno estrena reloj y la conexion de otro no lo reinicia', async () => {
  // Con dos personas seguidas los dos turnos llegan con el tiempo entero: sin
  // un identificador de reloj, el cliente creia que seguia el turno anterior.
  const port = PORT + 2;
  const url = `http://localhost:${port}`;
  const own = await startServer(port, { OPENING_DELAY_MS: '0' });
  const a = io(url, { transports: ['websocket'], forceNew: true });
  const b = io(url, { transports: ['websocket'], forceNew: true });
  sockets.push(a, b);
  await Promise.all([a, b].map((s) => new Promise((r) => s.on('connect', r))));

  try {
    const last = new Map();
    a.on('game:view', (view) => last.set(a, view));
    b.on('game:view', (view) => last.set(b, view));
    const { room } = await ask(a, 'room:create', { name: 'Ana' });
    await ask(b, 'room:join', { code: room.code, name: 'Beto' });
    await ask(a, 'room:start', {});
    await until(() => last.get(a) && last.get(b));

    const opener = last.get(a).isYourTurn ? a : b;
    const other = opener === a ? b : a;
    const first = last.get(opener);
    assert.equal(typeof first.turnClockId, 'number');

    await new Promise((r) => setTimeout(r, 150));
    await ask(opener, 'game:action', { action: { type: 'DISCARD', cardIds: [first.hand[0].id] } });
    await until(() => last.get(other)?.isYourTurn);
    const second = last.get(other);
    assert.notEqual(second.turnClockId, first.turnClockId, 'el turno nuevo tiene que estrenar reloj');
    assert.ok(
      second.turnMsLeft > second.turnLimitMs - 1000,
      `el turno nuevo empezo con ${second.turnMsLeft} de ${second.turnLimitMs} ms`,
    );

    // Quien no juega se va: a quien juega no se le toca el reloj.
    await new Promise((r) => setTimeout(r, 300));
    const before = last.get(other);
    opener.close();
    await until(() => last.get(other) !== before);
    const after = last.get(other);
    assert.equal(after.turnClockId, second.turnClockId, 'la desconexion de otro reinicio el reloj');
    assert.ok(after.turnMsLeft < second.turnMsLeft - 200, 'el tiempo de quien juega volvio a llenarse');
  } finally {
    a.close();
    b.close();
    own.kill();
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

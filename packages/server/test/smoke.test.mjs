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

before(async () => {
  server = spawn(process.execPath, [entry], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${URL}/health`)).ok) return;
    } catch {
      /* aun arrancando */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('el servidor no arranco');
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

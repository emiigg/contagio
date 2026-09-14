import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { Server } from 'socket.io';

import { MAX_PLAYERS, isPackId } from '@contagio/engine';
import type { BotDifficulty, ClientToServerEvents, ServerToClientEvents } from '@contagio/engine';

import { Room, generateRoomCode } from './rooms.js';
import { MSG } from './messages.js';

const PORT = Number(process.env.PORT ?? 3001);
const ORIGIN = process.env.CORS_ORIGIN ?? '*';
/**
 * Techo de partidas simultaneas. Cada sala mantiene estado en memoria y un
 * temporizador para los bots, asi que el limite es lo que protege al servidor:
 * mejor decir "ahora no" que servir seis partidas a tirones.
 */
const MAX_ROOMS = Number(process.env.MAX_ROOMS ?? 5);
/**
 * Margen que se le da a una sala sin humanos conectados antes de cerrarla.
 * No es cero porque recargar la pagina es una desconexion: quien vuelve dentro
 * de este minuto se reencuentra su partida donde la dejo.
 */
const EMPTY_GRACE_MS = Number(process.env.EMPTY_GRACE_MS ?? 60_000);
/** Cada cuanto se pasa la escoba. Nunca mas lento que el propio margen. */
const SWEEP_MS = Math.max(1_000, Math.min(10_000, EMPTY_GRACE_MS));

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: ORIGIN, methods: ['GET', 'POST'] },
});

const rooms = new Map<string, Room>();
const emptySince = new Map<string, number>();
/** socket.id -> ubicacion del jugador, para resolver desconexiones. */
const sessions = new Map<string, { code: string; playerId: string }>();

/**
 * Cierra una sala y suelta todo lo suyo: temporizador de bots, marca de vacia
 * y las sesiones que aun la apuntaban.
 */
function closeRoom(code: string): void {
  rooms.get(code)?.clearTimer();
  rooms.delete(code);
  emptySince.delete(code);
  for (const [socketId, session] of sessions) {
    if (session.code === code) sessions.delete(socketId);
  }
}

/** Marca o desmarca el reloj de sala vacia segun quien quede conectado. */
function reviewOccupancy(room: Room): void {
  if (!room.isEmpty) {
    emptySince.delete(room.code);
    return;
  }
  // Sin ningun asiento humano no hay a quien esperar: se cierra en el acto.
  if (room.isAbandoned) closeRoom(room.code);
  else if (!emptySince.has(room.code)) emptySince.set(room.code, Date.now());
}

function makeRoom(): Room {
  const code = generateRoomCode(new Set(rooms.keys()));
  const room = new Room(code, {
    room: (view) => io.to(code).emit('room:state', view),
    view: (socketId, view) => io.to(socketId).emit('game:view', view),
    gameOver: (payload) => io.to(code).emit('game:over', payload),
    toast: (socketId, message) => io.to(socketId).emit('toast', { message, kind: 'info' }),
  });
  rooms.set(code, room);
  return room;
}

function roomOf(socketId: string): { room: Room; playerId: string } | null {
  const session = sessions.get(socketId);
  if (!session) return null;
  const room = rooms.get(session.code);
  if (!room) return null;
  return { room, playerId: session.playerId };
}

io.on('connection', (socket) => {
  socket.on('room:create', ({ name }, ack) => {
    if (rooms.size >= MAX_ROOMS) return ack({ ok: false, error: MSG.full(MAX_ROOMS) });
    const room = makeRoom();
    const member = room.addHuman(name, socket.id);
    sessions.set(socket.id, { code: room.code, playerId: member.id });
    socket.join(room.code);
    ack({ ok: true, data: { room: room.view(), playerId: member.id, token: member.token } });
    room.pushState();
  });

  socket.on('room:join', ({ code, name }, ack) => {
    const room = rooms.get(code.trim().toUpperCase());
    if (!room) return ack({ ok: false, error: MSG.noSuchRoom });
    if (room.status !== 'lobby') return ack({ ok: false, error: MSG.alreadyStarted });
    if (room.members.length >= MAX_PLAYERS) return ack({ ok: false, error: MSG.roomFull });

    const member = room.addHuman(name, socket.id);
    sessions.set(socket.id, { code: room.code, playerId: member.id });
    socket.join(room.code);
    emptySince.delete(room.code);
    ack({ ok: true, data: { room: room.view(), playerId: member.id, token: member.token } });
    room.pushState();
  });

  /** Reconexion: el cliente guarda su token y vuelve a su asiento. */
  socket.on('room:resume', ({ code, playerId, token }, ack) => {
    const room = rooms.get(code.trim().toUpperCase());
    if (!room) return ack({ ok: false, error: MSG.roomGone });
    const member = room.findByToken(playerId, token);
    if (!member) return ack({ ok: false, error: MSG.badCredentials });

    sessions.set(socket.id, { code: room.code, playerId });
    socket.join(room.code);
    emptySince.delete(room.code);
    room.setConnection(playerId, socket.id);
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:addBot', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostAddsBots });
    if (room.status !== 'lobby') return ack({ ok: false, error: MSG.alreadyStarted });
    if (room.members.length >= MAX_PLAYERS) return ack({ ok: false, error: MSG.roomFull });

    room.addBot();
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:removePlayer', ({ playerId: targetId }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostKicks });
    if (room.status !== 'lobby') return ack({ ok: false, error: MSG.alreadyStarted });

    room.remove(targetId);
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:difficulty', ({ difficulty }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostSetsDifficulty });
    const allowed: BotDifficulty[] = ['easy', 'normal', 'hard'];
    if (!allowed.includes(difficulty)) return ack({ ok: false, error: MSG.badDifficulty });

    room.difficulty = difficulty;
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  /** El paquete se elige en la sala: con la partida en marcha ya no se toca. */
  socket.on('room:pack', ({ pack }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostPicksPack });
    if (room.status !== 'lobby') return ack({ ok: false, error: MSG.alreadyStarted });
    if (!isPackId(pack)) return ack({ ok: false, error: MSG.badPack });

    room.pack = pack;
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:start', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostStarts });

    const result = room.start();
    if (!result.ok) return ack({ ok: false, error: result.error! });
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:reopen', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: MSG.hostReopens });

    const result = room.reopen();
    if (!result.ok) return ack({ ok: false, error: result.error! });
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('game:action', ({ action }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: MSG.notInRoom });
    const { room, playerId } = found;

    const result = room.handleAction(playerId, action);
    if (!result.ok) {
      socket.emit('toast', { message: result.error!, kind: 'error' });
      return ack({ ok: false, error: result.error! });
    }
    ack({ ok: true, data: {} });
  });

  socket.on('room:leave', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (found) {
      const { room, playerId } = found;
      if (room.status === 'lobby') room.remove(playerId);
      else room.setConnection(playerId, null);
      socket.leave(room.code);
      room.pushState();
      reviewOccupancy(room);
    }
    sessions.delete(socket.id);
    ack({ ok: true, data: {} });
  });

  socket.on('disconnect', () => {
    const found = roomOf(socket.id);
    sessions.delete(socket.id);
    if (!found) return;
    const { room, playerId } = found;
    if (room.status === 'lobby') {
      room.remove(playerId);
      room.pushState();
    } else {
      // En partida el asiento se mantiene: el jugador puede reconectar con su token.
      room.setConnection(playerId, null);
    }
    reviewOccupancy(room);
  });
});

// Recogida de salas sin nadie: libera el hueco para la siguiente partida.
setInterval(() => {
  const now = Date.now();
  for (const [code, since] of emptySince) {
    if (now - since < EMPTY_GRACE_MS) continue;
    closeRoom(code);
  }
}, SWEEP_MS).unref();

app.get('/health', (_req, res) => {
  res.json({ ok: true, rooms: rooms.size, maxRooms: MAX_ROOMS, uptime: process.uptime() });
});

// En produccion el mismo proceso sirve el cliente compilado.
const here = dirname(fileURLToPath(import.meta.url));
const clientDist = resolve(here, '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/health|\/socket\.io).*/, (_req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`[contagio] servidor escuchando en http://localhost:${PORT}`);
});

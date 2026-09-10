import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import { Server } from 'socket.io';

import { MAX_PLAYERS } from '@contagio/engine';
import type { BotDifficulty, ClientToServerEvents, ServerToClientEvents } from '@contagio/engine';

import { Room, generateRoomCode } from './rooms.js';

const PORT = Number(process.env.PORT ?? 3001);
const ORIGIN = process.env.CORS_ORIGIN ?? '*';
/** Una sala vacia se recoge pasado este tiempo. */
const ROOM_TTL_MS = 30 * 60 * 1000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: ORIGIN, methods: ['GET', 'POST'] },
});

const rooms = new Map<string, Room>();
const emptySince = new Map<string, number>();
/** socket.id -> ubicacion del jugador, para resolver desconexiones. */
const sessions = new Map<string, { code: string; playerId: string }>();

function makeRoom(): Room {
  const code = generateRoomCode(new Set(rooms.keys()));
  const room = new Room(code, {
    room: (view) => io.to(code).emit('room:state', view),
    view: (socketId, view) => io.to(socketId).emit('game:view', view),
    gameOver: (payload) => io.to(code).emit('game:over', payload),
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
    const room = makeRoom();
    const member = room.addHuman(name, socket.id);
    sessions.set(socket.id, { code: room.code, playerId: member.id });
    socket.join(room.code);
    ack({ ok: true, data: { room: room.view(), playerId: member.id, token: member.token } });
    room.pushState();
  });

  socket.on('room:join', ({ code, name }, ack) => {
    const room = rooms.get(code.trim().toUpperCase());
    if (!room) return ack({ ok: false, error: 'No existe ninguna sala con ese codigo' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'La partida ya ha empezado' });
    if (room.members.length >= MAX_PLAYERS) return ack({ ok: false, error: 'La sala esta llena' });

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
    if (!room) return ack({ ok: false, error: 'La sala ya no existe' });
    const member = room.findByToken(playerId, token);
    if (!member) return ack({ ok: false, error: 'Credenciales no validas para esta sala' });

    sessions.set(socket.id, { code: room.code, playerId });
    socket.join(room.code);
    emptySince.delete(room.code);
    room.setConnection(playerId, socket.id);
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:addBot', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: 'Solo el anfitrion puede anadir bots' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'La partida ya ha empezado' });
    if (room.members.length >= MAX_PLAYERS) return ack({ ok: false, error: 'La sala esta llena' });

    room.addBot();
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:removePlayer', ({ playerId: targetId }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: 'Solo el anfitrion puede expulsar' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'La partida ya ha empezado' });

    room.remove(targetId);
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:difficulty', ({ difficulty }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: 'Solo el anfitrion decide la dificultad' });
    const allowed: BotDifficulty[] = ['easy', 'normal', 'hard'];
    if (!allowed.includes(difficulty)) return ack({ ok: false, error: 'Dificultad no valida' });

    room.difficulty = difficulty;
    room.pushState();
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:start', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: 'Solo el anfitrion puede empezar' });

    const result = room.start();
    if (!result.ok) return ack({ ok: false, error: result.error! });
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('room:rematch', (_payload, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
    const { room, playerId } = found;
    if (room.hostId !== playerId) return ack({ ok: false, error: 'Solo el anfitrion puede repetir' });

    const result = room.rematch();
    if (!result.ok) return ack({ ok: false, error: result.error! });
    ack({ ok: true, data: { room: room.view() } });
  });

  socket.on('game:action', ({ action }, ack) => {
    const found = roomOf(socket.id);
    if (!found) return ack({ ok: false, error: 'No estas en ninguna sala' });
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
      if (room.isEmpty) emptySince.set(room.code, Date.now());
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
    if (room.isEmpty) emptySince.set(room.code, Date.now());
  });
});

// Recogida de salas abandonadas.
setInterval(() => {
  const now = Date.now();
  for (const [code, since] of emptySince) {
    if (now - since < ROOM_TTL_MS) continue;
    rooms.get(code)?.clearTimer();
    rooms.delete(code);
    emptySince.delete(code);
  }
}, 60_000).unref();

app.get('/health', (_req, res) => {
  res.json({ ok: true, rooms: rooms.size, uptime: process.uptime() });
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

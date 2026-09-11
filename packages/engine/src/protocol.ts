import type { Action } from './types.js';
import type { PlayerView } from './view.js';
import type { BotDifficulty } from './bot.js';
import type { Localized } from './lang.js';
import type { PackId } from './packs.js';

/** Contrato cliente <-> servidor. Vive en el motor para que ambos lo compartan. */

export interface RoomPlayer {
  id: string;
  name: string;
  isBot: boolean;
  connected: boolean;
  isHost: boolean;
}

export interface RoomView {
  code: string;
  players: RoomPlayer[];
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  difficulty: BotDifficulty;
  /** Paquete elegido en la sala; la partida arranca con el. */
  pack: PackId;
  maxPlayers: number;
}

export interface Credentials {
  playerId: string;
  token: string;
}

export type Ack<T> = (response: { ok: true; data: T } | { ok: false; error: Localized }) => void;

export interface ClientToServerEvents {
  'room:create': (payload: { name: string }, ack: Ack<{ room: RoomView } & Credentials>) => void;
  'room:join': (payload: { code: string; name: string }, ack: Ack<{ room: RoomView } & Credentials>) => void;
  'room:resume': (payload: { code: string } & Credentials, ack: Ack<{ room: RoomView }>) => void;
  'room:addBot': (payload: Record<string, never>, ack: Ack<{ room: RoomView }>) => void;
  'room:removePlayer': (payload: { playerId: string }, ack: Ack<{ room: RoomView }>) => void;
  'room:difficulty': (payload: { difficulty: BotDifficulty }, ack: Ack<{ room: RoomView }>) => void;
  'room:pack': (payload: { pack: PackId }, ack: Ack<{ room: RoomView }>) => void;
  'room:start': (payload: Record<string, never>, ack: Ack<{ room: RoomView }>) => void;
  'room:rematch': (payload: Record<string, never>, ack: Ack<{ room: RoomView }>) => void;
  'room:leave': (payload: Record<string, never>, ack: Ack<Record<string, never>>) => void;
  'game:action': (payload: { action: Action }, ack: Ack<Record<string, never>>) => void;
}

export interface ServerToClientEvents {
  'room:state': (room: RoomView) => void;
  'game:view': (view: PlayerView) => void;
  'game:over': (payload: { winnerId: string; winnerName: string }) => void;
  'toast': (payload: { message: Localized; kind: 'info' | 'error' }) => void;
}

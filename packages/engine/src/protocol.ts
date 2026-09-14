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

/**
 * Tiempos de turno que se pueden elegir en la sala. Por debajo de veinte
 * segundos no da tiempo a leer la mesa; por encima del minuto, el resto se
 * cansa de esperar.
 */
export const TURN_LIMITS_MS: readonly number[] = [20_000, 30_000, 45_000, 60_000];

export interface RoomView {
  code: string;
  players: RoomPlayer[];
  hostId: string;
  status: 'lobby' | 'playing' | 'finished';
  difficulty: BotDifficulty;
  /** Paquete elegido en la sala; la partida arranca con el. */
  pack: PackId;
  /** Lo que dura el turno de una persona; se elige en la sala. */
  turnLimitMs: number;
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
  'room:turnLimit': (payload: { ms: number }, ack: Ack<{ room: RoomView }>) => void;
  'room:start': (payload: Record<string, never>, ack: Ack<{ room: RoomView }>) => void;
  /** Al acabar, la mesa vuelve a la sala: ahi se cambia paquete, bots o tiempo. */
  'room:reopen': (payload: Record<string, never>, ack: Ack<{ room: RoomView }>) => void;
  'room:leave': (payload: Record<string, never>, ack: Ack<Record<string, never>>) => void;
  'game:action': (payload: { action: Action }, ack: Ack<Record<string, never>>) => void;
}

export interface ServerToClientEvents {
  'room:state': (room: RoomView) => void;
  'game:view': (view: PlayerView) => void;
  'game:over': (payload: { winnerId: string; winnerName: string }) => void;
  'toast': (payload: { message: Localized; kind: 'info' | 'error' }) => void;
}

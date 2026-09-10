import { randomBytes } from 'node:crypto';

import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  applyAction,
  botDisplayName,
  chooseBotAction,
  createGame,
  randomSeed,
  setConnected,
  toPlayerView,
} from '@contagio/engine';
import type { Action, BotDifficulty, GameState, PlayerView, RoomView } from '@contagio/engine';

export interface RoomMember {
  id: string;
  name: string;
  token: string;
  isBot: boolean;
  /** socket.id del jugador humano conectado, o null. */
  socketId: string | null;
}

/**
 * Milisegundos que "piensa" un bot antes de jugar. Es tiempo de lectura, no de
 * calculo: la mesa tiene que dar tiempo a ver que carta cayo y sobre que organo.
 * Ajustable con BOT_DELAY_MS por si se quiere una partida mas agil.
 */
const BOT_DELAY_MS = Number(process.env.BOT_DELAY_MS ?? 3000);
/** Pausa extra tras el reparto inicial, mientras el cliente anima las cartas. */
const OPENING_DELAY_MS = Number(process.env.OPENING_DELAY_MS ?? 4200);
/** Tiempo antes de que un bot cubra el turno de un humano desconectado. */
const ABANDON_DELAY_MS = 8000;

export type RoomBroadcast = {
  room: (room: RoomView) => void;
  view: (socketId: string, view: PlayerView) => void;
  gameOver: (payload: { winnerId: string; winnerName: string }) => void;
};

export class Room {
  readonly code: string;
  members: RoomMember[] = [];
  hostId = '';
  state: GameState | null = null;
  difficulty: BotDifficulty = 'normal';
  private botTimer: NodeJS.Timeout | null = null;
  private botSeed = randomSeed();

  constructor(code: string, private readonly broadcast: RoomBroadcast) {
    this.code = code;
  }

  get status(): RoomView['status'] {
    if (!this.state) return 'lobby';
    return this.state.phase === 'finished' ? 'finished' : 'playing';
  }

  get isEmpty(): boolean {
    return this.members.every((m) => m.isBot || m.socketId === null);
  }

  view(): RoomView {
    return {
      code: this.code,
      hostId: this.hostId,
      status: this.status,
      difficulty: this.difficulty,
      maxPlayers: MAX_PLAYERS,
      players: this.members.map((m) => ({
        id: m.id,
        name: m.name,
        isBot: m.isBot,
        connected: m.isBot || m.socketId !== null,
        isHost: m.id === this.hostId,
      })),
    };
  }

  addHuman(name: string, socketId: string): RoomMember {
    const member: RoomMember = {
      id: `p_${randomBytes(6).toString('hex')}`,
      name: name.trim().slice(0, 18) || 'Anonimo',
      token: randomBytes(16).toString('hex'),
      isBot: false,
      socketId,
    };
    this.members.push(member);
    if (!this.hostId) this.hostId = member.id;
    return member;
  }

  addBot(): RoomMember {
    const botCount = this.members.filter((m) => m.isBot).length;
    const member: RoomMember = {
      id: `bot_${randomBytes(4).toString('hex')}`,
      name: botDisplayName(botCount),
      token: '',
      isBot: true,
      socketId: null,
    };
    this.members.push(member);
    return member;
  }

  remove(playerId: string): void {
    this.members = this.members.filter((m) => m.id !== playerId);
    if (this.hostId === playerId) {
      this.hostId = this.members.find((m) => !m.isBot)?.id ?? '';
    }
  }

  findByToken(playerId: string, token: string): RoomMember | undefined {
    return this.members.find((m) => m.id === playerId && m.token === token && token !== '');
  }

  memberBySocket(socketId: string): RoomMember | undefined {
    return this.members.find((m) => m.socketId === socketId);
  }

  start(): { ok: boolean; error?: string } {
    if (this.members.length < MIN_PLAYERS) return { ok: false, error: `Hacen falta al menos ${MIN_PLAYERS} jugadores` };
    if (this.members.length > MAX_PLAYERS) return { ok: false, error: `El maximo son ${MAX_PLAYERS} jugadores` };
    this.state = createGame(
      this.members.map((m) => ({ id: m.id, name: m.name, isBot: m.isBot })),
      randomSeed(),
    );
    this.pushState();
    this.scheduleAutoTurn();
    return { ok: true };
  }

  /** Nueva partida con los mismos jugadores. */
  rematch(): { ok: boolean; error?: string } {
    this.clearTimer();
    this.state = null;
    return this.start();
  }

  handleAction(playerId: string, action: Action): { ok: boolean; error?: string } {
    if (!this.state) return { ok: false, error: 'La partida no ha empezado' };
    const result = applyAction(this.state, playerId, action);
    if (!result.ok) return { ok: false, error: result.error };
    this.state = result.state;
    this.pushState();
    this.announceWinner();
    this.scheduleAutoTurn();
    return { ok: true };
  }

  setConnection(playerId: string, socketId: string | null): void {
    const member = this.members.find((m) => m.id === playerId);
    if (!member) return;
    member.socketId = socketId;
    if (this.state) this.state = setConnected(this.state, playerId, socketId !== null);
    this.pushState();
    this.scheduleAutoTurn();
  }

  pushState(): void {
    this.broadcast.room(this.view());
    if (!this.state) return;
    for (const member of this.members) {
      if (!member.socketId) continue;
      this.broadcast.view(member.socketId, toPlayerView(this.state, member.id));
    }
  }

  private announceWinner(): void {
    if (this.state?.phase !== 'finished' || !this.state.winnerId) return;
    const winner = this.members.find((m) => m.id === this.state!.winnerId);
    this.broadcast.gameOver({ winnerId: this.state.winnerId, winnerName: winner?.name ?? 'Alguien' });
  }

  /**
   * Programa el turno automatico: lo juega un bot, o un humano desconectado
   * pasado un margen para que le de tiempo a volver.
   */
  private scheduleAutoTurn(): void {
    this.clearTimer();
    if (!this.state || this.state.phase !== 'playing') return;

    const active = this.state.players[this.state.turn];
    if (!active) return;
    const member = this.members.find((m) => m.id === active.id);
    if (!member) return;

    const isAuto = member.isBot || member.socketId === null;
    if (!isAuto) return;

    // El primer turno espera al reparto animado del cliente.
    const opening = this.state.turnCount <= 1 ? OPENING_DELAY_MS : 0;
    const delay = (member.isBot ? BOT_DELAY_MS : ABANDON_DELAY_MS) + opening;
    this.botTimer = setTimeout(() => this.playAutoTurn(active.id), delay);
  }

  private playAutoTurn(playerId: string): void {
    this.botTimer = null;
    if (!this.state || this.state.phase !== 'playing') return;
    if (this.state.players[this.state.turn]?.id !== playerId) return;

    this.botSeed = (this.botSeed + 0x9e3779b9) | 0;
    const choice = chooseBotAction(this.state, playerId, this.difficulty, this.botSeed);
    if (!choice) return;

    const result = applyAction(this.state, playerId, choice.action);
    if (!result.ok) return;
    this.state = result.state;
    this.pushState();
    this.announceWinner();
    this.scheduleAutoTurn();
  }

  clearTimer(): void {
    if (this.botTimer) clearTimeout(this.botTimer);
    this.botTimer = null;
  }
}

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode(taken: Set<string>): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += ROOM_CODE_ALPHABET[Math.floor(Math.random() * ROOM_CODE_ALPHABET.length)];
    }
    if (!taken.has(code)) return code;
  }
  return randomBytes(3).toString('hex').toUpperCase();
}

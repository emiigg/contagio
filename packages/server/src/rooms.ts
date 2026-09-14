import { randomBytes } from 'node:crypto';

import {
  DEFAULT_PACK,
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
import type { Action, BotDifficulty, GameState, Localized, PackId, PlayerView, RoomView } from '@contagio/engine';
import { MSG } from './messages.js';

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
const BOT_DELAY_MS = Number(process.env.BOT_DELAY_MS ?? 4500);
/** Pausa extra tras el reparto inicial, mientras el cliente anima las cartas. */
const OPENING_DELAY_MS = Number(process.env.OPENING_DELAY_MS ?? 4200);
/** Tiempo antes de que un bot cubra el turno de un humano desconectado. */
const ABANDON_DELAY_MS = 8000;
/**
 * Lo que dura el turno de una persona. Pasado ese tiempo la mesa juega por
 * ella con la misma heuristica que los bots: una partida en tiempo real no
 * puede quedarse parada porque alguien se levante a por un cafe. Veinte
 * segundos: con un minuto, el resto de la mesa se cansaba de esperar.
 */
const TURN_LIMIT_MS = Number(process.env.TURN_LIMIT_MS ?? 20_000);

export type RoomBroadcast = {
  room: (room: RoomView) => void;
  view: (socketId: string, view: PlayerView) => void;
  gameOver: (payload: { winnerId: string; winnerName: string }) => void;
  toast: (socketId: string, message: Localized) => void;
};

export class Room {
  readonly code: string;
  members: RoomMember[] = [];
  hostId = '';
  state: GameState | null = null;
  difficulty: BotDifficulty = 'normal';
  pack: PackId = DEFAULT_PACK;
  private botTimer: NodeJS.Timeout | null = null;
  private botSeed = randomSeed();
  /** Cuando vence el turno en curso, si es de una persona. */
  private turnDeadline: number | null = null;
  /** Numera los relojes: el cliente reinicia el aro cuando cambia. */
  private clockId = 0;

  constructor(code: string, private readonly broadcast: RoomBroadcast) {
    this.code = code;
  }

  get status(): RoomView['status'] {
    if (!this.state) return 'lobby';
    return this.state.phase === 'finished' ? 'finished' : 'playing';
  }

  /** Nadie humano conectado: la sala solo se sostiene por si alguien vuelve. */
  get isEmpty(): boolean {
    return this.members.every((m) => m.isBot || m.socketId === null);
  }

  /** No queda ni el asiento de un humano: no hay nada a lo que volver. */
  get isAbandoned(): boolean {
    return this.members.every((m) => m.isBot);
  }

  view(): RoomView {
    return {
      code: this.code,
      hostId: this.hostId,
      status: this.status,
      difficulty: this.difficulty,
      pack: this.pack,
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

  start(): { ok: boolean; error?: Localized } {
    if (this.members.length < MIN_PLAYERS) return { ok: false, error: MSG.tooFew(MIN_PLAYERS) };
    if (this.members.length > MAX_PLAYERS) return { ok: false, error: MSG.tooMany(MAX_PLAYERS) };
    this.state = createGame(
      this.members.map((m) => ({ id: m.id, name: m.name, isBot: m.isBot })),
      randomSeed(),
      this.pack,
    );
    this.scheduleAutoTurn();
    this.pushState();
    return { ok: true };
  }

  /**
   * Devuelve la mesa a la sala en vez de repartir otra vez: ahi se cambia el
   * paquete, los bots o el tiempo sin tener que abrir una sala nueva. Quien se
   * fue durante la partida no vuelve con ella: en la sala no hay asientos
   * guardados, y dejarlo ocuparia un sitio que la partida siguiente jugaria
   * por el.
   */
  reopen(): { ok: boolean; error?: Localized } {
    if (this.status !== 'finished') return { ok: false, error: MSG.notOver };
    this.clearTimer();
    this.state = null;
    for (const member of this.members) {
      if (!member.isBot && member.socketId === null) this.remove(member.id);
    }
    this.pushState();
    return { ok: true };
  }

  handleAction(playerId: string, action: Action): { ok: boolean; error?: Localized } {
    if (!this.state) return { ok: false, error: MSG.notStarted };
    const result = applyAction(this.state, playerId, action);
    if (!result.ok) return { ok: false, error: MSG.invalidMove };
    this.state = result.state;
    this.scheduleAutoTurn();
    this.pushState();
    this.announceWinner();
    return { ok: true };
  }

  setConnection(playerId: string, socketId: string | null): void {
    const member = this.members.find((m) => m.id === playerId);
    if (!member) return;
    member.socketId = socketId;
    if (this.state) this.state = setConnected(this.state, playerId, socketId !== null);
    // Solo la conexion de quien juega mueve el reloj: si vuelve estrena turno entero,
    // si se va lo cubre un bot pasado el margen. Que otro recargue la pagina no
    // puede regalarle tiempo nuevo a quien esta jugando.
    if (this.state?.players[this.state.turn]?.id === playerId) this.scheduleAutoTurn();
    this.pushState();
  }

  pushState(): void {
    this.broadcast.room(this.view());
    if (!this.state) return;
    const clock = {
      msLeft: this.turnDeadline === null ? null : Math.max(0, this.turnDeadline - Date.now()),
      limitMs: TURN_LIMIT_MS,
      id: this.clockId,
    };
    for (const member of this.members) {
      if (!member.socketId) continue;
      this.broadcast.view(member.socketId, toPlayerView(this.state, member.id, clock));
    }
  }

  private announceWinner(): void {
    if (this.state?.phase !== 'finished' || !this.state.winnerId) return;
    const winner = this.members.find((m) => m.id === this.state!.winnerId);
    this.broadcast.gameOver({ winnerId: this.state.winnerId, winnerName: winner?.name ?? 'Alguien' });
  }

  /**
   * Programa el final del turno: lo juega un bot enseguida, un humano
   * desconectado pasado un margen para que le de tiempo a volver, y una persona
   * conectada al agotarse su tiempo. Solo ese tiempo se ensena como reloj.
   */
  private scheduleAutoTurn(): void {
    this.clearTimer();
    this.turnDeadline = null;
    if (!this.state || this.state.phase !== 'playing') return;

    const active = this.state.players[this.state.turn];
    if (!active) return;
    const member = this.members.find((m) => m.id === active.id);
    if (!member) return;

    // El primer turno espera al reparto animado del cliente.
    const opening = this.state.turnCount <= 1 ? OPENING_DELAY_MS : 0;
    const timed = !member.isBot && member.socketId !== null;
    const base = member.isBot ? BOT_DELAY_MS : timed ? TURN_LIMIT_MS : ABANDON_DELAY_MS;
    const delay = base + opening;

    if (timed) {
      this.turnDeadline = Date.now() + delay;
      this.clockId++;
    }
    this.botTimer = setTimeout(() => this.playAutoTurn(active.id, timed), delay);
  }

  private playAutoTurn(playerId: string, timedOut = false): void {
    this.botTimer = null;
    if (!this.state || this.state.phase !== 'playing') return;
    if (this.state.players[this.state.turn]?.id !== playerId) return;

    this.botSeed = (this.botSeed + 0x9e3779b9) | 0;
    const choice = chooseBotAction(this.state, playerId, this.difficulty, this.botSeed);
    if (!choice) return;

    const result = applyAction(this.state, playerId, choice.action);
    if (!result.ok) return;
    this.state = result.state;

    if (timedOut) {
      const socketId = this.members.find((m) => m.id === playerId)?.socketId;
      if (socketId) this.broadcast.toast(socketId, MSG.timedOut);
    }

    this.scheduleAutoTurn();
    this.pushState();
    this.announceWinner();
  }

  clearTimer(): void {
    if (this.botTimer) clearTimeout(this.botTimer);
    this.botTimer = null;
    this.turnDeadline = null;
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

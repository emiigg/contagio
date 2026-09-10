import { legalActions } from './legal.js';
import type { Action, Card, GamePhase, GameState, LogEntry, MoveSummary, OrganPile } from './types.js';

/** Lo que un jugador puede ver de otro: cuerpo completo, mano solo en numero. */
export interface PublicPlayer {
  id: string;
  name: string;
  isBot: boolean;
  connected: boolean;
  handCount: number;
  body: OrganPile[];
  healthyOrgans: number;
}

/**
 * Proyeccion del estado para un jugador. El servidor nunca envia las manos
 * ajenas: la vista es la unica forma en que el estado sale del motor.
 */
export interface PlayerView {
  players: PublicPlayer[];
  youId: string;
  hand: Card[];
  turnPlayerId: string;
  isYourTurn: boolean;
  deckCount: number;
  discardCount: number;
  topDiscard: Card | null;
  phase: GamePhase;
  winnerId: string | null;
  turnCount: number;
  log: LogEntry[];
  /** Ultima jugada resuelta, para anunciarla antes de seguir. */
  lastMove: MoveSummary | null;
  /** Jugadas validas ahora mismo; vacio si no es tu turno. */
  legalActions: Action[];
  /**
   * Reloj del turno. Milisegundos que le quedan a quien juega, o null si el
   * turno no se cronometra (los bots no necesitan reloj: van solos y rapido).
   */
  turnMsLeft: number | null;
  /** Duracion completa del turno, para saber cuanto se ha gastado ya. */
  turnLimitMs: number;
}

/** Lo que el motor no sabe: cuanto lleva pensando quien juega. */
export interface TurnClock {
  msLeft: number | null;
  limitMs: number;
}

export function toPlayerView(state: GameState, youId: string, clock: TurnClock = { msLeft: null, limitMs: 0 }): PlayerView {
  const turnPlayer = state.players[state.turn];
  const you = state.players.find((p) => p.id === youId);
  return {
    players: state.players.map((p) => ({
      id: p.id,
      name: p.name,
      isBot: p.isBot,
      connected: p.connected,
      handCount: p.hand.length,
      body: p.body,
      healthyOrgans: p.body.filter((pile) => pile.viruses.length === 0).length,
    })),
    youId,
    hand: you?.hand ?? [],
    turnPlayerId: turnPlayer?.id ?? '',
    isYourTurn: turnPlayer?.id === youId && state.phase === 'playing',
    deckCount: state.deck.length,
    discardCount: state.discard.length,
    topDiscard: state.discard[state.discard.length - 1] ?? null,
    phase: state.phase,
    winnerId: state.winnerId,
    turnCount: state.turnCount,
    log: state.log.slice(-40),
    lastMove: state.lastMove,
    legalActions: turnPlayer?.id === youId ? legalActions(state, youId) : [],
    turnMsLeft: state.phase === 'playing' ? clock.msLeft : null,
    turnLimitMs: clock.limitMs,
  };
}

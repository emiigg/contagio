import { legalActions } from './legal.js';
import type { Action, Card, GamePhase, GameState, LogEntry, OrganPile } from './types.js';

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
  /** Jugadas validas ahora mismo; vacio si no es tu turno. */
  legalActions: Action[];
}

export function toPlayerView(state: GameState, youId: string): PlayerView {
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
    legalActions: turnPlayer?.id === youId ? legalActions(state, youId) : [],
  };
}

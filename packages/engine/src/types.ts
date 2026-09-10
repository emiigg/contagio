/**
 * Contagio - modelo de dominio.
 *
 * El motor es puro: no conoce sockets, ni React, ni temporizadores.
 * Todo el flujo de una partida es (estado, accion) -> estado nuevo + eventos.
 */

/** Los cuatro colores de organo mas el comodin. */
export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'wild';

export const COLORS: Color[] = ['red', 'blue', 'green', 'yellow'];

export type CardKind = 'organ' | 'virus' | 'medicine' | 'treatment';

export type TreatmentKind =
  /** Intercambio quirurgico: dos jugadores cualesquiera cambian un organo. */
  | 'swap'
  /** Extraccion ilegal: robas un organo ajeno. */
  | 'steal'
  /** Brote: repartes tus virus entre organos libres ajenos. */
  | 'spread'
  /** Cuarentena: el resto de jugadores descarta su mano. */
  | 'quarantine'
  /** Negligencia medica: intercambias tu cuerpo entero con otro jugador. */
  | 'malpractice';

export interface Card {
  id: string;
  kind: CardKind;
  /** Presente en organos, virus y medicinas. */
  color?: Color;
  /** Presente solo en tratamientos. */
  treatment?: TreatmentKind;
}

/** Un organo en la mesa junto con lo que se le ha ido apilando encima. */
export interface OrganPile {
  organ: Card;
  viruses: Card[];
  medicines: Card[];
}

/** Estado visible de un organo, derivado de las cartas apiladas. */
export type OrganStatus = 'free' | 'infected' | 'vaccinated' | 'immunized';

export interface Player {
  id: string;
  name: string;
  isBot: boolean;
  connected: boolean;
  hand: Card[];
  body: OrganPile[];
}

export type GamePhase = 'playing' | 'finished';

export interface GameState {
  players: Player[];
  /** Indice del jugador al que le toca. */
  turn: number;
  deck: Card[];
  discard: Card[];
  phase: GamePhase;
  winnerId: string | null;
  /** Semilla del generador; avanza con cada numero consumido. */
  seed: number;
  turnCount: number;
  log: LogEntry[];
  lastMove: MoveSummary | null;
}

/**
 * Resumen publico de la ultima jugada. El cliente lo usa para anunciarla y
 * senalar los organos afectados antes de que la mesa cambie sola.
 */
export interface MoveSummary {
  /** Numero creciente: permite detectar una jugada nueva aunque se repita. */
  serial: number;
  playerId: string;
  playerName: string;
  /** 'START' es el sorteo de salida; el resto son jugadas de verdad. */
  kind: Action['type'] | 'START';
  /** Cartas que quedan a la vista: la jugada o las descartadas. */
  cards: Card[];
  /** Organos afectados, para resaltarlos un instante. */
  targets: OrganRef[];
  text: string;
}

export interface LogEntry {
  id: number;
  text: string;
  playerId?: string;
}

/** Referencia a un organo concreto sobre la mesa. */
export interface OrganRef {
  playerId: string;
  organId: string;
}

export interface SpreadMove {
  /** Organo propio infectado del que sale el virus. */
  fromOrganId: string;
  /** Organo ajeno libre que recibe el virus. */
  to: OrganRef;
}

export type Action =
  | { type: 'PLAY_ORGAN'; cardId: string }
  | { type: 'PLAY_VIRUS'; cardId: string; target: OrganRef }
  | { type: 'PLAY_MEDICINE'; cardId: string; target: OrganRef }
  | { type: 'PLAY_SWAP'; cardId: string; mine: OrganRef; theirs: OrganRef }
  | { type: 'PLAY_STEAL'; cardId: string; target: OrganRef }
  | { type: 'PLAY_SPREAD'; cardId: string; moves: SpreadMove[] }
  | { type: 'PLAY_QUARANTINE'; cardId: string }
  | { type: 'PLAY_MALPRACTICE'; cardId: string; targetPlayerId: string }
  | { type: 'DISCARD'; cardIds: string[] };

export type ActionType = Action['type'];

/** Resultado de aplicar una accion. */
export type ApplyResult =
  | { ok: true; state: GameState }
  | { ok: false; error: string };

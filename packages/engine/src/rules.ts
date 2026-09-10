import type { Card, Color, GameState, OrganPile, OrganRef, OrganStatus, Player } from './types.js';

/** Cuantos organos sanos hacen falta para ganar. */
export const ORGANS_TO_WIN = 4;
/** Cartas en mano al empezar el turno. */
export const HAND_SIZE = 3;

export function organStatus(pile: OrganPile): OrganStatus {
  if (pile.viruses.length > 0) return 'infected';
  if (pile.medicines.length >= 2) return 'immunized';
  if (pile.medicines.length === 1) return 'vaccinated';
  return 'free';
}

/** Sano = libre, vacunado o inmunizado (es decir, sin virus encima). */
export function isHealthy(pile: OrganPile): boolean {
  return pile.viruses.length === 0;
}

/** El comodin encaja con cualquier color; el resto solo consigo mismo. */
export function colorsMatch(a: Color | undefined, b: Color | undefined): boolean {
  if (!a || !b) return false;
  return a === 'wild' || b === 'wild' || a === b;
}

export function findPlayer(state: GameState, playerId: string): Player | undefined {
  return state.players.find((p) => p.id === playerId);
}

export function findPile(state: GameState, ref: OrganRef): OrganPile | undefined {
  return findPlayer(state, ref.playerId)?.body.find((p) => p.organ.id === ref.organId);
}

/** No se pueden tener dos organos del mismo color (el quimerico cuenta como color propio). */
export function canReceiveOrganColor(player: Player, color: Color, ignoreOrganId?: string): boolean {
  return !player.body.some((p) => p.organ.color === color && p.organ.id !== ignoreOrganId);
}

export function healthyOrganCount(player: Player): number {
  return player.body.filter(isHealthy).length;
}

export function hasWon(player: Player): boolean {
  return healthyOrganCount(player) >= ORGANS_TO_WIN;
}

export function cardById(hand: Card[], cardId: string): Card | undefined {
  return hand.find((c) => c.id === cardId);
}

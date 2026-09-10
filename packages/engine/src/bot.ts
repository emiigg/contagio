import { previewAction } from './engine.js';
import { legalActions } from './legal.js';
import { nextRandom } from './rng.js';
import { ORGANS_TO_WIN, findPlayer, healthyOrganCount, organStatus } from './rules.js';
import type { Action, GameState, Player } from './types.js';

export type BotDifficulty = 'easy' | 'normal' | 'hard';

/**
 * Heuristica de un ply: se puntua el estado resultante de cada jugada legal.
 * No hay busqueda en profundidad; con estas cartas la ventaja tactica esta casi
 * siempre en el turno inmediato (completar cuerpo, extirpar, inmunizar).
 */
function scoreState(state: GameState, botId: string): number {
  const me = findPlayer(state, botId);
  if (!me) return -Infinity;

  let score = 0;
  for (const pile of me.body) {
    switch (organStatus(pile)) {
      case 'immunized':
        score += 22;
        break;
      case 'vaccinated':
        score += 16;
        break;
      case 'free':
        score += 12;
        break;
      case 'infected':
        score += 3;
        break;
    }
  }
  const myHealthy = healthyOrganCount(me);
  if (myHealthy >= ORGANS_TO_WIN) score += 1000;
  // Progresion no lineal: el cuarto organo sano vale mas que el primero.
  score += myHealthy * myHealthy * 3;

  for (const rival of state.players) {
    if (rival.id === botId) continue;
    const healthy = healthyOrganCount(rival);
    if (healthy >= ORGANS_TO_WIN) score -= 1000;
    score -= healthy * healthy * 4;
    for (const pile of rival.body) {
      if (organStatus(pile) === 'immunized') score -= 6;
      if (organStatus(pile) === 'infected') score += 4;
    }
    score -= rival.hand.length * 0.5;
  }

  // Una mano viva vale algo: preferimos guardar cartas antes que malgastarlas.
  score += me.hand.length * 1.5;
  return score;
}

/** Ligera penalizacion a jugadas pasivas para que el bot no se atasque descartando. */
function actionBias(action: Action): number {
  if (action.type === 'DISCARD') return -6 - action.cardIds.length * 0.5;
  return 0;
}

export interface BotChoice {
  action: Action;
  score: number;
}

export function chooseBotAction(
  state: GameState,
  botId: string,
  difficulty: BotDifficulty = 'normal',
  seed = 1,
): BotChoice | null {
  const options = legalActions(state, botId);
  if (options.length === 0) return null;

  let rngSeed = seed;
  const rand = () => {
    const r = nextRandom(rngSeed);
    rngSeed = r.seed;
    return r.value;
  };

  const scored: BotChoice[] = options.map((action) => {
    const preview = previewAction(state, botId, action);
    const base = preview.ok ? scoreState(preview.state, botId) : -Infinity;
    const noise = difficulty === 'hard' ? rand() * 0.5 : rand() * 4;
    return { action, score: base + actionBias(action) + noise };
  });

  scored.sort((a, b) => b.score - a.score);

  if (difficulty === 'easy') {
    // Juega bien uno de cada tres turnos; el resto elige entre las jugadas medias.
    const pool = scored.slice(0, Math.max(1, Math.ceil(scored.length / 2)));
    const pick = pool[Math.floor(rand() * pool.length)] ?? scored[0]!;
    return rand() < 0.35 ? scored[0]! : pick;
  }

  return scored[0]!;
}

/** Nombres para los bots de una sala. */
export const BOT_NAMES = ['Dra. Nova', 'Enf. Quiroga', 'Dr. Pardo', 'Bio. Serra', 'Tec. Ibarra'];

export function botDisplayName(index: number): string {
  return BOT_NAMES[index % BOT_NAMES.length] ?? `Bot ${index + 1}`;
}

export function isBotPlayer(player: Player): boolean {
  return player.isBot || !player.connected;
}

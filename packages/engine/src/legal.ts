import {
  canReceiveOrganColor,
  colorsMatch,
  findPlayer,
  organStatus,
} from './rules.js';
import type { Action, GameState, OrganRef, Player, SpreadMove } from './types.js';

/** Todas las pilas de la mesa junto a su duenio. */
export function allPiles(state: GameState): { owner: Player; ref: OrganRef }[] {
  return state.players.flatMap((owner) =>
    owner.body.map((pile) => ({ owner, ref: { playerId: owner.id, organId: pile.organ.id } })),
  );
}

/** Reparto voraz de virus propios sobre organos libres rivales (carta Brote). */
export function greedySpread(state: GameState, player: Player): SpreadMove[] {
  const moves: SpreadMove[] = [];
  const used = new Set<string>();
  for (const source of player.body) {
    const virus = source.viruses[source.viruses.length - 1];
    if (!virus) continue;
    for (const { owner, ref } of allPiles(state)) {
      if (owner.id === player.id) continue;
      const key = `${ref.playerId}:${ref.organId}`;
      if (used.has(key)) continue;
      const pile = owner.body.find((p) => p.organ.id === ref.organId)!;
      if (organStatus(pile) !== 'free') continue;
      if (!colorsMatch(virus.color, pile.organ.color)) continue;
      used.add(key);
      moves.push({ fromOrganId: source.organ.id, to: ref });
      break;
    }
  }
  return moves;
}

/**
 * Enumera las jugadas legales del jugador en turno. Los intercambios se limitan
 * a los que le involucran (el motor admite cualquier par, pero ni la UI ni el
 * bot necesitan las 400+ combinaciones restantes).
 */
export function legalActions(state: GameState, playerId: string): Action[] {
  if (state.phase !== 'playing') return [];
  const player = findPlayer(state, playerId);
  if (!player || state.players[state.turn]?.id !== playerId) return [];

  const actions: Action[] = [];
  const piles = allPiles(state);

  for (const card of player.hand) {
    switch (card.kind) {
      case 'organ':
        if (canReceiveOrganColor(player, card.color!)) actions.push({ type: 'PLAY_ORGAN', cardId: card.id });
        break;

      case 'virus':
        for (const { owner, ref } of piles) {
          const pile = owner.body.find((p) => p.organ.id === ref.organId)!;
          const status = organStatus(pile);
          if (status === 'immunized') continue;
          const target = status === 'vaccinated' ? pile.medicines[pile.medicines.length - 1]!.color : pile.organ.color;
          if (!colorsMatch(card.color, target)) continue;
          actions.push({ type: 'PLAY_VIRUS', cardId: card.id, target: ref });
        }
        break;

      case 'medicine':
        for (const { owner, ref } of piles) {
          const pile = owner.body.find((p) => p.organ.id === ref.organId)!;
          const status = organStatus(pile);
          if (status === 'immunized') continue;
          const target = status === 'infected' ? pile.viruses[pile.viruses.length - 1]!.color : pile.organ.color;
          if (!colorsMatch(card.color, target)) continue;
          actions.push({ type: 'PLAY_MEDICINE', cardId: card.id, target: ref });
        }
        break;

      case 'treatment':
        switch (card.treatment) {
          case 'swap':
            for (const mine of player.body) {
              if (organStatus(mine) === 'immunized') continue;
              for (const { owner, ref } of piles) {
                if (owner.id === player.id) continue;
                const theirs = owner.body.find((p) => p.organ.id === ref.organId)!;
                if (organStatus(theirs) === 'immunized') continue;
                if (!canReceiveOrganColor(player, theirs.organ.color!, mine.organ.id)) continue;
                if (!canReceiveOrganColor(owner, mine.organ.color!, theirs.organ.id)) continue;
                actions.push({
                  type: 'PLAY_SWAP',
                  cardId: card.id,
                  mine: { playerId: player.id, organId: mine.organ.id },
                  theirs: ref,
                });
              }
            }
            break;

          case 'steal':
            for (const { owner, ref } of piles) {
              if (owner.id === player.id) continue;
              const pile = owner.body.find((p) => p.organ.id === ref.organId)!;
              if (organStatus(pile) === 'immunized') continue;
              if (!canReceiveOrganColor(player, pile.organ.color!)) continue;
              actions.push({ type: 'PLAY_STEAL', cardId: card.id, target: ref });
            }
            break;

          case 'spread': {
            const moves = greedySpread(state, player);
            if (moves.length > 0) actions.push({ type: 'PLAY_SPREAD', cardId: card.id, moves });
            break;
          }

          case 'quarantine':
            actions.push({ type: 'PLAY_QUARANTINE', cardId: card.id });
            break;

          case 'malpractice':
            for (const other of state.players) {
              if (other.id === player.id) continue;
              actions.push({ type: 'PLAY_MALPRACTICE', cardId: card.id, targetPlayerId: other.id });
            }
            break;
        }
        break;
    }
  }

  // Descartes: cualquier subconjunto no vacio de la mano (como maximo 3 cartas).
  const hand = player.hand;
  for (let mask = 1; mask < 1 << hand.length; mask++) {
    const cardIds = hand.filter((_, i) => mask & (1 << i)).map((c) => c.id);
    actions.push({ type: 'DISCARD', cardIds });
  }

  return actions;
}

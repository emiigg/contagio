import { buildDeck, cardName } from './cards.js';
import { DEFAULT_PACK, contract, fillTemplate, getPack, type PackId, type PackLine } from './packs.js';
import { nextRandom, shuffle } from './rng.js';
import {
  HAND_SIZE,
  cardById,
  canReceiveOrganColor,
  colorsMatch,
  findPile,
  findPlayer,
  hasWon,
  organStatus,
} from './rules.js';
import type { Action, ApplyResult, Card, GameState, OrganPile, OrganRef, Player } from './types.js';

export interface PlayerSeed {
  id: string;
  name: string;
  isBot?: boolean;
}

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

/** Reparte, baraja y deja la partida lista para el primer turno. */
export function createGame(seeds: PlayerSeed[], seed = 1, pack: PackId = DEFAULT_PACK): GameState {
  if (seeds.length < MIN_PLAYERS || seeds.length > MAX_PLAYERS) {
    throw new Error(`Contagio admite de ${MIN_PLAYERS} a ${MAX_PLAYERS} jugadores`);
  }
  const shuffled = shuffle(buildDeck(), seed);
  const deck = shuffled.items;

  const players: Player[] = seeds.map((s) => ({
    id: s.id,
    name: s.name,
    isBot: Boolean(s.isBot),
    connected: true,
    hand: [],
    body: [],
  }));

  for (let i = 0; i < HAND_SIZE; i++) {
    for (const player of players) {
      const card = deck.pop();
      if (card) player.hand.push(card);
    }
  }

  // Abrir la partida es ventaja, asi que no se la queda el anfitrion: sale por
  // sorteo con la misma semilla que baraja, y la mesa lo anuncia antes de jugar.
  const draw = nextRandom(shuffled.seed);
  const turn = Math.floor(draw.value * players.length) % players.length;
  const opener = players[turn]!;

  const state: GameState = {
    pack,
    players,
    turn,
    deck,
    discard: [],
    phase: 'playing',
    winnerId: null,
    seed: draw.seed,
    turnCount: 1,
    log: [],
    lastMove: {
      serial: 1,
      playerId: opener.id,
      playerName: opener.name,
      kind: 'START',
      cards: [],
      targets: [],
      text: `El sorteo abre con ${opener.name}.`,
    },
  };
  pushLog(state, `Comienza la partida. Abre ${opener.name}.`, opener.id);
  return state;
}

function pushLog(state: GameState, text: string, playerId?: string): void {
  state.log.push({ id: state.log.length + 1, text, playerId });
  if (state.log.length > 200) state.log.splice(0, state.log.length - 200);
}

/** Registra la jugada en el log y la publica como ultimo movimiento visible. */
function logMove(
  state: GameState,
  player: Player,
  text: string,
  kind: Action['type'],
  cards: Card[],
  targets: OrganRef[] = [],
): void {
  pushLog(state, text, player.id);
  state.lastMove = {
    serial: (state.lastMove?.serial ?? 0) + 1,
    playerId: player.id,
    playerName: player.name,
    kind,
    cards,
    targets,
    text,
  };
}

function clone(state: GameState): GameState {
  return structuredClone(state);
}

function fail(error: string): ApplyResult {
  return { ok: false, error };
}

/** Al agotarse el mazo se voltea la pila de descartes, como en la mesa. */
function drawCard(state: GameState): Card | undefined {
  if (state.deck.length === 0) {
    if (state.discard.length === 0) return undefined;
    state.deck = state.discard.reverse();
    state.discard = [];
    pushLog(state, 'El mazo se agota: se voltea la pila de descartes.');
  }
  return state.deck.pop();
}

function drawUpToHandSize(state: GameState, player: Player): void {
  while (player.hand.length < HAND_SIZE) {
    const card = drawCard(state);
    if (!card) break;
    player.hand.push(card);
  }
}

function discardPile(state: GameState, pile: OrganPile): void {
  state.discard.push(pile.organ, ...pile.viruses, ...pile.medicines);
}

function removePile(player: Player, organId: string): void {
  const idx = player.body.findIndex((p) => p.organ.id === organId);
  if (idx >= 0) player.body.splice(idx, 1);
}

function takeCardFromHand(player: Player, cardId: string): Card | undefined {
  const idx = player.hand.findIndex((c) => c.id === cardId);
  if (idx < 0) return undefined;
  return player.hand.splice(idx, 1)[0];
}

function currentPlayer(state: GameState): Player {
  return state.players[state.turn]!;
}

function nameOf(state: GameState, playerId: string): string {
  return findPlayer(state, playerId)?.name ?? '?';
}

/** "su Corazon" cuando el organo es del propio jugador, "la Fresa de X" si no. */
function organPhrase(state: GameState, actor: Player, ownerId: string, organ: Card): string {
  const { name, art } = getPack(state.pack).organs[organ.color!];
  return ownerId === actor.id ? `su ${name}` : `${art} ${name} de ${nameOf(state, ownerId)}`;
}

/**
 * Frase del registro en el vocabulario del paquete. Carta y organo entran
 * primero y se contraen ("de el" -> "del"); los nombres de jugador llegan
 * despues, para que un nombre cualquiera no se contraiga por accidente.
 */
function say(state: GameState, line: PackLine, names: Record<string, string>, details: Record<string, string | number> = {}): string {
  return fillTemplate(contract(fillTemplate(getPack(state.pack).lines[line], details)), names);
}

/**
 * Cierra el turno: el jugador roba hasta 3, se comprueba la victoria y se pasa
 * el turno. Si alguien empieza sin cartas (efecto de Cuarentena) solo roba.
 */
function endTurn(state: GameState): void {
  const player = currentPlayer(state);
  drawUpToHandSize(state, player);

  const winner = state.players.find(hasWon);
  if (winner) {
    state.phase = 'finished';
    state.winnerId = winner.id;
    pushLog(state, say(state, 'win', { p: winner.name }), winner.id);
    return;
  }

  // Salta a quien se quedo sin mano: roba una nueva y pierde el turno (Cuarentena).
  // Si nadie puede jugar porque no quedan cartas en ningun sitio, la partida se
  // cierra por organos sanos en lugar de quedarse bloqueada.
  for (let guard = 0; guard < state.players.length; guard++) {
    state.turn = (state.turn + 1) % state.players.length;
    state.turnCount++;
    const next = currentPlayer(state);

    if (next.hand.length === 0) {
      if (state.deck.length + state.discard.length > 0) {
        drawUpToHandSize(state, next);
        pushLog(state, `${next.name} se queda sin cartas: roba mano nueva y pierde el turno.`, next.id);
        continue;
      }
      continue; // Sin cartas y sin mazo: este jugador ya no puede actuar.
    }

    pushLog(state, `Turno de ${next.name}.`, next.id);
    return;
  }

  finishByOrganCount(state);
}

/** Cierre por agotamiento: gana quien mas organos sanos tenga; si hay empate, nadie. */
function finishByOrganCount(state: GameState): void {
  state.phase = 'finished';
  const ranked = state.players
    .map((p) => ({ player: p, healthy: p.body.filter((pile) => pile.viruses.length === 0).length }))
    .sort((a, b) => b.healthy - a.healthy);

  const best = ranked[0];
  const tied = ranked.filter((r) => r.healthy === best?.healthy).length > 1;
  state.winnerId = best && !tied ? best.player.id : null;
  const { words } = getPack(state.pack);
  pushLog(
    state,
    tied || !best
      ? 'Se acaban las cartas y nadie tiene ventaja: la partida queda en tablas.'
      : `Se acaban las cartas. Gana ${best.player.name} con ${best.healthy} ${words.organs} ${words.healthy}.`,
    state.winnerId ?? undefined,
  );
}

/** Punto de entrada unico del motor. Nunca muta el estado recibido. */
export function applyAction(prev: GameState, playerId: string, action: Action): ApplyResult {
  if (prev.phase !== 'playing') return fail('La partida ya ha terminado');
  if (prev.players[prev.turn]?.id !== playerId) return fail('No es tu turno');

  const state = clone(prev);
  const player = currentPlayer(state);

  const result = resolve(state, player, action);
  if (!result.ok) return result;

  endTurn(state);
  return { ok: true, state };
}

function resolve(state: GameState, player: Player, action: Action): ApplyResult {
  switch (action.type) {
    case 'DISCARD':
      return resolveDiscard(state, player, action.cardIds);
    case 'PLAY_ORGAN':
      return resolvePlayOrgan(state, player, action.cardId);
    case 'PLAY_VIRUS':
      return resolvePlayVirus(state, player, action.cardId, action.target);
    case 'PLAY_MEDICINE':
      return resolvePlayMedicine(state, player, action.cardId, action.target);
    case 'PLAY_SWAP':
      return resolveSwap(state, player, action.cardId, action.mine, action.theirs);
    case 'PLAY_STEAL':
      return resolveSteal(state, player, action.cardId, action.target);
    case 'PLAY_SPREAD':
      return resolveSpread(state, player, action.cardId, action.moves);
    case 'PLAY_QUARANTINE':
      return resolveQuarantine(state, player, action.cardId);
    case 'PLAY_MALPRACTICE':
      return resolveMalpractice(state, player, action.cardId, action.targetPlayerId);
    default:
      return fail('Accion desconocida');
  }
}

function resolveDiscard(state: GameState, player: Player, cardIds: string[]): ApplyResult {
  if (cardIds.length === 0) return fail('Debes descartar al menos una carta');
  const unique = new Set(cardIds);
  if (unique.size !== cardIds.length) return fail('Cartas repetidas en el descarte');
  if (cardIds.some((id) => !cardById(player.hand, id))) return fail('No tienes esa carta');

  const dropped: Card[] = [];
  for (const id of cardIds) {
    const card = takeCardFromHand(player, id);
    if (!card) continue;
    dropped.push(card);
    state.discard.push(card);
  }
  const plural = dropped.length === 1 ? 'carta' : 'cartas';
  logMove(state, player, `${player.name} descarta ${dropped.length} ${plural}.`, 'DISCARD', dropped);
  return { ok: true, state };
}

function resolvePlayOrgan(state: GameState, player: Player, cardId: string): ApplyResult {
  const card = cardById(player.hand, cardId);
  if (!card || card.kind !== 'organ') return fail('Esa carta no es un organo');
  if (!canReceiveOrganColor(player, card.color!)) return fail('Ya tienes un organo de ese color');

  takeCardFromHand(player, cardId);
  player.body.push({ organ: card, viruses: [], medicines: [] });
  logMove(state, player, say(state, 'place', { p: player.name }, { card: cardName(card, state.pack) }), 'PLAY_ORGAN', [card], [
    { playerId: player.id, organId: card.id },
  ]);
  return { ok: true, state };
}

function resolvePlayVirus(state: GameState, player: Player, cardId: string, target: OrganRef): ApplyResult {
  const card = cardById(player.hand, cardId);
  if (!card || card.kind !== 'virus') return fail('Esa carta no es un virus');
  const pile = findPile(state, target);
  if (!pile) return fail('Ese organo no existe');

  const status = organStatus(pile);
  if (status === 'immunized') return fail('Ese organo esta inmunizado');

  if (status === 'vaccinated') {
    // El virus destruye la vacuna: ambas cartas al descarte.
    const medicine = pile.medicines[pile.medicines.length - 1]!;
    if (!colorsMatch(card.color, medicine.color)) return fail('El virus no coincide con el color de la vacuna');
    pile.medicines.pop();
    takeCardFromHand(player, cardId);
    state.discard.push(card, medicine);
    logMove(
      state,
      player,
      say(state, 'breakShield', { p: player.name }, { organ: organPhrase(state, player, target.playerId, pile.organ) }),
      'PLAY_VIRUS',
      [card, medicine],
      [target],
    );
    return { ok: true, state };
  }

  if (!colorsMatch(card.color, pile.organ.color)) return fail('El virus no coincide con el color del organo');
  takeCardFromHand(player, cardId);

  if (status === 'infected') {
    // Segundo virus: el organo se extirpa y las tres cartas se descartan.
    pile.viruses.push(card);
    const owner = findPlayer(state, target.playerId)!;
    discardPile(state, pile);
    removePile(owner, target.organId);
    logMove(
      state,
      player,
      say(state, 'remove', { p: player.name }, { organ: organPhrase(state, player, owner.id, pile.organ) }),
      'PLAY_VIRUS',
      [card, pile.organ],
      [target],
    );
    return { ok: true, state };
  }

  pile.viruses.push(card);
  logMove(
    state,
    player,
    say(state, 'infect', { p: player.name }, { organ: organPhrase(state, player, target.playerId, pile.organ) }),
    'PLAY_VIRUS',
    [card],
    [target],
  );
  return { ok: true, state };
}

function resolvePlayMedicine(state: GameState, player: Player, cardId: string, target: OrganRef): ApplyResult {
  const card = cardById(player.hand, cardId);
  if (!card || card.kind !== 'medicine') return fail('Esa carta no es una medicina');
  const pile = findPile(state, target);
  if (!pile) return fail('Ese organo no existe');

  const status = organStatus(pile);
  if (status === 'immunized') return fail('Ese organo ya esta inmunizado');

  if (status === 'infected') {
    const virus = pile.viruses[pile.viruses.length - 1]!;
    if (!colorsMatch(card.color, virus.color)) return fail('La medicina no coincide con el color del virus');
    pile.viruses.pop();
    takeCardFromHand(player, cardId);
    state.discard.push(card, virus);
    logMove(
      state,
      player,
      say(state, 'cure', { p: player.name }, { organ: organPhrase(state, player, target.playerId, pile.organ) }),
      'PLAY_MEDICINE',
      [card, virus],
      [target],
    );
    return { ok: true, state };
  }

  if (!colorsMatch(card.color, pile.organ.color)) return fail('La medicina no coincide con el color del organo');
  takeCardFromHand(player, cardId);
  pile.medicines.push(card);
  const line = status === 'vaccinated' ? 'immunize' : 'vaccinate';
  logMove(
    state,
    player,
    say(state, line, { p: player.name }, { organ: organPhrase(state, player, target.playerId, pile.organ) }),
    'PLAY_MEDICINE',
    [card],
    [target],
  );
  return { ok: true, state };
}

function requireTreatment(player: Player, cardId: string, kind: string): Card | null {
  const card = cardById(player.hand, cardId);
  if (!card || card.kind !== 'treatment' || card.treatment !== kind) return null;
  return card;
}

function resolveSwap(state: GameState, player: Player, cardId: string, mine: OrganRef, theirs: OrganRef): ApplyResult {
  const card = requireTreatment(player, cardId, 'swap');
  if (!card) return fail('Esa carta no es un intercambio quirurgico');
  if (mine.playerId === theirs.playerId) return fail('Los organos deben ser de jugadores distintos');

  const a = findPlayer(state, mine.playerId);
  const b = findPlayer(state, theirs.playerId);
  const pileA = findPile(state, mine);
  const pileB = findPile(state, theirs);
  if (!a || !b || !pileA || !pileB) return fail('Organo no encontrado');
  if (organStatus(pileA) === 'immunized' || organStatus(pileB) === 'immunized') {
    return fail('No se pueden intercambiar organos inmunizados');
  }
  if (!canReceiveOrganColor(a, pileB.organ.color!, pileA.organ.id)) return fail(`${a.name} ya tiene ese color`);
  if (!canReceiveOrganColor(b, pileA.organ.color!, pileB.organ.id)) return fail(`${b.name} ya tiene ese color`);

  takeCardFromHand(player, cardId);
  state.discard.push(card);
  const idxA = a.body.findIndex((p) => p.organ.id === pileA.organ.id);
  const idxB = b.body.findIndex((p) => p.organ.id === pileB.organ.id);
  a.body[idxA] = pileB;
  b.body[idxB] = pileA;
  logMove(
    state,
    player,
    `${player.name} cambia ${cardName(pileA.organ, state.pack)} de ${a.name} por ${cardName(pileB.organ, state.pack)} de ${b.name}.`,
    'PLAY_SWAP',
    [card],
    [mine, theirs],
  );
  return { ok: true, state };
}

function resolveSteal(state: GameState, player: Player, cardId: string, target: OrganRef): ApplyResult {
  const card = requireTreatment(player, cardId, 'steal');
  if (!card) return fail('Esa carta no es una extraccion ilegal');
  if (target.playerId === player.id) return fail('No puedes robarte a ti mismo');

  const victim = findPlayer(state, target.playerId);
  const pile = findPile(state, target);
  if (!victim || !pile) return fail('Organo no encontrado');
  if (organStatus(pile) === 'immunized') return fail('No puedes robar un organo inmunizado');
  if (!canReceiveOrganColor(player, pile.organ.color!)) return fail('Ya tienes un organo de ese color');

  takeCardFromHand(player, cardId);
  state.discard.push(card);
  removePile(victim, pile.organ.id);
  player.body.push(pile);
  logMove(state, player, `${player.name} roba ${cardName(pile.organ, state.pack)} a ${victim.name}.`, 'PLAY_STEAL', [card], [
    { playerId: player.id, organId: pile.organ.id },
  ]);
  return { ok: true, state };
}

function resolveSpread(
  state: GameState,
  player: Player,
  cardId: string,
  moves: { fromOrganId: string; to: OrganRef }[],
): ApplyResult {
  const card = requireTreatment(player, cardId, 'spread');
  if (!card) return fail('Esa carta no es un brote');
  if (moves.length === 0) return fail('Debes trasladar al menos un virus');

  const seenFrom = new Set<string>();
  const seenTo = new Set<string>();
  for (const move of moves) {
    if (seenFrom.has(move.fromOrganId)) return fail('Cada organo infectado solo puede ceder un virus');
    if (seenTo.has(`${move.to.playerId}:${move.to.organId}`)) return fail('Cada organo destino solo recibe un virus');
    seenFrom.add(move.fromOrganId);
    seenTo.add(`${move.to.playerId}:${move.to.organId}`);

    const source = player.body.find((p) => p.organ.id === move.fromOrganId);
    if (!source || source.viruses.length === 0) return fail('Ese organo tuyo no esta infectado');
    if (move.to.playerId === player.id) return fail('El brote solo afecta a tus rivales');
    const dest = findPile(state, move.to);
    if (!dest) return fail('Organo destino no encontrado');
    if (organStatus(dest) !== 'free') return fail('Solo puedes contagiar organos libres');
    if (!colorsMatch(source.viruses[source.viruses.length - 1]!.color, dest.organ.color)) {
      return fail('El virus no coincide con el color del organo destino');
    }
  }

  takeCardFromHand(player, cardId);
  state.discard.push(card);
  for (const move of moves) {
    const source = player.body.find((p) => p.organ.id === move.fromOrganId)!;
    const dest = findPile(state, move.to)!;
    dest.viruses.push(source.viruses.pop()!);
  }
  const { words } = getPack(state.pack);
  logMove(
    state,
    player,
    say(state, 'spread', { p: player.name }, { n: moves.length, threats: moves.length === 1 ? words.threat : words.threats }),
    'PLAY_SPREAD',
    [card],
    moves.map((m) => m.to),
  );
  return { ok: true, state };
}

function resolveQuarantine(state: GameState, player: Player, cardId: string): ApplyResult {
  const card = requireTreatment(player, cardId, 'quarantine');
  if (!card) return fail('Esa carta no es una cuarentena');

  takeCardFromHand(player, cardId);
  state.discard.push(card);
  for (const other of state.players) {
    if (other.id === player.id) continue;
    state.discard.push(...other.hand);
    other.hand = [];
  }
  logMove(
    state,
    player,
    say(state, 'quarantine', { p: player.name }),
    'PLAY_QUARANTINE',
    [card],
  );
  return { ok: true, state };
}

function resolveMalpractice(state: GameState, player: Player, cardId: string, targetPlayerId: string): ApplyResult {
  const card = requireTreatment(player, cardId, 'malpractice');
  if (!card) return fail('Esa carta no es una negligencia medica');
  if (targetPlayerId === player.id) return fail('Elige a otro jugador');
  const victim = findPlayer(state, targetPlayerId);
  if (!victim) return fail('Jugador no encontrado');

  takeCardFromHand(player, cardId);
  state.discard.push(card);
  const mine = player.body;
  player.body = victim.body;
  victim.body = mine;
  logMove(
    state,
    player,
    say(state, 'malpractice', { p: player.name, victim: victim.name }),
    'PLAY_MALPRACTICE',
    [card],
    victim.body.concat(player.body).map((pile) => ({ playerId: player.id, organId: pile.organ.id })),
  );
  return { ok: true, state };
}

/**
 * Aplica una accion sin cerrar el turno (sin robar ni pasar). La usan los bots
 * para puntuar jugadas candidatas sin introducir azar en la simulacion.
 */
export function previewAction(prev: GameState, playerId: string, action: Action): ApplyResult {
  if (prev.phase !== 'playing') return fail('La partida ya ha terminado');
  if (prev.players[prev.turn]?.id !== playerId) return fail('No es tu turno');
  const state = clone(prev);
  return resolve(state, currentPlayer(state), action);
}

/** Marca a un jugador desconectado; su turno lo resolvera el bot del servidor. */
export function setConnected(state: GameState, playerId: string, connected: boolean): GameState {
  const next = clone(state);
  const player = findPlayer(next, playerId);
  if (player) player.connected = connected;
  return next;
}

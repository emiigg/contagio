import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildDeck, cardName } from '../src/cards.js';
import { applyAction, createGame } from '../src/engine.js';
import { legalActions } from '../src/legal.js';
import { chooseBotAction } from '../src/bot.js';
import { LANGS } from '../src/lang.js';
import { PACKS, PACK_IDS, fillTemplate, getPack } from '../src/packs.js';
import { organStatus } from '../src/rules.js';
import { toPlayerView } from '../src/view.js';
import type { Card, Color, GameState, TreatmentKind } from '../src/types.js';

// --- utilidades de test -----------------------------------------------------

let uid = 0;
const organ = (color: Color): Card => ({ id: `o${uid++}`, kind: 'organ', color });
const virus = (color: Color): Card => ({ id: `v${uid++}`, kind: 'virus', color });
const medicine = (color: Color): Card => ({ id: `m${uid++}`, kind: 'medicine', color });
const treatment = (t: TreatmentKind): Card => ({ id: `t${uid++}`, kind: 'treatment', treatment: t });

/** Partida controlada: manos vacias y mazo fijo para que nada dependa del azar. */
function scenario(playerCount = 2): GameState {
  const state = createGame(
    Array.from({ length: playerCount }, (_, i) => ({ id: `p${i}`, name: `J${i + 1}` })),
    42,
  );
  for (const p of state.players) {
    state.discard.push(...p.hand);
    p.hand = [];
  }
  // El sorteo de salida es aleatorio; aqui los turnos se dirigen a mano.
  state.turn = 0;
  return state;
}

function give(state: GameState, playerIndex: number, ...cards: Card[]): void {
  state.players[playerIndex]!.hand.push(...cards);
}

function putOrgan(state: GameState, playerIndex: number, card: Card, viruses: Card[] = [], medicines: Card[] = []): void {
  state.players[playerIndex]!.body.push({ organ: card, viruses, medicines });
}

function expectOk(result: ReturnType<typeof applyAction>): GameState {
  assert.equal(result.ok, true, result.ok ? '' : result.error);
  return (result as { ok: true; state: GameState }).state;
}

function expectFail(result: ReturnType<typeof applyAction>): string {
  assert.equal(result.ok, false, 'se esperaba un error');
  return (result as { ok: false; error: string }).error;
}

// --- mazo -------------------------------------------------------------------

test('el mazo tiene 68 cartas con la composicion esperada', () => {
  const deck = buildDeck();
  assert.equal(deck.length, 68);
  assert.equal(deck.filter((c) => c.kind === 'organ').length, 21);
  assert.equal(deck.filter((c) => c.kind === 'virus').length, 17);
  assert.equal(deck.filter((c) => c.kind === 'medicine').length, 20);
  assert.equal(deck.filter((c) => c.kind === 'treatment').length, 10);
  assert.equal(new Set(deck.map((c) => c.id)).size, 68);
});

test('el reparto inicial da 3 cartas a cada jugador', () => {
  const state = createGame([
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
    { id: 'c', name: 'C' },
  ]);
  assert.deepEqual(state.players.map((p) => p.hand.length), [3, 3, 3]);
  assert.equal(state.deck.length, 68 - 9);
});

// --- organos ----------------------------------------------------------------

test('no se pueden tener dos organos del mismo color', () => {
  const state = scenario();
  const first = organ('red');
  putOrgan(state, 0, first);
  give(state, 0, organ('red'));
  const error = expectFail(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: state.players[0]!.hand[0]!.id }));
  assert.match(error, /ese color/i);
});

test('el organo quimerico convive con los cuatro colores', () => {
  const state = scenario();
  for (const c of ['red', 'blue', 'green', 'yellow'] as Color[]) putOrgan(state, 0, organ(c));
  give(state, 0, organ('wild'));
  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: state.players[0]!.hand[0]!.id }));
  assert.equal(next.players[0]!.body.length, 5);
});

// --- virus y medicinas ------------------------------------------------------

test('un virus infecta un organo libre del mismo color', () => {
  const state = scenario();
  const target = organ('green');
  putOrgan(state, 1, target);
  const v = virus('green');
  give(state, 0, v);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: v.id, target: { playerId: 'p1', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[1]!.body[0]!), 'infected');
});

test('el segundo virus extirpa el organo y manda las tres cartas al descarte', () => {
  const state = scenario();
  const target = organ('blue');
  putOrgan(state, 1, target, [virus('blue')]);
  const v = virus('blue');
  give(state, 0, v);
  const before = state.discard.length;
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: v.id, target: { playerId: 'p1', organId: target.id } }),
  );
  assert.equal(next.players[1]!.body.length, 0);
  assert.equal(next.discard.length, before + 3);
});

test('un virus destruye la vacuna en lugar de infectar', () => {
  const state = scenario();
  const target = organ('yellow');
  putOrgan(state, 1, target, [], [medicine('yellow')]);
  const v = virus('yellow');
  give(state, 0, v);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: v.id, target: { playerId: 'p1', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[1]!.body[0]!), 'free');
});

test('un organo inmunizado es intocable', () => {
  const state = scenario();
  const target = organ('red');
  putOrgan(state, 1, target, [], [medicine('red'), medicine('red')]);
  const v = virus('red');
  const t = treatment('steal');
  give(state, 0, v, t);
  assert.match(
    expectFail(applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: v.id, target: { playerId: 'p1', organId: target.id } })),
    /inmunizado/i,
  );
  assert.match(
    expectFail(applyAction(state, 'p0', { type: 'PLAY_STEAL', cardId: t.id, target: { playerId: 'p1', organId: target.id } })),
    /inmunizado/i,
  );
});

test('la medicina cura, vacuna e inmuniza segun el estado del organo', () => {
  const state = scenario();
  const target = organ('green');
  putOrgan(state, 0, target, [virus('green')]);
  const cure = medicine('green');
  give(state, 0, cure, medicine('green'), medicine('green'));

  let next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_MEDICINE', cardId: cure.id, target: { playerId: 'p0', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[0]!.body[0]!), 'free');

  next.turn = 0;
  const second = next.players[0]!.hand.find((c) => c.kind === 'medicine')!;
  next = expectOk(
    applyAction(next, 'p0', { type: 'PLAY_MEDICINE', cardId: second.id, target: { playerId: 'p0', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[0]!.body[0]!), 'vaccinated');

  next.turn = 0;
  const third = next.players[0]!.hand.find((c) => c.kind === 'medicine')!;
  next = expectOk(
    applyAction(next, 'p0', { type: 'PLAY_MEDICINE', cardId: third.id, target: { playerId: 'p0', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[0]!.body[0]!), 'immunized');
});

test('los comodines encajan con cualquier color', () => {
  const state = scenario();
  const target = organ('blue');
  putOrgan(state, 1, target);
  const v = virus('wild');
  give(state, 0, v);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: v.id, target: { playerId: 'p1', organId: target.id } }),
  );
  assert.equal(organStatus(next.players[1]!.body[0]!), 'infected');

  next.turn = 1;
  const cure = medicine('wild');
  next.players[1]!.hand.push(cure);
  const healed = expectOk(
    applyAction(next, 'p1', { type: 'PLAY_MEDICINE', cardId: cure.id, target: { playerId: 'p1', organId: target.id } }),
  );
  assert.equal(organStatus(healed.players[1]!.body[0]!), 'free');
});

// --- tratamientos -----------------------------------------------------------

test('el intercambio quirurgico respeta colores repetidos', () => {
  const state = scenario();
  const mine = organ('red');
  const theirs = organ('blue');
  putOrgan(state, 0, mine);
  putOrgan(state, 0, organ('blue'));
  putOrgan(state, 1, theirs);
  const t = treatment('swap');
  give(state, 0, t);
  assert.match(
    expectFail(
      applyAction(state, 'p0', {
        type: 'PLAY_SWAP',
        cardId: t.id,
        mine: { playerId: 'p0', organId: mine.id },
        theirs: { playerId: 'p1', organId: theirs.id },
      }),
    ),
    /ya tiene ese color/i,
  );
});

test('el intercambio quirurgico mueve los organos con lo que llevan encima', () => {
  const state = scenario();
  const mine = organ('red');
  const theirs = organ('blue');
  putOrgan(state, 0, mine, [virus('red')]);
  putOrgan(state, 1, theirs, [], [medicine('blue')]);
  const t = treatment('swap');
  give(state, 0, t);
  const next = expectOk(
    applyAction(state, 'p0', {
      type: 'PLAY_SWAP',
      cardId: t.id,
      mine: { playerId: 'p0', organId: mine.id },
      theirs: { playerId: 'p1', organId: theirs.id },
    }),
  );
  assert.equal(next.players[0]!.body[0]!.organ.id, theirs.id);
  assert.equal(organStatus(next.players[0]!.body[0]!), 'vaccinated');
  assert.equal(next.players[1]!.body[0]!.organ.id, mine.id);
  assert.equal(organStatus(next.players[1]!.body[0]!), 'infected');
});

test('el brote reparte virus propios sobre organos libres rivales', () => {
  const state = scenario(3);
  const mine = organ('red');
  const a = organ('red');
  const b = organ('green');
  putOrgan(state, 0, mine, [virus('red')]);
  putOrgan(state, 1, a);
  putOrgan(state, 2, b);
  const t = treatment('spread');
  give(state, 0, t);
  const next = expectOk(
    applyAction(state, 'p0', {
      type: 'PLAY_SPREAD',
      cardId: t.id,
      moves: [{ fromOrganId: mine.id, to: { playerId: 'p1', organId: a.id } }],
    }),
  );
  assert.equal(organStatus(next.players[0]!.body[0]!), 'free');
  assert.equal(organStatus(next.players[1]!.body[0]!), 'infected');
});

test('el brote no puede apuntar a organos vacunados', () => {
  const state = scenario();
  const mine = organ('red');
  const theirs = organ('red');
  putOrgan(state, 0, mine, [virus('red')]);
  putOrgan(state, 1, theirs, [], [medicine('red')]);
  const t = treatment('spread');
  give(state, 0, t);
  assert.match(
    expectFail(
      applyAction(state, 'p0', {
        type: 'PLAY_SPREAD',
        cardId: t.id,
        moves: [{ fromOrganId: mine.id, to: { playerId: 'p1', organId: theirs.id } }],
      }),
    ),
    /libres/i,
  );
});

test('la cuarentena vacia la mano de los rivales y les hace perder el turno', () => {
  const state = scenario(3);
  const t = treatment('quarantine');
  give(state, 0, t);
  give(state, 1, organ('red'), organ('blue'), organ('green'));
  give(state, 2, organ('red'), organ('blue'), organ('green'));
  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_QUARANTINE', cardId: t.id }));
  // p1 y p2 roban mano nueva y pierden el turno: vuelve a tocarle a p0.
  assert.equal(next.players[1]!.hand.length, 3);
  assert.equal(next.players[2]!.hand.length, 3);
  assert.equal(next.players[next.turn]!.id, 'p0');
});

test('la negligencia medica intercambia cuerpos completos, inmunizados incluidos', () => {
  const state = scenario();
  const mine = organ('red');
  const theirs = organ('blue');
  putOrgan(state, 0, mine);
  putOrgan(state, 1, theirs, [], [medicine('blue'), medicine('blue')]);
  const t = treatment('malpractice');
  give(state, 0, t);
  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_MALPRACTICE', cardId: t.id, targetPlayerId: 'p1' }));
  assert.equal(next.players[0]!.body[0]!.organ.id, theirs.id);
  assert.equal(next.players[1]!.body[0]!.organ.id, mine.id);
});

// --- fin de partida ---------------------------------------------------------

test('cuatro organos sanos ganan la partida', () => {
  const state = scenario();
  putOrgan(state, 0, organ('red'));
  putOrgan(state, 0, organ('blue'), [], [medicine('blue')]);
  putOrgan(state, 0, organ('green'), [], [medicine('green'), medicine('green')]);
  const last = organ('yellow');
  give(state, 0, last);
  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: last.id }));
  assert.equal(next.phase, 'finished');
  assert.equal(next.winnerId, 'p0');
});

test('un organo infectado no cuenta como sano', () => {
  const state = scenario();
  putOrgan(state, 0, organ('red'), [virus('red')]);
  putOrgan(state, 0, organ('blue'));
  putOrgan(state, 0, organ('green'));
  const last = organ('yellow');
  give(state, 0, last);
  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: last.id }));
  assert.equal(next.phase, 'playing');
});

// --- turnos e integracion ---------------------------------------------------

test('solo puede actuar el jugador en turno', () => {
  const state = scenario();
  give(state, 1, organ('red'));
  assert.match(expectFail(applyAction(state, 'p1', { type: 'PLAY_ORGAN', cardId: state.players[1]!.hand[0]!.id })), /turno/i);
});

test('la salida se sortea y queda anunciada', () => {
  const seeds = [
    { id: 'p0', name: 'A' },
    { id: 'p1', name: 'B' },
    { id: 'p2', name: 'C' },
  ];
  const openers = new Set<string>();
  for (let seed = 1; seed <= 40; seed++) {
    const state = createGame(seeds, seed);
    const opener = state.players[state.turn]!;
    openers.add(opener.id);
    assert.equal(state.lastMove?.kind, 'START');
    assert.equal(state.lastMove?.playerId, opener.id);
    assert.match(state.lastMove!.text.es, new RegExp(opener.name + '\\.$'));
    assert.match(state.lastMove!.text.en, new RegExp(`${opener.name} to open\\.$`));
  }
  // Con cuarenta semillas los tres asientos tienen que haber abierto alguna vez.
  assert.equal(openers.size, 3);
});

test('tras jugar se roba hasta tener tres cartas', () => {
  const state = createGame([
    { id: 'p0', name: 'A' },
    { id: 'p1', name: 'B' },
  ]);
  state.turn = 0;
  const next = expectOk(applyAction(state, 'p0', { type: 'DISCARD', cardIds: [state.players[0]!.hand[0]!.id] }));
  assert.equal(next.players[0]!.hand.length, 3);
});

test('una partida entre bots termina con ganador y estado consistente', () => {
  let state = createGame(
    [
      { id: 'p0', name: 'Bot 1', isBot: true },
      { id: 'p1', name: 'Bot 2', isBot: true },
      { id: 'p2', name: 'Bot 3', isBot: true },
    ],
    7,
  );
  let turns = 0;
  while (state.phase === 'playing' && turns < 800) {
    const active = state.players[state.turn]!;
    const choice = chooseBotAction(state, active.id, 'normal', turns + 1);
    assert.ok(choice, 'el bot siempre debe encontrar una jugada legal');
    const result = applyAction(state, active.id, choice.action);
    assert.equal(result.ok, true, result.ok ? '' : result.error);
    state = (result as { ok: true; state: GameState }).state;

    // Invariante: ninguna carta se pierde ni se duplica.
    const total =
      state.deck.length +
      state.discard.length +
      state.players.reduce(
        (sum, p) => sum + p.hand.length + p.body.reduce((s, pile) => s + 1 + pile.viruses.length + pile.medicines.length, 0),
        0,
      );
    assert.equal(total, 68, `contador de cartas incorrecto en el turno ${turns}`);
    turns++;
  }
  assert.equal(state.phase, 'finished');
  assert.ok(state.winnerId);
});

test('legalActions no propone jugadas que el motor rechace', () => {
  let state = createGame(
    [
      { id: 'p0', name: 'A', isBot: true },
      { id: 'p1', name: 'B', isBot: true },
    ],
    11,
  );
  for (let i = 0; i < 60 && state.phase === 'playing'; i++) {
    const active = state.players[state.turn]!;
    for (const action of legalActions(state, active.id)) {
      const result = applyAction(state, active.id, action);
      assert.equal(result.ok, true, result.ok ? '' : `${action.type}: ${result.error}`);
    }
    const choice = chooseBotAction(state, active.id, 'normal', i + 1)!;
    state = (applyAction(state, active.id, choice.action) as { ok: true; state: GameState }).state;
  }
});

test('sin cartas en ningun sitio la partida se cierra por organos sanos', () => {
  const state = scenario();
  state.deck = [];
  state.discard = [];
  putOrgan(state, 0, organ('red'));
  putOrgan(state, 0, organ('blue'));
  putOrgan(state, 1, organ('green'));
  const last = organ('yellow');
  give(state, 0, last);
  state.players[1]!.hand = [];

  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: last.id }));
  assert.equal(next.phase, 'finished');
  assert.equal(next.winnerId, 'p0');
});

test('un empate sin cartas no proclama ganador', () => {
  const state = scenario();
  state.deck = [];
  state.discard = [];
  putOrgan(state, 0, organ('red'));
  putOrgan(state, 1, organ('green'));
  putOrgan(state, 1, organ('blue'));
  const extra = organ('blue');
  give(state, 0, extra);
  state.players[1]!.hand = [];

  const next = expectOk(applyAction(state, 'p0', { type: 'PLAY_ORGAN', cardId: extra.id }));
  assert.equal(next.phase, 'finished');
  assert.equal(next.winnerId, null);
});

// --- paquetes ---------------------------------------------------------------

/** Todas las cadenas de un paquete, para revisarlas de una vez. */
function packStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') return Object.values(value).flatMap(packStrings);
  return [];
}

test('cada paquete da nombre propio a las 20 cartas distintas del mazo, en cada idioma', () => {
  for (const id of PACK_IDS) {
    for (const lang of LANGS) {
      const names = new Set(buildDeck().map((card) => cardName(card, id, lang)));
      assert.equal(names.size, 20, `${id}/${lang}: ${[...names].join(', ')}`);
    }
  }
});

test('los textos van sin tildes en espanol, en ASCII en ingles, y no dejan huecos sin rellenar', () => {
  const values = { p: 'Ana', card: 'Carta', organ: 'su Carta', n: 2, threats: 'amenazas', victim: 'Luis' };
  for (const id of PACK_IDS) {
    for (const text of packStrings(PACKS[id])) {
      assert.doesNotMatch(text, /[áéíóúüñ¿¡]/i, `${id}: "${text}"`);
    }
    // Sin comillas tipograficas ni rayas: el mismo criterio que el espanol sin tildes.
    for (const text of packStrings(getPack(id, 'en'))) {
      assert.doesNotMatch(text, /[^\x20-\x7e]/, `${id}/en: "${text}"`);
    }
    for (const lang of LANGS) {
      for (const line of Object.values(getPack(id, lang).lines)) {
        assert.doesNotMatch(fillTemplate(line, values), /[{}]/, `${id}/${lang}: ${line}`);
      }
    }
  }
});

test('cada paquete tiene version inglesa y cada plantilla pide los mismos huecos en los dos idiomas', () => {
  const holes = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
  const templates = (pack: ReturnType<typeof getPack>) => ({ ...pack.lines, ...pack.buttons, ...pack.ending });
  for (const id of PACK_IDS) {
    const es = templates(getPack(id, 'es'));
    const en = templates(getPack(id, 'en'));
    assert.notEqual(getPack(id, 'en'), getPack(id, 'es'), `${id} sin traducir`);
    for (const key of Object.keys(es) as (keyof typeof es)[]) {
      assert.equal(holes(en[key]), holes(es[key]), `${id}.${String(key)}: "${en[key]}" frente a "${es[key]}"`);
    }
  }
});

test('la partida guarda su paquete y la vista lo publica', () => {
  const seeds = [
    { id: 'a', name: 'A' },
    { id: 'b', name: 'B' },
  ];
  assert.equal(createGame(seeds).pack, 'contagio');
  const state = createGame(seeds, 3, 'frutas');
  assert.equal(state.pack, 'frutas');
  assert.equal(toPlayerView(state, 'a').pack, 'frutas');
});

test('el registro cuenta la jugada con el vocabulario del paquete', () => {
  const state = scenario();
  state.pack = 'heroes';
  const bat = organ('yellow');
  putOrgan(state, 1, bat);
  const joker = virus('yellow');
  give(state, 0, joker);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: joker.id, target: { playerId: 'p1', organId: bat.id } }),
  );
  assert.equal(next.lastMove?.text.es, 'J1 captura al Batman de J2.');
  assert.match(next.lastMove?.text.en ?? '', /J2's Batman/);
});

test('las frases contraen el articulo como en el habla', () => {
  const state = scenario();
  const heart = organ('red');
  putOrgan(state, 1, heart, [], [medicine('red')]);
  const strain = virus('red');
  give(state, 0, strain);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_VIRUS', cardId: strain.id, target: { playerId: 'p1', organId: heart.id } }),
  );
  assert.equal(next.lastMove?.text.es, 'J1 destruye la vacuna del Corazon de J2.');
  // En ingles no hay articulo que contraer: el dueno va en genitivo.
  assert.equal(next.lastMove?.text.en, "J1 destroys the vaccine on J2's Heart.");
});

test('el organo propio se cuenta como suyo en los dos idiomas', () => {
  const state = scenario();
  const heart = organ('red');
  putOrgan(state, 0, heart, [virus('red')]);
  const cure = medicine('red');
  give(state, 0, cure);
  const next = expectOk(
    applyAction(state, 'p0', { type: 'PLAY_MEDICINE', cardId: cure.id, target: { playerId: 'p0', organId: heart.id } }),
  );
  assert.equal(next.lastMove?.text.es, 'J1 cura su Corazon.');
  assert.equal(next.lastMove?.text.en, 'J1 cures their Heart.');
  const up = next.players[next.turn]!.name;
  assert.equal(next.log.at(-1)?.text.es, `Turno de ${up}.`);
  assert.equal(next.log.at(-1)?.text.en, `${up}'s turn.`);
});

test('un paquete desconocido cae en Contagio en vez de dejar cartas sin nombre', () => {
  assert.equal(getPack('inventado').id, 'contagio');
  assert.equal(getPack(undefined).id, 'contagio');
  assert.equal(getPack('inventado', 'en').name, 'Contagio');
  const state = scenario();
  (state as { pack: string }).pack = 'inventado';
  assert.equal(toPlayerView(state, 'p0').pack, 'contagio');
  assert.equal(cardName(organ('red'), state.pack), 'Corazon');
});

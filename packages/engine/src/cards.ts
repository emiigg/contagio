import { DEFAULT_LANG, type Lang } from './lang.js';
import { getPack, type PackId } from './packs.js';
import type { Card, TreatmentKind } from './types.js';
import { COLORS } from './types.js';

/**
 * Composicion del mazo: 68 cartas.
 *   21 organos    (5 de cada color + 1 quimerico)
 *   17 virus      (4 de cada color + 1 mutante)
 *   20 medicinas  (4 de cada color + 4 universales)
 *   10 tratamientos
 */
export const DECK_COMPOSITION = {
  organsPerColor: 5,
  wildOrgans: 1,
  virusesPerColor: 4,
  wildViruses: 1,
  medicinesPerColor: 4,
  wildMedicines: 4,
  treatments: { swap: 3, steal: 3, spread: 2, quarantine: 1, malpractice: 1 } as Record<TreatmentKind, number>,
};

/** El nombre de una carta depende del paquete; la carta en si es la misma en todos. */
export function cardName(card: Card, packId?: PackId, lang: Lang = DEFAULT_LANG): string {
  const pack = getPack(packId, lang);
  switch (card.kind) {
    case 'organ':
      return pack.organs[card.color!].name;
    case 'virus':
      return pack.viruses[card.color!];
    case 'medicine':
      return pack.medicines[card.color!];
    case 'treatment':
      return pack.treatments[card.treatment!].name;
  }
}

/** Que hace la carta, contado con el vocabulario del paquete. */
export function cardText(card: Card, packId?: PackId, lang: Lang = DEFAULT_LANG): string {
  const pack = getPack(packId, lang);
  return card.kind === 'treatment' ? pack.treatments[card.treatment!].text : pack.hints[card.kind];
}

/** Construye el mazo completo sin barajar; los ids son estables y unicos. */
export function buildDeck(): Card[] {
  const cards: Card[] = [];
  let n = 0;
  const push = (card: Omit<Card, 'id'>) => {
    cards.push({ ...card, id: `c${n++}` });
  };

  for (const color of COLORS) {
    for (let i = 0; i < DECK_COMPOSITION.organsPerColor; i++) push({ kind: 'organ', color });
    for (let i = 0; i < DECK_COMPOSITION.virusesPerColor; i++) push({ kind: 'virus', color });
    for (let i = 0; i < DECK_COMPOSITION.medicinesPerColor; i++) push({ kind: 'medicine', color });
  }
  for (let i = 0; i < DECK_COMPOSITION.wildOrgans; i++) push({ kind: 'organ', color: 'wild' });
  for (let i = 0; i < DECK_COMPOSITION.wildViruses; i++) push({ kind: 'virus', color: 'wild' });
  for (let i = 0; i < DECK_COMPOSITION.wildMedicines; i++) push({ kind: 'medicine', color: 'wild' });

  for (const [treatment, count] of Object.entries(DECK_COMPOSITION.treatments)) {
    for (let i = 0; i < count; i++) push({ kind: 'treatment', treatment: treatment as TreatmentKind });
  }
  return cards;
}

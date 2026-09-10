import type { Card, Color, TreatmentKind } from './types.js';
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

/** Nombres propios de Contagio: la mecanica es la del genero, los textos son nuestros. */
export const ORGAN_NAMES: Record<Color, string> = {
  red: 'Corazon',
  blue: 'Cerebro',
  green: 'Pulmon',
  yellow: 'Higado',
  wild: 'Organo quimerico',
};

export const VIRUS_NAMES: Record<Color, string> = {
  red: 'Cepa escarlata',
  blue: 'Cepa cobalto',
  green: 'Cepa esmeralda',
  yellow: 'Cepa ambar',
  wild: 'Cepa mutante',
};

export const MEDICINE_NAMES: Record<Color, string> = {
  red: 'Antidoto escarlata',
  blue: 'Antidoto cobalto',
  green: 'Antidoto esmeralda',
  yellow: 'Antidoto ambar',
  wild: 'Antidoto universal',
};

export const TREATMENT_NAMES: Record<TreatmentKind, string> = {
  swap: 'Intercambio quirurgico',
  steal: 'Extraccion ilegal',
  spread: 'Brote',
  quarantine: 'Cuarentena',
  malpractice: 'Negligencia medica',
};

export const TREATMENT_TEXT: Record<TreatmentKind, string> = {
  swap: 'Intercambia un organo tuyo por el de otro jugador. Ninguno de los dos puede estar inmunizado, ni provocar organos repetidos.',
  steal: 'Toma un organo de otro jugador y anadelo a tu cuerpo. No puedes robar organos inmunizados ni repetir color.',
  spread: 'Traslada virus de tus organos infectados a organos libres de tus rivales.',
  quarantine: 'Todos los rivales descartan su mano y pierden su siguiente turno robando de nuevo.',
  malpractice: 'Intercambias tu cuerpo entero con el de otro jugador, inmunizados incluidos.',
};

export function cardName(card: Card): string {
  switch (card.kind) {
    case 'organ':
      return ORGAN_NAMES[card.color!];
    case 'virus':
      return VIRUS_NAMES[card.color!];
    case 'medicine':
      return MEDICINE_NAMES[card.color!];
    case 'treatment':
      return TREATMENT_NAMES[card.treatment!];
  }
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

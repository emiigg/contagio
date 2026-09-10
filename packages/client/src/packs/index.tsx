import { createContext, useContext } from 'react';

import { DEFAULT_PACK, getPack } from '@contagio/engine';
import type { Card, Color, Pack, PackId } from '@contagio/engine';

import { arrecifeArt } from './arrecife';
import { asedioArt } from './asedio';
import { contagioArt } from './contagio';
import { cortafuegosArt } from './cortafuegos';
import { frutasArt } from './frutas';
import { heroesArt } from './heroes';
import { orbitaArt } from './orbita';
import type { PackArt } from './types';

export const PACK_ART: Record<PackId, PackArt> = {
  contagio: contagioArt,
  heroes: heroesArt,
  frutas: frutasArt,
  cortafuegos: cortafuegosArt,
  orbita: orbitaArt,
  asedio: asedioArt,
  arrecife: arrecifeArt,
};

/**
 * Paquete en uso. Lo fija App con el de la sala (o el de la partida, que manda
 * una vez repartido); fuera de una sala es Contagio.
 */
const PackContext = createContext<PackId>(DEFAULT_PACK);

export const PackProvider = PackContext.Provider;

export function usePack(): { id: PackId; text: Pack; art: PackArt } {
  const text = getPack(useContext(PackContext));
  return { id: text.id, text, art: PACK_ART[text.id] };
}

/** Devuelve la ilustracion que corresponde a una carta en el paquete en uso. */
export function CardGlyph({ card, className }: { card: Card; className?: string }) {
  const { art } = usePack();
  const Glyph =
    card.kind === 'organ'
      ? art.organs[card.color!]
      : card.kind === 'virus'
        ? art.virus
        : card.kind === 'medicine'
          ? art.medicine
          : art.treatments[card.treatment!];
  return <Glyph className={className} />;
}

/** Silueta tenue de un organo: marca el hueco que aun no has llenado. */
export function OrganSilhouette({ color, className }: { color: Color; className?: string }) {
  const Glyph = usePack().art.organs[color];
  return <Glyph className={className} />;
}

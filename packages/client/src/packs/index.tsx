import { createContext, useContext } from 'react';

import { DEFAULT_PACK, getPack } from '@contagio/engine';
import type { Card, Color, Lang, Pack, PackId } from '@contagio/engine';

import { useLang } from '../i18n';

import { arrecifeArt } from './arrecife';
import { asedioArt } from './asedio';
import { bandaArt } from './banda';
import { contagioArt } from './contagio';
import { cortafuegosArt } from './cortafuegos';
import { frutasArt } from './frutas';
import { grimorioArt } from './grimorio';
import { heroesArt } from './heroes';
import { jurasicoArt } from './jurasico';
import { marvelArt } from './marvel';
import { orbitaArt } from './orbita';
import { piratasArt } from './piratas';
import type { PackArt } from './types';

export const PACK_ART: Record<PackId, PackArt> = {
  contagio: contagioArt,
  heroes: heroesArt,
  marvel: marvelArt,
  frutas: frutasArt,
  cortafuegos: cortafuegosArt,
  orbita: orbitaArt,
  asedio: asedioArt,
  arrecife: arrecifeArt,
  grimorio: grimorioArt,
  jurasico: jurasicoArt,
  banda: bandaArt,
  piratas: piratasArt,
};

/**
 * Paquete en uso. Lo fija App con el de la sala (o el de la partida, que manda
 * una vez repartido); fuera de una sala es Contagio.
 */
const PackContext = createContext<PackId>(DEFAULT_PACK);

export const PackProvider = PackContext.Provider;

/** El paquete en uso, con sus textos en el idioma de quien juega. */
export function usePack(): { id: PackId; text: Pack; art: PackArt; lang: Lang } {
  const lang = useLang();
  const text = getPack(useContext(PackContext), lang);
  return { id: text.id, text, art: PACK_ART[text.id], lang };
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

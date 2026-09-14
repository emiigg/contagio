import type { PackId } from '@contagio/engine';

import { scenes as arrecife } from './arrecife';
import { scenes as asedio } from './asedio';
import { scenes as banda } from './banda';
import { scenes as contagio } from './contagio';
import { scenes as cortafuegos } from './cortafuegos';
import { scenes as frutas } from './frutas';
import { scenes as grimorio } from './grimorio';
import { scenes as heroes } from './heroes';
import { scenes as jurasico } from './jurasico';
import { scenes as marvel } from './marvel';
import { scenes as orbita } from './orbita';
import { scenes as piratas } from './piratas';
import { TieScene } from './tie';

/**
 * Escenas del telon de fin de partida. Cada paquete cuenta su final con sus
 * propios personajes, del color de su carta; las tablas son una sola escena,
 * la de la mesa. Record y no lista: un paquete nuevo no compila sin sus dos
 * escenas.
 */
interface Ending {
  win: () => JSX.Element;
  lose: () => JSX.Element;
}

const ENDINGS: Record<PackId, Ending> = {
  contagio,
  heroes,
  marvel,
  frutas,
  cortafuegos,
  orbita,
  asedio,
  arrecife,
  grimorio,
  jurasico,
  banda,
  piratas,
};

export function EndingScene({ pack, winnerId, youId }: { pack: PackId; winnerId: string | null; youId: string }) {
  const outcome = winnerId === null ? 'tie' : winnerId === youId ? 'win' : 'lose';
  const Scene = outcome === 'tie' ? TieScene : ENDINGS[pack][outcome];
  // data-outcome es para las herramientas de capturas: sin el no saben que final salio.
  return (
    <div className="curtain__art" data-outcome={outcome} aria-hidden>
      <Scene />
    </div>
  );
}

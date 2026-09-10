import { useEffect, useState } from 'react';

import { cardName } from '@contagio/engine';
import type { MoveSummary } from '@contagio/engine';

import { Mark } from '../art';
import { CardGlyph, usePack } from '../packs';

/**
 * Anuncia la ultima jugada en el centro de la mesa. Existe porque los turnos
 * ajenos se resuelven solos: sin este cartel, una carta aparece y desaparece
 * sin que nadie llegue a leer que ha pasado.
 */
interface AnnounceProps {
  move: MoveSummary | null;
  youId: string;
  holdMs?: number;
  /** Mientras se reparte: el cartel espera y su reloj no corre. */
  paused?: boolean;
}

export function Announce({ move, youId, holdMs = 3800, paused = false }: AnnounceProps) {
  const [shown, setShown] = useState<MoveSummary | null>(null);
  const { id: packId } = usePack();

  useEffect(() => {
    if (!move || paused) return;
    setShown(move);
    const timer = setTimeout(() => setShown(null), holdMs);
    return () => clearTimeout(timer);
  }, [move?.serial, holdMs, paused]);

  if (!shown || paused) return <div className="announce announce--empty" aria-hidden />;

  const mine = shown.playerId === youId;
  const start = shown.kind === 'START';
  return (
    <div className={`announce ${mine ? 'is-mine' : ''} ${start ? 'announce--start' : ''}`} role="status" aria-live="polite">
      {start && <Mark className="announce__mark" />}
      <div className="announce__cards">
        {shown.cards.slice(0, 3).map((card, index) => (
          <span key={card.id} className={`announce__card tone-${card.color ?? 'treatment'}`} style={{ '--i': index } as React.CSSProperties}>
            <CardGlyph card={card} className="announce__glyph" />
            <span className="announce__cardname">{cardName(card, packId)}</span>
          </span>
        ))}
      </div>
      <p className="announce__text">{shown.text}</p>
    </div>
  );
}

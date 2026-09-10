import { cardName, organStatus } from '@contagio/engine';
import type { OrganPile, OrganStatus } from '@contagio/engine';

import { CardGlyph, MedicineGlyph, VirusGlyph } from '../art';

const STAMP: Record<OrganStatus, string | null> = {
  free: null,
  infected: 'Infectado',
  vaccinated: 'Vacunado',
  immunized: 'Inmune',
};

interface OrganProps {
  pile: OrganPile;
  targetable?: boolean;
  selected?: boolean;
  /** Marca el organo que acaba de recibir una carta. */
  hit?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function Organ({ pile, targetable, selected, hit, onClick, compact }: OrganProps) {
  const status = organStatus(pile);
  const stamp = STAMP[status];
  const classes = [
    'organ',
    `tone-${pile.organ.color}`,
    `is-${status}`,
    targetable ? 'is-targetable' : '',
    selected ? 'is-selected' : '',
    hit ? 'is-hit' : '',
    compact ? 'organ--compact' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const label = `${cardName(pile.organ)}, ${stamp ? stamp.toLowerCase() : 'sano'}`;

  return (
    <button type="button" className={classes} onClick={onClick} disabled={!onClick} aria-label={label} title={label}>
      <CardGlyph card={pile.organ} className="organ__glyph" />
      {stamp && <span className={`organ__stamp organ__stamp--${status}`}>{stamp}</span>}
      <span className="organ__layers">
        {pile.viruses.map((virus) => (
          <span key={virus.id} className={`chip tone-${virus.color}`} title={cardName(virus)}>
            <VirusGlyph className="chip__glyph" />
          </span>
        ))}
        {pile.medicines.map((medicine) => (
          <span key={medicine.id} className={`chip tone-${medicine.color}`} title={cardName(medicine)}>
            <MedicineGlyph className="chip__glyph" />
          </span>
        ))}
      </span>
    </button>
  );
}

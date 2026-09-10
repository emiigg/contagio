import { cardName, organStatus } from '@contagio/engine';
import type { Color, OrganPile, OrganStatus } from '@contagio/engine';

import { CardGlyph, MedicineGlyph, OrganSilhouette, VirusGlyph } from '../art';

const SLOT_LABEL: Record<Color, string> = {
  red: 'Corazon',
  blue: 'Cerebro',
  green: 'Pulmon',
  yellow: 'Higado',
  wild: 'Organo quimerico',
};

/**
 * Hueco de un organo que todavia no esta en la mesa. Existe para que el cuerpo
 * de cada jugador ocupe siempre lo mismo: la mesa no salta al colocar cartas,
 * y de un vistazo se ve que le falta a cada uno.
 */
export function OrganSlot({ color, compact }: { color: Color; compact?: boolean }) {
  return (
    <span
      className={`slot tone-${color} ${compact ? 'slot--compact' : ''}`}
      title={`${SLOT_LABEL[color]}: sin colocar`}
      aria-label={`${SLOT_LABEL[color]} sin colocar`}
    >
      <OrganSilhouette color={color} className="slot__glyph" />
    </span>
  );
}

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

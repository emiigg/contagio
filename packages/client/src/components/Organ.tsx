import { cardName, organStatus } from '@contagio/engine';
import type { Color, OrganPile } from '@contagio/engine';

import { CardGlyph, OrganSilhouette, usePack } from '../packs';

/**
 * Hueco de un organo que todavia no esta en la mesa. Existe para que el cuerpo
 * de cada jugador ocupe siempre lo mismo: la mesa no salta al colocar cartas,
 * y de un vistazo se ve que le falta a cada uno.
 */
export function OrganSlot({
  color,
  compact,
  targetable,
  onClick,
}: {
  color: Color;
  compact?: boolean;
  /** El hueco acepta la carta elegida: se puede colocar aqui. */
  targetable?: boolean;
  onClick?: () => void;
}) {
  const label = usePack().text.organs[color].name;
  const className = `slot tone-${color} ${compact ? 'slot--compact' : ''} ${targetable ? 'is-targetable' : ''}`;
  const glyph = <OrganSilhouette color={color} className="slot__glyph" />;

  // Colocar un organo se hace como todo lo demas: eligiendo el sitio en la mesa.
  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        title={`Colocar aqui: ${label}`}
        aria-label={`Colocar ${label} en su hueco`}
      >
        {glyph}
      </button>
    );
  }

  return (
    <span className={className} title={`${label}: sin colocar`} aria-label={`${label} sin colocar`}>
      {glyph}
    </span>
  );
}

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
  const { id, text, art } = usePack();
  const status = organStatus(pile);
  const stamp = status === 'free' ? null : text.stamps[status];
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

  const label = `${cardName(pile.organ, id)}, ${stamp ? stamp.toLowerCase() : 'libre'}`;
  const Virus = art.virus;
  const Medicine = art.medicine;

  return (
    <button type="button" className={classes} onClick={onClick} disabled={!onClick} aria-label={label} title={label}>
      <CardGlyph card={pile.organ} className="organ__glyph" />
      {stamp && <span className={`organ__stamp organ__stamp--${status}`}>{stamp}</span>}
      <span className="organ__layers">
        {pile.viruses.map((virus) => (
          <span key={virus.id} className={`chip tone-${virus.color}`} title={cardName(virus, id)}>
            <Virus className="chip__glyph" />
          </span>
        ))}
        {pile.medicines.map((medicine) => (
          <span key={medicine.id} className={`chip tone-${medicine.color}`} title={cardName(medicine, id)}>
            <Medicine className="chip__glyph" />
          </span>
        ))}
      </span>
    </button>
  );
}

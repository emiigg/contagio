import { cardName } from '@contagio/engine';
import type { Card } from '@contagio/engine';

import { CardGlyph, usePack } from '../packs';

/**
 * Codigo de muestra: identifica la carta como una ficha de laboratorio. El
 * prefijo sale del tipo de carta en el paquete en uso (ORG, HER, FRU...).
 */
export function specimenCode(card: Card, kindLabel: string): string {
  return `${kindLabel.slice(0, 3).toUpperCase()}-${card.id.replace(/\D/g, '').padStart(3, '0')}`;
}

interface CardProps {
  card: Card;
  selected?: boolean;
  playable?: boolean;
  marked?: boolean;
  onClick?: () => void;
}

export function CardFace({ card, selected, playable, marked, onClick }: CardProps) {
  const { id, text, lang } = usePack();
  const color = card.color ?? 'treatment';
  const classes = [
    'card',
    `card--${card.kind}`,
    `tone-${color}`,
    selected ? 'is-selected' : '',
    playable ? 'is-playable' : 'is-idle',
    marked ? 'is-marked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} onClick={onClick} disabled={!onClick} aria-pressed={selected}>
      <span className="card__kind">{text.kinds[card.kind]}</span>
      <span className="card__art">
        <CardGlyph card={card} className="card__glyph" />
      </span>
      <span className="card__name">{cardName(card, id, lang)}</span>
      <span className="card__code">{specimenCode(card, text.kinds[card.kind])}</span>
    </button>
  );
}

import { TREATMENT_TEXT, cardName } from '@contagio/engine';
import type { Card } from '@contagio/engine';

import { CardGlyph } from '../art';

const KIND_LABEL: Record<Card['kind'], string> = {
  organ: 'Organo',
  virus: 'Virus',
  medicine: 'Medicina',
  treatment: 'Tratamiento',
};

const KIND_HINT: Record<Card['kind'], string> = {
  organ: 'Colocalo en tu cuerpo. Un color por cuerpo.',
  virus: 'Infecta un organo libre, extirpa uno infectado o rompe una vacuna.',
  medicine: 'Cura un virus, vacuna un organo libre o inmuniza uno vacunado.',
  treatment: '',
};

export function cardHint(card: Card): string {
  return card.kind === 'treatment' ? TREATMENT_TEXT[card.treatment!] : KIND_HINT[card.kind];
}

/** Codigo de muestra: identifica la carta como una ficha de laboratorio. */
export function specimenCode(card: Card): string {
  const prefix = card.kind === 'organ' ? 'ORG' : card.kind === 'virus' ? 'VIR' : card.kind === 'medicine' ? 'MED' : 'TRT';
  return `${prefix}-${card.id.replace(/\D/g, '').padStart(3, '0')}`;
}

interface CardProps {
  card: Card;
  selected?: boolean;
  playable?: boolean;
  marked?: boolean;
  onClick?: () => void;
}

export function CardFace({ card, selected, playable, marked, onClick }: CardProps) {
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
      <span className="card__kind">{KIND_LABEL[card.kind]}</span>
      <span className="card__art">
        <CardGlyph card={card} className="card__glyph" />
      </span>
      <span className="card__name">{cardName(card)}</span>
      <span className="card__code">{specimenCode(card)}</span>
    </button>
  );
}

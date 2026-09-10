import { Mark } from '../art';

/**
 * Reverso de carta: lo que se ve de las manos ajenas y de las cartas que
 * vuelan durante el reparto.
 */
export function CardBack({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`cardback ${className ?? ''}`} style={style} aria-hidden>
      <Mark className="cardback__emblem" />
    </span>
  );
}

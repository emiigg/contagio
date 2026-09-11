import { useEffect, useRef, useState } from 'react';

import { play } from '../sound';

const R = 14;
const CIRCUMFERENCE = 2 * Math.PI * R;
/**
 * Por debajo de esto el reloj se pone rojo y tu turno hace tic: queda poco y
 * hay que mirarlo. Con turnos de veinte segundos, diez seria medio turno sonando.
 */
const URGENT_S = 5;

/**
 * Reloj del turno: un aro que se gasta. Solo aparece cuando juega una persona,
 * porque es la unica que puede quedarse pensando; si llega a cero, la mesa
 * juega por ella y el aro desaparece con el turno.
 */
export function TurnClock({ msLeft, limitMs, ticking = false }: { msLeft: number; limitMs: number; ticking?: boolean }) {
  const [left, setLeft] = useState(msLeft);
  const tickedRef = useRef<number | null>(null);

  useEffect(() => {
    setLeft(msLeft);
    // El servidor manda lo que queda; a partir de ahi el aro corre solo, sin
    // pedirle la hora a nadie y sin depender de que los relojes coincidan.
    const end = Date.now() + msLeft;
    const timer = setInterval(() => setLeft(Math.max(0, end - Date.now())), 200);
    return () => clearInterval(timer);
  }, [msLeft]);

  // El primer turno lleva encima la espera del reparto; el reloj no ensena mas
  // segundos de los que dura un turno, que es lo que la gente cuenta.
  const seconds = Math.min(Math.ceil(left / 1000), Math.ceil(limitMs / 1000));
  const spent = limitMs > 0 ? Math.min(1, Math.max(0, left / limitMs)) : 0;

  // Los ultimos segundos de tu propio turno se oyen: el aro esta arriba y la
  // mirada, en la mano.
  useEffect(() => {
    if (!ticking || seconds > URGENT_S || seconds <= 0 || tickedRef.current === seconds) return;
    tickedRef.current = seconds;
    play('tick');
  }, [seconds, ticking]);

  return (
    <span
      className={`clock ${seconds <= URGENT_S ? 'is-urgent' : ''}`}
      role="timer"
      aria-label={`Quedan ${seconds} segundos de turno`}
    >
      <svg className="clock__dial" viewBox="0 0 34 34" aria-hidden>
        <circle className="clock__track" cx="17" cy="17" r={R} />
        <circle
          className="clock__sweep"
          cx="17"
          cy="17"
          r={R}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - spent)}
        />
      </svg>
      <span className="clock__num mono">{seconds}</span>
    </span>
  );
}

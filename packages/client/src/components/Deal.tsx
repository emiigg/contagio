import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { play } from '../sound';
import { CardBack } from './CardBack';

const SHUFFLE_MS = 1200;
/** Separacion entre carta y carta al repartir. */
const STEP_MS = 130;
const FLIGHT_MS = 520;
const SETTLE_MS = 620;

interface DealProps {
  /** Elemento donde se baraja y desde donde salen las cartas. */
  centerEl: HTMLElement | null;
  /** Hueco definitivo del mazo, a la izquierda de la mesa. */
  deckEl: HTMLElement | null;
  /** Destino de cada jugador, en orden de reparto. */
  seatEls: (HTMLElement | null)[];
  handSize: number;
  onDone: () => void;
}

interface Flight {
  id: string;
  dx: number;
  dy: number;
  rotate: number;
  delay: number;
}

function centerOf(el: HTMLElement | null): { x: number; y: number } | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * Reparto inicial: las cartas se barajan en el centro, salen una a una hacia
 * cada jugador y el mazo se retira despues a su sitio. Es solo presentacion;
 * el estado ya viene repartido del servidor.
 */
export function Deal({ centerEl, deckEl, seatEls, handSize, onDone }: DealProps) {
  const [phase, setPhase] = useState<'shuffle' | 'deal' | 'settle'>('shuffle');
  const [flying, setFlying] = useState(false);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [deckShift, setDeckShift] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const doneRef = useRef(false);
  const shuffledRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useLayoutEffect(() => {
    const from = centerOf(centerEl);
    const deck = centerOf(deckEl);
    setOrigin(from);
    if (from && deck) setDeckShift({ dx: deck.x - from.x, dy: deck.y - from.y });
  }, [centerEl, deckEl]);

  const flights = useMemo<Flight[]>(() => {
    const from = centerOf(centerEl);
    if (!from) return [];
    const list: Flight[] = [];
    for (let round = 0; round < handSize; round++) {
      seatEls.forEach((seat, index) => {
        const to = centerOf(seat);
        if (!to) return;
        list.push({
          id: `${round}-${index}`,
          dx: to.x - from.x,
          dy: to.y - from.y,
          rotate: (index - (seatEls.length - 1) / 2) * 9,
          delay: (round * seatEls.length + index) * STEP_MS,
        });
      });
    }
    return list;
  }, [centerEl, seatEls, handSize]);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || flights.length === 0) {
      finish();
      return;
    }

    const dealAt = SHUFFLE_MS;
    const lastFlight = dealAt + (flights[flights.length - 1]?.delay ?? 0) + FLIGHT_MS;

    // El barajado suena una vez aunque el efecto se monte dos (modo estricto).
    if (!shuffledRef.current) {
      shuffledRef.current = true;
      play('shuffle');
    }

    const timers = [
      setTimeout(() => setPhase('deal'), dealAt),
      setTimeout(() => setFlying(true), dealAt + 40),
      setTimeout(() => setPhase('settle'), lastFlight),
      setTimeout(finish, lastFlight + SETTLE_MS),
      // Un roce por carta, al ritmo exacto al que salen volando.
      ...flights.map((flight) => setTimeout(() => play('deal'), dealAt + 40 + flight.delay)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [flights.length]);

  if (!origin) return null;

  const stackStyle = {
    left: origin.x,
    top: origin.y,
    '--deck-dx': `${deckShift.dx}px`,
    '--deck-dy': `${deckShift.dy}px`,
  } as React.CSSProperties;

  return (
    <div className={`deal deal--${phase}`}>
      <div className="deal__stack" style={stackStyle}>
        <CardBack className="deal__stackcard deal__stackcard--3" />
        <CardBack className="deal__stackcard deal__stackcard--2" />
        <CardBack className="deal__stackcard deal__stackcard--1" />
      </div>

      {phase !== 'shuffle' &&
        flights.map((flight) => (
          <CardBack
            key={flight.id}
            className={`deal__flight ${flying ? 'is-flying' : ''}`}
            style={
              {
                left: origin.x,
                top: origin.y,
                '--dx': `${flight.dx}px`,
                '--dy': `${flight.dy}px`,
                '--rot': `${flight.rotate}deg`,
                '--delay': `${flight.delay}ms`,
                '--flight': `${FLIGHT_MS}ms`,
              } as React.CSSProperties
            }
          />
        ))}

      <p className="deal__caption">{phase === 'shuffle' ? 'Barajando' : 'Repartiendo'}</p>
      <button type="button" className="deal__skip" onClick={finish}>
        Saltar
      </button>
    </div>
  );
}

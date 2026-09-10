import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cardName, cardText, fillTemplate } from '@contagio/engine';
import type { Action, Card, Color, OrganPile, Pack, PlayerView, PublicPlayer, RoomView } from '@contagio/engine';

import { Mark, Pulse } from '../art';
import { CardGlyph, usePack } from '../packs';
import { Announce } from './Announce';
import { CardBack } from './CardBack';
import { CardFace } from './Card';
import { Deal } from './Deal';
import { Organ, OrganSlot } from './Organ';
import { ThemeToggle } from './ThemeToggle';
import { TurnClock } from './TurnClock';

interface TableProps {
  view: PlayerView;
  room: RoomView;
  isHost: boolean;
  onPlay: (action: Action) => Promise<unknown>;
  onRematch: () => void;
  onLeave: () => void;
  onShowRules: () => void;
}

type OrganKey = string;
const keyOf = (playerId: string, organId: string): OrganKey => `${playerId}:${organId}`;

/** Cuanto se resalta un organo despues de recibir una carta. */
const HIT_MS = 3200;

/**
 * Un cuerpo se dibuja siempre con cinco huecos, uno por color mas el comodin.
 * Cada organo cae en el suyo, asi que colocar una carta no mueve el resto ni
 * cambia el tamano de la mesa.
 */
const BODY_SLOTS: Color[] = ['red', 'blue', 'green', 'yellow', 'wild'];

function bodySlots(body: OrganPile[]): { color: Color; pile: OrganPile | undefined }[] {
  return BODY_SLOTS.map((color) => ({ color, pile: body.find((p) => p.organ.color === color) }));
}

/** Sigue el ancho de la ventana para decidir si hay sitio a los costados. */
function useNarrow(query = '(max-width: 900px)'): boolean {
  const [narrow, setNarrow] = useState(() => window.matchMedia?.(query).matches ?? false);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return narrow;
}

/**
 * Reparte a los rivales alrededor de la mesa. Con pocos caben todos arriba;
 * a partir de cuatro se ocupan los costados, que es espacio que estaba libre y
 * evita que la fila superior se estreche o aparezca un desplazador.
 */
function seatLayout<T>(rivals: T[]): { left: T[]; top: T[]; right: T[] } {
  const n = rivals.length;
  if (n <= 3) return { left: [], top: rivals, right: [] };
  if (n === 4) return { left: rivals.slice(0, 1), top: rivals.slice(1, 3), right: rivals.slice(3) };
  return { left: rivals.slice(0, 1), top: rivals.slice(1, 4), right: rivals.slice(4) };
}

export function Table({ view, room, isHost, onPlay, onRematch, onLeave, onShowRules }: TableProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [swapMineId, setSwapMineId] = useState<string | null>(null);
  const [discardIds, setDiscardIds] = useState<string[]>([]);
  const [discarding, setDiscarding] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hitKeys, setHitKeys] = useState<Set<OrganKey>>(new Set());
  const [dealing, setDealing] = useState(false);
  /** Jugada a la espera de un si: hoy solo la negligencia medica. */
  const [confirming, setConfirming] = useState<{ text: string; action: Action } | null>(null);
  const narrow = useNarrow();
  const { id: packId, text: pack } = usePack();
  const { words } = pack;

  const centerRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const handRef = useRef<HTMLDivElement | null>(null);
  const seatRefs = useRef(new Map<string, HTMLElement>());
  const dealtRef = useRef(false);

  const you = view.players.find((p) => p.id === view.youId)!;
  const rivals = view.players.filter((p) => p.id !== view.youId);

  // Cada cambio de turno limpia lo que estuviera a medio elegir.
  useEffect(() => {
    setSelectedCardId(null);
    setSwapMineId(null);
    setDiscardIds([]);
    setDiscarding(false);
    setConfirming(null);
  }, [view.turnPlayerId, view.turnCount]);

  // Reparto animado al empezar la partida (y al empezar la revancha).
  useEffect(() => {
    if (view.phase !== 'playing') return;
    if (view.turnCount > 1) {
      dealtRef.current = false;
      return;
    }
    if (dealtRef.current) return;
    dealtRef.current = true;
    setDealing(true);
  }, [view.turnCount, view.phase]);

  // Resalta un momento los organos que acaba de tocar la ultima jugada.
  useEffect(() => {
    const move = view.lastMove;
    if (!move || move.targets.length === 0) return;
    setHitKeys(new Set(move.targets.map((t) => keyOf(t.playerId, t.organId))));
    const timer = setTimeout(() => setHitKeys(new Set()), HIT_MS);
    return () => clearTimeout(timer);
  }, [view.lastMove?.serial]);

  const registerSeat = useCallback((playerId: string, el: HTMLElement | null) => {
    if (el) seatRefs.current.set(playerId, el);
    else seatRefs.current.delete(playerId);
  }, []);

  const selectedCard = view.hand.find((c) => c.id === selectedCardId) ?? null;
  const hoveredCard = view.hand.find((c) => c.id === hoveredCardId) ?? null;

  const actionsByCard = useMemo(() => {
    const map = new Map<string, Action[]>();
    for (const action of view.legalActions) {
      if (action.type === 'DISCARD') continue;
      const list = map.get(action.cardId) ?? [];
      list.push(action);
      map.set(action.cardId, list);
    }
    return map;
  }, [view.legalActions]);

  const selectedActions = selectedCardId ? (actionsByCard.get(selectedCardId) ?? []) : [];

  /** Organos que aceptan la carta seleccionada ahora mismo. */
  const organTargets = useMemo(() => {
    const map = new Map<OrganKey, Action>();
    for (const action of selectedActions) {
      switch (action.type) {
        case 'PLAY_VIRUS':
        case 'PLAY_MEDICINE':
        case 'PLAY_STEAL':
          map.set(keyOf(action.target.playerId, action.target.organId), action);
          break;
        case 'PLAY_SWAP':
          if (!swapMineId) map.set(keyOf(action.mine.playerId, action.mine.organId), action);
          else if (action.mine.organId === swapMineId) map.set(keyOf(action.theirs.playerId, action.theirs.organId), action);
          break;
        default:
          break;
      }
    }
    return map;
  }, [selectedActions, swapMineId]);

  /**
   * Huecos de tu cuerpo que aceptan la carta elegida. Colocar un organo se
   * hace igual que jugar un virus: eligiendo el sitio sobre la mesa.
   */
  const slotTargets = useMemo(() => {
    const map = new Map<Color, Action>();
    for (const action of selectedActions) {
      if (action.type !== 'PLAY_ORGAN') continue;
      const card = view.hand.find((c) => c.id === action.cardId);
      if (card?.color) map.set(card.color, action);
    }
    return map;
  }, [selectedActions, view.hand]);

  const playerTargets = useMemo(() => {
    const map = new Map<string, Action>();
    for (const action of selectedActions) {
      if (action.type === 'PLAY_MALPRACTICE') map.set(action.targetPlayerId, action);
    }
    return map;
  }, [selectedActions]);

  const directAction = selectedActions.find(
    (a) => a.type === 'PLAY_ORGAN' || a.type === 'PLAY_SPREAD' || a.type === 'PLAY_QUARANTINE',
  );
  const canPlaySomething = actionsByCard.size > 0;

  async function run(action: Action) {
    await onPlay(action).catch(() => undefined);
    setSelectedCardId(null);
    setSwapMineId(null);
    setDiscarding(false);
    setDiscardIds([]);
  }

  function onOrganClick(playerId: string, organId: string) {
    const action = organTargets.get(keyOf(playerId, organId));
    if (!action) return;
    if (action.type === 'PLAY_SWAP' && !swapMineId) {
      setSwapMineId(organId);
      return;
    }
    void run(action);
  }

  function toggleCard(card: Card) {
    if (discarding) {
      setDiscardIds((prev) => (prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id]));
      return;
    }
    setSwapMineId(null);
    setSelectedCardId((prev) => (prev === card.id ? null : card.id));
  }

  const guidance = getGuidance({ view, pack, selectedCard, selectedActions, swapMineId, canPlaySomething, discarding });
  const legendCard = hoveredCard ?? selectedCard;
  const winner = view.winnerId ? view.players.find((p) => p.id === view.winnerId) : null;
  const turnName = view.players.find((p) => p.id === view.turnPlayerId)?.name ?? '';

  // Orden de reparto: el mismo del motor, una carta por jugador y ronda.
  const dealTargets = view.players.map((p) =>
    p.id === view.youId ? handRef.current : (seatRefs.current.get(p.id) ?? null),
  );

  // En pantalla estrecha no hay costados: todos los rivales van a la tira de arriba.
  const seats = narrow ? { left: [], top: rivals, right: [] } : seatLayout(rivals);
  const renderSeat = (rival: PublicPlayer, index: number, total: number, variant: 'top' | 'side') => (
    <RivalSeat
      key={rival.id}
      player={rival}
      index={index}
      total={total}
      variant={variant}
      isTurn={rival.id === view.turnPlayerId}
      targetableOrgans={organTargets}
      hitKeys={hitKeys}
      selectable={playerTargets.has(rival.id)}
      onOrganClick={onOrganClick}
      onSelectPlayer={() => {
        const action = playerTargets.get(rival.id);
        if (!action) return;
        // Cambiar el cuerpo entero es irreversible y se juega de un clic:
        // aqui si conviene preguntar antes.
        setConfirming({
          text: `Cambias toda tu mesa por la de ${rival.name}: te llevas lo suyo con todo lo que tenga encima, y le dejas lo tuyo.`,
          action,
        });
      }}
      registerSeat={registerSeat}
    />
  );

  return (
    <div className={`table ${dealing ? 'is-dealing' : ''}`}>
      <header className="bar">
        <div className="bar__brand">
          <Mark className="bar__mark" />
          <span className="bar__title">Contagio</span>
          <span className="bar__code mono">sala {room.code}</span>
        </div>
        <div className="bar__turn">
          <Pulse active={view.isYourTurn} />
          <span>{view.isYourTurn ? 'Tu turno' : `Juega ${turnName}`}</span>
          {view.turnMsLeft !== null && !dealing && <TurnClock msLeft={view.turnMsLeft} limitMs={view.turnLimitMs} />}
        </div>
        <div className="bar__tools">
          <ThemeToggle compact />
          <button type="button" className="btn btn--ghost" onClick={onShowRules}>
            Reglas
          </button>
          <button type="button" className="btn btn--ghost" onClick={onLeave}>
            Salir
          </button>
        </div>
      </header>

      <div className="felt">
        <div className={`arena ${seats.left.length + seats.right.length > 0 ? 'has-sides' : ''}`}>
          <aside className="seats seats--side" aria-label="Rivales a tu izquierda">
            {seats.left.map((rival, index) => renderSeat(rival, index, seats.left.length, 'side'))}
          </aside>

          <div className="arena__middle">
            <section className="seats seats--top" data-count={seats.top.length} aria-label="Rivales enfrente">
              {seats.top.map((rival, index) => renderSeat(rival, index, seats.top.length, 'top'))}
            </section>

            <div className="board">
          <div className="center" ref={centerRef}>
          <div className="pile pile--deck" ref={deckRef}>
            <div className="pile__stack">
              <CardBack className="pile__card pile__card--3" />
              <CardBack className="pile__card pile__card--2" />
              <CardBack className="pile__card" />
            </div>
            <p className="pile__label mono">mazo · {view.deckCount}</p>
          </div>

          {/* En pausa mientras se reparte: el cartel del sorteo no puede gastar
              su turno debajo de las cartas que van volando. */}
          <Announce move={view.lastMove} youId={view.youId} paused={dealing} />

          <div className="pile pile--discard">
            <div className="pile__stack">
              {view.topDiscard ? (
                <span className={`pile__card pile__card--face tone-${view.topDiscard.color ?? 'treatment'}`}>
                  <CardGlyph card={view.topDiscard} className="pile__glyph" />
                  <span className="pile__name">{cardName(view.topDiscard, packId)}</span>
                </span>
              ) : (
                <span className="pile__card pile__card--empty">vacia</span>
              )}
            </div>
            <p className="pile__label mono">descarte · {view.discardCount}</p>
          </div>
          </div>

        <section className="mine" aria-label={`Tu ${words.body}`}>
          <header className="mine__head">
            <h2 className="mine__name">
              {you.name} <span className="tag tag--you">tu</span>
            </h2>
            <span className="mine__meta mono">
              {you.healthyOrgans}/4 {words.organs} {words.healthy}
            </span>
          </header>
          <div className="mine__body">
            {bodySlots(you.body).map(({ color, pile }) => {
              if (!pile) {
                const place = slotTargets.get(color);
                return (
                  <OrganSlot
                    key={color}
                    color={color}
                    targetable={Boolean(place)}
                    onClick={place ? () => void run(place) : undefined}
                  />
                );
              }
              const action = organTargets.get(keyOf(you.id, pile.organ.id));
              return (
                <Organ
                  key={color}
                  pile={pile}
                  targetable={Boolean(action)}
                  selected={swapMineId === pile.organ.id}
                  hit={hitKeys.has(keyOf(you.id, pile.organ.id))}
                  onClick={action ? () => onOrganClick(you.id, pile.organ.id) : undefined}
                />
              );
            })}
          </div>
        </section>
            </div>
          </div>

          <aside className="seats seats--side" aria-label="Rivales a tu derecha">
            {seats.right.map((rival, index) => renderSeat(rival, index, seats.right.length, 'side'))}
          </aside>
        </div>
      </div>

      <footer className="dock">
        <div className="dock__legend">
          {dealing ? (
            <span className="dock__guide is-muted">Repartiendo cartas.</span>
          ) : legendCard ? (
            <>
              <span className={`dock__legendname tone-${legendCard.color ?? 'treatment'}`}>{cardName(legendCard, packId)}</span>
              <span className="dock__legendtext">{cardText(legendCard, packId)}</span>
            </>
          ) : (
            <span className={`dock__guide ${view.isYourTurn ? '' : 'is-muted'}`}>{guidance}</span>
          )}
        </div>

        <div className="dock__row">
          <ol className="ticker" aria-label="Ultimas jugadas">
            {view.log
              .slice(-3)
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="ticker__item">
                  {entry.text}
                </li>
              ))}
          </ol>

          <div className="hand" ref={handRef} style={{ '--n': view.hand.length } as React.CSSProperties}>
            {view.hand.map((card, index) => (
              <div
                key={card.id}
                className="hand__slot"
                style={{ '--i': index } as React.CSSProperties}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId((prev) => (prev === card.id ? null : prev))}
                onFocus={() => setHoveredCardId(card.id)}
                onBlur={() => setHoveredCardId((prev) => (prev === card.id ? null : prev))}
              >
                <CardFace
                  card={card}
                  selected={card.id === selectedCardId}
                  marked={discardIds.includes(card.id)}
                  playable={view.isYourTurn && (discarding || actionsByCard.has(card.id))}
                  onClick={view.isYourTurn ? () => toggleCard(card) : undefined}
                />
              </div>
            ))}
            {view.hand.length === 0 && <p className="hand__empty">Sin cartas: robaras al empezar tu turno.</p>}
          </div>

          <div className="dock__actions">
            {selectedCard && directAction && (
              <button type="button" className="btn btn--primary" onClick={() => void run(directAction)}>
                {directAction.type === 'PLAY_ORGAN' && `Colocar ${cardName(selectedCard, packId)}`}
                {directAction.type === 'PLAY_SPREAD' &&
                  fillTemplate(pack.buttons.spread, {
                    n: directAction.moves.length,
                    threats: directAction.moves.length === 1 ? words.threat : words.threats,
                  })}
                {directAction.type === 'PLAY_QUARANTINE' && pack.buttons.quarantine}
              </button>
            )}
            {swapMineId && (
              <button type="button" className="btn btn--ghost" onClick={() => setSwapMineId(null)}>
                Cambiar mi {words.organ}
              </button>
            )}
            {view.isYourTurn && !discarding && view.hand.length > 0 && (
              <button
                type="button"
                className={canPlaySomething ? 'btn btn--ghost' : 'btn btn--outline'}
                onClick={() => {
                  setDiscarding(true);
                  setSelectedCardId(null);
                  setSwapMineId(null);
                }}
              >
                Descartar cartas
              </button>
            )}
            {discarding && (
              <>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void run({ type: 'DISCARD', cardIds: discardIds })}
                  disabled={discardIds.length === 0}
                >
                  Soltar {discardIds.length || ''} {discardIds.length === 1 ? 'carta' : 'cartas'}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setDiscarding(false);
                    setDiscardIds([]);
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {dealing && (
        <Deal
          centerEl={centerRef.current}
          deckEl={deckRef.current}
          seatEls={dealTargets}
          handSize={3}
          onDone={() => setDealing(false)}
        />
      )}

      {confirming && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Confirmar jugada">
          <div className="modal__panel modal__panel--ask">
            <h2 className="modal__title">{pack.treatments.malpractice.name}</h2>
            <p className="curtain__text">{confirming.text}</p>
            <div className="curtain__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  const { action } = confirming;
                  setConfirming(null);
                  void run(action);
                }}
              >
                {pack.buttons.malpractice}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setConfirming(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {view.phase === 'finished' && (
        <div className="curtain" role="dialog" aria-modal="true">
          <div className="curtain__panel">
            <p className="curtain__eyebrow mono">fin de la partida</p>
            <h2 className="curtain__title">
              {!winner
                ? 'Se acaban las cartas. Tablas.'
                : winner.id === view.youId
                  ? pack.ending.winTitle
                  : fillTemplate(pack.ending.loseTitle, { p: winner.name })}
            </h2>
            <p className="curtain__text">
              {!winner
                ? 'Nadie reunio ventaja suficiente antes de que se agotara el mazo.'
                : winner.id === view.youId
                  ? pack.ending.winText
                  : pack.ending.loseText}
            </p>
            <div className="curtain__actions">
              {isHost && (
                <button type="button" className="btn btn--primary" onClick={onRematch}>
                  Otra partida
                </button>
              )}
              <button type="button" className="btn btn--ghost" onClick={onLeave}>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface RivalSeatProps {
  player: PublicPlayer;
  index: number;
  total: number;
  variant: 'top' | 'side';
  isTurn: boolean;
  targetableOrgans: Map<OrganKey, Action>;
  hitKeys: Set<OrganKey>;
  selectable: boolean;
  onOrganClick: (playerId: string, organId: string) => void;
  onSelectPlayer: () => void;
  registerSeat: (playerId: string, el: HTMLElement | null) => void;
}

function RivalSeat({
  player,
  index,
  total,
  variant,
  isTurn,
  targetableOrgans,
  hitKeys,
  selectable,
  onOrganClick,
  onSelectPlayer,
  registerSeat,
}: RivalSeatProps) {
  const { text: pack } = usePack();
  // Los asientos centrales se elevan un poco: la fila se lee como un arco.
  const arc = variant === 'top' && total > 1 ? Math.abs(index - (total - 1) / 2) / ((total - 1) / 2) : 0;

  return (
    <article
      className={`seat-board seat-board--${variant} ${isTurn ? 'is-turn' : ''} ${selectable ? 'is-selectable' : ''}`}
      style={{ '--arc': arc } as React.CSSProperties}
      // La mesa entera del rival es el objetivo, no solo su nombre: es lo que
      // se senala con el dedo cuando se juega una negligencia medica.
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      title={selectable ? `${pack.treatments.malpractice.name}: cambiarlo todo con ${player.name}` : undefined}
      onClick={selectable ? onSelectPlayer : undefined}
      onKeyDown={
        selectable
          ? (event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return;
              event.preventDefault();
              onSelectPlayer();
            }
          : undefined
      }
    >
      <header className="seat-board__head">
        <span className="seat-board__name">
          {player.name}
          {player.isBot && <span className="tag">bot</span>}
          {!player.connected && !player.isBot && <span className="tag tag--warn">sin conexion</span>}
        </span>
        <span className="seat-board__meta mono">{player.healthyOrgans}/4</span>
      </header>

      <div className="seat-board__hand" ref={(el) => registerSeat(player.id, el)} aria-label={`${player.handCount} cartas en mano`}>
        {Array.from({ length: player.handCount }).map((_, i) => (
          <CardBack key={i} className="seat-board__back" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      <div className="seat-board__body">
        {bodySlots(player.body).map(({ color, pile }) => {
          if (!pile) return <OrganSlot key={color} color={color} compact />;
          const action = targetableOrgans.get(keyOf(player.id, pile.organ.id));
          return (
            <Organ
              key={color}
              pile={pile}
              compact
              targetable={Boolean(action)}
              hit={hitKeys.has(keyOf(player.id, pile.organ.id))}
              onClick={action ? () => onOrganClick(player.id, pile.organ.id) : undefined}
            />
          );
        })}
      </div>
    </article>
  );
}

function getGuidance(args: {
  view: PlayerView;
  pack: Pack;
  selectedCard: Card | null;
  selectedActions: Action[];
  swapMineId: string | null;
  canPlaySomething: boolean;
  discarding: boolean;
}): string {
  const { view, pack, selectedCard, selectedActions, swapMineId, canPlaySomething, discarding } = args;
  const { words: w } = pack;
  if (view.phase === 'finished') return 'Partida terminada.';
  if (!view.isYourTurn) return `Esperando a ${view.players.find((p) => p.id === view.turnPlayerId)?.name ?? 'el rival'}.`;
  if (discarding) return 'Marca las cartas que quieras soltar y confirma el descarte.';
  if (!selectedCard) {
    return canPlaySomething
      ? 'Elige una carta de tu mano.'
      : 'Ninguna carta se puede jugar: descarta las que no te sirvan.';
  }
  if (selectedActions.length === 0) {
    return `${cardName(selectedCard, pack.id)} no tiene objetivo valido. Prueba con otra carta.`;
  }

  const kinds = new Set(selectedActions.map((a) => a.type));
  if (kinds.has('PLAY_SWAP') && !swapMineId) return `Elige primero ${w.one} de tus ${w.organs} para el intercambio.`;
  if (kinds.has('PLAY_SWAP')) return `Ahora elige ${w.the} ${w.organ} rival que quieres a cambio.`;
  if (kinds.has('PLAY_VIRUS')) return `Elige ${w.the} ${w.organ} que quieres atacar.`;
  if (kinds.has('PLAY_MEDICINE')) return `Elige ${w.the} ${w.organ} que quieres proteger.`;
  if (kinds.has('PLAY_STEAL')) return `Elige ${w.the} ${w.organ} rival que te llevas.`;
  if (kinds.has('PLAY_MALPRACTICE')) return 'Elige la mesa del jugador con quien lo cambias todo.';
  if (kinds.has('PLAY_ORGAN')) return `Coloca ${w.the} ${w.organ} en su hueco de tu ${w.body}.`;
  return cardText(selectedCard, pack.id);
}

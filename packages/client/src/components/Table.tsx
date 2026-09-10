import { useEffect, useMemo, useState } from 'react';

import { cardName } from '@contagio/engine';
import type { Action, Card, PlayerView, PublicPlayer, RoomView } from '@contagio/engine';

import { Pulse } from '../art';
import { CardFace, cardHint } from './Card';
import { Organ } from './Organ';

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

export function Table({ view, room, isHost, onPlay, onRematch, onLeave, onShowRules }: TableProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [swapMineId, setSwapMineId] = useState<string | null>(null);
  const [discardIds, setDiscardIds] = useState<string[]>([]);
  const [discarding, setDiscarding] = useState(false);

  // Cada vez que cambia el turno se limpia la seleccion pendiente.
  useEffect(() => {
    setSelectedCardId(null);
    setSwapMineId(null);
    setDiscardIds([]);
    setDiscarding(false);
  }, [view.turnPlayerId, view.turnCount]);

  const you = view.players.find((p) => p.id === view.youId)!;
  const rivals = view.players.filter((p) => p.id !== view.youId);
  const selectedCard = view.hand.find((c) => c.id === selectedCardId) ?? null;

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

  const playerTargets = useMemo(() => {
    const map = new Map<string, Action>();
    for (const action of selectedActions) {
      if (action.type === 'PLAY_MALPRACTICE') map.set(action.targetPlayerId, action);
    }
    return map;
  }, [selectedActions]);

  /** Acciones que se resuelven sin elegir objetivo (organo, brote, cuarentena). */
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

  const guidance = getGuidance({ view, selectedCard, selectedActions, swapMineId, canPlaySomething, discarding });
  const winner = view.winnerId ? view.players.find((p) => p.id === view.winnerId) : null;

  return (
    <div className="table">
      <header className="bar">
        <div className="bar__brand">
          <span className="bar__title">Contagio</span>
          <span className="bar__code mono">sala {room.code}</span>
        </div>
        <div className="bar__turn">
          <Pulse active={view.isYourTurn} />
          <span>{view.isYourTurn ? 'Tu turno' : `Juega ${view.players.find((p) => p.id === view.turnPlayerId)?.name ?? '...'}`}</span>
        </div>
        <div className="bar__tools">
          <span className="mono bar__counter" title="Cartas en el mazo y en la pila de descartes">
            mazo {view.deckCount} · descarte {view.discardCount}
          </span>
          <button type="button" className="btn btn--ghost" onClick={onShowRules}>
            Reglas
          </button>
          <button type="button" className="btn btn--ghost" onClick={onLeave}>
            Salir
          </button>
        </div>
      </header>

      <main className="table__main">
        <section className="rivals" aria-label="Cuerpos de tus rivales">
          {rivals.map((rival) => (
            <PlayerBoard
              key={rival.id}
              player={rival}
              isTurn={rival.id === view.turnPlayerId}
              targetableOrgans={organTargets}
              selectable={playerTargets.has(rival.id)}
              onOrganClick={onOrganClick}
              onSelectPlayer={() => {
                const action = playerTargets.get(rival.id);
                if (action) void run(action);
              }}
            />
          ))}
        </section>

        <aside className="log" aria-label="Registro de la partida">
          <h2 className="log__title">Registro</h2>
          <ol className="log__list">
            {view.log
              .slice()
              .reverse()
              .map((entry) => (
                <li key={entry.id} className="log__item">
                  {entry.text}
                </li>
              ))}
          </ol>
        </aside>
      </main>

      <section className="you" aria-label="Tu cuerpo">
        <PlayerBoard
          player={you}
          isTurn={view.isYourTurn}
          isYou
          targetableOrgans={organTargets}
          selectedOrganId={swapMineId}
          onOrganClick={onOrganClick}
        />
      </section>

      <footer className="dock">
        <p className={`dock__guide ${view.isYourTurn ? '' : 'is-muted'}`}>{guidance}</p>

        <div className="dock__hand">
          {view.hand.map((card) => (
            <CardFace
              key={card.id}
              card={card}
              selected={card.id === selectedCardId}
              marked={discardIds.includes(card.id)}
              playable={view.isYourTurn && (discarding || actionsByCard.has(card.id))}
              onClick={view.isYourTurn ? () => toggleCard(card) : undefined}
            />
          ))}
          {view.hand.length === 0 && <p className="dock__empty">Sin cartas: robaras al empezar tu turno.</p>}
        </div>

        <div className="dock__actions">
          {selectedCard && directAction && (
            <button type="button" className="btn btn--primary" onClick={() => void run(directAction)}>
              {directAction.type === 'PLAY_ORGAN' && `Colocar ${cardName(selectedCard)}`}
              {directAction.type === 'PLAY_SPREAD' && `Propagar ${directAction.moves.length} virus`}
              {directAction.type === 'PLAY_QUARANTINE' && 'Decretar cuarentena'}
            </button>
          )}
          {swapMineId && (
            <button type="button" className="btn btn--ghost" onClick={() => setSwapMineId(null)}>
              Cambiar mi organo
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
      </footer>

      {view.phase === 'finished' && (
        <div className="curtain" role="dialog" aria-modal="true">
          <div className="curtain__panel">
            <p className="curtain__eyebrow mono">fin de la partida</p>
            <h2 className="curtain__title">
              {!winner
                ? 'Se acaban las cartas. Tablas.'
                : winner.id === view.youId
                  ? 'Cuerpo completo. Ganas.'
                  : `${winner.name} completa su cuerpo.`}
            </h2>
            <p className="curtain__text">
              {!winner
                ? 'Nadie reunio ventaja suficiente antes de que se agotara el mazo.'
                : winner.id === view.youId
                  ? 'Cuatro organos sanos sobre la mesa antes que nadie.'
                  : 'Tus organos se quedaron a medias. La proxima ronda empieza de cero.'}
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

interface PlayerBoardProps {
  player: PublicPlayer;
  isTurn: boolean;
  isYou?: boolean;
  targetableOrgans: Map<OrganKey, Action>;
  selectedOrganId?: string | null;
  selectable?: boolean;
  onOrganClick: (playerId: string, organId: string) => void;
  onSelectPlayer?: () => void;
}

function PlayerBoard({
  player,
  isTurn,
  isYou,
  targetableOrgans,
  selectedOrganId,
  selectable,
  onOrganClick,
  onSelectPlayer,
}: PlayerBoardProps) {
  return (
    <article className={`board ${isYou ? 'board--you' : ''} ${isTurn ? 'is-turn' : ''} ${selectable ? 'is-selectable' : ''}`}>
      <header className="board__head">
        <button
          type="button"
          className="board__name"
          onClick={selectable ? onSelectPlayer : undefined}
          disabled={!selectable}
          title={selectable ? 'Intercambiar cuerpos con este jugador' : undefined}
        >
          {player.name}
          {player.isBot && <span className="tag">bot</span>}
          {!player.connected && !player.isBot && <span className="tag tag--warn">sin conexion</span>}
        </button>
        <span className="board__meta mono">
          {player.healthyOrgans}/4 sanos · {player.handCount} en mano
        </span>
      </header>

      <div className="board__body">
        {player.body.map((pile) => {
          const action = targetableOrgans.get(keyOf(player.id, pile.organ.id));
          return (
            <Organ
              key={pile.organ.id}
              pile={pile}
              compact={!isYou}
              targetable={Boolean(action)}
              selected={selectedOrganId === pile.organ.id}
              onClick={action ? () => onOrganClick(player.id, pile.organ.id) : undefined}
            />
          );
        })}
        {player.body.length === 0 && (
          <p className="board__empty">{isYou ? 'Sin organos. Coloca uno para empezar tu cuerpo.' : 'Mesa vacia.'}</p>
        )}
      </div>
    </article>
  );
}

function getGuidance(args: {
  view: PlayerView;
  selectedCard: Card | null;
  selectedActions: Action[];
  swapMineId: string | null;
  canPlaySomething: boolean;
  discarding: boolean;
}): string {
  const { view, selectedCard, selectedActions, swapMineId, canPlaySomething, discarding } = args;
  if (view.phase === 'finished') return 'Partida terminada.';
  if (!view.isYourTurn) return `Esperando a ${view.players.find((p) => p.id === view.turnPlayerId)?.name ?? 'el rival'}.`;
  if (discarding) return 'Marca las cartas que quieras soltar y confirma el descarte.';
  if (!selectedCard) {
    return canPlaySomething
      ? 'Elige una carta de tu mano.'
      : 'Ninguna carta se puede jugar: descarta las que no te sirvan.';
  }
  if (selectedActions.length === 0) return `${cardName(selectedCard)} no tiene objetivo valido. Prueba con otra carta.`;

  const kinds = new Set(selectedActions.map((a) => a.type));
  if (kinds.has('PLAY_SWAP') && !swapMineId) return 'Elige primero uno de tus organos para el intercambio.';
  if (kinds.has('PLAY_SWAP')) return 'Ahora elige el organo rival que quieres a cambio.';
  if (kinds.has('PLAY_VIRUS')) return 'Elige el organo que quieres atacar.';
  if (kinds.has('PLAY_MEDICINE')) return 'Elige el organo que quieres tratar.';
  if (kinds.has('PLAY_STEAL')) return 'Elige el organo rival que te llevas.';
  if (kinds.has('PLAY_MALPRACTICE')) return 'Elige con que jugador intercambias tu cuerpo entero.';
  return cardHint(selectedCard);
}

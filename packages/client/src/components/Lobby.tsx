import { useState } from 'react';

import { COLORS, MAX_PLAYERS, MIN_PLAYERS, PACK_IDS, TURN_LIMITS_MS, getPack } from '@contagio/engine';
import type { BotDifficulty, PackId, RoomView } from '@contagio/engine';

import { Mark } from '../art';
import { useLang, useT } from '../i18n';
import { PACK_ART } from '../packs';
import { LangToggle } from './LangToggle';
import { SoundMenu } from './SoundMenu';
import { ThemeToggle } from './ThemeToggle';

interface LobbyProps {
  room: RoomView;
  youId: string | null;
  onAddBot: () => Promise<unknown>;
  onRemove: (playerId: string) => Promise<unknown>;
  onDifficulty: (difficulty: BotDifficulty) => Promise<unknown>;
  onPack: (pack: PackId) => Promise<unknown>;
  onTurnLimit: (ms: number) => Promise<unknown>;
  onStart: () => Promise<unknown>;
  onLeave: () => void;
  onShowRules: () => void;
}

const DIFFICULTIES: BotDifficulty[] = ['easy', 'normal', 'hard'];

export function Lobby({
  room,
  youId,
  onAddBot,
  onRemove,
  onDifficulty,
  onPack,
  onTurnLimit,
  onStart,
  onLeave,
  onShowRules,
}: LobbyProps) {
  const t = useT();
  const lang = useLang();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const isHost = room.players.some((p) => p.id === youId && p.isHost);
  const canStart = room.players.length >= MIN_PLAYERS;

  async function guard(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.failed);
    }
  }

  function copyCode() {
    navigator.clipboard
      ?.writeText(room.code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => setError(t.lobby.copyByHand(room.code)));
  }

  return (
    <div className="lobby">
      <div className="lobby__sheet">
        <header className="lobby__head">
          <div>
            <h1 className="lobby__title">
              <Mark className="lobby__mark" />
              {t.lobby.title}
            </h1>
            <p className="lobby__lead">{t.lobby.lead(MIN_PLAYERS, MAX_PLAYERS)}</p>
          </div>
          <div className="lobby__tools">
            <LangToggle />
            <SoundMenu />
            <ThemeToggle compact />
            <button type="button" className="codechip mono" onClick={copyCode} title={t.lobby.copyTitle}>
              <span className="codechip__code">{room.code}</span>
              <span className="codechip__hint">{copied ? t.lobby.copied : t.lobby.copy}</span>
            </button>
          </div>
        </header>

        <ol className="roster">
          {room.players.map((player, index) => (
            <li key={player.id} className={`roster__row ${player.id === youId ? 'is-you' : ''}`}>
              <span className="roster__index mono">{String(index + 1).padStart(2, '0')}</span>
              <span className="roster__name">
                {player.name}
                {player.isHost && <span className="tag">{t.common.host}</span>}
                {player.isBot && <span className="tag">{t.common.bot}</span>}
                {player.id === youId && <span className="tag tag--you">{t.common.you}</span>}
              </span>
              {isHost && player.id !== youId && (
                <button type="button" className="roster__remove" onClick={() => void guard(() => onRemove(player.id))}>
                  {t.lobby.remove}
                </button>
              )}
            </li>
          ))}
          {Array.from({ length: MAX_PLAYERS - room.players.length }).map((_, i) => (
            <li key={`empty-${i}`} className="roster__row roster__row--empty">
              <span className="roster__index mono">{String(room.players.length + i + 1).padStart(2, '0')}</span>
              <span className="roster__name">{t.lobby.emptySeat}</span>
              {isHost && i === 0 && (
                <button type="button" className="roster__add" onClick={() => void guard(onAddBot)}>
                  {t.lobby.addBot}
                </button>
              )}
            </li>
          ))}
        </ol>

        {/* Todos ven la eleccion; solo el anfitrion la cambia. */}
        <section className="packs" aria-labelledby="packs-title">
          <h2 id="packs-title" className="packs__title">
            {t.lobby.packs}
          </h2>
          <div className="packs__grid" role="radiogroup" aria-labelledby="packs-title">
            {PACK_IDS.map((id) => {
              const art = PACK_ART[id];
              const active = room.pack === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  data-pack={id}
                  className={`packtile ${active ? 'is-active' : ''}`}
                  disabled={!isHost}
                  onClick={() => !active && void guard(() => onPack(id))}
                >
                  <span className="packtile__glyphs">
                    {COLORS.map((color) => {
                      const Glyph = art.organs[color];
                      return <Glyph key={color} className={`packtile__glyph tone-${color}`} />;
                    })}
                  </span>
                  <span className="packtile__name">{getPack(id, lang).name}</span>
                </button>
              );
            })}
          </div>
          <p className="packs__tagline">{getPack(room.pack, lang).tagline}</p>
        </section>

        {isHost && (
          <div className="lobby__settings">
            <div className="setting">
              <span id="difficulty-label" className="setting__label">
                {t.lobby.difficulty}
              </span>
              <div className="segmented" role="group" aria-labelledby="difficulty-label">
                {DIFFICULTIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-pressed={room.difficulty === level}
                    className={`segmented__option ${room.difficulty === level ? 'is-active' : ''}`}
                    onClick={() => void guard(() => onDifficulty(level))}
                  >
                    {t.lobby.levels[level]}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting">
              <span id="turn-label" className="setting__label">
                {t.lobby.turn}
              </span>
              <div className="segmented" role="group" aria-labelledby="turn-label">
                {TURN_LIMITS_MS.map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    aria-pressed={room.turnLimitMs === ms}
                    className={`segmented__option ${room.turnLimitMs === ms ? 'is-active' : ''}`}
                    onClick={() => room.turnLimitMs !== ms && void guard(() => onTurnLimit(ms))}
                  >
                    {t.lobby.seconds(ms / 1000)}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="btn btn--primary lobby__start"
              onClick={() => void guard(onStart)}
              disabled={!canStart}
            >
              {t.lobby.start}
            </button>
          </div>
        )}

        {!isHost && (
          <p className="notice">{t.lobby.hostStarts(Math.round(room.turnLimitMs / 1000))}</p>
        )}

        {error && <p className="notice notice--error">{error}</p>}

        <footer className="lobby__foot">
          <button type="button" className="btn btn--ghost" onClick={onShowRules}>
            {t.common.rules}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onLeave}>
            {t.lobby.leave}
          </button>
        </footer>
      </div>
    </div>
  );
}

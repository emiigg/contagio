import { useState, type FormEvent } from 'react';

import { BrainGlyph, HeartGlyph, LiverGlyph, LungGlyph } from '../art';

interface HomeProps {
  name: string;
  connected: boolean;
  onCreate: (name: string) => Promise<void>;
  onJoin: (code: string, name: string) => Promise<void>;
  onShowRules: () => void;
}

export function Home({ name, connected, onCreate, onJoin, onShowRules }: HomeProps) {
  const [playerName, setPlayerName] = useState(name);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent, mode: 'create' | 'join') {
    event.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) return setError('Escribe un nombre para la mesa.');
    if (mode === 'join' && code.trim().length < 4) return setError('El codigo de sala tiene 4 caracteres.');

    setBusy(true);
    setError(null);
    try {
      if (mode === 'create') await onCreate(trimmed);
      else await onJoin(code.trim().toUpperCase(), trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo entrar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="home">
      <div className="home__sheet">
        <div className="home__intro">
          <h1 className="home__title">Contagio</h1>
          <p className="home__lead">
            Cuatro organos sanos sobre la mesa y la partida es tuya. El problema son los otros cinco laboratorios
            intentando lo mismo, con virus en la mano.
          </p>

          <ul className="specimen" aria-label="Los cuatro organos del cuerpo">
            <li className="specimen__item tone-red">
              <HeartGlyph className="specimen__glyph" />
              <span>Corazon</span>
            </li>
            <li className="specimen__item tone-blue">
              <BrainGlyph className="specimen__glyph" />
              <span>Cerebro</span>
            </li>
            <li className="specimen__item tone-green">
              <LungGlyph className="specimen__glyph" />
              <span>Pulmon</span>
            </li>
            <li className="specimen__item tone-yellow">
              <LiverGlyph className="specimen__glyph" />
              <span>Higado</span>
            </li>
          </ul>

          <button type="button" className="btn btn--ghost" onClick={onShowRules}>
            Como se juega
          </button>
        </div>

        <form className="home__form" onSubmit={(e) => submit(e, 'create')}>
          <label className="field">
            <span className="field__label">Tu nombre en la mesa</span>
            <input
              className="field__input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={18}
              placeholder="Dra. Marin"
              autoComplete="nickname"
            />
          </label>

          <button type="submit" className="btn btn--primary btn--block" disabled={busy || !connected}>
            Crear sala
          </button>

          <div className="home__divider">
            <span>o entra con un codigo</span>
          </div>

          <div className="home__join">
            <label className="field field--code">
              <span className="field__label">Codigo</span>
              <input
                className="field__input mono"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
                maxLength={4}
                placeholder="F7K2"
                inputMode="text"
                autoCapitalize="characters"
              />
            </label>
            <button type="button" className="btn btn--outline" onClick={(e) => void submit(e, 'join')} disabled={busy || !connected}>
              Entrar
            </button>
          </div>

          {error && <p className="notice notice--error">{error}</p>}
          {!connected && <p className="notice">Conectando con el servidor.</p>}
        </form>
      </div>
    </div>
  );
}

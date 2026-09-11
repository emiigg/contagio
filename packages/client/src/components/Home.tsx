import { useState, type FormEvent } from 'react';

import { DEFAULT_PACK, getPack } from '@contagio/engine';

import { BrainGlyph, HeartGlyph, LiverGlyph, LungGlyph, Mark } from '../art';
import { useLang, useT } from '../i18n';
import { CURRENT, hasUnseenRelease, markReleaseSeen, releaseDate } from '../releases';
import { LangToggle } from './LangToggle';
import { ThemeToggle } from './ThemeToggle';

interface HomeProps {
  name: string;
  connected: boolean;
  onCreate: (name: string) => Promise<void>;
  onJoin: (code: string, name: string) => Promise<void>;
  onShowRules: () => void;
  onShowReleases: () => void;
}

/** Cuantas notas de la version vigente caben en el inicio; el resto, en el historial. */
const NEWS_NOTES = 3;

export function Home({ name, connected, onCreate, onJoin, onShowRules, onShowReleases }: HomeProps) {
  const t = useT();
  const lang = useLang();
  const [playerName, setPlayerName] = useState(name);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unseen, setUnseen] = useState(hasUnseenRelease);
  const organs = getPack(DEFAULT_PACK, lang).organs;
  const news = CURRENT.text[lang];

  function openReleases() {
    markReleaseSeen();
    setUnseen(false);
    onShowReleases();
  }

  async function submit(event: FormEvent, mode: 'create' | 'join') {
    event.preventDefault();
    const trimmed = playerName.trim();
    if (!trimmed) return setError(t.home.needName);
    if (mode === 'join' && code.trim().length < 4) return setError(t.home.badCode);

    setBusy(true);
    setError(null);
    try {
      if (mode === 'create') await onCreate(trimmed);
      else await onJoin(code.trim().toUpperCase(), trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.home.cantJoin);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="home">
      <div className="home__sheet">
        <div className="home__intro">
          <h1 className="home__title">
            <Mark className="home__mark" />
            Contagio
          </h1>
          <p className="home__lead">{t.home.lead}</p>

          <ul className="specimen" aria-label={t.home.specimen}>
            <li className="specimen__item tone-red">
              <HeartGlyph className="specimen__glyph" />
              <span>{organs.red.name}</span>
            </li>
            <li className="specimen__item tone-blue">
              <BrainGlyph className="specimen__glyph" />
              <span>{organs.blue.name}</span>
            </li>
            <li className="specimen__item tone-green">
              <LungGlyph className="specimen__glyph" />
              <span>{organs.green.name}</span>
            </li>
            <li className="specimen__item tone-yellow">
              <LiverGlyph className="specimen__glyph" />
              <span>{organs.yellow.name}</span>
            </li>
          </ul>

          <div className="home__tools">
            <button type="button" className="btn btn--ghost" onClick={onShowRules}>
              {t.home.howTo}
            </button>
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>

        <form className="home__form" onSubmit={(e) => submit(e, 'create')}>
          <label className="field">
            <span className="field__label">{t.home.nameLabel}</span>
            <input
              className="field__input"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={18}
              placeholder={t.home.namePlaceholder}
              autoComplete="nickname"
            />
          </label>

          <button type="submit" className="btn btn--primary btn--block" disabled={busy || !connected}>
            {t.home.create}
          </button>

          <div className="home__divider">
            <span>{t.home.or}</span>
          </div>

          <div className="home__join">
            <label className="field field--code">
              <span className="field__label">{t.home.code}</span>
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
              {t.home.join}
            </button>
          </div>

          {error && <p className="notice notice--error">{error}</p>}
          {!connected && <p className="notice">{t.home.connecting}</p>}
        </form>

        <section className="news" aria-labelledby="news-title">
          <div className="news__body">
            <p className="news__meta mono">
              {t.home.news} · v{CURRENT.version} · {releaseDate(CURRENT.date, lang)}
              {unseen && <span className="news__badge">{t.home.fresh}</span>}
            </p>
            <h2 id="news-title" className="news__title">
              {news.title}
            </h2>
            <ul className="news__notes">
              {news.notes.slice(0, NEWS_NOTES).map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
          <button type="button" className="btn btn--outline news__more" onClick={openReleases}>
            {t.home.history}
          </button>
        </section>
      </div>
    </div>
  );
}

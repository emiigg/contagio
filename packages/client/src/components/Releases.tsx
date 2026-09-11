import { useEffect, useRef } from 'react';

import { useLang, useT } from '../i18n';
import { RELEASES, releaseDate } from '../releases';

/** Historial completo de versiones, de la vigente a la primera. */
export function Releases({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useT();
  const lang = useLang();

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={t.releases.label} onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">{t.releases.title}</h2>
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            {t.common.close}
          </button>
        </header>

        <ol className="releases">
          {RELEASES.map((release, index) => (
            <li key={release.version} className="release">
              <p className="release__meta mono">
                v{release.version} · {releaseDate(release.date, lang)}
                {index === 0 && <span className="tag tag--turn">{t.releases.current}</span>}
              </p>
              <h3 className="release__title">{release.text[lang].title}</h3>
              <ul className="release__notes">
                {release.text[lang].notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

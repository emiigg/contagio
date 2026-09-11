import { useEffect, useRef } from 'react';

import { RELEASES, releaseDate } from '../releases';

/** Historial completo de versiones, de la vigente a la primera. */
export function Releases({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Historial de versiones" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">Novedades</h2>
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <ol className="releases">
          {RELEASES.map((release, index) => (
            <li key={release.version} className="release">
              <p className="release__meta mono">
                v{release.version} · {releaseDate(release.date)}
                {index === 0 && <span className="tag tag--turn">actual</span>}
              </p>
              <h3 className="release__title">{release.title}</h3>
              <ul className="release__notes">
                {release.notes.map((note) => (
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

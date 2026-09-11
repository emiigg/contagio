import { useEffect, useRef } from 'react';

import { DEFAULT_PACK } from '@contagio/engine';
import type { CardKind, TreatmentKind } from '@contagio/engine';

import { useT } from '../i18n';
import { usePack } from '../packs';

const TREATMENTS: TreatmentKind[] = ['swap', 'steal', 'spread', 'quarantine', 'malpractice'];
const KINDS: CardKind[] = ['organ', 'virus', 'medicine', 'treatment'];

/** Reglas resumidas, redactadas para esta version. Cada paquete traduce los nombres; se explican con los de siempre. */
export function Rules({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useT();
  const r = t.rules;
  const { text, art } = usePack();
  const renamed = text.id !== DEFAULT_PACK;
  const Virus = art.virus;
  const Medicine = art.medicine;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={r.label} onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">{r.title}</h2>
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            {t.common.close}
          </button>
        </header>

        <div className="modal__body">
          {renamed && (
            <section className="rule">
              <h3>{r.pack(text.name)}</h3>
              <p>{r.packIntro}</p>
              <ul>
                {KINDS.map((kind) => (
                  <li key={kind}>
                    <strong>{text.kinds[kind]}</strong>
                    {r.playsAs(r.base[kind])}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rule">
            <h3>{r.goal}</h3>
            <p>{r.goalText}</p>
          </section>

          <section className="rule">
            <h3>{r.turn}</h3>
            <p>{r.turnText}</p>
          </section>

          <section className="rule">
            <h3>
              <Virus className="rule__glyph" /> {r.viruses}
              {renamed && ` · ${text.kinds.virus}`}
            </h3>
            <ul>
              {r.virusRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="rule">
            <h3>
              <Medicine className="rule__glyph" /> {r.medicines}
              {renamed && ` · ${text.kinds.medicine}`}
            </h3>
            <ul>
              {r.medicineRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section className="rule">
            <h3>
              {r.treatments}
              {renamed && ` · ${text.kinds.treatment}`}
            </h3>
            <ul>
              {TREATMENTS.map((kind) => (
                <li key={kind}>
                  <strong>{text.treatments[kind].name}:</strong> {text.treatments[kind].text}
                </li>
              ))}
            </ul>
          </section>

          <section className="rule">
            <h3>{r.details}</h3>
            <ul>
              {r.detailRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <p className="modal__note">
            {r.note}
            {text.credit && ` ${text.credit}`}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';

import { DEFAULT_PACK } from '@contagio/engine';
import type { CardKind, TreatmentKind } from '@contagio/engine';

import { usePack } from '../packs';

const TREATMENTS: TreatmentKind[] = ['swap', 'steal', 'spread', 'quarantine', 'malpractice'];

/** Los nombres de las reglas: cada paquete los traduce, pero se explican con estos. */
const BASE_KINDS: Record<CardKind, string> = {
  organ: 'Organo',
  virus: 'Virus',
  medicine: 'Medicina',
  treatment: 'Tratamiento',
};

/** Reglas resumidas, redactadas para esta version. */
export function Rules({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
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
    <div className="modal" role="dialog" aria-modal="true" aria-label="Reglas de Contagio" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">Como se juega</h2>
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className="modal__body">
          {renamed && (
            <section className="rule">
              <h3>Paquete {text.name}</h3>
              <p>Cambian los nombres y los dibujos, no las reglas. Cada carta equivale a una de siempre:</p>
              <ul>
                {(Object.keys(BASE_KINDS) as CardKind[]).map((kind) => (
                  <li key={kind}>
                    <strong>{text.kinds[kind]}</strong> juega como {BASE_KINDS[kind].toLowerCase()}.
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rule">
            <h3>Objetivo</h3>
            <p>
              Gana quien primero tenga cuatro organos sanos de distinto color sobre la mesa. Un organo esta sano
              mientras no tenga un virus encima: libre, vacunado o inmune cuentan igual.
            </p>
          </section>

          <section className="rule">
            <h3>El turno</h3>
            <p>Juegas una carta o descartas las que quieras. Despues robas hasta tener tres en la mano y pasas.</p>
          </section>

          <section className="rule">
            <h3>
              <Virus className="rule__glyph" /> Virus{renamed && ` · ${text.kinds.virus}`}
            </h3>
            <ul>
              <li>Sobre un organo libre: lo infecta.</li>
              <li>Sobre un organo ya infectado: lo extirpa; organo y virus van al descarte.</li>
              <li>Sobre un organo vacunado: destruye la vacuna en vez de infectar.</li>
            </ul>
          </section>

          <section className="rule">
            <h3>
              <Medicine className="rule__glyph" /> Medicinas{renamed && ` · ${text.kinds.medicine}`}
            </h3>
            <ul>
              <li>Sobre un organo infectado: lo cura.</li>
              <li>Sobre un organo libre: lo vacuna. Hara falta un virus extra para tumbarlo.</li>
              <li>Sobre un organo vacunado: lo inmuniza. Ya nada puede tocarlo.</li>
            </ul>
          </section>

          <section className="rule">
            <h3>Tratamientos{renamed && ` · ${text.kinds.treatment}`}</h3>
            <ul>
              {TREATMENTS.map((kind) => (
                <li key={kind}>
                  <strong>{text.treatments[kind].name}:</strong> {text.treatments[kind].text}
                </li>
              ))}
            </ul>
          </section>

          <section className="rule">
            <h3>Detalles que deciden partidas</h3>
            <ul>
              <li>Nunca puedes tener dos organos del mismo color.</li>
              <li>El organo comodin vale como cualquier color; los virus y medicinas comodin, tambien.</li>
              <li>Un organo inmune no se roba, no se intercambia y no se infecta.</li>
            </ul>
          </section>

          <p className="modal__note">
            Contagio es un proyecto de portafolio con reglas propias inspiradas en el genero de cartas de sabotaje.
            Ilustraciones y textos originales.
            {text.credit && ` ${text.credit}`}
          </p>
        </div>
      </div>
    </div>
  );
}

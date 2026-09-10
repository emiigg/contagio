import { useEffect, useRef } from 'react';

import { MedicineGlyph, VirusGlyph } from '../art';

/** Reglas resumidas, redactadas para esta version. */
export function Rules({ onClose }: { onClose: () => void }) {
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
    <div className="modal" role="dialog" aria-modal="true" aria-label="Reglas de Contagio" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <header className="modal__head">
          <h2 className="modal__title">Como se juega</h2>
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </header>

        <div className="modal__body">
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
              <VirusGlyph className="rule__glyph" /> Virus
            </h3>
            <ul>
              <li>Sobre un organo libre: lo infecta.</li>
              <li>Sobre un organo ya infectado: lo extirpa; organo y virus van al descarte.</li>
              <li>Sobre un organo vacunado: destruye la vacuna en vez de infectar.</li>
            </ul>
          </section>

          <section className="rule">
            <h3>
              <MedicineGlyph className="rule__glyph" /> Medicinas
            </h3>
            <ul>
              <li>Sobre un organo infectado: lo cura.</li>
              <li>Sobre un organo libre: lo vacuna. Hara falta un virus extra para tumbarlo.</li>
              <li>Sobre un organo vacunado: lo inmuniza. Ya nada puede tocarlo.</li>
            </ul>
          </section>

          <section className="rule">
            <h3>Tratamientos</h3>
            <ul>
              <li>
                <strong>Intercambio quirurgico:</strong> cambias un organo tuyo por uno rival.
              </li>
              <li>
                <strong>Extraccion ilegal:</strong> te llevas un organo rival a tu cuerpo.
              </li>
              <li>
                <strong>Brote:</strong> repartes tus virus entre organos libres de los demas.
              </li>
              <li>
                <strong>Cuarentena:</strong> el resto descarta su mano y pierde el turno robando.
              </li>
              <li>
                <strong>Negligencia medica:</strong> intercambias tu cuerpo entero con otro jugador.
              </li>
            </ul>
          </section>

          <section className="rule">
            <h3>Detalles que deciden partidas</h3>
            <ul>
              <li>Nunca puedes tener dos organos del mismo color.</li>
              <li>El organo quimerico vale como cualquier color; los virus y medicinas comodin, tambien.</li>
              <li>Un organo inmune no se roba, no se intercambia y no se infecta.</li>
            </ul>
          </section>

          <p className="modal__note">
            Contagio es un proyecto de portafolio con reglas propias inspiradas en el genero de cartas de sabotaje.
            Ilustraciones y textos originales.
          </p>
        </div>
      </div>
    </div>
  );
}

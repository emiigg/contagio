import { useEffect, useId, useRef, useState } from 'react';

import { SoundOffGlyph, SoundOnGlyph } from '../art';
import { useTrackTitle } from '../music';
import { play, useSound } from '../sound';

const percent = (value: number) => Math.round(value * 100);

/**
 * Volumen de la mesa: musica y efectos por separado, y un silencio general que
 * no pisa los volumenes. Mover cualquiera de los dos devuelve el sonido, que
 * es lo que quiere quien lo toca. Todo se recuerda entre visitas.
 */
export function SoundMenu() {
  const { muted, music, effects, set } = useSound();
  const track = useTrackTitle();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previewRef = useRef<ReturnType<typeof setTimeout>>();
  const panelId = useId();
  const silent = muted || (music === 0 && effects === 0);
  const Icon = silent ? SoundOffGlyph : SoundOnGlyph;

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(previewRef.current), []);

  function setEffects(value: number) {
    set({ effects: value, muted: false });
    // Se oye como queda al parar de arrastrar, no en cada paso del recorrido.
    clearTimeout(previewRef.current);
    previewRef.current = setTimeout(() => play('organ'), 200);
  }

  const status = muted
    ? 'Todo en silencio.'
    : music === 0
      ? 'Musica apagada.'
      : track
        ? `Suena: ${track}`
        : 'La musica suena dentro de una sala.';

  return (
    <div className="soundmenu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`themeswitch themeswitch--compact soundmenu__button ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Sonido y musica"
        title="Sonido y musica"
      >
        <Icon className="themeswitch__icon" />
      </button>

      {open && (
        <div id={panelId} className={`soundmenu__panel ${muted ? 'is-muted' : ''}`} role="group" aria-label="Volumen">
          <p className="soundmenu__title">Sonido</p>

          <label className="soundmenu__row">
            <span className="soundmenu__label">Musica</span>
            <input
              className="soundmenu__range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={percent(music)}
              onChange={(e) => set({ music: Number(e.target.value) / 100, muted: false })}
            />
            <span className="soundmenu__value mono">{percent(music)}</span>
          </label>

          <label className="soundmenu__row">
            <span className="soundmenu__label">Efectos</span>
            <input
              className="soundmenu__range"
              type="range"
              min={0}
              max={100}
              step={5}
              value={percent(effects)}
              onChange={(e) => setEffects(Number(e.target.value) / 100)}
            />
            <span className="soundmenu__value mono">{percent(effects)}</span>
          </label>

          <p className="soundmenu__status">{status}</p>

          <button
            type="button"
            className="btn btn--outline btn--block soundmenu__mute"
            aria-pressed={muted}
            onClick={() => set({ muted: !muted })}
          >
            {muted ? 'Activar sonido' : 'Silenciar todo'}
          </button>
        </div>
      )}
    </div>
  );
}

import { SoundOffGlyph, SoundOnGlyph } from '../art';
import { useSound } from '../sound';

/** Silenciar la mesa. Empieza con sonido; la eleccion se recuerda. */
export function SoundToggle() {
  const { muted, set } = useSound();
  const Icon = muted ? SoundOffGlyph : SoundOnGlyph;

  return (
    <button
      type="button"
      className="themeswitch themeswitch--compact"
      onClick={() => set({ muted: !muted })}
      aria-pressed={!muted}
      aria-label="Sonido de la mesa"
      title={!muted ? 'Sonido activado. Pulsa para silenciar.' : 'Sonido apagado. Pulsa para activarlo.'}
    >
      <Icon className="themeswitch__icon" />
    </button>
  );
}

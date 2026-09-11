import { SoundOffGlyph, SoundOnGlyph } from '../art';
import { useSound } from '../sound';

/** Silenciar la mesa. Empieza con sonido; la eleccion se recuerda. */
export function SoundToggle() {
  const { enabled, toggle } = useSound();
  const Icon = enabled ? SoundOnGlyph : SoundOffGlyph;

  return (
    <button
      type="button"
      className="themeswitch themeswitch--compact"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label="Sonido de la mesa"
      title={enabled ? 'Sonido activado. Pulsa para silenciar.' : 'Sonido apagado. Pulsa para activarlo.'}
    >
      <Icon className="themeswitch__icon" />
    </button>
  );
}

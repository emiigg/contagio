import { AutoGlyph, MoonGlyph, SunGlyph } from '../art';
import { THEME_LABEL, useTheme } from '../theme';

const SHORT: Record<string, string> = { system: 'Auto', light: 'Claro', dark: 'Oscuro' };

/**
 * Un solo boton para los tres estados: automatico, claro y oscuro. Empieza en
 * automatico, que respeta lo que ya tenga configurado el sistema, y solo se
 * queda fijo cuando alguien lo elige a mano.
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { choice, resolved, cycle } = useTheme();
  const Icon = choice === 'system' ? AutoGlyph : resolved === 'dark' ? MoonGlyph : SunGlyph;

  return (
    <button
      type="button"
      className={`themeswitch ${compact ? 'themeswitch--compact' : ''}`}
      onClick={cycle}
      title={`${THEME_LABEL[choice]}. Pulsa para cambiar.`}
      aria-label={`${THEME_LABEL[choice]}. Pulsa para cambiar de tema.`}
    >
      <Icon className="themeswitch__icon" />
      {!compact && <span className="themeswitch__label">{SHORT[choice]}</span>}
    </button>
  );
}

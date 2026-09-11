import { AutoGlyph, MoonGlyph, SunGlyph } from '../art';
import { useT } from '../i18n';
import { useTheme } from '../theme';

/**
 * Un solo boton para los tres estados: automatico, claro y oscuro. Empieza en
 * automatico, que respeta lo que ya tenga configurado el sistema, y solo se
 * queda fijo cuando alguien lo elige a mano.
 */
export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { choice, resolved, cycle } = useTheme();
  const t = useT();
  const Icon = choice === 'system' ? AutoGlyph : resolved === 'dark' ? MoonGlyph : SunGlyph;
  const label = t.theme.label[choice];

  return (
    <button
      type="button"
      className={`themeswitch ${compact ? 'themeswitch--compact' : ''}`}
      data-control="theme"
      onClick={cycle}
      title={t.theme.title(label)}
      aria-label={t.theme.aria(label)}
    >
      <Icon className="themeswitch__icon" />
      {!compact && <span className="themeswitch__label">{t.theme.short[choice]}</span>}
    </button>
  );
}

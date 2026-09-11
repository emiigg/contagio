import { LANGS } from '@contagio/engine';

import { setLang, useLang, useT } from '../i18n';

/**
 * ES / EN. Un solo boton, como el del tema: con dos idiomas, pulsar es pasar
 * al otro, y el boton ensena en cual estas.
 */
export function LangToggle() {
  const lang = useLang();
  const t = useT();
  const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]!;

  return (
    <button
      type="button"
      className="themeswitch themeswitch--compact langswitch"
      data-control="lang"
      onClick={() => setLang(next)}
      title={t.lang.next}
      aria-label={`${t.lang.label}: ${lang.toUpperCase()}. ${t.lang.next}`}
    >
      <span className="langswitch__code mono">{lang.toUpperCase()}</span>
    </button>
  );
}

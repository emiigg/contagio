/**
 * Idiomas de la partida. Cada jugador lee la mesa en el suyo, asi que el motor
 * no elige: redacta cada frase en todos a la vez y el cliente muestra la que
 * toca. El servidor sigue siendo la unica fuente de verdad, tambien del texto.
 */
export type Lang = 'es' | 'en';

export const LANGS: Lang[] = ['es', 'en'];

export const DEFAULT_LANG: Lang = 'es';

/** Un texto en todos los idiomas. */
export type Localized = Record<Lang, string>;

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as string[]).includes(value);
}

/** Construye un texto en todos los idiomas a partir de como se dice en cada uno. */
export function localize(say: (lang: Lang) => string): Localized {
  return Object.fromEntries(LANGS.map((lang) => [lang, say(lang)])) as Localized;
}

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/**
 * Tema de la interfaz. 'system' no es un tema en si: es dejar que decida el
 * sistema operativo, que es el comportamiento esperado por defecto. Las otras
 * dos son una decision explicita de quien juega, y esa manda.
 */
export type ThemeChoice = 'system' | 'light' | 'dark';
export type Resolved = 'light' | 'dark';

/** La misma clave que lee el script en linea de index.html: no las separes. */
export const THEME_KEY = 'contagio.theme';

const ORDER: ThemeChoice[] = ['system', 'light', 'dark'];

function read(): ThemeChoice {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw === 'light' || raw === 'dark' ? raw : 'system';
  } catch {
    return 'system';
  }
}

// Un unico valor para toda la aplicacion: si algun dia hay dos botones a la
// vista, los dos cuentan la misma historia.
let choice: ThemeChoice = typeof localStorage === 'undefined' ? 'system' : read();
const listeners = new Set<() => void>();

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function setChoice(next: ThemeChoice): void {
  choice = next;
  try {
    if (next === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, next);
  } catch {
    /* modo privado: el tema dura lo que la pestana */
  }
  for (const fn of listeners) fn();
}

export function resolveTheme(value: ThemeChoice, prefersDark: boolean): Resolved {
  if (value === 'system') return prefersDark ? 'dark' : 'light';
  return value;
}

export function useTheme() {
  const current = useSyncExternalStore(subscribe, () => choice, () => 'system' as ThemeChoice);
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  );

  // El sistema puede cambiar solo (modo noche programado): hay que seguirlo.
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const onChange = () => setPrefersDark(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved = resolveTheme(current, prefersDark);

  // La hoja de estilos solo conoce el resultado, no la preferencia: la consulta
  // al sistema se hace aqui y la paleta no se duplica en un @media.
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const cycle = useCallback(() => {
    setChoice(ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length]!);
  }, []);

  return { choice: current, resolved, cycle, choose: setChoice };
}

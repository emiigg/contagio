/**
 * Trazos comunes a todos los paquetes, para que un mazo nuevo no desentone.
 *
 * CARD: glifo de carta. Diagrama de linea, trazo uniforme de 2 sobre 48, y
 * relleno tenue del color de la carta en la masa principal.
 * LINE: motivo de fondo. Solo linea, mas fina, sin relleno: es ambiente.
 */
export const CARD = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const LINE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

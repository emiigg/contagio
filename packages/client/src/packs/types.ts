import type { Color, TreatmentKind } from '@contagio/engine';

export interface GlyphProps {
  className?: string;
}

export type Glyph = (props: GlyphProps) => JSX.Element;

/**
 * Dibujos de un paquete. Los textos viven en el motor (`Pack`); aqui solo hay
 * trazos, y todos heredan `currentColor` para que el tono lo ponga la carta.
 */
export interface PackArt {
  organs: Record<Color, Glyph>;
  /** Un solo dibujo por tipo: el color de la carta ya dice a que organo ataca o protege. */
  virus: Glyph;
  medicine: Glyph;
  treatments: Record<TreatmentKind, Glyph>;
  /**
   * Fondo: diez motivos cuadrados (viewBox 32) que ocupan los huecos fijos del
   * Backdrop, y una cenefa ancha (viewBox 64x24) para la franja de arriba.
   */
  backdrop: { items: Glyph[]; band: Glyph };
}

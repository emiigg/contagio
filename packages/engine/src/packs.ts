import type { CardKind, Color, OrganStatus, TreatmentKind } from './types.js';

/**
 * Paquetes de cartas. La mecanica es siempre la misma: un paquete solo cambia
 * nombres, descripciones y la forma de contar cada jugada. Por eso vive en el
 * motor como texto puro; los dibujos son cosa del cliente.
 */
export type PackId = 'contagio';

/** Orden en que se ofrecen en la sala. El primero es el de siempre. */
export const PACK_IDS: PackId[] = ['contagio'];

export const DEFAULT_PACK: PackId = 'contagio';

export interface PackOrgan {
  name: string;
  /** Articulo del nombre: "el Corazon de Ana", "la Fresa de Ana". */
  art: 'el' | 'la';
}

/**
 * Frases del registro. Huecos: {p} quien juega, {card} carta colocada,
 * {organ} organo afectado ya con su articulo, {n} y {threats} para el brote,
 * {victim} el rival del cambio completo.
 */
export type PackLine =
  | 'place'
  | 'infect'
  | 'remove'
  | 'breakShield'
  | 'cure'
  | 'vaccinate'
  | 'immunize'
  | 'spread'
  | 'quarantine'
  | 'malpractice'
  | 'win';

export interface Pack {
  id: PackId;
  name: string;
  /** Una linea para el selector de la sala. */
  tagline: string;
  /** Etiqueta de cada tipo de carta, en singular. */
  kinds: Record<CardKind, string>;
  organs: Record<Color, PackOrgan>;
  viruses: Record<Color, string>;
  medicines: Record<Color, string>;
  treatments: Record<TreatmentKind, { name: string; text: string }>;
  /** Que hace cada tipo de carta, para la leyenda bajo la mesa. */
  hints: Record<Exclude<CardKind, 'treatment'>, string>;
  /** Sello sobre el organo segun su estado. Corto: cabe en un organo compacto. */
  stamps: Record<Exclude<OrganStatus, 'free'>, string>;
  /**
   * Vocabulario para las frases que arma la interfaz. El genero va aparte
   * porque "Elige el organo" y "Elige la fruta" no salen de la misma plantilla.
   */
  words: {
    organ: string;
    organs: string;
    the: 'el' | 'la';
    one: 'uno' | 'una';
    /** Plural y concordado con organs: "sanos", "frescas". */
    healthy: string;
    threat: string;
    threats: string;
    /** Lo que forma cada jugador sobre la mesa: "cuerpo", "equipo". Va tras "tu" o "su". */
    body: string;
  };
  lines: Record<PackLine, string>;
  /** Botones de atajo del pie. {n} y {threats} como en las frases. */
  buttons: { spread: string; quarantine: string; malpractice: string };
  /** Cortina de fin de partida. {p} es quien gana. */
  ending: { winTitle: string; winText: string; loseTitle: string; loseText: string };
}

const CONTAGIO: Pack = {
  id: 'contagio',
  name: 'Contagio',
  tagline: 'Organos, virus y medicinas. El mazo de siempre.',
  kinds: { organ: 'Organo', virus: 'Virus', medicine: 'Medicina', treatment: 'Tratamiento' },
  organs: {
    red: { name: 'Corazon', art: 'el' },
    blue: { name: 'Cerebro', art: 'el' },
    green: { name: 'Pulmon', art: 'el' },
    yellow: { name: 'Higado', art: 'el' },
    wild: { name: 'Organo quimerico', art: 'el' },
  },
  viruses: {
    red: 'Cepa escarlata',
    blue: 'Cepa cobalto',
    green: 'Cepa esmeralda',
    yellow: 'Cepa ambar',
    wild: 'Cepa mutante',
  },
  medicines: {
    red: 'Antidoto escarlata',
    blue: 'Antidoto cobalto',
    green: 'Antidoto esmeralda',
    yellow: 'Antidoto ambar',
    wild: 'Antidoto universal',
  },
  treatments: {
    swap: {
      name: 'Intercambio quirurgico',
      text: 'Intercambia un organo tuyo por el de otro jugador. Ninguno de los dos puede estar inmunizado, ni provocar organos repetidos.',
    },
    steal: {
      name: 'Extraccion ilegal',
      text: 'Toma un organo de otro jugador y anadelo a tu cuerpo. No puedes robar organos inmunizados ni repetir color.',
    },
    spread: {
      name: 'Brote',
      text: 'Traslada virus de tus organos infectados a organos libres de tus rivales.',
    },
    quarantine: {
      name: 'Cuarentena',
      text: 'Todos los rivales descartan su mano y pierden su siguiente turno robando de nuevo.',
    },
    malpractice: {
      name: 'Negligencia medica',
      text: 'Intercambias tu cuerpo entero con el de otro jugador, inmunizados incluidos.',
    },
  },
  hints: {
    organ: 'Colocalo en tu cuerpo. Un color por cuerpo.',
    virus: 'Infecta un organo libre, extirpa uno infectado o rompe una vacuna.',
    medicine: 'Cura un virus, vacuna un organo libre o inmuniza uno vacunado.',
  },
  stamps: { infected: 'Infectado', vaccinated: 'Vacunado', immunized: 'Inmune' },
  words: {
    organ: 'organo',
    organs: 'organos',
    the: 'el',
    one: 'uno',
    healthy: 'sanos',
    threat: 'virus',
    threats: 'virus',
    body: 'cuerpo',
  },
  lines: {
    place: '{p} coloca {card}.',
    infect: '{p} infecta {organ}.',
    remove: '{p} extirpa {organ}.',
    breakShield: '{p} destruye la vacuna de {organ}.',
    cure: '{p} cura {organ}.',
    vaccinate: '{p} vacuna {organ}.',
    immunize: '{p} inmuniza {organ}.',
    spread: '{p} propaga {n} {threats} a sus rivales.',
    quarantine: '{p} decreta una cuarentena: el resto descarta su mano.',
    malpractice: '{p} intercambia su cuerpo entero con {victim}.',
    win: '{p} completa un cuerpo sano y gana la partida.',
  },
  buttons: { spread: 'Propagar {n} {threats}', quarantine: 'Decretar cuarentena', malpractice: 'Intercambiar cuerpos' },
  ending: {
    winTitle: 'Cuerpo completo. Ganas.',
    winText: 'Cuatro organos sanos sobre la mesa antes que nadie.',
    loseTitle: '{p} completa su cuerpo.',
    loseText: 'Tus organos se quedaron a medias. La proxima ronda empieza de cero.',
  },
};

export const PACKS: Record<PackId, Pack> = {
  contagio: CONTAGIO,
};

export function isPackId(value: unknown): value is PackId {
  return typeof value === 'string' && Object.hasOwn(PACKS, value);
}

/**
 * Paquete por id. Cualquier valor desconocido cae en Contagio: un estado
 * antiguo o incompleto (los bots simulan sobre vistas) nunca se queda sin nombres.
 */
export function getPack(id?: string | null): Pack {
  return isPackId(id) ? PACKS[id] : PACKS[DEFAULT_PACK];
}

/** Rellena los huecos {clave} de una plantilla. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (hole, key: string) => (key in values ? String(values[key]) : hole));
}

/**
 * Las plantillas no saben que articulo trae el organo que les cae, asi que
 * "de el Corazon" o "a el Batman" se contraen despues, como en el habla.
 */
export function contract(text: string): string {
  return text.replace(/\b(de|a) el\b/g, (_, prep: string) => (prep === 'de' ? 'del' : 'al'));
}

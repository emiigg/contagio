import type { CardKind, Color, OrganStatus, TreatmentKind } from './types.js';

/**
 * Paquetes de cartas. La mecanica es siempre la misma: un paquete solo cambia
 * nombres, descripciones y la forma de contar cada jugada. Por eso vive en el
 * motor como texto puro; los dibujos son cosa del cliente.
 */
export type PackId =
  | 'contagio'
  | 'heroes'
  | 'marvel'
  | 'frutas'
  | 'cortafuegos'
  | 'orbita'
  | 'asedio'
  | 'arrecife'
  | 'grimorio';

/** Orden en que se ofrecen en la sala. El primero es el de siempre. */
export const PACK_IDS: PackId[] = [
  'contagio',
  'heroes',
  'marvel',
  'frutas',
  'cortafuegos',
  'orbita',
  'asedio',
  'arrecife',
  'grimorio',
];

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
  /** Nota de derechos para los paquetes con personajes ajenos; sale en las reglas. */
  credit?: string;
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

/**
 * Paquete de aficionado con personajes de DC Comics, a peticion del autor. Los
 * nombres son de sus duenos; los dibujos son emblemas propios, no sus logotipos.
 */
const HEROES: Pack = {
  id: 'heroes',
  name: 'Heroes DC',
  tagline: 'Batman, Superman y Flash contra sus villanos de siempre.',
  kinds: { organ: 'Heroe', virus: 'Villano', medicine: 'Refuerzo', treatment: 'Evento' },
  organs: {
    red: { name: 'Flash', art: 'el' },
    blue: { name: 'Superman', art: 'el' },
    green: { name: 'Linterna Verde', art: 'el' },
    yellow: { name: 'Batman', art: 'el' },
    wild: { name: 'Mujer Maravilla', art: 'la' },
  },
  viruses: {
    red: 'Flash Reverso',
    blue: 'Lex Luthor',
    green: 'Sinestro',
    yellow: 'Joker',
    wild: 'Darkseid',
  },
  medicines: {
    red: 'Fuerza de la Velocidad',
    blue: 'Fortaleza de la Soledad',
    green: 'Anillo de poder',
    yellow: 'Cinturon multiusos',
    wild: 'Atalaya de la Liga',
  },
  treatments: {
    swap: {
      name: 'Tubo Boom',
      text: 'Abres un portal y cambias un heroe tuyo por uno de otro jugador. Ninguno puede ser invencible ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Reclutamiento',
      text: 'Convences a un heroe de otro jugador para que se una a tu equipo. No funciona con heroes invencibles ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Fuga de Arkham',
      text: 'Los villanos que tienes encima escapan y caen sobre heroes libres de tus rivales.',
    },
    quarantine: {
      name: 'Zona Fantasma',
      text: 'Tus rivales pierden su mano en la Zona Fantasma y gastan su siguiente turno en robar otra.',
    },
    malpractice: {
      name: 'Crisis multiversal',
      text: 'Intercambias tu equipo entero con el de otro jugador, invencibles incluidos.',
    },
  },
  hints: {
    organ: 'Sumalo a tu equipo. Un color por equipo.',
    virus: 'Captura a un heroe libre, derrota a uno capturado o rompe su proteccion.',
    medicine: 'Rescata a un heroe capturado, protege a uno libre o vuelve invencible a uno protegido.',
  },
  stamps: { infected: 'Capturado', vaccinated: 'Protegido', immunized: 'Invencible' },
  words: {
    organ: 'heroe',
    organs: 'heroes',
    the: 'el',
    one: 'uno',
    healthy: 'en pie',
    threat: 'villano',
    threats: 'villanos',
    body: 'equipo',
  },
  lines: {
    place: '{p} suma a {card} a su equipo.',
    infect: '{p} captura a {organ}.',
    remove: '{p} derrota a {organ}.',
    breakShield: '{p} rompe la proteccion de {organ}.',
    cure: '{p} rescata a {organ}.',
    vaccinate: '{p} protege a {organ}.',
    immunize: '{p} vuelve invencible a {organ}.',
    spread: '{p} suelta {n} {threats} sobre sus rivales.',
    quarantine: '{p} abre la Zona Fantasma: el resto pierde su mano.',
    malpractice: '{p} cambia de universo con {victim}: equipos intercambiados.',
    win: '{p} reune a su equipo y gana la partida.',
  },
  buttons: { spread: 'Soltar {n} {threats}', quarantine: 'Abrir la Zona Fantasma', malpractice: 'Cambiar de universo' },
  ending: {
    winTitle: 'Equipo completo. Ganas.',
    winText: 'Cuatro heroes en pie antes que nadie.',
    loseTitle: '{p} reune a su equipo.',
    loseText: 'Tu equipo se quedo a medias. La proxima ronda empieza de cero.',
  },
  credit: 'Los personajes de Heroes DC pertenecen a DC Comics; este paquete es un homenaje sin animo de lucro.',
};

/** Paquete de aficionado con personajes de Marvel, igual que Heroes DC. */
const MARVEL: Pack = {
  id: 'marvel',
  name: 'Heroes Marvel',
  tagline: 'Los Vengadores contra Thanos y compania.',
  kinds: { organ: 'Heroe', virus: 'Villano', medicine: 'Refuerzo', treatment: 'Evento' },
  organs: {
    red: { name: 'Iron Man', art: 'el' },
    blue: { name: 'Capitan America', art: 'el' },
    green: { name: 'Hulk', art: 'el' },
    yellow: { name: 'Thor', art: 'el' },
    wild: { name: 'Spider-Man', art: 'el' },
  },
  viruses: {
    red: 'Ultron',
    blue: 'Craneo Rojo',
    green: 'Abominacion',
    yellow: 'Loki',
    wild: 'Thanos',
  },
  medicines: {
    red: 'Reactor Arc',
    blue: 'Escudo de vibranio',
    green: 'Laboratorio de Banner',
    yellow: 'Bifrost',
    wild: 'Torre de los Vengadores',
  },
  treatments: {
    swap: {
      name: 'Salto cuantico',
      text: 'Viajas por el reino cuantico y cambias un heroe tuyo por uno de otro jugador. Ninguno puede ser invencible ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Iniciativa Vengadores',
      text: 'Fichas a un heroe de otro jugador para tu equipo. No funciona con heroes invencibles ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Fuga de la Balsa',
      text: 'Los villanos que tienes encima escapan de la prision y caen sobre heroes libres de tus rivales.',
    },
    quarantine: {
      name: 'Chasquido',
      text: 'Con un chasquido, la mano de tus rivales se vuelve polvo: la descartan y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Incursion multiversal',
      text: 'Intercambias tu equipo entero con el de otro jugador, invencibles incluidos.',
    },
  },
  hints: {
    organ: 'Sumalo a tu equipo. Un color por equipo.',
    virus: 'Captura a un heroe libre, derrota a uno capturado o rompe su proteccion.',
    medicine: 'Rescata a un heroe capturado, protege a uno libre o vuelve invencible a uno protegido.',
  },
  stamps: { infected: 'Capturado', vaccinated: 'Protegido', immunized: 'Invencible' },
  words: {
    organ: 'heroe',
    organs: 'heroes',
    the: 'el',
    one: 'uno',
    healthy: 'en pie',
    threat: 'villano',
    threats: 'villanos',
    body: 'equipo',
  },
  lines: {
    place: '{p} recluta a {card} para los Vengadores.',
    infect: '{p} captura a {organ}.',
    remove: '{p} derrota a {organ}.',
    breakShield: '{p} rompe la proteccion de {organ}.',
    cure: '{p} rescata a {organ}.',
    vaccinate: '{p} protege a {organ}.',
    immunize: '{p} vuelve invencible a {organ}.',
    spread: '{p} suelta {n} {threats} sobre sus rivales.',
    quarantine: '{p} chasquea los dedos: el resto pierde su mano.',
    malpractice: '{p} provoca una incursion y cambia de equipo con {victim}.',
    win: '{p} reune a los Vengadores y gana la partida.',
  },
  buttons: { spread: 'Soltar {n} {threats}', quarantine: 'Chasquear los dedos', malpractice: 'Cambiar de universo' },
  ending: {
    winTitle: 'Vengadores reunidos. Ganas.',
    winText: 'Cuatro heroes en pie antes que nadie.',
    loseTitle: '{p} reune a los Vengadores.',
    loseText: 'Tu equipo se quedo a medias. La proxima ronda empieza de cero.',
  },
  credit: 'Los personajes de Heroes Marvel pertenecen a Marvel; este paquete es un homenaje sin animo de lucro.',
};

const FRUTAS: Pack = {
  id: 'frutas',
  name: 'Frutero',
  tagline: 'Fruta fresca, plagas y conservas. Que no se te eche a perder nada.',
  kinds: { organ: 'Fruta', virus: 'Plaga', medicine: 'Conserva', treatment: 'Imprevisto' },
  organs: {
    red: { name: 'Fresa', art: 'la' },
    blue: { name: 'Arandano', art: 'el' },
    green: { name: 'Kiwi', art: 'el' },
    yellow: { name: 'Platano', art: 'el' },
    wild: { name: 'Macedonia', art: 'la' },
  },
  viruses: {
    red: 'Gusano',
    blue: 'Moho',
    green: 'Pulgon',
    yellow: 'Mosca de la fruta',
    wild: 'Plaga voraz',
  },
  medicines: {
    red: 'Mermelada',
    blue: 'Compota',
    green: 'Escarchado',
    yellow: 'Almibar',
    wild: 'Nevera',
  },
  treatments: {
    swap: {
      name: 'Trueque',
      text: 'Cambias una fruta tuya por una de otro jugador. Ninguna puede estar en conserva ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Mano larga',
      text: 'Te llevas una fruta de otro jugador a tu frutero. No sirve con frutas en conserva ni si ya tienes una de ese color.',
    },
    spread: {
      name: 'Manzana podrida',
      text: 'Las plagas de tus frutas saltan a frutas libres de tus rivales.',
    },
    quarantine: {
      name: 'Helada',
      text: 'Una helada arruina la mano de tus rivales: la descartan y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Cambio de puesto',
      text: 'Intercambias tu frutero entero con el de otro jugador, conservas incluidas.',
    },
  },
  hints: {
    organ: 'Ponla en tu frutero. Una por color.',
    virus: 'Planta una plaga en una fruta libre, pudre una ya plagada o echa a perder una proteccion.',
    medicine: 'Salva una fruta plagada, protege una libre o dejala en conserva si ya estaba protegida.',
  },
  stamps: { infected: 'Plagada', vaccinated: 'Protegida', immunized: 'Conserva' },
  words: {
    organ: 'fruta',
    organs: 'frutas',
    the: 'la',
    one: 'una',
    healthy: 'frescas',
    threat: 'plaga',
    threats: 'plagas',
    body: 'frutero',
  },
  lines: {
    place: '{p} pone {card} en su frutero.',
    infect: '{p} planta una plaga en {organ}.',
    remove: '{p} pudre {organ}.',
    breakShield: '{p} desprotege {organ}.',
    cure: '{p} salva {organ}.',
    vaccinate: '{p} protege {organ}.',
    immunize: '{p} deja en conserva {organ}.',
    spread: '{p} pasa {n} {threats} a sus rivales.',
    quarantine: '{p} trae una helada: el resto pierde su mano.',
    malpractice: '{p} cambia de puesto con {victim}.',
    win: '{p} llena su frutero y gana la partida.',
  },
  buttons: { spread: 'Pasar {n} {threats}', quarantine: 'Traer la helada', malpractice: 'Cambiar de puesto' },
  ending: {
    winTitle: 'Frutero lleno. Ganas.',
    winText: 'Cuatro frutas frescas sobre la mesa antes que nadie.',
    loseTitle: '{p} llena su frutero.',
    loseText: 'Tu frutero se quedo a medias. La proxima ronda empieza de cero.',
  },
};

const CORTAFUEGOS: Pack = {
  id: 'cortafuegos',
  name: 'Cortafuegos',
  tagline: 'Servidores, malware y parches. Que el sistema no se caiga.',
  kinds: { organ: 'Componente', virus: 'Malware', medicine: 'Parche', treatment: 'Comando' },
  organs: {
    red: { name: 'Procesador', art: 'el' },
    blue: { name: 'Base de datos', art: 'la' },
    green: { name: 'Router', art: 'el' },
    yellow: { name: 'Fuente de poder', art: 'la' },
    wild: { name: 'Nube hibrida', art: 'la' },
  },
  viruses: {
    red: 'Ransomware',
    blue: 'Troyano',
    green: 'Gusano de red',
    yellow: 'Pico de tension',
    wild: 'Dia cero',
  },
  medicines: {
    red: 'Parche de kernel',
    blue: 'Copia de seguridad',
    green: 'Cortafuegos',
    yellow: 'Regulador',
    wild: 'Actualizacion',
  },
  treatments: {
    swap: {
      name: 'Migracion',
      text: 'Cambias un componente tuyo por uno de otro jugador. Ninguno puede estar cifrado ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Secuestro de sesion',
      text: 'Tomas el control de un componente de otro jugador y lo sumas a tu sistema. No funciona con componentes cifrados ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Correo en cadena',
      text: 'Reenvias los ataques de tus componentes a componentes libres de tus rivales.',
    },
    quarantine: {
      name: 'Apagon',
      text: 'Se va la luz en las demas mesas: tus rivales descartan su mano y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Clonado de disco',
      text: 'Intercambias tu sistema entero con el de otro jugador, componentes cifrados incluidos.',
    },
  },
  hints: {
    organ: 'Instalalo en tu sistema. Uno por color.',
    virus: 'Hackea un componente libre, tumba uno ya hackeado o revienta un parche.',
    medicine: 'Limpia un componente hackeado, parchea uno libre o cifra uno ya parcheado.',
  },
  stamps: { infected: 'Hackeado', vaccinated: 'Parcheado', immunized: 'Cifrado' },
  words: {
    organ: 'componente',
    organs: 'componentes',
    the: 'el',
    one: 'uno',
    healthy: 'en linea',
    threat: 'ataque',
    threats: 'ataques',
    body: 'sistema',
  },
  lines: {
    place: '{p} instala {card}.',
    infect: '{p} hackea {organ}.',
    remove: '{p} tumba {organ}.',
    breakShield: '{p} revienta el parche de {organ}.',
    cure: '{p} limpia {organ}.',
    vaccinate: '{p} parchea {organ}.',
    immunize: '{p} cifra {organ}.',
    spread: '{p} reenvia {n} {threats} a sus rivales.',
    quarantine: '{p} provoca un apagon: el resto pierde su mano.',
    malpractice: '{p} clona su disco con el de {victim}: sistemas intercambiados.',
    win: '{p} levanta su sistema completo y gana la partida.',
  },
  buttons: { spread: 'Reenviar {n} {threats}', quarantine: 'Provocar apagon', malpractice: 'Clonar disco' },
  ending: {
    winTitle: 'Sistema en linea. Ganas.',
    winText: 'Cuatro componentes en linea antes que nadie.',
    loseTitle: '{p} levanta su sistema.',
    loseText: 'Tu sistema se quedo a medias. La proxima ronda empieza de cero.',
  },
};

const ORBITA: Pack = {
  id: 'orbita',
  name: 'Orbita',
  tagline: 'Una estacion espacial, averias y reparaciones a contrarreloj.',
  kinds: { organ: 'Modulo', virus: 'Averia', medicine: 'Reparacion', treatment: 'Maniobra' },
  organs: {
    red: { name: 'Reactor', art: 'el' },
    blue: { name: 'Soporte vital', art: 'el' },
    green: { name: 'Invernadero', art: 'el' },
    yellow: { name: 'Panel solar', art: 'el' },
    wild: { name: 'Modulo prototipo', art: 'el' },
  },
  viruses: {
    red: 'Fuga de plasma',
    blue: 'Fuga de oxigeno',
    green: 'Plaga de esporas',
    yellow: 'Tormenta solar',
    wild: 'Meteorito',
  },
  medicines: {
    red: 'Refrigerante',
    blue: 'Sellado',
    green: 'Fumigacion',
    yellow: 'Escudo magnetico',
    wild: 'Robot de mantenimiento',
  },
  treatments: {
    swap: {
      name: 'Acoplamiento',
      text: 'Cambias un modulo tuyo por uno de otro jugador. Ninguno puede estar blindado ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Brazo robotico',
      text: 'Arrancas un modulo de otra estacion y lo acoplas a la tuya. No sirve con modulos blindados ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Reaccion en cadena',
      text: 'Las averias de tus modulos saltan a modulos libres de tus rivales.',
    },
    quarantine: {
      name: 'Pulso electromagnetico',
      text: 'Un pulso frie los controles de tus rivales: descartan su mano y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Cambio de orbita',
      text: 'Intercambias tu estacion entera con la de otro jugador, modulos blindados incluidos.',
    },
  },
  hints: {
    organ: 'Acoplalo a tu estacion. Uno por color.',
    virus: 'Averia un modulo libre, destruye uno averiado o rompe un refuerzo.',
    medicine: 'Arregla una averia, refuerza un modulo libre o blinda uno reforzado.',
  },
  stamps: { infected: 'Averiado', vaccinated: 'Reforzado', immunized: 'Blindado' },
  words: {
    organ: 'modulo',
    organs: 'modulos',
    the: 'el',
    one: 'uno',
    healthy: 'operativos',
    threat: 'averia',
    threats: 'averias',
    body: 'estacion',
  },
  lines: {
    place: '{p} acopla {card} a su estacion.',
    infect: '{p} averia {organ}.',
    remove: '{p} destruye {organ}.',
    breakShield: '{p} rompe el refuerzo de {organ}.',
    cure: '{p} repara {organ}.',
    vaccinate: '{p} refuerza {organ}.',
    immunize: '{p} blinda {organ}.',
    spread: '{p} desata {n} {threats} en las estaciones rivales.',
    quarantine: '{p} lanza un pulso electromagnetico: el resto pierde su mano.',
    malpractice: '{p} cambia de orbita con {victim}: estaciones intercambiadas.',
    win: '{p} pone en marcha su estacion y gana la partida.',
  },
  buttons: { spread: 'Desatar {n} {threats}', quarantine: 'Lanzar el pulso', malpractice: 'Cambiar de orbita' },
  ending: {
    winTitle: 'Estacion en marcha. Ganas.',
    winText: 'Cuatro modulos operativos antes que nadie.',
    loseTitle: '{p} pone en marcha su estacion.',
    loseText: 'Tu estacion se quedo a medias. La proxima ronda empieza de cero.',
  },
};

const ASEDIO: Pack = {
  id: 'asedio',
  name: 'Asedio',
  tagline: 'Defiende tu castillo mientras asaltas el de los vecinos.',
  kinds: { organ: 'Baluarte', virus: 'Asalto', medicine: 'Defensa', treatment: 'Estratagema' },
  organs: {
    red: { name: 'Armeria', art: 'la' },
    blue: { name: 'Pozo', art: 'el' },
    green: { name: 'Huerto', art: 'el' },
    yellow: { name: 'Tesoro', art: 'el' },
    wild: { name: 'Torre del homenaje', art: 'la' },
  },
  viruses: {
    red: 'Incendio',
    blue: 'Veneno',
    green: 'Saqueo',
    yellow: 'Soborno',
    wild: 'Traicion',
  },
  medicines: {
    red: 'Brigada de cubos',
    blue: 'Catador',
    green: 'Espantapajaros',
    yellow: 'Cerrojo',
    wild: 'Muralla',
  },
  treatments: {
    swap: {
      name: 'Tratado',
      text: 'Cambias un baluarte tuyo por uno de otro jugador. Ninguno puede ser inexpugnable ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Conquista',
      text: 'Tomas un baluarte de otro jugador y lo sumas a tu castillo. No sirve con baluartes inexpugnables ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Catapulta',
      text: 'Lanzas los asaltos que sufre tu castillo sobre baluartes libres de tus rivales.',
    },
    quarantine: {
      name: 'Cerco',
      text: 'Cercas los castillos rivales: descartan su mano y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Golpe de estado',
      text: 'Intercambias tu castillo entero con el de otro jugador, baluartes inexpugnables incluidos.',
    },
  },
  hints: {
    organ: 'Levantalo en tu castillo. Uno por color.',
    virus: 'Asalta un baluarte libre, arrasa uno asaltado o derriba una defensa.',
    medicine: 'Rechaza un asalto, defiende un baluarte libre o hazlo inexpugnable si ya estaba defendido.',
  },
  stamps: { infected: 'Asaltado', vaccinated: 'Defendido', immunized: 'Invicto' },
  words: {
    organ: 'baluarte',
    organs: 'baluartes',
    the: 'el',
    one: 'uno',
    healthy: 'intactos',
    threat: 'asalto',
    threats: 'asaltos',
    body: 'castillo',
  },
  lines: {
    place: '{p} levanta {card} en su castillo.',
    infect: '{p} asalta {organ}.',
    remove: '{p} arrasa {organ}.',
    breakShield: '{p} derriba la defensa de {organ}.',
    cure: '{p} rechaza el asalto a {organ}.',
    vaccinate: '{p} defiende {organ}.',
    immunize: '{p} hace inexpugnable {organ}.',
    spread: '{p} lanza {n} {threats} con la catapulta.',
    quarantine: '{p} cerca los castillos rivales: el resto pierde su mano.',
    malpractice: '{p} da un golpe de estado y cambia de castillo con {victim}.',
    win: '{p} completa su castillo y gana la partida.',
  },
  buttons: { spread: 'Lanzar {n} {threats}', quarantine: 'Cercar castillos', malpractice: 'Dar el golpe' },
  ending: {
    winTitle: 'Castillo en pie. Ganas.',
    winText: 'Cuatro baluartes intactos antes que nadie.',
    loseTitle: '{p} completa su castillo.',
    loseText: 'Tu castillo se quedo a medias. La proxima ronda empieza de cero.',
  },
};

const ARRECIFE: Pack = {
  id: 'arrecife',
  name: 'Arrecife',
  tagline: 'Criaturas del mar, vertidos y rescates bajo el agua.',
  kinds: { organ: 'Criatura', virus: 'Amenaza', medicine: 'Rescate', treatment: 'Marea' },
  organs: {
    red: { name: 'Cangrejo', art: 'el' },
    blue: { name: 'Ballena', art: 'la' },
    green: { name: 'Tortuga', art: 'la' },
    yellow: { name: 'Pez globo', art: 'el' },
    wild: { name: 'Pulpo mimetico', art: 'el' },
  },
  viruses: {
    red: 'Anzuelo',
    blue: 'Marea negra',
    green: 'Alga toxica',
    yellow: 'Plastico',
    wild: 'Vertido quimico',
  },
  medicines: {
    red: 'Veda de pesca',
    blue: 'Limpieza de costa',
    green: 'Vivero marino',
    yellow: 'Red de recogida',
    wild: 'Reserva marina',
  },
  treatments: {
    swap: {
      name: 'Simbiosis',
      text: 'Cambias una criatura tuya por una de otro jugador. Ninguna puede ser intocable ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Migracion',
      text: 'Una criatura de otro jugador migra a tu arrecife. No sirve con criaturas intocables ni si ya tienes una de ese color.',
    },
    spread: {
      name: 'Corriente',
      text: 'La corriente arrastra las amenazas de tus criaturas hasta criaturas libres de tus rivales.',
    },
    quarantine: {
      name: 'Temporal',
      text: 'Un temporal barre la mano de tus rivales: la descartan y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Tsunami',
      text: 'Intercambias tu arrecife entero con el de otro jugador, criaturas intocables incluidas.',
    },
  },
  hints: {
    organ: 'Llevala a tu arrecife. Una por color.',
    virus: 'Pon en peligro a una criatura libre, acaba con una en peligro o deshaz una proteccion.',
    medicine: 'Rescata a una criatura en peligro, protege a una libre o vuelvela intocable si ya estaba protegida.',
  },
  stamps: { infected: 'En peligro', vaccinated: 'Protegida', immunized: 'Intocable' },
  words: {
    organ: 'criatura',
    organs: 'criaturas',
    the: 'la',
    one: 'una',
    healthy: 'a salvo',
    threat: 'amenaza',
    threats: 'amenazas',
    body: 'arrecife',
  },
  lines: {
    place: '{p} lleva {card} a su arrecife.',
    infect: '{p} pone en peligro a {organ}.',
    remove: '{p} acaba con {organ}.',
    breakShield: '{p} desprotege a {organ}.',
    cure: '{p} rescata a {organ}.',
    vaccinate: '{p} protege a {organ}.',
    immunize: '{p} vuelve intocable a {organ}.',
    spread: '{p} arrastra {n} {threats} hasta sus rivales.',
    quarantine: '{p} desata un temporal: el resto pierde su mano.',
    malpractice: '{p} provoca un tsunami y cambia de arrecife con {victim}.',
    win: '{p} pone a salvo su arrecife y gana la partida.',
  },
  buttons: { spread: 'Arrastrar {n} {threats}', quarantine: 'Desatar el temporal', malpractice: 'Cambiar de arrecife' },
  ending: {
    winTitle: 'Arrecife a salvo. Ganas.',
    winText: 'Cuatro criaturas a salvo antes que nadie.',
    loseTitle: '{p} pone a salvo su arrecife.',
    loseText: 'Tu arrecife se quedo a medias. La proxima ronda empieza de cero.',
  },
};

const GRIMORIO: Pack = {
  id: 'grimorio',
  name: 'Grimorio',
  tagline: 'Cuatro elementos, maldiciones y runas que las rompen.',
  kinds: { organ: 'Elemento', virus: 'Maldicion', medicine: 'Runa', treatment: 'Conjuro' },
  organs: {
    red: { name: 'Fuego', art: 'el' },
    blue: { name: 'Agua', art: 'el' },
    green: { name: 'Bosque', art: 'el' },
    yellow: { name: 'Rayo', art: 'el' },
    wild: { name: 'Eter', art: 'el' },
  },
  viruses: {
    red: 'Ceniza',
    blue: 'Niebla negra',
    green: 'Marchitez',
    yellow: 'Estatica',
    wild: 'Vacio',
  },
  medicines: {
    red: 'Runa de brasa',
    blue: 'Runa de marea',
    green: 'Runa de raiz',
    yellow: 'Runa de trueno',
    wild: 'Runa maestra',
  },
  treatments: {
    swap: {
      name: 'Transmutacion',
      text: 'Cambias un elemento tuyo por uno de otro jugador. Ninguno puede estar sellado ni dejar a nadie con dos del mismo color.',
    },
    steal: {
      name: 'Invocacion',
      text: 'Invocas un elemento de otro jugador a tu grimorio. No sirve con elementos sellados ni si ya tienes uno de ese color.',
    },
    spread: {
      name: 'Maleficio',
      text: 'Las maldiciones de tus elementos saltan a elementos libres de tus rivales.',
    },
    quarantine: {
      name: 'Silencio',
      text: 'Un hechizo de silencio borra la mano de tus rivales: la descartan y pierden su siguiente turno robando otra.',
    },
    malpractice: {
      name: 'Espejo arcano',
      text: 'Intercambias tu grimorio entero con el de otro jugador, elementos sellados incluidos.',
    },
  },
  hints: {
    organ: 'Escribelo en tu grimorio. Uno por color.',
    virus: 'Maldice un elemento libre, destierra uno maldito o borra una runa.',
    medicine: 'Rompe una maldicion, graba una runa en un elemento libre o sellalo si ya tenia una.',
  },
  stamps: { infected: 'Maldito', vaccinated: 'Grabado', immunized: 'Sellado' },
  words: {
    organ: 'elemento',
    organs: 'elementos',
    the: 'el',
    one: 'uno',
    healthy: 'puros',
    threat: 'maldicion',
    threats: 'maldiciones',
    body: 'grimorio',
  },
  lines: {
    place: '{p} escribe {card} en su grimorio.',
    infect: '{p} maldice {organ}.',
    remove: '{p} destierra {organ}.',
    breakShield: '{p} borra la runa de {organ}.',
    cure: '{p} rompe la maldicion de {organ}.',
    vaccinate: '{p} graba una runa en {organ}.',
    immunize: '{p} sella {organ}.',
    spread: '{p} lanza {n} {threats} sobre sus rivales.',
    quarantine: '{p} conjura un silencio: el resto pierde su mano.',
    malpractice: '{p} cruza el espejo arcano y cambia de grimorio con {victim}.',
    win: '{p} completa su grimorio y gana la partida.',
  },
  buttons: { spread: 'Lanzar {n} {threats}', quarantine: 'Conjurar silencio', malpractice: 'Cruzar el espejo' },
  ending: {
    winTitle: 'Grimorio completo. Ganas.',
    winText: 'Cuatro elementos puros antes que nadie.',
    loseTitle: '{p} completa su grimorio.',
    loseText: 'Tu grimorio se quedo a medias. La proxima ronda empieza de cero.',
  },
};

export const PACKS: Record<PackId, Pack> = {
  contagio: CONTAGIO,
  heroes: HEROES,
  marvel: MARVEL,
  frutas: FRUTAS,
  cortafuegos: CORTAFUEGOS,
  orbita: ORBITA,
  asedio: ASEDIO,
  arrecife: ARRECIFE,
  grimorio: GRIMORIO,
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

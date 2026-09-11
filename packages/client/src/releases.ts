/**
 * Historial de versiones: lo que la pantalla de inicio anuncia. La primera es
 * la vigente. Se escribe para quien juega, no para quien programa: que cambia
 * en la mesa, no que archivo se toco. Textos de interfaz, asi que sin tildes.
 */
export interface Release {
  version: string;
  /** Fecha ISO (AAAA-MM-DD). */
  date: string;
  title: string;
  notes: string[];
}

export const RELEASES: Release[] = [
  {
    version: '0.5.1',
    date: '2026-09-11',
    title: 'Turnos de veinte segundos',
    notes: [
      'Cada turno dura veinte segundos en vez de un minuto. El recordatorio llega a los ocho y el reloj suena en los ultimos cinco.',
      'Los nombres largos ya no se salen de la carta en el anuncio de la jugada ni en el descarte, tampoco en el movil.',
      'El triceratops de Jurasico, redibujado de cuerpo entero: ahora se reconocen la gola y los cuernos.',
      'El panel de sonido ya no se sale de la pantalla en el movil.',
      'Los ajustes de sonido son los mismos en todas las pestanas: si silencias la musica en una, calla en las demas.',
    ],
  },
  {
    version: '0.5.0',
    date: '2026-09-11',
    title: 'Tu turno ya no pasa desapercibido',
    notes: [
      'Cuando te toca, una franja cruza la mesa, suena una llamada de metales y la barra se enciende con tu turno.',
      'Si pasan veinte segundos sin que juegues, la mesa te lo recuerda. La pestana del navegador avisa aunque estes en otra.',
      'Musica de fondo para cada paquete: marcha de metales para Heroes DC, himno para Heroes Marvel, jiga para Piratas y una pieza propia para cada uno de los demas.',
      'El boton de sonido abre un panel con el volumen de la musica y el de los efectos por separado.',
      'Esta lista de novedades, para ir contando lo que cambia.',
    ],
  },
  {
    version: '0.4.0',
    date: '2026-09-11',
    title: 'La mesa suena',
    notes: [
      'Sonidos para barajar y repartir, para cada tipo de jugada, para los ultimos diez segundos del turno y para el final.',
      'Los rivales se sientan en el orden en que juegan, vistos desde tu silla.',
      'Cada turno estrena reloj, aunque jueguen dos personas seguidas.',
    ],
  },
  {
    version: '0.3.0',
    date: '2026-09-10',
    title: 'Doce paquetes de cartas',
    notes: [
      'El anfitrion elige el mazo en la sala: Contagio, Heroes DC, Heroes Marvel, Frutero, Cortafuegos, Orbita, Asedio, Arrecife, Grimorio, Jurasico, Banda o Piratas.',
      'Cambian los nombres, los dibujos y el fondo; las reglas son las mismas.',
      'Contagio se puede jugar en contagio.emiigg.dev.',
    ],
  },
  {
    version: '0.2.0',
    date: '2026-09-09',
    title: 'Tema oscuro y un minuto por turno',
    notes: [
      'Quien abre la partida sale por sorteo.',
      'Tema claro, oscuro o el del sistema, y el instrumental de hospital de fondo.',
      'Un minuto por turno: si se agota, la mesa juega por ti.',
      'Los organos se colocan pinchando su hueco, y la negligencia medica pide confirmacion.',
      'Con cuatro rivales o mas, tambien se sientan a los costados. La mesa cabe en un movil.',
    ],
  },
  {
    version: '0.1.0',
    date: '2026-09-09',
    title: 'Primera mesa',
    notes: [
      'Partidas de dos a seis jugadores en tiempo real, con bots para completar la mesa.',
      'Reparto a la vista y cada jugada anunciada en el centro de la mesa.',
      'Si se corta la conexion, vuelves a tu asiento.',
    ],
  },
];

export const CURRENT: Release = RELEASES[0]!;

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function releaseDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`;
}

const SEEN_KEY = 'contagio.release';

/** La etiqueta de "nuevo" dura hasta que se abre el historial con esta version ya publicada. */
export function hasUnseenRelease(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) !== CURRENT.version;
  } catch {
    return false;
  }
}

export function markReleaseSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, CURRENT.version);
  } catch {
    /* modo privado: volvera a salir como nueva */
  }
}

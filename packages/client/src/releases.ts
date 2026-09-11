import type { Lang } from '@contagio/engine';

/**
 * Historial de versiones: lo que la pantalla de inicio anuncia. La primera es
 * la vigente. Se escribe para quien juega, no para quien programa: que cambia
 * en la mesa, no que archivo se toco. Textos de interfaz: el espanol sin
 * tildes, y el ingles con el mismo contenido.
 */
export interface ReleaseText {
  title: string;
  notes: string[];
}

export interface Release {
  version: string;
  /** Fecha ISO (AAAA-MM-DD). */
  date: string;
  text: Record<Lang, ReleaseText>;
}

export const RELEASES: Release[] = [
  {
    version: '0.6.0',
    date: '2026-09-11',
    text: {
      es: {
        title: 'Contagio, tambien en ingles',
        notes: [
          'Toda la interfaz, las reglas y los doce paquetes de cartas, tambien en ingles. Se cambia con el boton ES / EN y se recuerda; la primera vez manda el idioma del navegador.',
          'Cada jugador lee la mesa en su idioma: en una misma partida uno puede jugar en espanol y otro en ingles.',
          'La dificultad de los bots ahora dice Facil, Normal y Dificil, en vez de Blanda y Dura.',
        ],
      },
      en: {
        title: 'Contagio, now in English',
        notes: [
          'The whole interface, the rules and all twelve card decks, now in English too. Switch with the ES / EN button and it is remembered; the first time, your browser language decides.',
          'Each player reads the table in their own language: in the same game one can play in Spanish and another in English.',
          'Bot difficulty now reads Easy, Normal and Hard.',
        ],
      },
    },
  },
  {
    version: '0.5.1',
    date: '2026-09-11',
    text: {
      es: {
        title: 'Turnos de veinte segundos',
        notes: [
          'Cada turno dura veinte segundos en vez de un minuto. El recordatorio llega a los ocho y el reloj suena en los ultimos cinco.',
          'Los nombres largos ya no se salen de la carta en el anuncio de la jugada ni en el descarte, tampoco en el movil.',
          'El triceratops de Jurasico, redibujado de cuerpo entero: ahora se reconocen la gola y los cuernos.',
          'El panel de sonido ya no se sale de la pantalla en el movil.',
          'Los ajustes de sonido son los mismos en todas las pestanas: si silencias la musica en una, calla en las demas.',
        ],
      },
      en: {
        title: 'Twenty-second turns',
        notes: [
          'Each turn lasts twenty seconds instead of a minute. The reminder comes at eight and the clock ticks in the last five.',
          'Long names no longer spill out of the card in the move announcement or the discard pile, on mobile either.',
          'The Jurassic triceratops, redrawn full body: the frill and horns are recognizable now.',
          'The sound panel no longer runs off the screen on mobile.',
          'Sound settings are shared by every tab: mute the music in one and it stops in the others.',
        ],
      },
    },
  },
  {
    version: '0.5.0',
    date: '2026-09-11',
    text: {
      es: {
        title: 'Tu turno ya no pasa desapercibido',
        notes: [
          'Cuando te toca, una franja cruza la mesa, suena una llamada de metales y la barra se enciende con tu turno.',
          'Si pasan veinte segundos sin que juegues, la mesa te lo recuerda. La pestana del navegador avisa aunque estes en otra.',
          'Musica de fondo para cada paquete: marcha de metales para Heroes DC, himno para Heroes Marvel, jiga para Piratas y una pieza propia para cada uno de los demas.',
          'El boton de sonido abre un panel con el volumen de la musica y el de los efectos por separado.',
          'Esta lista de novedades, para ir contando lo que cambia.',
        ],
      },
      en: {
        title: 'Your turn no longer goes unnoticed',
        notes: [
          'When it is your turn, a band sweeps across the table, a brass call sounds and the top bar lights up.',
          'If twenty seconds pass without a move, the table reminds you. The browser tab tells you too, even from another tab.',
          'Background music for every deck: a brass march for DC Heroes, an anthem for Marvel Heroes, a jig for Pirates and a piece of its own for each of the rest.',
          'The sound button opens a panel with separate volumes for music and effects.',
          'This list of what\'s new, to keep track of what changes.',
        ],
      },
    },
  },
  {
    version: '0.4.0',
    date: '2026-09-11',
    text: {
      es: {
        title: 'La mesa suena',
        notes: [
          'Sonidos para barajar y repartir, para cada tipo de jugada, para los ultimos diez segundos del turno y para el final.',
          'Los rivales se sientan en el orden en que juegan, vistos desde tu silla.',
          'Cada turno estrena reloj, aunque jueguen dos personas seguidas.',
        ],
      },
      en: {
        title: 'The table has sound',
        notes: [
          'Sounds for shuffling and dealing, for each kind of move, for the last ten seconds of the turn and for the end.',
          'Rivals sit in the order they play, as seen from your chair.',
          'Every turn starts a fresh clock, even when two people play in a row.',
        ],
      },
    },
  },
  {
    version: '0.3.0',
    date: '2026-09-10',
    text: {
      es: {
        title: 'Doce paquetes de cartas',
        notes: [
          'El anfitrion elige el mazo en la sala: Contagio, Heroes DC, Heroes Marvel, Frutero, Cortafuegos, Orbita, Asedio, Arrecife, Grimorio, Jurasico, Banda o Piratas.',
          'Cambian los nombres, los dibujos y el fondo; las reglas son las mismas.',
          'Contagio se puede jugar en contagio.emiigg.dev.',
        ],
      },
      en: {
        title: 'Twelve card decks',
        notes: [
          'The host picks the deck in the room: Contagio, DC Heroes, Marvel Heroes, Fruit Bowl, Firewall, Orbit, Siege, Reef, Grimoire, Jurassic, The Band or Pirates.',
          'Names, drawings and background change; the rules stay the same.',
          'Contagio can be played at contagio.emiigg.dev.',
        ],
      },
    },
  },
  {
    version: '0.2.0',
    date: '2026-09-09',
    text: {
      es: {
        title: 'Tema oscuro y un minuto por turno',
        notes: [
          'Quien abre la partida sale por sorteo.',
          'Tema claro, oscuro o el del sistema, y el instrumental de hospital de fondo.',
          'Un minuto por turno: si se agota, la mesa juega por ti.',
          'Los organos se colocan pinchando su hueco, y la negligencia medica pide confirmacion.',
          'Con cuatro rivales o mas, tambien se sientan a los costados. La mesa cabe en un movil.',
        ],
      },
      en: {
        title: 'Dark theme and one minute per turn',
        notes: [
          'The first player is drawn at random.',
          'Light, dark or system theme, and hospital instruments in the background.',
          'One minute per turn: if it runs out, the table plays for you.',
          'Organs are placed by clicking their slot, and medical malpractice asks for confirmation.',
          'With four rivals or more, players also sit at the sides. The table fits on a phone.',
        ],
      },
    },
  },
  {
    version: '0.1.0',
    date: '2026-09-09',
    text: {
      es: {
        title: 'Primera mesa',
        notes: [
          'Partidas de dos a seis jugadores en tiempo real, con bots para completar la mesa.',
          'Reparto a la vista y cada jugada anunciada en el centro de la mesa.',
          'Si se corta la conexion, vuelves a tu asiento.',
        ],
      },
      en: {
        title: 'First table',
        notes: [
          'Real-time games for two to six players, with bots to fill the table.',
          'Cards dealt in plain sight and every move announced in the middle of the table.',
          'If your connection drops, you get your seat back.',
        ],
      },
    },
  },
];

export const CURRENT: Release = RELEASES[0]!;

const MONTHS: Record<Lang, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** "11 sep 2026" en espanol, "Sep 11, 2026" en ingles. */
export function releaseDate(iso: string, lang: Lang): string {
  const [year, month, day] = iso.split('-').map(Number);
  const name = MONTHS[lang][(month ?? 1) - 1];
  return lang === 'en' ? `${name} ${day}, ${year}` : `${day} ${name} ${year}`;
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

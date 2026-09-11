import { useSyncExternalStore } from 'react';

import { isLang } from '@contagio/engine';
import type { BotDifficulty, Lang, Localized, Pack } from '@contagio/engine';

/**
 * Idioma de la interfaz. Es de quien juega, no de la sala: en una misma mesa
 * cada cual lee en el suyo, porque el motor redacta cada jugada en todos.
 * Empieza en el del navegador y se queda fijo en cuanto alguien lo elige.
 */

/** La misma clave que lee el script en linea de index.html. */
export const LANG_KEY = 'contagio.lang';

function detect(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* modo privado */
  }
  const preferred = typeof navigator === 'undefined' ? 'es' : navigator.language;
  return preferred.toLowerCase().startsWith('es') ? 'es' : 'en';
}

let lang: Lang = typeof window === 'undefined' ? 'es' : detect();
const listeners = new Set<() => void>();

// La pagina declara su idioma: los lectores de pantalla pronuncian bien y el
// navegador sabe silabear los nombres largos de las cartas.
function apply(): void {
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}
apply();

export function getLang(): Lang {
  return lang;
}

export function setLang(next: Lang): void {
  lang = next;
  try {
    localStorage.setItem(LANG_KEY, next);
  } catch {
    /* modo privado: el idioma dura lo que la pestana */
  }
  apply();
  for (const fn of listeners) fn();
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  // Como el sonido, el idioma es del navegador: otra pestana puede cambiarlo.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== LANG_KEY || !isLang(event.newValue) || event.newValue === lang) return;
    lang = event.newValue;
    apply();
    for (const other of listeners) other();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => 'es' as Lang);
}

/** El texto en el idioma de ahora, para lo que llega del servidor fuera de React. */
export function pick(text: Localized): string {
  return text[lang];
}

type Words = Pack['words'];

// Textos de interfaz en espanol sin tildes, como el resto del proyecto. El
// ingles se escribe contra el tipo del espanol: si falta una clave, no compila.
const es = {
  lang: { label: 'Idioma', next: 'Cambiar a ingles' },
  common: {
    rules: 'Reglas',
    close: 'Cerrar',
    cancel: 'Cancelar',
    leave: 'Salir',
    you: 'tu',
    bot: 'bot',
    host: 'anfitrion',
    offline: 'sin conexion',
    failed: 'Algo ha fallado',
  },
  net: {
    noResponse: 'El servidor no responde',
    unknown: 'Error desconocido',
    offline: 'Sin conexion con el servidor',
    wins: (p: string) => `${p} gana la partida.`,
  },
  home: {
    lead: 'Cuatro organos sanos sobre la mesa y la partida es tuya. El problema son los otros cinco laboratorios intentando lo mismo, con virus en la mano.',
    specimen: 'Los cuatro organos del cuerpo',
    howTo: 'Como se juega',
    nameLabel: 'Tu nombre en la mesa',
    namePlaceholder: 'Dra. Marin',
    create: 'Crear sala',
    or: 'o entra con un codigo',
    code: 'Codigo',
    join: 'Entrar',
    needName: 'Escribe un nombre para la mesa.',
    badCode: 'El codigo de sala tiene 4 caracteres.',
    cantJoin: 'No se pudo entrar',
    connecting: 'Conectando con el servidor.',
    news: 'novedades',
    fresh: 'nuevo',
    history: 'Historial de versiones',
  },
  lobby: {
    title: 'Sala abierta',
    lead: (min: number, max: number) => `Comparte el codigo o rellena la mesa con bots. De ${min} a ${max} jugadores.`,
    copyTitle: 'Copiar codigo',
    copied: 'copiado',
    copy: 'copiar',
    copyByHand: (code: string) => `Copia el codigo a mano: ${code}`,
    remove: 'Quitar',
    emptySeat: 'Asiento libre',
    packs: 'Paquete de cartas',
    difficulty: 'Dificultad de los bots',
    levels: { easy: 'Facil', normal: 'Normal', hard: 'Dificil' } as Record<BotDifficulty, string>,
    addBot: 'Anadir bot',
    start: 'Empezar partida',
    hostStarts: 'El anfitrion decide cuando empieza la partida.',
    leave: 'Salir de la sala',
  },
  table: {
    room: (code: string) => `sala ${code}`,
    yourTurn: 'Tu turno',
    plays: (p: string) => `Juega ${p}`,
    remind: 'Te toca jugar',
    tabTitle: '● Tu turno · Contagio',
    rivalsLeft: 'Rivales a tu izquierda',
    rivalsTop: 'Rivales enfrente',
    rivalsRight: 'Rivales a tu derecha',
    deck: (n: number) => `mazo · ${n}`,
    discard: (n: number) => `descarte · ${n}`,
    empty: 'vacia',
    yourBody: (w: Words) => `Tu ${w.body}`,
    yourTurnTag: 'tu turno',
    healthy: (n: number, w: Words) => `${n}/4 ${w.organs} ${w.healthy}`,
    dealing: 'Repartiendo cartas.',
    lastMoves: 'Ultimas jugadas',
    noCards: 'Sin cartas: robaras al empezar tu turno.',
    place: (card: string) => `Colocar ${card}`,
    changeMine: (w: Words) => `Cambiar mi ${w.organ}`,
    discardCards: 'Descartar cartas',
    drop: (n: number) => (n === 0 ? 'Soltar cartas' : `Soltar ${n} ${n === 1 ? 'carta' : 'cartas'}`),
    confirmLabel: 'Confirmar jugada',
    malpracticeAsk: (p: string) =>
      `Cambias toda tu mesa por la de ${p}: te llevas lo suyo con todo lo que tenga encima, y le dejas lo tuyo.`,
    seatTarget: (card: string, p: string) => `${card}: cambiarlo todo con ${p}`,
    handCount: (n: number) => `${n} cartas en mano`,
    ended: 'fin de la partida',
    tieTitle: 'Se acaban las cartas. Tablas.',
    tieText: 'Nadie reunio ventaja suficiente antes de que se agotara el mazo.',
    rematch: 'Otra partida',
    home: 'Volver al inicio',
  },
  guide: {
    over: 'Partida terminada.',
    waiting: (p: string) => `Esperando a ${p}.`,
    rival: 'el rival',
    discarding: 'Marca las cartas que quieras soltar y confirma el descarte.',
    pick: 'Elige una carta de tu mano.',
    stuck: 'Ninguna carta se puede jugar: descarta las que no te sirvan.',
    noTarget: (card: string) => `${card} no tiene objetivo valido. Prueba con otra carta.`,
    swapFirst: (w: Words) => `Elige primero ${w.one} de tus ${w.organs} para el intercambio.`,
    swapSecond: (w: Words) => `Ahora elige ${w.the} ${w.organ} rival que quieres a cambio.`,
    virus: (w: Words) => `Elige ${w.the} ${w.organ} que quieres atacar.`,
    medicine: (w: Words) => `Elige ${w.the} ${w.organ} que quieres proteger.`,
    steal: (w: Words) => `Elige ${w.the} ${w.organ} rival que te llevas.`,
    malpractice: 'Elige la mesa del jugador con quien lo cambias todo.',
    organ: (w: Words) => `Coloca ${w.the} ${w.organ} en su hueco de tu ${w.body}.`,
  },
  organ: {
    placeHere: (label: string) => `Colocar aqui: ${label}`,
    placeAria: (label: string) => `Colocar ${label} en su hueco`,
    empty: (label: string) => `${label}: sin colocar`,
    emptyAria: (label: string) => `${label} sin colocar`,
    free: 'libre',
  },
  clock: (s: number) => `Quedan ${s} segundos de turno`,
  deal: { shuffle: 'Barajando', deal: 'Repartiendo', skip: 'Saltar' },
  sound: {
    button: 'Sonido y musica',
    title: 'Sonido',
    group: 'Volumen',
    music: 'Musica',
    effects: 'Efectos',
    muted: 'Todo en silencio.',
    musicOff: 'Musica apagada.',
    playing: (title: string) => `Suena: ${title}`,
    outside: 'La musica suena dentro de una sala.',
    unmute: 'Activar sonido',
    mute: 'Silenciar todo',
  },
  theme: {
    label: { system: 'Tema del sistema', light: 'Tema claro', dark: 'Tema oscuro' },
    short: { system: 'Auto', light: 'Claro', dark: 'Oscuro' },
    title: (label: string) => `${label}. Pulsa para cambiar.`,
    aria: (label: string) => `${label}. Pulsa para cambiar de tema.`,
  },
  releases: { title: 'Novedades', label: 'Historial de versiones', current: 'actual' },
  rules: {
    title: 'Como se juega',
    label: 'Reglas de Contagio',
    base: { organ: 'Organo', virus: 'Virus', medicine: 'Medicina', treatment: 'Tratamiento' },
    viruses: 'Virus',
    medicines: 'Medicinas',
    treatments: 'Tratamientos',
    pack: (name: string) => `Paquete ${name}`,
    packIntro: 'Cambian los nombres y los dibujos, no las reglas. Cada carta equivale a una de siempre:',
    playsAs: (base: string) => ` juega como ${base.toLowerCase()}.`,
    goal: 'Objetivo',
    goalText:
      'Gana quien primero tenga cuatro organos sanos de distinto color sobre la mesa. Un organo esta sano mientras no tenga un virus encima: libre, vacunado o inmune cuentan igual.',
    turn: 'El turno',
    turnText: 'Juegas una carta o descartas las que quieras. Despues robas hasta tener tres en la mano y pasas.',
    virusRules: [
      'Sobre un organo libre: lo infecta.',
      'Sobre un organo ya infectado: lo extirpa; organo y virus van al descarte.',
      'Sobre un organo vacunado: destruye la vacuna en vez de infectar.',
    ],
    medicineRules: [
      'Sobre un organo infectado: lo cura.',
      'Sobre un organo libre: lo vacuna. Hara falta un virus extra para tumbarlo.',
      'Sobre un organo vacunado: lo inmuniza. Ya nada puede tocarlo.',
    ],
    details: 'Detalles que deciden partidas',
    detailRules: [
      'Nunca puedes tener dos organos del mismo color.',
      'El organo comodin vale como cualquier color; los virus y medicinas comodin, tambien.',
      'Un organo inmune no se roba, no se intercambia y no se infecta.',
    ],
    note: 'Contagio es un proyecto de portafolio con reglas propias inspiradas en el genero de cartas de sabotaje. Ilustraciones y textos originales.',
  },
};

export type Strings = typeof es;

const en: Strings = {
  lang: { label: 'Language', next: 'Switch to Spanish' },
  common: {
    rules: 'Rules',
    close: 'Close',
    cancel: 'Cancel',
    leave: 'Leave',
    you: 'you',
    bot: 'bot',
    host: 'host',
    offline: 'offline',
    failed: 'Something went wrong',
  },
  net: {
    noResponse: 'The server is not responding',
    unknown: 'Unknown error',
    offline: 'No connection to the server',
    wins: (p) => `${p} wins the game.`,
  },
  home: {
    lead: 'Four healthy organs on the table and the game is yours. The trouble is the other five labs trying the same thing, with viruses in hand.',
    specimen: 'The four organs of the body',
    howTo: 'How to play',
    nameLabel: 'Your name at the table',
    namePlaceholder: 'Dr. Marin',
    create: 'Create room',
    or: 'or join with a code',
    code: 'Code',
    join: 'Join',
    needName: 'Type a name for the table.',
    badCode: 'Room codes have 4 characters.',
    cantJoin: 'Could not join',
    connecting: 'Connecting to the server.',
    news: 'what\'s new',
    fresh: 'new',
    history: 'Version history',
  },
  lobby: {
    title: 'Room open',
    lead: (min, max) => `Share the code or fill the table with bots. ${min} to ${max} players.`,
    copyTitle: 'Copy code',
    copied: 'copied',
    copy: 'copy',
    copyByHand: (code) => `Copy the code by hand: ${code}`,
    remove: 'Remove',
    emptySeat: 'Empty seat',
    packs: 'Card deck',
    difficulty: 'Bot difficulty',
    levels: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
    addBot: 'Add bot',
    start: 'Start game',
    hostStarts: 'The host decides when the game starts.',
    leave: 'Leave room',
  },
  table: {
    room: (code) => `room ${code}`,
    yourTurn: 'Your turn',
    plays: (p) => `${p} is playing`,
    remind: 'Your move',
    tabTitle: '● Your turn · Contagio',
    rivalsLeft: 'Rivals on your left',
    rivalsTop: 'Rivals across the table',
    rivalsRight: 'Rivals on your right',
    deck: (n) => `deck · ${n}`,
    discard: (n) => `discard · ${n}`,
    empty: 'empty',
    yourBody: (w) => `Your ${w.body}`,
    yourTurnTag: 'your turn',
    healthy: (n, w) => `${n}/4 ${w.healthy} ${w.organs}`,
    dealing: 'Dealing cards.',
    lastMoves: 'Latest moves',
    noCards: 'No cards: you will draw when your turn starts.',
    place: (card) => `Place ${card}`,
    changeMine: (w) => `Change my ${w.organ}`,
    discardCards: 'Discard cards',
    drop: (n) => (n === 0 ? 'Drop cards' : `Drop ${n} ${n === 1 ? 'card' : 'cards'}`),
    confirmLabel: 'Confirm move',
    malpracticeAsk: (p) =>
      `You trade your whole table for ${p}'s: you take theirs with everything on it, and they get yours.`,
    seatTarget: (card, p) => `${card}: trade everything with ${p}`,
    handCount: (n) => `${n} cards in hand`,
    ended: 'game over',
    tieTitle: 'The cards run out. A draw.',
    tieText: 'Nobody got far enough ahead before the deck ran out.',
    rematch: 'Play again',
    home: 'Back to start',
  },
  guide: {
    over: 'Game over.',
    waiting: (p) => `Waiting for ${p}.`,
    rival: 'your rival',
    discarding: 'Mark the cards you want to drop and confirm the discard.',
    pick: 'Pick a card from your hand.',
    stuck: 'No card can be played: discard the ones you do not need.',
    noTarget: (card) => `${card} has no valid target. Try another card.`,
    swapFirst: (w) => `First pick one of your ${w.organs} for the swap.`,
    swapSecond: (w) => `Now pick the rival ${w.organ} you want in exchange.`,
    virus: (w) => `Pick the ${w.organ} you want to attack.`,
    medicine: (w) => `Pick the ${w.organ} you want to protect.`,
    steal: (w) => `Pick the rival ${w.organ} you are taking.`,
    malpractice: 'Pick the table of the player you trade everything with.',
    organ: (w) => `Place the ${w.organ} in its slot in your ${w.body}.`,
  },
  organ: {
    placeHere: (label) => `Place here: ${label}`,
    placeAria: (label) => `Place ${label} in its slot`,
    empty: (label) => `${label}: not placed`,
    emptyAria: (label) => `${label} not placed`,
    free: 'free',
  },
  clock: (s) => `${s} seconds left in the turn`,
  deal: { shuffle: 'Shuffling', deal: 'Dealing', skip: 'Skip' },
  sound: {
    button: 'Sound and music',
    title: 'Sound',
    group: 'Volume',
    music: 'Music',
    effects: 'Effects',
    muted: 'Everything muted.',
    musicOff: 'Music off.',
    playing: (title) => `Now playing: ${title}`,
    outside: 'Music plays once you are in a room.',
    unmute: 'Turn sound on',
    mute: 'Mute everything',
  },
  theme: {
    label: { system: 'System theme', light: 'Light theme', dark: 'Dark theme' },
    short: { system: 'Auto', light: 'Light', dark: 'Dark' },
    title: (label) => `${label}. Click to change.`,
    aria: (label) => `${label}. Click to change the theme.`,
  },
  releases: { title: 'What\'s new', label: 'Version history', current: 'current' },
  rules: {
    title: 'How to play',
    label: 'Contagio rules',
    base: { organ: 'Organ', virus: 'Virus', medicine: 'Medicine', treatment: 'Treatment' },
    viruses: 'Viruses',
    medicines: 'Medicines',
    treatments: 'Treatments',
    pack: (name) => `${name} deck`,
    packIntro: 'The names and the drawings change, the rules do not. Each card works like a classic one:',
    playsAs: (base) => ` plays as ${/^[aeiou]/i.test(base) ? 'an' : 'a'} ${base.toLowerCase()}.`,
    goal: 'Goal',
    goalText:
      'The first player with four healthy organs of different colors on the table wins. An organ is healthy as long as it has no virus on it: free, vaccinated or immune all count the same.',
    turn: 'Your turn',
    turnText: 'Play one card or discard as many as you like. Then draw back up to three cards and pass.',
    virusRules: [
      'On a free organ: infects it.',
      'On an infected organ: removes it; organ and virus go to the discard pile.',
      'On a vaccinated organ: destroys the vaccine instead of infecting.',
    ],
    medicineRules: [
      'On an infected organ: cures it.',
      'On a free organ: vaccinates it. It will take an extra virus to bring it down.',
      'On a vaccinated organ: immunizes it. Nothing can touch it anymore.',
    ],
    details: 'Details that decide games',
    detailRules: [
      'You can never have two organs of the same color.',
      'The wild organ counts as any color; so do wild viruses and wild medicines.',
      'An immune organ cannot be stolen, swapped or infected.',
    ],
    note: 'Contagio is a portfolio project with its own rules, inspired by the medical sabotage card game genre. Original illustrations and text.',
  },
};

export const STRINGS: Record<Lang, Strings> = { es, en };

export function useT(): Strings {
  return STRINGS[useLang()];
}

/** Los textos del idioma de ahora, para codigo que no es un componente. */
export function strings(): Strings {
  return STRINGS[lang];
}

import type { Localized } from '@contagio/engine';

/**
 * Lo que el servidor le dice a quien juega, en todos los idiomas: cada cliente
 * muestra el suyo. Los motivos por los que el motor rechaza una jugada no
 * salen de aqui: son para quien programa, y la interfaz solo ofrece jugadas
 * legales, asi que a quien juega le basta con saber que ya no vale.
 */
export const MSG = {
  full: (max: number): Localized => ({
    es: `Ahora mismo hay ${max} partidas en marcha, que es el tope de este servidor. Intentalo dentro de un rato.`,
    en: `There are ${max} games running right now, the most this server can hold. Try again in a little while.`,
  }),
  tooFew: (min: number): Localized => ({
    es: `Hacen falta al menos ${min} jugadores`,
    en: `At least ${min} players are needed`,
  }),
  tooMany: (max: number): Localized => ({
    es: `El maximo son ${max} jugadores`,
    en: `The limit is ${max} players`,
  }),
  noSuchRoom: { es: 'No existe ninguna sala con ese codigo', en: 'There is no room with that code' },
  alreadyStarted: { es: 'La partida ya ha empezado', en: 'The game has already started' },
  notStarted: { es: 'La partida no ha empezado', en: 'The game has not started yet' },
  roomFull: { es: 'La sala esta llena', en: 'The room is full' },
  roomGone: { es: 'La sala ya no existe', en: 'That room no longer exists' },
  badCredentials: { es: 'Credenciales no validas para esta sala', en: 'Those credentials are not valid for this room' },
  notInRoom: { es: 'No estas en ninguna sala', en: 'You are not in a room' },
  hostAddsBots: { es: 'Solo el anfitrion puede anadir bots', en: 'Only the host can add bots' },
  hostKicks: { es: 'Solo el anfitrion puede expulsar', en: 'Only the host can remove players' },
  hostSetsDifficulty: { es: 'Solo el anfitrion decide la dificultad', en: 'Only the host sets the difficulty' },
  badDifficulty: { es: 'Dificultad no valida', en: 'Unknown difficulty' },
  hostPicksPack: { es: 'Solo el anfitrion elige el paquete', en: 'Only the host picks the deck' },
  badPack: { es: 'Paquete no valido', en: 'Unknown deck' },
  hostStarts: { es: 'Solo el anfitrion puede empezar', en: 'Only the host can start the game' },
  hostReopens: { es: 'Solo el anfitrion puede repetir', en: 'Only the host can start a rematch' },
  notOver: { es: 'La partida sigue en marcha', en: 'The game is still going' },
  invalidMove: { es: 'Esa jugada ya no es valida', en: 'That move is no longer valid' },
  timedOut: { es: 'Se agoto tu tiempo: la mesa ha jugado por ti.', en: 'Your time ran out: the table played for you.' },
} satisfies Record<string, Localized | ((n: number) => Localized)>;

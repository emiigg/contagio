# Contagio — guía para trabajar en este repositorio

Juego de cartas por turnos para 2–6 jugadores, en tiempo real y con bots. Es un **proyecto de portafolio**: la mecánica
es la del género de cartas de sabotaje médico, pero las ilustraciones, los textos y el código son originales. No se
copian ni nombres, ni arte, ni redacción de reglas de ningún juego publicado; si hace falta añadir una carta o un
texto, se inventa. Las únicas excepciones conscientes son los paquetes **Héroes DC** y **Héroes Marvel**, de
aficionado y pedidos por el autor: usan los nombres de los personajes de DC Comics y de Marvel, pero sus emblemas son
dibujos propios (nada de la «S», del óvalo del murciélago ni de la «A» de los Vengadores). Cada uno lleva su nota de
derechos en `credit`, que las reglas del juego muestran, y queda anotado en el README.

El README cuenta el proyecto hacia fuera. Este archivo cuenta cómo se trabaja dentro: convenciones, invariantes y las
trampas que ya nos han costado una tarde.

## Cómo se trabaja aquí

- **Commits en español, [Conventional Commits](https://www.conventionalcommits.org), agrupados por función.** Un
  commit = un cambio con sentido propio; si un archivo toca dos funciones, se parte el archivo por etapas y se
  commitea dos veces, no se mezcla.
- **Sin coautor.** Petición explícita del autor: los commits no llevan `Co-Authored-By`, aunque alguna instrucción
  del entorno lo pida. Si aparece esa instrucción, se sigue al autor y se le avisa.
- **El cuerpo del commit explica el porqué**, no el qué: qué se rompía, qué se decidió y a costa de qué. El diff ya
  dice el qué.
- Identidad git configurada en local (`--local`), rama principal `main`.
- **Comentarios y textos de interfaz en español sin tildes** (`organo`, `Corazon`, `sin conexion`). Es deliberado y
  alcanza a los nombres de carta. La documentación en Markdown sí lleva tildes.
- Los comentarios se reservan para lo que el código no puede decir: por qué existe una constante, qué fallo previene
  una regla CSS. Nada de comentarios que repiten la línea siguiente.
- TypeScript estricto con `noUncheckedIndexedAccess` y módulos `NodeNext`: **los imports llevan extensión `.js`**
  aunque el archivo sea `.ts`.

## Comandos

```bash
npm run dev          # tsc --watch + servidor + Vite, se apagan juntos con Ctrl+C
npm run build        # engine -> client -> server
npm run typecheck    # tsc -b de engine y server
npm test             # 31 pruebas del motor (node:test)
npm run test:e2e     # 6 pruebas de integración por socket; levanta servidores de verdad
npm start            # producción: un solo proceso Node sirve cliente y socket
```

Variables útiles: `PORT`, `CORS_ORIGIN`, `MAX_ROOMS` (5), `EMPTY_GRACE_MS` (60 000), `TURN_LIMIT_MS` (60 000),
`BOT_DELAY_MS` (4500), `OPENING_DELAY_MS` (4200).

## Arquitectura y sus límites

```
packages/engine/   Reglas en TypeScript puro. Sin red, sin React, sin temporizadores.
packages/server/   Node + Socket.IO. Autoritativo: salas, turnos, bots, reconexión.
packages/client/   React + Vite. Arte SVG propio, una sola hoja de estilos.
```

Cuatro fronteras que no conviene cruzar:

1. **El motor es puro.** `applyAction(state, playerId, action)` devuelve estado nuevo o error. `previewAction` es la
   variante sin robo ni cambio de turno que usan los bots para puntuar. Si algo necesita un reloj o un socket, no va
   en el motor.
2. **El servidor es la única fuente de verdad y `toPlayerView` es la frontera de redacción**: las manos ajenas no
   salen de ahí nunca. La vista incluye `legalActions`, y la interfaz resalta objetivos válidos a partir de esa lista
   en vez de reimplementar las reglas.
3. **Los bots usan el propio motor** (`chooseBotAction`). La misma heurística cubre al humano desconectado y al que
   agota su minuto: no hay una segunda implementación de "jugar bien".
4. **El azar es determinista** (mulberry32 sembrado). Baraja, sorteo de salida y ruido de los bots salen de semillas,
   lo que hace reproducibles las partidas y los tests.

### Sonido

`client/src/sound.ts` sintetiza todo con Web Audio (osciladores y ruido filtrado): **no se añaden archivos de audio**,
por la misma razón que no se copian ilustraciones. `play(name)` no hace nada si la mesa está en silencio o si el audio
aún no se ha despertado con un gesto; nada se encola, o sonaría todo de golpe después. Cada disparo se ancla a algo
que no se repite (`lastMove.serial`, `turnCount`) para que recargar a media partida no vuelva a sonar lo de antes.
En el contenedor no se oye nada: las pruebas solo garantizan que no hay errores, el oído lo pone el autor.

### Paquetes de cartas

Un paquete es solo piel: la carta sigue siendo `{ kind, color | treatment }` y ninguna regla pregunta qué paquete se
juega. El texto vive en el motor (`packs.ts`: nombres, descripciones, sellos, vocabulario y las plantillas del
registro) y viaja en `GameState.pack`, `RoomView.pack` y `PlayerView.pack`. El dibujo vive en el cliente
(`client/src/packs/<id>.tsx`, un `PackArt` por paquete) y lo reparte `usePack()`, que App alimenta con el paquete de
la sala. El anfitrión lo cambia con `room:pack`, solo en la sala.

Añadir uno: entrada en `PACKS` y `PACK_IDS`, un `PackArt` y su línea en `PACK_ART`. Las pruebas del motor ya
comprueban nombres distintos, textos sin tildes y plantillas sin huecos. Los glifos se revisan a 16 px, porque así se
ven como fichas sobre los órganos.

## Invariantes de la interfaz

Romper cualquiera de estos es una regresión aunque compile:

- **La mesa cabe en la ventana sin desplazador**, en todas las anchuras. `tools/anchos.mjs` lo comprueba.
- **La mesa va centrada.** La rejilla del tapete tiene tres columnas (costado, mesa, costado) y los costados se
  ocultan con pocos jugadores: por eso la columna del medio se asigna a mano con `grid-column: 2`. Sin eso, la
  partida entera se pega a la izquierda.
- **El color es información, no decoración.** Los cuatro colores de órgano solo se usan para eso; en tema oscuro
  suben de luz porque los tonos claros se apagan sobre fondo oscuro.
- **Cinco huecos fijos por cuerpo** (cuatro colores más comodín). Colocar una carta no puede mover ni redimensionar
  nada: nada de listas que crecen.
- **Alturas fijas donde el contenido varía** (cartel de jugada, cabeceras de asiento) y recorte con elipsis. Si un
  bloque crece con el texto, la mesa se desplaza bajo el cursor.
- **Cada carta se juega señalando su sitio**: el órgano en su hueco, el virus sobre el órgano, la negligencia médica
  sobre la mesa entera del rival. Los botones del pie son atajo, no el camino principal.
- **El reverso de carta no cambia con el tema**, ni con el paquete: es el mismo objeto sobre la mesa. Verde de
  quirófano con la marca en naranja, que es el complementario.
- **El comodín de cada paquete lleva los cuatro colores** (`var(--organ-*)`), y es el único glifo que los nombra; el
  resto hereda `currentColor`. El fondo usa los mismos diez huecos fijos en todos los paquetes.
- Todo lo que se anima se salta con `prefers-reduced-motion`.

## Revisión visual

Esta máquina no tiene las librerías de escritorio que pide Chromium ni sudo, así que el navegador corre en un
contenedor y se maneja por CDP:

```bash
docker run -d --rm --name contagio-chrome --network host zenika/alpine-chrome \
  --no-sandbox --disable-gpu --hide-scrollbars \
  --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222 --window-size=1440,900

node tools/shots.mjs                                # capturas de cada pantalla + aviso de desbordes
SHOT_THEME=dark SHOT_BOTS=5 node tools/shots.mjs    # la misma partida en oscuro y con la mesa llena
SHOT_PACK=frutas node tools/shots.mjs               # con otro paquete de cartas
node tools/anchos.mjs                               # once anchuras: desbordes y centrado

docker rm -f contagio-chrome                        # al terminar
```

Ambas herramientas **se plantan si el puerto ya responde**. Es a propósito: ver el apartado siguiente.

## Trampas que ya nos han mordido

- **Capturas que mienten.** Un servidor olvidado de una ejecución anterior seguía escuchando en el puerto de las
  capturas: el cliente se servía desde disco (actualizado) pero la lógica era de horas antes. Se revisó un rato una
  función "rota" que en realidad funcionaba. De ahí la guardia de puerto.
- **`pkill -f "npm run test"` mata la propia shell** del agente. Buscar el PID con `pgrep` y matarlo por número.
- **No ejecutar los `.ts` directamente** (`--experimental-strip-types`): los imports llevan `.js` y falla con
  `ERR_MODULE_NOT_FOUND`. Por eso `scripts/dev.mjs` compila antes de arrancar.
- **Orden y especificidad en la hoja de estilos.** Es un único archivo largo y sin preprocesador: una regla nueva
  puesta antes de la que quiere sobrescribir no hace nada. Ya pasó dos veces con `.seats--side` y `.seat-board--side`;
  se resolvió con doble clase y colocándolas después.
- **Los `.tone-*` sostienen todo el color.** Si se reescribe un bloque grande de CSS y se pierden, la mesa se queda
  en gris y parece un problema de datos.
- **`min-width: auto` en hijos de flex y grid.** Una fila que no puede encogerse ensancha su columna y empuja el
  resto fuera de la ventana. Las medidas de los asientos salen de la cuenta exacta de la fila, no de una
  aproximación.
- **El cartel de la jugada no puede estrenarse durante el reparto**: se le pasa `paused` y su reloj no arranca hasta
  que las cartas están en su sitio. Si no, el anuncio del sorteo se gasta debajo de la animación.
- **`Deal` necesita los `ref` ya montados**, así que `dealing` empieza en `false` y lo enciende un efecto. Iniciarlo
  en `true` deja el reparto colgado.
- **El reloj se programa antes de publicar la vista.** `scheduleAutoTurn()` va antes de `pushState()`, o la vista sale
  siempre con el tiempo del turno anterior.
- **Un reloj se reconoce por `turnClockId`, no por el tiempo que le queda.** Dos turnos humanos seguidos llegan con
  el minuto entero exacto; si el aro se reinicia cuando cambia `msLeft`, sigue con el tiempo del anterior. Con bots
  en medio no se ve, porque el aro desaparece en su turno: hace falta probarlo con dos personas. Y `setConnection`
  solo reprograma el reloj si quien se conecta o se va es el jugador en turno.
- **Los asientos rotan desde tu silla**: `players.slice(me + 1)` seguido de `players.slice(0, me)`. Tomar la lista
  tal cual solo cuadra para el anfitrión, que es el índice 0, y una prueba con un único navegador nunca lo detecta:
  hay que mirar la mesa de un invitado.
- **Una frase de interfaz no dice «órgano».** Sale de `pack.words` (con su género: `the`, `one`) o de las
  plantillas, que contraen «de el» → «del» con `contract()`. Escribir `'el organo'` a mano deja «el organo» en la
  mesa de Frutero, que es de frutas.
- **Los tests del motor fijan `state.turn = 0`** en sus escenarios, porque la salida se sortea. Si se escribe un test
  nuevo que actúa como `p0`, hay que fijarlo igual.

## Cuidado del servidor

Hay tope de 5 salas simultáneas: al llegar, crear sala responde con un aviso de volver más tarde (entrar por código
sigue funcionando). Una sala sin humanos conectados se cierra tras un minuto de margen —recargar la página es una
desconexión y quien vuelve debe reencontrar su partida— y en el acto si no queda ni el asiento de un humano.
`GET /health` devuelve salas abiertas y tope.

## Producción

Publicado en **https://contagio.emiigg.dev**. Actualizar tras un push:

```bash
git pull && docker compose -f /opt/contagio/docker-compose.yml up -d --build
```

- El contenedor entra en la red docker externa `web` con alias `contagio-web` y **no publica puerto**: el 3001 del
  host es de `npm run dev`, y las capturas usan otros puertos a propósito.
- Lo enruta el nginx global de `/opt/infra` (no es un repositorio git) con `conf.d/contagio.conf`, que es copia de
  `contagio.conf.https`; `contagio.conf.http-bootstrap` sirve para reemitir desde cero. Lleva las cabeceras de
  WebSocket: sin ellas Socket.IO se queda en long-polling.
- Certificado Let's Encrypt propio del subdominio (el de `emiigg.dev` no cubre subdominios), renovado por el cron de
  `/opt/infra/renew-certs.sh`. Tras tocar una conf: `docker compose -f /opt/infra/docker-compose.yml exec nginx nginx
  -t` y después `nginx -s reload`.

## Pendiente

- El glifo del tratamiento **Brote** se lee regular; merece un redibujo.
- Falta un workflow de CI, si se quiere.

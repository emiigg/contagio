import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

import type {
  Action,
  BotDifficulty,
  ClientToServerEvents,
  Localized,
  PackId,
  PlayerView,
  RoomView,
  ServerToClientEvents,
} from '@contagio/engine';

import { pick, strings } from './i18n';

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const SESSION_KEY = 'contagio.session';

interface Session {
  code: string;
  playerId: string;
  token: string;
  name: string;
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null): void {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* modo privado: seguimos sin persistencia */
  }
}

export interface Toast {
  id: number;
  message: string;
  kind: 'info' | 'error';
}

/** Promesa sobre el ack de socket.io, para poder usar async/await en la UI. */
function request<K extends keyof ClientToServerEvents>(
  socket: GameSocket,
  event: K,
  payload: Parameters<ClientToServerEvents[K]>[0],
): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(strings().net.noResponse)), 8000);
    (socket.emit as any)(event, payload, (response: { ok: boolean; data?: unknown; error?: Localized }) => {
      clearTimeout(timeout);
      if (response.ok) resolve(response.data);
      else reject(new Error(response.error ? pick(response.error) : strings().net.unknown));
    });
  });
}

export function useContagio() {
  const socketRef = useRef<GameSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<RoomView | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(() => readSession()?.playerId ?? null);
  const [view, setView] = useState<PlayerView | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [name, setName] = useState(() => readSession()?.name ?? '');
  const toastId = useRef(0);

  const pushToast = useCallback((message: string, kind: Toast['kind'] = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200);
  }, []);

  useEffect(() => {
    const socket: GameSocket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      // Volver al asiento tras recargar o perder la conexion.
      const session = readSession();
      if (!session) return;
      request(socket, 'room:resume', { code: session.code, playerId: session.playerId, token: session.token })
        .then((data: { room: RoomView }) => {
          setRoom(data.room);
          setPlayerId(session.playerId);
        })
        .catch(() => {
          writeSession(null);
          setPlayerId(null);
        });
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('room:state', setRoom);
    socket.on('game:view', setView);
    socket.on('game:over', ({ winnerName }) => pushToast(strings().net.wins(winnerName)));
    socket.on('toast', ({ message, kind }) => pushToast(pick(message), kind));

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [pushToast]);

  const call = useCallback(
    async <K extends keyof ClientToServerEvents>(event: K, payload: Parameters<ClientToServerEvents[K]>[0]) => {
      const socket = socketRef.current;
      if (!socket) throw new Error(strings().net.offline);
      return request(socket, event, payload);
    },
    [],
  );

  const actions = useMemo(
    () => ({
      async createRoom(playerName: string) {
        const data = await call('room:create', { name: playerName });
        writeSession({ code: data.room.code, playerId: data.playerId, token: data.token, name: playerName });
        setName(playerName);
        setPlayerId(data.playerId);
        setRoom(data.room);
      },
      async joinRoom(code: string, playerName: string) {
        const data = await call('room:join', { code, name: playerName });
        writeSession({ code: data.room.code, playerId: data.playerId, token: data.token, name: playerName });
        setName(playerName);
        setPlayerId(data.playerId);
        setRoom(data.room);
      },
      addBot: () => call('room:addBot', {} as never),
      removePlayer: (playerId: string) => call('room:removePlayer', { playerId }),
      setDifficulty: (difficulty: BotDifficulty) => call('room:difficulty', { difficulty }),
      setPack: (pack: PackId) => call('room:pack', { pack }),
      start: () => call('room:start', {} as never),
      rematch: () => call('room:rematch', {} as never),
      async leave() {
        await call('room:leave', {} as never).catch(() => undefined);
        writeSession(null);
        setPlayerId(null);
        setRoom(null);
        setView(null);
      },
      play: (action: Action) => call('game:action', { action }),
    }),
    [call],
  );

  return { connected, room, view, playerId, toasts, name, setName, actions, pushToast };
}

export type Contagio = ReturnType<typeof useContagio>;

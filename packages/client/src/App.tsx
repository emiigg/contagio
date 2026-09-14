import { useState } from 'react';

import { DEFAULT_PACK } from '@contagio/engine';

import { Backdrop } from './components/Backdrop';
import { Home } from './components/Home';
import { Lobby } from './components/Lobby';
import { Releases } from './components/Releases';
import { Rules } from './components/Rules';
import { Table } from './components/Table';
import { useMusic } from './music';
import { useContagio } from './net';
import { PackProvider } from './packs';

export default function App() {
  const { connected, room, view, playerId, toasts, name, actions } = useContagio();
  const [showRules, setShowRules] = useState(false);
  const [showReleases, setShowReleases] = useState(false);

  const youId = playerId ?? view?.youId ?? null;
  const isHost = Boolean(room && youId && room.players.some((p) => p.id === youId && p.isHost));
  const inGame = room && view && room.status !== 'lobby';

  // La musica es la del paquete de la sala, desde que se entra en ella: en la
  // sala misma sirve para oir cada paquete antes de elegirlo.
  useMusic(room?.pack ?? null);

  return (
    // El paquete de la sala viste toda la pantalla, fondo incluido, en cuanto
    // el anfitrion lo elige: la sala sirve tambien de muestra.
    <PackProvider value={room?.pack ?? DEFAULT_PACK}>
      <div className="app">
        <Backdrop />

        {!room && (
          <Home
            name={name}
            connected={connected}
            onCreate={actions.createRoom}
            onJoin={actions.joinRoom}
            onShowRules={() => setShowRules(true)}
            onShowReleases={() => setShowReleases(true)}
          />
        )}

        {room && !inGame && (
          <Lobby
            room={room}
            youId={youId}
            onAddBot={actions.addBot}
            onRemove={actions.removePlayer}
            onDifficulty={actions.setDifficulty}
            onPack={actions.setPack}
            onTurnLimit={actions.setTurnLimit}
            onStart={actions.start}
            onLeave={() => void actions.leave()}
            onShowRules={() => setShowRules(true)}
          />
        )}

        {room && inGame && view && (
          <Table
            view={view}
            room={room}
            isHost={isHost}
            onPlay={actions.play}
            onReopen={() => void actions.reopen()}
            onLeave={() => void actions.leave()}
            onShowRules={() => setShowRules(true)}
          />
        )}

        {showRules && <Rules onClose={() => setShowRules(false)} />}
        {showReleases && <Releases onClose={() => setShowReleases(false)} />}

        <div className="toasts" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <p key={toast.id} className={`toast ${toast.kind === 'error' ? 'toast--error' : ''}`}>
              {toast.message}
            </p>
          ))}
        </div>
      </div>
    </PackProvider>
  );
}

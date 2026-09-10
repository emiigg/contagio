import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const SERVER = process.env.VITE_SERVER_URL ?? 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // El socket va al servidor de juego; asi el cliente usa siempre rutas relativas.
    proxy: { '/socket.io': { target: SERVER, ws: true, changeOrigin: true } },
  },
  build: { outDir: 'dist', sourcemap: true },
});

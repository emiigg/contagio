/**
 * Entorno de desarrollo con tres procesos que se apagan juntos con Ctrl+C:
 *   1. tsc en modo watch, que recompila engine y server
 *   2. el servidor de juego, que se reinicia cuando cambia su salida compilada
 *   3. Vite, para el cliente
 *
 * Se compila en vez de ejecutar los .ts directamente: los imports de TypeScript
 * llevan extension .js (lo que exige el modo NodeNext) y el interprete no las
 * traduce a .ts al vuelo.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const serverEntry = resolve(root, 'packages/server/dist/index.js');

const children = [];
let closing = false;

function run(name, command, args, options = {}) {
  const child = spawn(command, args, { cwd: root, stdio: 'inherit', ...options });
  child.on('exit', (code, signal) => {
    if (closing) return;
    if (code) console.error(`[contagio] ${name} termino con codigo ${code}${signal ? ` (${signal})` : ''}`);
    shutdown();
  });
  children.push(child);
  return child;
}

function shutdown() {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill('SIGTERM');
  setTimeout(() => process.exit(0), 250);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// 1. Compilacion continua de engine + server.
run('tsc', 'npx', ['tsc', '-b', 'packages/engine', 'packages/server', '--watch', '--preserveWatchOutput']);

// 3. El cliente no depende de la compilacion del servidor: arranca ya.
run('client', npm, ['run', 'dev', '--workspace=@contagio/client']);

// 2. El servidor espera a que exista su primera compilacion.
const waitForBuild = setInterval(() => {
  if (closing) return clearInterval(waitForBuild);
  if (!existsSync(serverEntry)) return;
  clearInterval(waitForBuild);
  console.log('[contagio] arrancando servidor de juego');
  run('server', process.execPath, ['--watch', serverEntry]);
}, 300);

setTimeout(() => {
  if (!existsSync(serverEntry) && !closing) {
    console.error('[contagio] la compilacion del servidor no termino a tiempo; revisa los errores de tsc');
  }
}, 30_000).unref();

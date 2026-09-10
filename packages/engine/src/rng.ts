/**
 * PRNG determinista (mulberry32). Permite repetir una partida a partir de la
 * semilla, lo que hace que los tests del motor sean reproducibles.
 */
export function nextRandom(seed: number): { value: number; seed: number } {
  let t = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return { value: ((r ^ (r >>> 14)) >>> 0) / 4294967296, seed: t };
}

/** Fisher-Yates con la semilla del estado; devuelve la semilla avanzada. */
export function shuffle<T>(items: T[], seed: number): { items: T[]; seed: number } {
  const out = items.slice();
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    const r = nextRandom(s);
    s = r.seed;
    const j = Math.floor(r.value * (i + 1));
    const a = out[i]!;
    out[i] = out[j]!;
    out[j] = a;
  }
  return { items: out, seed: s };
}

export function randomSeed(): number {
  return (Math.random() * 2 ** 31) | 0;
}

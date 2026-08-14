/**
 * Generador pseudo-aleatorio determinístico: la misma "seed" (ej. el id
 * de un partido) siempre da el mismo resultado. Así los datos de ejemplo
 * no cambian de golpe en cada request, pero tampoco están hardcodeados
 * a mano uno por uno.
 */
export function seededRandom(seed: string): number {
  // Mezcla al estilo Murmur: sin este "avalanche" final, dos seeds parecidas
  // (ej. "...-home" y "...-away") daban números casi idénticos y los
  // partidos terminaban siempre empatados.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(hash ^ seed.charCodeAt(i), 2654435761);
  }
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0xffffffff;
}

/** Cantidad de goles con una distribución parecida a la de un partido real */
export function goalsFromSeed(seed: string): number {
  const r = seededRandom(seed);
  if (r < 0.28) return 0;
  if (r < 0.55) return 1;
  if (r < 0.78) return 2;
  if (r < 0.92) return 3;
  return 4;
}

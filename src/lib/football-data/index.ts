import { mockAdapter } from "@/lib/football-data/adapters/mock-adapter";
import type { FootballDataAdapter } from "@/lib/football-data/adapters/adapter";

/**
 * ============================================================
 *  ACÁ SE ENCHUFA LA API REAL DE RESULTADOS, EL DÍA QUE EXISTA
 * ============================================================
 *
 * Hoy `footballData` usa `mockAdapter`, que inventa partidos con fechas
 * relativas a "ahora" (están en ./mock). El resto de la app (las
 * pantallas, los componentes) llama SIEMPRE a las funciones de este
 * archivo, nunca a los datos mock directamente — por eso alcanza con
 * cambiar una línea acá para pasar a datos reales, sin tocar ninguna
 * pantalla.
 *
 * Pasos para conectar una API real (ej. API-Football, Football-Data.org,
 * o la que se contrate):
 *
 *   1. Crear `./adapters/api-real-adapter.ts` que implemente la interfaz
 *      `FootballDataAdapter` (mismos métodos que `mockAdapter`, ver
 *      ./adapters/adapter.ts), haciendo fetch a la API real y
 *      transformando su respuesta al shape de `../types.ts`.
 *   2. Guardar la clave de la API como variable de entorno (nunca
 *      hardcodeada en el código), ej. `FOOTBALL_API_KEY` en `.env.local`
 *      y en Vercel.
 *   3. Cambiar la línea de abajo:
 *
 *        const adapter: FootballDataAdapter = mockAdapter;
 *
 *      por:
 *
 *        const adapter: FootballDataAdapter =
 *          process.env.FOOTBALL_API_KEY ? realAdapter : mockAdapter;
 *
 * Lo que se necesita para el paso 1, en su momento: la clave/token de la
 * API, su documentación de endpoints, y confirmar que cubre las 4
 * categorías de fútbol argentino (Liga Profesional, Primera Nacional,
 * Primera B Metropolitana, Federal A) — varias APIs gratuitas solo
 * cubren Primera.
 */
const adapter: FootballDataAdapter = mockAdapter;

export const getCategories = adapter.getCategories;
export const getAllTeams = adapter.getAllTeams;
export const getTeamsByCategory = adapter.getTeamsByCategory;
export const getTeam = adapter.getTeam;
export const getMatch = adapter.getMatch;
export const getMatchesByCategory = adapter.getMatchesByCategory;
export const getLiveMatchesToday = adapter.getLiveMatchesToday;
export const getTodayMatches = adapter.getTodayMatches;
export const getStandings = adapter.getStandings;
export const getRecentResultsForTeam = adapter.getRecentResultsForTeam;
export const getNextMatchForTeam = adapter.getNextMatchForTeam;

export type { FootballDataAdapter } from "@/lib/football-data/adapters/adapter";
export * from "@/lib/football-data/types";

/**
 * Shape de los datos de fútbol. Está pensado para calzar con lo que
 * devolvería una API real de resultados (tipo API-Football o
 * Football-Data.org): mismos campos, mismos nombres, mismo tipo de
 * fecha (ISO 8601 en UTC). El día que se conecte una API real, solo
 * hace falta escribir un adapter nuevo en `./adapters` que devuelva
 * estos mismos tipos — nada de las pantallas debería cambiar.
 */

export type CategorySlug =
  | "liga-profesional"
  | "primera-nacional"
  | "primera-b-metropolitana"
  | "federal-a";

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  /** 1 = Primera, 2 = Primera Nacional, 3 = las dos ligas de Tercera */
  division: 1 | 2 | 3;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  /** 2-3 letras para el escudo placeholder (no usamos logos reales) */
  code: string;
  city: string;
  categorySlug: CategorySlug;
  /** color primario del club, para el escudo placeholder */
  color: string;
}

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface MatchScore {
  home: number;
  away: number;
}

export interface Match {
  id: string;
  categorySlug: CategorySlug;
  round: string;
  /** ISO 8601 (UTC) */
  kickoff: string;
  status: MatchStatus;
  /** minuto de juego, solo si status === "live" */
  minute?: number;
  homeTeamId: string;
  awayTeamId: string;
  score: MatchScore | null;
  venue?: string;
}

export type StandingZone = "promotion" | "relegation" | "playoff" | null;

export interface StandingRow {
  teamId: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  zone: StandingZone;
}

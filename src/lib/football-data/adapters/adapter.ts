import type {
  Category,
  CategorySlug,
  Match,
  StandingRow,
  Team,
} from "@/lib/football-data/types";

/**
 * Contrato que tiene que cumplir cualquier fuente de datos de fútbol,
 * sea mock (hoy) o una API real (mañana). Todas las funciones son
 * async a propósito, aunque el mock no lo necesite: una API real va a
 * requerir un fetch, y así las pantallas no cambian ni un carácter el
 * día que se reemplace el adapter.
 */
export interface FootballDataAdapter {
  getCategories(): Promise<Category[]>;
  getAllTeams(): Promise<Team[]>;
  getTeamsByCategory(categorySlug: CategorySlug): Promise<Team[]>;
  getTeam(teamId: string): Promise<Team | null>;
  getMatch(matchId: string): Promise<Match | null>;
  getMatchesByCategory(categorySlug: CategorySlug): Promise<Match[]>;
  getLiveMatchesToday(): Promise<Match[]>;
  getTodayMatches(): Promise<Match[]>;
  getStandings(categorySlug: CategorySlug): Promise<StandingRow[]>;
  getRecentResultsForTeam(teamId: string, limit?: number): Promise<Match[]>;
  getNextMatchForTeam(teamId: string): Promise<Match | null>;
}

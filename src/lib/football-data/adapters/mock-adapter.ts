import type { FootballDataAdapter } from "@/lib/football-data/adapters/adapter";
import { categories } from "@/lib/football-data/mock/categories";
import { teamById, teams, teamsByCategory } from "@/lib/football-data/mock/teams";
import { buildMockMatches } from "@/lib/football-data/mock/matches";
import { buildStandings } from "@/lib/football-data/mock/standings";
import type { CategorySlug } from "@/lib/football-data/types";

function isSameLocalDay(isoDate: string, reference: Date): boolean {
  const date = new Date(isoDate);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

export const mockAdapter: FootballDataAdapter = {
  async getCategories() {
    return categories;
  },

  async getAllTeams() {
    return teams;
  },

  async getTeamsByCategory(categorySlug: CategorySlug) {
    return teamsByCategory(categorySlug);
  },

  async getTeam(teamId: string) {
    return teamById(teamId) ?? null;
  },

  async getMatch(matchId: string) {
    return buildMockMatches().find((m) => m.id === matchId) ?? null;
  },

  async getMatchesByCategory(categorySlug: CategorySlug) {
    return buildMockMatches().filter((m) => m.categorySlug === categorySlug);
  },

  async getLiveMatchesToday() {
    return buildMockMatches().filter((m) => m.status === "live");
  },

  async getTodayMatches() {
    const now = new Date();
    return buildMockMatches()
      .filter((m) => isSameLocalDay(m.kickoff, now))
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  },

  async getStandings(categorySlug: CategorySlug) {
    return buildStandings(categorySlug);
  },

  async getRecentResultsForTeam(teamId: string, limit = 5) {
    return buildMockMatches()
      .filter(
        (m) =>
          m.status === "finished" && (m.homeTeamId === teamId || m.awayTeamId === teamId),
      )
      .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime())
      .slice(0, limit);
  },

  async getNextMatchForTeam(teamId: string) {
    const upcoming = buildMockMatches()
      .filter(
        (m) =>
          (m.status === "scheduled" || m.status === "live") &&
          (m.homeTeamId === teamId || m.awayTeamId === teamId),
      )
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
    return upcoming[0] ?? null;
  },
};

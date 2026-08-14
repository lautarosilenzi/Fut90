import { type CategorySlug, type StandingRow, type StandingZone } from "@/lib/football-data/types";
import { teamsByCategory } from "@/lib/football-data/mock/teams";
import { buildMockMatches } from "@/lib/football-data/mock/matches";

function zoneFor(categorySlug: CategorySlug, position: number, total: number): StandingZone {
  if (categorySlug === "liga-profesional") {
    return position > total - 2 ? "relegation" : null;
  }
  if (position <= 2) return "promotion";
  if (position <= 6) return "playoff";
  if (position > total - 2) return "relegation";
  return null;
}

export function buildStandings(categorySlug: CategorySlug): StandingRow[] {
  const finished = buildMockMatches().filter(
    (m) => m.categorySlug === categorySlug && m.status === "finished" && m.score,
  );

  const table = new Map<string, StandingRow>();
  teamsByCategory(categorySlug).forEach((team) => {
    table.set(team.id, {
      teamId: team.id,
      position: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      zone: null,
    });
  });

  for (const match of finished) {
    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away || !match.score) continue;

    home.played += 1;
    away.played += 1;
    home.goalsFor += match.score.home;
    home.goalsAgainst += match.score.away;
    away.goalsFor += match.score.away;
    away.goalsAgainst += match.score.home;

    if (match.score.home > match.score.away) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.score.home < match.score.away) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  const rows = [...table.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffA = a.goalsFor - a.goalsAgainst;
    const diffB = b.goalsFor - b.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    return b.goalsFor - a.goalsFor;
  });

  rows.forEach((row, index) => {
    row.position = index + 1;
    row.zone = zoneFor(categorySlug, index + 1, rows.length);
  });

  return rows;
}

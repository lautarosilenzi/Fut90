import { type CategorySlug, type Match, type MatchStatus } from "@/lib/football-data/types";
import { teamsByCategory } from "@/lib/football-data/mock/teams";
import { goalsFromSeed } from "@/lib/football-data/mock/random";
import { categories } from "@/lib/football-data/mock/categories";

/**
 * Emparejamientos por fecha usando el método del círculo (round-robin
 * estándar): con N equipos da N-1 fechas donde cada equipo juega una
 * vez contra cada rival. Alcanza y sobra para tener datos de ejemplo
 * variados sin repetir partidos dentro de la misma fecha.
 */
function roundRobinRounds(teamIds: string[], roundCount: number): [string, string][][] {
  const arr = [...teamIds];
  const n = arr.length;
  const rounds: [string, string][][] = [];

  for (let r = 0; r < roundCount; r++) {
    const pairs: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const home = arr[i];
      const away = arr[n - 1 - i];
      // alterna localía fecha a fecha para que no siempre juegue de local el mismo
      pairs.push(r % 2 === 0 ? [home, away] : [away, home]);
    }
    rounds.push(pairs);

    const fixed = arr[0];
    const rest = arr.slice(1);
    rest.unshift(rest.pop() as string);
    arr.splice(0, arr.length, fixed, ...rest);
  }

  return rounds;
}

/** índice de fecha que representa "hoy" dentro de las rondas generadas */
const TODAY_ROUND_INDEX = 5;
const ROUNDS_TO_GENERATE = 9;

const KICKOFF_HOURS = [15, 17, 19, 21];

// Ancla de los partidos "en vivo": se fija una sola vez cuando arranca
// el proceso, así el minuto avanza de verdad con el reloj real mientras
// el server sigue corriendo, en vez de quedar pegado en el mismo valor.
const BOOT_TIME = Date.now();
const LIVE_MATCHES: Record<CategorySlug, number | undefined> = {
  "liga-profesional": 34,
  "primera-nacional": 61,
  "primera-b-metropolitana": undefined,
  "federal-a": undefined,
};

function atTime(base: Date, hour: number): Date {
  const d = new Date(base);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function buildMatchesForCategory(categorySlug: CategorySlug, now: Date): Match[] {
  const teamIds = teamsByCategory(categorySlug).map((t) => t.id);
  const rounds = roundRobinRounds(teamIds, ROUNDS_TO_GENERATE);
  const matches: Match[] = [];

  rounds.forEach((pairs, roundIndex) => {
    const offsetWeeks = roundIndex - TODAY_ROUND_INDEX;
    const roundBaseDate = addDays(now, offsetWeeks * 7);
    const isToday = roundIndex === TODAY_ROUND_INDEX;
    const isPast = roundIndex < TODAY_ROUND_INDEX;
    const isFuture = roundIndex > TODAY_ROUND_INDEX;

    pairs.forEach(([homeTeamId, awayTeamId], matchIndex) => {
      const id = `${categorySlug}-r${roundIndex}-${homeTeamId}-vs-${awayTeamId}`;
      const dayOffsetWithinRound = matchIndex % 2;
      const hour = KICKOFF_HOURS[matchIndex % KICKOFF_HOURS.length];

      let status: MatchStatus = "scheduled";
      let kickoff: Date;
      let minute: number | undefined;
      let score: Match["score"] = null;

      if (isPast) {
        kickoff = atTime(addDays(roundBaseDate, dayOffsetWithinRound), hour);
        status = "finished";
        score = { home: goalsFromSeed(`${id}-home`), away: goalsFromSeed(`${id}-away`) };
      } else if (isFuture) {
        kickoff = atTime(addDays(roundBaseDate, dayOffsetWithinRound), hour);
        status = "scheduled";
      } else if (isToday) {
        const liveMinuteAtBoot = LIVE_MATCHES[categorySlug];
        const isTheLiveMatch = liveMinuteAtBoot != null && matchIndex === 2;

        if (isTheLiveMatch) {
          kickoff = new Date(BOOT_TIME - liveMinuteAtBoot! * 60_000);
          status = "live";
          const elapsedMinutes = Math.floor((Date.now() - kickoff.getTime()) / 60_000);
          minute = Math.min(90, Math.max(1, elapsedMinutes));
          score = {
            home: Math.min(4, Math.round((goalsFromSeed(`${id}-home`) * minute) / 90)),
            away: Math.min(4, Math.round((goalsFromSeed(`${id}-away`) * minute) / 90)),
          };
        } else if (matchIndex < 3) {
          // partidos ya jugados hoy, más temprano
          kickoff = atTime(now, [13, 15, 15.5][matchIndex] ?? 15);
          status = "finished";
          score = { home: goalsFromSeed(`${id}-home`), away: goalsFromSeed(`${id}-away`) };
        } else if (matchIndex < 5) {
          // partidos de esta noche, todavía no arrancaron
          kickoff = atTime(now, 20);
          status = "scheduled";
        } else {
          // la fecha se extiende al día siguiente, como pasa en la realidad
          kickoff = atTime(addDays(now, 1), 17);
          status = "scheduled";
        }
      } else {
        kickoff = atTime(addDays(roundBaseDate, dayOffsetWithinRound), hour);
        status = "scheduled";
      }

      matches.push({
        id,
        categorySlug,
        round: `Fecha ${roundIndex + 1}`,
        kickoff: kickoff.toISOString(),
        status,
        minute,
        homeTeamId,
        awayTeamId,
        score,
      });
    });
  });

  return matches;
}

export function buildMockMatches(): Match[] {
  const now = new Date();
  return categories.flatMap((category) => buildMatchesForCategory(category.slug, now));
}

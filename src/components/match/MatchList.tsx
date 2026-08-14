import { type Match, type Team } from "@/lib/football-data";
import { MatchCard } from "@/components/match/MatchCard";

export function MatchList({
  matches,
  teamMap,
  emptyMessage = "No hay partidos para mostrar.",
}: {
  matches: Match[];
  teamMap: Map<string, Team>;
  emptyMessage?: string;
}) {
  if (matches.length === 0) {
    return <p className="py-6 text-center text-sm text-neutral-500">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {matches.map((match) => {
        const homeTeam = teamMap.get(match.homeTeamId);
        const awayTeam = teamMap.get(match.awayTeamId);
        if (!homeTeam || !awayTeam) return null;

        return (
          <MatchCard key={match.id} match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
        );
      })}
    </div>
  );
}

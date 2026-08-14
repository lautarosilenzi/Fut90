import Link from "next/link";
import { type Match, type Team } from "@/lib/football-data";
import { TeamCrest } from "@/components/team/TeamCrest";
import { LiveBadge, Badge } from "@/components/ui/Badge";
import { formatMatchDay, formatMatchTime } from "@/lib/utils/format";

function TeamRow({ team, score, isWinner }: { team: Team; score?: number; isWinner?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <TeamCrest team={team} size="sm" />
        <span
          className={`truncate text-sm ${isWinner ? "font-semibold text-neutral-50" : "text-neutral-200"}`}
        >
          {team.shortName}
        </span>
      </div>
      {score != null && (
        <span className="tabular-score text-base font-semibold text-neutral-50">{score}</span>
      )}
    </div>
  );
}

export function MatchCard({
  match,
  homeTeam,
  awayTeam,
}: {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) {
  const homeWins = match.score != null && match.score.home > match.score.away;
  const awayWins = match.score != null && match.score.away > match.score.home;

  return (
    <Link
      href={`/partido/${match.id}`}
      className="block rounded-2xl border border-neutral-800 bg-neutral-900 p-4 transition-colors hover:border-neutral-700"
    >
      <div className="mb-3 flex items-center justify-between text-xs text-neutral-500">
        <span>{match.round}</span>
        {match.status === "live" && <LiveBadge minute={match.minute} />}
        {match.status === "finished" && (
          <Badge className="bg-neutral-800 text-neutral-300">Final</Badge>
        )}
        {match.status === "scheduled" && (
          <span>
            {formatMatchDay(match.kickoff)} · {formatMatchTime(match.kickoff)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <TeamRow team={homeTeam} score={match.score?.home} isWinner={homeWins} />
        <TeamRow team={awayTeam} score={match.score?.away} isWinner={awayWins} />
      </div>
    </Link>
  );
}

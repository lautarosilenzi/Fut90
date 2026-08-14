import { type Match, type Team } from "@/lib/football-data";
import { TeamCrest } from "@/components/team/TeamCrest";
import { LiveBadge, Badge } from "@/components/ui/Badge";
import { formatMatchDay, formatMatchTime } from "@/lib/utils/format";

function TeamColumn({ team, align }: { team: Team; align: "left" | "right" }) {
  return (
    <div className={`flex flex-1 flex-col items-center gap-2 ${align === "left" ? "text-right sm:text-center" : "text-left sm:text-center"}`}>
      <TeamCrest team={team} size="lg" />
      <span className="text-sm font-medium text-neutral-100 sm:text-base">{team.shortName}</span>
    </div>
  );
}

export function ScoreBoard({
  match,
  homeTeam,
  awayTeam,
}: {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="mb-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <span>{match.round}</span>
        <span aria-hidden>·</span>
        {match.status === "live" && <LiveBadge minute={match.minute} />}
        {match.status === "finished" && <Badge className="bg-neutral-800 text-neutral-300">Final</Badge>}
        {match.status === "scheduled" && (
          <span>
            {formatMatchDay(match.kickoff)} · {formatMatchTime(match.kickoff)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <TeamColumn team={homeTeam} align="left" />
        <div className="font-display text-4xl tabular-score text-neutral-50 sm:text-5xl">
          {match.score ? `${match.score.home} - ${match.score.away}` : "vs"}
        </div>
        <TeamColumn team={awayTeam} align="right" />
      </div>
    </div>
  );
}

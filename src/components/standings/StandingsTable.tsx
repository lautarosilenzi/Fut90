import Link from "next/link";
import { type StandingRow, type Team } from "@/lib/football-data";
import { TeamCrest } from "@/components/team/TeamCrest";

const zoneBar: Record<string, string> = {
  promotion: "border-l-success",
  playoff: "border-l-accent-500",
  relegation: "border-l-danger",
};

export function StandingsTable({
  rows,
  teamMap,
}: {
  rows: StandingRow[];
  teamMap: Map<string, Team>;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <table className="w-full min-w-[560px] border-separate border-spacing-y-1 text-sm">
        <thead>
          <tr className="text-left text-xs text-neutral-500">
            <th className="w-8 px-2 py-1 font-normal">#</th>
            <th className="px-2 py-1 font-normal">Equipo</th>
            <th className="px-2 py-1 text-center font-normal">PJ</th>
            <th className="px-2 py-1 text-center font-normal">G</th>
            <th className="px-2 py-1 text-center font-normal">E</th>
            <th className="px-2 py-1 text-center font-normal">P</th>
            <th className="px-2 py-1 text-center font-normal">GF</th>
            <th className="px-2 py-1 text-center font-normal">GC</th>
            <th className="px-2 py-1 text-center font-normal">DIF</th>
            <th className="px-2 py-1 text-center font-semibold text-neutral-300">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = teamMap.get(row.teamId);
            if (!team) return null;
            const diff = row.goalsFor - row.goalsAgainst;

            return (
              <tr
                key={row.teamId}
                className={`border-l-4 bg-neutral-900 ${row.zone ? zoneBar[row.zone] : "border-l-transparent"}`}
              >
                <td className="rounded-l-xl px-2 py-2 tabular-score text-neutral-400">
                  {row.position}
                </td>
                <td className="px-2 py-2">
                  <Link href={`/equipos/${team.id}`} className="flex items-center gap-2">
                    <TeamCrest team={team} size="sm" />
                    <span className="truncate font-medium text-neutral-100">{team.shortName}</span>
                  </Link>
                </td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.played}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.won}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.drawn}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.lost}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.goalsFor}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">{row.goalsAgainst}</td>
                <td className="tabular-score px-2 py-2 text-center text-neutral-300">
                  {diff > 0 ? `+${diff}` : diff}
                </td>
                <td className="tabular-score rounded-r-xl px-2 py-2 text-center font-semibold text-neutral-50">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
        <Legend color="bg-success" label="Ascenso" />
        <Legend color="bg-accent-500" label="Reducido" />
        <Legend color="bg-danger" label="Descenso" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

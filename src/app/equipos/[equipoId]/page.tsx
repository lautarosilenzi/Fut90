import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllTeams,
  getNextMatchForTeam,
  getRecentResultsForTeam,
  getTeam,
} from "@/lib/football-data";
import { TeamCrest } from "@/components/team/TeamCrest";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MatchList } from "@/components/match/MatchList";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ equipoId: string }>;
}): Promise<Metadata> {
  const { equipoId } = await params;
  const team = await getTeam(equipoId);
  return { title: team?.name ?? "Equipo" };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ equipoId: string }>;
}) {
  const { equipoId } = await params;
  const team = await getTeam(equipoId);
  if (!team) notFound();

  const [recentResults, nextMatch, allTeams] = await Promise.all([
    getRecentResultsForTeam(team.id, 5),
    getNextMatchForTeam(team.id),
    getAllTeams(),
  ]);
  const teamMap = new Map(allTeams.map((t) => [t.id, t]));

  return (
    <div className="flex flex-col gap-6">
      <section className="flex items-center gap-4">
        <TeamCrest team={team} size="lg" />
        <div>
          <h1 className="font-display text-2xl tracking-wide text-neutral-50">{team.name}</h1>
          <p className="text-sm text-neutral-400">{team.city}</p>
        </div>
      </section>

      {nextMatch && (
        <section>
          <SectionHeading title="Próximo partido" />
          <MatchList matches={[nextMatch]} teamMap={teamMap} />
        </section>
      )}

      <section>
        <SectionHeading title="Últimos resultados" />
        <MatchList
          matches={recentResults}
          teamMap={teamMap}
          emptyMessage="Todavía no hay resultados cargados para este equipo."
        />
      </section>
    </div>
  );
}

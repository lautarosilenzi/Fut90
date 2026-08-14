import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMatch, getTeam } from "@/lib/football-data";
import { ScoreBoard } from "@/components/match/ScoreBoard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChatSection } from "@/components/chat/ChatSection";

export const dynamic = "force-dynamic";

async function getMatchTeamsOrNotFound(partidoId: string) {
  const match = await getMatch(partidoId);
  if (!match) notFound();
  const [homeTeam, awayTeam] = await Promise.all([
    getTeam(match.homeTeamId),
    getTeam(match.awayTeamId),
  ]);
  if (!homeTeam || !awayTeam) notFound();
  return { match, homeTeam, awayTeam };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ partidoId: string }>;
}): Promise<Metadata> {
  const { partidoId } = await params;
  const match = await getMatch(partidoId);
  if (!match) return { title: "Partido" };
  const [homeTeam, awayTeam] = await Promise.all([
    getTeam(match.homeTeamId),
    getTeam(match.awayTeamId),
  ]);
  return { title: `${homeTeam?.shortName ?? ""} vs ${awayTeam?.shortName ?? ""}` };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ partidoId: string }>;
}) {
  const { partidoId } = await params;
  const { match, homeTeam, awayTeam } = await getMatchTeamsOrNotFound(partidoId);

  return (
    <div className="flex flex-col gap-6">
      <ScoreBoard match={match} homeTeam={homeTeam} awayTeam={awayTeam} />
      <section>
        <SectionHeading title="Chat del hincha" />
        <ChatSection match={match} />
      </section>
    </div>
  );
}

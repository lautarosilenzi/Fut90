import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getStandings, getTeamsByCategory } from "@/lib/football-data";
import { CategoryTabs } from "@/components/match/CategoryTabs";
import { StandingsTable } from "@/components/standings/StandingsTable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);
  return { title: category ? `Posiciones — ${category.shortName}` : "Posiciones" };
}

export default async function StandingsByCategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);
  if (!category) notFound();

  const [rows, teams] = await Promise.all([
    getStandings(category.slug),
    getTeamsByCategory(category.slug),
  ]);
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl tracking-wide text-neutral-50">Posiciones</h1>
      <CategoryTabs categories={categories} activeSlug={category.slug} basePath="/posiciones" />
      <StandingsTable rows={rows} teamMap={teamMap} />
    </div>
  );
}

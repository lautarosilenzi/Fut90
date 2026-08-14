import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategories,
  getMatchesByCategory,
  getTeamsByCategory,
} from "@/lib/football-data";
import { CategoryTabs } from "@/components/match/CategoryTabs";
import { MatchList } from "@/components/match/MatchList";

export const dynamic = "force-dynamic";

async function getCategoryOrNotFound(categoria: string) {
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);
  if (!category) notFound();
  return { category, categories };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categoria);
  return { title: category ? `Fixture — ${category.shortName}` : "Fixture" };
}

export default async function FixtureByCategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const { category, categories } = await getCategoryOrNotFound(categoria);

  const [matches, teams] = await Promise.all([
    getMatchesByCategory(category.slug),
    getTeamsByCategory(category.slug),
  ]);
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  const upcoming = matches
    .filter((m) => m.status === "scheduled" || m.status === "live")
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl tracking-wide text-neutral-50">Fixture</h1>
      <CategoryTabs categories={categories} activeSlug={category.slug} basePath="/partidos" />
      <MatchList
        matches={upcoming}
        teamMap={teamMap}
        emptyMessage="No hay próximos partidos cargados para esta categoría todavía."
      />
    </div>
  );
}

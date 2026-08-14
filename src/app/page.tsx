import { getAllTeams, getCategories, getTodayMatches } from "@/lib/football-data";
import { MatchList } from "@/components/match/MatchList";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Los resultados en vivo cambian todo el tiempo: esta página se renderiza
// en cada visita, nunca queda una versión vieja cacheada de "hoy".
export const dynamic = "force-dynamic";

const todayFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function HomePage() {
  const [todayMatches, categories, allTeams] = await Promise.all([
    getTodayMatches(),
    getCategories(),
    getAllTeams(),
  ]);

  const teamMap = new Map(allTeams.map((t) => [t.id, t]));
  const liveMatches = todayMatches.filter((m) => m.status === "live");
  const todayLabel = todayFormatter.format(new Date());

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="font-display text-3xl tracking-wide text-neutral-50">Resultados de hoy</h1>
        <p className="text-sm text-neutral-400 capitalize">{todayLabel}</p>
      </section>

      {liveMatches.length > 0 && (
        <section>
          <SectionHeading title="En vivo" />
          <MatchList matches={liveMatches} teamMap={teamMap} />
        </section>
      )}

      {categories.map((category) => {
        const matches = todayMatches.filter(
          (m) => m.categorySlug === category.slug && m.status !== "live",
        );
        if (matches.length === 0) return null;

        return (
          <section key={category.slug}>
            <SectionHeading title={category.shortName} href={`/partidos/${category.slug}`} />
            <MatchList matches={matches} teamMap={teamMap} />
          </section>
        );
      })}

      {todayMatches.length === 0 && (
        <p className="py-10 text-center text-sm text-neutral-500">
          No hay partidos programados para hoy en ninguna categoría.
        </p>
      )}
    </div>
  );
}

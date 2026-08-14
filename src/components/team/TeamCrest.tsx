import { type Team } from "@/lib/football-data";

const sizes = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-16 w-16 text-lg",
};

/**
 * Escudo placeholder: no usamos logos reales de los clubes (evita
 * problemas de derechos de imagen y no depende de conseguir assets).
 * Un círculo con el color y las siglas del club cumple la misma función
 * visual — el día que haya escudos reales, esto se reemplaza por un
 * <Image> sin tocar el resto de los componentes que usan TeamCrest.
 */
export function TeamCrest({
  team,
  size = "md",
}: {
  team: Pick<Team, "code" | "color" | "shortName">;
  size?: keyof typeof sizes;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/10 font-display tracking-wide text-neutral-50 ${sizes[size]}`}
      style={{ backgroundColor: team.color }}
      title={team.shortName}
      aria-hidden
    >
      {team.code}
    </span>
  );
}

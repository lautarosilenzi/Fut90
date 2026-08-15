/** Formato de tiempo compacto al estilo timeline ("ahora", "5 min", "3 h", "2 d"). */
export function relativeTime(iso: string): string {
  const diffSec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return "ahora";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} h`;
  const diffDay = Math.round(diffHour / 24);
  if (diffDay < 7) return `${diffDay} d`;
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short" }).format(new Date(iso));
}

const fullDateTimeFormatter = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function fullDateTime(iso: string): string {
  return fullDateTimeFormatter.format(new Date(iso));
}

const joinedDateFormatter = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });

export function joinedDate(iso: string): string {
  return joinedDateFormatter.format(new Date(iso));
}

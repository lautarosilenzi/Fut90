const dayFormatter = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
const timeFormatter = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });
const dateFormatter = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short" });

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatMatchDay(isoDate: string, now = new Date()): string {
  const date = new Date(isoDate);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (isSameDay(date, now)) return "Hoy";
  if (isSameDay(date, tomorrow)) return "Mañana";

  const label = dayFormatter.format(date);
  return `${label.charAt(0).toUpperCase()}${label.slice(1)} ${dateFormatter.format(date)}`;
}

export function formatMatchTime(isoDate: string): string {
  return timeFormatter.format(new Date(isoDate));
}

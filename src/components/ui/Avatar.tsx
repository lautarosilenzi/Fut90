function initialsOf(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

const palette = [
  "bg-brand-600",
  "bg-accent-600",
  "bg-neutral-600",
  "bg-brand-800",
];

function colorFor(name: string) {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
}

export function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const dimensions = size === "sm" ? "h-6 w-6 text-[10px]" : "h-9 w-9 text-xs";

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-neutral-50 ${colorFor(name)} ${dimensions}`}
      aria-hidden
    >
      {initialsOf(name)}
    </span>
  );
}

import Image from "next/image";

function initialsOf(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

const palette = ["bg-brand-600", "bg-accent-600", "bg-neutral-600", "bg-brand-800"];

function colorFor(name: string) {
  const sum = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[sum % palette.length];
}

type Size = "sm" | "md" | "lg";

const dimensions: Record<Size, string> = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-16 w-16 text-xl",
};

const pixelSize: Record<Size, number> = { sm: 24, md: 36, lg: 64 };

export function Avatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: Size;
}) {
  if (avatarUrl) {
    return (
      <span className={`relative inline-block shrink-0 overflow-hidden rounded-full ${dimensions[size]}`}>
        <Image src={avatarUrl} alt="" fill sizes={`${pixelSize[size]}px`} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-neutral-50 ${colorFor(name)} ${dimensions[size]}`}
      aria-hidden
    >
      {initialsOf(name)}
    </span>
  );
}

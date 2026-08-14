import Link from "next/link";

export function SectionHeading({
  title,
  href,
  hrefLabel = "Ver todo",
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-xl tracking-wide text-neutral-50">{title}</h2>
      {href && (
        <Link href={href} className="text-xs font-medium text-accent-400 hover:text-accent-300">
          {hrefLabel}
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";
import { type Category } from "@/lib/football-data";

export function CategoryTabs({
  categories,
  activeSlug,
  basePath,
}: {
  categories: Category[];
  activeSlug: string;
  basePath: string;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {categories.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.slug}
            href={`${basePath}/${category.slug}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-accent-500 text-neutral-950"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            {category.shortName}
          </Link>
        );
      })}
    </div>
  );
}

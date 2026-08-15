"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { slug: "", label: "Tuits" },
  { slug: "respuestas", label: "Respuestas" },
  { slug: "media", label: "Multimedia" },
  { slug: "likes", label: "Me gusta" },
];

export function ProfileTabs({ username }: { username: string }) {
  const pathname = usePathname();
  const base = `/perfil/${username}`;

  return (
    <div className="-mx-4 flex gap-1 overflow-x-auto border-b border-neutral-800 px-4">
      {tabs.map((tab) => {
        const href = tab.slug ? `${base}/${tab.slug}` : base;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "border-accent-500 text-neutral-50"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

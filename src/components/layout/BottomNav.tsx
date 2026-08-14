"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

const items: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/",
    label: "Inicio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-5 w-5">
        <path
          d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H10v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V20h3.5a1 1 0 0 0 1-1v-9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/partidos",
    label: "Fixture",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-5 w-5">
        <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" />
        <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/posiciones",
    label: "Posiciones",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-5 w-5">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-5 w-5">
        <circle cx="12" cy="8.5" r="3.2" stroke="currentColor" />
        <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke="currentColor" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-4">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-accent-400" : "text-neutral-400"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { getCurrentUser } from "@/lib/auth/current-user";

const links = [
  { href: "/", label: "Resultados" },
  { href: "/partidos", label: "Fixture" },
  { href: "/posiciones", label: "Posiciones" },
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-300 sm:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-neutral-50">
              {link.label}
            </Link>
          ))}
        </nav>
        {user ? (
          <Link href="/perfil" className="flex items-center gap-2">
            <Avatar name={user.username} size="sm" />
            <span className="hidden text-sm font-medium text-neutral-200 sm:inline">
              @{user.username}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-brand-700 px-4 py-1.5 text-sm font-semibold text-neutral-50 hover:bg-brand-600"
          >
            Ingresar
          </Link>
        )}
      </div>
    </header>
  );
}

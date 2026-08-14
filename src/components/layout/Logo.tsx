import Link from "next/link";
import { brand } from "@/lib/branding/config";

/**
 * Isotipo de Fut90: el "90" como si fuera el marcador de un tablero de
 * estadio, pegado al nombre. Es el elemento visual que identifica a la
 * marca — si el nombre cambia algún día, esto sigue funcionando con
 * cualquier palabra corta.
 */
export function Logo({ className = "" }: { className?: string }) {
  const wordmark = brand.shortName.replace(/\d+$/, "");
  const number = brand.shortName.match(/\d+$/)?.[0];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display tracking-wide ${className}`}
    >
      <span className="text-2xl leading-none text-neutral-50">{wordmark}</span>
      {number && (
        <span className="flex h-7 min-w-7 items-center justify-center rounded-md bg-accent-500 px-1.5 text-lg leading-none text-neutral-950">
          {number}
        </span>
      )}
    </Link>
  );
}

import { type ReactNode } from "react";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function LiveBadge({ minute }: { minute?: number }) {
  return (
    <Badge className="bg-live/15 text-live">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      {minute != null ? `${minute}'` : "EN VIVO"}
    </Badge>
  );
}

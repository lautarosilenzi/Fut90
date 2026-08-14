import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400";

const variants: Record<Variant, string> = {
  primary: "bg-accent-500 text-neutral-950 hover:bg-accent-400",
  secondary: "bg-brand-700 text-neutral-50 hover:bg-brand-600",
  ghost: "bg-transparent text-neutral-100 hover:bg-neutral-800",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, keyof CommonProps> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link {...(props as ButtonAsLink)} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...(props as ButtonAsButton)} className={classes}>
      {children}
    </button>
  );
}

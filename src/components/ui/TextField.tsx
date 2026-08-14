import { type ComponentProps } from "react";

export function TextField({
  label,
  id,
  className = "",
  ...props
}: { label: string } & ComponentProps<"input">) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-neutral-300">{label}</span>
      <input
        id={id}
        className={`rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2.5 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-accent-500 ${className}`}
        {...props}
      />
    </label>
  );
}

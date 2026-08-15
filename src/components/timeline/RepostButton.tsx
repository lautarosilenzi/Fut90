"use client";

import { useState, useTransition } from "react";
import { toggleRepost } from "@/lib/timeline/actions";

export function RepostButton({
  postId,
  initialCount,
  initialReposted,
  disabled,
}: {
  postId: string;
  initialCount: number;
  initialReposted: boolean;
  disabled?: boolean;
}) {
  const [reposted, setReposted] = useState(initialReposted);
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();

  function handleClick() {
    if (disabled) return;
    const next = !reposted;
    setReposted(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const result = await toggleRepost(postId, next);
      if (result.error) {
        setReposted(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={reposted}
      className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 ${
        reposted ? "text-success" : "text-neutral-500 hover:text-success"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-[18px] w-[18px]">
        <path
          d="M6 4v9a2 2 0 0 0 2 2h10M18 4l3 3-3 3M18 20v-9a2 2 0 0 0-2-2H6M6 20l-3-3 3-3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && count}
    </button>
  );
}

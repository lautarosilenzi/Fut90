"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/timeline/actions";

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  disabled,
}: {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  disabled?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();

  function handleClick() {
    if (disabled) return;
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const result = await toggleLike(postId, next);
      if (result.error) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={liked}
      className={`flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 ${
        liked ? "text-live" : "text-neutral-500 hover:text-live"
      }`}
    >
      <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} strokeWidth={1.8} className="h-[18px] w-[18px]">
        <path
          d="M12 20.5s-7.5-4.6-9.8-9.2C.7 8 2 4.8 5.2 4.1c2-.4 3.9.5 5.1 2.2a1 1 0 0 0 1.4 0c1.2-1.7 3.1-2.6 5.1-2.2 3.2.7 4.5 3.9 3 7.2C19.5 15.9 12 20.5 12 20.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && count}
    </button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/lib/timeline/actions";
import { Button } from "@/components/ui/Button";

export function FollowButton({ userId, initialFollowing }: { userId: string; initialFollowing: boolean }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const next = !following;
    setFollowing(next);
    startTransition(async () => {
      const result = await toggleFollow(userId, next);
      if (result.error) setFollowing(!next);
    });
  }

  return (
    <Button
      type="button"
      variant={following ? "ghost" : "secondary"}
      size="sm"
      onClick={handleClick}
      disabled={pending}
      className={following ? "border border-neutral-700" : ""}
    >
      {following ? "Siguiendo" : "Seguir"}
    </Button>
  );
}

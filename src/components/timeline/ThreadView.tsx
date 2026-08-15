"use client";

import { useState } from "react";
import { PostCard } from "@/components/timeline/PostCard";
import { PostComposer } from "@/components/timeline/PostComposer";
import { fullDateTime } from "@/lib/timeline/format";
import type { TimelinePost } from "@/lib/timeline/types";
import type { CurrentUser } from "@/lib/auth/current-user";

export function ThreadView({
  post,
  initialReplies,
  currentUser,
}: {
  post: TimelinePost;
  initialReplies: TimelinePost[];
  currentUser: CurrentUser | null;
}) {
  const [replies, setReplies] = useState(initialReplies);
  const [replyCount, setReplyCount] = useState(post.replyCount);

  function handleReplyPosted(reply: TimelinePost) {
    setReplies((prev) => [...prev, reply]);
    setReplyCount((c) => c + 1);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
      <PostCard post={{ ...post, replyCount }} currentUser={currentUser} linkToThread={false} />
      <div className="border-b border-neutral-800 px-4 py-3 text-xs text-neutral-500">
        {fullDateTime(post.createdAt)}
      </div>

      {currentUser ? (
        <PostComposer
          currentUser={currentUser}
          parentPostId={post.id}
          placeholder="Tuiteá tu respuesta"
          onPosted={handleReplyPosted}
        />
      ) : (
        <div className="border-b border-neutral-800 p-4 text-center text-sm text-neutral-400">
          Iniciá sesión para responder.
        </div>
      )}

      {replies.map((reply) => (
        <PostCard key={reply.id} post={reply} currentUser={currentUser} />
      ))}
    </div>
  );
}

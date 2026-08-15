"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { PostMedia } from "@/components/timeline/PostMedia";
import { LikeButton } from "@/components/timeline/LikeButton";
import { RepostButton } from "@/components/timeline/RepostButton";
import { PostOptionsMenu } from "@/components/timeline/PostOptionsMenu";
import { relativeTime } from "@/lib/timeline/format";
import type { TimelinePost } from "@/lib/timeline/types";
import type { CurrentUser } from "@/lib/auth/current-user";

export function PostCard({
  post,
  currentUser,
  onDeleted,
  linkToThread = true,
}: {
  post: TimelinePost;
  currentUser: CurrentUser | null;
  onDeleted?: (postId: string) => void;
  linkToThread?: boolean;
}) {
  const router = useRouter();
  const displayName = post.author.displayName || post.author.username;

  function goToThread(event: MouseEvent) {
    if (!linkToThread) return;
    const target = event.target as HTMLElement;
    if (target.closest("a,button,video")) return;
    router.push(`/tuits/${post.id}`);
  }

  return (
    <article
      onClick={goToThread}
      className={`flex gap-3 border-b border-neutral-800 p-4 ${linkToThread ? "cursor-pointer hover:bg-neutral-900/50" : ""}`}
    >
      <Link href={`/perfil/${post.author.username}`} onClick={(event) => event.stopPropagation()}>
        <Avatar name={post.author.username} avatarUrl={post.author.avatarUrl} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-baseline gap-1.5">
            <Link
              href={`/perfil/${post.author.username}`}
              onClick={(event) => event.stopPropagation()}
              className="truncate font-semibold text-neutral-100 hover:underline"
            >
              {displayName}
            </Link>
            <span className="shrink-0 truncate text-sm text-neutral-500">@{post.author.username}</span>
            <span className="shrink-0 text-sm text-neutral-500">· {relativeTime(post.createdAt)}</span>
          </div>
          {currentUser && (
            <div onClick={(event) => event.stopPropagation()}>
              <PostOptionsMenu
                postId={post.id}
                authorId={post.author.id}
                authorUsername={post.author.username}
                currentUser={currentUser}
                onDeleted={onDeleted}
              />
            </div>
          )}
        </div>

        {post.content && (
          <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px] text-neutral-100">{post.content}</p>
        )}

        <PostMedia urls={post.mediaUrls} />

        <div className="mt-3 flex max-w-sm items-center justify-between text-neutral-500">
          <Link
            href={`/tuits/${post.id}`}
            onClick={(event) => event.stopPropagation()}
            className="flex items-center gap-1.5 text-xs hover:text-accent-400"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} className="h-[18px] w-[18px]">
              <path
                d="M21 12a8 8 0 0 1-8 8H7l-4 3 .8-4.4A8 8 0 1 1 21 12Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {post.replyCount > 0 && post.replyCount}
          </Link>

          <RepostButton
            postId={post.id}
            initialCount={post.repostCount}
            initialReposted={post.repostedByViewer}
            disabled={!currentUser}
          />

          <LikeButton
            postId={post.id}
            initialCount={post.likeCount}
            initialLiked={post.likedByViewer}
            disabled={!currentUser}
          />
        </div>
      </div>
    </article>
  );
}
